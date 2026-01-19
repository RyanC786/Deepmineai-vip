// Authentication routes for DeepMine AI Platform
import { Hono } from 'hono'
import { onUserRegistered } from '../hooks/email-automation-hooks'
import { setCookie, deleteCookie } from 'hono/cookie'
import * as jose from 'jose'
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateReferralCode,
  generateVerificationCode,
  isValidEmail,
  isValidPassword,
  createJWTPayload,
  sanitizeInput,
  getExpiryDate,
  isExpired
} from '../utils/auth'
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
} from '../utils/email'
import { buildReferralTree } from '../utils/referral'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY: string
}

const auth = new Hono<{ Bindings: Bindings }>()

/**
 * POST /api/auth/register
 * Register new user with email verification
 */
auth.post('/register', async (c) => {
  try {
    const { fullName, email, password, referredByCode } = await c.req.json()
    
    // Validation
    if (!fullName || !email || !password) {
      return c.json({ success: false, message: 'All fields are required' }, 400)
    }
    
    if (!isValidEmail(email)) {
      return c.json({ success: false, message: 'Invalid email format' }, 400)
    }
    
    if (!isValidPassword(password)) {
      return c.json({ 
        success: false, 
        message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' 
      }, 400)
    }
    
    const DB = c.env.DB
    
    // Check if email already exists
    const existing = await DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (existing) {
      return c.json({ success: false, message: 'Email already registered' }, 409)
    }
    
    // Validate referral code if provided
    let referrerId = null
    if (referredByCode) {
      const referrer = await DB.prepare(
        'SELECT id FROM users WHERE referral_code = ?'
      ).bind(referredByCode).first()
      
      if (referrer) {
        referrerId = referrer.id
      }
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Generate referral code and verification token
    const referralCode = generateReferralCode()
    const verificationCode = generateVerificationCode()
    const verificationExpires = getExpiryDate(24) // 24 hours
    
    // Insert user
    const result = await DB.prepare(
      `INSERT INTO users (
        email, password_hash, full_name, referral_code, 
        referred_by, email_verification_token, email_verification_expires
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      email,
      passwordHash,
      sanitizeInput(fullName),
      referralCode,
      referredByCode || null,
      verificationCode,
      verificationExpires
    ).run()
    
    const userId = result.meta.last_row_id
    
    // Build referral tree if referred
    if (referredByCode) {
      try {
        await buildReferralTree(userId as number, referredByCode, DB)
        console.log(`✅ Built referral tree for user ${userId} (referred by ${referredByCode})`)
      } catch (error) {
        console.error('Failed to build referral tree:', error)
        // Don't fail registration if referral tree fails
      }
    }
    
    // Trigger email automation (Segment A: No KYC)
    try {
      await onUserRegistered(c, userId as number, new Date().toISOString())
      console.log(`📧 [AUTOMATION] Segment A triggered for user ${userId}`)
    } catch (error) {
      console.error('Failed to trigger email automation:', error)
      // Don't fail registration if automation fails
    }
    
    // Send verification email
    const resendKey = c.env.RESEND_API_KEY
    if (resendKey) {
      await sendVerificationEmail(email, fullName, verificationCode, resendKey)
    }
    
    return c.json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      userId: userId,
      requiresVerification: true
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ success: false, message: 'Registration failed. Please try again.' }, 500)
  }
})

/**
 * POST /api/auth/verify-email
 * Verify email with code
 */
auth.post('/verify-email', async (c) => {
  try {
    const { email, verificationCode } = await c.req.json()
    
    if (!email || !verificationCode) {
      return c.json({ success: false, message: 'Email and verification code are required' }, 400)
    }
    
    const DB = c.env.DB
    
    // Find user
    const user = await DB.prepare(
      'SELECT id, full_name, email_verification_token, email_verification_expires, email_verified FROM users WHERE email = ?'
    ).bind(email).first() as any
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    if (user.email_verified) {
      return c.json({ success: false, message: 'Email already verified' }, 400)
    }
    
    // Check if code matches
    if (user.email_verification_token !== verificationCode) {
      return c.json({ success: false, message: 'Invalid verification code' }, 400)
    }
    
    // Check if expired
    if (isExpired(user.email_verification_expires)) {
      return c.json({ success: false, message: 'Verification code expired' }, 400)
    }
    
    // Mark as verified
    await DB.prepare(
      'UPDATE users SET email_verified = 1, email_verification_token = NULL WHERE id = ?'
    ).bind(user.id).run()
    
    // Send welcome email
    const resendKey = c.env.RESEND_API_KEY
    if (resendKey) {
      await sendWelcomeEmail(email, user.full_name, resendKey)
    }
    
    return c.json({
      success: true,
      message: 'Email verified successfully! You can now login.'
    })
    
  } catch (error) {
    console.error('Email verification error:', error)
    return c.json({ success: false, message: 'Verification failed. Please try again.' }, 500)
  }
})

/**
 * POST /api/auth/resend-verification
 * Resend verification code
 */
auth.post('/resend-verification', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email) {
      return c.json({ success: false, message: 'Email is required' }, 400)
    }
    
    const DB = c.env.DB
    
    const user = await DB.prepare(
      'SELECT id, full_name, email_verified FROM users WHERE email = ?'
    ).bind(email).first() as any
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    if (user.email_verified) {
      return c.json({ success: false, message: 'Email already verified' }, 400)
    }
    
    // Generate new code
    const verificationCode = generateVerificationCode()
    const verificationExpires = getExpiryDate(24)
    
    await DB.prepare(
      'UPDATE users SET email_verification_token = ?, email_verification_expires = ? WHERE id = ?'
    ).bind(verificationCode, verificationExpires, user.id).run()
    
    // Send email
    const resendKey = c.env.RESEND_API_KEY
    if (resendKey) {
      await sendVerificationEmail(email, user.full_name, verificationCode, resendKey)
    }
    
    return c.json({
      success: true,
      message: 'Verification code sent! Please check your email.'
    })
    
  } catch (error) {
    console.error('Resend verification error:', error)
    return c.json({ success: false, message: 'Failed to resend verification code.' }, 500)
  }
})

/**
 * POST /api/auth/login
 * Login user and create session
 */
auth.post('/login', async (c) => {
  try {
    const { email, password, rememberMe } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ success: false, message: 'Email and password are required' }, 400)
    }
    
    const DB = c.env.DB
    
    // Find user
    const user = await DB.prepare(
      'SELECT id, email, password_hash, full_name, email_verified, account_status, kyc_status FROM users WHERE email = ?'
    ).bind(email).first() as any
    
    if (!user) {
      return c.json({ success: false, message: 'Invalid email or password' }, 401)
    }
    
    // Check account status (allow both 'active' and 'admin' to log in)
    if (user.account_status !== 'active' && user.account_status !== 'admin') {
      return c.json({ success: false, message: 'Account is suspended or inactive' }, 403)
    }
    
    // Verify password
    const passwordValid = await comparePassword(password, user.password_hash)
    if (!passwordValid) {
      return c.json({ success: false, message: 'Invalid email or password' }, 401)
    }
    
    // Check email verification
    if (!user.email_verified) {
      return c.json({ 
        success: false, 
        message: 'Please verify your email before logging in',
        requiresVerification: true
      }, 403)
    }
    
    // Update last login
    await DB.prepare(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(user.id).run()
    
    // Create JWT payload
    const payload = createJWTPayload(user.id, user.email)
    
    // Simple JWT encoding (in production, use proper signing)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payloadEncoded = btoa(JSON.stringify(payload))
    const token = `${header}.${payloadEncoded}.signature`
    
    // Set cookie
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
    
    // Create response with cookie
    const response = c.json({
      success: true,
      message: 'Login successful',
      token: token,  // Include token in response for client-side storage
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name
      },
      kycStatus: user.kyc_status || 'pending',  // Return KYC status for redirect logic
      requiresKyc: !user.kyc_status || user.kyc_status === 'pending' || user.kyc_status === 'rejected'
    })
    
    // Set cookie header manually
    const cookieValue = `auth_token=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`
    response.headers.set('Set-Cookie', cookieValue)
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ success: false, message: 'Login failed. Please try again.' }, 500)
  }
})

/**
 * POST /api/auth/logout
 * Logout user (API endpoint)
 */
auth.post('/logout', async (c) => {
  deleteCookie(c, 'auth_token', { path: '/' })
  deleteCookie(c, 'admin_token', { path: '/' })
  return c.json({ success: true, message: 'Logged out successfully' })
})

/**
 * GET /api/auth/logout
 * Logout user (redirect endpoint)
 */
auth.get('/logout', async (c) => {
  deleteCookie(c, 'auth_token', { path: '/' })
  deleteCookie(c, 'admin_token', { path: '/' })
  return c.redirect('/login')
})

/**
 * POST /api/auth/admin-login
 * Admin login
 */
auth.post('/admin-login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    if (!username || !password) {
      return c.json({ success: false, message: 'Username and password are required' }, 400)
    }
    
    // Hardcoded admin credentials for now
    // In production, store in environment variables or database with hashed passwords
    const ADMIN_USERNAME = 'admin'
    const ADMIN_PASSWORD = 'DeepMineAdmin2024!'
    
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return c.json({ success: false, message: 'Invalid admin credentials' }, 401)
    }
    
    // Create admin JWT token
    const JWT_SECRET = c.env.JWT_SECRET
    const token = await new jose.SignJWT({ 
      admin_id: 1,
      admin_username: username,
      role: 'admin'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(JWT_SECRET))
    
    // Set admin_token cookie
    // Note: httpOnly prevents JavaScript access but is more secure
    // For debugging, we temporarily set httpOnly: false
    setCookie(c, 'admin_token', token, {
      path: '/',
      httpOnly: false, // Temporarily false for debugging
      secure: true,
      sameSite: 'Lax',
      maxAge: 86400 // 24 hours
    })
    
    console.log('✅ Admin token cookie set for user:', username)
    
    return c.json({ 
      success: true, 
      message: 'Admin login successful',
      redirect: '/admin/dashboard'
    })
    
  } catch (error) {
    console.error('Admin login error:', error)
    return c.json({ success: false, message: 'Admin login failed. Please try again.' }, 500)
  }
})

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
auth.post('/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email) {
      return c.json({ success: false, message: 'Email is required' }, 400)
    }
    
    const DB = c.env.DB
    
    const user = await DB.prepare(
      'SELECT id, full_name FROM users WHERE email = ?'
    ).bind(email).first() as any
    
    if (!user) {
      // Don't reveal if email exists
      return c.json({ 
        success: true, 
        message: 'If the email exists, a reset link has been sent.' 
      })
    }
    
    // Generate reset token
    const resetToken = generateToken()
    const resetExpires = getExpiryDate(1) // 1 hour
    
    await DB.prepare(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?'
    ).bind(resetToken, resetExpires, user.id).run()
    
    // Send reset email
    const resendKey = c.env.RESEND_API_KEY
    if (resendKey) {
      await sendPasswordResetEmail(email, user.full_name, resetToken, resendKey)
    }
    
    return c.json({
      success: true,
      message: 'Password reset link sent! Please check your email.'
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return c.json({ success: false, message: 'Failed to process request.' }, 500)
  }
})

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
auth.post('/reset-password', async (c) => {
  try {
    const { token, newPassword } = await c.req.json()
    
    if (!token || !newPassword) {
      return c.json({ success: false, message: 'Token and new password are required' }, 400)
    }
    
    if (!isValidPassword(newPassword)) {
      return c.json({ 
        success: false, 
        message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' 
      }, 400)
    }
    
    const DB = c.env.DB
    
    const user = await DB.prepare(
      'SELECT id, password_reset_token, password_reset_expires FROM users WHERE password_reset_token = ?'
    ).bind(token).first() as any
    
    if (!user) {
      return c.json({ success: false, message: 'Invalid or expired reset token' }, 400)
    }
    
    if (isExpired(user.password_reset_expires)) {
      return c.json({ success: false, message: 'Reset token has expired' }, 400)
    }
    
    // Hash new password
    const passwordHash = await hashPassword(newPassword)
    
    await DB.prepare(
      'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?'
    ).bind(passwordHash, user.id).run()
    
    return c.json({
      success: true,
      message: 'Password reset successfully! You can now login with your new password.'
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    return c.json({ success: false, message: 'Failed to reset password.' }, 500)
  }
})

/**
 * GET /api/auth/me
 * Get current user info (requires auth)
 */
auth.get('/me', async (c) => {
  try {
    // Get token from cookie
    const { getCookie } = await import('hono/cookie')
    const token = getCookie(c, 'auth_token')
    
    console.log('Auth check - Token present:', !!token)
    
    if (!token) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }
    
    // Parse JWT manually (simple base64 decode)
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        return c.json({ success: false, message: 'Invalid token format' }, 401)
      }
      
      const payload = JSON.parse(atob(parts[1]))
      console.log('Token payload:', payload)
      
      const userId = payload.sub
      
      if (!userId) {
        return c.json({ success: false, message: 'Invalid token payload' }, 401)
      }
    
    // Set userId in context for compatibility
    c.set('userId', userId)
    
    const DB = c.env.DB
    
    const user = await DB.prepare(
      `SELECT id, email, full_name, phone, country, referral_code, 
              kyc_status, account_status, wallet_balance, total_invested,
              total_earned, total_withdrawn, total_referral_earnings,
              email_verified, created_at, balance
       FROM users WHERE id = ?`
    ).bind(userId).first() as any
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    return c.json({
      success: true,
      user: user
    })
    
    } catch (tokenError) {
      console.error('Token parsing error:', tokenError)
      return c.json({ success: false, message: 'Invalid token' }, 401)
    }
    
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ success: false, message: 'Failed to get user info.' }, 500)
  }
})

export default auth
