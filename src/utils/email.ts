// Email service using Resend
// Note: Resend API key should be set in environment variables

/**
 * Send email using Resend API
 */
async function sendEmail(to: string, subject: string, html: string, apiKey: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'DeepMine AI <noreply@deepmineai.vip>',
        to: [to],
        subject: subject,
        html: html
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      throw new Error(`Failed to send email: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, name: string, apiKey: string) {
  const subject = 'Welcome to DeepMine AI'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2979FF 0%, #7B61FF 100%); padding: 40px 20px; text-align: center; }
            .header img { height: 60px; }
            .header h1 { color: #ffffff; margin: 20px 0 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .content h2 { color: #0B0F1E; font-size: 24px; margin-top: 0; }
            .content p { color: #555; line-height: 1.6; font-size: 16px; }
            .button { display: inline-block; background: #2979FF; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
            .footer a { color: #2979FF; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🐉 Welcome to DeepMine AI</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Thank you for joining DeepMine AI, the future of AI-powered cryptocurrency mining.</p>
                <p>We're excited to have you onboard. Your account has been successfully created.</p>
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Complete your KYC verification</li>
                    <li>Browse our mining packages</li>
                    <li>Start earning daily returns</li>
                </ul>
                <a href="https://www.deepmineai.vip/dashboard" class="button">Go to Dashboard</a>
                <p>If you have any questions, our support team is here to help.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
                <p><a href="https://www.deepmineai.vip">www.deepmineai.vip</a></p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(email, subject, html, apiKey)
}

/**
 * Send email verification code
 */
export async function sendVerificationEmail(email: string, name: string, verificationCode: string, apiKey: string) {
  const verificationUrl = `https://www.deepmineai.vip/verify-email?email=${encodeURIComponent(email)}`
  const subject = 'Verify Your Email - DeepMine AI'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2979FF 0%, #7B61FF 100%); padding: 40px 20px; text-align: center; color: white; }
            .content { padding: 40px 30px; text-align: center; }
            .code-box { background: #f8f9fa; border: 2px dashed #2979FF; border-radius: 12px; padding: 30px; margin: 30px 0; }
            .code { font-size: 36px; font-weight: 800; color: #2979FF; letter-spacing: 8px; }
            .button { display: inline-block; background: #2979FF; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Email Verification</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>Please use the verification code below to verify your email address:</p>
                <div class="code-box">
                    <div class="code">${verificationCode}</div>
                </div>
                <p>Click the button below to go to the verification page:</p>
                <a href="${verificationUrl}" class="button">Go to Verification Page</a>
                <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
                <p style="color: #2979FF; word-break: break-all; font-size: 14px;">${verificationUrl}</p>
                <p style="margin-top: 30px;"><small>This code will expire in 24 hours.</small></p>
                <p><small>If you didn't request this verification, please ignore this email.</small></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(email, subject, html, apiKey)
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, name: string, resetToken: string, apiKey: string) {
  const resetUrl = `https://www.deepmineai.vip/reset-password?token=${resetToken}`
  const subject = 'Reset Your Password - DeepMine AI'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2979FF 0%, #7B61FF 100%); padding: 40px 20px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: #2979FF; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔑 Password Reset</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>You requested to reset your password for your DeepMine AI account.</p>
                <p>Click the button below to create a new password:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p><small>If you didn't request this reset, please ignore this email and your password will remain unchanged.</small></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(email, subject, html, apiKey)
}

/**
 * Send withdrawal confirmation email
 */
export async function sendWithdrawalConfirmationEmail(
  email: string, 
  name: string, 
  amount: number, 
  withdrawalNumber: string,
  apiKey: string
) {
  const subject = 'Withdrawal Request Received - DeepMine AI'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2979FF 0%, #7B61FF 100%); padding: 40px 20px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .info-box { background: #f8f9fa; border-left: 4px solid #2979FF; padding: 20px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💳 Withdrawal Request</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>We've received your withdrawal request and it's being processed.</p>
                <div class="info-box">
                    <p><strong>Withdrawal Number:</strong> ${withdrawalNumber}</p>
                    <p><strong>Amount:</strong> ${amount} USDT</p>
                    <p><strong>Status:</strong> Pending Admin Approval</p>
                </div>
                <p>Your withdrawal will be processed within 24-48 hours. You'll receive another email once it's been approved and sent.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(email, subject, html, apiKey)
}

/**
 * Send KYC approved welcome email
 */
export async function sendKYCApprovedEmail(
  email: string,
  name: string,
  apiKey: string
) {
  const subject = '🎉 Welcome to DeepMine AI - Your Account is Approved!'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2979FF 0%, #7B61FF 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .content h2 { color: #0B0F1E; font-size: 22px; margin-top: 30px; }
            .content p { color: #555; line-height: 1.6; font-size: 16px; }
            .step { background: #f8f9fa; border-left: 4px solid #2979FF; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .step h3 { color: #2979FF; margin-top: 0; font-size: 18px; }
            .step ul { margin: 10px 0; padding-left: 20px; }
            .step li { margin: 8px 0; color: #555; }
            .wallet-box { background: #f0f7ff; border: 2px solid #2979FF; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center; }
            .wallet-address { font-family: 'Courier New', monospace; font-size: 14px; color: #2979FF; word-break: break-all; font-weight: 600; }
            .button { display: inline-block; background: #2979FF; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 8px; }
            .warning strong { color: #856404; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
            .footer a { color: #2979FF; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to DeepMine AI!</h1>
            </div>
            <div class="content">
                <h2>Congratulations ${name}!</h2>
                <p>Your account has been approved! We are excited to have you as part of the DeepMine AI family.</p>
                <p>You can now access all features of your dashboard and start your mining journey.</p>
                
                <h2>📖 How to Purchase Your First Mining Machine</h2>
                
                <div class="step">
                    <h3>Step 1 — Deposit Funds</h3>
                    <ul>
                        <li>Go to <strong>Dashboard → Deposit Funds</strong></li>
                        <li>Copy our business ETH wallet address:</li>
                    </ul>
                    <div class="wallet-box">
                        <div class="wallet-address">0x66a5957bdfa1371a651d5d932d03b8710cccd742</div>
                    </div>
                    <ul>
                        <li>Send <strong>ETH only</strong> from your personal wallet</li>
                        <li>Upload screenshot and transaction hash (TXID)</li>
                    </ul>
                </div>

                <div class="step">
                    <h3>Step 2 — Wait for Confirmation</h3>
                    <ul>
                        <li>Admin verifies your payment (usually within 24 hours)</li>
                        <li>You receive email confirmation</li>
                        <li>Your dashboard updates with available balance</li>
                    </ul>
                </div>

                <div class="step">
                    <h3>Step 3 — Purchase a Mining Machine</h3>
                    <ul>
                        <li>Navigate to <strong>Dashboard → Machines</strong></li>
                        <li>Select a machine tier ($500 - $50,000 USDT)</li>
                        <li>Click <strong>"Purchase Machine"</strong></li>
                        <li>System notifies admin</li>
                    </ul>
                </div>

                <div class="step">
                    <h3>Step 4 — Machine Activation</h3>
                    <ul>
                        <li>Admin activates your machine</li>
                        <li>You receive confirmation notification</li>
                        <li>Machine goes live and starts earning!</li>
                    </ul>
                </div>

                <div class="warning">
                    <strong>⚠️ Important Rules:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Deposits must be in ETH only</strong></li>
                        <li><strong>Minimum withdrawal: $100 USDT (ERC-20)</strong></li>
                        <li><strong>You can own only ONE unit per machine tier</strong></li>
                        <li><strong>Withdrawals must use the same wallet as your first deposit</strong></li>
                    </ul>
                </div>

                <div style="background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <h3 style="color: #0369a1; margin-top: 0; font-size: 18px;">💡 Need Help?</h3>
                    <p style="margin: 10px 0;">If you have any questions or encounter any problems, use the <strong>AI Assistant</strong> on your dashboard!</p>
                    <p style="margin: 10px 0;">The AI Assistant can help you with:</p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Making deposits and purchasing machines</li>
                        <li>Understanding your earnings</li>
                        <li>Withdrawal instructions</li>
                        <li>General account questions</li>
                    </ul>
                    <p style="margin: 10px 0;"><strong>Just click the blue robot icon in the bottom-right corner of your dashboard!</strong></p>
                </div>

                <a href="https://www.deepmineai.vip/dashboard" class="button">Go to Dashboard</a>

                <p style="margin-top: 30px;">You can also email us at <a href="mailto:support@deepmineai.vip">support@deepmineai.vip</a></p>
            </div>
            <div class="footer">
                <p><strong>Best regards,</strong><br>DeepMine AI Team</p>
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
                <p><a href="https://www.deepmineai.vip">www.deepmineai.vip</a></p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(email, subject, html, apiKey)
}

/**
 * Send contract purchased email
 */
export async function sendContractPurchasedEmail(
  email: string,
  name: string,
  contractNumber: string,
  packageName: string,
  amount: number,
  dailyReturn: number,
  duration: number,
  apiKey: string
) {
  const subject = 'Mining Contract Activated - DeepMine AI'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2979FF 0%, #7B61FF 100%); padding: 40px 20px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .info-box { background: #f8f9fa; border-left: 4px solid #2979FF; padding: 20px; margin: 20px 0; }
            .button { display: inline-block; background: #2979FF; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Contract Activated!</h1>
            </div>
            <div class="content">
                <h2>Congratulations ${name}!</h2>
                <p>Your mining contract has been successfully activated and will start earning immediately.</p>
                <div class="info-box">
                    <p><strong>Contract Number:</strong> ${contractNumber}</p>
                    <p><strong>Package:</strong> ${packageName}</p>
                    <p><strong>Investment:</strong> ${amount} USDT</p>
                    <p><strong>Daily Return:</strong> $${dailyReturn} USDT</p>
                    <p><strong>Duration:</strong> ${duration} days</p>
                    <p><strong>Total Expected:</strong> $${(dailyReturn * duration).toFixed(2)} USDT</p>
                </div>
                <p>Your daily earnings will be credited to your account automatically.</p>
                <a href="https://www.deepmineai.vip/dashboard/contracts" class="button">View My Contracts</a>
            </div>
            <div class="footer">
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(email, subject, html, apiKey)
}

/**
 * Send welcome email to new staff member with login credentials
 */
export async function sendStaffWelcomeEmail(
  email: string,
  fullName: string,
  username: string,
  password: string,
  role: string,
  permissions: string[],
  apiKey: string
) {
  const loginUrl = 'https://www.deepmineai.vip/admin/crm/login'
  const subject = 'Welcome to DeepMine AI Team - Your CRM Access'
  
  const permissionsList = permissions.length > 0 
    ? permissions.map(p => `<li>${p}</li>`).join('') 
    : '<li>Please contact your administrator for permissions</li>'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 20px 0 0; font-size: 28px; }
            .header p { color: #d1fae5; margin: 10px 0 0; font-size: 16px; }
            .content { padding: 40px 30px; }
            .content h2 { color: #0B0F1E; font-size: 24px; margin-top: 0; }
            .content p { color: #555; line-height: 1.6; font-size: 16px; }
            .credentials-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 24px; margin: 24px 0; }
            .credentials-box h3 { color: #059669; margin-top: 0; font-size: 18px; }
            .credential-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #d1fae5; }
            .credential-row:last-child { border-bottom: none; }
            .credential-label { color: #6b7280; font-weight: 600; }
            .credential-value { color: #0B0F1E; font-weight: 700; font-family: monospace; background: #ffffff; padding: 4px 12px; border-radius: 4px; }
            .permissions-box { background: #eff6ff; border-left: 4px solid #2979FF; padding: 20px; margin: 24px 0; border-radius: 8px; }
            .permissions-box h3 { color: #1e40af; margin-top: 0; font-size: 16px; }
            .permissions-box ul { margin: 12px 0; padding-left: 24px; }
            .permissions-box li { color: #374151; padding: 4px 0; }
            .button { display: inline-block; background: #10b981; color: #ffffff; padding: 16px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; font-size: 16px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3); }
            .button:hover { background: #059669; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px; }
            .warning p { color: #92400e; margin: 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
            .footer a { color: #10b981; text-decoration: none; }
            .security-note { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0; }
            .security-note p { color: #991b1b; margin: 0; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🐉 Welcome to DeepMine AI Team!</h1>
                <p>Your CRM Account Has Been Created</p>
            </div>
            <div class="content">
                <h2>Hello ${fullName}!</h2>
                <p>Welcome to the DeepMine AI team! We're excited to have you onboard. An admin has created your staff account with access to our CRM system.</p>
                
                <div class="credentials-box">
                    <h3>🔐 Your Login Credentials</h3>
                    <div class="credential-row">
                        <span class="credential-label">Username:</span>
                        <span class="credential-value">${username}</span>
                    </div>
                    <div class="credential-row">
                        <span class="credential-label">Email:</span>
                        <span class="credential-value">${email}</span>
                    </div>
                    <div class="credential-row">
                        <span class="credential-label">Temporary Password:</span>
                        <span class="credential-value">${password}</span>
                    </div>
                    <div class="credential-row">
                        <span class="credential-label">Role:</span>
                        <span class="credential-value">${role}</span>
                    </div>
                </div>

                <div class="warning">
                    <p><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
                </div>

                <div class="permissions-box">
                    <h3>📋 Your Access Permissions</h3>
                    <p>You have been granted access to the following areas:</p>
                    <ul>
                        ${permissionsList}
                    </ul>
                </div>

                <div style="text-align: center;">
                    <a href="${loginUrl}" class="button">Login to CRM Dashboard</a>
                </div>

                <div class="security-note">
                    <p><strong>🔒 Security Reminder:</strong> Never share your login credentials with anyone. Our team will never ask for your password.</p>
                </div>

                <p><strong>Need Help?</strong></p>
                <p>If you have any questions or need assistance, please contact your administrator or our support team.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
                <p><a href="https://www.deepmineai.vip">www.deepmineai.vip</a></p>
                <p style="margin-top: 16px; color: #6b7280; font-size: 12px;">
                    This email contains sensitive information. Please keep it confidential.
                </p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(email, subject, html, apiKey)
}

/**
 * Send partner contract completion notification
 */
export async function sendPartnerContractCompletionEmail(
  partnerEmail: string,
  contractCount: number,
  totalResidual: number,
  contracts: any[],
  apiKey: string
) {
  const subject = `💰 ${contractCount} Mining Contracts Completed - $${totalResidual.toFixed(2)} Residual Available`
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
            .header p { margin: 10px 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .content h2 { color: #1F2937; margin: 0 0 20px; font-size: 24px; }
            .content p { color: #4B5563; line-height: 1.6; margin: 0 0 15px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 30px 0; }
            .stat-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; text-align: center; }
            .stat-label { color: #6B7280; font-size: 14px; margin-bottom: 8px; }
            .stat-value { color: #1F2937; font-size: 28px; font-weight: 700; }
            .contract-list { margin: 30px 0; }
            .contract-item { background: #F9FAFB; border-left: 4px solid #10B981; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
            .contract-item strong { color: #1F2937; display: block; margin-bottom: 5px; }
            .contract-item span { color: #6B7280; font-size: 14px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; }
            .footer { background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💰 Contracts Completed!</h1>
                <p>Your Partner Residuals Are Ready</p>
            </div>
            <div class="content">
                <h2>Great News!</h2>
                <p>
                    ${contractCount} mining contract${contractCount > 1 ? 's have' : ' has'} completed their 180-day period and ${contractCount > 1 ? 'are' : 'is'} now ready for payout processing.
                </p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Contracts Completed</div>
                        <div class="stat-value">${contractCount}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Residual (2%)</div>
                        <div class="stat-value">$${totalResidual.toFixed(2)}</div>
                    </div>
                </div>
                
                <h3 style="color: #1F2937; margin-top: 30px;">📦 Completed Contracts:</h3>
                <div class="contract-list">
                    ${contracts.map(contract => `
                        <div class="contract-item">
                            <strong>${contract.package_name}</strong>
                            <span>User: ${contract.user_email} | Investment: $${contract.investment} | Your Residual: $${contract.residual_amount.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center;">
                    <a href="https://www.deepmineai.vip/partner/dashboard" class="cta-button">
                        View Partner Dashboard →
                    </a>
                </div>
                
                <p style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #E5E7EB;">
                    <strong>Next Steps:</strong><br>
                    1. Login to your Partner Dashboard<br>
                    2. Review the completed contracts<br>
                    3. Click "Mark as Paid" after processing payment<br>
                    4. Download reports for your records
                </p>
            </div>
            <div class="footer">
                <p>
                    <strong>DeepMine AI Partner Portal</strong><br>
                    Tracking ${contractCount} completed contract${contractCount > 1 ? 's' : ''} ready for payout<br>
                    © 2025 DeepMine AI. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return sendEmail(partnerEmail, subject, html, apiKey)
}
