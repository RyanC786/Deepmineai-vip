import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Helper: Generate unique referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Helper: Calculate VIP level based on referrals
async function calculateVIPLevel(directReferrals: number, networkSize: number, db: D1Database): Promise<number> {
  const vipLevels = await db.prepare(`
    SELECT level FROM vip_levels 
    WHERE min_direct_referrals <= ? AND min_network_size <= ?
    ORDER BY level DESC 
    LIMIT 1
  `).bind(directReferrals, networkSize).first()
  
  return vipLevels?.level || 1
}

// Helper: Get or create referral code for user
async function ensureReferralCode(userId: number, db: D1Database): Promise<string> {
  const user = await db.prepare('SELECT referral_code FROM users WHERE id = ?').bind(userId).first()
  
  if (user?.referral_code) {
    return user.referral_code as string
  }
  
  // Generate unique code
  let code = generateReferralCode()
  let attempts = 0
  
  while (attempts < 10) {
    const existing = await db.prepare('SELECT id FROM users WHERE referral_code = ?').bind(code).first()
    if (!existing) break
    code = generateReferralCode()
    attempts++
  }
  
  await db.prepare('UPDATE users SET referral_code = ? WHERE id = ?').bind(code, userId).run()
  return code
}

// GET /api/referral/code - Get user's referral code
app.get('/code', async (c) => {
  try {
    const userId = c.get('userId')
    if (!userId) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }
    
    const code = await ensureReferralCode(userId, c.env.DB)
    const referralLink = `https://www.deepmineai.vip/register?ref=${code}`
    
    return c.json({
      success: true,
      referralCode: code,
      referralLink
    })
  } catch (error) {
    console.error('Get referral code error:', error)
    return c.json({ success: false, message: 'Failed to get referral code' }, 500)
  }
})

// GET /api/referral/stats - Get user's referral statistics
app.get('/stats', async (c) => {
  try {
    const userId = c.get('userId')
    if (!userId) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }
    
    // Get user stats
    const user = await c.env.DB.prepare(`
      SELECT 
        vip_level,
        direct_referrals,
        network_size,
        total_referrals
      FROM users 
      WHERE id = ?
    `).bind(userId).first()
    
    // Get VIP level info
    const vipInfo = await c.env.DB.prepare(`
      SELECT * FROM vip_levels WHERE level = ?
    `).bind(user?.vip_level || 1).first()
    
    // Get next VIP level info
    const nextVip = await c.env.DB.prepare(`
      SELECT * FROM vip_levels WHERE level = ?
    `).bind((user?.vip_level || 1) + 1).first()
    
    // Get total commission earnings (using 0 for now as commission table structure differs)
    const commissions = { total_earned: 0, total_commissions: 0 }
    
    // Get commission breakdown by level (empty for now)
    const commissionsByLevel = { results: [] }
    
    return c.json({
      success: true,
      stats: {
        vipLevel: user?.vip_level || 1,
        directReferrals: user?.direct_referrals || 0,
        networkSize: user?.network_size || 0,
        totalReferrals: user?.total_referrals || 0,
        totalEarned: commissions?.total_earned || 0,
        totalCommissions: commissions?.total_commissions || 0,
        commissionsByLevel: commissionsByLevel.results
      },
      vipInfo,
      nextVip
    })
  } catch (error) {
    console.error('Get referral stats error:', error)
    return c.json({ success: false, message: 'Failed to get stats' }, 500)
  }
})

// GET /api/referral/downline - Get user's downline (direct referrals)
app.get('/downline', async (c) => {
  try {
    const userId = c.get('userId')
    if (!userId) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }
    
    const user = await c.env.DB.prepare('SELECT referral_code FROM users WHERE id = ?').bind(userId).first()
    if (!user?.referral_code) {
      return c.json({ success: true, downline: [] })
    }
    
    // Get direct referrals (Level 1)
    const directReferrals = await c.env.DB.prepare(`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.vip_level,
        u.direct_referrals,
        u.network_size,
        u.created_at,
        (SELECT COUNT(*) FROM user_miners WHERE user_id = u.id AND status = 'active') as active_miners,
        0 as commission_earned
      FROM users u
      WHERE u.referred_by = ?
      ORDER BY u.created_at DESC
    `).bind(user.referral_code).all()
    
    return c.json({
      success: true,
      downline: directReferrals.results
    })
  } catch (error) {
    console.error('Get downline error:', error)
    return c.json({ success: false, message: 'Failed to get downline' }, 500)
  }
})

// GET /api/referral/network-tree - Get full network tree (3 levels deep)
app.get('/network-tree', async (c) => {
  try {
    const userId = c.get('userId')
    if (!userId) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }
    
    // Get network members (up to 3 levels)
    const network = await c.env.DB.prepare(`
      SELECT 
        rt.level,
        u.id,
        u.email,
        u.full_name,
        u.vip_level,
        u.direct_referrals,
        u.created_at,
        (SELECT COUNT(*) FROM user_miners WHERE user_id = u.id AND status = 'active') as active_miners
      FROM referral_tree rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.ancestor_id = ? AND rt.level <= 3
      ORDER BY rt.level, u.created_at DESC
    `).bind(userId).all()
    
    return c.json({
      success: true,
      network: network.results
    })
  } catch (error) {
    console.error('Get network tree error:', error)
    return c.json({ success: false, message: 'Failed to get network tree' }, 500)
  }
})

// GET /api/referral/commissions - Get commission history
app.get('/commissions', async (c) => {
  try {
    const userId = c.get('userId')
    if (!userId) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }
    
    // Return empty commissions for now (table structure needs update)
    return c.json({
      success: true,
      commissions: []
    })
  } catch (error) {
    console.error('Get commissions error:', error)
    return c.json({ success: false, message: 'Failed to get commissions' }, 500)
  }
})

export default app
