// Email Automation Service
// Handles automated email campaigns based on user behavior

import type { D1Database } from '@cloudflare/workers-types'
import { Resend } from 'resend'

interface EmailCampaignConfig {
  segmentA: {
    trigger: string // 'User signs up'
    delays: { A1: number; A2: number; A3: number; A4: number } // in hours
  }
  segmentB: {
    trigger: string // 'KYC approved'
    delays: { B1: number; B2: number; B3: number; B4: number }
  }
  segmentC: {
    trigger: string // 'Deposit received'
    delays: { C1: number; C2: number; C3: number; C4: number }
  }
}

const CAMPAIGN_CONFIG: EmailCampaignConfig = {
  segmentA: {
    trigger: 'User signs up',
    delays: {
      A1: 2, // 2 hours after signup if no KYC
      A2: 26, // 24 hours after A1 (2 + 24 = 26 total)
      A3: 74, // 48 hours after A2 (26 + 48 = 74 total)
      A4: 170, // 96 hours after A3 (74 + 96 = 170 total)
    },
  },
  segmentB: {
    trigger: 'KYC approved',
    delays: {
      B1: 0, // Immediate
      B2: 48, // 48 hours after KYC approval
      B3: 120, // 72 hours after B2 (48 + 72 = 120 total)
      B4: 240, // 120 hours after B3 (120 + 120 = 240 total)
    },
  },
  segmentC: {
    trigger: 'Deposit received',
    delays: {
      C1: 1, // 1 hour after deposit if no machine
      C2: 7, // 6 hours after C1 (1 + 6 = 7 total)
      C3: 31, // 24 hours after C2 (7 + 24 = 31 total)
      C4: 79, // 48 hours after C3 (31 + 48 = 79 total)
    },
  },
}

export class EmailAutomationService {
  constructor(
    private db: D1Database,
    private resendApiKey: string
  ) {}

  /**
   * Initialize automation state for new user
   */
  async initializeUserState(userId: number, createdAt: string) {
    await this.db
      .prepare(
        `INSERT INTO user_automation_state (user_id, segment_a_active, created_at, updated_at)
         VALUES (?, 1, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET 
           segment_a_active = 1,
           updated_at = ?`
      )
      .bind(userId, createdAt, createdAt, createdAt)
      .run()

    // Schedule first Segment A email (2 hours after signup)
    await this.scheduleEmail(userId, 'segment_a', 'A1', CAMPAIGN_CONFIG.segmentA.delays.A1)
  }

  /**
   * Trigger Segment B flow when KYC is approved
   */
  async triggerSegmentB(userId: number) {
    const now = new Date().toISOString()

    // Deactivate Segment A
    await this.db
      .prepare(
        `UPDATE user_automation_state 
         SET segment_a_active = 0,
             segment_b_active = 1,
             completed_kyc_at = ?,
             updated_at = ?
         WHERE user_id = ?`
      )
      .bind(now, now, userId)
      .run()

    // Cancel pending Segment A emails
    await this.cancelPendingEmails(userId, 'segment_a')

    // Schedule Segment B emails
    await this.scheduleEmail(userId, 'segment_b', 'B1', CAMPAIGN_CONFIG.segmentB.delays.B1)
  }

  /**
   * Trigger Segment C flow when deposit is received (HIGHEST PRIORITY)
   */
  async triggerSegmentC(userId: number) {
    const now = new Date().toISOString()

    // Deactivate Segment B
    await this.db
      .prepare(
        `UPDATE user_automation_state 
         SET segment_b_active = 0,
             segment_c_active = 1,
             first_deposit_at = ?,
             updated_at = ?
         WHERE user_id = ?`
      )
      .bind(now, now, userId)
      .run()

    // Cancel pending Segment B emails
    await this.cancelPendingEmails(userId, 'segment_b')

    // Schedule Segment C emails (URGENT - starts in 1 hour)
    await this.scheduleEmail(userId, 'segment_c', 'C1', CAMPAIGN_CONFIG.segmentC.delays.C1)
  }

  /**
   * Complete automation when user makes first purchase
   */
  async completeAutomation(userId: number) {
    const now = new Date().toISOString()

    await this.db
      .prepare(
        `UPDATE user_automation_state 
         SET segment_a_active = 0,
             segment_b_active = 0,
             segment_c_active = 0,
             completed_first_purchase_at = ?,
             updated_at = ?
         WHERE user_id = ?`
      )
      .bind(now, now, userId)
      .run()

    // Cancel all pending emails
    await this.cancelPendingEmails(userId, 'segment_a')
    await this.cancelPendingEmails(userId, 'segment_b')
    await this.cancelPendingEmails(userId, 'segment_c')
  }

  /**
   * Schedule an email to be sent
   */
  private async scheduleEmail(
    userId: number,
    campaignType: string,
    emailSequence: string,
    delayHours: number
  ) {
    const scheduledFor = new Date()
    scheduledFor.setHours(scheduledFor.getHours() + delayHours)

    await this.db
      .prepare(
        `INSERT INTO email_campaigns (user_id, campaign_type, email_sequence, status, scheduled_for)
         VALUES (?, ?, ?, 'pending', ?)`
      )
      .bind(userId, campaignType, emailSequence, scheduledFor.toISOString())
      .run()

    console.log(
      `📧 [EMAIL AUTOMATION] Scheduled ${campaignType} ${emailSequence} for user ${userId} at ${scheduledFor.toISOString()}`
    )
  }

  /**
   * Cancel pending emails for a campaign
   */
  private async cancelPendingEmails(userId: number, campaignType: string) {
    await this.db
      .prepare(
        `UPDATE email_campaigns 
         SET status = 'skipped', updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND campaign_type = ? AND status = 'pending'`
      )
      .bind(userId, campaignType)
      .run()

    console.log(`🚫 [EMAIL AUTOMATION] Cancelled pending ${campaignType} emails for user ${userId}`)
  }

  /**
   * Process pending emails (called by cron job)
   */
  async processPendingEmails() {
    const now = new Date().toISOString()

    // Get all pending emails that are due
    const { results: pendingEmails } = await this.db
      .prepare(
        `SELECT ec.*, u.email, u.full_name, uas.opted_out_all,
                CASE ec.campaign_type
                  WHEN 'segment_a' THEN uas.opted_out_segment_a
                  WHEN 'segment_b' THEN uas.opted_out_segment_b
                  WHEN 'segment_c' THEN uas.opted_out_segment_c
                END as segment_opted_out
         FROM email_campaigns ec
         JOIN users u ON ec.user_id = u.id
         JOIN user_automation_state uas ON ec.user_id = uas.user_id
         WHERE ec.status = 'pending' 
           AND ec.scheduled_for <= ?
           AND uas.opted_out_all = 0
         ORDER BY 
           CASE ec.campaign_type 
             WHEN 'segment_c' THEN 1  -- Highest priority
             WHEN 'segment_b' THEN 2
             WHEN 'segment_a' THEN 3
           END,
           ec.scheduled_for ASC
         LIMIT 50`
      )
      .bind(now)
      .all()

    console.log(`📨 [EMAIL AUTOMATION] Processing ${pendingEmails?.length || 0} pending emails`)

    for (const email of pendingEmails || []) {
      // Skip if user opted out of this segment
      if (email.segment_opted_out === 1) {
        await this.markEmailSkipped(email.id, 'User opted out of this segment')
        continue
      }

      // Check if user still qualifies for this email
      const stillQualifies = await this.checkUserQualification(email)
      if (!stillQualifies) {
        await this.markEmailSkipped(email.id, 'User no longer qualifies')
        continue
      }

      // Send the email
      await this.sendEmail(email)

      // Schedule next email in sequence if applicable
      await this.scheduleNextEmail(email)
    }
  }

  /**
   * Check if user still qualifies for the email
   */
  private async checkUserQualification(email: any): Promise<boolean> {
    const { results } = await this.db
      .prepare(
        `SELECT u.*, uas.*, 
                COUNT(DISTINCT m.id) as machine_count,
                COUNT(DISTINCT d.id) as deposit_count
         FROM users u
         JOIN user_automation_state uas ON u.id = uas.user_id
         LEFT JOIN mining_packages m ON u.id = m.user_id
         LEFT JOIN deposits d ON u.id = d.user_id AND d.status = 'approved'
         WHERE u.id = ?
         GROUP BY u.id`
      )
      .bind(email.user_id)
      .all()

    const user = results?.[0]
    if (!user) return false

    // Segment A: User should NOT have completed KYC
    if (email.campaign_type === 'segment_a') {
      return user.kyc_status !== 'approved'
    }

    // Segment B: User should have KYC but NO machines
    if (email.campaign_type === 'segment_b') {
      return user.kyc_status === 'approved' && user.machine_count === 0
    }

    // Segment C: User should have deposit but NO machines
    if (email.campaign_type === 'segment_c') {
      return user.deposit_count > 0 && user.machine_count === 0
    }

    return false
  }

  /**
   * Send email via Resend
   */
  private async sendEmail(campaignEmail: any) {
    try {
      // Get email template
      const { results: templates } = await this.db
        .prepare(
          `SELECT * FROM email_templates 
           WHERE template_key = ? AND active = 1`
        )
        .bind(`${campaignEmail.campaign_type}_email_${campaignEmail.email_sequence.replace(/[A-Z]/g, '').substring(0, 1)}`)
        .all()

      const template = templates?.[0]
      if (!template) {
        await this.markEmailFailed(campaignEmail.id, 'Template not found')
        return
      }

      // Initialize Resend
      const resend = new Resend(this.resendApiKey)

      // Personalize content
      const html = template.html_content
        .replace(/{{full_name}}/g, campaignEmail.full_name || 'there')
        .replace(/{{email}}/g, campaignEmail.email)

      const text = template.text_content?.replace(/{{full_name}}/g, campaignEmail.full_name || 'there')

      // Send via Resend
      const { data, error } = await resend.emails.send({
        from: `${template.from_name} <${template.from_email}>`,
        to: [campaignEmail.email],
        subject: template.subject,
        html,
        text,
        tags: [
          { name: 'campaign', value: campaignEmail.campaign_type },
          { name: 'sequence', value: campaignEmail.email_sequence },
          { name: 'user_id', value: String(campaignEmail.user_id) },
        ],
      })

      if (error) {
        await this.markEmailFailed(campaignEmail.id, error.message)
        console.error(`❌ [EMAIL] Failed to send ${campaignEmail.email_sequence}:`, error)
        return
      }

      // Mark as sent
      await this.db
        .prepare(
          `UPDATE email_campaigns 
           SET status = 'sent', sent_at = ?, resend_email_id = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`
        )
        .bind(new Date().toISOString(), data?.id || null, campaignEmail.id)
        .run()

      // Update user automation state
      await this.db
        .prepare(
          `UPDATE user_automation_state 
           SET ${campaignEmail.campaign_type}_last_email = ?,
               ${campaignEmail.campaign_type}_last_sent = ?,
               updated_at = CURRENT_TIMESTAMP
           WHERE user_id = ?`
        )
        .bind(campaignEmail.email_sequence, new Date().toISOString(), campaignEmail.user_id)
        .run()

      console.log(
        `✅ [EMAIL] Sent ${campaignEmail.campaign_type} ${campaignEmail.email_sequence} to ${campaignEmail.email}`
      )
    } catch (error: any) {
      await this.markEmailFailed(campaignEmail.id, error.message)
      console.error(`❌ [EMAIL] Error sending email:`, error)
    }
  }

  /**
   * Schedule next email in sequence
   */
  private async scheduleNextEmail(email: any) {
    const sequence = email.email_sequence
    const campaignType = email.campaign_type

    let nextSequence: string | null = null
    let delayHours = 0

    if (campaignType === 'segment_a') {
      const sequences = { A1: 'A2', A2: 'A3', A3: 'A4' }
      nextSequence = sequences[sequence as keyof typeof sequences] || null
      if (nextSequence === 'A2') delayHours = CAMPAIGN_CONFIG.segmentA.delays.A2 - CAMPAIGN_CONFIG.segmentA.delays.A1
      if (nextSequence === 'A3') delayHours = CAMPAIGN_CONFIG.segmentA.delays.A3 - CAMPAIGN_CONFIG.segmentA.delays.A2
      if (nextSequence === 'A4') delayHours = CAMPAIGN_CONFIG.segmentA.delays.A4 - CAMPAIGN_CONFIG.segmentA.delays.A3
    } else if (campaignType === 'segment_b') {
      const sequences = { B1: 'B2', B2: 'B3', B3: 'B4' }
      nextSequence = sequences[sequence as keyof typeof sequences] || null
      if (nextSequence === 'B2') delayHours = CAMPAIGN_CONFIG.segmentB.delays.B2 - CAMPAIGN_CONFIG.segmentB.delays.B1
      if (nextSequence === 'B3') delayHours = CAMPAIGN_CONFIG.segmentB.delays.B3 - CAMPAIGN_CONFIG.segmentB.delays.B2
      if (nextSequence === 'B4') delayHours = CAMPAIGN_CONFIG.segmentB.delays.B4 - CAMPAIGN_CONFIG.segmentB.delays.B3
    } else if (campaignType === 'segment_c') {
      const sequences = { C1: 'C2', C2: 'C3', C3: 'C4' }
      nextSequence = sequences[sequence as keyof typeof sequences] || null
      if (nextSequence === 'C2') delayHours = CAMPAIGN_CONFIG.segmentC.delays.C2 - CAMPAIGN_CONFIG.segmentC.delays.C1
      if (nextSequence === 'C3') delayHours = CAMPAIGN_CONFIG.segmentC.delays.C3 - CAMPAIGN_CONFIG.segmentC.delays.C2
      if (nextSequence === 'C4') delayHours = CAMPAIGN_CONFIG.segmentC.delays.C4 - CAMPAIGN_CONFIG.segmentC.delays.C3
    }

    if (nextSequence && delayHours > 0) {
      await this.scheduleEmail(email.user_id, campaignType, nextSequence, delayHours)
    }
  }

  /**
   * Mark email as failed
   */
  private async markEmailFailed(campaignId: number, errorMessage: string) {
    await this.db
      .prepare(
        `UPDATE email_campaigns 
         SET status = 'failed', error_message = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(errorMessage, campaignId)
      .run()
  }

  /**
   * Mark email as skipped
   */
  private async markEmailSkipped(campaignId: number, reason: string) {
    await this.db
      .prepare(
        `UPDATE email_campaigns 
         SET status = 'skipped', error_message = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(reason, campaignId)
      .run()
  }
}
