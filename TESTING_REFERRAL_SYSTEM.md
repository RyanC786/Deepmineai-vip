# Testing the Referral System

## ✅ DEPLOYED & READY TO TEST

**Live Dashboard**: https://www.deepmineai.vip/dashboard  
**Deployment**: https://cc424021.deepmine-ai.pages.dev

---

## 🧪 Test Plan

### Test 1: View Your Referral Code ✅

**Steps:**
1. Login to https://www.deepmineai.vip/login
2. Use existing account: `ryan786w@gmail.com` or `aleenakhanak83@gmail.com`
3. Navigate to Dashboard
4. Scroll to see "Referral System" section (appears above Mining Status)

**Expected Results:**
- ✅ See "Referral System" header with VIP badge
- ✅ See your unique referral code (e.g., `ABC12345`)
- ✅ See referral link: `https://www.deepmineai.vip/register?ref=ABC12345`
- ✅ See stats: Direct Referrals (0), Network Size (0), Total Earned ($0.00), VIP Progress (0%)
- ✅ Copy buttons work for code and link

**Screenshot the referral section!** 📸

---

### Test 2: Register New User with Referral Code

**Steps:**
1. Copy your referral link from dashboard
2. Open in incognito/private window
3. Paste the link (e.g., `https://www.deepmineai.vip/register?ref=ABC12345`)
4. Register a new user (use a different email)
5. Complete email verification
6. Complete KYC verification (or admin approve it)

**Expected Results:**
- ✅ New user registers successfully
- ✅ New user appears in your downline table
- ✅ Your "Direct Referrals" count increases to 1
- ✅ Your "Network Size" increases to 1

**Check:**
```bash
# Run this in Cloudflare D1 Console to verify referral tree:
SELECT * FROM referral_tree WHERE ancestor_id = YOUR_USER_ID;
```

---

### Test 3: Level 1 Commission ($80)

**Scenario**: Your direct referral buys a package

**Steps:**
1. Login as the NEW user (that you referred)
2. Go to Dashboard
3. Click "Start Mining"
4. Purchase ANY mining package
5. Logout and login back as ORIGINAL user

**Expected Results:**
- ✅ Your balance increases by **$80**
- ✅ "Total Earned" in referral section shows **$80.00**
- ✅ Downline table shows "Commission Earned: $80.00" for that user
- ✅ Commission appears in database:

```bash
# Check commissions in Cloudflare D1:
SELECT * FROM referral_commissions WHERE user_id = YOUR_USER_ID;
```

**Expected Output:**
```json
{
  "user_id": YOUR_ID,
  "from_user_id": REFERRED_USER_ID,
  "amount": 80,
  "commission_type": "level1",
  "level": 1
}
```

---

### Test 4: Level 2 Commission ($60 + $15)

**Scenario**: Your referral's referral buys a package

**Steps:**
1. User A (you) refers User B
2. User B refers User C
3. User C buys a package

**Expected Results:**
- ✅ **User B gets**: $80 (Level 1 commission)
- ✅ **User A gets**: $15 (Level 2 bonus)
- ✅ User A's "Network Size" = 2
- ✅ Database has 2 commission records

**Database Check:**
```sql
-- Check User A's commissions:
SELECT * FROM referral_commissions WHERE user_id = USER_A_ID;

-- Expected: 
-- 1. level1 commission ($80) from User B
-- 2. level2_bonus commission ($15) from User C
```

---

### Test 5: VIP Level Upgrade

**Scenario**: Upgrade from VIP 1 to VIP 2

**Requirements**: 5 direct referrals who purchased packages

**Steps:**
1. Get 5 users to register with your referral code
2. Each of them purchases a mining package
3. Refresh your dashboard

**Expected Results:**
- ✅ VIP badge changes from "VIP 1" to "VIP 2"
- ✅ "Direct Referrals" shows 5
- ✅ Total commissions = $400 ($80 × 5)
- ✅ VIP Progress shows progress toward VIP 3

**Database Check:**
```sql
SELECT vip_level, direct_referrals, network_size 
FROM users 
WHERE id = YOUR_USER_ID;

-- Expected: vip_level = 2, direct_referrals = 5, network_size = 5
```

---

### Test 6: Level 3+ Percentage Commission

**Scenario**: Test 3-5% commission for deep network levels

**Steps:**
1. Build a 3-level deep network:
   - User A → User B → User C → User D
2. User D buys Professional package ($449.99)
3. Check commissions

**Expected Results:**
- ✅ **User C gets**: $80 (Level 1)
- ✅ **User B gets**: $60 (Level 2 primary)
- ✅ **User A gets**: $15 (Level 2 bonus from User C) + 3% of $449.99 = $13.50 (Level 3)
- ✅ Total for User A: **$28.50**

**Database Check:**
```sql
SELECT 
  commission_type,
  level,
  amount,
  from_user_id
FROM referral_commissions 
WHERE user_id = USER_A_ID
ORDER BY created_at DESC;
```

---

## 📊 Quick Database Queries

### Check Your Referral Code:
```sql
SELECT id, email, referral_code, referred_by, vip_level 
FROM users 
WHERE email = 'ryan786w@gmail.com';
```

### Check Your Network:
```sql
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.vip_level,
  u.referred_by,
  u.created_at
FROM users u
WHERE u.referred_by = 'YOUR_REFERRAL_CODE'
ORDER BY u.created_at DESC;
```

### Check All Commissions:
```sql
SELECT 
  rc.*,
  u.email as from_user_email
FROM referral_commissions rc
JOIN users u ON rc.from_user_id = u.id
WHERE rc.user_id = YOUR_USER_ID
ORDER BY rc.created_at DESC;
```

### Check Referral Tree:
```sql
SELECT 
  rt.level,
  u.id,
  u.email,
  u.full_name
FROM referral_tree rt
JOIN users u ON rt.user_id = u.id
WHERE rt.ancestor_id = YOUR_USER_ID
ORDER BY rt.level, u.created_at;
```

### Check VIP Progress:
```sql
SELECT 
  u.vip_level,
  u.direct_referrals,
  u.network_size,
  vip.name as current_vip,
  vip.min_direct_referrals,
  vip.min_network_size,
  next_vip.name as next_vip,
  next_vip.min_direct_referrals as next_direct_needed,
  next_vip.min_network_size as next_network_needed
FROM users u
JOIN vip_levels vip ON u.vip_level = vip.level
LEFT JOIN vip_levels next_vip ON next_vip.level = u.vip_level + 1
WHERE u.id = YOUR_USER_ID;
```

---

## 🔍 API Endpoint Testing

### Test Referral Code API:
```bash
# Get your referral code
curl -X GET https://www.deepmineai.vip/api/referral/code \
  -H "Cookie: auth_token=YOUR_AUTH_TOKEN" \
  | jq
```

**Expected Response:**
```json
{
  "success": true,
  "referralCode": "ABC12345",
  "referralLink": "https://www.deepmineai.vip/register?ref=ABC12345"
}
```

---

### Test Referral Stats API:
```bash
curl -X GET https://www.deepmineai.vip/api/referral/stats \
  -H "Cookie: auth_token=YOUR_AUTH_TOKEN" \
  | jq
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "vipLevel": 1,
    "directReferrals": 0,
    "networkSize": 0,
    "totalReferrals": 0,
    "totalEarned": 0,
    "totalCommissions": 0,
    "commissionsByLevel": []
  },
  "vipInfo": {
    "level": 1,
    "name": "VIP 1",
    "min_direct_referrals": 0,
    "min_network_size": 0,
    "level3_commission_percent": 3.0,
    "benefits": "Basic referral benefits"
  },
  "nextVip": {
    "level": 2,
    "name": "VIP 2",
    "min_direct_referrals": 5,
    "min_network_size": 5,
    "level3_commission_percent": 3.2,
    "benefits": "5 direct referrals"
  }
}
```

---

### Test Downline API:
```bash
curl -X GET https://www.deepmineai.vip/api/referral/downline \
  -H "Cookie: auth_token=YOUR_AUTH_TOKEN" \
  | jq
```

**Expected Response:**
```json
{
  "success": true,
  "downline": [
    {
      "id": 123,
      "email": "referral@example.com",
      "full_name": "John Doe",
      "vip_level": 1,
      "direct_referrals": 0,
      "network_size": 0,
      "created_at": "2025-12-04T14:30:00.000Z",
      "active_miners": 1,
      "commission_earned": 80.00
    }
  ]
}
```

---

### Test Commission History API:
```bash
curl -X GET https://www.deepmineai.vip/api/referral/commissions \
  -H "Cookie: auth_token=YOUR_AUTH_TOKEN" \
  | jq
```

---

## ✅ Success Checklist

After testing, you should see:

- [ ] Referral section displays on dashboard
- [ ] Referral code and link are generated
- [ ] Copy buttons work
- [ ] New user can register with `?ref=CODE`
- [ ] New user appears in downline table
- [ ] Direct referrals count increases
- [ ] Network size increases
- [ ] Commissions are paid on package purchase
- [ ] Balance updates with commission amount
- [ ] VIP badge shows current level
- [ ] VIP progress shows percentage to next level
- [ ] Commission history is accurate in database

---

## 🚨 Troubleshooting

### Issue: "Loading..." never changes
**Solution**: Check browser console (F12) for errors. Look for:
- `🔗 Loading referral data...`
- `✅ Referral data loaded`

If you see errors, check:
1. User is logged in (has auth_token cookie)
2. API endpoints are accessible
3. Database tables exist

---

### Issue: Referral code not generated
**Solution**: Check if user has `referral_code` in database:
```sql
SELECT id, email, referral_code FROM users WHERE email = 'YOUR_EMAIL';
```

If NULL, the referral code generation will create one on first API call.

---

### Issue: New user not appearing in downline
**Solution**: Check registration flow:
1. URL had `?ref=CODE` parameter
2. Registration succeeded
3. `referred_by` column is set in database
4. `referral_tree` table has entry

```sql
-- Check if user was referred:
SELECT id, email, referred_by FROM users WHERE email = 'NEW_USER_EMAIL';

-- Check referral tree:
SELECT * FROM referral_tree WHERE user_id = NEW_USER_ID;
```

---

### Issue: Commission not paid
**Solution**: Check commission distribution logs:
1. Open Cloudflare Dashboard
2. Go to Workers & Pages → deepmine-ai → Logs
3. Look for: `💰 Distributing commissions for buyer...`
4. Check for errors in commission calculation

Also verify:
```sql
-- Check if commission was recorded:
SELECT * FROM referral_commissions WHERE from_user_id = BUYER_USER_ID;

-- Check if balance was updated:
SELECT id, email, balance FROM users WHERE id = REFERRER_USER_ID;
```

---

## 🎉 Next Steps After Testing

Once basic testing is complete:

1. **Create 5+ test users** to verify VIP upgrades
2. **Test multi-level chains** (3+ levels deep)
3. **Verify commission percentages** for VIP 2+
4. **Build admin dashboard** to view all networks
5. **Add analytics charts** for referral performance

---

## 📸 Screenshots to Capture

Please take screenshots of:
1. Referral section on dashboard (with your code/link)
2. Downline table with at least 1 referral
3. Commission earned notification (after purchase)
4. Updated balance showing commission
5. VIP badge after upgrade to VIP 2

---

**Ready to test!** 🚀

Start with Test 1 - just login and view your referral code!
