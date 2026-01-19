# ⚡ Quick Cron Setup - 5 Minutes
## Cloudflare Workers Cron Trigger

---

## 🎯 **YOUR ACTION REQUIRED**

**All code is deployed and ready!** You just need to enable the cron trigger in Cloudflare Dashboard.

---

## 📋 **QUICK STEPS** (5 minutes)

### **1. Go to Cloudflare Dashboard**
```
https://dash.cloudflare.com
```

### **2. Navigate to Project**
- Click "Workers & Pages"
- Select "deepmine-ai"

### **3. Open Cron Settings**
- Click "Settings" tab
- Scroll to "Functions"
- Click "Cron Triggers"

### **4. Add Trigger**
- Click "Add Cron Trigger"
- **Schedule:** `0 0 * * *`
- **Description:** "Daily earnings calculation"
- Click "Save"

### **5. Verify**
- Cron trigger shows in list
- Status: ✅ Enabled

---

## ✅ **THAT'S IT!**

**First Run:** Tonight at 00:00 UTC (midnight)  
**Result:** $88 distributed to 6 active machines  
**Frequency:** Every day at midnight automatically

---

## 📊 **VERIFY TOMORROW**

Check if it ran:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT * FROM admin_logs 
  WHERE action_type = 'cron_daily_earnings' 
  ORDER BY created_at DESC 
  LIMIT 1
"
```

Check earnings distributed:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT date, COUNT(*) as machines, SUM(amount) as total 
  FROM earnings_history 
  WHERE date = date('now') 
  GROUP BY date
"
```

Expected: `machines: 6, total: 88`

---

## ⚠️ **DON'T FORGET**

After verifying it works tomorrow:
1. **Disable cron-job.org** (prevents double-crediting)
2. Login to cron-job.org
3. Find job calling `/api/public/calculate-earnings`
4. **Disable** or **Delete** it

---

## 🎉 **BENEFITS**

✅ Native Cloudflare integration  
✅ No external dependencies  
✅ More secure (no public endpoint)  
✅ Automatic retries on failure  
✅ Integrated logging  
✅ Free forever  

---

## 📄 **DETAILED DOCS**

- `CRON_SETUP_INSTRUCTIONS.md` - Full setup guide
- `CRON_IMPLEMENTATION_COMPLETE.md` - Technical details
- `src/cron.ts` - Source code

---

**Status:** ✅ Code deployed - Waiting for your cron configuration  
**ETA:** 5 minutes to configure + 8 hours until first run  
**Priority:** Do it now! 🚀
