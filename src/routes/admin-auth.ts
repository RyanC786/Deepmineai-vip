// Admin Authentication Routes
import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import type { D1Database } from '@cloudflare/workers-types'
import { comparePassword, hashPassword } from '../utils/auth'

type Bindings = {
  DB: D1Database
}

const adminAuth = new Hono<{ Bindings: Bindings }>()

/**
 * POST /api/admin/auth/login
 * Admin login endpoint
 */
adminAuth.post('/login', async (c) => {
  const { env } = c
  const body = await c.req.json()
  
  // Accept either 'email' or 'username' field
  const loginIdentifier = body.email || body.username
  const password = body.password

  if (!loginIdentifier || !password) {
    return c.json({ success: false, message: 'Username/Email and password are required' }, 400)
  }

  try {
    // First, try to fetch from users table (for Super Admins)
    let result = await env.DB.prepare(`
      SELECT 
        u.id, 
        u.email, 
        u.password_hash, 
        u.full_name, 
        u.account_status,
        1 as role_id,
        'super_admin' as role_name,
        'Super Administrator' as role_display_name,
        '["all"]' as permissions
      FROM users u
      WHERE u.email = ? AND u.account_status = 'admin'
    `).bind(loginIdentifier).first<{
      id: number
      email: string
      password_hash: string
      full_name: string
      account_status: string
      role_id: number
      role_name: string
      role_display_name: string
      permissions: string
    }>()

    // If not found in users table, try admin_users table (for CRM staff)
    // Check by email OR username
    if (!result) {
      result = await env.DB.prepare(`
        SELECT 
          au.id, 
          au.email, 
          au.password_hash, 
          au.full_name, 
          'admin' as account_status,
          COALESCE(au.role_id, 1) as role_id,
          COALESCE(sr.name, 'super_admin') as role_name,
          COALESCE(sr.display_name, 'Super Administrator') as role_display_name,
          COALESCE(sr.permissions, '["all"]') as permissions
        FROM admin_users au
        LEFT JOIN staff_roles sr ON sr.id = au.role_id
        WHERE (au.email = ? OR au.username = ?) AND au.is_active = 1
      `).bind(loginIdentifier, loginIdentifier).first<{
        id: number
        email: string
        password_hash: string
        full_name: string
        account_status: string
        role_id: number
        role_name: string
        role_display_name: string
        permissions: string
      }>()
    }

    if (!result) {
      return c.json({ success: false, message: 'Invalid admin credentials' }, 401)
    }

    // Verify password using bcrypt
    const validPassword = await comparePassword(password, result.password_hash)

    if (!validPassword) {
      return c.json({ success: false, message: 'Invalid admin credentials' }, 401)
    }

    // Parse permissions JSON
    let permissions: string[] = []
    try {
      permissions = JSON.parse(result.permissions)
    } catch {
      permissions = ['all'] // Default for super admin
    }

    // Create admin JWT token (simplified for Cloudflare Workers)
    const payload = {
      admin_id: result.id,
      email: result.email,
      full_name: result.full_name,
      account_status: result.account_status,
      role_id: result.role_id,
      role_name: result.role_name,
      role_display_name: result.role_display_name,
      permissions: permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }

    // Simple JWT creation (base64 encoded)
    const token = btoa(JSON.stringify(payload))

    // Set admin cookie
    // Note: httpOnly should be false for debugging, secure should match the protocol
    // Using secure: false temporarily for debugging cookie issues
    setCookie(c, 'admin_token', token, {
      httpOnly: false, // For debugging - allows JS to access cookie
      secure: false,   // Temporarily disabled for debugging
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      domain: undefined // Let browser set domain automatically
    })
    
    console.log('[ADMIN-AUTH] ✅ Cookie set successfully!')
    console.log('[ADMIN-AUTH] Token preview:', token.substring(0, 30) + '...')
    console.log('[ADMIN-AUTH] User:', result.full_name, '(' + result.email + ')')
    console.log('[ADMIN-AUTH] Role:', result.role_name)

    // Update last login
    await env.DB.prepare(`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(result.id).run()

    return c.json({
      success: true,
      message: 'Admin login successful',
      token: token, // Include token in response for debugging
      admin: {
        id: result.id,
        email: result.email,
        full_name: result.full_name,
        role_name: result.role_name,
        role_display_name: result.role_display_name,
        permissions: permissions
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    return c.json({ success: false, message: errorMessage }, 500)
  }
})

/**
 * POST /api/admin/auth/logout
 * Admin logout endpoint
 */
adminAuth.post('/logout', async (c) => {
  deleteCookie(c, 'admin_token', { path: '/' })
  return c.json({ success: true, message: 'Logged out successfully' })
})

/**
 * GET /api/admin/auth/me
 * Get current admin user info
 */
adminAuth.get('/me', async (c) => {
  const { env } = c
  
  // Get token from cookie
  const { getCookie } = await import('hono/cookie')
  const adminToken = getCookie(c, 'admin_token')
  
  if (!adminToken) {
    return c.json({ success: false, message: 'Not authenticated' }, 401)
  }
  
  try {
    // Parse token
    const payload = JSON.parse(atob(adminToken))
    
    if (!payload || !payload.admin_id) {
      return c.json({ success: false, message: 'Invalid token' }, 401)
    }
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return c.json({ success: false, message: 'Token expired' }, 401)
    }
    
    // Fetch admin from users table first (super admins)
    let admin = await env.DB.prepare(`
      SELECT id, email, full_name, account_status, created_at
      FROM users
      WHERE id = ? AND account_status = 'admin'
    `).bind(payload.admin_id).first()

    // If not found, check admin_users table (CRM staff)
    if (!admin) {
      admin = await env.DB.prepare(`
        SELECT 
          au.id, 
          au.email, 
          au.full_name, 
          au.role as account_status,
          au.role,
          au.role_id,
          sr.name as role_name,
          sr.display_name as role_display_name,
          au.created_at
        FROM admin_users au
        LEFT JOIN staff_roles sr ON au.role_id = sr.id
        WHERE au.id = ? AND au.is_active = 1
      `).bind(payload.admin_id).first()
    } else {
      // For super admins from users table, add role info
      admin = {
        ...admin,
        role: 'super_admin',
        role_name: 'super_admin',
        role_display_name: 'Super Admin'
      }
    }

    if (!admin) {
      return c.json({ success: false, message: 'Admin not found' }, 404)
    }

    return c.json({ success: true, admin })
  } catch (error) {
    console.error('Get admin error:', error)
    return c.json({ success: false, message: 'Failed to get admin info' }, 500)
  }
})

/**
 * POST /api/admin/change-password
 * Change password for super admin
 */
adminAuth.post('/change-password', async (c) => {
  const { env } = c
  
  // Get token from cookie
  const { getCookie } = await import('hono/cookie')
  const adminToken = getCookie(c, 'admin_token')
  
  if (!adminToken) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  try {
    // Parse token
    const payload = JSON.parse(atob(adminToken))
    
    if (!payload || !payload.admin_id) {
      return c.json({ error: 'Invalid token' }, 401)
    }
    
    // Get request body
    const body = await c.req.json()
    const { currentPassword, newPassword } = body
    
    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current and new passwords are required' }, 400)
    }
    
    if (newPassword.length < 8) {
      return c.json({ error: 'New password must be at least 8 characters long' }, 400)
    }
    
    // Fetch admin from users table (super admins)
    const admin = await env.DB.prepare(`
      SELECT id, email, password_hash
      FROM users
      WHERE id = ? AND account_status = 'admin'
    `).bind(payload.admin_id).first<{
      id: number
      email: string
      password_hash: string
    }>()
    
    if (!admin) {
      return c.json({ error: 'Admin not found' }, 404)
    }
    
    // Verify current password
    const validPassword = await comparePassword(currentPassword, admin.password_hash)
    
    if (!validPassword) {
      return c.json({ error: 'Current password is incorrect' }, 401)
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)
    
    // Update password
    await env.DB.prepare(`
      UPDATE users 
      SET password_hash = ?
      WHERE id = ?
    `).bind(newPasswordHash, admin.id).run()
    
    return c.json({ 
      success: true, 
      message: 'Password changed successfully' 
    })
  } catch (error) {
    console.error('Change password error:', error)
    return c.json({ error: 'Failed to change password' }, 500)
  }
})

export default adminAuth
