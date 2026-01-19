// KYC Auto-Sync Routes for DeepMine AI Platform
// Automatically syncs KYC status from iDenfy for pending approvals
import { Hono } from 'hono'
import { getIdenfyStatus } from '../utils/idenfy'
import { sendKYCApprovedEmail } from '../utils/email'

type Bindings = {
  DB: D1Database
  IDENFY_API_KEY: string
  IDENFY_API_SECRET: string
  RESEND_API_KEY: string
  CRON_SECRET: string
}

const kycAutoSync = new Hono<{ Bindings: Bindings }>()

/**
 * POST /api/kyc/auto-sync
 * Automatically sync all pending KYC submissions from iDenfy
 * Can be triggered by:
 * 1. External cron service (cron-job.org)
 * 2. Cloudflare Workers Cron Trigger
 * 3. Manual admin trigger
 */
kycAutoSync.post('/auto-sync', async (c) => {
  try {
    // Verify cron secret (optional but recommended)
    const providedSecret = c.req.header('X-Cron-Secret') || c.req.query('secret')
    const expectedSecret = c.env.CRON_SECRET || 'your-secret-key-here'
    
    if (providedSecret && providedSecret !== expectedSecret) {
      console.error('❌ Invalid cron secret')
      return c.json({ success: false, message: 'Invalid secret' }, 401)
    }

    const { DB } = c.env
    
    console.log('🔄 [AUTO-SYNC] Starting KYC auto-sync job...')
    
    // Get all KYC submissions that might need syncing
    // Criteria: submitted but not approved/rejected, and has scan_ref
    const submissions = await DB.prepare(`
      SELECT 
        k.id, k.user_id, k.scan_ref, k.review_status,
        u.email, u.full_name, u.kyc_status
      FROM kyc_submissions k
      INNER JOIN users u ON u.id = k.user_id
      WHERE k.scan_ref IS NOT NULL
        AND k.review_status IN ('pending', 'reviewing')
        AND u.kyc_status NOT IN ('approved', 'rejected')
      ORDER BY k.submitted_at DESC
      LIMIT 50
    `).all()

    if (!submissions.results || submissions.results.length === 0) {
      console.log('✅ [AUTO-SYNC] No pending submissions to sync')
      return c.json({
        success: true,
        message: 'No pending submissions found',
        synced: 0,
        approved: 0,
        rejected: 0
      })
    }

    console.log(`📋 [AUTO-SYNC] Found ${submissions.results.length} submissions to check`)

    let synced = 0
    let approved = 0
    let rejected = 0
    let errors = 0

    for (const submission of submissions.results) {
      const sub = submission as any
      
      try {
        console.log(`🔍 [AUTO-SYNC] Checking submission ${sub.id} (user ${sub.user_id}, scan: ${sub.scan_ref})`)

        // Fetch status from iDenfy
        const statusResult = await getIdenfyStatus(
          c.env.IDENFY_API_KEY,
          c.env.IDENFY_API_SECRET,
          sub.scan_ref
        )

        if (!statusResult.success || !statusResult.data) {
          console.warn(`⚠️ [AUTO-SYNC] Failed to get iDenfy status for submission ${sub.id}:`, statusResult.error)
          console.warn(`   Scan ref: ${sub.scan_ref}`)
          console.warn(`   This usually means: 1) User didn't complete verification, 2) Session expired, 3) Wrong scan reference`)
          errors++
          continue
        }

        // Log the full response for debugging
        console.log(`📋 [AUTO-SYNC] iDenfy response for submission ${sub.id}:`, JSON.stringify(statusResult.data).substring(0, 200))
        
        const idenfyStatus = statusResult.data.status?.overall || statusResult.data.final || statusResult.data.status

        // Only process if status changed
        if (!idenfyStatus) {
          console.log(`⏭️ [AUTO-SYNC] No status from iDenfy for submission ${sub.id}, skipping`)
          continue
        }

        let mappedStatus = sub.review_status
        let rejectionReason = ''
        let statusChanged = false

        // Handle all iDenfy approval statuses (including APPROVED_OFFLINE, AUTO_APPROVED, etc.)
        if ((idenfyStatus === 'APPROVED' || idenfyStatus === 'APPROVED_OFFLINE' || idenfyStatus === 'AUTO_APPROVED' || idenfyStatus.includes('APPROVED')) && sub.review_status !== 'approved') {
          mappedStatus = 'approved'
          statusChanged = true
          approved++
          console.log(`✅ [AUTO-SYNC] iDenfy status "${idenfyStatus}" mapped to approved`)
        } else if ((idenfyStatus === 'DENIED' || idenfyStatus === 'REJECTED' || idenfyStatus === 'DECLINED') && sub.review_status !== 'rejected') {
          mappedStatus = 'rejected'
          rejectionReason = statusResult.data.status?.suspicionReasons?.[0] || 'Verification failed'
          statusChanged = true
          rejected++
        } else if ((idenfyStatus === 'REVIEWING' || idenfyStatus === 'SUSPECTED' || idenfyStatus === 'ACTIVE') && sub.review_status === 'pending') {
          mappedStatus = 'reviewing'
          statusChanged = true
        }

        if (!statusChanged) {
          console.log(`✓ [AUTO-SYNC] Submission ${sub.id} status unchanged (${idenfyStatus}), skipping`)
          continue
        }

        console.log(`🔄 [AUTO-SYNC] Updating submission ${sub.id}: ${sub.review_status} → ${mappedStatus}`)

        // Update submission
        await DB.prepare(
          'UPDATE kyc_submissions SET review_status = ?, rejection_reason = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(mappedStatus, rejectionReason, sub.id).run()

        // Update user
        if (mappedStatus === 'approved') {
          await DB.prepare(
            'UPDATE users SET kyc_status = ?, kyc_approved_at = CURRENT_TIMESTAMP WHERE id = ?'
          ).bind('approved', sub.user_id).run()

          console.log(`✅ [AUTO-SYNC] User ${sub.user_id} (${sub.email}) approved!`)

          // Send approval email
          if (c.env.RESEND_API_KEY) {
            try {
              await sendKYCApprovedEmail(
                sub.email,
                sub.full_name || 'User',
                c.env.RESEND_API_KEY
              )
              console.log(`📧 [AUTO-SYNC] Approval email sent to ${sub.email}`)
            } catch (emailError) {
              console.warn(`⚠️ [AUTO-SYNC] Failed to send email to ${sub.email}:`, emailError)
              // Don't fail the sync if email fails
            }
          }
        } else if (mappedStatus === 'rejected') {
          await DB.prepare(
            'UPDATE users SET kyc_status = ? WHERE id = ?'
          ).bind('rejected', sub.user_id).run()

          console.log(`❌ [AUTO-SYNC] User ${sub.user_id} (${sub.email}) rejected: ${rejectionReason}`)
        }

        synced++

      } catch (error) {
        console.error(`❌ [AUTO-SYNC] Error processing submission ${sub.id}:`, error)
        errors++
        // Continue with next submission
      }
    }

    console.log(`✅ [AUTO-SYNC] Job complete: ${synced} synced, ${approved} approved, ${rejected} rejected, ${errors} errors`)

    return c.json({
      success: true,
      message: 'Auto-sync completed',
      synced,
      approved,
      rejected,
      errors,
      total_checked: submissions.results.length
    })

  } catch (error) {
    console.error('❌ [AUTO-SYNC] Job failed:', error)
    return c.json({ 
      success: false, 
      message: 'Auto-sync job failed', 
      error: String(error) 
    }, 500)
  }
})

/**
 * GET /api/kyc/auto-sync/status
 * Get status of auto-sync system (for monitoring)
 */
kycAutoSync.get('/auto-sync/status', async (c) => {
  try {
    const { DB } = c.env

    // Get counts
    const pending = await DB.prepare(
      'SELECT COUNT(*) as count FROM kyc_submissions WHERE review_status = ? AND scan_ref IS NOT NULL'
    ).bind('pending').first() as any

    const reviewing = await DB.prepare(
      'SELECT COUNT(*) as count FROM kyc_submissions WHERE review_status = ? AND scan_ref IS NOT NULL'
    ).bind('reviewing').first() as any

    return c.json({
      success: true,
      pending_count: pending?.count || 0,
      reviewing_count: reviewing?.count || 0,
      total_need_sync: (pending?.count || 0) + (reviewing?.count || 0)
    })

  } catch (error) {
    console.error('Status check error:', error)
    return c.json({ success: false, message: 'Failed to get status' }, 500)
  }
})

/**
 * GET /api/kyc/auto-sync/debug/:userId
 * Debug endpoint to check a specific user's KYC status
 */
kycAutoSync.get('/auto-sync/debug/:userId', async (c) => {
  try {
    const { DB } = c.env
    const userId = c.req.param('userId')

    // Get user info
    const user = await DB.prepare(
      'SELECT id, email, full_name, kyc_status, kyc_approved_at FROM users WHERE id = ?'
    ).bind(userId).first() as any

    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    // Get KYC submission
    const submission = await DB.prepare(
      'SELECT * FROM kyc_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1'
    ).bind(userId).first() as any

    // Get iDenfy status if scan_ref exists
    let idenfyStatus = null
    if (submission?.scan_ref) {
      try {
        const statusResult = await getIdenfyStatus(
          c.env.IDENFY_API_KEY,
          c.env.IDENFY_API_SECRET,
          submission.scan_ref
        )
        idenfyStatus = statusResult
      } catch (error) {
        idenfyStatus = { error: String(error) }
      }
    }

    return c.json({
      success: true,
      user,
      submission,
      idenfyStatus,
      hasApiKey: !!c.env.IDENFY_API_KEY,
      hasApiSecret: !!c.env.IDENFY_API_SECRET
    })

  } catch (error) {
    console.error('Debug check error:', error)
    return c.json({ success: false, message: 'Failed to get debug info', error: String(error) }, 500)
  }
})

export default kycAutoSync
