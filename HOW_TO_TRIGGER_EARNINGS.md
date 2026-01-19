# 🚨 HOW TO TRIGGER DAILY EARNINGS (SIMPLE GUIDE)

**Time Required:** 2 minutes  
**Users Waiting:** Ryan ($62) + Yana ($26) = $88 total

---

## 📂 STEP 1: Open the Trigger Page

**FILE LOCATION:**
```
/home/user/webapp/TRIGGER_EARNINGS.html
```

**HOW TO OPEN:**
1. Navigate to the file location above
2. **Double-click** `TRIGGER_EARNINGS.html`
3. It will open in your web browser

**OR use this command:**
```bash
open /home/user/webapp/TRIGGER_EARNINGS.html
# OR on Linux:
xdg-open /home/user/webapp/TRIGGER_EARNINGS.html
```

---

## 📝 STEP 2: Fill in Admin Credentials

The page will show:
- **Admin Email** field
- **Admin Password** field

**Enter your admin login credentials** (the same ones you use to login at https://www.deepmineai.vip/admin/panel/login)

---

## 🚀 STEP 3: Click the Big Green Button

Click: **"🚀 TRIGGER DAILY EARNINGS NOW"**

The page will:
1. ✅ Login with your admin credentials
2. ✅ Call the earnings calculation API
3. ✅ Distribute $88 to 6 machines
4. ✅ Show you a success message

---

## ✅ STEP 4: Verify Success

You should see a **GREEN SUCCESS BOX** showing:
- 📅 **Date:** 2025-12-09
- 🤖 **Machines Processed:** 6
- 💵 **Total Distributed:** $88.00

**That's it!** The earnings are now credited.

---

## 🔍 VERIFY BALANCES (Optional)

**Check Ryan's balance:**
```bash
npx wrangler d1 execute deepmine-production --remote --command="
SELECT email, wallet_balance FROM users WHERE id = 3
"
```
Should show: **$4,351.23** (was $4,289.23)

**Check Yana's balance:**
```bash
npx wrangler d1 execute deepmine-production --remote --command="
SELECT email, wallet_balance FROM users WHERE id = 10
"
```
Should show: **$208.80** (was $182.80)

---

## ⚠️ TROUBLESHOOTING

**Problem:** "Invalid admin credentials"  
**Solution:** Double-check your email and password are correct

**Problem:** "Error occurred"  
**Solution:** Check the error message, verify platform is accessible at https://www.deepmineai.vip

**Problem:** File won't open  
**Solution:** Right-click → Open With → Choose your web browser

---

## 🔔 IMPORTANT REMINDER

**TOMORROW (Dec 10):** You MUST implement the automated cron job!

See: `CRON_IMPLEMENTATION_REMINDER.md`

Without automation, you'll need to run this manual trigger EVERY DAY.

---

**File:** `/home/user/webapp/TRIGGER_EARNINGS.html`  
**Platform:** https://www.deepmineai.vip
