// Email Automation Cron Endpoint
// Called by cron-job.org every hour to process automated emails

import { Hono } from 'hono'
import { EmailAutomationService } from '../services/email-automation'

const emailCron = new Hono()

/**
 * Email Automation Cron Endpoint
 * URL: /api/cron/email-automation
 * 
 * This endpoint is called by cron-job.org every hour
 * 
 * Setup in cron-job.org:
 * - URL: https://www.deepmineai.vip/api/cron/email-automation
 * - Method: GET
 * - Schedule: Every hour (0 * * * *)
 * - Optional: Add ?secret=YOUR_SECRET_KEY for security
 */
emailCron.get('/', async (c) => {
  try {
    console.log('⏰ [EMAIL CRON] Starting email automation processing...')

    // Optional: Verify secret key for security
    const secret = c.req.query('secret')
    const expectedSecret = c.env.EMAIL_CRON_SECRET || 'your-secret-key-here'
    
    if (secret !== expectedSecret) {
      console.error('❌ [EMAIL CRON] Invalid or missing secret key')
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401)
    }

    // Check if RESEND_API_KEY is configured
    if (!c.env.RESEND_API_KEY) {
      console.error('❌ [EMAIL CRON] RESEND_API_KEY not configured')
      return c.json({
        success: false,
        error: 'RESEND_API_KEY not configured'
      }, 500)
    }

    // Initialize email automation service
    const emailService = new EmailAutomationService(c.env.DB, c.env.RESEND_API_KEY)

    // Process pending emails
    const startTime = Date.now()
    await emailService.processPendingEmails()
    const duration = Date.now() - startTime

    console.log(`✅ [EMAIL CRON] Email automation completed in ${duration}ms`)

    return c.json({
      success: true,
      message: 'Email automation processed successfully',
      duration_ms: duration,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ [EMAIL CRON] Error processing email automation:', error)
    return c.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

/**
 * Manual trigger endpoint (for testing)
 * URL: /api/cron/email-automation/test
 */
emailCron.get('/test', async (c) => {
  try {
    console.log('🔧 [EMAIL CRON TEST] Manual trigger started...')

    if (!c.env.RESEND_API_KEY) {
      return c.json({
        success: false,
        error: 'RESEND_API_KEY not configured'
      }, 500)
    }

    const emailService = new EmailAutomationService(c.env.DB, c.env.RESEND_API_KEY)
    await emailService.processPendingEmails()

    return c.json({
      success: true,
      message: 'Test trigger completed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ [EMAIL CRON TEST] Error:', error)
    return c.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

/**
 * Status endpoint - check email automation health
 * URL: /api/cron/email-automation/status
 */
emailCron.get('/status', async (c) => {
  try {
    // Get pending email count
    const { results: pending } = await c.env.DB
      .prepare('SELECT COUNT(*) as count FROM email_campaigns WHERE status = ?')
      .bind('pending')
      .all()

    // Get sent email count (last 24 hours)
    const { results: sent } = await c.env.DB
      .prepare(`
        SELECT COUNT(*) as count 
        FROM email_campaigns 
        WHERE status = 'sent' 
          AND sent_at >= datetime('now', '-24 hours')
      `)
      .all()

    // Get failed email count (last 24 hours)
    const { results: failed } = await c.env.DB
      .prepare(`
        SELECT COUNT(*) as count 
        FROM email_campaigns 
        WHERE status = 'failed' 
          AND updated_at >= datetime('now', '-24 hours')
      `)
      .all()

    // Get active automation users
    const { results: activeUsers } = await c.env.DB
      .prepare(`
        SELECT COUNT(*) as count 
        FROM user_automation_state 
        WHERE segment_a_active = 1 
           OR segment_b_active = 1 
           OR segment_c_active = 1
      `)
      .all()

    return c.json({
      success: true,
      status: {
        pending_emails: pending?.[0]?.count || 0,
        sent_last_24h: sent?.[0]?.count || 0,
        failed_last_24h: failed?.[0]?.count || 0,
        active_automation_users: activeUsers?.[0]?.count || 0,
        resend_configured: !!c.env.RESEND_API_KEY,
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ [EMAIL CRON STATUS] Error:', error)
    return c.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

export default emailCron
