/**
 * Partner Residual Tracking System
 * Tracks partner residuals based on completed mining contracts
 * 2% residual on net profit after 180 days
 */

import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'

type Bindings = {
  DB: D1Database;
}

const partner = new Hono<{ Bindings: Bindings }>()

// Partner auth middleware
const requirePartnerAuth = async (c: any, next: any) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '') || 
                c.req.cookie('partner_token')
  
  if (!token) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
  
  try {
    const payload = await verify(token, 'deepmine-partner-jwt-secret-2025')
    c.set('partnerId', payload.partnerId)
    await next()
  } catch (error) {
    return c.json({ success: false, message: 'Invalid token' }, 401)
  }
}

/**
 * POST /api/partner/login
 * Partner authentication
 */
partner.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    const DB = c.env.DB
    
    // Get partner config from database
    const partnerConfig = await DB.prepare(
      'SELECT * FROM partner_config WHERE id = 1 AND is_active = 1'
    ).first() as any
    
    // Secure credentials - using Aleena's credentials
    // Username: aleena@deepmineai.vip
    // Password: DeepMine2025!Partner
    if (username === 'aleena@deepmineai.vip' && password === 'DeepMine2025!Partner') {
      // Generate JWT token
      const token = await sign(
        { 
          partnerId: 1,
          username: username,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // 30 days
        },
        'deepmine-partner-jwt-secret-2025'
      )
      
      return c.json({
        success: true,
        token,
        partner: {
          id: partnerConfig?.id || 1,
          name: partnerConfig?.partner_name || 'Aleena DeepMine',
          email: partnerConfig?.partner_email || 'aleena@deepmineai.vip',
          percentage: partnerConfig?.percentage || 2.0,
          calculation_type: partnerConfig?.calculation_type || 'net_profit'
        }
      })
    }
    
    return c.json({ success: false, message: 'Invalid credentials' }, 401)
  } catch (error) {
    console.error('Partner login error:', error)
    return c.json({ success: false, message: 'Login failed' }, 500)
  }
})

/**
 * GET /api/partner/dashboard
 * Get partner dashboard summary
 */
partner.get('/dashboard', requirePartnerAuth, async (c) => {
  try {
    const DB = c.env.DB
    
    // Get partner config from database
    let partnerConfig: any = null
    try {
      partnerConfig = await DB.prepare(
        'SELECT * FROM partner_config WHERE id = 1 AND is_active = 1'
      ).first()
    } catch (e) {
      console.warn('[Partner] partner_config table not found, using defaults')
    }
    
    // Try to get residuals summary
    let summary: any = null
    try {
      summary = await DB.prepare(`
        SELECT 
          COUNT(*) as total_contracts,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_contracts,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_contracts,
          SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_contracts,
          COALESCE(SUM(residual_amount), 0) as total_residual_earned,
          COALESCE(SUM(CASE WHEN status = 'completed' THEN residual_amount ELSE 0 END), 0) as unpaid_residual,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN residual_amount ELSE 0 END), 0) as paid_residual
        FROM partner_residuals
        WHERE partner_id = ?
      `).bind(1).first() as any
    } catch (e) {
      console.warn('[Partner] partner_residuals table query failed:', e)
    }
    
    // Get recent completed contracts (last 30 days)
    let completions: any = { results: [] }
    try {
      completions = await DB.prepare(`
        SELECT 
          pr.*,
          u.email as user_email,
          u.full_name as user_name
        FROM partner_residuals pr
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.partner_id = ?
          AND pr.status = 'completed'
          AND date(pr.completed_at) >= date('now', '-30 days')
        ORDER BY pr.completed_at DESC
        LIMIT 20
      `).bind(1).all()
    } catch (e) {
      console.warn('[Partner] recent completions query failed:', e)
    }
    
    // Get payout history
    let payoutResults: any = { results: [] }
    try {
      payoutResults = await DB.prepare(`
        SELECT * FROM partner_payouts
        WHERE partner_id = ?
        ORDER BY created_at DESC
        LIMIT 10
      `).bind(1).all()
    } catch (e) {
      console.warn('[Partner] payouts query failed:', e)
    }
    
    return c.json({
      success: true,
      partner: {
        id: partnerConfig?.id || 1,
        name: partnerConfig?.partner_name || 'Aleena DeepMine',
        email: partnerConfig?.partner_email || 'aleena@deepmineai.vip',
        percentage: partnerConfig?.percentage || 2.0,
        calculation_type: partnerConfig?.calculation_type || 'net_profit'
      },
      summary: {
        totalContracts: summary?.total_contracts || 0,
        pendingContracts: summary?.pending_contracts || 0,
        completedContracts: summary?.completed_contracts || 0,
        paidContracts: summary?.paid_contracts || 0,
        totalResidualEarned: summary?.total_residual_earned || 0,
        unpaidResidual: summary?.unpaid_residual || 0,
        paidResidual: summary?.paid_residual || 0
      },
      recentCompletions: completions.results || [],
      payouts: payoutResults.results || []
    })
  } catch (error: any) {
    console.error('Partner dashboard error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * GET /api/partner/residuals
 * Get all partner residuals with filters
 */
partner.get('/residuals', requirePartnerAuth, async (c) => {
  try {
    const DB = c.env.DB
    const status = c.req.query('status') || 'all' // all, pending, completed, paid
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')
    
    let query = `
      SELECT 
        pr.*,
        u.email as user_email,
        u.full_name as user_name
      FROM partner_residuals pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.partner_id = 1
    `
    
    if (status !== 'all') {
      query += ` AND pr.status = ?`
    }
    
    query += ` ORDER BY pr.created_at DESC LIMIT ? OFFSET ?`
    
    let results
    if (status !== 'all') {
      const queryResult = await DB.prepare(query).bind(status, limit, offset).all()
      results = queryResult.results
    } else {
      const queryResult = await DB.prepare(query).bind(limit, offset).all()
      results = queryResult.results
    }
    
    return c.json({
      success: true,
      residuals: results || [],
      pagination: {
        limit,
        offset,
        total: results?.length || 0
      }
    })
  } catch (error: any) {
    console.error('Get residuals error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * POST /api/partner/residuals/mark-paid
 * Mark residuals as paid
 */
partner.post('/residuals/mark-paid', requirePartnerAuth, async (c) => {
  try {
    const DB = c.env.DB
    const { residualIds, paymentReference, notes } = await c.req.json()
    
    if (!residualIds || !Array.isArray(residualIds) || residualIds.length === 0) {
      return c.json({ success: false, message: 'Residual IDs required' }, 400)
    }
    
    // Calculate total amount
    const placeholders = residualIds.map(() => '?').join(',')
    const { results } = await DB.prepare(`
      SELECT SUM(residual_amount) as total, MIN(contract_end_date) as period_start, MAX(contract_end_date) as period_end
      FROM partner_residuals
      WHERE id IN (${placeholders}) AND status = 'completed'
    `).bind(...residualIds).all()
    
    const totalAmount = results[0]?.total || 0
    
    // Create payout record
    const payoutResult = await DB.prepare(`
      INSERT INTO partner_payouts (
        partner_id,
        payout_period_start,
        payout_period_end,
        total_contracts,
        total_residual_amount,
        payment_reference,
        payment_status,
        paid_at,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
    `).bind(
      1,
      results[0]?.period_start || new Date().toISOString().split('T')[0],
      results[0]?.period_end || new Date().toISOString().split('T')[0],
      residualIds.length,
      totalAmount,
      paymentReference || 'Manual Payment',
      'completed',
      notes || ''
    ).run()
    
    const payoutId = payoutResult.meta.last_row_id
    
    // Mark residuals as paid
    for (const residualId of residualIds) {
      await DB.prepare(`
        UPDATE partner_residuals
        SET status = 'paid', paid_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ? AND status = 'completed'
      `).bind(residualId).run()
      
      // Link to payout
      await DB.prepare(`
        INSERT INTO partner_payout_items (payout_id, residual_id, residual_amount)
        SELECT ?, id, residual_amount FROM partner_residuals WHERE id = ?
      `).bind(payoutId, residualId).run()
    }
    
    return c.json({
      success: true,
      message: `Marked ${residualIds.length} residuals as paid`,
      payoutId,
      totalAmount
    })
  } catch (error: any) {
    console.error('Mark paid error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * GET /api/partner/withdrawal-analytics
 * Get withdrawal fee analytics
 */
partner.get('/withdrawal-analytics', requirePartnerAuth, async (c) => {
  try {
    const DB = c.env.DB
    const days = parseInt(c.req.query('days') || '30')
    
    // Get withdrawal fee summary
    const summary = await DB.prepare(`
      SELECT 
        COUNT(*) as total_withdrawals,
        SUM(withdrawal_amount) as total_withdrawal_amount,
        SUM(fee_amount) as total_fees_collected,
        SUM(network_fee) as total_network_costs,
        SUM(net_profit) as total_net_profit,
        AVG(profit_margin_percentage) as avg_profit_margin,
        network_type
      FROM withdrawal_fee_analytics
      WHERE withdrawal_date >= date('now', '-${days} days')
      GROUP BY network_type
    `).all()
    
    // Get daily breakdown
    const { results: dailyBreakdown } = await DB.prepare(`
      SELECT 
        date(withdrawal_date) as date,
        COUNT(*) as count,
        SUM(fee_amount) as fees,
        SUM(net_profit) as profit
      FROM withdrawal_fee_analytics
      WHERE withdrawal_date >= date('now', '-${days} days')
      GROUP BY date(withdrawal_date)
      ORDER BY date DESC
    `).all()
    
    return c.json({
      success: true,
      summary: summary.results,
      dailyBreakdown
    })
  } catch (error: any) {
    console.error('Withdrawal analytics error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * GET /api/partner/monthly-projections
 * Calculate projected residuals by end of each month
 */
partner.get('/monthly-projections', requirePartnerAuth, async (c) => {
  try {
    const DB = c.env.DB
    const partnerId = c.get('partnerId')
    
    // Get all active contracts
    const contracts = await DB.prepare(`
      SELECT 
        id,
        machine_id,
        user_id,
        package_name,
        investment,
        daily_rate,
        contract_duration,
        total_return,
        net_profit,
        residual_amount,
        start_date,
        status
      FROM partner_residuals
      WHERE partner_id = ? AND status = 'pending'
      ORDER BY start_date ASC
    `).bind(partnerId).all()
    
    if (!contracts.results || contracts.results.length === 0) {
      return c.json({
        success: true,
        projections: [],
        message: 'No active contracts found'
      })
    }
    
    // Find the latest completion date to determine how many months to show
    let latestCompletionDate = new Date()
    contracts.results.forEach((contract: any) => {
      const startDate = new Date(contract.start_date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + contract.contract_duration)
      if (endDate > latestCompletionDate) {
        latestCompletionDate = endDate
      }
    })
    
    // Calculate projections from current month to latest completion month
    const today = new Date()
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1) // First day of current month
    const endMonth = new Date(latestCompletionDate.getFullYear(), latestCompletionDate.getMonth() + 1, 0) // Last day of completion month
    
    const projections = []
    const monthsDiff = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + (endMonth.getMonth() - startMonth.getMonth()) + 1
    
    for (let i = 0; i < monthsDiff; i++) {
      // Get first and last day of the target month
      const monthStart = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + i + 1, 0)
      const monthName = monthEnd.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      
      let monthTotal = 0
      let contractsCompletingCount = 0
      const completingContracts: any[] = []
      
      contracts.results.forEach((contract: any) => {
        const startDate = new Date(contract.start_date)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + contract.contract_duration)
        
        // Check if contract completes WITHIN this specific month
        // Contract completes in this month if: monthStart <= endDate <= monthEnd
        if (endDate >= monthStart && endDate <= monthEnd) {
          monthTotal += contract.residual_amount
          contractsCompletingCount++
          completingContracts.push({
            id: contract.id,
            machine_id: contract.machine_id,
            package_name: contract.package_name,
            residual_amount: contract.residual_amount,
            completion_date: endDate.toISOString().split('T')[0]
          })
        }
      })
      
      // Always push month (even if no completions) to show full timeline
      projections.push({
        month: monthName,
        month_end_date: monthEnd.toISOString().split('T')[0],
        total_residual: monthTotal,
        contracts_completing: contractsCompletingCount,
        completing_contracts: completingContracts
      })
    }
    
    return c.json({
      success: true,
      projections,
      total_contracts: contracts.results.length,
      total_potential: projections.reduce((sum, p) => sum + p.total_residual, 0)
    })
  } catch (error: any) {
    console.error('Monthly projections error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * GET /api/partner/export
 * Export residuals data as CSV
 */
partner.get('/export', requirePartnerAuth, async (c) => {
  try {
    const DB = c.env.DB
    const status = c.req.query('status') || 'all'
    
    let query = `
      SELECT 
        pr.id,
        pr.created_at,
        pr.contract_start_date,
        pr.contract_end_date,
        pr.completed_at,
        pr.paid_at,
        pr.status,
        u.email,
        u.full_name,
        pr.package_name,
        pr.investment_amount,
        pr.total_earnings,
        pr.net_profit,
        pr.residual_percentage,
        pr.residual_amount
      FROM partner_residuals pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.partner_id = 1
    `
    
    if (status !== 'all') {
      query += ` AND pr.status = '${status}'`
    }
    
    query += ` ORDER BY pr.created_at DESC`
    
    const { results } = await DB.prepare(query).all()
    
    // Convert to CSV
    const headers = [
      'ID', 'Created', 'Contract Start', 'Contract End', 'Completed', 'Paid',
      'Status', 'User Email', 'User Name', 'Package', 'Investment', 
      'Total Earnings', 'Net Profit', 'Residual %', 'Residual Amount'
    ]
    
    let csv = headers.join(',') + '\n'
    
    results.forEach((row: any) => {
      csv += [
        row.id,
        row.created_at,
        row.contract_start_date,
        row.contract_end_date,
        row.completed_at || '',
        row.paid_at || '',
        row.status,
        row.email,
        row.full_name,
        row.package_name,
        row.investment_amount,
        row.total_earnings,
        row.net_profit,
        row.residual_percentage,
        row.residual_amount
      ].join(',') + '\n'
    })
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="partner-residuals-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error: any) {
    console.error('Export error:', error)
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default partner
