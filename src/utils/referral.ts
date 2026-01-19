// Referral system utilities

/**
 * Build referral tree when a new user registers
 * Creates entries in referral_tree for all ancestors up to 10 levels
 */
export async function buildReferralTree(userId: number, referredBy: string, db: D1Database): Promise<void> {
  try {
    // Find the referrer
    const referrer = await db.prepare('SELECT id, referred_by FROM users WHERE referral_code = ?').bind(referredBy).first()
    
    if (!referrer) return
    
    // Add direct parent (level 1)
    await db.prepare(`
      INSERT INTO referral_tree (user_id, ancestor_id, level)
      VALUES (?, ?, 1)
    `).bind(userId, referrer.id).run()
    
    // Update referrer's stats
    await db.prepare(`
      UPDATE users 
      SET direct_referrals = direct_referrals + 1,
          total_referrals = total_referrals + 1,
          network_size = network_size + 1
      WHERE id = ?
    `).bind(referrer.id).run()
    
    // Find all ancestors and add them to the tree
    const ancestors = await db.prepare(`
      SELECT ancestor_id, level 
      FROM referral_tree 
      WHERE user_id = ?
      ORDER BY level
      LIMIT 9
    `).bind(referrer.id).all()
    
    for (const ancestor of ancestors.results) {
      await db.prepare(`
        INSERT INTO referral_tree (user_id, ancestor_id, level)
        VALUES (?, ?, ?)
      `).bind(userId, ancestor.ancestor_id, (ancestor.level as number) + 1).run()
      
      // Update ancestor's network size
      await db.prepare(`
        UPDATE users 
        SET network_size = network_size + 1,
            total_referrals = total_referrals + 1
        WHERE id = ?
      `).bind(ancestor.ancestor_id).run()
    }
    
    // Recalculate VIP levels for affected users
    await updateVIPLevel(referrer.id as number, db)
    
  } catch (error) {
    console.error('Build referral tree error:', error)
    throw error
  }
}

/**
 * Update user's VIP level based on their referral stats
 */
export async function updateVIPLevel(userId: number, db: D1Database): Promise<number> {
  try {
    const user = await db.prepare(`
      SELECT direct_referrals, network_size 
      FROM users 
      WHERE id = ?
    `).bind(userId).first()
    
    if (!user) return 1
    
    const vipLevel = await db.prepare(`
      SELECT level 
      FROM vip_levels 
      WHERE min_direct_referrals <= ? AND min_network_size <= ?
      ORDER BY level DESC 
      LIMIT 1
    `).bind(user.direct_referrals, user.network_size).first()
    
    const newLevel = vipLevel?.level || 1
    
    await db.prepare(`
      UPDATE users 
      SET vip_level = ? 
      WHERE id = ?
    `).bind(newLevel, userId).run()
    
    return newLevel as number
    
  } catch (error) {
    console.error('Update VIP level error:', error)
    return 1
  }
}

/**
 * Distribute commissions when a user purchases a mining package
 * Level 1 (direct): $80
 * Level 2: $60 to L1, $15 to L2
 * Level 3+: $60 to L2, $15 to L1, 3-5% to L3+ (based on VIP)
 */
export async function distributeCommissions(
  buyerId: number, 
  packageId: number,
  packagePrice: number,
  db: D1Database
): Promise<void> {
  try {
    console.log(`💰 Distributing commissions for buyer ${buyerId}, package ${packageId}, price $${packagePrice}`)
    
    // Get the buyer's referral chain
    const referralChain = await db.prepare(`
      SELECT 
        rt.ancestor_id as user_id,
        rt.level,
        u.vip_level,
        vip.level3_commission_percent
      FROM referral_tree rt
      JOIN users u ON rt.ancestor_id = u.id
      LEFT JOIN vip_levels vip ON u.vip_level = vip.level
      WHERE rt.user_id = ?
      ORDER BY rt.level
      LIMIT 10
    `).bind(buyerId).all()
    
    if (referralChain.results.length === 0) {
      console.log('✅ No referrers found - no commissions to distribute')
      return
    }
    
    const commissions: Array<{ userId: number, amount: number, level: number, type: string }> = []
    
    for (const ref of referralChain.results) {
      const level = ref.level as number
      const userId = ref.user_id as number
      let amount = 0
      let commissionType = ''
      
      if (level === 1) {
        // Level 1 (Direct referral): $80
        amount = 80
        commissionType = 'level1'
      } else if (level === 2) {
        // Level 2: $60 to this user
        amount = 60
        commissionType = 'level2_primary'
        
        // Also give $15 to Level 1
        const level1 = referralChain.results.find(r => (r.level as number) === 1)
        if (level1) {
          commissions.push({
            userId: level1.user_id as number,
            amount: 15,
            level: 1,
            type: 'level2_bonus'
          })
        }
      } else if (level >= 3) {
        // Level 3+: 
        // - $60 to Level 2
        // - $15 to Level 1
        // - 3-5% to this user (based on VIP level)
        
        if (level === 3) {
          // Give $60 to Level 2
          const level2 = referralChain.results.find(r => (r.level as number) === 2)
          if (level2) {
            commissions.push({
              userId: level2.user_id as number,
              amount: 60,
              level: 2,
              type: 'level3_l2_bonus'
            })
          }
          
          // Give $15 to Level 1
          const level1 = referralChain.results.find(r => (r.level as number) === 1)
          if (level1) {
            commissions.push({
              userId: level1.user_id as number,
              amount: 15,
              level: 1,
              type: 'level3_l1_bonus'
            })
          }
        }
        
        // Calculate percentage for this level (3-5% based on VIP)
        const percent = ref.level3_commission_percent || 3.0
        amount = packagePrice * (percent / 100)
        commissionType = `level${level}`
      }
      
      if (amount > 0) {
        commissions.push({ userId, amount, level, type: commissionType })
      }
    }
    
    // Apply all commissions
    for (const commission of commissions) {
      console.log(`💸 Commission: User ${commission.userId} receives $${commission.amount.toFixed(2)} (${commission.type})`)
      
      // Add to referral_commissions table
      await db.prepare(`
        INSERT INTO referral_commissions (
          user_id, from_user_id, amount, commission_type, level, package_purchase_id
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        commission.userId,
        buyerId,
        commission.amount,
        commission.type,
        commission.level,
        packageId
      ).run()
      
      // Update user balance
      await db.prepare(`
        UPDATE users 
        SET balance = COALESCE(balance, 0) + ?
        WHERE id = ?
      `).bind(commission.amount, commission.userId).run()
    }
    
    console.log(`✅ Distributed ${commissions.length} commissions totaling $${commissions.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}`)
    
  } catch (error) {
    console.error('Distribute commissions error:', error)
    throw error
  }
}
