import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import auth from './routes/auth'
import kyc from './routes/kyc'
import kycAutoSync from './routes/kyc-auto-sync'
import mining from './routes/mining'
import referral from './routes/referral'
import admin from './routes/admin'
import deposits from './routes/deposits'
import machines from './routes/machines'
import adminMachines from './routes/admin-machines'
import earnings from './routes/earnings'
import withdrawals from './routes/withdrawals'
import adminWithdrawals from './routes/admin-withdrawals'
import adminAuth from './routes/admin-auth'
import dailyBonus from './routes/daily-bonus'
import debug from './routes/debug'
import crm from './routes/crm'
import staff from './routes/staff'
import notes from './routes/notes'
import activityLogs from './routes/activity-logs'
import tasks from './routes/tasks'
import tickets from './routes/tickets'
import partner from './routes/partner'
// Leads moved to Go High Level
// import leads from './routes/leads'
// import testLeads from './routes/test-leads'
import referrals from './routes/referrals'
import emailCron from './routes/email-cron'
import { requireAuth, requireAdmin, requireSuperAdmin, requireCRMAccess } from './middleware/auth'
import { registerPageHTML } from './pages/register.html'
import { preRegisterPageHTML } from './pages/pre-register.html'
import { loginPageHTML } from './pages/login.html'
import { adminLoginV4PageHTML } from './pages/admin-login-v4.html'
import { adminPanelLoginPageHTML } from './pages/admin-panel-login.html'
import { verifyEmailPageHTML } from './pages/verify-email.html'
import { forgotPasswordPageHTML } from './pages/forgot-password.html'
import { resetPasswordPageHTML } from './pages/reset-password.html'
import { kycPageHTML } from './pages/kyc.html'
import { dashboardPageHTML } from './pages/dashboard.html'
import { faqPageHTML } from './pages/faq.html'
import { depositPageHTML } from './pages/deposit.html'
import { withdrawPageHTML } from './pages/withdraw.html'
import { machinesPageHTML } from './pages/machines.html'
import { installIOSPageHTML } from './pages/install-ios.html'
import { adminKYCPageHTML } from './pages/admin-kyc.html'
import { adminDashboardHTML } from './pages/admin-dashboard.html'
import { adminDashboardV2HTML } from './pages/admin-dashboard-v2.html'
import { adminDashboardSimpleHTML } from './pages/admin-dashboard-simple.html'
import { adminMachinesPageHTML } from './pages/admin-machines.html'
import { adminWithdrawalsPageHTML } from './pages/admin-withdrawals.html'
import { adminDepositsPageHTML } from './pages/admin-deposits.html'
import { adminReportsPageHTML } from './pages/admin-reports.html'
import { adminCRMDashboardHTML } from './pages/admin-crm-dashboard.html'
import { adminStaffManagementHTML } from './pages/admin-staff-management.html'
import { adminStaffProfileHTML } from './pages/admin-staff-profile.html'
import { adminProfileHTML } from './pages/admin-profile.html'
import { adminSettingsHTML } from './pages/admin-settings.html'
import { adminActivityLogsHTML } from './pages/admin-activity-logs.html'
import { adminTaskBoardHTML } from './pages/admin-task-board.html'
import { adminTicketsHTML } from './pages/admin-tickets.html'
import { adminCRMLoginHTML } from './pages/admin-crm-login.html'
// Leads moved to Go High Level
// import { adminLeadsManagementHTML } from './pages/admin-leads-management.html'
import { referralsPageHTML } from './pages/referrals-page.html'
import { adminReferralsHTML } from './pages/admin-referrals.html'
import { adminActivityFullHTML } from './pages/admin-activity-full.html'
import { adminUsersHTML } from './pages/admin-users.html'
import { partnerLoginHTML } from './pages/partner-login.html'
import { partnerDashboardHTML } from './pages/partner-dashboard.html'

type Bindings = {
  DB: D1Database
  KYC_BUCKET: R2Bucket
  RESEND_API_KEY: string
  JWT_SECRET: string
  IDENFY_API_KEY: string
  IDENFY_API_SECRET: string
  CRON_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// ========================================
// MAINTENANCE MODE - Set to true to enable
// ========================================
const MAINTENANCE_MODE = false

// Enable CORS with credentials support
// CRITICAL: When credentials: true, must specify exact origins (not wildcard)
app.use('/api/*', cors({
  origin: (origin) => {
    // Allow both production and preview deployments
    const allowedOrigins = [
      'https://www.deepmineai.vip',
      'https://deepmine-ai.pages.dev'
    ]
    // Allow any *.deepmine-ai.pages.dev preview URL
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.deepmine-ai.pages.dev'))) {
      return origin
    }
    // For same-origin requests (no Origin header), allow them
    return origin || 'https://www.deepmineai.vip'
  },
  credentials: true, // CRITICAL: Allow cookies to be sent
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Set-Cookie']
}))

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Serve trigger_earnings.html directly
app.get('/trigger_earnings.html', serveStatic({ path: './trigger_earnings.html' }))

// Mount authentication routes
app.route('/api/auth', auth)

// Mount debug routes (for testing only)
app.route('/api/debug', debug)

// Mount KYC routes
app.route('/api/kyc', kyc)

// Mount KYC Auto-Sync routes (public endpoint for cron)
app.route('/api/kyc', kycAutoSync)

// Mount deposits routes
// Note: Auth middleware is applied inside the deposits subrouter (see src/routes/deposits.ts)
app.route('/api/deposits', deposits)

// Mount withdrawals routes (requires auth)
app.use('/api/withdrawals/*', requireAuth)
app.route('/api/withdrawals', withdrawals)

// Mount machines routes (requires auth)
app.use('/api/machines/*', requireAuth)
app.route('/api/machines', machines)

// Mount mining routes (requires auth)
app.use('/api/mining/*', requireAuth)
app.route('/api/mining', mining)

// Mount referral routes (requires auth)
app.use('/api/referral/*', requireAuth)
app.route('/api/referral', referral)

// Mount referrals management routes (new - VIP commission system)
// Admin endpoints require CRM access (must come BEFORE user auth)
app.use('/api/referrals/admin/*', requireCRMAccess)
// User endpoints require auth (excludes /admin/* routes)
app.use('/api/referrals/*', async (c, next) => {
  // Skip auth for admin routes (already handled above)
  if (c.req.path.startsWith('/api/referrals/admin/')) {
    return next()
  }
  return requireAuth(c, next)
})
app.route('/api/referrals', referrals)

// Mount daily bonus routes (requires auth)
app.use('/api/daily-bonus/*', requireAuth)
app.route('/api/daily-bonus', dailyBonus)

// Mount admin auth BEFORE middleware (public login endpoint)
app.route('/api/admin/auth', adminAuth)

// Mount partner routes BEFORE middleware (includes public login endpoint)
app.route('/api/partner', partner)

// ========================================
// ROLE-BASED ACCESS CONTROL
// ========================================
// Super Admin routes (financial/sensitive data) - BLOCKS CRM staff
app.use('/api/admin/*', requireSuperAdmin)
app.route('/api/admin', admin)
app.route('/api/admin/machines', adminMachines)
app.route('/api/admin/earnings', earnings)
app.route('/api/admin/withdrawals', adminWithdrawals)

// CRM routes (allows Super Admin + CRM staff)
app.use('/api/crm/*', requireCRMAccess)
app.route('/api/crm', crm)
app.route('/api/crm/staff', staff)
app.route('/api/crm/notes', notes)
app.route('/api/crm/activity-logs', activityLogs)
app.route('/api/crm/tasks', tasks)
app.route('/api/crm/tickets', tickets)
// Public tickets endpoint (for users/AI assistant - no auth required)
app.route('/api/tickets', tickets)
// Leads API moved to Go High Level
// app.route('/api/crm/leads', leads)
// app.route('/api/test-leads', testLeads)

// Email Automation Cron (called by cron-job.org)
app.route('/api/cron/email-automation', emailCron)

// Public cron endpoint (for external cron services like cron-job.org)
// SIMPLIFIED: Runs ONCE per day at midnight and distributes full daily earnings
app.post('/api/public/calculate-earnings', async (c) => {
  // Simple secret key validation
  const authHeader = c.req.header('Authorization')
  const cronSecret = c.env.CRON_SECRET || 'deepmine-cron-2024' // Set this as environment variable
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
  
  console.log('🕐 [CRON] Public daily earnings endpoint triggered')
  
  try {
    await calculateDailyEarnings(c.env.DB)
    
    return c.json({
      success: true,
      message: 'Daily earnings calculated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('❌ [CRON] Public cron calculation failed:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to calculate earnings',
      error: error.message 
    }, 500)
  }
})

// Manual cron trigger endpoint (for testing)
app.post('/api/cron/calculate-earnings', requireAdmin, async (c) => {
  console.log('🔧 Manual earnings calculation triggered')
  
  try {
    const DB = c.env.DB
    const today = new Date().toISOString().split('T')[0]
    
    // Calculate miners that haven't been processed in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const miners = await DB.prepare(`
      SELECT um.*
      FROM user_miners um
      WHERE um.status = 'active'
        AND um.activation_status = 'active'
        AND datetime(um.expires_at) > datetime('now')
        AND (um.last_earning_at IS NULL OR datetime(um.last_earning_at) < datetime(?))
    `).bind(oneHourAgo).all()

    let processed = 0
    const now = new Date().toISOString()

    for (const miner of miners.results || []) {
      const m = miner as any
      
      const lastEarning = m.last_earning_at ? new Date(m.last_earning_at) : new Date(m.started_at)
      const hoursElapsed = Math.min(24, (Date.now() - lastEarning.getTime()) / (1000 * 60 * 60))
      const earningsAmount = (m.daily_rate / 24) * hoursElapsed

      await DB.prepare(`
        INSERT INTO earnings_history (user_id, miner_id, amount, date)
        VALUES (?, ?, ?, ?)
      `).bind(m.user_id, m.id, earningsAmount, today).run()

      const newTotal = (m.total_earned || 0) + earningsAmount
      await DB.prepare(`
        UPDATE user_miners 
        SET total_earned = ?, last_earning_at = ?
        WHERE id = ?
      `).bind(newTotal, now, m.id).run()

      // Update both balance fields to keep them in sync
      await DB.prepare(`
        UPDATE users 
        SET balance = COALESCE(balance, 0) + ?,
            wallet_balance = COALESCE(wallet_balance, 0) + ?
        WHERE id = ?
      `).bind(earningsAmount, earningsAmount, m.user_id).run()

      processed++
    }

    return c.json({
      success: true,
      message: `Calculated earnings for ${processed} miners`,
      processed,
      timestamp: now
    })
  } catch (error) {
    console.error('❌ Manual earnings calculation failed:', error)
    return c.json({ success: false, message: 'Failed to calculate earnings' }, 500)
  }
})

// Maintenance mode middleware
app.use('*', async (c, next) => {
  if (MAINTENANCE_MODE && !c.req.path.startsWith('/static/')) {
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DeepMine AI - Under Maintenance</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
                  color: #ffffff;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  position: relative;
              }
              
              .particles {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  z-index: 1;
              }
              
              .particle {
                  position: absolute;
                  width: 2px;
                  height: 2px;
                  background: #33F0FF;
                  border-radius: 50%;
                  animation: float 20s infinite ease-in-out;
                  opacity: 0.4;
              }
              
              @keyframes float {
                  0%, 100% { transform: translateY(0) translateX(0); }
                  25% { transform: translateY(-100px) translateX(50px); }
                  50% { transform: translateY(-200px) translateX(-50px); }
                  75% { transform: translateY(-100px) translateX(100px); }
              }
              
              .maintenance-container {
                  position: relative;
                  z-index: 10;
                  text-align: center;
                  padding: 40px 24px;
                  max-width: 600px;
              }
              
              .logo {
                  height: 100px;
                  margin-bottom: 40px;
                  animation: logoGlow 2s ease-in-out infinite;
                  filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.5));
              }
              
              @keyframes logoGlow {
                  0%, 100% { 
                      filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.6));
                      opacity: 1;
                  }
                  50% { 
                      filter: drop-shadow(0 0 40px rgba(51, 240, 255, 0.9));
                      opacity: 0.85;
                  }
              }
              
              .maintenance-icon {
                  font-size: 80px;
                  color: #33F0FF;
                  margin-bottom: 24px;
                  animation: pulse 2s infinite;
              }
              
              @keyframes pulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.1); opacity: 0.8; }
              }
              
              h1 {
                  font-size: 48px;
                  font-weight: 800;
                  margin-bottom: 16px;
                  background: linear-gradient(135deg, #33F0FF 0%, #2979FF 50%, #7B61FF 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
              }
              
              h2 {
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 24px;
                  color: #E0E7FF;
              }
              
              p {
                  font-size: 18px;
                  color: #B0B8D4;
                  line-height: 1.6;
                  margin-bottom: 32px;
              }
              
              .status-box {
                  background: rgba(26, 31, 53, 0.8);
                  border: 2px solid #2979FF;
                  border-radius: 16px;
                  padding: 32px;
                  margin: 32px 0;
                  backdrop-filter: blur(10px);
              }
              
              .status-item {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 12px;
                  margin: 16px 0;
                  font-size: 16px;
              }
              
              .status-item i {
                  color: #33F0FF;
                  font-size: 20px;
              }
              
              .social-links {
                  display: flex;
                  gap: 16px;
                  justify-content: center;
                  margin-top: 40px;
              }
              
              .social-links a {
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  background: rgba(41, 121, 255, 0.1);
                  border: 1px solid rgba(41, 121, 255, 0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #33F0FF;
                  font-size: 20px;
                  transition: all 0.3s ease;
                  text-decoration: none;
              }
              
              .social-links a:hover {
                  background: rgba(41, 121, 255, 0.3);
                  border-color: #33F0FF;
                  transform: translateY(-4px);
                  box-shadow: 0 8px 20px rgba(51, 240, 255, 0.3);
              }
              
              @media (max-width: 768px) {
                  h1 { font-size: 36px; }
                  h2 { font-size: 20px; }
                  p { font-size: 16px; }
                  .maintenance-icon { font-size: 60px; }
                  .status-box { padding: 24px; }
              }
          </style>
      </head>
      <body>
          <div class="particles" id="particles"></div>
          
          <div class="maintenance-container">
              <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
              
              <div class="maintenance-icon">
                  <i class="fas fa-tools"></i>
              </div>
              
              <h1>Under Maintenance</h1>
              <h2>We're Making Things Better</h2>
              
              <p>
                  Our platform is currently undergoing scheduled maintenance to enhance your experience. 
                  We'll be back online shortly with exciting updates!
              </p>
              
              <div class="status-box">
                  <div class="status-item">
                      <i class="fas fa-clock"></i>
                      <span>Expected Return: Soon</span>
                  </div>
                  <div class="status-item">
                      <i class="fas fa-shield-alt"></i>
                      <span>Your Data is Safe & Secure</span>
                  </div>
                  <div class="status-item">
                      <i class="fas fa-rocket"></i>
                      <span>Exciting Updates Coming</span>
                  </div>
              </div>
              
              <p style="font-size: 16px; color: #8B93B0;">
                  Need immediate assistance? Contact us at 
                  <a href="mailto:deepmineai25@gmail.com" style="color: #33F0FF; text-decoration: none;">deepmineai25@gmail.com</a>
              </p>
              
              <div class="social-links">
                  <a href="https://instagram.com/deep.mine.ai" target="_blank"><i class="fab fa-instagram"></i></a>
                  <a href="https://tiktok.com/@deepmineai1" target="_blank"><i class="fab fa-tiktok"></i></a>
                  <a href="mailto:deepmineai25@gmail.com"><i class="fas fa-envelope"></i></a>
              </div>
          </div>
          
          <script>
              // Create animated particles
              const particlesContainer = document.getElementById('particles');
              for (let i = 0; i < 50; i++) {
                  const particle = document.createElement('div');
                  particle.className = 'particle';
                  particle.style.left = Math.random() * 100 + '%';
                  particle.style.top = Math.random() * 100 + '%';
                  particle.style.animationDelay = Math.random() * 20 + 's';
                  particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                  particlesContainer.appendChild(particle);
              }
          </script>
      </body>
      </html>
    `)
  }
  await next()
})

// Favicon route
app.get('/favicon.ico', async (c) => {
  // Redirect to the dragon logo PNG
  return c.redirect('/static/dragon-logo-v2.png', 301)
})

// Pre-Registration page (Step 1: Email capture)
app.get('/start-mining', (c) => {
  return c.html(preRegisterPageHTML)
})

// Pre-register alias (same as start-mining)
app.get('/pre-register', (c) => {
  return c.html(preRegisterPageHTML)
})

// Registration page (Step 2: Full registration after email verification)
app.get('/register', (c) => {
  return c.html(registerPageHTML)
})

// Login page
app.get('/login', (c) => {
  return c.html(loginPageHTML)
})

// V4 Admin Login (username/password - separate from NEW panel)
app.get('/admin-login', (c) => {
  return c.html(adminLoginV4PageHTML)
})

// Admin Login (redirect to panel login for consistency)
// This route exists to handle redirects from admin pages that reference /admin/login
app.get('/admin/login', (c) => {
  return c.redirect('/admin/panel/login', 301)
})

// Email verification page
app.get('/verify-email', (c) => {
  return c.html(verifyEmailPageHTML)
})

// Forgot Password page
app.get('/forgot-password', (c) => {
  return c.html(forgotPasswordPageHTML)
})

// Reset Password page
app.get('/reset-password', (c) => {
  return c.html(resetPasswordPageHTML)
})

// FAQ page (public access)
app.get('/faq', (c) => {
  return c.html(faqPageHTML)
})

// Dashboard page (requires authentication)
app.get('/dashboard', (c) => {
  return c.html(dashboardPageHTML)
})

// KYC Verification page (requires authentication)
app.get('/kyc', (c) => {
  return c.html(kycPageHTML)
})

// Deposit page (requires authentication)
app.get('/deposit', (c) => {
  return c.html(depositPageHTML)
})

// Withdraw page (requires authentication)
app.get('/withdraw', (c) => {
  return c.html(withdrawPageHTML)
})

// Machines purchase page (requires authentication)
app.get('/machines', (c) => {
  return c.html(machinesPageHTML)
})

// Referrals page (requires authentication)
app.get('/referrals', (c) => {
  return c.html(referralsPageHTML())
})

// Admin Dashboard page (requires admin authentication)
// Using new Enhanced Dashboard V2
app.get('/admin/dashboard', (c) => {
  return c.html(adminDashboardV2HTML)
})

// Simple admin dashboard (fallback/alternative)
app.get('/admin/dashboard-simple', (c) => {
  return c.html(adminDashboardSimpleHTML)
})

// Old dashboard (deprecated)
app.get('/admin/dashboard-old', (c) => {
  return c.html(adminDashboardHTML)
})

// Admin KYC Management page (requires admin authentication)
app.get('/admin/kyc', (c) => {
  return c.html(adminKYCPageHTML)
})

// Admin Machines Management page (requires admin authentication)
// NEW Admin Panel - Withdrawal & Machine Management (email/password)
app.get('/admin/panel/login', (c) => {
  return c.html(adminPanelLoginPageHTML)
})

app.get('/admin/panel/machines', (c) => {
  return c.html(adminMachinesPageHTML)
})

app.get('/admin/panel/withdrawals', (c) => {
  return c.html(adminWithdrawalsPageHTML)
})

// Redirects for old NEW admin panel URLs (for backward compatibility)
app.get('/admin/withdrawals', (c) => {
  return c.redirect('/admin/panel/withdrawals', 301)
})

app.get('/admin/machines', (c) => {
  return c.redirect('/admin/panel/machines', 301)
})

// DEBUG ENDPOINT: Test cookie reception
app.get('/api/debug/cookies', (c) => {
  const cookieHeader = c.req.header('Cookie')
  const allHeaders: Record<string, string> = {}
  c.req.raw.headers.forEach((value, key) => {
    allHeaders[key] = value
  })
  
  return c.json({
    success: true,
    cookieHeader: cookieHeader || 'MISSING',
    allHeaders: allHeaders,
    parsedCookies: cookieHeader ? cookieHeader.split(';').map(c => c.trim()) : [],
    hasAdminToken: cookieHeader ? cookieHeader.includes('admin_token=') : false
  })
})

// Admin Deposits Management page
app.get('/admin/deposits', (c) => {
  return c.html(adminDepositsPageHTML)
})

// Admin Panel Deposits page (alternative route)
app.get('/admin/panel/deposits', (c) => {
  return c.html(adminDepositsPageHTML)
})

// Admin Financial Reports & Analytics page
app.get('/admin/reports', (c) => {
  return c.html(adminReportsPageHTML)
})

// Admin CRM Dashboard (NEW)
app.get('/admin/crm/dashboard', (c) => {
  return c.html(adminCRMDashboardHTML)
})

// Admin Staff Management
app.get('/admin/crm/staff', (c) => {
  return c.html(adminStaffManagementHTML)
})

// Admin Settings (Redirect to Profile)
app.get('/admin/settings', (c) => {
  return c.html(adminSettingsHTML)
})

// Admin Profile (Super Admin)
app.get('/admin/profile', (c) => {
  return c.html(adminProfileHTML)
})

// Admin Staff Profile (CRM Staff)
app.get('/admin/crm/profile', (c) => {
  return c.html(adminStaffProfileHTML)
})

app.get('/admin/crm/staff/profile', (c) => {
  return c.html(adminStaffProfileHTML)
})

// Admin Activity Logs
app.get('/admin/crm/activity-logs', (c) => {
  return c.html(adminActivityLogsHTML)
})

// Admin Task Board
app.get('/admin/crm/tasks', (c) => {
  return c.html(adminTaskBoardHTML)
})

// Admin Support Tickets
app.get('/admin/crm/tickets', (c) => {
  return c.html(adminTicketsHTML)
})

// Leads Management
// Referrals Management (Admin)
app.get('/admin/referrals', (c) => {
  return c.html(adminReferralsHTML())
})

// Activity Log (Admin)
app.get('/admin/activity', (c) => {
  return c.html(adminActivityFullHTML)
})

// Users Management (Admin)
app.get('/admin/users', (c) => {
  return c.html(adminUsersHTML)
})

// CRM Staff Login (separate from main admin)
app.get('/admin/crm/login', (c) => {
  return c.html(adminCRMLoginHTML)
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DeepMine AI - Harness AI and Cloud Mining for Effortless Daily Profits</title>
        <meta name="description" content="Join DeepMine AI and leverage AI-powered cloud mining for automated 24/7 crypto profits with advanced AI technology.">
        
        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#2979FF">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="DeepMine AI">
        <meta name="mobile-web-app-capable" content="yes">
        <link rel="manifest" href="/manifest.json">
        
        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="32x32" href="/static/dragon-logo-v2.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/static/dragon-logo-v2.png">
        <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
        
        <!-- iOS Icons - Multiple sizes for compatibility -->
        <link rel="apple-touch-icon" href="/static/dragon-logo-v2.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/static/dragon-logo-v2.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/static/dragon-logo-v2.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/static/dragon-logo-v2.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/static/dragon-logo-v2.png">
        <link rel="apple-touch-startup-image" href="/static/dragon-logo-v2.png">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body>
        <!-- Navigation -->
        <nav class="navbar">
            <div class="container nav-container">
                <div class="logo-container">
                    <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
                </div>
                <div class="nav-links">
                    <a href="#about">About</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#ai-power">AI Technology</a>
                    <a href="#models">Mining Models</a>
                    <a href="/faq">FAQ</a>
                    <a href="#referral">Affiliate Program</a>
                    <a href="#contact">Contact</a>
                </div>
                <div class="nav-auth-buttons">
                    <a href="/login" class="nav-login-btn">Login</a>
                    <a href="/pre-register" class="nav-getstarted-btn">Get Started</a>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero" id="hero">
            <div class="hero-video-container">
                <iframe src="https://player.vimeo.com/video/1155044707?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1" 
                        frameborder="0" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        class="hero-video">
                </iframe>
                <div class="video-overlay"></div>
            </div>
            <div class="particles" id="particles"></div>
            <div class="hero-content">
                <div class="container">
                    <div class="hero-text">
                        <h1 class="hero-title">
                            Harness the Power of <span class="gradient-text">AI and Cloud Mining</span>
                        </h1>
                        <p class="hero-subtitle">
                            Experience effortless daily crypto profits through intelligent automation
                        </p>
                        <div class="hero-cta">
                            <button class="cta-button primary" onclick="window.location.href='/start-mining'">
                                <span>Join Now</span>
                            </button>
                            <button class="cta-button secondary" onclick="scrollToSection('about')">
                                Learn More
                                <i class="fas fa-arrow-down"></i>
                            </button>
                        </div>
                        <div class="hero-stats">
                            <div class="stat-item">
                                <div class="stat-number">24/7</div>
                                <div class="stat-label">Automated Mining</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">AI-Powered</div>
                                <div class="stat-label">Optimization</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">Daily</div>
                                <div class="stat-label">Profit Settlement</div>
                            </div>
                        </div>
                    </div>
                    <div class="hero-visual">
                        <div class="floating-card">
                            <i class="fas fa-microchip"></i>
                            <span>AI Processing</span>
                        </div>
                        <div class="floating-card delay-1">
                            <i class="fas fa-chart-line"></i>
                            <span>Smart Analytics</span>
                        </div>
                        <div class="floating-card delay-2">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure Mining</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section class="section about-section" id="about">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">About <span class="gradient-text">DeepMine AI</span></h2>
                    <p class="section-subtitle">The Future of Cryptocurrency Mining</p>
                </div>
                <div class="about-content">
                    <div class="about-text">
                        <p class="lead">
                            DeepMine AI is a revolutionary platform that combines cutting-edge artificial intelligence with cloud mining technology to deliver consistent, automated cryptocurrency profits.
                        </p>
                        <p>
                            Our mission is to democratize crypto mining, making it accessible to everyone—regardless of technical expertise. Through AI-powered optimization, we maximize efficiency while minimizing complexity, allowing you to earn passive income effortlessly.
                        </p>
                        <div class="feature-list">
                            <div class="feature-item">
                                <i class="fas fa-check-circle"></i>
                                <span>No technical knowledge required</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Fully automated 24/7 operations</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle"></i>
                                <span>AI-optimized for maximum profitability</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Transparent daily profit tracking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works Section -->
        <section class="section how-it-works-section" id="how-it-works">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">How It <span class="gradient-text">Works</span></h2>
                    <p class="section-subtitle">Start earning in 6 simple steps</p>
                </div>
                <div class="steps-container">
                    <div class="step-card">
                        <div class="step-number">01</div>
                        <div class="step-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <h3>Register</h3>
                        <p>Create your account and unlock exclusive benefits with our AI-powered mining platform</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">02</div>
                        <div class="step-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <h3>Acquire Mining Machine</h3>
                        <p>Choose from various mining machines based on your investment goals (starting from $500)</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">03</div>
                        <div class="step-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <h3>AI-Powered Optimization</h3>
                        <p>Our AI analyzes market conditions and optimizes your mining strategy in real-time</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">04</div>
                        <div class="step-icon">
                            <i class="fas fa-sync-alt"></i>
                        </div>
                        <h3>Automated 24/7 Mining</h3>
                        <p>Your machine mines continuously without any manual intervention required</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">05</div>
                        <div class="step-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <h3>Daily Profit Settlement</h3>
                        <p>Receive your profits automatically every day with full transparency</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">06</div>
                        <div class="step-icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <h3>Long-Term Profitability</h3>
                        <p>Reinvest or withdraw your earnings for sustainable passive income</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- AI Technology Section -->
        <section class="section ai-section" id="ai-power">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">The Role of <span class="gradient-text">Artificial Intelligence</span></h2>
                    <p class="section-subtitle">Advanced AI optimization for maximum profitability</p>
                </div>
                <div class="ai-grid">
                    <div class="ai-card">
                        <div class="ai-icon">
                            <i class="fas fa-chart-area"></i>
                        </div>
                        <h3>Predictive Market Analysis</h3>
                        <p>Our AI analyzes cryptocurrency market trends, difficulty adjustments, and network conditions to predict the most profitable mining opportunities in real-time.</p>
                    </div>
                    <div class="ai-card">
                        <div class="ai-icon">
                            <i class="fas fa-water"></i>
                        </div>
                        <h3>Automatic Pool Selection</h3>
                        <p>Dynamically switches between mining pools based on profitability, latency, and pool performance to ensure you're always mining with optimal efficiency.</p>
                    </div>
                    <div class="ai-card">
                        <div class="ai-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <h3>Smart Power Management</h3>
                        <p>Optimizes energy consumption and hardware performance using intelligent algorithms that balance power costs with mining rewards for maximum ROI.</p>
                    </div>
                    <div class="ai-card">
                        <div class="ai-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <h3>Hardware Health Monitoring</h3>
                        <p>Continuously monitors equipment temperature, hash rate, and performance metrics to prevent downtime and extend hardware lifespan through predictive maintenance.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mining Models Section -->
        <section class="section models-section" id="models">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Mining <span class="gradient-text">Models</span></h2>
                    <p class="section-subtitle">Choose the perfect mining strategy for your goals</p>
                </div>
                <div class="models-grid">
                    <!-- Server 1: H800 8400G -->
                    <div class="model-card featured">
                        <div class="model-badge">Premium</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>H800 8400G Server</h3>
                        <p>Ultimate computing power with NVIDIA H800 GPUs. 180-day contract for maximum returns.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 990M/d computing power</li>
                            <li><i class="fas fa-check"></i> Intel Xeon Silver 4310</li>
                            <li><i class="fas fa-check"></i> 128GB RAM + 4TB SSD</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA H800 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$50,000</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 2: H800 6400G -->
                    <div class="model-card">
                        <div class="model-badge">High Performance</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>H800 6400G Server</h3>
                        <p>High-performance solution with NVIDIA H800 technology for serious miners.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 546M/d computing power</li>
                            <li><i class="fas fa-check"></i> Intel Xeon Silver 4310</li>
                            <li><i class="fas fa-check"></i> 64GB RAM + 2TB SSD</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA H800 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$30,000</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 3: H800 320G -->
                    <div class="model-card">
                        <div class="model-badge">East China</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>H800 320G Server</h3>
                        <p>East China Region deployment with reliable H800 GPU performance.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 168M/d computing power</li>
                            <li><i class="fas fa-check"></i> Intel Xeon Silver 4310</li>
                            <li><i class="fas fa-check"></i> 64GB RAM + 1TB SSD</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA H800 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$11,000</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 4: H200 120G -->
                    <div class="model-card">
                        <div class="model-badge">North China</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>H200 120G Server</h3>
                        <p>North China Region with advanced Supermicro infrastructure and H200 GPUs.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 108M/d computing power</li>
                            <li><i class="fas fa-check"></i> Supermicro SYS-821GE</li>
                            <li><i class="fas fa-check"></i> 128GB DDR5 RAM</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA H200 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$7,000</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 5: H200 84G -->
                    <div class="model-card">
                        <div class="model-badge">Hong Kong</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>H200 84G Server</h3>
                        <p>Hong Kong Cloud Server with premium connectivity and H200 performance.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 88M/d computing power</li>
                            <li><i class="fas fa-check"></i> Supermicro SYS-821GE</li>
                            <li><i class="fas fa-check"></i> 128GB DDR5 RAM</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA H200 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$5,000</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 6: A100 96G -->
                    <div class="model-card">
                        <div class="model-badge">On-Chain</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>A100 96G Server</h3>
                        <p>On-chain cloud rental with NVIDIA A100 GPUs for blockchain computing.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 38M/d computing power</li>
                            <li><i class="fas fa-check"></i> 2nd Gen Xeon Scalable</li>
                            <li><i class="fas fa-check"></i> 400GB RAM + 2TB SSD</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA A100 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$2,000</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 7: A100 72G -->
                    <div class="model-card">
                        <div class="model-badge">On-Chain</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>A100 72G Server</h3>
                        <p>Efficient on-chain solution with A100 GPUs for cost-effective mining.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 28M/d computing power</li>
                            <li><i class="fas fa-check"></i> 2nd Gen Xeon Scalable</li>
                            <li><i class="fas fa-check"></i> 200GB RAM + 1TB SSD</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA A100 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$1,500</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 8: A100 48G -->
                    <div class="model-card">
                        <div class="model-badge">North China</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>A100 48G Server</h3>
                        <p>Entry-level enterprise server with A100 GPUs and 4th Gen processors.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 18M/d computing power</li>
                            <li><i class="fas fa-check"></i> 4th Gen Xeon Scalable</li>
                            <li><i class="fas fa-check"></i> 96GB RAM + 1TB SSD</li>
                            <li><i class="fas fa-check"></i> 8x NVIDIA A100 GPU</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$1,000</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 9: RTX 4090 24G (East) -->
                    <div class="model-card">
                        <div class="model-badge">Starter</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>RTX 4090 24G Server</h3>
                        <p>East China Region - Perfect for beginners with gaming-grade RTX 4090.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 8M/d computing power</li>
                            <li><i class="fas fa-check"></i> AMD EPYC 7542</li>
                            <li><i class="fas fa-check"></i> 216GB RAM + 500GB SSD</li>
                            <li><i class="fas fa-check"></i> GeForce RTX 4090 24GB</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$500</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>

                    <!-- Server 10: RTX 4090 24G (South) -->
                    <div class="model-card">
                        <div class="model-badge">Starter</div>
                        <div class="model-icon">
                            <img src="/static/mining-server.png" alt="Mining Server">
                        </div>
                        <h3>RTX 4090 24G Server</h3>
                        <p>South China Region - Affordable entry point with RTX 4090 performance.</p>
                        <ul class="model-features">
                            <li><i class="fas fa-check"></i> 8M/d computing power</li>
                            <li><i class="fas fa-check"></i> AMD EPYC 7542</li>
                            <li><i class="fas fa-check"></i> 216GB RAM + 500GB SSD</li>
                            <li><i class="fas fa-check"></i> GeForce RTX 4090 24GB</li>
                        </ul>
                        <div class="model-pricing">
                            <span class="price">$500</span>
                            <span class="duration">180 days</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Affiliate Program Section -->
        <section class="section referral-section" id="referral">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Referral <span class="gradient-text">Program</span></h2>
                    <p class="section-subtitle">Earn generous rewards by sharing DeepMine AI</p>
                </div>
                <div class="referral-content">
                    <div class="referral-hero">
                        <div class="referral-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>Share Your Code, Earn Together</h3>
                        <p>Join our affiliate program and earn commissions on every referral</p>
                    </div>
                    <div class="referral-rewards">
                        <div class="reward-card">
                            <div class="reward-icon">
                                <i class="fas fa-hand-holding-usd"></i>
                            </div>
                            <h4>Direct Referral Bonus</h4>
                            <div class="reward-amount">$80</div>
                            <p>Earn <strong>$80</strong> for every friend who joins and purchases their first mining machine</p>
                        </div>
                        <div class="reward-card">
                            <div class="reward-icon">
                                <i class="fas fa-network-wired"></i>
                            </div>
                            <h4>Downline Commission</h4>
                            <div class="reward-amount">$15</div>
                            <p>Receive <strong>$15</strong> from each secondary referral's first purchase</p>
                        </div>
                    </div>
                    
                    <!-- Daily Check-in Bonus -->
                    <div class="daily-checkin-box">
                        <div class="checkin-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="checkin-content">
                            <h4>Daily Check-in Bonus</h4>
                            <p>Remember to log in and check in before <strong>5:00 PM (UK time)</strong> each day to claim your <span class="bonus-highlight">$1 bonus</span> — don't miss out!</p>
                        </div>
                    </div>
                    <div class="referral-calculator">
                        <h4>Calculate Your Referral Earnings</h4>
                        <div class="ref-calc-inputs">
                            <div class="ref-input-group">
                                <label>Direct Referrals</label>
                                <input type="number" id="directRefs" value="5" min="0">
                            </div>
                            <div class="ref-input-group">
                                <label>Indirect Referrals</label>
                                <input type="number" id="indirectRefs" value="10" min="0">
                            </div>
                        </div>
                        <div class="ref-calc-result">
                            <span>Total Potential Earnings:</span>
                            <span class="ref-total" id="refTotal">$550</span>
                        </div>
                    </div>
                    <div class="referral-steps">
                        <h4>How to Start Earning</h4>
                        <div class="ref-steps">
                            <div class="ref-step">
                                <span class="ref-step-num">1</span>
                                <span>Join DeepMine AI</span>
                            </div>
                            <div class="ref-step">
                                <span class="ref-step-num">2</span>
                                <span>Get your unique affiliate code</span>
                            </div>
                            <div class="ref-step">
                                <span class="ref-step-num">3</span>
                                <span>Share with friends and family</span>
                            </div>
                            <div class="ref-step">
                                <span class="ref-step-num">4</span>
                                <span>Earn automatic commissions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Transparency & Security Section -->
        <section class="section security-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Transparency & <span class="gradient-text">Security</span></h2>
                    <p class="section-subtitle">Your trust is our foundation</p>
                </div>
                <div class="security-grid">
                    <div class="security-card">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Bank-Level Security</h3>
                        <p>256-bit SSL encryption protects all transactions and personal data</p>
                    </div>
                    <div class="security-card">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>Daily Records</h3>
                        <p>Complete transparency with detailed daily mining and profit reports</p>
                    </div>
                    <div class="security-card">
                        <i class="fas fa-money-bill-wave"></i>
                        <h3>Easy Withdrawals</h3>
                        <p>Fast and simple withdrawal process with multiple payment options</p>
                    </div>
                    <div class="security-card">
                        <i class="fas fa-user-shield"></i>
                        <h3>Data Privacy</h3>
                        <p>Your information is never shared and remains completely confidential</p>
                    </div>
                    <div class="security-card">
                        <i class="fas fa-headset"></i>
                        <h3>24/7 Support</h3>
                        <p>Dedicated customer support team available around the clock</p>
                    </div>
                    <div class="security-card">
                        <i class="fas fa-certificate"></i>
                        <h3>Transparent Operations</h3>
                        <p>Operating with full transparency and commitment to international best practices</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="section contact-section" id="contact">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Get In <span class="gradient-text">Touch</span></h2>
                    <p class="section-subtitle">We're here to help you succeed</p>
                </div>
                <div class="contact-content">
                    <div class="contact-info">
                        <div class="contact-card">
                            <i class="fas fa-envelope"></i>
                            <h4>Email Us</h4>
                            <a href="mailto:deepmineai25@gmail.com">info@deepmineai.vip</a>
                        </div>
                        <div class="contact-card">
                            <i class="fab fa-instagram"></i>
                            <h4>Instagram</h4>
                            <a href="https://instagram.com/deep.mine.ai" target="_blank">@deepmineai</a>
                        </div>
                        <div class="contact-card">
                            <i class="fab fa-tiktok"></i>
                            <h4>TikTok</h4>
                            <a href="https://tiktok.com/@deepmineai1" target="_blank">@deepmineai1</a>
                        </div>
                    </div>
                    <div class="contact-form">
                        <h3>Send us a message</h3>
                        <form action="https://api.web3forms.com/submit" method="POST" id="contactForm">
                            <!-- Web3Forms Configuration -->
                            <input type="hidden" name="access_key" value="718f50bc-e3c4-4ca3-9bf3-1142715e3099">
                            <input type="hidden" name="subject" value="New Contact Form Submission - DeepMine AI">
                            <input type="hidden" name="from_name" value="DeepMine AI Website">
                            <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
                            
                            <div class="form-group">
                                <input type="text" name="name" placeholder="Your Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" placeholder="Your Email" required>
                            </div>
                            <div class="form-group">
                                <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="cta-button primary">
                                Send Message
                                <i class="fas fa-paper-plane"></i>
                            </button>
                            <div id="formResult" style="margin-top: 16px; text-align: center;"></div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="logo-container">
                            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
                        </div>
                        <p style="margin: 6px 0; font-size: 13px;">Empowering the Future of Mining through AI</p>
                    </div>
                    <div class="footer-links">
                        <div class="footer-column">
                            <h4>Quick Links</h4>
                            <a href="#about">About</a>
                            <a href="#how-it-works">How It Works</a>
                            <a href="/terms">Terms of Service</a>
                        </div>
                        <div class="footer-column">
                            <h4>Follow Us</h4>
                            <div class="social-links">
                                <a href="https://instagram.com/deep.mine.ai" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                                <a href="https://tiktok.com/@deepmineai1" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                                <a href="mailto:info@deepmineai.vip" title="Email"><i class="fas fa-envelope"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
                    <p class="footer-address">DeepMine Ai, Hudson House, 8 Albany Street, Edinburgh, EH1 3QB</p>
                    <p class="footer-company-registration">DEEPMINE AI LIMITED | Company number SC873661</p>
                </div>
            </div>
        </footer>

        <!-- Floating CTA Button -->
        <div class="floating-cta" id="floatingCta">
            <button class="cta-button primary" onclick="window.location.href='/start-mining'">
                <i class="fas fa-rocket"></i>
                <span>Join Now</span>
            </button>
        </div>

        <script src="/static/app.js"></script>
        
        <!-- GoHighLevel Support Widget -->
        <div 
          data-chat-widget 
          data-widget-id="695ab20ce3cb11f0c5bd0538" 
          data-location-id="2MoQq4bzDNf2RsYqNTHZ"> 
        </div>
        <script 
          src="https://widgets.leadconnectorhq.com/loader.js"  
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js" 
          data-widget-id="695ab20ce3cb11f0c5bd0538"> 
        </script>
    </body>
    </html>
  `)
})

// iOS Installation Guide
app.get('/install-ios', (c) => {
  return c.html(installIOSPageHTML)
})

// Partner Portal Routes
app.get('/partner/login', (c) => {
  return c.html(partnerLoginHTML)
})

app.get('/partner/dashboard', (c) => {
  return c.html(partnerDashboardHTML)
})

// Terms of Service page
app.get('/terms', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terms of Service - DeepMine AI</title>
        <meta name="description" content="DeepMine AI Terms of Service - Read our terms and conditions for cloud mining services.">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <style>
            .terms-container {
                max-width: 900px;
                margin: 120px auto 80px;
                padding: 0 24px;
            }
            .terms-header {
                text-align: center;
                margin-bottom: 48px;
            }
            .terms-header h1 {
                font-size: 48px;
                background: linear-gradient(135deg, var(--primary-blue), var(--aqua-glow));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 16px;
            }
            .terms-header p {
                color: var(--light-gray);
                font-size: 16px;
            }
            .terms-content {
                background: var(--card-bg);
                border: 1px solid rgba(41   border-radius: 16px;
                padding: 48px;
            }
            .terms-section {
                margin-bottom: 40px;
            }
            .terms-section:last-child {
                margin-bottom: 0;
            }
            .terms-section h2 {
                font-size: 28px;
                color: var(--white);
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 2px solid rgba(41, 121, 255, 0.3);
            }
            .terms-section h3 {
                font-size: 20px;
                color: var(--aqua-glow);
                margin: 24px 0 12px;
            }
            .terms-section p {
                color: var(--light-gray);
                line-height: 1.8;
                margin-bottom: 16px;
            }
            .terms-section ul {
                margin-left: 24px;
                margin-bottom: 16px;
            }
            .terms-section li {
                color: var(--light-gray);
                line-height: 1.8;
                margin-bottom: 12px;
            }
            .highlight-box {
                background: rgba(41, 121, 255, 0.1);
                border-left: 4px solid var(--primary-blue);
                padding: 20px 24px;
                margin: 24px 0;
                border-radius: 8px;
            }
            .highlight-box p {
                margin-bottom: 0;
                font-weight: 500;
                color: var(--white);
            }
            .back-button {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--primary-blue);
                text-decoration: none;
                font-weight: 500;
                margin-bottom: 32px;
                transition: all 0.3s ease;
            }
            .back-button:hover {
                color: var(--aqua-glow);
                transform: translateX(-4px);
            }
        </style>
    </head>
    <body>
        <!-- Navigation -->
        <nav class="navbar">
            <div class="container nav-container">
                <div class="logo-container">
                    <a href="/">
                        <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
                    </a>
                </div>
                <div class="nav-links">
                    <a href="/#about">About</a>
                    <a href="/#how-it-works">How It Works</a>
                    <a href="/#ai-power">AI Technology</a>
                    <a href="/#models">Mining Models</a>
                    <a href="/faq">FAQ</a>
                    <a href="/#referral">Affiliate Program</a>
                    <a href="/#contact">Contact</a>
                </div>
                <div class="nav-auth-buttons">
                    <a href="/login" class="nav-login-btn">Login</a>
                    <a href="/pre-register" class="nav-getstarted-btn">Get Started</a>
                </div>
            </div>
        </nav>

        <div class="terms-container">
            <a href="/" class="back-button">
                <i class="fas fa-arrow-left"></i>
                Back to Home
            </a>
            
            <div class="terms-header">
                <h1>Terms of Service</h1>
                <p>Last Updated: December 24, 2024</p>
            </div>

            <div class="terms-content">
                <div class="terms-section">
                    <h2>1. Introduction</h2>
                    <p>Welcome to DeepMine AI. By accessing or using our cloud mining services, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.</p>
                    <p>DeepMine AI empowers users to harness AI and cloud mining for effortless daily profits. Our platform leverages advanced artificial intelligence to optimize cryptocurrency mining operations on the cloud.</p>
                </div>

                <div class="terms-section">
                    <h2>2. Service Description</h2>
                    <p>DeepMine AI provides cloud-based cryptocurrency mining services powered by artificial intelligence. Our services include:</p>
                    <ul>
                        <li><strong>AI-Powered Mining:</strong> Advanced algorithms optimize mining operations 24/7</li>
                        <li><strong>Multiple Mining Servers:</strong> Access to various server configurations (H800, H200, A100, RTX 4090)</li>
                        <li><strong>Automated Profit Generation:</strong> Daily profit generation based on your selected mining server</li>
                        <li><strong>Affiliate Program:</strong> Earn commissions on direct and indirect referrals</li>
                        <li><strong>Daily Check-in Bonus:</strong> Claim $1 bonus daily before 5:00 PM UK time</li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>3. Transparency & Withdrawal Policy</h2>
                    
                    <div class="highlight-box">
                        <p><i class="fas fa-exclamation-circle" style="color: var(--aqua-glow); margin-right: 8px;"></i> <strong>IMPORTANT:</strong> Our project is completely transparent, with no hidden mechanisms. Our only requirement is to guarantee that every user earns money.</p>
                    </div>

                    <h3>3.1 Withdrawal Availability</h3>
                    <p><strong>Once your Daily Earnings exceed $100, you can request a withdrawal of your accumulated profits.</strong></p>
                    
                    <h3>3.2 Server Purchase</h3>
                    <p>When you purchase a mining server, you commit to the full contract duration.</p>

                    <h3>3.3 After Contract Completion</h3>
                    <p>Once your server contract period is complete (e.g., after 180 days), you have full flexibility to:</p>
                    <ul>
                        <li>Withdraw your initial investment plus accumulated profits</li>
                        <li>Reinvest in a new or upgraded mining server</li>
                        <li>Transfer funds according to our withdrawal policies</li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>4. Account Registration</h2>
                    <p>To use DeepMine AI services, you must:</p>
                    <ul>
                        <li>Be at least 18 years of age</li>
                        <li>Provide accurate and complete registration information</li>

                        <li>Maintain the security of your account credentials</li>
                        <li>Notify us immediately of any unauthorized access</li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>5. Investment & Minimum Requirements</h2>
                    <p>Our platform offers various mining servers with different investment levels:</p>
                    <ul>
                        <li><strong>Minimum Investment:</strong> Starting from $500 (RTX 4090 24G servers)</li>
                        <li><strong>Maximum Investment:</strong> Up to $50,000 (H800 8400G servers)</li>
                        <li><strong>Server Options:</strong> Range from entry-level RTX 4090 to high-performance H800 systems</li>
                        <li><strong>Contract Periods:</strong> Typically 180 days with daily profit generation</li>
                    </ul>
                    <p>Each server generates different daily profits based on its computational power and configuration.</p>
                </div>

                <div class="terms-section">
                    <h2>6. Profit Distribution & Calculations</h2>
                    <p>Profits are calculated and distributed based on:</p>
                    <ul>
                        <li>Your selected mining server's daily output (measured in M/d)</li>
                        <li>Real-time cryptocurrency market conditions</li>
                        <li>AI optimization efficiency</li>
                        <li>Network mining difficulty</li>
                    </ul>
                    <p>Daily profits are automatically credited to your account. You can track your earnings in real-time through our dashboard.</p>
                </div>

                <div class="terms-section">
                    <h2>7. Affiliate Program</h2>
                    <p>Our Affiliate Program rewards users who invite others:</p>
                    <ul>
                        <li><strong>Level 1:</strong> Earn a fixed $80 bonus for each direct affiliate's first server purchase.</li>
                        <li><strong>Level 2:</strong> Earn a fixed $15 bonus for each second-level affiliate's first server purchase.</li>
                        <li>Commissions are calculated daily and added to your account</li>
                        <li>No limit on the number of affiliates you can make</li>
                        <li>You will receive your unique affiliate code upon registration</li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>8. Daily Check-in Bonus</h2>
                    <p>Active users can claim a daily bonus:</p>
                    <ul>
                        <li>$1 bonus available daily before 5:00 PM UK time</li>
                        <li>Must log in and manually claim the bonus each day</li>
                        <li>Unclaimed bonuses do not roll over to the next day</li>
                        <li>Bonus is immediately credited to your account upon claiming</li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>9. Withdrawal Policy</h2>
                    <p>Withdrawals are subject to the following conditions:</p>
                    <ul>
                        <li><strong>Withdrawals can be requested once Daily Earnings exceed $100.</strong></li>
                        <li>After contract completion, withdrawals can be processed within 24-48 hours</li>
                        <li>Minimum withdrawal amount may apply</li>
                        <li>Withdrawal fees may be deducted based on the cryptocurrency network</li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>10. Risk Disclosure</h2>
                    <p>Cryptocurrency mining involves risks that users should understand:</p>
                    <ul>
                        <li><strong>Market Volatility:</strong> Cryptocurrency values fluctuate and may affect profit calculations</li>
                        <li><strong>Mining Difficulty:</strong> Network difficulty adjustments may impact mining output</li>
                        <li><strong>Technical Risks:</strong> Hardware or network issues may temporarily affect operations</li>
                        <li><strong>Regulatory Changes:</strong> Cryptocurrency regulations may change in different jurisdictions</li>
                        <li><strong>Commitment Period:</strong> Funds are committed for the contract duration.</li>
                    </ul>
                    <p>Past performance does not guarantee future results. Invest responsibly and only what you can afford to commit for the contract period.</p>
                </div>

                <div class="terms-section">
                    <h2>11. Prohibited Activities</h2>
                    <p>Users are strictly prohibited from:</p>
                    <ul>
                        <li>Creating multiple accounts to abuse bonuses or affiliate programs</li>
                        <li>Using automated bots or scripts to manipulate the platform</li>
                        <li>Attempting to hack, disrupt, or compromise our systems</li>
                        <li>Engaging in fraudulent activities or money laundering</li>
                        <li>Misrepresenting or providing false information</li>
                        <li>Attempting to circumvent the withdrawal policy</li>
                    </ul>
                    <p>Violations may result in account suspension and forfeiture of funds.</p>
                </div>

                <div class="terms-section">
                    <h2>12. Service Availability</h2>
                    <p>We strive to maintain 99.9% uptime, but we cannot guarantee uninterrupted service. DeepMine AI reserves the right to:</p>
                    <ul>
                        <li>Perform scheduled maintenance with advance notice</li>
                        <li>Suspend services temporarily for security or technical reasons</li>
                        <li>Update or modify features to improve user experience</li>
                        <li>Discontinue certain mining servers based on market conditions</li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>13. Privacy & Data Protection</h2>
                    <p>We take your privacy seriously:</p>
                    <ul>
                        <li>Personal information is encrypted and stored securely</li>
                        <li>We never share your data with third parties without consent</li>
                        <li>KYC (Know Your Customer) verification may be required for large withdrawals</li>
                        <li>Transaction history is maintained for regulatory compliance</li>
                    </ul>
                    <p>For detailed information, please refer to our Privacy Policy.</p>
                </div>

                <div class="terms-section">
                    <h2>14. Limitation of Liability</h2>
                    <p>DeepMine AI and its affiliates shall not be liable for:</p>
                    <ul>
                        <li>Losses resulting from cryptocurrency market volatility</li>
                        <li>Damages caused by user negligence or security breaches</li>
                        <li>Interruptions due to force majeure events</li>
                        <li>Third-party service failures (payment processors, exchanges, etc.)</li>
                        <li>Loss of profits or investment during the contracted period</li>
                    </ul>
                    <p>Our total liability is limited to the amount of your active investment on the platform.</p>
                </div>

                <div class="terms-section">
                    <h2>15. Modifications to Terms</h2>
                    <p>We reserve the right to modify these Terms of Service at any time. Changes will be:</p>
                    <ul>
                        <li>Posted on this page with an updated "Last Updated" date</li>
                        <li>Notified to users via email or platform notifications</li>
                        <li>Effective immediately upon posting unless otherwise stated</li>
                    </ul>
                    <p>Continued use of the platform after changes constitutes acceptance of the modified terms.</p>
                </div>

                <div class="terms-section">
                    <h2>16. Governing Law</h2>
                    <p>These Terms of Service are governed by international cryptocurrency regulations and the laws of applicable jurisdictions. Any disputes shall be resolved through arbitration in accordance with international arbitration rules.</p>
                </div>

                <div class="terms-section">
                    <h2>17. Contact Information</h2>
                    <p>For questions or concerns regarding these Terms of Service, please contact us:</p>
                    <ul>
                        <li><strong>Email:</strong> <a href="mailto:deepmineai25@gmail.com" style="color: var(--aqua-glow);">info@deepmineai.vip</a></li>
                        <li><strong>Instagram:</strong> <a href="https://instagram.com/deep.mine.ai" target="_blank" style="color: var(--aqua-glow);">@deep.mine.ai</a></li>
                        <li><strong>TikTok:</strong> <a href="https://tiktok.com/@deepmineai1" target="_blank" style="color: var(--aqua-glow);">@deepmineai1</a></li>
                    </ul>
                </div>

                <div class="terms-section">
                    <h2>18. Acceptance of Terms</h2>
                    <p>By using DeepMine AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform.</p>
                    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(41, 121, 255, 0.2); text-align: center; color: var(--aqua-glow); font-weight: 600;">
                        Join DeepMine AI Today
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="logo-container">
                            <a href="/">
                                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
                            </a>
                        </div>
                        <p>Empowering the Future of Mining through AI</p>
                    </div>
                    <div class="footer-links">
                        <div class="footer-column">
                            <h4>Quick Links</h4>
                            <a href="/#about">About</a>
                            <a href="/#how-it-works">How It Works</a>
                            <a href="/#ai-power">AI Technology</a>
                            <a href="/#models">Mining Models</a>
                        </div>
                        <div class="footer-column">
                            <h4>Support</h4>
                            <a href="/#contact">Contact</a>
                            <a href="/#referral">Referral Program</a>
                            <a href="/#faq">FAQ</a>
                            <a href="/terms">Terms of Service</a>
                        </div>
                        <div class="footer-column">
                            <h4>Follow Us</h4>
                            <div class="social-links">
                                <a href="https://instagram.com/deep.mine.ai" target="_blank"><i class="fab fa-instagram"></i></a>
                                <a href="https://tiktok.com/@deepmineai1" target="_blank"><i class="fab fa-tiktok"></i></a>
                                <a href="mailto:deepmineai25@gmail.com"><i class="fas fa-envelope"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
                    <p class="footer-address">DeepMine Ai, Hudson House, 8 Albany Street, Edinburgh, EH1 3QB</p>
                    <p class="footer-company-registration">DEEPMINE AI LIMITED | Company number SC873661</p>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `)
})

// ========================================
// EMAIL HELPER FUNCTION (Resend API)
// ========================================
async function sendVerificationEmail(resendApiKey: string, toEmail: string, fullName: string, verificationToken: string) {
  try {
    const verificationUrl = `https://www.deepmineai.vip/verify-email?token=${verificationToken}`
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DeepMine AI <noreply@deepmineai.vip>',
        to: [toEmail],
        subject: 'Verify Your Email - DeepMine AI',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 40px; }
              .logo { text-align: center; margin-bottom: 30px; }
              .logo img { width: 120px; height: auto; }
              h1 { color: #00d9ff; font-size: 28px; margin-bottom: 20px; text-align: center; }
              p { color: #b0b0b0; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
              .button { display: inline-block; background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; margin: 20px 0; text-align: center; }
              .button:hover { background: linear-gradient(135deg, #00b8e6 0%, #0088bb 100%); }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              .highlight { color: #00d9ff; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <img src="https://www.deepmineai.vip/static/dragon-logo-v2.png" alt="DeepMine AI">
              </div>
              <h1>🚀 Welcome to DeepMine AI!</h1>
              <p>Hi <span class="highlight">${fullName}</span>,</p>
              <p>Thank you for registering with DeepMine AI! We're excited to have you join our mining platform.</p>
              <p>To complete your registration, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">✅ Verify My Email</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #1a1a2e; padding: 15px; border-radius: 8px; word-break: break-all; color: #00d9ff;">${verificationUrl}</p>
              <p><strong>What's next?</strong></p>
              <ul style="color: #b0b0b0;">
                <li>✅ Verify your email (this step)</li>
                <li>📝 Complete your full registration</li>
                <li>🔐 Complete KYC verification</li>
                <li>💎 Start mining with our powerful H800 servers!</li>
              </ul>
              <p>If you didn't create this account, please ignore this email.</p>
              <div class="footer">
                <p>© 2025 DeepMine AI. All rights reserved.</p>
                <p>Contact us: <a href="mailto:support@deepmineai.vip" style="color: #00d9ff;">support@deepmineai.vip</a></p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return { success: false, error: errorData }
    }
    
    const data = await response.json()
    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}

// API: Pre-Registration (Step 1: Email capture and verification)
app.post('/api/pre-register', async (c) => {
  try {
    const { fullName, email } = await c.req.json()
    
    // Validation
    if (!fullName || !email) {
      return c.json({ success: false, message: 'Full name and email are required' }, 400)
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ success: false, message: 'Invalid email format' }, 400)
    }
    
    // Get database binding
    const DB = c.env.DB
    
    // Check if email already exists in users table
    const existingUser = await DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (existingUser) {
      return c.json({ success: false, message: 'Email already registered. Please login instead.' }, 409)
    }
    
    // Check if email already in pre-registration
    const existingPreReg = await DB.prepare(
      'SELECT id, email_verified FROM registrations WHERE email = ?'
    ).bind(email).first()
    
    if (existingPreReg) {
      if (existingPreReg.email_verified) {
        return c.json({ success: false, message: 'Email already verified. Please complete your registration.' }, 409)
      }
      // Resend verification email
      const verificationToken = `${Date.now()}${Math.random().toString(36).substr(2, 9)}`
      await DB.prepare(
        'UPDATE registrations SET verification_token = ? WHERE email = ?'
      ).bind(verificationToken, email).run()
      
      // Send verification email
      const emailResult = await sendVerificationEmail(
        c.env.RESEND_API_KEY,
        email,
        existingPreReg.full_name || fullName,
        verificationToken
      )
      
      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error)
        return c.json({ 
          success: false, 
          message: 'Failed to send verification email. Please try again or contact support.',
        }, 500)
      }
      
      return c.json({ 
        success: true, 
        message: 'Verification email resent! Please check your inbox (including spam folder).',
      })
    }
    
    // Generate verification token
    const verificationToken = `${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    const uniqueCode = `DM${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    
    // Insert new pre-registration
    await DB.prepare(
      `INSERT INTO registrations (unique_code, full_name, email, verification_token, email_verified) 
       VALUES (?, ?, ?, ?, 0)`
    ).bind(uniqueCode, fullName, email, verificationToken).run()
    
    // Send verification email
    const emailResult = await sendVerificationEmail(
      c.env.RESEND_API_KEY,
      email,
      fullName,
      verificationToken
    )
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return c.json({ 
        success: false, 
        message: 'Registration successful but failed to send verification email. Please contact support at support@deepmineai.vip',
      }, 500)
    }
    
    // Return success
    return c.json({ 
      success: true, 
      message: 'Registration successful! Please check your email inbox (and spam folder) for the verification link.',
    })
  } catch (error) {
    console.error('Pre-registration error:', error)
    return c.json({ success: false, message: 'Registration failed. Please try again.' }, 500)
  }
})

// API: Verify Email Token
app.post('/api/verify-email', async (c) => {
  try {
    const { token } = await c.req.json()
    
    if (!token) {
      return c.json({ success: false, message: 'Verification token is required' }, 400)
    }
    
    const DB = c.env.DB
    
    // Find registration with this token
    const registration = await DB.prepare(
      'SELECT id, email, full_name, email_verified FROM registrations WHERE verification_token = ?'
    ).bind(token).first()
    
    if (!registration) {
      return c.json({ success: false, message: 'Invalid or expired verification token' }, 404)
    }
    
    if (registration.email_verified) {
      return c.json({ success: true, message: 'Email already verified! You can now complete your registration.', alreadyVerified: true })
    }
    
    // Update registration to mark email as verified
    await DB.prepare(
      'UPDATE registrations SET email_verified = 1, verified_at = CURRENT_TIMESTAMP WHERE verification_token = ?'
    ).bind(token).run()
    
    return c.json({ 
      success: true, 
      message: 'Email verified successfully! Redirecting to complete your registration...',
      email: registration.email,
      fullName: registration.full_name
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return c.json({ success: false, message: 'Verification failed. Please try again.' }, 500)
  }
})

// API: User Registration
app.post('/api/register', async (c) => {
  try {
    const { fullName, email } = await c.req.json()
    
    // Validation
    if (!fullName || !email) {
      return c.json({ success: false, message: 'Full name and email are required' }, 400)
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ success: false, message: 'Invalid email format' }, 400)
    }
    
    // Generate unique code
    const uniqueCode = `DM${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    
    // Get database binding
    const DB = c.env.DB
    
    // Check if email already exists
    const existing = await DB.prepare(
      'SELECT id FROM registrations WHERE email = ?'
    ).bind(email).first()
    
    if (existing) {
      return c.json({ success: false, message: 'Email already registered' }, 409)
    }
    
    // Insert new registration
    await DB.prepare(
      `INSERT INTO registrations (unique_code, full_name, email) 
       VALUES (?, ?, ?)`
    ).bind(uniqueCode, fullName, email).run()
    
    // Return success
    return c.json({ 
      success: true, 
      message: 'Registration successful! Check your email for login instructions.',
      uniqueCode 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ success: false, message: 'Registration failed. Please try again.' }, 500)
  }
})

// API: Admin Login
app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    // Simple admin check (in production, use proper password hashing)
    if (username === 'admin' && password === 'deepmine2025') {
      // In production, generate and return a JWT token
      return c.json({ success: true, token: 'admin-session-token' })
    }
    
    return c.json({ success: false, message: 'Invalid credentials' }, 401)
  } catch (error) {
    return c.json({ success: false, message: 'Login failed' }, 500)
  }
})

// API: Get All Registrations (Admin only)
app.get('/api/admin/registrations', async (c) => {
  try {
    const DB = c.env.DB
    
    // Get all registrations
    const { results } = await DB.prepare(
      `SELECT id, unique_code, full_name, email, access_code, 
              datetime(signup_date, 'localtime') as signup_date, email_sent
       FROM registrations 
       ORDER BY signup_date DESC`
    ).all()
    
    return c.json({ success: true, registrations: results })
  } catch (error) {
    console.error('Fetch error:', error)
    return c.json({ success: false, message: 'Failed to fetch registrations' }, 500)
  }
})

// API: Export Registrations as CSV (Admin only)
app.get('/api/admin/export', async (c) => {
  try {
    const DB = c.env.DB
    
    const { results } = await DB.prepare(
      `SELECT unique_code, full_name, email, access_code, 
              datetime(signup_date, 'localtime') as signup_date
       FROM registrations 
       ORDER BY signup_date DESC`
    ).all()
    
    // Generate CSV
    const csvHeader = 'Unique Code,Full Name,Email,Access Code,Signup Date\n'
    const csvRows = results.map(r => 
      `${r.unique_code},"${r.full_name}",${r.email},${r.access_code},${r.signup_date}`
    ).join('\n')
    
    const csv = csvHeader + csvRows
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="registrations.csv"'
      }
    })
  } catch (error) {
    return c.json({ success: false, message: 'Export failed' }, 500)
  }
})

// API: Delete Registration (Admin only)
app.delete('/api/admin/registration/:id', async (c) => {
  try {
    const DB = c.env.DB
    const id = c.req.param('id')
    
    // Delete the registration
    await DB.prepare('DELETE FROM registrations WHERE id = ?').bind(id).run()
    
    return c.json({ success: true, message: 'Registration deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ success: false, message: 'Failed to delete registration' }, 500)
  }
})

// Redirect old /join route to /register
app.get('/join', (c) => {
  return c.redirect('/start-mining')
})

// Landing Page: Old Join Now page redirects to start-mining for proper flow
app.get('/join-old', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Join DeepMine AI - Start Mining Today</title>
        <meta name="description" content="Join DeepMine AI and start earning with AI-powered cloud mining. Register now to get your access code.">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0B0F1E 0%, #1a1f3a 100%);
                color: #fff;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                max-width: 500px;
                width: 100%;
            }
            
            .logo-container {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .logo {
                height: 100px;
                width: auto;
                animation: logoGlow 2s ease-in-out infinite;
                filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.5));
            }
            
            @keyframes logoGlow {
                0%, 100% { 
                    filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.6));
                    opacity: 1;
                }
                50% { 
                    filter: drop-shadow(0 0 40px rgba(51, 240, 255, 0.9));
                    opacity: 0.85;
                }
            }
            
            .join-card {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(41, 121, 255, 0.3);
                border-radius: 24px;
                padding: 48px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            h1 {
                font-size: 32px;
                font-weight: 800;
                text-align: center;
                margin-bottom: 12px;
                background: linear-gradient(135deg, #2979FF, #33F0FF);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .subtitle {
                text-align: center;
                color: #a8b3cf;
                margin-bottom: 32px;
                font-size: 16px;
            }
            
            .form-group {
                margin-bottom: 24px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #fff;
                font-size: 14px;
            }
            
            input {
                width: 100%;
                padding: 14px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(41, 121, 255, 0.3);
                border-radius: 12px;
                color: #fff;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            
            input:focus {
                outline: none;
                border-color: #2979FF;
                background: rgba(41, 121, 255, 0.1);
                box-shadow: 0 0 0 3px rgba(41, 121, 255, 0.1);
            }
            
            input::placeholder {
                color: #6b7280;
            }
            
            .error-message {
                color: #ff4757;
                font-size: 13px;
                margin-top: 6px;
                display: none;
            }
            
            .submit-btn {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #2979FF, #33F0FF);
                border: none;
                border-radius: 12px;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(41, 121, 255, 0.4);
            }
            
            .submit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .success-message {
                background: rgba(52, 211, 153, 0.1);
                border: 1px solid rgba(52, 211, 153, 0.3);
                border-radius: 12px;
                padding: 16px;
                margin-top: 20px;
                display: none;
            }
            
            .success-message.show {
                display: block;
                animation: slideIn 0.3s ease;
            }
            
            .success-message p {
                color: #34D399;
                font-size: 14px;
                line-height: 1.6;
            }
            
            .error-alert {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 12px;
                padding: 16px;
                margin-top: 20px;
                display: none;
            }
            
            .error-alert.show {
                display: block;
                animation: slideIn 0.3s ease;
            }
            
            .error-alert p {
                color: #EF4444;
                font-size: 14px;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .back-link {
                text-align: center;
                margin-top: 24px;
            }
            
            .back-link a {
                color: #2979FF;
                text-decoration: none;
                font-size: 14px;
                transition: color 0.3s ease;
            }
            
            .back-link a:hover {
                color: #33F0FF;
            }
            
            .features {
                margin-top: 32px;
                padding-top: 32px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }
            
            .feature-icon {
                width: 40px;
                height: 40px;
                background: rgba(41, 121, 255, 0.1);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #2979FF;
            }
            
            .feature-text {
                font-size: 14px;
                color: #a8b3cf;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo-container">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
            </div>
            
            <div class="join-card">
                <h1>Join DeepMine AI</h1>
                <p class="subtitle">Start earning with AI-powered cloud mining</p>
                
                <form id="joinForm">
                    <div class="form-group">
                        <label for="fullName">Full Name *</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            placeholder="Enter your full name"
                            required
                        >
                        <span class="error-message" id="nameError">Please enter your full name</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="your.email@example.com"
                            required
                        >
                        <span class="error-message" id="emailError">Please enter a valid email address</span>
                    </div>
                    
                    <button type="submit" class="submit-btn" id="submitBtn">
                        <i class="fas fa-rocket"></i>
                        <span>Join Now</span>
                    </button>
                </form>
                
                <div class="success-message" id="successMessage">
                    <p><i class="fas fa-check-circle"></i> <strong>Registration Successful!</strong></p>
                    <div id="accessDetails" style="margin-top: 16px; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; text-align: left;">
                        <p style="margin-bottom: 12px;"><strong>📋 Your Access Details:</strong></p>
                        <p style="margin-bottom: 8px;">• Unique Code: <strong id="displayUniqueCode"></strong></p>

                        <p style="margin-bottom: 12px;">• Login: <a href="https://deepseek888.vip/web/index.html#/pages/login/login" target="_blank" style="color: var(--aqua-glow);">Click here to login</a></p>
                        <p style="margin-bottom: 8px;"><strong>📎 Download Guide:</strong></p>
                        <p><a href="/static/Deepmineai-start.pdf" download style="color: var(--aqua-glow);">Download Getting Started PDF</a></p>
                    </div>
                </div>
                
                <div class="error-alert" id="errorAlert">
                    <p id="errorText"><i class="fas fa-exclamation-circle"></i> An error occurred. Please try again.</p>
                </div>
                
                <div class="features">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <div class="feature-text">Instant account activation</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="feature-text">Secure and encrypted</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-gift"></i>
                        </div>
                        <div class="feature-text">AI-Powered Mining</div>
                    </div>
                </div>
                
                <div class="back-link">
                    <a href="/"><i class="fas fa-arrow-left"></i> Back to Home</a>
                </div>
            </div>
        </div>
        
        <script>
            const form = document.getElementById('joinForm');
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');
            const errorAlert = document.getElementById('errorAlert');
            const errorText = document.getElementById('errorText');
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Reset messages
                successMessage.classList.remove('show');
                errorAlert.classList.remove('show');
                
                // Get form values
                const fullName = document.getElementById('fullName').value.trim();
                const email = document.getElementById('email').value.trim();
                
                // Validation
                if (!fullName || fullName.length < 2) {
                    document.getElementById('nameError').style.display = 'block';
                    return;
                } else {
                    document.getElementById('nameError').style.display = 'none';
                }
                
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                    document.getElementById('emailError').style.display = 'block';
                    return;
                } else {
                    document.getElementById('emailError').style.display = 'none';
                }
                
                // Disable button
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Registering...</span>';
                
                try {
                    // Submit to API
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ fullName, email })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Show success message with access details
                        document.getElementById('displayUniqueCode').textContent = data.uniqueCode;
                        successMessage.classList.add('show');
                        form.reset();
                        
                    } else {
                        errorText.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + data.message;
                        errorAlert.classList.add('show');
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    errorText.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please check your connection and try again.';
                    errorAlert.classList.add('show');
                } finally {
                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-rocket"></i> <span>Join Now</span>';
                }
            });
        </script>
    </body>
    </html>
  `)
})

// Admin Dashboard
app.get('/admin', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard - DeepMine AI CRM</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0B0F1E 0%, #1a1f3a 100%);
                color: #fff;
                min-height: 100vh;
            }
            
            .login-container {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
          ify-content: center;
                padding: 20px;
            }
            
            .login-card {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(41, 121, 255, 0.3);
                border-radius: 24px;
                padding: 48px;
                max-width: 400px;
                width: 100%;
            }
            
            .dashboard-container {
                display: none;
                padding: 40px 20px;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .dashboard-container.show {
                display: block;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 40px;
                flex-wrap: wrap;
                gap: 20px;
            }
            
            .dashboard-header h1 {
                font-size: 32px;
                background: linear-gradient(135deg, #2979FF, #33F0FF);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .actions {
                display: flex;
                gap: 12px;
            }
            
            .btn {
                padding: 12px 24px;
                border-radius: 10px;
                border: none;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #2979FF, #33F0FF);
                color: #fff;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(41, 121, 255, 0.4);
            }
            
            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
                margin-bottom: 40px;
            }
            
            .stat-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(41, 121, 255, 0.3);
                border-radius: 16px;
                padding: 24px;
            }
            
            .stat-label {
                color: #a8b3cf;
                font-size: 14px;
                margin-bottom: 8px;
            }
            
            .stat-value {
                font-size: 36px;
                font-weight: 700;
                color: #2979FF;
            }
            
            .table-container {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(41, 121, 255, 0.3);
                border-radius: 16px;
                padding: 24px;
                overflow-x: auto;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
            }
            
            thead {
                border-bottom: 2px solid rgba(41, 121, 255, 0.3);
            }
            
            th {
                text-align: left;
                padding: 16px;
                font-weight: 600;
                color: #fff;
                cursor: pointer;
                white-space: nowrap;
            }
            
            th:hover {
                color: #2979FF;
            }
            
            td {
                padding: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                color: #a8b3cf;
            }
            
            tr:hover {
                background: rgba(41, 121, 255, 0.05);
            }
            
            input {
                width: 100%;
                padding: 14px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(41, 121, 255, 0.3);
                border-radius: 12px;
                color: #fff;
                font-size: 16px;
                margin-bottom: 16px;
            }
            
            input:focus {
                outline: none;
                border-color: #2979FF;
                box-shadow: 0 0 0 3px rgba(41, 121, 255, 0.1);
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                color: #fff;
                font-weight: 500;
            }
            
            .search-box {
                margin-bottom: 24px;
            }
            
            .search-box input {
                margin-bottom: 0;
            }
            
            .badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .badge-success {
                background: rgba(52, 211, 153, 0.2);
                color: #34D399;
            }
            
            .badge-warning {
                background: rgba(251, 191, 36, 0.2);
                color: #FBB F24;
            }
        </style>
    </head>
    <body>
        <!-- Login Form -->
        <div class="login-container" id="loginContainer">
            <div class="login-card">
                <h1 style="text-align: center; margin-bottom: 32px; background: linear-gradient(135deg, #2979FF, #33F0FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Admin Login</h1>
                <form id="loginForm">
                    <label>Username</label>
                    <input type="text" id="username" required placeholder="Enter username">
                    
                    <label>Password</label>
                    <input type="password" id="password" required placeholder="Enter password">
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Login</span>
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Dashboard -->
        <div class="dashboard-container" id="dashboard">
            <div class="dashboard-header">
                <h1><i class="fas fa-chart-line"></i> CRM Dashboard</h1>
                <div class="actions">
                    <button class="btn btn-primary" onclick="exportCSV()">
                        <i class="fas fa-download"></i>
                        Export CSV
                    </button>
                    <button class="btn btn-secondary" onclick="refreshData()">
                        <i class="fas fa-sync-alt"></i>
                        Refresh
                    </button>
                    <button class="btn btn-secondary" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Registrations</div>
                    <div class="stat-value" id="totalCount">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Today's Registrations</div>
                    <div class="stat-value" id="todayCount">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Emails Sent</div>
                    <div class="stat-value" id="emailCount">0</div>
                </div>
            </div>
            
            <div class="table-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="🔍 Search by name or email...">
                </div>
                
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th onclick="sortTable(0)">ID <i class="fas fa-sort"></i></th>
                            <th onclick="sortTable(1)">Unique Code <i class="fas fa-sort"></i></th>
                            <th onclick="sortTable(2)">Full Name <i class="fas fa-sort"></i></th>
                            <th onclick="sortTable(3)">Email <i class="fas fa-sort"></i></th>
                            <th onclick="sortTable(4)">Access Code <i class="fas fa-sort"></i></th>
                            <th onclick="sortTable(5)">Signup Date <i class="fas fa-sort"></i></th>
                            <th onclick="sortTable(6)">Email Status <i class="fas fa-sort"></i></th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <tr>
                            <td colspan="8" style="text-align: center; padding: 40px;">Loading data...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <script>
            let registrations = [];
            let isLoggedIn = false;
            
            // Login handler
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                try {
                    const response = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        isLoggedIn = true;
                        document.getElementById('loginContainer').style.display = 'none';
                        document.getElementById('dashboard').classList.add('show');
                        loadData();
                    } else {
                        alert('Invalid credentials');
                    }
                } catch (error) {
                    alert('Login failed');
                }
            });
            
            // Load registrations data
            async function loadData() {
                try {
                    const response = await fetch('/api/admin/registrations');
                    const data = await response.json();
                    
                    if (data.success) {
                        registrations = data.registrations;
                        updateStats();
                        renderTable();
                    }
                } catch (error) {
                    console.error('Failed to load data:', error);
                }
            }
            
            // Update statistics
            function updateStats() {
                document.getElementById('totalCount').textContent = registrations.length;
                
                const today = new Date().toISOString().split('T')[0];
                const todayRegs = registrations.filter(r => r.signup_date.startsWith(today));
                document.getElementById('todayCount').textContent = todayRegs.length;
                
                const emailsSent = registrations.filter(r => r.email_sent === 1);
                document.getElementById('emailCount').textContent = emailsSent.length;
            }
            
            // Render table
            function renderTable(data = registrations) {
                const tbody = document.getElementById('tableBody');
                
                if (data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No registrations found</td></tr>';
                    return;
                }
                
                tbody.innerHTML = data.map(r => '<tr>' +
                    '<td>' + r.id + '</td>' +
                    '<td><strong>' + r.unique_code + '</strong></td>' +
                    '<td>' + r.full_name + '</td>' +
                    '<td>' + r.email + '</td>' +
                    '<td><span class="badge badge-success">' + r.access_code + '</span></td>' +
                    '<td>' + r.signup_date + '</td>' +
                    '<td>' + (r.email_sent ? '<span class="badge badge-success">Sent</span>' : '<span class="badge badge-warning">Pending</span>') + '</td>' +
                    '<td><button class="btn-delete" onclick="deleteRegistration(' + r.id + ', &quot;' + r.email + '&quot;)" style="padding: 6px 12px; background: rgba(239, 68, 68, 0.2); color: #EF4444; border: 1px solid #EF4444; border-radius: 6px; cursor: pointer; font-size: 12px;"><i class="fas fa-trash"></i> Delete</button></td>' +
                '</tr>').join('');
            }
            
            // Delete registration
            async function deleteRegistration(id, email) {
                if (!confirm('Are you sure you want to delete registration for ' + email + '?')) {
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/registration/' + id, {
                        method: 'DELETE'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Remove from local array
                        registrations = registrations.filter(r => r.id !== id);
                        updateStats();
                        renderTable();
                        alert('Registration deleted successfully');
                    } else {
                        alert('Failed to delete registration');
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    alert('Error deleting registration');
                }
            }
            
            // Search functionality
            document.getElementById('searchInput').addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = registrations.filter(r => 
                    r.full_name.toLowerCase().includes(query) || 
                    r.email.toLowerCase().includes(query)
                );
                renderTable(filtered);
            });
            
            // Sort table
            function sortTable(columnIndex) {
                const keys = ['id', 'unique_code', 'full_name', 'email', 'access_code', 'signup_date', 'email_sent'];
                const key = keys[columnIndex];
                
                registrations.sort((a, b) => {
                    if (a[key] < b[key]) return -1;
                    if (a[key] > b[key]) return 1;
                    return 0;
                });
                
                renderTable();
            }
            
            // Export CSV
            function exportCSV() {
                window.open('/api/admin/export', '_blank');
            }
            
            // Refresh data
            function refreshData() {
                loadData();
            }
            
            // Logout
            function logout() {
                isLoggedIn = false;
                document.getElementById('dashboard').classList.remove('show');
                document.getElementById('loginContainer').style.display = 'flex';
                document.getElementById('loginForm').reset();
            }
        </script>
    </body>
    </html>
  `)
})

// ========================================
// CLOUDFLARE WORKERS CRON TRIGGER
// ========================================
import { calculateDailyEarnings } from './cron'

/**
 * Cloudflare Workers Scheduled Event Handler
 * Automatically triggers daily at midnight UTC based on Cloudflare Dashboard cron configuration
 * Schedule: "0 0 * * *" (Daily at 00:00 UTC)
 * 
 * To configure:
 * 1. Go to Cloudflare Dashboard → Pages → deepmine-ai
 * 2. Settings → Functions → Cron Triggers
 * 3. Add schedule: "0 0 * * *"
 */
export async function scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
  console.log(`🕐 [CRON TRIGGER] Scheduled event fired at ${new Date().toISOString()}`)
  
  // Use waitUntil to ensure the cron job completes even if the response is already sent
  ctx.waitUntil(calculateDailyEarnings(env.DB))
}

export default app
