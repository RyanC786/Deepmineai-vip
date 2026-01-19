import { Hono } from 'hono'
import { distributeCommissions } from '../utils/referral'

const mining = new Hono()

/**
 * GET /api/mining/packages
 * Get available mining packages
 */
mining.get('/packages', async (c) => {
  try {
    const { DB } = c.env as any

    const packages = await DB.prepare(`
      SELECT * FROM mining_packages 
      WHERE is_active = 1 
      ORDER BY hash_rate ASC
    `).all()

    return c.json({
      success: true,
      packages: packages.results || []
    })
  } catch (error) {
    console.error('Failed to fetch packages:', error)
    return c.json({ success: false, message: 'Failed to fetch packages' }, 500)
  }
})

/**
 * POST /api/mining/purchase
 * Purchase a mining package
 */
mining.post('/purchase', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = c.get('userId')
    const { packageId } = await c.req.json()

    if (!userId) {
      return c.json({ success: false, message: 'Authentication required' }, 401)
    }

    // Check if user is KYC approved
    const user = await DB.prepare(
      'SELECT kyc_status FROM users WHERE id = ?'
    ).bind(userId).first() as any

    if (user?.kyc_status !== 'approved') {
      return c.json({ success: false, message: 'KYC approval required' }, 403)
    }

    // Get package details
    const pkg = await DB.prepare(
      'SELECT * FROM mining_packages WHERE id = ? AND is_active = 1'
    ).bind(packageId).first() as any

    if (!pkg) {
      return c.json({ success: false, message: 'Package not found' }, 404)
    }

    // Create miner
    const startedAt = new Date().toISOString()
    const expiresAt = new Date(Date.now() + pkg.duration_days * 24 * 60 * 60 * 1000).toISOString()

    const result = await DB.prepare(`
      INSERT INTO user_miners (
        user_id, package_id, hash_rate, daily_rate, 
        started_at, expires_at, last_earning_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      packageId,
      pkg.hash_rate,
      pkg.daily_earnings,
      startedAt,
      expiresAt,
      startedAt
    ).run()

    // Log session
    await DB.prepare(`
      INSERT INTO mining_sessions (user_id, miner_id, action)
      VALUES (?, ?, 'start')
    `).bind(userId, result.meta.last_row_id).run()

    // Distribute referral commissions
    try {
      await distributeCommissions(userId, packageId, pkg.price, DB)
      console.log(`✅ Commissions distributed for user ${userId}, package ${packageId}`)
    } catch (error) {
      console.error('Failed to distribute commissions:', error)
      // Don't fail the purchase if commission distribution fails
    }

    return c.json({
      success: true,
      message: 'Mining package activated',
      miner: {
        id: result.meta.last_row_id,
        packageName: pkg.name,
        hashRate: pkg.hash_rate,
        dailyEarnings: pkg.daily_earnings,
        expiresAt
      }
    })
  } catch (error) {
    console.error('Failed to purchase package:', error)
    return c.json({ success: false, message: 'Failed to purchase package' }, 500)
  }
})

/**
 * GET /api/mining/status
 * Get user's mining status
 */
mining.get('/status', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ success: false, message: 'Authentication required' }, 401)
    }

    // Get active miners
    const miners = await DB.prepare(`
      SELECT 
        um.*,
        mp.name as package_name,
        mp.hash_rate,
        mp.daily_earnings as daily_rate
      FROM user_miners um
      JOIN mining_packages mp ON um.package_id = mp.id
      WHERE um.user_id = ? 
        AND um.activation_status = 'active'
        AND datetime(um.expires_at) > datetime('now')
      ORDER BY um.created_at DESC
    `).bind(userId).all()

    // Calculate current earnings
    let totalHashRate = 0
    let totalDailyRate = 0
    let totalEarned = 0

    for (const miner of miners.results || []) {
      totalHashRate += miner.hash_rate
      totalDailyRate += miner.daily_rate
      totalEarned += miner.total_earned || 0
    }

    return c.json({
      success: true,
      status: {
        hasActiveMiners: (miners.results?.length || 0) > 0,
        activeMiners: miners.results?.length || 0,
        totalHashRate,
        totalDailyRate,
        totalEarned,
        miners: miners.results || []
      }
    })
  } catch (error) {
    console.error('Failed to get mining status:', error)
    return c.json({ success: false, message: 'Failed to get mining status' }, 500)
  }
})

/**
 * GET /api/mining/earnings/today
 * Get today's earnings
 */
mining.get('/earnings/today', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ success: false, message: 'Authentication required' }, 401)
    }

    const today = new Date().toISOString().split('T')[0]

    const result = await DB.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM earnings_history
      WHERE user_id = ? AND date = ?
    `).bind(userId, today).first() as any

    return c.json({
      success: true,
      dailyEarnings: result?.total || 0,
      date: today
    })
  } catch (error) {
    console.error('Failed to get daily earnings:', error)
    return c.json({ success: false, message: 'Failed to get daily earnings' }, 500)
  }
})

/**
 * GET /api/mining/earnings/history
 * Get earnings history
 */
mining.get('/earnings/history', async (c) => {
  try {
    const { DB } = c.env as any
    const userId = c.get('userId')
    const days = parseInt(c.req.query('days') || '7')

    if (!userId) {
      return c.json({ success: false, message: 'Authentication required' }, 401)
    }

    const history = await DB.prepare(`
      SELECT 
        date,
        SUM(amount) as total
      FROM earnings_history
      WHERE user_id = ?
        AND date >= date('now', '-${days} days')
      GROUP BY date
      ORDER BY date DESC
    `).bind(userId).all()

    return c.json({
      success: true,
      history: history.results || []
    })
  } catch (error) {
    console.error('Failed to get earnings history:', error)
    return c.json({ success: false, message: 'Failed to get earnings history' }, 500)
  }
})

/**
 * POST /api/mining/calculate-earnings
 * Calculate and record earnings for all active miners (called by cron/scheduler)
 */
mining.post('/calculate-earnings', async (c) => {
  try {
    const { DB } = c.env as any

    // Get all active miners that haven't been calculated today
    const today = new Date().toISOString().split('T')[0]
    const todayStart = `${today} 00:00:00`

    const miners = await DB.prepare(`
      SELECT 
        um.*
      FROM user_miners um
      WHERE um.status = 'active'
        AND datetime(um.expires_at) > datetime('now')
        AND (um.last_earning_at IS NULL OR datetime(um.last_earning_at) < datetime(?))
    `).bind(todayStart).all()

    let processed = 0
    const now = new Date().toISOString()

    for (const miner of miners.results || []) {
      // Calculate earnings based on time elapsed
      const lastEarning = miner.last_earning_at ? new Date(miner.last_earning_at) : new Date(miner.started_at)
      const hoursElapsed = Math.min(24, (Date.now() - lastEarning.getTime()) / (1000 * 60 * 60))
      const earningsAmount = (miner.daily_rate / 24) * hoursElapsed

      // Record earnings
      await DB.prepare(`
        INSERT INTO earnings_history (user_id, miner_id, amount, date)
        VALUES (?, ?, ?, ?)
      `).bind(miner.user_id, miner.id, earningsAmount, today).run()

      // Update miner
      const newTotal = (miner.total_earned || 0) + earningsAmount
      await DB.prepare(`
        UPDATE user_miners 
        SET total_earned = ?, last_earning_at = ?
        WHERE id = ?
      `).bind(newTotal, now, miner.id).run()

      // Update user balance
      await DB.prepare(`
        UPDATE users 
        SET balance = COALESCE(balance, 0) + ?
        WHERE id = ?
      `).bind(earningsAmount, miner.user_id).run()

      processed++
    }

    return c.json({
      success: true,
      message: `Calculated earnings for ${processed} miners`,
      processed
    })
  } catch (error) {
    console.error('Failed to calculate earnings:', error)
    return c.json({ success: false, message: 'Failed to calculate earnings' }, 500)
  }
})

export default mining
