import { Hono } from 'hono'
import { getEthPrice, ethToUsd, usdToEth } from '../utils/priceFeed'
import { processReferralCommissions } from '../utils/commission-engine'
import { trackPartnerResidual } from '../utils/partner-tracking'

type Bindings = {
  DB: D1Database
}

const machines = new Hono<{ Bindings: Bindings }>()

// Helper: Get user from context (middleware already verified auth)
async function getUser(c: any): Promise<any> {
  const userId = c.get('userId')
  
  if (!userId) {
    return null
  }

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(userId).first()
  
  return user
}

// GET /api/machines/packages - Get all available mining packages
machines.get('/packages', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, name, hash_rate, price, daily_earnings, 
        duration_days, description, is_active
      FROM mining_packages
      WHERE is_active = 1
      ORDER BY price ASC
    `).all()

    return c.json({
      success: true,
      packages: results,
      total: results.length
    })

  } catch (error: any) {
    console.error('Get packages error:', error)
    return c.json({ 
      error: 'Failed to load mining packages',
      message: error.message
    }, 500)
  }
})

// GET /api/machines/my-machines - Get user's purchased machines
machines.get('/my-machines', async (c) => {
  const user = await getUser(c)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        um.*,
        mp.name as package_name,
        mp.hash_rate,
        mp.description
      FROM user_miners um
      LEFT JOIN mining_packages mp ON um.package_id = mp.id
      WHERE um.user_id = ?
        AND um.activation_status IN ('active', 'pending')
      ORDER BY um.created_at DESC
    `).bind(user.id).all()

    return c.json({
      success: true,
      machines: results,
      total: results.length
    })

  } catch (error: any) {
    console.error('Get my machines error:', error)
    return c.json({ 
      error: 'Failed to load your machines',
      message: error.message
    }, 500)
  }
})

// POST /api/machines/purchase - Purchase a mining machine
machines.post('/purchase', async (c) => {
  const user = await getUser(c)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  try {
    // Debug: Log request details
    console.log('[PURCHASE] Request method:', c.req.method)
    console.log('[PURCHASE] Content-Type:', c.req.header('Content-Type'))
    
    let body
    try {
      body = await c.req.json()
      console.log('[PURCHASE] Parsed body:', JSON.stringify(body))
    } catch (parseError: any) {
      console.error('[PURCHASE] JSON parse error:', parseError.message)
      const rawBody = await c.req.text()
      console.error('[PURCHASE] Raw body:', rawBody)
      return c.json({ 
        error: 'Invalid request format',
        message: 'Request body must be valid JSON',
        details: parseError.message
      }, 400)
    }
    
    const { packageId } = body

    if (!packageId) {
      return c.json({ 
        error: 'Package ID required',
        message: 'Please select a mining package to purchase'
      }, 400)
    }

    // Get package details
    const package_data = await c.env.DB.prepare(
      'SELECT * FROM mining_packages WHERE id = ? AND is_active = 1'
    ).bind(packageId).first() as any

    if (!package_data) {
      return c.json({ 
        error: 'Package not found',
        message: 'This mining package is not available'
      }, 404)
    }

    // Check if user already owns this package (one unit per tier rule)
    const existingPurchase = await c.env.DB.prepare(`
      SELECT id, activation_status FROM user_miners 
      WHERE user_id = ? AND package_id = ?
      AND activation_status NOT IN ('rejected')
    `).bind(user.id, packageId).first()

    if (existingPurchase) {
      return c.json({ 
        error: 'Already purchased',
        message: 'You already own this mining package. Only one unit per tier is allowed.',
        packageName: package_data.name,
        status: existingPurchase.activation_status
      }, 400)
    }

    // Get real-time ETH/USD price
    let ethPrice
    try {
      ethPrice = await getEthPrice()
      console.log(`💰 Current ETH Price: $${ethPrice}`)
    } catch (priceError: any) {
      console.error('[PURCHASE] Failed to fetch ETH price:', priceError.message)
      // Use fallback price
      ethPrice = 3000
      console.warn(`⚠️  Using fallback ETH price: $${ethPrice}`)
    }
    
    // Detect if balance is in USD or ETH
    // If balance > 100, assume it's USD (no one has 100+ ETH)
    // If balance < 100, assume it's ETH
    const isBalanceInUsd = user.wallet_balance > 100
    
    let userBalanceUsd: number
    let amountToDeduct: number
    
    if (isBalanceInUsd) {
      // Balance is already in USD
      userBalanceUsd = user.wallet_balance
      amountToDeduct = package_data.price
      console.log(`👤 User Balance: $${userBalanceUsd.toFixed(2)} USD (stored as USD)`)
    } else {
      // Balance is in ETH, convert to USD
      userBalanceUsd = ethToUsd(user.wallet_balance, ethPrice)
      amountToDeduct = usdToEth(package_data.price, ethPrice)
      console.log(`👤 User Balance: ${user.wallet_balance} ETH = $${userBalanceUsd.toFixed(2)} USD`)
    }
    
    console.log(`🏷️ Package Price: $${package_data.price} USD`)

    // Check if user has sufficient balance (compare USD values)
    if (userBalanceUsd < package_data.price) {
      return c.json({ 
        error: 'Insufficient balance',
        message: `You need $${package_data.price} USD but only have $${userBalanceUsd.toFixed(2)} USD`,
        required: package_data.price,
        available: userBalanceUsd,
        balanceFormat: isBalanceInUsd ? 'USD' : 'ETH',
        ethPrice: ethPrice,
        shortfall: package_data.price - userBalanceUsd
      }, 400)
    }

    // Calculate expiration date (180 days from now)
    const startDate = new Date()
    const expirationDate = new Date(startDate)
    expirationDate.setDate(expirationDate.getDate() + package_data.duration_days)

    // Deduct the correct amount based on balance format
    console.log(`💸 Deducting: ${amountToDeduct.toFixed(6)} ${isBalanceInUsd ? 'USD' : 'ETH'} (=$${package_data.price} USD)`)

    // Deduct balance from user
    await c.env.DB.prepare(`
      UPDATE users 
      SET wallet_balance = wallet_balance - ?,
          balance = balance - ?,
          total_invested = total_invested + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(amountToDeduct, amountToDeduct, package_data.price, user.id).run()

    // Create user_miners record (pending activation)
    const minerResult = await c.env.DB.prepare(`
      INSERT INTO user_miners (
        user_id, package_id, status, hash_rate, daily_rate,
        total_earned, started_at, expires_at, purchase_price,
        activation_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      packageId,
      'inactive', // Will be activated by admin
      package_data.hash_rate,
      package_data.daily_earnings,
      0, // Initial earnings
      startDate.toISOString(),
      expirationDate.toISOString(),
      package_data.price,
      'pending' // Pending admin activation
    ).run()

    // Create transaction record
    const transactionRef = `MACH${Date.now()}`
    await c.env.DB.prepare(`
      INSERT INTO transactions (
        user_id, transaction_type, amount, currency, status,
        description, reference_id, machine_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      'purchase',
      package_data.price,
      'USDT',
      'completed',
      `Purchased ${package_data.name}`,
      transactionRef,
      minerResult.meta.last_row_id
    ).run()

    // Process referral commissions (Level 1: $80, Level 2: $15, Level 3+: 3-5% based on VIP)
    try {
      const commissionResult = await processReferralCommissions(c.env.DB, {
        userId: user.id,
        amount: package_data.price,
        packageId: packageId,
        transactionId: transactionRef
      })
      console.log('Referral commissions processed:', commissionResult)
    } catch (error) {
      console.error('Error processing referral commissions:', error)
      // Don't fail the purchase if commission processing fails
    }

    // Track partner residual (2% on net profit after 180 days)
    try {
      const partnerResult = await trackPartnerResidual(c.env.DB, {
        userId: user.id,
        minerId: minerResult.meta.last_row_id as number,
        packageId: packageId,
        packageName: package_data.name,
        price: package_data.price,
        dailyEarnings: package_data.daily_earnings,
        durationDays: package_data.duration_days,
        startDate: startDate.toISOString(),
        expiresAt: expirationDate.toISOString()
      })
      console.log('Partner residual tracked:', partnerResult)
    } catch (error) {
      console.error('Error tracking partner residual:', error)
      // Don't fail the purchase if partner tracking fails
    }

    // Get updated balance
    const updatedUser = await c.env.DB.prepare(
      'SELECT wallet_balance, total_invested FROM users WHERE id = ?'
    ).bind(user.id).first() as any

    // 🔔 HOOK: First machine purchase - trigger email automation (Segment C ends)
    try {
      await onFirstMachinePurchased(c, user.id)
      console.log(`✅ First purchase hook triggered for user ${user.id}`)
    } catch (hookError) {
      console.error('⚠️ First purchase hook failed (non-critical):', hookError)
      // Continue - don't fail purchase if hook fails
    }

    return c.json({
      success: true,
      message: 'Machine purchased successfully! Pending admin activation.',
      purchase: {
        machineId: minerResult.meta.last_row_id,
        packageName: package_data.name,
        priceUsd: package_data.price,
        amountDeducted: amountToDeduct,
        balanceFormat: isBalanceInUsd ? 'USD' : 'ETH',
        ethPrice: ethPrice,
        dailyEarnings: package_data.daily_earnings,
        duration: package_data.duration_days,
        status: 'pending',
        startDate: startDate.toISOString(),
        expiresAt: expirationDate.toISOString()
      },
      balance: {
        previous: user.wallet_balance,
        current: updatedUser.wallet_balance,
        previousUsd: userBalanceUsd,
        currentUsd: isBalanceInUsd ? updatedUser.wallet_balance : ethToUsd(updatedUser.wallet_balance, ethPrice),
        balanceFormat: isBalanceInUsd ? 'USD' : 'ETH',
        ethPrice: ethPrice,
        invested: updatedUser.total_invested
      }
    })

  } catch (error: any) {
    console.error('Purchase machine error:', error)
    return c.json({ 
      error: 'Failed to purchase machine',
      message: error.message
    }, 500)
  }
})

// GET /api/machines/purchase-history - Get user's purchase history
machines.get('/purchase-history', async (c) => {
  const user = await getUser(c)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        t.*,
        um.status as machine_status,
        um.activation_status,
        um.activated_at,
        mp.name as package_name
      FROM transactions t
      LEFT JOIN user_miners um ON t.machine_id = um.id
      LEFT JOIN mining_packages mp ON um.package_id = mp.id
      WHERE t.user_id = ? AND t.transaction_type = 'purchase'
      ORDER BY t.created_at DESC
    `).bind(user.id).all()

    return c.json({
      success: true,
      purchases: results,
      total: results.length
    })

  } catch (error: any) {
    console.error('Get purchase history error:', error)
    return c.json({ 
      error: 'Failed to load purchase history',
      message: error.message
    }, 500)
  }
})

// Get user's own machines (requires auth)
machines.get('/my-active', async (c) => {
  try {
    const userId = c.get('userId');

    const { results } = await c.env.DB.prepare(`
      SELECT 
        um.id as machine_id,
        um.package_id,
        um.activation_status,
        um.activated_at,
        um.expires_at,
        um.created_at,
        um.last_earning_at,
        um.purchase_price,
        um.total_earned,
        mp.name as package_name,
        mp.daily_earnings as daily_rate,
        mp.hash_rate,
        mp.duration_days
      FROM user_miners um
      JOIN mining_packages mp ON um.package_id = mp.id
      WHERE um.user_id = ?
        AND um.activation_status = 'active'
      ORDER BY um.activated_at DESC
    `).bind(userId).all();

    return c.json({
      success: true,
      machines: results
    });
  } catch (error: any) {
    console.error('Get active machines error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch active machines'
    }, 500);
  }
})

export default machines
