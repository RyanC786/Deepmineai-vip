import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'

const withdrawals = new Hono()

// POST /api/withdrawals/request - User requests withdrawal
withdrawals.post('/request', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    console.log('Withdrawal request from user:', userId)
    
    const { amount, wallet_address } = await c.req.json()
    console.log('Withdrawal details:', { amount, wallet_address })

    // Default network to ERC-20 (Ethereum - USDT)
    const network = 'ERC20'

    // Validation
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Invalid amount' }, 400)
    }

    if (!wallet_address || wallet_address.trim().length === 0) {
      return c.json({ success: false, message: 'Wallet address is required' }, 400)
    }

    // Minimum withdrawal amount
    const MIN_WITHDRAWAL = 100
    if (amount < MIN_WITHDRAWAL) {
      return c.json({ 
        success: false, 
        message: `Minimum withdrawal amount is $${MIN_WITHDRAWAL}` 
      }, 400)
    }

    // Get user balance
    const user = await c.env.DB.prepare(`
      SELECT id, email, balance, wallet_balance, kyc_status 
      FROM users 
      WHERE id = ?
    `).bind(userId).first() as any

    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    // Check KYC status
    if (user.kyc_status !== 'approved') {
      return c.json({ 
        success: false, 
        message: 'KYC verification required. Please complete KYC before withdrawing.' 
      }, 403)
    }

    // Check sufficient balance (use 'balance' as the authoritative field)
    if (user.balance < amount) {
      return c.json({ 
        success: false, 
        message: `Insufficient balance. Available: $${user.balance.toFixed(2)}` 
      }, 400)
    }

    // Calculate fee (2%)
    const feePercent = 0.02
    const feeAmount = amount * feePercent
    const netAmount = amount - feeAmount

    // Generate withdrawal number
    const withdrawalNumber = 'WD' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase()

    // Create withdrawal request
    const result = await c.env.DB.prepare(`
      INSERT INTO withdrawals (
        user_id,
        withdrawal_number,
        amount,
        fee_amount,
        net_amount,
        currency,
        network,
        wallet_address,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
    `).bind(
      userId,
      withdrawalNumber,
      amount,
      feeAmount,
      netAmount,
      'USDT',
      network,
      wallet_address
    ).run()

    // Deduct from user balance immediately (will be refunded if rejected)
    // Update BOTH balance fields to keep them in sync
    await c.env.DB.prepare(`
      UPDATE users 
      SET balance = balance - ?,
          wallet_balance = wallet_balance - ?
      WHERE id = ?
    `).bind(amount, amount, userId).run()

    // Log transaction
    await c.env.DB.prepare(`
      INSERT INTO transactions (
        user_id,
        transaction_type,
        amount,
        status,
        reference_id,
        description,
        created_at
      ) VALUES (?, 'withdrawal', ?, 'pending', ?, ?, datetime('now'))
    `).bind(
      userId,
      amount,
      withdrawalNumber,
      `Withdrawal request: ${netAmount.toFixed(2)} USDT to ${wallet_address.substring(0, 10)}...`
    ).run()

    console.log('Withdrawal created successfully:', withdrawalNumber)
    
    return c.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: result.meta.last_row_id,
        withdrawal_number: withdrawalNumber,
        amount: amount,
        fee_amount: feeAmount,
        net_amount: netAmount,
        network: network,
        wallet_address: wallet_address,
        status: 'pending'
      }
    })

  } catch (error: any) {
    console.error('Withdrawal request error:', error)
    console.error('Error stack:', error.stack)
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to submit withdrawal request',
      error: error.toString()
    }, 500)
  }
})

// GET /api/withdrawals/my-withdrawals - Get user's withdrawal history
withdrawals.get('/my-withdrawals', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')

    const { results } = await c.env.DB.prepare(`
      SELECT 
        id,
        withdrawal_number,
        amount,
        fee_amount,
        net_amount,
        currency,
        network,
        wallet_address,
        status,
        admin_notes,
        rejection_reason,
        tx_hash,
        approved_at,
        completed_at,
        created_at
      FROM withdrawals
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all()

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

// GET /api/withdrawals/stats - Get user's withdrawal stats
withdrawals.get('/stats', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')

    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_withdrawals,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as approved_amount,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN net_amount ELSE 0 END), 0) as total_withdrawn
      FROM withdrawals
      WHERE user_id = ?
    `).bind(userId).first() as any

    return c.json({
      success: true,
      stats: stats || {
        total_withdrawals: 0,
        pending_amount: 0,
        approved_amount: 0,
        total_withdrawn: 0
      }
    })

  } catch (error: any) {
    console.error('Get withdrawal stats error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to fetch withdrawal stats' 
    }, 500)
  }
})

export default withdrawals
