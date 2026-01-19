# 🔴 LIVE TRANSACTION - User ID 5 (Aleena Khan)

**Date:** December 12, 2025  
**Status:** 🟡 **IN PROGRESS - Awaiting Crypto on Kraken**

---

## User Information

| Field | Value |
|-------|-------|
| **User ID** | 5 |
| **Email** | aleenakhanak83@gmail.com |
| **Full Name** | Aleena khan |
| **KYC Status** | ✅ Approved |
| **Account Status** | ✅ Active |
| **Current Balance** | $0.00 |
| **Current Wallet Balance** | $0.00 |

---

## Transaction Process Checklist

### Phase 1: ⏳ Awaiting Crypto (CURRENT)
- [ ] User sends crypto to deposit wallet
- [ ] Monitor Kraken for incoming transaction
- [ ] Verify transaction amount and sender
- [ ] Confirm blockchain confirmations

**Kraken Monitoring:**
- Check Kraken deposits regularly
- Look for transaction from user
- Verify wallet address matches user's deposit request

---

### Phase 2: 📥 Crypto Received on Kraken
Once crypto shows up on Kraken:

#### Step 1: Get Transaction Details
Note down:
- [ ] **Amount received:** $_______ USD equivalent
- [ ] **Transaction hash:** `____________________`
- [ ] **Crypto type:** (BTC/ETH/USDT/etc.)
- [ ] **Confirmations:** _____ confirmations
- [ ] **Timestamp:** ________________

#### Step 2: Find Pending Deposit in Admin Panel
1. Go to: https://www.deepmineai.vip/admin/panel/deposits
2. Look for pending deposit from:
   - User: Aleena khan (ID: 5)
   - Email: aleenakhanak83@gmail.com
3. Note the deposit ID

#### Step 3: Approve Deposit
```bash
# Check deposit details first
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM deposits WHERE user_id = 5 ORDER BY created_at DESC LIMIT 1"

# Get admin ID (assuming you're admin ID 1)
# Then approve via admin panel or API:
```

**Via Admin Panel (RECOMMENDED):**
1. Click on the deposit row
2. Verify details match Kraken transaction
3. Click **"Approve"** button
4. Enter admin credentials if prompted
5. Confirm approval

**Result:** User balance will be updated automatically

---

### Phase 3: ✅ Post-Approval Verification

#### Verify Balance Update
```bash
# Check user's updated balance
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT id, email, balance, wallet_balance FROM users WHERE id = 5"
```

**Expected:**
- `balance` should equal deposit amount
- `wallet_balance` should equal deposit amount
- Both should be synchronized

#### Check Admin Logs
```bash
# Verify approval was logged
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM admin_logs WHERE entity_type = 'deposit' ORDER BY created_at DESC LIMIT 3"
```

#### Notify User (Optional)
- Send email confirmation of approved deposit
- User can now see balance in dashboard

---

### Phase 4: 🤖 User Purchases Machine

Once balance is approved, user can:

1. **Visit Machines Page:**
   - URL: https://www.deepmineai.vip/machines
   - User logs in with: aleenakhanak83@gmail.com

2. **Select Mining Package:**
   - User chooses from 10 available packages
   - Prices range from $500 to $50,000

3. **Complete Purchase:**
   - User enters investment amount
   - User enters contract days (30-365 days)
   - System validates balance
   - Transaction processed

4. **Machine Activation:**
   - Machine status: `pending` initially
   - Admin must activate in admin panel
   - Status changes to `active`
   - Daily earnings begin

---

## Machine Activation Process

### Step 1: Admin Activates Machine
Go to: https://www.deepmineai.vip/admin/panel/machines

1. Find user's pending machine:
   - User: Aleena khan (ID: 5)
   - Status: `pending`
2. Click **"Activate"** button
3. Confirm activation

### Step 2: Verify Machine is Active
```bash
# Check user's active machines
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM user_miners WHERE user_id = 5 ORDER BY created_at DESC LIMIT 1"
```

**Expected:**
- `status`: `active`
- `started_at`: Set to current timestamp
- `expires_at`: Set to started_at + duration_days
- `daily_rate`: Should match package daily earnings

### Step 3: Verify Daily Earnings Will Work
Machine will earn daily via cron job:
- Cron runs at 00:00 UTC daily
- Checks all machines where `status = 'active'` and `expires_at > now()`
- Adds `daily_rate` to user's balance
- Updates `total_earned` for the machine
- Updates `last_earning_at` timestamp

---

## Available Mining Packages (Current Prices)

| ID | Package Name | Price | Daily Earnings | Duration |
|----|--------------|-------|----------------|----------|
| 1 | H800 8400G Server | $50,000 | $909/day | 180 days |
| 2 | H800 6400G Server | $30,000 | $546/day | 180 days |
| 3 | H800 3200G Server | $11,000 | $200/day | 180 days |
| 4 | H200 3200 Server | $7,000 | $127/day | 180 days |
| 5 | H800 2400 Server | $5,000 | $91/day | 180 days |
| 6 | A100 96G Server | $2,000 | $36/day | 180 days |
| 7 | A100 72G Server | $1,500 | $28/day | 180 days |
| 8 | A100 48G Server | $1,000 | $18/day | 180 days |
| 9 | RTX 4090 (East China) | $500 | $9/day | 180 days |
| 10 | RTX 4090 (South China) | $500 | $9/day | 180 days |

---

## Common Issues & Solutions

### Issue: Deposit Not Showing in Admin Panel
**Solution:**
1. User may not have submitted deposit yet
2. Check if user went to: https://www.deepmineai.vip/deposit
3. User must enter:
   - Amount sent
   - Transaction hash
   - Wallet address used
4. User clicks "Submit Deposit"

### Issue: Balance Not Updated After Approval
**Solution:**
```bash
# Manually update balance if needed
npx wrangler d1 execute deepmine-production --remote \
  --command="UPDATE users SET balance = AMOUNT, wallet_balance = AMOUNT WHERE id = 5"
```
Replace `AMOUNT` with the actual deposit amount.

### Issue: Machine Not Earning Daily
**Solution:**
1. Check machine status is `active`
2. Check `expires_at > now()`
3. Verify cron job is running (check cron-job.org)
4. Check `admin_logs` for cron execution

### Issue: User Can't Purchase Machine
**Possible causes:**
- Balance is 0 (deposit not approved)
- KYC not approved (already approved for ID 5 ✅)
- Account suspended (not the case ✅)
- Machine already purchased and pending activation

---

## Testing Commands

### Check User Status
```bash
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT id, email, balance, wallet_balance, kyc_status FROM users WHERE id = 5"
```

### Check Deposits
```bash
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM deposits WHERE user_id = 5 ORDER BY created_at DESC"
```

### Check Machines
```bash
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM user_miners WHERE user_id = 5 ORDER BY created_at DESC"
```

### Check Admin Logs
```bash
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM admin_logs WHERE entity_id = 5 ORDER BY created_at DESC LIMIT 5"
```

---

## Contact Information

**User Details:**
- **Name:** Aleena khan
- **Email:** aleenakhanak83@gmail.com
- **User ID:** 5
- **Dashboard:** https://www.deepmineai.vip/dashboard

**Admin Panels:**
- **Deposits:** https://www.deepmineai.vip/admin/panel/deposits
- **Machines:** https://www.deepmineai.vip/admin/panel/machines
- **Users:** https://www.deepmineai.vip/admin/dashboard

---

## Transaction Timeline

| Time | Event | Status |
|------|-------|--------|
| [Pending] | User sends crypto | ⏳ Waiting |
| [Pending] | Crypto arrives on Kraken | ⏳ Waiting |
| [Pending] | Admin approves deposit | ⏳ Waiting |
| [Pending] | User purchases machine | ⏳ Waiting |
| [Pending] | Admin activates machine | ⏳ Waiting |
| [Pending] | Daily earnings begin | ⏳ Waiting |

---

## Important Notes

### Security
- ✅ User KYC is approved - safe to process
- ✅ Account is active - no restrictions
- ✅ Verify Kraken transaction matches user's submission
- ✅ Double-check amount before approval

### Balance Synchronization
- Both `balance` and `wallet_balance` must be updated together
- Withdrawal approval code already handles this correctly
- Deposit approval should do the same

### Daily Earnings
- Earnings automatically credited at 00:00 UTC
- Machine must be `active` and not expired
- `total_earned` tracks lifetime earnings per machine
- User sees earnings in dashboard

---

## Next Steps

**CURRENT STATUS:** ⏳ Awaiting crypto on Kraken

**Once crypto arrives:**
1. ✅ Note transaction details
2. ✅ Find deposit in admin panel
3. ✅ Approve deposit
4. ✅ Verify balance update
5. ✅ Notify user (optional)
6. ✅ Wait for user to purchase machine
7. ✅ Activate machine in admin panel
8. ✅ Verify daily earnings work

---

## Status Updates

**Update this section as transaction progresses:**

```
[TIMESTAMP] - [EVENT] - [NOTES]

Example:
[2025-12-12 14:30 UTC] - Crypto received on Kraken - $1,500 USDT
[2025-12-12 14:35 UTC] - Deposit approved - Balance updated to $1,500
[2025-12-12 14:45 UTC] - User purchased A100 72G Server - $1,500
[2025-12-12 14:50 UTC] - Machine activated - Daily earnings: $28
```

---

**Document created:** December 12, 2025  
**Last updated:** December 12, 2025  
**Transaction status:** 🟡 IN PROGRESS
