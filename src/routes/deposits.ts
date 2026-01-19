import { Hono } from 'hono'
import { onDepositApproved } from '../hooks/email-automation-hooks'
import { requireAdmin, requireAuth } from '../middleware/auth'

type Bindings = {
  DB: D1Database
  KYC_BUCKET: R2Bucket
}

const deposits = new Hono<{ Bindings: Bindings }>()

// Apply middleware to routes in this router
deposits.use('/admin/*', requireAdmin)  // Admin deposit endpoints require admin auth
deposits.use('/submit', requireAuth)    // User deposit submission
deposits.use('/history', requireAuth)   // User deposit history
deposits.use('/status/*', requireAuth)  // User deposit status check
deposits.use('/wallet', requireAuth)    // User wallet endpoint requires authentication

// Business ETH wallet address
const BUSINESS_ETH_WALLET = '0x806271F24f51681cE966338E19a73a7C5CF58507'

// Helper: Generate unique deposit number
function generateDepositNumber(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `DEP${timestamp}${random}`
}

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

// GET /api/deposits/wallet - Get business ETH wallet for deposits
deposits.get('/wallet', async (c) => {
  const user = await getUser(c)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  // Check KYC status - must be approved to deposit
  if (user.kyc_status !== 'approved') {
    return c.json({ 
      error: 'KYC verification required',
      message: 'Please complete KYC verification before making deposits',
      kycStatus: user.kyc_status
    }, 403)
  }

  return c.json({
    success: true,
    wallet: BUSINESS_ETH_WALLET,
    currency: 'ETH',
    network: 'Ethereum Mainnet',
    instructions: [
      'Send ETH to the wallet address above',
      'Take a screenshot of the transaction or copy the Transaction Hash (TXID)',
      'Upload the proof using the form below',
      'Wait for admin verification (usually within 24 hours)',
      'Once approved, your balance will be updated and you can purchase mining machines'
    ],
    userWallet: user.wallet_address,
    walletLocked: user.wallet_locked === 1
  })
})

// POST /api/deposits/submit - Submit deposit proof
deposits.post('/submit', async (c) => {
  const user = await getUser(c)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  // Check KYC status
  if (user.kyc_status !== 'approved') {
    return c.json({ 
      error: 'KYC verification required',
      message: 'Please complete KYC verification before making deposits'
    }, 403)
  }

  try {
    const formData = await c.req.formData()
    const amount = formData.get('amount')
    const currency = formData.get('currency') || 'ETH' // Default to ETH for backward compatibility
    const txHash = formData.get('txHash')
    const userWalletAddress = formData.get('walletAddress')
    const proofFile = formData.get('proofFile') as File | null

    // Validate required fields
    if (!amount || !userWalletAddress || !currency) {
      return c.json({ 
        error: 'Missing required fields',
        message: 'Amount, currency, and wallet address are required'
      }, 400)
    }

    const depositAmount = parseFloat(amount as string)
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return c.json({ 
        error: 'Invalid amount',
        message: 'Please enter a valid deposit amount'
      }, 400)
    }

    // Validate currency
    const validCurrencies = ['ETH', 'USDT', 'USDC', 'BTC']
    const depositCurrency = (currency as string).toUpperCase()
    if (!validCurrencies.includes(depositCurrency)) {
      return c.json({ 
        error: 'Invalid currency',
        message: 'Please select a valid currency (ETH, USDT, USDC, or BTC)'
      }, 400)
    }

    // Validate wallet address format (basic check)
    const walletAddr = userWalletAddress as string
    if (!walletAddr.match(/^0x[a-fA-F0-9]{40}$/)) {
      return c.json({ 
        error: 'Invalid wallet address',
        message: 'Please enter a valid Ethereum wallet address (0x...)'
      }, 400)
    }

    // Check if user wallet is locked (must use same wallet)
    if (user.wallet_locked === 1 && user.wallet_address !== walletAddr) {
      return c.json({ 
        error: 'Wallet mismatch',
        message: `You must use your registered wallet: ${user.wallet_address}`,
        registeredWallet: user.wallet_address
      }, 403)
    }

    // Upload proof file to R2 if provided
    let proofUrl = null
    if (proofFile && proofFile.size > 0) {
      const fileExtension = proofFile.name.split('.').pop()
      const fileName = `deposits/${user.id}/${Date.now()}.${fileExtension}`
      
      await c.env.KYC_BUCKET.put(fileName, proofFile.stream())
      proofUrl = fileName
    }

    // Generate deposit number
    const depositNumber = generateDepositNumber()

    // Create deposit record with selected currency
    const result = await c.env.DB.prepare(`
      INSERT INTO deposits (
        user_id, deposit_number, amount, currency, wallet_address,
        tx_hash, proof_url, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      depositNumber,
      depositAmount,
      depositCurrency,
      walletAddr,
      txHash || null,
      proofUrl,
      'pending'
    ).run()

    // If this is the first deposit, lock the wallet
    if (!user.wallet_locked) {
      await c.env.DB.prepare(`
        UPDATE users 
        SET wallet_address = ?, 
            wallet_locked = 1, 
            first_deposit_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(walletAddr, user.id).run()
    }

    // Create transaction record
    await c.env.DB.prepare(`
      INSERT INTO transactions (
        user_id, transaction_type, amount, currency, status,
        description, reference_id, wallet_address, tx_hash,
        deposit_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      'deposit',
      depositAmount,
      depositCurrency,
      'pending',
      `${depositCurrency} Deposit - Pending Verification`,
      depositNumber,
      walletAddr,
      txHash || null,
      result.meta.last_row_id
    ).run()

    return c.json({
      success: true,
      message: `${depositCurrency} deposit submitted successfully! Waiting for admin verification.`,
      deposit: {
        depositNumber,
        amount: depositAmount,
        currency: depositCurrency,
        status: 'pending',
        walletAddress: walletAddr,
        txHash: txHash || null
      },
      walletLocked: !user.wallet_locked ? true : user.wallet_locked === 1
    })

  } catch (error: any) {
    console.error('Deposit submission error:', error)
    return c.json({ 
      error: 'Failed to submit deposit',
      message: error.message || 'Please try again later'
    }, 500)
  }
})

// GET /api/deposits/history - Get user's deposit history
deposits.get('/history', async (c) => {
  const user = await getUser(c)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, deposit_number, amount, currency, wallet_address,
        tx_hash, status, admin_notes, rejection_reason,
        approved_at, created_at, updated_at
      FROM deposits
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(user.id).all()

    return c.json({
      success: true,
      deposits: results,
      total: results.length
    })

  } catch (error: any) {
    console.error('Deposit history error:', error)
    return c.json({ 
      error: 'Failed to load deposit history',
      message: error.message
    }, 500)
  }
})

// GET /api/deposits/status/:depositNumber - Get deposit status
deposits.get('/status/:depositNumber', async (c) => {
  const user = await getUser(c)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const depositNumber = c.req.param('depositNumber')

  try {
    const deposit = await c.env.DB.prepare(`
      SELECT * FROM deposits 
      WHERE deposit_number = ? AND user_id = ?
    `).bind(depositNumber, user.id).first()

    if (!deposit) {
      return c.json({ 
        error: 'Deposit not found',
        message: 'No deposit found with this number'
      }, 404)
    }

    return c.json({
      success: true,
      deposit
    })

  } catch (error: any) {
    console.error('Deposit status error:', error)
    return c.json({ 
      error: 'Failed to load deposit status',
      message: error.message
    }, 500)
  }
})

// GET /api/deposits/proof/:key - Get deposit proof file from R2
deposits.get('/proof/*', async (c) => {
  try {
    // Get the full path after /proof/
    const fullPath = c.req.path
    const key = fullPath.replace('/api/deposits/proof/', '')
    
    console.log('Requested proof file:', key)
    
    if (!key || key === '') {
      return c.json({ error: 'File key is required' }, 400)
    }

    // Get file from R2
    const object = await c.env.KYC_BUCKET.get(key)
    
    if (!object) {
      return c.notFound()
    }

    // Determine content type based on file extension
    const extension = key.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf'
    }
    const contentType = contentTypeMap[extension || ''] || 'application/octet-stream'

    // Return the file
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error: any) {
    console.error('Get proof file error:', error)
    return c.json({ 
      error: 'Failed to load proof file',
      message: error.message
    }, 500)
  }
})

// ===== ADMIN ROUTES =====

// GET /api/deposits/admin/list - Get all deposits for admin
deposits.get('/admin/list', async (c) => {
  try {
    const status = c.req.query('status') // pending, approved, rejected

    let query = `
      SELECT 
        d.*, 
        u.email as user_email, 
        u.full_name as user_name,
        u.wallet_address as registered_wallet
      FROM deposits d
      LEFT JOIN users u ON d.user_id = u.id
    `
    
    if (status) {
      query += ` WHERE d.status = ?`
    }
    
    query += ` ORDER BY d.created_at DESC`

    const result = status 
      ? await c.env.DB.prepare(query).bind(status).all()
      : await c.env.DB.prepare(query).all()

    return c.json({
      success: true,
      deposits: result.results,
      total: result.results.length
    })

  } catch (error: any) {
    console.error('Admin deposit list error:', error)
    return c.json({ 
      error: 'Failed to load deposits',
      message: error.message
    }, 500)
  }
})

// POST /api/deposits/admin/:id/approve - Approve deposit
deposits.post('/admin/:id/approve', async (c) => {
  const depositId = c.req.param('id')
  const adminEmail = c.get('userEmail') || 'admin'

  try {
    // Parse JSON body (optional)
    let adminNotes = null
    let actualAmount = null
    
    try {
      const body = await c.req.json()
      adminNotes = body.adminNotes
      actualAmount = body.actualAmount
    } catch (parseError) {
      // No body or invalid JSON - use defaults
      console.log('No JSON body provided, using defaults')
    }

    // Get deposit details
    const deposit = await c.env.DB.prepare(
      'SELECT * FROM deposits WHERE id = ?'
    ).bind(depositId).first() as any

    if (!deposit) {
      return c.json({ error: 'Deposit not found' }, 404)
    }

    if (deposit.status !== 'pending') {
      return c.json({ 
        error: 'Invalid status',
        message: 'Only pending deposits can be approved'
      }, 400)
    }

    const finalAmount = actualAmount || deposit.amount
    const depositCurrency = deposit.currency || 'ETH'

    let amountInUSD = 0
    let conversionNote = ''

    // Handle different currency types
    if (depositCurrency === 'USDT' || depositCurrency === 'USDC') {
      // Stablecoins are 1:1 with USD
      amountInUSD = finalAmount
      conversionNote = `${depositCurrency} (stablecoin) - No conversion needed`
      console.log(`💰 ${depositCurrency} deposit: $${amountInUSD.toFixed(2)} (1:1 with USD)`)
    } else if (depositCurrency === 'ETH') {
      // Get real-time ETH to USD price
      let ethPrice = 3100 // Default fallback price
      try {
        const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        const priceData = await priceResponse.json()
        ethPrice = priceData.ethereum.usd
        console.log(`✅ ETH Price fetched: $${ethPrice}`)
      } catch (error) {
        console.warn('⚠️ Failed to fetch ETH price, using fallback: $3100')
      }
      amountInUSD = finalAmount * ethPrice
      conversionNote = `Converted at $${ethPrice.toFixed(2)}/ETH`
      console.log(`💰 Converting ${finalAmount} ETH to USD: $${amountInUSD.toFixed(2)} (${conversionNote})`)
    } else if (depositCurrency === 'BTC') {
      // Get real-time BTC to USD price
      let btcPrice = 40000 // Default fallback price
      try {
        const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        const priceData = await priceResponse.json()
        btcPrice = priceData.bitcoin.usd
        console.log(`✅ BTC Price fetched: $${btcPrice}`)
      } catch (error) {
        console.warn('⚠️ Failed to fetch BTC price, using fallback: $40000')
      }
      amountInUSD = finalAmount * btcPrice
      conversionNote = `Converted at $${btcPrice.toFixed(2)}/BTC`
      console.log(`💰 Converting ${finalAmount} BTC to USD: $${amountInUSD.toFixed(2)} (${conversionNote})`)
    } else {
      // Unknown currency - treat as 1:1
      amountInUSD = finalAmount
      conversionNote = `Unknown currency - treated as USD`
      console.warn(`⚠️ Unknown currency: ${depositCurrency}`)
    }

    // Update deposit status with conversion notes
    const finalAdminNotes = adminNotes 
      ? `${adminNotes} | ${conversionNote}`
      : `Approved | ${conversionNote}`
    
    await c.env.DB.prepare(`
      UPDATE deposits 
      SET status = 'approved',
          amount = ?,
          admin_notes = ?,
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(finalAmount, finalAdminNotes, adminEmail, depositId).run()

    // Update user's balance (sync both balance and wallet_balance) with USD amount
    await c.env.DB.prepare(`
      UPDATE users 
      SET balance = balance + ?,
          wallet_balance = wallet_balance + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(amountInUSD, amountInUSD, deposit.user_id).run()

    // Update transaction status (skip if table doesn't exist)
    try {
      await c.env.DB.prepare(`
        UPDATE transactions 
        SET status = 'completed',
            description = 'ETH Deposit - Approved',
            updated_at = CURRENT_TIMESTAMP
        WHERE deposit_id = ?
      `).bind(depositId).run()
    } catch (txError) {
      console.warn('⚠️ Could not update transactions table:', txError)
      // Continue anyway - transaction table update is optional
    }

    // Trigger email automation (Segment C: Deposit made, no machine) - HIGHEST PRIORITY
    try {
      await onDepositApproved(c, deposit.user_id)
      console.log(`📧 [AUTOMATION] Segment C triggered for user ${deposit.user_id} (URGENT)`)
    } catch (error) {
      console.error('Failed to trigger email automation:', error)
      // Don't fail deposit approval if automation fails
    }

    return c.json({
      success: true,
      message: 'Deposit approved successfully',
      deposit: {
        id: depositId,
        amount: finalAmount,
        status: 'approved'
      }
    })

  } catch (error: any) {
    console.error('Approve deposit error:', error)
    return c.json({ 
      error: 'Failed to approve deposit',
      message: error.message
    }, 500)
  }
})

// POST /api/deposits/admin/:id/reject - Reject deposit
deposits.post('/admin/:id/reject', async (c) => {
  const depositId = c.req.param('id')

  try {
    const { rejectionReason } = await c.req.json()

    if (!rejectionReason) {
      return c.json({ 
        error: 'Rejection reason required',
        message: 'Please provide a reason for rejection'
      }, 400)
    }

    // Get deposit details
    const deposit = await c.env.DB.prepare(
      'SELECT * FROM deposits WHERE id = ?'
    ).bind(depositId).first()

    if (!deposit) {
      return c.json({ error: 'Deposit not found' }, 404)
    }

    // Update deposit status
    await c.env.DB.prepare(`
      UPDATE deposits 
      SET status = 'rejected',
          rejection_reason = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(rejectionReason, depositId).run()

    // Update transaction status
    await c.env.DB.prepare(`
      UPDATE transactions 
      SET status = 'failed',
          description = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE deposit_id = ?
    `).bind(`ETH Deposit - Rejected: ${rejectionReason}`, depositId).run()

    return c.json({
      success: true,
      message: 'Deposit rejected',
      deposit: {
        id: depositId,
        status: 'rejected'
      }
    })

  } catch (error: any) {
    console.error('Reject deposit error:', error)
    return c.json({ 
      error: 'Failed to reject deposit',
      message: error.message
    }, 500)
  }
})

export default deposits
