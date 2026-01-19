import { Hono } from 'hono'
import { requireAdmin } from '../middleware/auth'

const adminWithdrawals = new Hono()

// GET /api/admin/withdrawals/list - Get all withdrawals
adminWithdrawals.get('/list', requireAdmin, async (c) => {
  try {
    const { status } = c.req.query()

    let query = `
      SELECT 
        w.id,
        w.withdrawal_number,
        w.user_id,
        w.amount,
        w.fee_amount,
        w.net_amount,
        w.currency,
        w.network,
        w.wallet_address,
        w.status,
        w.admin_notes,
        w.rejection_reason,
        w.tx_hash,
        w.approved_by,
        w.approved_at,
        w.completed_at,
        w.created_at,
        u.email,
        u.full_name
      FROM withdrawals w
      JOIN users u ON w.user_id = u.id
    `

    const params = []
    if (status && status !== 'all') {
      query += ` WHERE w.status = ?`
      params.push(status)
    }

    query += ` ORDER BY w.created_at DESC`

    const { results } = await c.env.DB.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      withdrawals: results
    })

  } catch (error: any) {
    console.error('Get withdrawals error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to fetch withdrawals' 
    }, 500)
  }
})

// GET /api/admin/withdrawals/stats - Get withdrawal statistics
adminWithdrawals.get('/stats', requireAdmin, async (c) => {
  try {
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_withdrawals,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending_count,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END), 0) as approved_count,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) as completed_count,
        COALESCE(SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END), 0) as rejected_count,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN net_amount ELSE 0 END), 0) as total_paid
      FROM withdrawals
    `).first() as any

    return c.json({
      success: true,
      stats: stats || {
        total_withdrawals: 0,
        pending_count: 0,
        approved_count: 0,
        completed_count: 0,
        rejected_count: 0,
        pending_amount: 0,
        total_paid: 0
      }
    })

  } catch (error: any) {
    console.error('Get withdrawal stats error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to fetch withdrawal statistics' 
    }, 500)
  }
})

// POST /api/admin/withdrawals/:id/approve - Approve withdrawal
adminWithdrawals.post('/:id/approve', requireAdmin, async (c) => {
  try {
    const withdrawalId = c.req.param('id')
    const adminEmail = c.get('userEmail') || 'admin@system'

    console.log(`[WITHDRAWAL APPROVE] ID: ${withdrawalId}, Admin: ${adminEmail}`)

    // Get withdrawal details
    const withdrawal = await c.env.DB.prepare(`
      SELECT * FROM withdrawals WHERE id = ?
    `).bind(withdrawalId).first() as any

    console.log(`[WITHDRAWAL APPROVE] Found withdrawal:`, withdrawal)

    if (!withdrawal) {
      return c.json({ success: false, message: 'Withdrawal not found' }, 404)
    }

    if (withdrawal.status !== 'pending') {
      return c.json({ 
        success: false, 
        message: `Cannot approve withdrawal with status: ${withdrawal.status}` 
      }, 400)
    }

    // Update withdrawal status to approved
    console.log(`[WITHDRAWAL APPROVE] Updating status to approved...`)
    await c.env.DB.prepare(`
      UPDATE withdrawals
      SET status = 'approved',
          approved_by = ?,
          approved_at = datetime('now')
      WHERE id = ?
    `).bind(adminEmail, withdrawalId).run()

    // Log admin action (skip if table doesn't exist or has wrong structure)
    console.log(`[WITHDRAWAL APPROVE] Logging admin action...`)
    try {
      // Try to get admin_id from users table
      const admin = await c.env.DB.prepare(`
        SELECT id FROM users WHERE email = ? AND role = 'admin'
      `).bind(adminEmail).first() as any
      
      if (admin) {
        await c.env.DB.prepare(`
          INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          admin.id,
          'approve_withdrawal',
          'withdrawal',
          withdrawalId,
          `Approved withdrawal ${withdrawal.withdrawal_number} for user ${withdrawal.user_id}, amount: $${withdrawal.amount}`
        ).run()
      }
    } catch (logError) {
      console.warn('[WITHDRAWAL APPROVE] Failed to log admin action (non-critical):', logError)
      // Continue anyway - logging is optional
    }

    console.log(`[WITHDRAWAL APPROVE] Success!`)
    return c.json({
      success: true,
      message: 'Withdrawal approved successfully'
    })

  } catch (error: any) {
    console.error('[WITHDRAWAL APPROVE] Error:', error)
    console.error('[WITHDRAWAL APPROVE] Error stack:', error.stack)
    console.error('[WITHDRAWAL APPROVE] Error message:', error.message)
    return c.json({ 
      success: false, 
      message: `Failed to approve withdrawal: ${error.message}` 
    }, 500)
  }
})

// POST /api/admin/withdrawals/:id/reject - Reject withdrawal and refund
adminWithdrawals.post('/:id/reject', requireAdmin, async (c) => {
  try {
    const withdrawalId = c.req.param('id')
    const { reason } = await c.req.json()
    const adminEmail = c.get('userEmail')

    // Get withdrawal details
    const withdrawal = await c.env.DB.prepare(`
      SELECT * FROM withdrawals WHERE id = ?
    `).bind(withdrawalId).first() as any

    if (!withdrawal) {
      return c.json({ success: false, message: 'Withdrawal not found' }, 404)
    }

    if (withdrawal.status !== 'pending') {
      return c.json({ 
        success: false, 
        message: `Cannot reject withdrawal with status: ${withdrawal.status}` 
      }, 400)
    }

    // Refund the amount to user's balance (update both fields to keep them in sync)
    const newBalance = await c.env.DB.prepare(`
      UPDATE users
      SET balance = balance + ?,
          wallet_balance = wallet_balance + ?
      WHERE id = ?
      RETURNING balance
    `).bind(withdrawal.amount, withdrawal.amount, withdrawal.user_id).first() as any
    
    console.log(`Refunded $${withdrawal.amount} to user ${withdrawal.user_id}, new balance: $${newBalance?.balance || 'unknown'}`)

    // Update withdrawal status
    await c.env.DB.prepare(`
      UPDATE withdrawals
      SET status = 'rejected',
          rejection_reason = ?
      WHERE id = ?
    `).bind(reason || 'Rejected by admin', withdrawalId).run()

    // Log transaction refund
    await c.env.DB.prepare(`
      INSERT INTO transactions (
        user_id,
        transaction_type,
        amount,
        status,
        reference_id,
        description,
        created_at
      ) VALUES (?, 'refund', ?, 'completed', ?, ?, datetime('now'))
    `).bind(
      withdrawal.user_id,
      withdrawal.amount,
      withdrawal.withdrawal_number,
      `Withdrawal rejected - refund: ${reason || 'No reason provided'}`
    ).run()

    // Log admin action (skip if table doesn't exist or has wrong structure)
    try {
      // Try to get admin_id from users table
      const admin = await c.env.DB.prepare(`
        SELECT id FROM users WHERE email = ? AND role = 'admin'
      `).bind(adminEmail).first() as any
      
      if (admin) {
        await c.env.DB.prepare(`
          INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          admin.id,
          'reject_withdrawal',
          'withdrawal',
          withdrawalId,
          `Rejected withdrawal ${withdrawal.withdrawal_number} for user ${withdrawal.user_id}, amount: $${withdrawal.amount}, reason: ${reason || 'No reason'}`
        ).run()
      }
    } catch (logError) {
      console.warn('[WITHDRAWAL REJECT] Failed to log admin action (non-critical):', logError)
      // Continue anyway - logging is optional
    }

    return c.json({
      success: true,
      message: 'Withdrawal rejected and amount refunded to user'
    })

  } catch (error: any) {
    console.error('Reject withdrawal error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to reject withdrawal' 
    }, 500)
  }
})

// POST /api/admin/withdrawals/:id/complete - Mark withdrawal as completed with TX hash
adminWithdrawals.post('/:id/complete', requireAdmin, async (c) => {
  try {
    const withdrawalId = c.req.param('id')
    const { tx_hash, notes } = await c.req.json()
    const adminEmail = c.get('userEmail')

    if (!tx_hash || tx_hash.trim().length === 0) {
      return c.json({ 
        success: false, 
        message: 'Transaction hash is required' 
      }, 400)
    }

    // Get withdrawal details
    const withdrawal = await c.env.DB.prepare(`
      SELECT * FROM withdrawals WHERE id = ?
    `).bind(withdrawalId).first() as any

    if (!withdrawal) {
      return c.json({ success: false, message: 'Withdrawal not found' }, 404)
    }

    if (withdrawal.status !== 'approved') {
      return c.json({ 
        success: false, 
        message: `Can only complete approved withdrawals. Current status: ${withdrawal.status}` 
      }, 400)
    }

    // Update withdrawal status
    await c.env.DB.prepare(`
      UPDATE withdrawals
      SET status = 'completed',
          tx_hash = ?,
          admin_notes = ?,
          completed_at = datetime('now')
      WHERE id = ?
    `).bind(tx_hash, notes || '', withdrawalId).run()

    // Update transaction status
    await c.env.DB.prepare(`
      UPDATE transactions
      SET status = 'completed'
      WHERE reference_id = ?
    `).bind(withdrawal.withdrawal_number).run()

    // Update user's total_withdrawn
    await c.env.DB.prepare(`
      UPDATE users
      SET total_withdrawn = total_withdrawn + ?
      WHERE id = ?
    `).bind(withdrawal.net_amount, withdrawal.user_id).run()

    // Log admin action (skip if table doesn't exist or has wrong structure)
    try {
      // Try to get admin_id from users table
      const admin = await c.env.DB.prepare(`
        SELECT id FROM users WHERE email = ? AND role = 'admin'
      `).bind(adminEmail).first() as any
      
      if (admin) {
        await c.env.DB.prepare(`
          INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          admin.id,
          'complete_withdrawal',
          'withdrawal',
          withdrawalId,
          `Completed withdrawal ${withdrawal.withdrawal_number} for user ${withdrawal.user_id}, net amount: $${withdrawal.net_amount}, TX: ${tx_hash}`
        ).run()
      }
    } catch (logError) {
      console.warn('[WITHDRAWAL COMPLETE] Failed to log admin action (non-critical):', logError)
      // Continue anyway - logging is optional
    }

    return c.json({
      success: true,
      message: 'Withdrawal marked as completed successfully'
    })

  } catch (error: any) {
    console.error('Complete withdrawal error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to complete withdrawal' 
    }, 500)
  }
})

export default adminWithdrawals
