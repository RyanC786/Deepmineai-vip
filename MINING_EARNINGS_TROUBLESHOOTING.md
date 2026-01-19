# 🔧 Mining Earnings Troubleshooting Guide

**Date**: December 8, 2025  
**Issue**: Daily earnings showing $0.00 despite active miners

---

## 🔍 **Issues Identified**

### **1. Miner Status Problem** ❌

**Current Status in Database**:
```
Miner ID #8:
- user_id: 3 (ryan786w@gmail.com)
- status: "inactive"  ❌ WRONG!
- daily_rate: $8.00
- last_earning_at: 2025-12-06 21:57:22
- expires_at: 2026-06-04
- activation_status: "active"
```

**Problem**: The miner has `status = 'inactive'` but `activation_status = 'active'`. This is contradictory!

**Root Cause**: The cron job query looks for miners with `status = 'active'`, but your miner has `status = 'inactive'`.

**Cron Query** (from `src/index.tsx:132-137`):
```sql
SELECT um.*
FROM user_miners um
WHERE um.status = 'active'  -- ❌ Your miner status is 'inactive'
  AND datetime(um.expires_at) > datetime('now')
  AND (um.last_earning_at IS NULL OR datetime(um.last_earning_at) < datetime(?))
```

---

### **2. Cron Job Not Running** ⏰

**Last Earnings Record**: 2025-12-06 21:57:22 (2 days ago!)

**Expected**: Earnings should be calculated every hour

**Problem**: Either:
- External cron service (cron-job.org) is not set up
- Cron endpoint authentication is failing
- Cron is skipping inactive miners

---

### **3. Dashboard Balance Mismatch** 💰

**Database**: $64.51  
**Dashboard Shows**: $708.00  

**This is a frontend caching or calculation issue.**

---

## ✅ **Solutions**

### **Solution 1: Fix Miner Status (IMMEDIATE)**

Update the miner status from `inactive` to `active`:

```sql
UPDATE user_miners
SET status = 'active'
WHERE id = 8 AND user_id = 3;
```

**Execute this command**:
```bash
npx wrangler d1 execute deepmine-production --remote --command="UPDATE user_miners SET status = 'active' WHERE id = 8 AND user_id = 3"
```

---

### **Solution 2: Setup External Cron Job**

**Option A: Using cron-job.org** (Recommended)

1. Go to https://cron-job.org
2. Create free account
3. Add new cron job:
   - **URL**: `https://www.deepmineai.vip/api/public/calculate-earnings`
   - **Schedule**: Every 1 hour
   - **Method**: POST
   - **Headers**: 
     ```
     Authorization: Bearer deepmine-cron-2024
     ```

**Option B: Using Cloudflare Cron Triggers**

Add to `wrangler.jsonc`:
```jsonc
{
  "triggers": {
    "crons": ["0 * * * *"]  // Every hour at minute 0
  }
}
```

Then add handler in `src/index.tsx`:
```typescript
export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx)
  },
  
  async scheduled(event, env, ctx) {
    // Trigger earnings calculation
    const DB = env.DB
    const today = new Date().toISOString().split('T')[0]
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const miners = await DB.prepare(`
      SELECT um.*
      FROM user_miners um
      WHERE um.status = 'active'
        AND datetime(um.expires_at) > datetime('now')
        AND (um.last_earning_at IS NULL OR datetime(um.last_earning_at) < datetime(?))
    `).bind(oneHourAgo).all()

    let processed = 0
    const now = new Date().toISOString()

    for (const miner of miners.results || []) {
      const m = miner as any
      
      const lastEarning = m.last_earning_at ? new Date(m.last_earning_at) : new Date(m.started_at)
      const hoursElapsed = Math.min(24, (Date.now() - lastEarning.getTime()) / (1000 * 60 * 60))
      const earningsAmount = (m.daily_rate / 24) * hoursElapsed

      await DB.prepare(`
        INSERT INTO earnings_history (user_id, miner_id, amount, date)
        VALUES (?, ?, ?, ?)
      `).bind(m.user_id, m.id, earningsAmount, today).run()

      const newTotal = (m.total_earned || 0) + earningsAmount
      await DB.prepare(`
        UPDATE user_miners 
        SET total_earned = ?, last_earning_at = ?
        WHERE id = ?
      `).bind(newTotal, now, m.id).run()

      await DB.prepare(`
        UPDATE users 
        SET balance = COALESCE(balance, 0) + ?
        WHERE id = ?
      `).bind(earningsAmount, m.user_id).run()

      processed++
    }

    console.log(`✅ Cron: Processed ${processed} miners`)
  }
}
```

---

### **Solution 3: Manual Trigger (Testing)**

You can manually trigger earnings calculation to test:

**URL**: `/api/cron/calculate-earnings` (Admin only)

**Steps**:
1. Login as admin
2. Use browser console:
```javascript
fetch('/api/cron/calculate-earnings', {
    method: 'POST',
    credentials: 'include'
}).then(r => r.json()).then(console.log)
```

---

## 🛠️ **Immediate Fix Script**

Here's a complete fix script:

```sql
-- 1. Fix miner status
UPDATE user_miners
SET status = 'active'
WHERE user_id = 3 AND activation_status = 'active' AND status = 'inactive';

-- 2. Verify active miners
SELECT id, user_id, status, activation_status, daily_rate, last_earning_at
FROM user_miners
WHERE user_id = 3;

-- 3. Calculate missing earnings manually (for Dec 7 and Dec 8)
-- Note: This should be done by the cron job, but we can do it manually for testing

-- For miner #8 with $8/day rate:
-- Dec 7: 24 hours * (8/24) = $8.00
-- Dec 8: ~14 hours so far * (8/24) = ~$4.67
-- Total missing: ~$12.67
```

---

## 📊 **Expected Results After Fix**

After fixing the miner status and setting up cron:

**Dashboard Should Show**:
- **Account Balance**: $64.51 + missing earnings ($12-13)
- **Daily Earnings**: $8.00 (or accumulated amount)
- **Active Miners**: 1 (miner #8)

**Earnings History**:
- Dec 6: $8.00 ✅
- Dec 7: $8.00 (missing - needs cron)
- Dec 8: ~$4-5 (missing - needs cron)

---

## 🔍 **Verification Steps**

### **1. Check Miner Status**:
```sql
SELECT id, status, activation_status, daily_rate, last_earning_at
FROM user_miners
WHERE user_id = 3 AND activation_status = 'active';
```

**Expected**: `status = 'active'`

### **2. Check Earnings History**:
```sql
SELECT date, SUM(amount) as total_earned
FROM earnings_history
WHERE user_id = 3
GROUP BY date
ORDER BY date DESC;
```

**Expected**: Entries for Dec 7 and Dec 8

### **3. Check User Balance**:
```sql
SELECT balance FROM users WHERE id = 3;
```

**Expected**: Increased by missing earnings

---

## 🚨 **Why Status is Inconsistent**

The issue is that the `user_miners` table has **two status fields**:

1. **`activation_status`**: Admin approval (`pending`, `active`, `rejected`)
2. **`status`**: Runtime status (`active`, `inactive`, `expired`)

**The problem**: When admin activates a miner, only `activation_status` changes to `'active'`, but `status` remains `'inactive'`.

**The fix**: When admin activates, BOTH fields should be updated:

```typescript
// In admin activation code (src/routes/admin-machines.ts)
await c.env.DB.prepare(`
  UPDATE user_miners
  SET activation_status = 'active',
      status = 'active',  -- Add this line!
      activated_at = datetime('now'),
      activated_by = ?
  WHERE id = ?
`).bind(adminEmail, minerId).run()
```

---

## 📝 **Long-term Solution**

### **Update Admin Activation Code**

File: `src/routes/admin-machines.ts`

Find the activation endpoint and ensure it sets BOTH status fields:

```typescript
// Update miner status to active
await c.env.DB.prepare(`
  UPDATE user_miners
  SET activation_status = 'active',
      status = 'active',           -- CRITICAL: Set runtime status
      started_at = datetime('now'),
      expires_at = datetime('now', '+' || ? || ' days'),
      activated_at = datetime('now'),
      activated_by = ?
  WHERE id = ?
`).bind(contractDays, adminEmail, minerId).run()
```

---

## 🎯 **Action Plan**

### **Immediate (Now)**:
1. ✅ Update miner #8 status to `active`
2. ✅ Manually trigger cron to calculate missing earnings
3. ✅ Verify balance updates on dashboard

### **Short-term (Today)**:
1. ✅ Set up external cron job (cron-job.org)
2. ✅ Fix admin activation code to set both status fields
3. ✅ Test with new miner purchase

### **Long-term (This Week)**:
1. ✅ Add monitoring/alerts for cron failures
2. ✅ Add admin dashboard widget showing last cron run
3. ✅ Consider Cloudflare Cron Triggers for reliability

---

## 📞 **Support Commands**

### **Quick Diagnostics**:
```bash
# Check active miners
npx wrangler d1 execute deepmine-production --remote --command="SELECT COUNT(*) as active_miners FROM user_miners WHERE status = 'active' AND datetime(expires_at) > datetime('now')"

# Check last earnings
npx wrangler d1 execute deepmine-production --remote --command="SELECT MAX(created_at) as last_run FROM earnings_history"

# Test cron endpoint
curl -X POST https://www.deepmineai.vip/api/public/calculate-earnings \
  -H "Authorization: Bearer deepmine-cron-2024"
```

---

**This document will be updated as issues are resolved.**
