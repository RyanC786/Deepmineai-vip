/**
 * Partner Tracking Utilities
 * Automatically track partner residuals when machines are purchased
 */

export interface MachinePartnerPurchaseData {
  userId: number
  minerId: number
  packageId: number
  packageName: string
  price: number
  dailyEarnings: number
  durationDays: number
  startDate: string
  expiresAt: string
}

/**
 * Create partner residual tracking record when machine is purchased
 */
export async function trackPartnerResidual(
  DB: D1Database,
  data: MachinePartnerPurchaseData
): Promise<{ success: boolean; residualId?: number; error?: string }> {
  try {
    // Get partner config
    const partnerConfig = await DB.prepare(
      'SELECT * FROM partner_config WHERE id = 1 AND is_active = 1'
    ).first() as any
    
    if (!partnerConfig) {
      console.warn('[Partner] No active partner config found')
      return { success: false, error: 'No active partner' }
    }
    
    // Calculate earnings and residual
    const totalEarnings = data.dailyEarnings * data.durationDays
    const netProfit = totalEarnings - data.price
    
    let residualAmount = 0
    if (partnerConfig.calculation_method === 'net_profit') {
      residualAmount = netProfit * (partnerConfig.residual_percentage / 100)
    } else {
      // total_returns method
      residualAmount = totalEarnings * (partnerConfig.residual_percentage / 100)
    }
    
    // Insert residual tracking record
    const result = await DB.prepare(`
      INSERT INTO partner_residuals (
        partner_id,
        user_id,
        miner_id,
        package_id,
        package_name,
        investment_amount,
        daily_earnings,
        total_earnings,
        net_profit,
        residual_percentage,
        residual_amount,
        contract_start_date,
        contract_end_date,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      partnerConfig.id,
      data.userId,
      data.minerId,
      data.packageId,
      data.packageName,
      data.price,
      data.dailyEarnings,
      totalEarnings,
      netProfit,
      partnerConfig.residual_percentage,
      residualAmount,
      data.startDate.split('T')[0],
      data.expiresAt.split('T')[0],
      'pending'
    ).run()
    
    console.log(`[Partner] Tracked residual for miner #${data.minerId}: $${residualAmount.toFixed(2)} (${partnerConfig.residual_percentage}% of $${netProfit.toFixed(2)})`)
    
    return {
      success: true,
      residualId: result.meta.last_row_id as number
    }
  } catch (error: any) {
    console.error('[Partner] Error tracking residual:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Mark contract as completed and residual ready for payout
 * Called by cron job when contract reaches expiration date
 */
export async function markResidualCompleted(
  DB: D1Database,
  minerId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await DB.prepare(`
      UPDATE partner_residuals
      SET status = 'completed',
          completed_at = datetime('now'),
          updated_at = datetime('now')
      WHERE miner_id = ?
        AND status = 'pending'
        AND date(contract_end_date) <= date('now')
    `).bind(minerId).run()
    
    console.log(`[Partner] Marked residual completed for miner #${minerId}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('[Partner] Error marking residual completed:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Track withdrawal fee analytics
 */
export async function trackWithdrawalFee(
  DB: D1Database,
  withdrawalData: {
    withdrawalId: number
    userId: number
    amount: number
    networkType: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const feePercentage = 2.0 // 2% platform fee
    const feeAmount = withdrawalData.amount * (feePercentage / 100)
    
    // Network fees (cost to platform)
    const networkFees: { [key: string]: number } = {
      'TRC-20': 1.0,
      'ERC-20': 3.0,
      'BTC': 2.0,
      'USDT': 1.0
    }
    
    const networkFee = networkFees[withdrawalData.networkType] || 1.0
    const netProfit = feeAmount - networkFee
    const profitMarginPercentage = (netProfit / feeAmount) * 100
    
    await DB.prepare(`
      INSERT INTO withdrawal_fee_analytics (
        withdrawal_id,
        user_id,
        withdrawal_amount,
        fee_percentage,
        fee_amount,
        network_type,
        network_fee,
        net_profit,
        profit_margin_percentage,
        withdrawal_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'))
    `).bind(
      withdrawalData.withdrawalId,
      withdrawalData.userId,
      withdrawalData.amount,
      feePercentage,
      feeAmount,
      withdrawalData.networkType,
      networkFee,
      netProfit,
      profitMarginPercentage
    ).run()
    
    console.log(`[Partner] Tracked withdrawal fee: $${feeAmount.toFixed(2)} (net: $${netProfit.toFixed(2)}, margin: ${profitMarginPercentage.toFixed(1)}%)`)
    
    return { success: true }
  } catch (error: any) {
    console.error('[Partner] Error tracking withdrawal fee:', error)
    return { success: false, error: error.message }
  }
}
