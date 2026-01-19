import { Hono } from 'hono'

const admin = new Hono()

// GET /api/admin/users - Get all users with referral stats
admin.get('/users', async (c) => {
  try {
    const { DB } = c.env as any

    const users = await DB.prepare(`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.referral_code,
        u.referred_by,
        u.vip_level,
        u.direct_referrals,
        u.network_size,
        u.balance,
        u.kyc_status,
        u.account_status,
        u.created_at,
        (SELECT COUNT(*) FROM user_miners WHERE user_id = u.id AND status = 'active') as active_miners,
        0 as total_commissions
      FROM users u
      ORDER BY u.created_at DESC
    `).all()

    return c.json({
      success: true,
      users: users.results
    })
  } catch (error) {
    console.error('Get users error:', error)
    return c.json({ success: false, message: 'Failed to get users' }, 500)
  }
})

// GET /api/admin/user/:id - Get specific user details
admin.get('/user/:id', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = parseInt(c.req.param('id'))

    const user = await DB.prepare(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM user_miners WHERE user_id = u.id AND status = 'active') as active_miners,
        0 as total_commissions
      FROM users u
      WHERE u.id = ?
    `).bind(userId).first()

    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ success: false, message: 'Failed to get user' }, 500)
  }
})

// GET /api/admin/user/:id/network - Get user's referral network
admin.get('/user/:id/network', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = parseInt(c.req.param('id'))

    // Get direct referrals
    const user = await DB.prepare('SELECT referral_code FROM users WHERE id = ?').bind(userId).first()
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    const network = await DB.prepare(`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.vip_level,
        u.direct_referrals,
        u.network_size,
        u.created_at,
        (SELECT COUNT(*) FROM user_miners WHERE user_id = u.id AND status = 'active') as active_miners
      FROM users u
      WHERE u.referred_by = ?
      ORDER BY u.created_at DESC
    `).bind(user.referral_code).all()

    return c.json({
      success: true,
      network: network.results
    })
  } catch (error) {
    console.error('Get user network error:', error)
    return c.json({ success: false, message: 'Failed to get user network' }, 500)
  }
})

// POST /api/admin/user/:id/vip - Update user VIP level
admin.post('/user/:id/vip', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = parseInt(c.req.param('id'))
    const { vipLevel } = await c.req.json()

    if (!vipLevel || vipLevel < 1 || vipLevel > 10) {
      return c.json({ success: false, message: 'Invalid VIP level (1-10)' }, 400)
    }

    await DB.prepare('UPDATE users SET vip_level = ? WHERE id = ?').bind(vipLevel, userId).run()

    return c.json({
      success: true,
      message: `VIP level updated to ${vipLevel}`
    })
  } catch (error) {
    console.error('Update VIP level error:', error)
    return c.json({ success: false, message: 'Failed to update VIP level' }, 500)
  }
})

// POST /api/admin/user/:id/balance - Update user balance
admin.post('/user/:id/balance', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = parseInt(c.req.param('id'))
    const { amount, action } = await c.req.json()

    if (!amount || !action || !['add', 'subtract', 'set'].includes(action)) {
      return c.json({ success: false, message: 'Invalid amount or action' }, 400)
    }

    let sql = ''
    if (action === 'add') {
      sql = 'UPDATE users SET balance = balance + ?, wallet_balance = wallet_balance + ? WHERE id = ?'
    } else if (action === 'subtract') {
      sql = 'UPDATE users SET balance = balance - ?, wallet_balance = wallet_balance - ? WHERE id = ?'
    } else {
      sql = 'UPDATE users SET balance = ?, wallet_balance = ? WHERE id = ?'
    }

    // Bind amount twice for both balance fields
    await DB.prepare(sql).bind(amount, amount, userId).run()

    const user = await DB.prepare('SELECT balance, wallet_balance FROM users WHERE id = ?').bind(userId).first()

    return c.json({
      success: true,
      message: `Balance updated`,
      newBalance: user?.balance || 0
    })
  } catch (error) {
    console.error('Update balance error:', error)
    return c.json({ success: false, message: 'Failed to update balance' }, 500)
  }
})

// POST /api/admin/user/:id/status - Update user account status
admin.post('/user/:id/status', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = parseInt(c.req.param('id'))
    const { status } = await c.req.json()

    if (!status || !['active', 'suspended', 'banned'].includes(status)) {
      return c.json({ success: false, message: 'Invalid status' }, 400)
    }

    await DB.prepare('UPDATE users SET account_status = ? WHERE id = ?').bind(status, userId).run()

    return c.json({
      success: true,
      message: `Account status updated to ${status}`
    })
  } catch (error) {
    console.error('Update status error:', error)
    return c.json({ success: false, message: 'Failed to update status' }, 500)
  }
})

// DELETE /api/admin/user/:id - Delete user (only if KYC is pending/rejected and no active miners)
admin.delete('/user/:id', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = parseInt(c.req.param('id'))

    // Check user KYC status and active miners
    const user = await DB.prepare(`
      SELECT kyc_status, 
        (SELECT COUNT(*) FROM user_miners WHERE user_id = ? AND status = 'active') as active_miners
      FROM users WHERE id = ?
    `).bind(userId, userId).first()

    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    // Don't allow deletion if user has active miners
    if (user.active_miners > 0) {
      return c.json({ 
        success: false, 
        message: `Cannot delete user with ${user.active_miners} active miners. Suspend account instead.` 
      }, 400)
    }

    // Don't allow deletion if KYC is approved
    if (user.kyc_status === 'approved') {
      return c.json({ 
        success: false, 
        message: 'Cannot delete user with approved KYC. Suspend account instead.' 
      }, 400)
    }

    // Delete user
    await DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run()

    return c.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return c.json({ success: false, message: 'Failed to delete user' }, 500)
  }
})

// GET /api/admin/active-miners - Get all active miners with user and package details
admin.get('/active-miners', async (c) => {
  try {
    const { DB } = c.env as any

    const miners = await DB.prepare(`
      SELECT 
        um.id,
        um.user_id,
        u.email,
        u.full_name,
        um.package_id,
        mp.name as package_name,
        um.hash_rate,
        um.daily_rate,
        um.total_earned,
        um.status,
        um.started_at,
        um.expires_at,
        um.last_earning_at,
        um.created_at,
        CASE 
          WHEN um.expires_at > datetime('now') THEN 'Active'
          ELSE 'Expired'
        END as current_status
      FROM user_miners um
      JOIN users u ON um.user_id = u.id
      JOIN mining_packages mp ON um.package_id = mp.id
      ORDER BY um.created_at DESC
    `).all()

    return c.json({
      success: true,
      miners: miners.results
    })
  } catch (error) {
    console.error('Get active miners error:', error)
    return c.json({ success: false, message: 'Failed to get active miners' }, 500)
  }
})

// GET /api/admin/packages - Get all mining packages
admin.get('/packages', async (c) => {
  try {
    const { DB } = c.env as any

    const packages = await DB.prepare(`
      SELECT 
        mp.*,
        (SELECT COUNT(*) FROM user_miners WHERE package_id = mp.id) as total_purchases,
        (SELECT COUNT(*) FROM user_miners WHERE package_id = mp.id AND status = 'active') as active_miners
      FROM mining_packages mp
      ORDER BY mp.hash_rate ASC
    `).all()

    return c.json({
      success: true,
      packages: packages.results
    })
  } catch (error) {
    console.error('Get packages error:', error)
    return c.json({ success: false, message: 'Failed to get packages' }, 500)
  }
})

// POST /api/admin/packages - Create new package
admin.post('/packages', async (c) => {
  try {
    const { DB } = c.env as any
    const { name, hash_rate, price, daily_earnings, duration_days, description } = await c.req.json()

    if (!name || !hash_rate || !price || !daily_earnings || !duration_days) {
      return c.json({ success: false, message: 'Missing required fields' }, 400)
    }

    const result = await DB.prepare(`
      INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).bind(name, hash_rate, price, daily_earnings, duration_days, description || '').run()

    return c.json({
      success: true,
      message: 'Package created successfully',
      packageId: result.meta.last_row_id
    })
  } catch (error) {
    console.error('Create package error:', error)
    return c.json({ success: false, message: 'Failed to create package' }, 500)
  }
})

// PUT /api/admin/packages/:id - Update package
admin.put('/packages/:id', async (c) => {
  try {
    const { DB } = c.env as any
    const packageId = parseInt(c.req.param('id'))
    const { name, hash_rate, price, daily_earnings, duration_days, description, is_active } = await c.req.json()

    await DB.prepare(`
      UPDATE mining_packages 
      SET name = ?, hash_rate = ?, price = ?, daily_earnings = ?, 
          duration_days = ?, description = ?, is_active = ?
      WHERE id = ?
    `).bind(name, hash_rate, price, daily_earnings, duration_days, description, is_active ? 1 : 0, packageId).run()

    return c.json({
      success: true,
      message: 'Package updated successfully'
    })
  } catch (error) {
    console.error('Update package error:', error)
    return c.json({ success: false, message: 'Failed to update package' }, 500)
  }
})

// DELETE /api/admin/packages/:id - Delete package
admin.delete('/packages/:id', async (c) => {
  try {
    const { DB } = c.env as any
    const packageId = parseInt(c.req.param('id'))

    // Check if package has active miners
    const activeMiners = await DB.prepare(
      'SELECT COUNT(*) as count FROM user_miners WHERE package_id = ? AND status = \'active\''
    ).bind(packageId).first()

    if (activeMiners && activeMiners.count > 0) {
      return c.json({ 
        success: false, 
        message: `Cannot delete package with ${activeMiners.count} active miners. Deactivate instead.` 
      }, 400)
    }

    await DB.prepare('DELETE FROM mining_packages WHERE id = ?').bind(packageId).run()

    return c.json({
      success: true,
      message: 'Package deleted successfully'
    })
  } catch (error) {
    console.error('Delete package error:', error)
    return c.json({ success: false, message: 'Failed to delete package' }, 500)
  }
})

// GET /api/admin/stats - Get comprehensive dashboard statistics
admin.get('/stats', async (c) => {
  try {
    const { DB } = c.env as any

    // Get basic stats
    const stats = await DB.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE created_at >= datetime('now', '-30 days')) as new_users_30d,
        (SELECT COUNT(*) FROM users WHERE kyc_status = 'approved') as verified_users,
        (SELECT COUNT(*) FROM users WHERE kyc_status = 'pending') as pending_kyc,
        (SELECT COUNT(*) FROM user_miners WHERE status = 'active') as active_miners,
        (SELECT SUM(balance) FROM users) as total_balance,
        (SELECT SUM(wallet_balance) FROM users) as total_wallet_balance,
        (SELECT COUNT(*) FROM withdrawals WHERE status = 'pending') as pending_withdrawals,
        (SELECT COUNT(*) FROM withdrawals WHERE status = 'approved') as approved_withdrawals,
        (SELECT SUM(amount) FROM withdrawals WHERE status = 'completed') as total_withdrawn,
        (SELECT COUNT(*) FROM referral_commissions) as total_commissions,
        (SELECT SUM(commission_amount) FROM referral_commissions) as total_commission_amount,
        (SELECT SUM(commission_amount) FROM referral_commissions WHERE status = 'pending') as pending_commission_amount,
        (SELECT COUNT(*) FROM referral_payouts WHERE status = 'pending') as pending_commission_payouts,
        (SELECT SUM(price) FROM mining_packages mp JOIN user_miners um ON mp.id = um.package_id) as total_package_revenue
    `).first()

    // Get mining revenue breakdown
    const miningRevenue = await DB.prepare(`
      SELECT 
        mp.name as package_name,
        mp.price,
        COUNT(*) as total_sales,
        SUM(mp.price) as revenue
      FROM mining_packages mp
      JOIN user_miners um ON mp.id = um.package_id
      GROUP BY mp.id, mp.name, mp.price
      ORDER BY revenue DESC
    `).all()

    // Get recent user signups (last 7 days by day)
    const userGrowth = await DB.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all()

    // Get top referrers
    const topReferrers = await DB.prepare(`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.direct_referrals,
        u.total_referrals,
        u.total_referral_earnings
      FROM users u
      WHERE u.total_referrals > 0
      ORDER BY u.total_referral_earnings DESC
      LIMIT 5
    `).all()

    return c.json({
      success: true,
      stats: {
        ...stats,
        mining_revenue: miningRevenue.results || [],
        user_growth: userGrowth.results || [],
        top_referrers: topReferrers.results || []
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return c.json({ success: false, message: 'Failed to get stats' }, 500)
  }
})

// GET /api/admin/commissions - Get all commissions with filters
admin.get('/commissions', async (c) => {
  try {
    const { DB } = c.env as any
    const limit = parseInt(c.req.query('limit') || '100')

    const commissions = await DB.prepare(`
      SELECT 
        rc.*,
        u1.full_name as referrer_name,
        u1.email as referrer_email,
        u2.full_name as referred_name,
        u2.email as referred_email
      FROM referral_commissions rc
      JOIN users u1 ON rc.referrer_id = u1.id
      JOIN users u2 ON rc.referred_id = u2.id
      ORDER BY rc.created_at DESC
      LIMIT ?
    `).bind(limit).all()

    return c.json({
      success: true,
      commissions: commissions.results || []
    })
  } catch (error) {
    console.error('Get commissions error:', error)
    return c.json({ success: false, message: 'Failed to get commissions' }, 500)
  }
})

// GET /api/admin/quick-actions - Get items needing admin attention
admin.get('/quick-actions', async (c) => {
  try {
    const { DB } = c.env as any

    // Pending KYC requests
    const pendingKYC = await DB.prepare(`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.kyc_status,
        u.created_at
      FROM users u
      WHERE u.kyc_status = 'pending'
      ORDER BY u.created_at DESC
      LIMIT 5
    `).all()

    // Pending withdrawals
    const pendingWithdrawals = await DB.prepare(`
      SELECT 
        w.id,
        w.user_id,
        w.amount,
        w.status,
        w.created_at,
        u.full_name,
        u.email
      FROM withdrawals w
      JOIN users u ON w.user_id = u.id
      WHERE w.status = 'pending'
      ORDER BY w.created_at DESC
      LIMIT 5
    `).all()

    // Pending commission payouts
    const pendingPayouts = await DB.prepare(`
      SELECT 
        rp.id,
        rp.user_id,
        rp.amount,
        rp.status,
        rp.created_at,
        u.full_name,
        u.email
      FROM referral_payouts rp
      JOIN users u ON rp.user_id = u.id
      WHERE rp.status = 'pending'
      ORDER BY rp.created_at DESC
      LIMIT 5
    `).all()

    // Recent user signups (last 24 hours)
    const recentSignups = await DB.prepare(`
      SELECT 
        id,
        full_name,
        email,
        created_at
      FROM users
      WHERE created_at >= datetime('now', '-1 day')
      ORDER BY created_at DESC
      LIMIT 5
    `).all()

    return c.json({
      success: true,
      data: {
        pending_kyc: pendingKYC.results || [],
        pending_withdrawals: pendingWithdrawals.results || [],
        pending_payouts: pendingPayouts.results || [],
        recent_signups: recentSignups.results || []
      }
    })
  } catch (error) {
    console.error('Get quick actions error:', error)
    return c.json({ success: false, message: 'Failed to get quick actions' }, 500)
  }
})

// GET /api/admin/recent-activity - Get recent platform activity
admin.get('/recent-activity', async (c) => {
  try {
    const { DB } = c.env as any
    const limit = parseInt(c.req.query('limit') || '20')

    const activities = []

    // Recent user signups
    const signups = await DB.prepare(`
      SELECT 
        'user_signup' as type,
        id as entity_id,
        full_name as title,
        email as description,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `).all()

    // Recent miner purchases
    const purchases = await DB.prepare(`
      SELECT 
        'miner_purchase' as type,
        um.id as entity_id,
        u.full_name as title,
        mp.name as description,
        um.created_at
      FROM user_miners um
      JOIN users u ON um.user_id = u.id
      JOIN mining_packages mp ON um.package_id = mp.id
      ORDER BY um.created_at DESC
      LIMIT 5
    `).all()

    // Recent withdrawals
    const withdrawals = await DB.prepare(`
      SELECT 
        'withdrawal' as type,
        w.id as entity_id,
        u.full_name as title,
        '$' || w.amount || ' - ' || w.status as description,
        w.created_at
      FROM withdrawals w
      JOIN users u ON w.user_id = u.id
      ORDER BY w.created_at DESC
      LIMIT 5
    `).all()

    // Combine and sort all activities
    const allActivities = [
      ...(signups.results || []),
      ...(purchases.results || []),
      ...(withdrawals.results || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)

    return c.json({
      success: true,
      activities: allActivities
    })
  } catch (error) {
    console.error('Get recent activity error:', error)
    return c.json({ success: false, message: 'Failed to get recent activity' }, 500)
  }
})

export default admin
