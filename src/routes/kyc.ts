// KYC routes for DeepMine AI Platform
import { Hono } from 'hono'
import { onKycApproved } from '../hooks/email-automation-hooks'
import {
  uploadToR2,
  getFromR2,
  generateKYCFileKey,
  isValidKYCFileType,
  isValidFileSize,
  getExtensionFromMimeType,
  parseMultipartFormData
} from '../utils/r2'
import {
  createIdenfyVerification,
  verifyIdenfyWebhook
} from '../utils/idenfy'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { sendKYCApprovedEmail } from '../utils/email'
import { fetchIdenfyDocuments } from '../lib/idenfy-documents'
import { backupKYCToGoogleDrive, sendKYCBackupNotification } from '../lib/google-drive'

type Bindings = {
  DB: D1Database
  KYC_BUCKET: R2Bucket
  IDENFY_API_KEY: string
  IDENFY_API_SECRET: string
  RESEND_API_KEY: string
  GOOGLE_SERVICE_ACCOUNT_KEY: string
  GOOGLE_DRIVE_KYC_FOLDER_ID: string
}

const kyc = new Hono<{ Bindings: Bindings }>()

/**
 * POST /api/kyc/init
 * Initialize KYC process with iDenfy
 */
kyc.post('/init', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const DB = c.env.DB
    
    // Get user details
    const user = await DB.prepare(
      'SELECT id, email, full_name, kyc_status FROM users WHERE id = ?'
    ).bind(userId).first() as any
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    if (user.kyc_status === 'approved') {
      return c.json({ success: false, message: 'KYC already approved' }, 400)
    }
    
    // Check if already has pending submission
    const existingKYC = await DB.prepare(
      'SELECT id, scan_ref FROM kyc_submissions WHERE user_id = ? AND review_status IN (?, ?)'
    ).bind(userId, 'pending', 'reviewing').first() as any
    
    // Always generate a fresh iDenfy verification token
    // (Old tokens can expire, so we create a new one each time)
    console.log('📋 Existing KYC submission:', existingKYC ? `ID: ${existingKYC.id}` : 'None')
    
    // Generate iDenfy verification token
    const [firstName, ...lastNameParts] = user.full_name.split(' ')
    const lastName = lastNameParts.join(' ') || firstName
    
    const tokenResult = await createIdenfyVerification(
      c.env.IDENFY_API_KEY,
      c.env.IDENFY_API_SECRET,
      {
        clientId: `user-${userId}`,
        firstName: firstName,
        lastName: lastName,
        email: user.email
      }
    )
    
    if (!tokenResult.success) {
      return c.json({ 
        success: false, 
        message: tokenResult.error || 'Failed to initialize KYC verification' 
      }, 500)
    }
    
    // Create or update KYC submission record
    if (existingKYC) {
      await DB.prepare(
        'UPDATE kyc_submissions SET scan_ref = ?, auth_token = ?, review_status = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(tokenResult.scanRef, tokenResult.token, 'pending', existingKYC.id).run()
    } else {
      await DB.prepare(
        'INSERT INTO kyc_submissions (user_id, scan_ref, auth_token, review_status) VALUES (?, ?, ?, ?)'
      ).bind(userId, tokenResult.scanRef, tokenResult.token, 'pending').run()
    }
    
    // NOTE: We DON'T update user's kyc_status to 'submitted' here
    // It will be updated to 'submitted' by the iDenfy webhook when they actually complete verification
    // This prevents showing "Under Review" when user just opened the iframe but didn't complete
    
    return c.json({
      success: true,
      authToken: tokenResult.token,
      scanRef: tokenResult.scanRef,
      message: 'KYC verification initialized successfully'
    })
    
  } catch (error) {
    console.error('KYC init error:', error)
    return c.json({ success: false, message: 'Failed to initialize KYC' }, 500)
  }
})

/**
 * GET /api/kyc/status
 * Get current KYC status
 */
kyc.get('/status', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const DB = c.env.DB
    
    const user = await DB.prepare(
      'SELECT kyc_status, kyc_submitted_at, kyc_approved_at FROM users WHERE id = ?'
    ).bind(userId).first() as any
    
    const kycSubmission = await DB.prepare(
      `SELECT id, applicant_id, review_status, rejection_reason, submitted_at, reviewed_at
       FROM kyc_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1`
    ).bind(userId).first() as any
    
    // If submission exists but has no applicant_id, it means iDenfy verification was never completed
    // Reset the status to allow user to try again - BUT ONLY IF NOT APPROVED!
    // CRITICAL: Don't reset if user is already approved (manual approval or synced from iDenfy)
    if (kycSubmission && !kycSubmission.applicant_id && 
        kycSubmission.review_status !== 'pending' && 
        kycSubmission.review_status !== 'approved' &&
        user.kyc_status !== 'approved') {
      console.log(`⚠️ Found incomplete KYC submission for user ${userId}, resetting to pending`)
      
      // Reset submission status to pending
      await DB.prepare(
        'UPDATE kyc_submissions SET review_status = ? WHERE id = ?'
      ).bind('pending', kycSubmission.id).run()
      
      // Reset user KYC status to pending
      await DB.prepare(
        'UPDATE users SET kyc_status = ? WHERE id = ?'
      ).bind('pending', userId).run()
      
      // Update local variables
      kycSubmission.review_status = 'pending'
      user.kyc_status = 'pending'
    }
    
    return c.json({
      success: true,
      kycStatus: user?.kyc_status || 'pending',
      submittedAt: user?.kyc_submitted_at,
      approvedAt: user?.kyc_approved_at,
      submission: kycSubmission
    })
    
  } catch (error) {
    console.error('KYC status error:', error)
    return c.json({ success: false, message: 'Failed to get KYC status' }, 500)
  }
})

/**
 * POST /api/kyc/webhook
 * iDenfy webhook for KYC status updates
 */
kyc.post('/webhook', async (c) => {
  try {
    const signature = c.req.header('Idenfy-Signature')
    const body = await c.req.text()
    
    console.log('iDenfy webhook received:', body)
    
    // Parse webhook data
    const data = JSON.parse(body)
    
    // Verify webhook signature if provided
    if (signature) {
      const isValid = verifyIdenfyWebhook(body, signature, c.env.IDENFY_API_SECRET)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return c.json({ success: false, message: 'Invalid signature' }, 401)
      }
    }
    
    const scanRef = data.scanRef || data.platform?.scanRef
    const status = data.status?.overall || data.final
    const clientId = data.clientId
    
    console.log('📋 Webhook data - scanRef:', scanRef, 'status:', status, 'clientId:', clientId)
    
    if (!scanRef) {
      console.error('Missing scanRef in webhook data')
      return c.json({ success: false, message: 'Missing scanRef' }, 400)
    }
    
    const DB = c.env.DB
    
    // Find submission by scanRef
    const submission = await DB.prepare(
      'SELECT id, user_id FROM kyc_submissions WHERE scan_ref = ?'
    ).bind(scanRef).first() as any
    
    let finalSubmission = submission
    
    if (!finalSubmission) {
      // Try finding by clientId if scanRef not found
      if (clientId) {
        const userId = clientId.replace('user-', '')
        const userSubmission = await DB.prepare(
          'SELECT id, user_id FROM kyc_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1'
        ).bind(userId).first() as any
        
        if (userSubmission) {
          // Update with scanRef
          await DB.prepare(
            'UPDATE kyc_submissions SET scan_ref = ? WHERE id = ?'
          ).bind(scanRef, userSubmission.id).run()
          
          finalSubmission = userSubmission
          console.log('✅ Found submission by clientId:', clientId, '-> userId:', userId)
        }
      }
      
      if (!finalSubmission) {
        console.error('❌ Submission not found for scanRef:', scanRef, 'clientId:', clientId)
        return c.json({ success: false, message: 'Submission not found' }, 404)
      }
    }
    
    // Map iDenfy status to our status
    let mappedStatus = 'reviewing'
    let rejectionReason = ''
    
    if (status === 'APPROVED') {
      mappedStatus = 'approved'
    } else if (status === 'DENIED' || status === 'REJECTED') {
      mappedStatus = 'rejected'
      rejectionReason = data.rejectReason || data.status?.suspicionReasons?.[0] || 'Verification failed'
    } else if (status === 'REVIEWING' || status === 'PENDING') {
      mappedStatus = 'reviewing'
    }
    
    // Update submission
    await DB.prepare(
      'UPDATE kyc_submissions SET review_status = ?, rejection_reason = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(mappedStatus, rejectionReason, finalSubmission.id).run()
    
    console.log('✅ Updated submission', finalSubmission.id, 'to status:', mappedStatus)
    
    // Update user status
    if (mappedStatus === 'approved') {
      await DB.prepare(
        'UPDATE users SET kyc_status = ?, kyc_approved_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind('approved', finalSubmission.user_id).run()
      
      console.log('✅ Updated user', finalSubmission.user_id, 'KYC status to: approved')
      
      // Trigger email automation (Segment B: KYC done, no purchase)
      try {
        await onKycApproved(c, finalSubmission.user_id)
        console.log(`📧 [AUTOMATION] Segment B triggered for user ${finalSubmission.user_id}`)
      } catch (error) {
        console.error('Failed to trigger email automation:', error)
        // Don't fail KYC approval if automation fails
      }
      
      // Send approval email
      try {
        const user = await DB.prepare(
          'SELECT email, full_name FROM users WHERE id = ?'
        ).bind(finalSubmission.user_id).first() as any
        
        if (user && c.env.RESEND_API_KEY) {
          await sendKYCApprovedEmail(
            user.email,
            user.full_name || 'User',
            c.env.RESEND_API_KEY
          )
          console.log('📧 Sent approval email to:', user.email)
        }
      } catch (emailError) {
        console.warn('⚠️ Failed to send approval email:', emailError)
      }
      
      // 🔥 BACKUP TO GOOGLE DRIVE (Background task)
      console.log('📤 Starting Google Drive backup for user:', finalSubmission.user_id)
      
      try {
        // Fetch documents from iDenfy
        const documentsResult = await fetchIdenfyDocuments(
          c.env.IDENFY_API_KEY,
          c.env.IDENFY_API_SECRET,
          scanRef
        )
        
        if (documentsResult.success && documentsResult.documents) {
          // Get user email
          const user = await DB.prepare(
            'SELECT email FROM users WHERE id = ?'
          ).bind(submission.user_id).first() as any
          
          if (user && c.env.GOOGLE_SERVICE_ACCOUNT_KEY && c.env.GOOGLE_DRIVE_KYC_FOLDER_ID) {
            // Backup to Google Drive
            const backupResult = await backupKYCToGoogleDrive(
              c.env.GOOGLE_SERVICE_ACCOUNT_KEY,
              c.env.GOOGLE_DRIVE_KYC_FOLDER_ID,
              finalSubmission.user_id,
              user.email,
              {
                idFront: documentsResult.documents.front,
                idBack: documentsResult.documents.back,
                selfie: documentsResult.documents.face
              }
            )
            
            if (backupResult.success && backupResult.folderLink) {
              console.log('✅ Google Drive backup successful:', backupResult.folderLink)
              
              // Send email notification
              if (c.env.RESEND_API_KEY) {
                await sendKYCBackupNotification(
                  user.email,
                  finalSubmission.user_id,
                  backupResult.folderLink,
                  c.env.RESEND_API_KEY
                )
                console.log('✅ Email notification sent')
              }
            } else {
              console.warn('⚠️ Google Drive backup failed:', backupResult.error)
            }
          } else {
            console.warn('⚠️ Missing user or Google credentials')
          }
        } else {
          console.warn('⚠️ Failed to fetch documents from iDenfy:', documentsResult.error)
        }
      } catch (backupError) {
        console.error('⚠️ Google Drive backup error (non-blocking):', backupError)
        // Don't fail the webhook - backup is optional
      }
    } else if (mappedStatus === 'rejected') {
      await DB.prepare(
        'UPDATE users SET kyc_status = ? WHERE id = ?'
      ).bind('rejected', finalSubmission.user_id).run()
      
      console.log('❌ Updated user', finalSubmission.user_id, 'KYC status to: rejected')
    }
    
    console.log('Webhook processed successfully:', { scanRef, status: mappedStatus })
    return c.json({ success: true, message: 'Webhook processed' })
    
  } catch (error) {
    console.error('KYC webhook error:', error)
    return c.json({ success: false, message: 'Webhook processing failed' }, 500)
  }
})

/**
 * GET /api/kyc/file/:key
 * Get KYC document (admin only)
 */
kyc.get('/file/:key', requireAdmin, async (c) => {
  try {
    const key = c.req.param('key')
    const bucket = c.env.KYC_BUCKET
    
    const object = await getFromR2(bucket, key)
    
    if (!object) {
      return c.json({ success: false, message: 'File not found' }, 404)
    }
    
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Cache-Control': 'private, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('File access error:', error)
    return c.json({ success: false, message: 'Failed to access file' }, 500)
  }
})

/**
 * GET /api/kyc/admin/submissions
 * Get all KYC submissions for review (admin only)
 * TODO: Add proper admin authentication
 */
kyc.get('/admin/submissions', async (c) => {
  try {
    const DB = c.env.DB
    const status = c.req.query('status') || 'all'
    
    let query = `
      SELECT 
        k.id, u.id as user_id, k.applicant_id, 
        COALESCE(k.review_status, u.kyc_status) as review_status, 
        k.rejection_reason, k.submitted_at, k.reviewed_at,
        u.email, u.full_name, u.kyc_status
      FROM users u
      LEFT JOIN kyc_submissions k ON k.user_id = u.id
    `
    
    if (status !== 'all') {
      query += ' WHERE COALESCE(k.review_status, u.kyc_status) = ?'
    }
    
    query += ' ORDER BY COALESCE(k.submitted_at, u.created_at) DESC'
    
    const stmt = DB.prepare(query)
    const result = status !== 'all' 
      ? await stmt.bind(status).all()
      : await stmt.all()
    
    return c.json({
      success: true,
      submissions: result.results
    })
    
  } catch (error) {
    console.error('Get submissions error:', error)
    return c.json({ success: false, message: 'Failed to get submissions' }, 500)
  }
})

/**
 * POST /api/kyc/admin/:id/approve
 * Approve KYC submission (admin only)
 * TODO: Add proper admin authentication
 */
kyc.post('/admin/:id/approve', async (c) => {
  try {
    const submissionId = c.req.param('id')
    const adminId = c.get('adminId') || 1 // Default admin ID for now
    const DB = c.env.DB
    
    console.log('🔍 Approve request:', { submissionId, adminId })
    
    const submission = await DB.prepare(
      'SELECT id, user_id FROM kyc_submissions WHERE id = ?'
    ).bind(submissionId).first() as any
    
    console.log('📝 Found submission:', submission)
    
    if (!submission) {
      return c.json({ success: false, message: 'Submission not found' }, 404)
    }
    
    // Update submission
    await DB.prepare(
      'UPDATE kyc_submissions SET review_status = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind('approved', submissionId).run()
    
    console.log('✅ Updated submission status')
    
    // Update user
    await DB.prepare(
      'UPDATE users SET kyc_status = ?, kyc_approved_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind('approved', submission.user_id).run()
    
    console.log('✅ Updated user status')
    
    // Get user details for email
    const user = await DB.prepare(
      'SELECT email, full_name FROM users WHERE id = ?'
    ).bind(submission.user_id).first() as any
    
    // Send KYC approved email with machine purchase guide
    if (user && c.env.RESEND_API_KEY) {
      try {
        const emailResult = await sendKYCApprovedEmail(
          user.email,
          user.full_name || 'User',
          c.env.RESEND_API_KEY
        )
        
        if (emailResult.success) {
          console.log('✅ KYC approval email sent successfully')
        } else {
          console.warn('⚠️ Failed to send KYC approval email:', emailResult.error)
        }
      } catch (emailError) {
        console.warn('⚠️ Email send error (non-blocking):', emailError)
        // Continue anyway - email is optional
      }
    } else {
      console.warn('⚠️ User email or RESEND_API_KEY not found, skipping email')
    }
    
    // Try to log admin action (skip if table doesn't exist)
    try {
      await DB.prepare(
        'INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description) VALUES (?, ?, ?, ?, ?)'
      ).bind(adminId, 'kyc_approval', 'kyc_submission', submissionId, 'Approved KYC submission').run()
      console.log('✅ Logged admin action')
    } catch (logError) {
      console.warn('⚠️ Could not log admin action (table may not exist):', logError)
      // Continue anyway - logging is optional
    }
    
    return c.json({
      success: true,
      message: 'KYC approved successfully',
      emailSent: user && c.env.RESEND_API_KEY ? true : false
    })
    
  } catch (error) {
    console.error('❌ KYC approve error:', error)
    return c.json({ success: false, message: 'Failed to approve KYC', error: String(error) }, 500)
  }
})

/**
 * POST /api/kyc/admin/:id/sync
 * Sync KYC status from iDenfy (admin only)
 * This is needed when admin approves in iDenfy platform but webhook doesn't fire
 */
kyc.post('/admin/:id/sync', async (c) => {
  try {
    const submissionId = c.req.param('id')
    const DB = c.env.DB
    
    console.log('🔄 Sync request for submission:', submissionId)
    
    const submission = await DB.prepare(
      'SELECT id, user_id, scan_ref FROM kyc_submissions WHERE id = ?'
    ).bind(submissionId).first() as any
    
    if (!submission) {
      return c.json({ success: false, message: 'Submission not found' }, 404)
    }
    
    if (!submission.scan_ref) {
      return c.json({ success: false, message: 'No scan reference found' }, 400)
    }
    
    console.log('📡 Fetching status from iDenfy:', submission.scan_ref)
    
    // Import getIdenfyStatus function
    const { getIdenfyStatus, mapIdenfyStatus } = await import('../utils/idenfy')
    
    // Get status from iDenfy
    const statusResult = await getIdenfyStatus(
      c.env.IDENFY_API_KEY,
      c.env.IDENFY_API_SECRET,
      submission.scan_ref
    )
    
    if (!statusResult.success || !statusResult.data) {
      console.error('❌ Failed to get iDenfy status:', statusResult.error)
      return c.json({ 
        success: false, 
        message: statusResult.error || 'Failed to sync status from iDenfy' 
      }, 500)
    }
    
    console.log('📥 iDenfy response:', statusResult.data)
    
    // Map iDenfy status to our status
    const idenfyStatus = statusResult.data.status?.overall || statusResult.data.final
    let mappedStatus = 'reviewing'
    let rejectionReason = ''
    
    if (idenfyStatus === 'APPROVED') {
      mappedStatus = 'approved'
    } else if (idenfyStatus === 'DENIED' || idenfyStatus === 'REJECTED') {
      mappedStatus = 'rejected'
      rejectionReason = statusResult.data.status?.suspicionReasons?.[0] || 'Verification failed'
    } else if (idenfyStatus === 'REVIEWING' || idenfyStatus === 'SUSPECTED') {
      mappedStatus = 'reviewing'
    }
    
    console.log('🔄 Mapped status:', { idenfyStatus, mappedStatus })
    
    // Update submission
    await DB.prepare(
      'UPDATE kyc_submissions SET review_status = ?, rejection_reason = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(mappedStatus, rejectionReason, submissionId).run()
    
    console.log('✅ Updated submission status')
    
    // Update user
    if (mappedStatus === 'approved') {
      await DB.prepare(
        'UPDATE users SET kyc_status = ?, kyc_approved_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind('approved', submission.user_id).run()
      
      console.log('✅ Updated user status to approved')
      
      // Get user details for email
      const user = await DB.prepare(
        'SELECT email, full_name FROM users WHERE id = ?'
      ).bind(submission.user_id).first() as any
      
      // Send KYC approved email
      if (user && c.env.RESEND_API_KEY) {
        try {
          const emailResult = await sendKYCApprovedEmail(
            user.email,
            user.full_name || 'User',
            c.env.RESEND_API_KEY
          )
          
          if (emailResult.success) {
            console.log('✅ KYC approval email sent successfully')
          }
        } catch (emailError) {
          console.warn('⚠️ Email send error (non-blocking):', emailError)
        }
      }
    } else if (mappedStatus === 'rejected') {
      await DB.prepare(
        'UPDATE users SET kyc_status = ? WHERE id = ?'
      ).bind('rejected', submission.user_id).run()
      
      console.log('✅ Updated user status to rejected')
    }
    
    return c.json({
      success: true,
      message: 'Status synced successfully from iDenfy',
      status: mappedStatus,
      idenfyStatus: idenfyStatus
    })
    
  } catch (error) {
    console.error('❌ KYC sync error:', error)
    return c.json({ success: false, message: 'Failed to sync status', error: String(error) }, 500)
  }
})

/**
 * POST /api/kyc/admin/:id/reject
 * Reject KYC submission (admin only)
 * TODO: Add proper admin authentication
 */
kyc.post('/admin/:id/reject', async (c) => {
  try {
    const submissionId = c.req.param('id')
    const adminId = c.get('adminId') || 1 // Default admin ID for now
    const { reason } = await c.req.json()
    const DB = c.env.DB
    
    console.log('🔍 Reject request:', { submissionId, adminId, reason })
    
    if (!reason) {
      return c.json({ success: false, message: 'Rejection reason is required' }, 400)
    }
    
    const submission = await DB.prepare(
      'SELECT id, user_id FROM kyc_submissions WHERE id = ?'
    ).bind(submissionId).first() as any
    
    console.log('📝 Found submission:', submission)
    
    if (!submission) {
      return c.json({ success: false, message: 'Submission not found' }, 404)
    }
    
    // Update submission
    await DB.prepare(
      'UPDATE kyc_submissions SET review_status = ?, rejection_reason = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind('rejected', reason, submissionId).run()
    
    console.log('✅ Updated submission status')
    
    // Update user
    await DB.prepare(
      'UPDATE users SET kyc_status = ? WHERE id = ?'
    ).bind('rejected', submission.user_id).run()
    
    console.log('✅ Updated user status')
    
    // Try to log admin action (skip if table doesn't exist)
    try {
      await DB.prepare(
        'INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description) VALUES (?, ?, ?, ?, ?)'
      ).bind(adminId, 'kyc_rejection', 'kyc_submission', submissionId, `Rejected: ${reason}`).run()
      console.log('✅ Logged admin action')
    } catch (logError) {
      console.warn('⚠️ Could not log admin action (table may not exist):', logError)
      // Continue anyway - logging is optional
    }
    
    return c.json({
      success: true,
      message: 'KYC rejected'
    })
    
  } catch (error) {
    console.error('❌ KYC reject error:', error)
    return c.json({ success: false, message: 'Failed to reject KYC', error: String(error) }, 500)
  }
})

export default kyc
