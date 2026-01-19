// Integration Hooks
// Trigger email automation at key user events

import type { Context } from 'hono'
import { EmailAutomationService } from '../services/email-automation'

/**
 * Hook: User Registration
 * Trigger Segment A flow (No KYC)
 */
export async function onUserRegistered(c: Context, userId: number, createdAt: string) {
  try {
    const emailService = new EmailAutomationService(c.env.DB, c.env.RESEND_API_KEY)
    await emailService.initializeUserState(userId, createdAt)
    console.log(`🎯 [AUTOMATION] Segment A triggered for user ${userId}`)
  } catch (error) {
    console.error('❌ [AUTOMATION] Error triggering Segment A:', error)
    // Don't fail registration if automation fails
  }
}

/**
 * Hook: KYC Approved
 * Trigger Segment B flow (KYC done, no purchase)
 */
export async function onKycApproved(c: Context, userId: number) {
  try {
    const emailService = new EmailAutomationService(c.env.DB, c.env.RESEND_API_KEY)
    await emailService.triggerSegmentB(userId)
    console.log(`🎯 [AUTOMATION] Segment B triggered for user ${userId}`)
  } catch (error) {
    console.error('❌ [AUTOMATION] Error triggering Segment B:', error)
  }
}

/**
 * Hook: Deposit Approved
 * Trigger Segment C flow (Deposit made, no machine) - HIGHEST PRIORITY
 */
export async function onDepositApproved(c: Context, userId: number) {
  try {
    const emailService = new EmailAutomationService(c.env.DB, c.env.RESEND_API_KEY)
    await emailService.triggerSegmentC(userId)
    console.log(`🎯 [AUTOMATION] Segment C triggered for user ${userId} (URGENT)`)
  } catch (error) {
    console.error('❌ [AUTOMATION] Error triggering Segment C:', error)
  }
}

/**
 * Hook: First Machine Purchase
 * Complete automation flow
 */
export async function onFirstMachinePurchased(c: Context, userId: number) {
  try {
    const emailService = new EmailAutomationService(c.env.DB, c.env.RESEND_API_KEY)
    await emailService.completeAutomation(userId)
    console.log(`✅ [AUTOMATION] Automation completed for user ${userId}`)
  } catch (error) {
    console.error('❌ [AUTOMATION] Error completing automation:', error)
  }
}

/**
 * Hook: User Opts Out
 * Stop sending emails to user
 */
export async function onUserOptedOut(c: Context, userId: number, segment: 'all' | 'segment_a' | 'segment_b' | 'segment_c') {
  try {
    const column = segment === 'all' ? 'opted_out_all' : `opted_out_${segment}`
    await c.env.DB.prepare(
      `UPDATE user_automation_state 
       SET ${column} = 1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`
    ).bind(userId).run()

    console.log(`🚫 [AUTOMATION] User ${userId} opted out of ${segment}`)
  } catch (error) {
    console.error('❌ [AUTOMATION] Error processing opt-out:', error)
  }
}
