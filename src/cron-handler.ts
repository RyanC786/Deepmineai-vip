// Cron Jobs Handler
// Handles scheduled tasks like email automation

import type { D1Database } from '@cloudflare/workers-types'
import { EmailAutomationService } from './services/email-automation'

export interface CronEnv {
  DB: D1Database
  RESEND_API_KEY: string
}

/**
 * Scheduled cron handler
 * Runs every hour to process email automation
 */
export async function handleScheduled(event: ScheduledEvent, env: CronEnv, ctx: ExecutionContext) {
  console.log('⏰ [CRON] Scheduled event triggered:', new Date().toISOString())

  try {
    // Initialize email automation service
    const emailService = new EmailAutomationService(env.DB, env.RESEND_API_KEY)

    // Process pending emails
    await emailService.processPendingEmails()

    console.log('✅ [CRON] Email automation completed successfully')
  } catch (error: any) {
    console.error('❌ [CRON] Error processing email automation:', error)
    // Don't throw - let cron continue
  }
}

/**
 * Manual trigger for testing (HTTP endpoint)
 * GET /api/cron/trigger-email-automation
 */
export async function triggerEmailAutomationManually(env: CronEnv) {
  console.log('🔧 [MANUAL TRIGGER] Email automation triggered manually')

  try {
    const emailService = new EmailAutomationService(env.DB, env.RESEND_API_KEY)
    await emailService.processPendingEmails()

    return {
      success: true,
      message: 'Email automation processed successfully',
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('❌ [MANUAL TRIGGER] Error:', error)
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
}
