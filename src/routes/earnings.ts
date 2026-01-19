import { Hono } from 'hono';
import { requireAdmin } from '../middleware/auth';

type Bindings = {
  DB: D1Database;
};

const earnings = new Hono<{ Bindings: Bindings }>();

// Calculate and distribute daily earnings (admin or cron)
earnings.post('/calculate-daily', requireAdmin, async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`🕐 Starting daily earnings calculation for ${today}`);

    // Get all active machines that haven't expired
    const { results: activeMachines } = await c.env.DB.prepare(`
      SELECT 
        um.id as miner_id,
        um.user_id,
        um.package_id,
        um.activated_at,
        um.expires_at,
        um.last_earning_at,
        mp.daily_earnings,
        mp.name as package_name,
        u.email,
        u.wallet_balance
      FROM user_miners um
      JOIN mining_packages mp ON um.package_id = mp.id
      JOIN users u ON um.user_id = u.id
      WHERE um.activation_status = 'active'
        AND datetime(um.expires_at) > datetime('now')
        AND (
          um.last_earning_at IS NULL 
          OR date(um.last_earning_at) < date('now')
        )
    `).all();

    if (!activeMachines || activeMachines.length === 0) {
      return c.json({
        success: true,
        message: 'No active machines found for earnings calculation',
        processed: 0,
        date: today
      });
    }

    console.log(`📊 Found ${activeMachines.length} active machines to process`);

    let processed = 0;
    let totalEarningsDistributed = 0;
    const errors = [];

    for (const machine of activeMachines) {
      try {
        const m = machine as any;
        const earningsAmount = m.daily_earnings;

        // Add earnings to user balance (update both fields to keep in sync)
        await c.env.DB.prepare(`
          UPDATE users 
          SET balance = balance + ?,
              wallet_balance = wallet_balance + ?
          WHERE id = ?
        `).bind(earningsAmount, earningsAmount, m.user_id).run();

        // Record in earnings history
        await c.env.DB.prepare(`
          INSERT INTO earnings_history (
            user_id, 
            miner_id, 
            amount, 
            date,
            created_at
          ) VALUES (?, ?, ?, ?, datetime('now'))
        `).bind(m.user_id, m.miner_id, earningsAmount, today).run();

        // Update last_earning_at on machine
        await c.env.DB.prepare(`
          UPDATE user_miners
          SET last_earning_at = datetime('now')
          WHERE id = ?
        `).bind(m.miner_id).run();

        processed++;
        totalEarningsDistributed += earningsAmount;

        console.log(`✅ Processed machine #${m.miner_id}: $${earningsAmount} → ${m.email}`);
      } catch (error: any) {
        console.error(`❌ Error processing machine #${machine.miner_id}:`, error);
        errors.push({
          miner_id: machine.miner_id,
          error: error.message
        });
      }
    }

    // Log admin action (skip if logging fails - non-critical)
    try {
      const adminEmail = c.get('userEmail') || 'cron-system';
      // Try to get admin_id, default to system user (id 1) for cron
      const admin = await c.env.DB.prepare(`
        SELECT id FROM users WHERE email = ? AND role = 'admin'
      `).bind(adminEmail).first() as any;
      
      const adminId = admin?.id || 1; // Default to system admin
      
      await c.env.DB.prepare(`
        INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        adminId,
        'calculate_daily_earnings',
        'earnings',
        0,
        `Daily earnings calculated: ${processed} machines, $${totalEarningsDistributed.toFixed(2)} distributed, ${errors.length} errors`
      ).run();
    } catch (logError) {
      console.warn('Failed to log admin action (non-critical):', logError);
    }

    return c.json({
      success: true,
      message: `Daily earnings calculated successfully`,
      date: today,
      processed_machines: processed,
      total_machines: activeMachines.length,
      total_distributed: totalEarningsDistributed,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('❌ Daily earnings calculation failed:', error);
    return c.json({
      success: false,
      message: 'Failed to calculate daily earnings',
      error: error.message
    }, 500);
  }
});

// Get earnings history for a user
earnings.get('/history/:userId', requireAdmin, async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));

    const { results } = await c.env.DB.prepare(`
      SELECT 
        eh.id,
        eh.amount,
        eh.date,
        eh.created_at,
        um.id as miner_id,
        mp.name as package_name
      FROM earnings_history eh
      JOIN user_miners um ON eh.miner_id = um.id
      JOIN mining_packages mp ON um.package_id = mp.id
      WHERE eh.user_id = ?
      ORDER BY eh.created_at DESC
      LIMIT 100
    `).bind(userId).all();

    return c.json({
      success: true,
      history: results
    });
  } catch (error: any) {
    console.error('Get earnings history error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch earnings history'
    }, 500);
  }
});

// Get earnings statistics
earnings.get('/stats', requireAdmin, async (c) => {
  try {
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(DISTINCT user_id) as active_users,
        COUNT(DISTINCT miner_id) as earning_miners,
        SUM(amount) as total_distributed,
        date(MIN(created_at)) as first_earnings_date,
        date(MAX(created_at)) as last_earnings_date
      FROM earnings_history
    `).first();

    const todayStats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as today_earnings_count,
        SUM(amount) as today_total
      FROM earnings_history
      WHERE date(created_at) = date('now')
    `).first();

    return c.json({
      success: true,
      stats: {
        ...stats,
        ...todayStats
      }
    });
  } catch (error: any) {
    console.error('Get earnings stats error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch earnings statistics'
    }, 500);
  }
});

export default earnings;
