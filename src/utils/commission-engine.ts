/**
 * Commission Engine
 * Handles automatic commission calculations for referral purchases
 * Based on VIP_Referral_Program.pdf structure
 * 
 * Commission Structure:
 * - Level 1 (Direct Referral): $80 flat
 * - Level 2 (Referral's Referral): $15 flat
 * - Level 3+ (Deep Network): 3%-5% based on referrer's VIP tier
 */

type Bindings = {
  DB: D1Database
}

interface PurchaseData {
  userId: number
  amount: number
  packageId: number
  transactionId: string
}

interface CommissionResult {
  success: boolean
  commissions_created: number
  total_amount: number
  errors: string[]
}

/**
 * Process commissions for a new purchase
 */
export async function processReferralCommissions(
  db: D1Database,
  purchaseData: PurchaseData
): Promise<CommissionResult> {
  const result: CommissionResult = {
    success: true,
    commissions_created: 0,
    total_amount: 0,
    errors: []
  }

  try {
    // Get buyer's referral chain (who referred them)
    const buyer = await db.prepare(`
      SELECT id, referred_by_code
      FROM users
      WHERE id = ?
    `).bind(purchaseData.userId).first()

    if (!buyer || !buyer.referred_by_code) {
      console.log('User has no referrer, no commissions to process')
      return result
    }

    // Get referrer
    const level1Referrer = await db.prepare(`
      SELECT id, vip_level, referral_code, referred_by_code
      FROM users
      WHERE referral_code = ?
    `).bind(buyer.referred_by_code).first()

    if (!level1Referrer) {
      result.errors.push('Level 1 referrer not found')
      return result
    }

    // ============================================
    // LEVEL 1 COMMISSION: $80 flat
    // ============================================
    const level1Commission = 80.00
    await createCommission(db, {
      userId: level1Referrer.id as number,
      referredUserId: purchaseData.userId,
      amount: level1Commission,
      commissionType: 'level1',
      purchaseAmount: purchaseData.amount,
      transactionId: purchaseData.transactionId
    })
    result.commissions_created++
    result.total_amount += level1Commission

    // Update referrals table
    await db.prepare(`
      UPDATE referrals
      SET status = 'active',
          first_purchase_at = COALESCE(first_purchase_at, CURRENT_TIMESTAMP)
      WHERE referrer_id = ? AND referred_id = ?
    `).bind(level1Referrer.id, purchaseData.userId).run()

    // ============================================
    // LEVEL 2 COMMISSION: $15 flat
    // ============================================
    if (level1Referrer.referred_by_code) {
      const level2Referrer = await db.prepare(`
        SELECT id, vip_level, referral_code, referred_by_code
        FROM users
        WHERE referral_code = ?
      `).bind(level1Referrer.referred_by_code).first()

      if (level2Referrer) {
        const level2Commission = 15.00
        await createCommission(db, {
          userId: level2Referrer.id as number,
          referredUserId: purchaseData.userId,
          amount: level2Commission,
          commissionType: 'level2',
          purchaseAmount: purchaseData.amount,
          transactionId: purchaseData.transactionId
        })
        result.commissions_created++
        result.total_amount += level2Commission

        // ============================================
        // LEVEL 3+ COMMISSION: 3%-5% based on VIP
        // ============================================
        if (level2Referrer.referred_by_code) {
          const level3Referrer = await db.prepare(`
            SELECT id, vip_level
            FROM users
            WHERE referral_code = ?
          `).bind(level2Referrer.referred_by_code).first()

          if (level3Referrer) {
            // Get VIP level profit share percentage
            const vipLevel = await db.prepare(`
              SELECT level3_commission_percent FROM vip_levels WHERE level = ?
            `).bind(level3Referrer.vip_level).first()

            const profitSharePercent = vipLevel?.level3_commission_percent || 3.0
            const level3Commission = (purchaseData.amount * profitSharePercent) / 100

            await createCommission(db, {
              userId: level3Referrer.id as number,
              referredUserId: purchaseData.userId,
              amount: level3Commission,
              commissionType: 'level3',
              purchaseAmount: purchaseData.amount,
              transactionId: purchaseData.transactionId
            })
            result.commissions_created++
            result.total_amount += level3Commission
          }
        }
      }
    }

    // Update referrer's total referrals count and earnings
    await db.prepare(`
      UPDATE users
      SET total_referrals = (
        SELECT COUNT(*) FROM referral_tree WHERE ancestor_id = users.id
      ),
      total_referral_earnings = (
        SELECT COALESCE(SUM(commission_amount), 0) 
        FROM referral_commissions 
        WHERE referrer_id = users.id
      )
      WHERE id = ?
    `).bind(level1Referrer.id).run()

    // Check and update VIP level for level 1 referrer
    await updateVIPLevel(db, level1Referrer.id as number)

    console.log(`✅ Processed ${result.commissions_created} commissions totaling $${result.total_amount.toFixed(2)}`)
    return result

  } catch (error) {
    console.error('Error processing referral commissions:', error)
    result.success = false
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    return result
  }
}

/**
 * Create a commission record
 */
async function createCommission(
  db: D1Database,
  data: {
    userId: number
    referredUserId: number
    amount: number
    commissionType: string
    purchaseAmount: number
    transactionId: string
  }
): Promise<void> {
  // Get referral_id from referral_tree
  const referral = await db.prepare(`
    SELECT id FROM referral_tree 
    WHERE ancestor_id = ? AND user_id = ? 
    ORDER BY level ASC LIMIT 1
  `).bind(data.userId, data.referredUserId).first()

  if (!referral) {
    console.error(`No referral relationship found between ${data.userId} and ${data.referredUserId}`)
    return
  }

  // Calculate rate as percentage (for display purposes)
  const commissionRate = data.commissionType === 'level1' ? 80 : 
                        data.commissionType === 'level2' ? 15 : 
                        (data.amount / data.purchaseAmount) * 100

  await db.prepare(`
    INSERT INTO referral_commissions (
      referral_id, referrer_id, referred_id, contract_id,
      commission_amount, commission_rate, base_amount, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'credited', CURRENT_TIMESTAMP)
  `).bind(
    referral.id,
    data.userId,
    data.referredUserId,
    0, // contract_id - we're using user_miners id instead
    data.amount,
    commissionRate,
    data.purchaseAmount,
  ).run()

  // Update total_commission_earned in referrals table
  await db.prepare(`
    UPDATE referrals 
    SET total_commission_earned = (
      SELECT COALESCE(SUM(commission_amount), 0) 
      FROM referral_commissions 
      WHERE referral_commissions.referral_id = ?
    )
    WHERE id = ?
  `).bind(referral.id, referral.id).run()

  console.log(`Created ${data.commissionType} commission: $${data.amount.toFixed(2)} for user ${data.userId}`)
}

/**
 * Check and update user's VIP level based on requirements
 */
export async function updateVIPLevel(db: D1Database, userId: number): Promise<void> {
  try {
    // Get user's current stats
    const user = await db.prepare(`
      SELECT 
        id,
        vip_level,
        total_referrals,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = users.id AND status = 'completed') as total_purchases
      FROM users
      WHERE id = ?
    `).bind(userId).first()

    if (!user) return

    // Get all VIP levels
    const vipLevels = await db.prepare(`
      SELECT * FROM vip_levels ORDER BY level DESC
    `).all()

    // Find highest VIP level user qualifies for
    let newVipLevel = user.vip_level

    for (const level of vipLevels.results) {
      const meetsRequirements = 
        user.total_purchases >= level.min_total_purchase &&
        user.total_referrals >= level.min_referrals

      if (meetsRequirements && level.level > newVipLevel) {
        newVipLevel = level.level
        break
      }
    }

    // Update VIP level if changed
    if (newVipLevel !== user.vip_level) {
      await db.prepare(`
        UPDATE users SET vip_level = ? WHERE id = ?
      `).bind(newVipLevel, userId).run()

      console.log(`🎉 User ${userId} upgraded to VIP${newVipLevel}!`)

      // TODO: Send notification via email/push when notification system is ready
      console.log(`Notification: User ${userId} upgraded to VIP${newVipLevel}`)
    }
  } catch (error) {
    console.error('Error updating VIP level:', error)
  }
}

/**
 * Create referral relationship when user signs up
 */
export async function createReferralRelationship(
  db: D1Database,
  userId: number,
  referralCode: string
): Promise<boolean> {
  try {
    // Get referrer
    const referrer = await db.prepare(`
      SELECT id FROM users WHERE referral_code = ?
    `).bind(referralCode).first()

    if (!referrer) {
      console.log('Invalid referral code:', referralCode)
      return false
    }

    // Create referrals entry
    await db.prepare(`
      INSERT INTO referrals (referrer_id, referred_id, referral_code, status)
      VALUES (?, ?, ?, 'pending')
    `).bind(referrer.id, userId, referralCode).run()

    // Build referral tree (recursive ancestors)
    // Get all ancestors of the referrer
    const ancestors = await db.prepare(`
      SELECT ancestor_id, level FROM referral_tree WHERE user_id = ?
    `).bind(referrer.id).all()

    // Insert direct relationship (level 1)
    await db.prepare(`
      INSERT INTO referral_tree (user_id, ancestor_id, level)
      VALUES (?, ?, 1)
    `).bind(userId, referrer.id).run()

    // Insert ancestor relationships (level 2+)
    for (const ancestor of ancestors.results) {
      await db.prepare(`
        INSERT INTO referral_tree (user_id, ancestor_id, level)
        VALUES (?, ?, ?)
      `).bind(userId, ancestor.ancestor_id, (ancestor.level as number) + 1).run()
    }

    console.log(`✅ Created referral relationships for user ${userId}`)
    return true

  } catch (error) {
    console.error('Error creating referral relationship:', error)
    return false
  }
}

/**
 * Request payout for pending commissions
 */
export async function requestPayout(
  db: D1Database,
  userId: number,
  minimumAmount: number = 50.00
): Promise<{ success: boolean; message: string; payout_id?: number }> {
  try {
    // Get pending commissions total
    const pendingCommissions = await db.prepare(`
      SELECT COALESCE(SUM(commission_amount), 0) as total
      FROM referral_commissions
      WHERE referrer_id = ? AND status = 'pending'
    `).bind(userId).first()

    const totalPending = pendingCommissions?.total || 0

    if (totalPending < minimumAmount) {
      return {
        success: false,
        message: `Minimum payout amount is $${minimumAmount}. You have $${totalPending.toFixed(2)} pending.`
      }
    }

    // Create payout request
    const result = await db.prepare(`
      INSERT INTO referral_payouts (user_id, amount, status)
      VALUES (?, ?, 'pending')
      RETURNING id
    `).bind(userId, totalPending).first()

    // Mark commissions as 'processing'
    await db.prepare(`
      UPDATE referral_commissions
      SET status = 'processing'
      WHERE referrer_id = ? AND status = 'pending'
    `).bind(userId).run()

    return {
      success: true,
      message: `Payout request created for $${totalPending.toFixed(2)}`,
      payout_id: result?.id as number
    }

  } catch (error) {
    console.error('Error requesting payout:', error)
    return {
      success: false,
      message: 'Failed to create payout request'
    }
  }
}
