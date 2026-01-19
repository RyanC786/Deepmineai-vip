# Daily Earnings Cron Setup Instructions

## ✅ PROBLEM SOLVED

**Issue:** Cron was running hourly but missing ~25% of runs, causing users to earn less than expected.

**Solution:** Simplified to **ONE daily cron** at midnight that distributes full day's earnings reliably.

---

## 🔧 CRON-JOB.ORG CONFIGURATION

### **CRITICAL: Update Your Cron Job Settings**

1. **Log in to cron-job.org**
2. **Find your existing "DeepMine Daily Earnings" cron job**
3. **Update the settings as follows:**

```
Title: DeepMine Daily Earnings
URL: https://www.deepmineai.vip/api/public/calculate-earnings
Request Method: POST
Schedule: 0 0 * * * (Daily at 00:00 UTC / Midnight)
Request Headers:
  Authorization: Bearer deepmine-cron-secret-2024
Enabled: ✅ Yes
```

### **Schedule Explanation**
- `0 0 * * *` means: **Minute 0, Hour 0, Every Day**
- This runs **once per day at midnight UTC**
- **DO NOT use hourly schedule** (0 * * * *) - this is unreliable

---

## 🧪 TESTING THE CRON

### **Option 1: Test Immediately (Manual Trigger)**

```bash
# Use curl to test the endpoint manually
curl -X POST https://www.deepmineai.vip/api/public/calculate-earnings \
  -H "Authorization: Bearer deepmine-cron-secret-2024" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Daily earnings calculated successfully",
  "timestamp": "2025-12-17T00:00:00.000Z"
}
```

### **Option 2: Check Admin Logs**

After the cron runs (at midnight UTC), check:
1. Go to: https://www.deepmineai.vip/admin/activity-logs
2. Look for log entry: `"cron_daily_earnings"` 
3. It should show: `"X machines processed, $XXX.XX distributed"`

### **Option 3: Check User Balances**

```bash
# Check if earnings were added today
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT 
    user_id, 
    date, 
    SUM(amount) as daily_total,
    COUNT(*) as num_machines
  FROM earnings_history 
  WHERE date = date('now')
  GROUP BY user_id, date
"
```

---

## 📊 EXPECTED BEHAVIOR

### **Daily Earnings Schedule**

| Time (UTC) | Action | Result |
|------------|--------|--------|
| 00:00 (Midnight) | Cron triggers | Full day's earnings distributed to all active machines |
| 00:01 | Complete | Users see updated wallet balance |

### **Per-User Example**

User with these machines:
- RTX 4090: $8/day
- A100 96G: $38/day
- A100 48G: $18/day
- A100 72G: $28/day

**Expected:** $92 deposited **once per day** at midnight
**Actual:** Check `wallet_balance` field in `users` table

---

## 🔍 VERIFYING IT WORKS

### **Day 1 (Today) - Before Midnight**
Users may have **partial earnings** from the old hourly system. This is normal.

### **Day 2 (Tomorrow) - After Midnight**
After cron runs at 00:00 UTC:

1. **Check earnings history:**
```sql
SELECT * FROM earnings_history 
WHERE date = '2025-12-17' 
ORDER BY created_at DESC 
LIMIT 20;
```

2. **Verify ONE entry per machine per day** (not 24!)

3. **Check wallet balances increased** by expected daily amount

---

## ⚠️ IMPORTANT NOTES

### **Machine Activation Requirements**
Only machines with:
- ✅ `activation_status = 'active'`
- ✅ `expires_at > NOW()`
- ✅ Admin has manually activated them

Will receive earnings.

### **Double-Payment Prevention**
The cron checks `last_earning_at` to ensure:
- Each machine only gets paid **once per day**
- Even if cron runs multiple times accidentally
- No duplicate payments

### **Timezone Considerations**
- Cron runs at **00:00 UTC** (Coordinated Universal Time)
- This may be different from your local timezone
- Users will see earnings appear at the same UTC time every day

---

## 🚨 TROUBLESHOOTING

### **Problem: "Unauthorized" response**

**Cause:** Wrong Authorization header

**Solution:**
```bash
# Make sure header is EXACTLY:
Authorization: Bearer deepmine-cron-secret-2024

# NOT:
Authorization: deepmine-cron-secret-2024  ❌ (missing "Bearer")
Authorization: Bearer deepmine-cron-2024   ❌ (old secret)
```

### **Problem: "No active machines found"**

**Cause:** All machines are either:
- Not activated by admin
- Expired
- Already paid today

**Solution:** This is normal if:
- No users have active machines
- Cron already ran today

### **Problem: Earnings not showing in user dashboard**

**Cause:** Frontend might be caching old balance

**Solution:**
1. Check database directly (see queries above)
2. Hard refresh dashboard (Ctrl+Shift+R)
3. Check `wallet_balance` field in `users` table

---

## 📝 CURRENT USER STATUS

### **User 3 (ryan786w@gmail.com)**
- **Expected:** $92/day
- **Machines:** 4 active (IDs: 12, 13, 14, 15)
- **Current Balance:** ~$4,264 (will increase by $92 tomorrow at midnight)

### **User 5 (aleenakhanak83@gmail.com)**
- **Expected:** $8/day
- **Machines:** 1 active (ID: 20)
- **Current Balance:** ~$7,525 (will increase by $8 tomorrow at midnight)

---

## ✅ DEPLOYMENT COMPLETE

- ✅ Code updated and deployed to production
- ✅ Endpoint ready: `POST /api/public/calculate-earnings`
- ⏳ **ACTION REQUIRED:** Update cron-job.org schedule to `0 0 * * *`

**Next cron run:** Tomorrow at 00:00 UTC

---

## 🎯 SUCCESS CRITERIA

After updating cron-job.org and waiting for midnight UTC:

1. ✅ Cron runs **exactly once** per day
2. ✅ Each machine receives **full daily earnings** in one payment
3. ✅ User wallet balances increase by expected amount
4. ✅ `earnings_history` shows **1 entry per machine per day** (not 24!)
5. ✅ Admin logs show successful cron execution

---

**Questions? Issues?**
Check the logs in `/admin/activity-logs` or test manually with the curl command above.
