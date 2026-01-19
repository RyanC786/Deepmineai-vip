/**
 * Referrals API Routes
 * Handles referral system: tracking, commissions, VIP levels, analytics
 * Based on VIP_Referral_Program.pdf structure
 */

import { Hono } from 'hono'
import { requireAuth, requireAdmin, requireCRMAccess } from '../middleware/auth'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// ============================================
// USER REFERRAL ENDPOINTS
// ============================================

/**
 * GET /api/referrals/stats
 * Get user's referral statistics
 */
app.get('/stats', async (c) => {
  try {
    const userId = c.get('userId')
    console.log('[REFERRALS] Getting stats for user:', userId)

    // Get user's referral code and VIP level
    const user = await c.env.DB.prepare(`
      SELECT referral_code, vip_level, total_referral_earnings, total_referrals
      FROM users
      WHERE id = ?
    `).bind(userId).first()

    console.log('[REFERRALS] User data:', user)

    if (!user) {
      console.error('[REFERRALS] User not found:', userId)
      return c.json({ error: 'User not found' }, 404)
    }

    // Try to get referral counts - handle if user_referrals table doesn't exist
    let referralCounts = { results: [] }
    try {
      referralCounts = await c.env.DB.prepare(`
        SELECT 
          1 as referral_level,
          COUNT(*) as count,
          COUNT(*) as active_count,
          0 as total_purchases
        FROM referrals
        WHERE referrer_id = ?
      `).bind(userId).all()
    } catch (e) {
      console.warn('[REFERRALS] Could not query referrals table:', e)
    }

    // Get commission stats - use simplified query for production
    let commissionStats = { results: [] }
    let payoutStats = { pending_amount: 0, paid_amount: 0, processing_amount: 0 }
    
    // Get payout stats by commission status
    try {
      const pendingResult = await c.env.DB.prepare(`
        SELECT COALESCE(SUM(commission_amount), 0) as total
        FROM referral_commissions
        WHERE referrer_id = ? AND status = 'pending'
      `).bind(userId).first()
      
      const processingResult = await c.env.DB.prepare(`
        SELECT COALESCE(SUM(commission_amount), 0) as total
        FROM referral_commissions
        WHERE referrer_id = ? AND status = 'processing'
      `).bind(userId).first()
      
      const paidResult = await c.env.DB.prepare(`
        SELECT COALESCE(SUM(commission_amount), 0) as total
        FROM referral_commissions
        WHERE referrer_id = ? AND status = 'paid'
      `).bind(userId).first()
      
      payoutStats.pending_amount = pendingResult?.total || 0
      payoutStats.processing_amount = processingResult?.total || 0
      payoutStats.paid_amount = paidResult?.total || 0
    } catch (e) {
      console.warn('[REFERRALS] Error getting payout stats, using totals:', e)
      payoutStats.pending_amount = user.total_referral_earnings || 0
    }

    // Get VIP level info - use hardcoded values as fallback
    const vipLevelsData = [
      { level: 1, name: 'VIP 1', profit_share: 3.0, level3_commission_percent: 3.0, min_direct_referrals: 0, min_network_size: 0 },
      { level: 2, name: 'VIP 2', profit_share: 3.2, level3_commission_percent: 3.2, min_direct_referrals: 5, min_network_size: 5 },
      { level: 3, name: 'VIP 3', profit_share: 3.4, level3_commission_percent: 3.4, min_direct_referrals: 10, min_network_size: 25 },
      { level: 4, name: 'VIP 4', profit_share: 3.6, level3_commission_percent: 3.6, min_direct_referrals: 20, min_network_size: 50 },
      { level: 5, name: 'VIP 5', profit_share: 3.8, level3_commission_percent: 3.8, min_direct_referrals: 35, min_network_size: 100 },
      { level: 6, name: 'VIP 6', profit_share: 4.0, level3_commission_percent: 4.0, min_direct_referrals: 50, min_network_size: 200 },
      { level: 7, name: 'VIP 7', profit_share: 4.2, level3_commission_percent: 4.2, min_direct_referrals: 75, min_network_size: 400 },
      { level: 8, name: 'VIP 8', profit_share: 4.4, level3_commission_percent: 4.4, min_direct_referrals: 100, min_network_size: 800 },
      { level: 9, name: 'VIP 9', profit_share: 4.7, level3_commission_percent: 4.7, min_direct_referrals: 150, min_network_size: 1500 },
      { level: 10, name: 'VIP 10', profit_share: 5.0, level3_commission_percent: 5.0, min_direct_referrals: 200, min_network_size: 3000 }
    ]
    
    let vipLevel = vipLevelsData.find(v => v.level === user.vip_level) || vipLevelsData[0]
    let nextVipLevel = vipLevelsData.find(v => v.level === (user.vip_level + 1))
    
    // Try to get from database if available
    try {
      const dbVipLevel = await c.env.DB.prepare(`
        SELECT *, level3_commission_percent as profit_share FROM vip_levels WHERE level = ?
      `).bind(user.vip_level).first()
      
      if (dbVipLevel) vipLevel = dbVipLevel
      
      const dbNextVipLevel = await c.env.DB.prepare(`
        SELECT *, level3_commission_percent as profit_share FROM vip_levels WHERE level = ?
      `).bind(user.vip_level + 1).first()
      
      if (dbNextVipLevel) nextVipLevel = dbNextVipLevel
    } catch (e) {
      console.warn('[REFERRALS] Using hardcoded VIP levels:', e)
    }

    return c.json({
      success: true,
      data: {
        referral_code: user.referral_code,
        vip_level: user.vip_level,
        vip_info: vipLevel,
        next_vip: nextVipLevel,
        total_earnings: user.total_referral_earnings,
        total_referrals: user.total_referrals,
        referrals_by_level: referralCounts.results,
        commissions_by_type: commissionStats.results,
        payout_stats: payoutStats
      }
    })
  } catch (error) {
    console.error('Error fetching referral stats:', error)
    return c.json({ error: 'Failed to fetch referral statistics' }, 500)
  }
})

/**
 * GET /api/referrals/tree
 * Get user's referral tree (3 levels deep)
 */
app.get('/tree', async (c) => {
  try {
    const userId = c.get('userId')

    // Get direct referrals from existing referrals table
    const referrals = await c.env.DB.prepare(`
      SELECT 
        r.id,
        r.referred_id as user_id,
        1 as referral_level,
        r.status,
        r.created_at,
        u.username,
        u.email,
        u.vip_level,
        u.kyc_status,
        0 as total_purchases
      FROM referrals r
      JOIN users u ON r.referred_id = u.id
      WHERE r.referrer_id = ?
      ORDER BY r.created_at DESC
    `).bind(userId).all()

    return c.json({
      success: true,
      data: {
        total: referrals.results.length,
        level1: referrals.results,
        level2: [],
        level3: []
      }
    })
  } catch (error) {
    console.error('Error fetching referral tree:', error)
    return c.json({ 
      success: true,
      data: {
        total: 0,
        level1: [],
        level2: [],
        level3: []
      }
    })
  }
})

/**
 * GET /api/referrals/commissions
 * Get user's commission history
 */
app.get('/commissions', async (c) => {
  try {
    const userId = c.get('userId')
    
    // Return empty for now - will be populated as commissions are earned
    return c.json({
      success: true,
      data: {
        commissions: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching commissions:', error)
    return c.json({
      success: true,
      data: {
        commissions: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        }
      }
    })
  }
})

/**
 * GET /api/referrals/payouts
 * Get user's payout history
 */
app.get('/payouts', async (c) => {
  try {
    const userId = c.get('userId')
    
    if (!userId) {
      return c.json({ 
        success: false, 
        error: 'Authentication required' 
      }, 401)
    }
    
    // Get user's payout history
    const payouts = await c.env.DB.prepare(`
      SELECT 
        id,
        amount,
        status,
        transaction_id,
        notes,
        created_at,
        processed_at
      FROM referral_payouts
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all()
    
    return c.json({
      success: true,
      data: payouts.results || []
    })
  } catch (error) {
    console.error('Error fetching payouts:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch payout history',
      data: []
    }, 500)
  }
})

/**
 * POST /api/referrals/payout/request
 * Request payout for pending commissions
 */
app.post('/payout/request', async (c) => {
  try {
    const userId = c.get('userId')
    const minimumAmount = 50.00

    // Get pending commissions total
    const pendingCommissions = await c.env.DB.prepare(`
      SELECT COALESCE(SUM(commission_amount), 0) as total
      FROM referral_commissions
      WHERE referrer_id = ? AND status = 'pending'
    `).bind(userId).first()

    const totalPending = pendingCommissions?.total || 0

    if (totalPending < minimumAmount) {
      return c.json({
        success: false,
        message: `Minimum payout amount is $${minimumAmount}. You have $${totalPending.toFixed(2)} pending.`
      }, 400)
    }

    // Create payout request
    const result = await c.env.DB.prepare(`
      INSERT INTO referral_payouts (user_id, amount, status, created_at)
      VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)
    `).bind(userId, totalPending).run()

    // Mark commissions as 'processing'
    await c.env.DB.prepare(`
      UPDATE referral_commissions
      SET status = 'processing'
      WHERE referrer_id = ? AND status = 'pending'
    `).bind(userId).run()

    return c.json({
      success: true,
      message: `Payout request created for $${totalPending.toFixed(2)}`,
      payout_id: result.meta.last_row_id
    })

  } catch (error) {
    console.error('Error requesting payout:', error)
    return c.json({ 
      success: false,
      message: 'Failed to create payout request'
    }, 500)
  }
})

/**
 * GET /api/referrals/downline
 * Get detailed downline information with user details
 */
app.get('/downline', async (c) => {
  try {
    const userId = c.get('userId')
    
    if (!userId) {
      console.error('[REFERRALS] No userId in context')
      return c.json({ 
        success: false, 
        error: 'Authentication required',
        message: 'User ID not found in request context'
      }, 401)
    }
    
    console.log('[REFERRALS] Getting downline for user:', userId)
    
    // Get all downline users from referral_tree with their complete details
    const downlineRaw = await c.env.DB.prepare(`
      SELECT 
        rt.level,
        rt.created_at as joined_via_me,
        u.id as user_id,
        u.email,
        u.full_name,
        u.vip_level,
        u.created_at as registration_date,
        u.total_referrals as their_referrals,
        COALESCE((
          SELECT SUM(price) 
          FROM user_miners um 
          JOIN mining_packages mp ON um.package_id = mp.id
          WHERE um.user_id = u.id
        ), 0) as total_purchases,
        COALESCE((
          SELECT SUM(commission_amount)
          FROM referral_commissions
          WHERE referrer_id = ? AND referred_id = u.id
        ), 0) as my_earnings_from_them
      FROM referral_tree rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.ancestor_id = ?
      ORDER BY rt.level ASC, rt.created_at DESC
    `).bind(userId, userId).all()
    
    // Privacy: Show only initials and ID (hide email/full name for security)
    const downline = {
      results: downlineRaw.results.map((user: any) => {
        // Generate initials from full name
        let initials = 'N/A'
        if (user.full_name) {
          const nameParts = user.full_name.trim().split(/\s+/)
          if (nameParts.length === 1) {
            // Single name: use first 2 letters
            initials = nameParts[0].substring(0, 2).toUpperCase()
          } else {
            // Multiple names: use first letter of each
            initials = nameParts.map((part: string) => part[0]).join('').toUpperCase()
          }
        } else if (user.email) {
          // Fallback: use first 2 letters of email
          initials = user.email.substring(0, 2).toUpperCase()
        }
        
        return {
          level: user.level,
          joined_via_me: user.joined_via_me,
          user_id: user.user_id,
          display_name: `${initials} (ID: ${user.user_id})`, // e.g., "JD (ID: 123)"
          initials: initials,
          vip_level: user.vip_level,
          registration_date: user.registration_date,
          their_referrals: user.their_referrals,
          total_purchases: user.total_purchases,
          my_earnings_from_them: user.my_earnings_from_them
          // email and full_name removed for privacy
        }
      })
    }

    // Group by level
    const level1 = downline.results.filter((r: any) => r.level === 1)
    const level2 = downline.results.filter((r: any) => r.level === 2)
    const level3 = downline.results.filter((r: any) => r.level === 3)

    return c.json({
      success: true,
      data: {
        total: downline.results.length,
        level1: {
          count: level1.length,
          users: level1
        },
        level2: {
          count: level2.length,
          users: level2
        },
        level3: {
          count: level3.length,
          users: level3
        }
      }
    })

  } catch (error: any) {
    console.error('[REFERRALS] Error fetching downline:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch downline details',
      message: error.message 
    }, 500)
  }
})

/**
 * GET /api/referrals/commission-details
 * Get detailed commission breakdown by transaction
 */
app.get('/commission-details', async (c) => {
  try {
    const userId = c.get('userId')
    
    if (!userId) {
      console.error('[REFERRALS] No userId in context for commission-details')
      return c.json({ 
        success: false, 
        error: 'Authentication required' 
      }, 401)
    }
    
    console.log('[REFERRALS] Getting commission details for user:', userId)
    
    // Get all commissions with transaction details
    const commissions = await c.env.DB.prepare(`
      SELECT 
        rc.id,
        rc.commission_amount as amount,
        'commission' as commission_type,
        rc.commission_rate,
        rc.status,
        rc.created_at,
        u.email as from_user_email,
        u.full_name as from_user_name,
        rc.referred_id,
        rc.base_amount as purchase_amount,
        'Commission' as commission_type_label
      FROM referral_commissions rc
      JOIN users u ON rc.referred_id = u.id
      WHERE rc.referrer_id = ?
      ORDER BY rc.created_at DESC
      LIMIT 100
    `).bind(userId).all()

    // Calculate totals by type
    const totals = {
      pending: 0,
      paid: 0,
      total: 0,
      by_level: {
        level1: 0,
        level2: 0,
        level3: 0
      }
    }

    commissions.results.forEach((c: any) => {
      totals.total += c.amount
      if (c.status === 'pending') totals.pending += c.amount
      if (c.status === 'paid') totals.paid += c.amount
      
      if (c.commission_type === 'level1') totals.by_level.level1 += c.amount
      else if (c.commission_type === 'level2') totals.by_level.level2 += c.amount
      else if (c.commission_type === 'level3+') totals.by_level.level3 += c.amount
    })

    return c.json({
      success: true,
      data: {
        commissions: commissions.results,
        totals,
        count: commissions.results.length
      }
    })

  } catch (error: any) {
    console.error('[REFERRALS] Error fetching commission details:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch commission details',
      message: error.message 
    }, 500)
  }
})

// ============================================
// ADMIN REFERRAL ENDPOINTS
// ============================================

/**
 * GET /api/referrals/admin/overview
 * Get platform-wide referral statistics (admin only)
 */
app.get('/admin/overview', async (c) => {
  try {
    console.log('[REFERRALS ADMIN] Getting overview stats')
    
    // Total referrals and active referrals from existing referrals table
    let referralStats = { total_referrals: 0, active_referrals: 0, total_purchases: 0 }
    try {
      referralStats = await c.env.DB.prepare(`
        SELECT 
          COUNT(*) as total_referrals,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_referrals,
          0 as total_purchases
        FROM referrals
      `).first() || referralStats
    } catch (e) {
      console.warn('[REFERRALS ADMIN] Error getting referral stats:', e)
    }

    // Commission stats from referral_commissions table (as array for frontend compatibility)
    let commissionStats = []
    try {
      const stats = await c.env.DB.prepare(`
        SELECT 
          COUNT(*) as total_commissions,
          COALESCE(SUM(commission_amount), 0) as total_amount,
          SUM(CASE WHEN status = 'credited' THEN 1 ELSE 0 END) as credited,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
        FROM referral_commissions
      `).first()
      
      // Return as array with one summary object
      if (stats && stats.total_amount > 0) {
        commissionStats = [stats]
      }
    } catch (e) {
      console.warn('[REFERRALS ADMIN] Error getting commission stats:', e)
    }

    // Payout stats - empty for now
    const payoutStats = []

    // Top referrers (fixed: use full_name instead of username)
    let topReferrers = { results: [] }
    try {
      topReferrers = await c.env.DB.prepare(`
        SELECT 
          u.id,
          u.full_name as username,
          u.email,
          u.vip_level,
          u.total_referrals,
          u.total_referral_earnings
        FROM users u
        WHERE u.total_referrals > 0
        ORDER BY u.total_referral_earnings DESC
        LIMIT 10
      `).all()
    } catch (e) {
      console.warn('[REFERRALS ADMIN] Error getting top referrers:', e)
    }

    // VIP distribution
    let vipDistribution = { results: [] }
    try {
      vipDistribution = await c.env.DB.prepare(`
        SELECT 
          vip_level,
          COUNT(*) as user_count,
          SUM(total_referrals) as total_referrals,
          SUM(total_referral_earnings) as total_earnings
        FROM users
        GROUP BY vip_level
        ORDER BY vip_level
      `).all()
    } catch (e) {
      console.warn('[REFERRALS ADMIN] Error getting VIP distribution:', e)
    }

    console.log('[REFERRALS ADMIN] Overview data:', {
      referralStats,
      topReferrersCount: topReferrers.results.length,
      vipDistributionCount: vipDistribution.results.length
    })

    return c.json({
      success: true,
      data: {
        referral_stats: referralStats,
        commission_stats: commissionStats,
        payout_stats: payoutStats,
        top_referrers: topReferrers.results,
        vip_distribution: vipDistribution.results
      }
    })
  } catch (error: any) {
    console.error('[REFERRALS ADMIN] Error fetching admin overview:', error)
    console.error('[REFERRALS ADMIN] Error stack:', error.stack)
    return c.json({ 
      success: false,
      error: 'Failed to fetch referral overview',
      message: error.message 
    }, 500)
  }
})

/**
 * GET /api/referrals/admin/pending-payouts
 * Get all pending payouts (admin only)
 */
app.get('/admin/pending-payouts', async (c) => {
  try {
    // Get all pending payout requests with user details and balance info
    const payouts = await c.env.DB.prepare(`
      SELECT 
        rp.id,
        rp.user_id,
        rp.amount,
        rp.status,
        rp.created_at,
        rp.processed_at,
        rp.transaction_id,
        rp.notes,
        u.full_name,
        u.email,
        u.vip_level,
        u.wallet_balance as current_wallet_balance,
        u.balance as current_total_balance,
        u.total_referral_earnings
      FROM referral_payouts rp
      JOIN users u ON rp.user_id = u.id
      WHERE rp.status = 'pending'
      ORDER BY rp.created_at DESC
    `).all()
    
    return c.json({
      success: true,
      data: payouts.results || []
    })
  } catch (error) {
    console.error('Error fetching pending payouts:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch pending payouts',
      data: []
    }, 500)
  }
})

/**
 * POST /api/referrals/admin/process-payout/:payoutId
 * Process a payout (admin only)
 * When approved: Credits commission to user's wallet balance
 */
app.post('/admin/process-payout/:payoutId', async (c) => {
  try {
    const payoutId = c.req.param('payoutId')
    const { status, transaction_id, notes } = await c.req.json()

    if (!['paid', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status. Use "paid" or "rejected"' }, 400)
    }

    // Get payout details
    const payout = await c.env.DB.prepare(`
      SELECT id, user_id, amount, status
      FROM referral_payouts
      WHERE id = ?
    `).bind(payoutId).first()

    if (!payout) {
      return c.json({ error: 'Payout not found' }, 404)
    }

    if (payout.status !== 'pending') {
      return c.json({ error: 'Payout already processed' }, 400)
    }

    if (status === 'paid') {
      // Credit commission to user's wallet balance
      await c.env.DB.prepare(`
        UPDATE users
        SET wallet_balance = wallet_balance + ?,
            balance = balance + ?
        WHERE id = ?
      `).bind(payout.amount, payout.amount, payout.user_id).run()

      // Update commission status to credited
      await c.env.DB.prepare(`
        UPDATE referral_commissions
        SET status = 'credited'
        WHERE referrer_id = ? AND status = 'processing'
      `).bind(payout.user_id).run()

      console.log(`✅ Credited $${payout.amount} commission to user ${payout.user_id} wallet`)
    } else if (status === 'rejected') {
      // Return commission to pending status
      await c.env.DB.prepare(`
        UPDATE referral_commissions
        SET status = 'pending'
        WHERE referrer_id = ? AND status = 'processing'
      `).bind(payout.user_id).run()

      console.log(`❌ Rejected payout for user ${payout.user_id}, commission returned to pending`)
    }

    // Update payout status
    const adminId = c.get('adminId') || null
    await c.env.DB.prepare(`
      UPDATE referral_payouts
      SET status = ?, 
          transaction_id = ?,
          notes = ?,
          processed_at = CURRENT_TIMESTAMP,
          processed_by = ?
      WHERE id = ?
    `).bind(status, transaction_id || null, notes || null, adminId, payoutId).run()

    // Log admin action (only if admin_logs table exists and we have adminId)
    if (adminId) {
      try {
        await c.env.DB.prepare(`
          INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details)
          VALUES (?, 'commission_payout_processed', 'referral_payout', ?, ?)
        `).bind(adminId, payoutId, JSON.stringify({ 
          status, 
          amount: payout.amount,
          user_id: payout.user_id,
          action: status === 'paid' ? 'credited_to_wallet' : 'rejected',
          notes 
        })).run()
      } catch (logError) {
        console.error('Failed to log admin action (non-critical):', logError)
      }
    }

    return c.json({
      success: true,
      message: status === 'paid' 
        ? `Commission $${payout.amount} credited to user wallet` 
        : 'Payout rejected, commission returned to pending'
    })
  } catch (error) {
    console.error('Error processing payout:', error)
    return c.json({ 
      success: false,
      error: 'Failed to process payout',
      details: error.message 
    }, 500)
  }
})

/**
 * POST /api/referrals/admin/adjust-vip/:userId
 * Manually adjust user's VIP level (admin only)
 */
app.post('/admin/adjust-vip/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { vip_level, reason } = await c.req.json()

    if (vip_level < 1 || vip_level > 10) {
      return c.json({ error: 'VIP level must be between 1 and 10' }, 400)
    }

    // Update user VIP level
    await c.env.DB.prepare(`
      UPDATE users
      SET vip_level = ?
      WHERE id = ?
    `).bind(vip_level, userId).run()

    // Log admin action (only if admin_logs table exists and we have adminId)
    const adminId = c.get('adminId') || null
    if (adminId) {
      try {
        await c.env.DB.prepare(`
          INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details)
          VALUES (?, 'vip_level_adjusted', 'user', ?, ?)
        `).bind(adminId, userId, JSON.stringify({ vip_level, reason })).run()
      } catch (logError) {
        console.error('Failed to log admin action (non-critical):', logError)
      }
    }

    return c.json({
      success: true,
      message: 'VIP level adjusted successfully'
    })
  } catch (error) {
    console.error('Error adjusting VIP level:', error)
    return c.json({ error: 'Failed to adjust VIP level' }, 500)
  }
})

/**
 * GET /api/referrals/admin/user/:userId
 * Get complete referral details for any user (admin only)
 */
app.get('/admin/user/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'))
    console.log('[REFERRALS ADMIN] Getting details for user:', userId)
    
    if (!userId || isNaN(userId)) {
      return c.json({ 
        success: false,
        error: 'Invalid user ID' 
      }, 400)
    }
    
    // Get user details
    const user = await c.env.DB.prepare(`
      SELECT 
        id, email, full_name, referral_code, referred_by,
        vip_level, total_referrals, direct_referrals,
        total_referral_earnings, created_at
      FROM users
      WHERE id = ?
    `).bind(userId).first()

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Get their downline
    const downline = await c.env.DB.prepare(`
      SELECT 
        rt.level,
        rt.created_at as joined_via_user,
        u.id as user_id,
        u.email,
        u.full_name,
        u.vip_level,
        u.created_at as registration_date,
        COALESCE((
          SELECT SUM(price) 
          FROM user_miners um 
          JOIN mining_packages mp ON um.package_id = mp.id
          WHERE um.user_id = u.id
        ), 0) as total_purchases,
        COALESCE((
          SELECT SUM(commission_amount)
          FROM referral_commissions
          WHERE referrer_id = ? AND referred_id = u.id
        ), 0) as earnings_from_them
      FROM referral_tree rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.ancestor_id = ?
      ORDER BY rt.level ASC, rt.created_at DESC
    `).bind(userId, userId).all()

    // Get commission history
    const commissions = await c.env.DB.prepare(`
      SELECT 
        rc.*,
        u.email as from_user_email,
        u.full_name as from_user_name
      FROM referral_commissions rc
      JOIN users u ON rc.referred_id = u.id
      WHERE rc.referrer_id = ?
      ORDER BY rc.created_at DESC
      LIMIT 50
    `).bind(userId).all()

    // Get who referred this user
    let referrer = null
    if (user.referred_by) {
      referrer = await c.env.DB.prepare(`
        SELECT id, email, full_name, referral_code
        FROM users
        WHERE referral_code = ?
      `).bind(user.referred_by).first()
    }

    // Calculate stats
    const level1 = downline.results.filter((r: any) => r.level === 1)
    const level2 = downline.results.filter((r: any) => r.level === 2)
    const level3 = downline.results.filter((r: any) => r.level === 3)

    return c.json({
      success: true,
      data: {
        user,
        referrer,
        downline: {
          total: downline.results.length,
          level1: { count: level1.length, users: level1 },
          level2: { count: level2.length, users: level2 },
          level3: { count: level3.length, users: level3 }
        },
        commissions: {
          history: commissions.results,
          total: commissions.results.reduce((sum: number, c: any) => sum + (c.commission_amount || 0), 0),
          count: commissions.results.length
        }
      }
    })

  } catch (error: any) {
    console.error('[REFERRALS ADMIN] Error fetching user details:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch user referral details',
      message: error.message 
    }, 500)
  }
})

/**
 * GET /api/referrals/admin/search
 * Search users by email or name for referral management (admin only)
 */
app.get('/admin/search', async (c) => {
  try {
    const query = c.req.query('q') || ''
    
    if (query.length < 2) {
      return c.json({
        success: true,
        data: []
      })
    }

    const users = await c.env.DB.prepare(`
      SELECT 
        id, email, full_name, referral_code,
        vip_level, total_referrals, direct_referrals,
        total_referral_earnings
      FROM users
      WHERE email LIKE ? OR full_name LIKE ?
      ORDER BY total_referrals DESC
      LIMIT 20
    `).bind(`%${query}%`, `%${query}%`).all()

    return c.json({
      success: true,
      data: users.results
    })

  } catch (error: any) {
    console.error('[REFERRALS ADMIN] Error searching users:', error)
    return c.json({ 
      success: false,
      error: 'Failed to search users',
      message: error.message 
    }, 500)
  }
})

export default app
