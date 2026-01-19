import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'

type Bindings = {
  DB: D1Database
}

const dailyBonus = new Hono<{ Bindings: Bindings }>()

// Bonus configuration
const BONUS_AMOUNT = 1.00  // $1 daily bonus
const UK_CUTOFF_HOUR = 17  // 5 PM UK time

/**
 * Helper: Get current UK date and time
 * UK timezone is Europe/London (GMT or BST depending on season)
 */
function getUKDateTime(): { date: string; time: string; hour: number } {
  const now = new Date()
  
  // Convert to UK timezone string
  const ukDateTimeString = now.toLocaleString('en-GB', { 
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  // Parse: "DD/MM/YYYY, HH:MM:SS"
  const [datePart, timePart] = ukDateTimeString.split(', ')
  const [day, month, year] = datePart.split('/')
  const date = `${year}-${month}-${day}`  // YYYY-MM-DD
  const time = timePart  // HH:MM:SS
  const hour = parseInt(timePart.split(':')[0])
  
  return { date, time, hour }
}

/**
 * GET /api/daily-bonus/status
 * Check if user can claim today's bonus
 */
dailyBonus.get('/status', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { date, time, hour } = getUKDateTime()
    
    // Check if already claimed today
    const existingClaim = await c.env.DB.prepare(`
      SELECT * FROM daily_login_bonuses 
      WHERE user_id = ? AND claim_date = ?
    `).bind(userId, date).first() as any
    
    const canClaim = !existingClaim && hour < UK_CUTOFF_HOUR
    
    return c.json({
      success: true,
      canClaim: canClaim,
      alreadyClaimed: !!existingClaim,
      bonusAmount: BONUS_AMOUNT,
      currentUKTime: `${date} ${time}`,
      currentUKHour: hour,
      cutoffHour: UK_CUTOFF_HOUR,
      message: canClaim 
        ? 'You can claim your daily bonus!' 
        : existingClaim 
          ? 'Already claimed today. Come back tomorrow!' 
          : 'Bonus claiming period ended (after 5 PM UK time). Try again tomorrow!',
      claimedAt: existingClaim?.claimed_at || null
    })
  } catch (error: any) {
    console.error('Daily bonus status error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to check bonus status' 
    }, 500)
  }
})

/**
 * POST /api/daily-bonus/claim
 * Claim today's daily login bonus
 */
dailyBonus.post('/claim', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const userEmail = c.get('userEmail')
    const { date, time, hour } = getUKDateTime()
    
    // Security: Get client IP and user agent
    const ipAddress = c.req.header('CF-Connecting-IP') || 
                     c.req.header('X-Forwarded-For') || 
                     c.req.header('X-Real-IP') || 
                     'unknown'
    const userAgent = c.req.header('User-Agent') || 'unknown'
    
    // Validation 1: Check if after 5 PM UK time
    if (hour >= UK_CUTOFF_HOUR) {
      return c.json({
        success: false,
        message: `Daily bonus can only be claimed before ${UK_CUTOFF_HOUR}:00 UK time. Current UK time: ${time}. Come back tomorrow!`,
        currentUKTime: `${date} ${time}`,
        cutoffHour: UK_CUTOFF_HOUR
      }, 400)
    }
    
    // Validation 2: Check if already claimed today
    const existingClaim = await c.env.DB.prepare(`
      SELECT * FROM daily_login_bonuses 
      WHERE user_id = ? AND claim_date = ?
    `).bind(userId, date).first() as any
    
    if (existingClaim) {
      return c.json({
        success: false,
        message: 'You have already claimed your daily bonus today. Come back tomorrow!',
        claimedAt: existingClaim.claimed_at,
        nextClaimDate: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }, 400)
    }
    
    // Get user's current balance
    const user = await c.env.DB.prepare(`
      SELECT balance FROM users WHERE id = ?
    `).bind(userId).first() as any
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }
    
    const now = new Date().toISOString()
    
    // Record the bonus claim
    await c.env.DB.prepare(`
      INSERT INTO daily_login_bonuses (
        user_id, 
        bonus_amount, 
        claimed_at, 
        claim_date, 
        uk_time, 
        is_valid,
        ip_address,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `).bind(
      userId, 
      BONUS_AMOUNT, 
      now, 
      date, 
      time,
      ipAddress,
      userAgent
    ).run()
    
    // Update user's balance (update BOTH balance fields to keep them in sync)
    await c.env.DB.prepare(`
      UPDATE users 
      SET balance = balance + ?,
          wallet_balance = wallet_balance + ?,
          total_login_bonuses = COALESCE(total_login_bonuses, 0) + ?
      WHERE id = ?
    `).bind(BONUS_AMOUNT, BONUS_AMOUNT, BONUS_AMOUNT, userId).run()
    
    // Record transaction
    await c.env.DB.prepare(`
      INSERT INTO transactions (
        user_id,
        transaction_type,
        amount,
        status,
        reference_id,
        description,
        created_at
      ) VALUES (?, 'bonus', ?, 'completed', ?, ?, ?)
    `).bind(
      userId,
      BONUS_AMOUNT,
      `LOGIN_BONUS_${date}`,
      `Daily Login Bonus - ${date}`,
      now
    ).run()
    
    const newBalance = (user.balance || 0) + BONUS_AMOUNT
    
    console.log(`✅ Daily bonus claimed: User ${userEmail} (${userId}) received $${BONUS_AMOUNT} at ${date} ${time} UK time`)
    
    return c.json({
      success: true,
      message: `Congratulations! You've received your daily login bonus of $${BONUS_AMOUNT}!`,
      bonusAmount: BONUS_AMOUNT,
      newBalance: newBalance,
      claimedAt: now,
      ukDateTime: `${date} ${time}`
    })
    
  } catch (error: any) {
    console.error('Daily bonus claim error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to claim daily bonus' 
    }, 500)
  }
})

/**
 * GET /api/daily-bonus/history
 * Get user's bonus claim history
 */
dailyBonus.get('/history', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id,
        bonus_amount,
        claimed_at,
        claim_date,
        uk_time,
        is_valid
      FROM daily_login_bonuses
      WHERE user_id = ?
      ORDER BY claim_date DESC
      LIMIT 30
    `).bind(userId).all()
    
    const user = await c.env.DB.prepare(`
      SELECT total_login_bonuses FROM users WHERE id = ?
    `).bind(userId).first() as any
    
    return c.json({
      success: true,
      history: results,
      totalBonuses: user?.total_login_bonuses || 0,
      count: results.length
    })
    
  } catch (error: any) {
    console.error('Daily bonus history error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to fetch bonus history' 
    }, 500)
  }
})

/**
 * GET /api/daily-bonus/stats
 * Get platform-wide bonus statistics (admin only)
 */
dailyBonus.get('/stats', async (c) => {
  try {
    const { date } = getUKDateTime()
    
    // Today's claims
    const todayStats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as claims_today,
        SUM(bonus_amount) as total_paid_today
      FROM daily_login_bonuses
      WHERE claim_date = ?
    `).bind(date).first() as any
    
    // All-time stats
    const allTimeStats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_claims,
        SUM(bonus_amount) as total_paid_all_time,
        COUNT(DISTINCT user_id) as unique_users
      FROM daily_login_bonuses
    `).first() as any
    
    return c.json({
      success: true,
      today: {
        claims: todayStats?.claims_today || 0,
        totalPaid: todayStats?.total_paid_today || 0
      },
      allTime: {
        totalClaims: allTimeStats?.total_claims || 0,
        totalPaid: allTimeStats?.total_paid_all_time || 0,
        uniqueUsers: allTimeStats?.unique_users || 0
      },
      currentDate: date
    })
    
  } catch (error: any) {
    console.error('Daily bonus stats error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to fetch bonus stats' 
    }, 500)
  }
})

export default dailyBonus
