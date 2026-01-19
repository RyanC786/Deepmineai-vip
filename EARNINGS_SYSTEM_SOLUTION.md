# 🎯 EARNINGS SYSTEM - Why Daily Earnings Show $0

**Date:** December 9, 2025
**User:** ryan786w@gmail.com (ID 3)
**Issue:** 4 active machines showing $0 daily earnings

---

## ✅ ROOT CAUSE IDENTIFIED

The daily earnings system exists and is correctly coded, but **NO AUTOMATED CRON JOB IS CONFIGURED**.

### Current State:
- ✅ Earnings calculation code exists: `/api/earnings/calculate-daily`
- ✅ ID 3 has 4 active machines (purchased Dec 8, activated Dec 8)
- ✅ Expected daily earnings: **$62/day**
  - RTX 4090 24G (East): $8/day
  - RTX 4090 24G (South): $8/day  
  - A100 48G: $18/day
  - A100 72G: $28/day
- ❌ `last_earning_at: null` (no earnings credited yet)
- ❌ `total_earned: 0`
- ❌ **NO CRON JOB or scheduler configured**

---

## 🔧 THE SOLUTION

### Option 1: Manual Earnings Calculation (IMMEDIATE)

**Admin must trigger earnings calculation manually:**

1. **Login to admin panel:**
   - URL: https://www.deepmineai.vip/admin/login
   - Use your admin credentials

2. **Open browser DevTools:**
   - Press F12 or Right-click → Inspect
   - Go to "Console" tab

3. **Run this command in console:**
   ```javascript
   fetch('/api/earnings/calculate-daily', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('token')
     }
   })
   .then(r => r.json())
   .then(data => {
     console.log('✅ Earnings calculated:', data);
     alert(`SUCCESS! Distributed $${data.total_distributed} to ${data.processed_machines} machines`);
   })
   .catch(err => {
     console.error('❌ Error:', err);
     alert('Error: ' + err.message);
   });
   ```

4. **Expected result:**
   ```json
   {
     "success": true,
     "message": "Daily earnings calculated successfully",
     "date": "2025-12-09",
     "processed_machines": 6,
     "total_distributed": 88,
     "errors": 0
   }
   ```

5. **Verify:**
   - Ryan's balance should increase by $62
   - Yana's balance should increase by $26
   - Check dashboard → "Daily Earnings" should show $62 for Ryan

---

### Option 2: Automated Cron Job (RECOMMENDED - LONG TERM)

**Use Cloudflare Workers Cron Triggers to automate daily earnings:**

#### 1. Update `wrangler.jsonc`:
```jsonc
{
  "name": "deepmine-ai",
  "main": "src/index.tsx",
  "compatibility_date": "2024-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./dist",
  
  // ADD THIS:
  "triggers": {
    "crons": ["0 0 * * *"]  // Run at midnight UTC every day
  },
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "deepmine-production",
      "database_id": "d1396742-feb6-47d4-b81c-dbe54eed7f4d"
    }
  ]
}
```

#### 2. Create `src/cron.ts`:
```typescript
import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

export async function calculateDailyEarnings(env: Bindings['DB']) {
  const today = new Date().toISOString().split('T')[0];
  console.log(`🕐 CRON: Starting daily earnings calculation for ${today}`);

  // Get all active machines that haven't expired
  const { results: activeMachines } = await env.prepare(`
    SELECT 
      um.id as miner_id,
      um.user_id,
      um.package_id,
      um.activated_at,
      um.expires_at,
      um.last_earning_at,
      mp.daily_earnings,
      mp.name as package_name,
      u.email,
      u.wallet_balance
    FROM user_miners um
    JOIN mining_packages mp ON um.package_id = mp.id
    JOIN users u ON um.user_id = u.id
    WHERE um.activation_status = 'active'
      AND datetime(um.expires_at) > datetime('now')
      AND (
        um.last_earning_at IS NULL 
        OR date(um.last_earning_at) < date('now')
      )
  `).all();

  if (!activeMachines || activeMachines.length === 0) {
    console.log('ℹ️ CRON: No active machines found');
    return { success: true, processed: 0 };
  }

  console.log(`📊 CRON: Found ${activeMachines.length} active machines`);

  let processed = 0;
  let totalEarningsDistributed = 0;

  for (const machine of activeMachines) {
    try {
      const m = machine as any;
      const earningsAmount = m.daily_earnings;

      // Add earnings to user balance
      await env.prepare(`
        UPDATE users 
        SET wallet_balance = wallet_balance + ?
        WHERE id = ?
      `).bind(earningsAmount, m.user_id).run();

      // Record in earnings history
      await env.prepare(`
        INSERT INTO earnings_history (
          user_id, 
          miner_id, 
          amount, 
          date,
          created_at
        ) VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(m.user_id, m.miner_id, earningsAmount, today).run();

      // Update last_earning_at on machine
      await env.prepare(`
        UPDATE user_miners
        SET last_earning_at = datetime('now')
        WHERE id = ?
      `).bind(m.miner_id).run();

      processed++;
      totalEarningsDistributed += earningsAmount;

      console.log(`✅ CRON: Processed machine #${m.miner_id}: $${earningsAmount} → ${m.email}`);
    } catch (error: any) {
      console.error(`❌ CRON: Error processing machine #${machine.miner_id}:`, error);
    }
  }

  // Log cron action
  await env.prepare(`
    INSERT INTO admin_logs (admin_email, action, details)
    VALUES (?, ?, ?)
  `).bind(
    'cron-system',
    'calculate_daily_earnings',
    JSON.stringify({
      date: today,
      processed_machines: processed,
      total_distributed: totalEarningsDistributed
    })
  ).run();

  console.log(`✅ CRON: Daily earnings completed - $${totalEarningsDistributed} distributed to ${processed} machines`);
  
  return {
    success: true,
    processed_machines: processed,
    total_distributed: totalEarningsDistributed,
    date: today
  };
}
```

#### 3. Update `src/index.tsx` to handle cron triggers:
```typescript
// Add this interface at the top
interface Env {
  DB: D1Database;
}

// Add this scheduled handler
export default {
  async fetch(request: Request, env: Env) {
    return app.fetch(request, env);
  },
  
  // ADD THIS CRON HANDLER:
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log('🕐 Cron trigger fired:', new Date().toISOString());
    
    try {
      const result = await calculateDailyEarnings(env.DB);
      console.log('✅ Cron job completed:', result);
    } catch (error) {
      console.error('❌ Cron job failed:', error);
    }
  }
};
```

#### 4. Deploy with cron:
```bash
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name deepmine-ai
```

---

## 📊 CURRENT MACHINE STATUS

### User ID 3 (ryan786w@gmail.com):
```
Machine ID 12: RTX 4090 24G East   → $8/day  (Active since Dec 8)
Machine ID 13: RTX 4090 24G South  → $8/day  (Active since Dec 8)
Machine ID 14: A100 48G            → $18/day (Active since Dec 8)
Machine ID 15: A100 72G            → $28/day (Active since Dec 8)
───────────────────────────────────────────────────────
TOTAL EXPECTED DAILY EARNINGS:      $62/day
ACTUAL EARNINGS RECEIVED:           $0 (cron never ran)
```

### User ID 10 (bnai48826@gmail.com):
```
Machine ID 16: RTX 4090 24G East   → $8/day  (Active since Dec 9)
Machine ID 17: A100 48G            → $18/day (Active since Dec 9)
───────────────────────────────────────────────────────
TOTAL EXPECTED DAILY EARNINGS:      $26/day
ACTUAL EARNINGS RECEIVED:           $0 (cron never ran)
```

---

## 🎯 IMMEDIATE ACTION REQUIRED

1. **RIGHT NOW:** Use Option 1 (Manual calculation) to credit earnings for Dec 9
2. **BEFORE TOMORROW:** Implement Option 2 (Cron job) for automated earnings
3. **Test:** Verify earnings appear in dashboard after manual calculation

---

## ✅ VERIFICATION STEPS

After running manual calculation:

1. **Check Ryan's balance:**
   ```sql
   SELECT wallet_balance, total_earned FROM users WHERE id = 3;
   -- Should show +$62 increase
   ```

2. **Check earnings history:**
   ```sql
   SELECT * FROM earnings_history WHERE user_id = 3 ORDER BY created_at DESC LIMIT 4;
   -- Should show 4 new earnings records for Dec 9
   ```

3. **Check machine status:**
   ```sql
   SELECT id, last_earning_at FROM user_miners WHERE user_id = 3;
   -- last_earning_at should be updated to today
   ```

---

## 🚨 CRITICAL NOTE

**Without implementing the cron job (Option 2), you will need to manually trigger earnings calculation EVERY DAY.**

This is NOT sustainable for production. Implement the cron trigger as soon as possible.

---

**Next Steps:**
1. ✅ Manual trigger earnings NOW
2. ✅ Verify balances updated
3. ✅ Implement cron job TODAY
4. ✅ Test cron job tomorrow (Dec 10)
