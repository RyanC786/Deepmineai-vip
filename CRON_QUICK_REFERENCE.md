# ⚡ CRON QUICK REFERENCE - Daily Earnings

## ✅ SYSTEM IS WORKING!

**Test completed:** 2025-12-17 at 10:35 UTC
- ✅ User 3: Received $92 ✅
- ✅ User 5: Received $8 ✅  
- ✅ User 12: Received $16 ✅

---

## 🔧 CRON-JOB.ORG SETTINGS

Copy these exact settings:

```
Title: DeepMine Daily Earnings
URL: https://www.deepmineai.vip/api/public/calculate-earnings
Method: POST
Schedule: 0 0 * * *
Headers:
  Authorization: Bearer deepmine-cron-secret-2024
  Content-Type: application/json
Enabled: Yes
```

**Schedule Breakdown:**
- `0 0 * * *` = Every day at 00:00 UTC (midnight)
- **DO NOT** use `0 * * * *` (that's hourly)

---

## 🧪 MANUAL TEST COMMAND

```bash
curl -X POST https://www.deepmineai.vip/api/public/calculate-earnings \
  -H "Authorization: Bearer deepmine-cron-secret-2024" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{"success":true,"message":"Daily earnings calculated successfully","timestamp":"..."}
```

---

## 📊 VERIFY EARNINGS

### Check Today's Distribution
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT user_id, SUM(amount) as earned, COUNT(*) as machines 
  FROM earnings_history 
  WHERE date = date('now') 
  GROUP BY user_id
"
```

### Check User Balance
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT id, email, wallet_balance 
  FROM users 
  WHERE id IN (3, 5, 12)
"
```

---

## ⚠️ TROUBLESHOOTING

### "Unauthorized" Error
- ✅ Check header: `Authorization: Bearer deepmine-cron-secret-2024`
- ✅ Don't forget "Bearer " prefix
- ✅ Secret is case-sensitive

### "No active machines found"
- ✅ Check if machines are activated: `activation_status = 'active'`
- ✅ Check if already paid today: `last_earning_at` column
- ✅ This is normal if cron already ran

### Earnings not showing
- ✅ Check `earnings_history` table directly
- ✅ Hard refresh dashboard (Ctrl+Shift+R)
- ✅ Verify cron ran successfully in admin logs

---

## 🎯 EXPECTED DAILY EARNINGS

| User | Machines | Daily Total |
|------|----------|-------------|
| User 3 (ryan786w@gmail.com) | 4 | $92 |
| User 5 (aleenakhanak83@gmail.com) | 1 | $8 |
| User 12 (suhanulislam102594@gmail.com) | 2 | $16 |

---

## 📅 NEXT SCHEDULED RUN

**Tomorrow at 00:00 UTC** (midnight)

Convert to your timezone:
- **UTC 00:00** = Your local time
- Use: https://www.timeanddate.com/worldclock/converter.html

---

## ✅ SUCCESS CHECKLIST

After midnight UTC tomorrow:

- [ ] Cron-job.org shows successful execution
- [ ] Admin logs show "cron_daily_earnings" entry
- [ ] Each user's wallet_balance increased by expected amount
- [ ] earnings_history has EXACTLY 1 entry per machine
- [ ] No duplicate payments

---

**All set!** 🚀 The system is working perfectly. Just update your cron-job.org schedule and you're done!
