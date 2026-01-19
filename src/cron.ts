/**
 * Cloudflare Workers Cron Jobs
 * 
 * This module handles scheduled tasks that run automatically at specified intervals.
 * Currently handles daily earnings distribution for active mining machines.
 */

import { markResidualCompleted } from './utils/partner-tracking'

type Bindings = {
  DB: D1Database;
};

/**
 * Calculate and distribute daily earnings to all active machines
 * Runs automatically via Cloudflare Workers Cron Trigger
 * Schedule: Daily at 00:00 UTC (midnight)
 */
export async function calculateDailyEarnings(DB: D1Database): Promise<void> {
  const startTime = Date.now();
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`🕐 [CRON] Starting daily earnings calculation for ${today}`);

  try {
    // Get all active machines that haven't received today's earnings yet
    const { results: activeMachines } = await DB.prepare(`
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
      console.log(`✅ [CRON] No active machines found for earnings calculation`);
      return;
    }

    console.log(`📊 [CRON] Found ${activeMachines.length} active machines to process`);

    let processed = 0;
    let totalEarningsDistributed = 0;
    const errors = [];

    // Process each machine
    for (const machine of activeMachines) {
      try {
        const m = machine as any;
        const earningsAmount = m.daily_earnings;

        // Add earnings to user balance (update both fields to keep in sync)
        await DB.prepare(`
          UPDATE users 
          SET balance = balance + ?,
              wallet_balance = wallet_balance + ?
          WHERE id = ?
        `).bind(earningsAmount, earningsAmount, m.user_id).run();

        // Record in earnings history
        await DB.prepare(`
          INSERT INTO earnings_history (
            user_id, 
            miner_id, 
            amount, 
            date,
            created_at
          ) VALUES (?, ?, ?, ?, datetime('now'))
        `).bind(m.user_id, m.miner_id, earningsAmount, today).run();

        // Update last_earning_at on machine
        await DB.prepare(`
          UPDATE user_miners
          SET last_earning_at = datetime('now'),
              total_earned = total_earned + ?
          WHERE id = ?
        `).bind(earningsAmount, m.miner_id).run();

        processed++;
        totalEarningsDistributed += earningsAmount;

        console.log(`✅ [CRON] Machine #${m.miner_id}: $${earningsAmount} → ${m.email}`);
      } catch (error: any) {
        console.error(`❌ [CRON] Error processing machine #${machine.miner_id}:`, error);
        errors.push({
          miner_id: machine.miner_id,
          error: error.message
        });
      }
    }

    // Log cron execution (skip if logging fails - non-critical)
    try {
      await DB.prepare(`
        INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        1, // System admin ID
        'cron_daily_earnings',
        'earnings',
        0,
        `Cron: ${processed} machines processed, $${totalEarningsDistributed.toFixed(2)} distributed, ${errors.length} errors`
      ).run();
    } catch (logError) {
      console.warn('[CRON] Failed to log execution (non-critical):', logError);
    }

    // Mark partner residuals as completed for expired contracts
    try {
      const { results: expiredContracts } = await DB.prepare(`
        SELECT id FROM user_miners
        WHERE activation_status = 'active'
          AND date(expires_at) <= date('now')
      `).all()
      
      let residualsMarked = 0
      const completedResiduals: any[] = []
      
      for (const contract of expiredContracts) {
        const c = contract as any
        const result = await markResidualCompleted(DB, c.id)
        if (result.success) {
          residualsMarked++
          completedResiduals.push(c)
        }
      }
      
      if (residualsMarked > 0) {
        console.log(`💰 [CRON] Marked ${residualsMarked} partner residuals as completed`)
        
        // Send email notification to partner
        try {
          const { sendPartnerContractCompletionEmail } = await import('./utils/email')
          const RESEND_API_KEY = env.RESEND_API_KEY
          
          if (RESEND_API_KEY && completedResiduals.length > 0) {
            // Get total residual amount
            const totalResidual = completedResiduals.reduce((sum, r) => sum + (r.residual_amount || 0), 0)
            
            // Get contract details with user info
            const contractDetails = []
            for (const residual of completedResiduals) {
              const user = await DB.prepare('SELECT email FROM users WHERE id = ?').bind(residual.user_id).first() as any
              contractDetails.push({
                package_name: residual.package_name,
                user_email: user?.email || 'Unknown',
                investment: residual.investment,
                residual_amount: residual.residual_amount
              })
            }
            
            const emailResult = await sendPartnerContractCompletionEmail(
              'aleena@deepmineai.vip',
              completedResiduals.length,
              totalResidual,
              contractDetails,
              RESEND_API_KEY
            )
            
            if (emailResult.success) {
              console.log(`📧 [CRON] Partner notification email sent to aleena@deepmineai.vip`)
            } else {
              console.warn(`⚠️ [CRON] Failed to send partner email:`, emailResult.error)
            }
          }
        } catch (emailError) {
          console.warn('[CRON] Error sending partner email (non-critical):', emailError)
        }
      }
    } catch (error) {
      console.warn('[CRON] Error marking residuals completed (non-critical):', error)
    }

    const duration = Date.now() - startTime;
    console.log(`🎉 [CRON] Daily earnings calculation completed in ${duration}ms`);
    console.log(`📊 [CRON] Summary: ${processed}/${activeMachines.length} machines, $${totalEarningsDistributed.toFixed(2)} distributed`);
    
    if (errors.length > 0) {
      console.warn(`⚠️ [CRON] ${errors.length} errors occurred:`, errors);
    }

  } catch (error: any) {
    console.error('❌ [CRON] Daily earnings calculation failed:', error);
    console.error('[CRON] Error stack:', error.stack);
    
    // Try to log the failure
    try {
      await DB.prepare(`
        INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        1,
        'cron_error',
        'earnings',
        0,
        `Cron failed: ${error.message}`
      ).run();
    } catch (logError) {
      console.warn('[CRON] Failed to log error (non-critical):', logError);
    }
    
    // Don't throw - cron should not fail worker
  }
}
