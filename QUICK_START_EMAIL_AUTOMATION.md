# Email Automation - Quick Start Guide ⚡

**Get email automation working in 30 minutes!**

---

## 🚀 **Quick Setup (3 Steps)**

### **Step 1: Database Setup** (5 minutes)

```bash
cd /home/user/webapp

# Apply migration
npx wrangler d1 migrations apply deepmine-production --remote

# Verify tables created
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%email%';"
```

**Expected output:**
- email_campaigns
- user_automation_state  
- email_templates

---

### **Step 2: Set Resend API Key** (2 minutes)

```bash
# Production
npx wrangler secret put RESEND_API_KEY --project-name deepmine-ai
# Paste your key when prompted

# Local testing (.dev.vars)
echo "RESEND_API_KEY=re_your_key_here" >> .dev.vars
```

---

### **Step 3: Enable Cron Trigger** (3 minutes)

**Cloudflare Dashboard:**
1. https://dash.cloudflare.com/
2. Workers & Pages → **deepmine-ai**
3. Settings → Triggers → **Cron Triggers**
4. Add Cron Trigger: `0 * * * *` (every hour)
5. Save

**Done!** Emails will now process every hour.

---

## 🔌 **Integration Points**

Add these **4 hooks** to trigger emails:

### **Hook 1: User Registration**

**File:** `src/routes/auth.ts`

```typescript
import { onUserRegistered } from '../hooks/email-automation-hooks'

// After user is created
const userId = result.meta.last_row_id
await onUserRegistered(c, userId, new Date().toISOString())
```

### **Hook 2: KYC Approval**

**File:** `src/routes/admin.ts` or `src/routes/admin-kyc.ts`

```typescript
import { onKycApproved } from '../hooks/email-automation-hooks'

// After KYC is approved
await onKycApproved(c, userId)
```

### **Hook 3: Deposit Approval** ⚡ **URGENT**

**File:** `src/routes/deposits.ts` or `src/routes/admin.ts`

```typescript
import { onDepositApproved } from '../hooks/email-automation-hooks'

// After deposit is approved
await onDepositApproved(c, userId)
```

### **Hook 4: First Purchase**

**File:** `src/routes/machines.ts`

```typescript
import { onFirstMachinePurchased } from '../hooks/email-automation-hooks'

// After first machine purchase
const isFirstPurchase = machineCount === 1
if (isFirstPurchase) {
  await onFirstMachinePurchased(c, userId)
}
```

---

## 📧 **Customize Email Templates**

Update templates in the database with your actual content:

```sql
-- Segment A Email 1 (2 hours after signup)
UPDATE email_templates 
SET 
  subject = 'Your subject here',
  html_content = '<html>Your HTML here</html>',
  text_content = 'Your plain text here'
WHERE template_key = 'segment_a_email_1';

-- Repeat for all 12 emails:
-- segment_a_email_1, segment_a_email_2, segment_a_email_3, segment_a_email_4
-- segment_b_email_1, segment_b_email_2, segment_b_email_3, segment_b_email_4
-- segment_c_email_1, segment_c_email_2, segment_c_email_3, segment_c_email_4
```

Run SQL via:
```bash
npx wrangler d1 execute deepmine-production --remote \
  --file=./your-template-updates.sql
```

---

## 🧪 **Test It**

### **Manual Test (No waiting!)**

```bash
# Trigger email processing now (don't wait for cron)
curl https://www.deepmineai.vip/api/cron/trigger-email-automation
```

### **Check Scheduled Emails**

```sql
-- View pending emails
SELECT 
  ec.id,
  u.email,
  ec.campaign_type,
  ec.email_sequence,
  ec.scheduled_for,
  ec.status
FROM email_campaigns ec
JOIN users u ON ec.user_id = u.id
WHERE ec.status = 'pending'
ORDER BY ec.scheduled_for ASC;
```

### **Test Flow**

1. **Register a test user**
2. **Wait 2 minutes**
3. **Trigger cron manually**: `curl .../api/cron/trigger-email-automation`
4. **Check**: Email should be sent (status = 'sent')

---

## 📊 **Monitor**

### **Email Stats**

```sql
-- Campaign performance
SELECT 
  campaign_type,
  status,
  COUNT(*) as count
FROM email_campaigns
GROUP BY campaign_type, status;

-- Recent sends
SELECT 
  u.email,
  ec.campaign_type,
  ec.email_sequence,
  ec.sent_at
FROM email_campaigns ec
JOIN users u ON ec.user_id = u.id
WHERE ec.status = 'sent'
ORDER BY ec.sent_at DESC
LIMIT 10;
```

---

## ⚠️ **Troubleshooting**

**Emails not sending?**

1. **Check Resend API key**
   ```bash
   npx wrangler secret list --project-name deepmine-ai
   ```
   Should show: `RESEND_API_KEY`

2. **Check cron is running**
   - Cloudflare Dashboard → Workers & Pages → deepmine-ai → Logs
   - Filter: "cron"

3. **Check pending emails**
   ```sql
   SELECT * FROM email_campaigns WHERE status = 'pending' LIMIT 10;
   ```

4. **Check Resend Dashboard**
   - https://resend.com/emails
   - Verify emails are being delivered

---

## 📅 **Email Timing**

| Segment | Email | Delay | Total Time |
|---------|-------|-------|------------|
| **A** (No KYC) | A1 | 2 hours | 2h |
| | A2 | +24 hours | 26h (1 day) |
| | A3 | +48 hours | 74h (3 days) |
| | A4 | +96 hours | 170h (7 days) |
| **B** (KYC, No Purchase) | B1 | Immediate | 0h |
| | B2 | +48 hours | 48h (2 days) |
| | B3 | +72 hours | 120h (5 days) |
| | B4 | +120 hours | 240h (10 days) |
| **C** (Deposit, No Machine) ⚡ | C1 | 1 hour | 1h |
| | C2 | +6 hours | 7h |
| | C3 | +24 hours | 31h (1.3 days) |
| | C4 | +48 hours | 79h (3.3 days) |

---

## ✅ **Done!**

**Your email automation is now:**
- ✅ Automatically sending emails
- ✅ Tracking user progress
- ✅ Canceling irrelevant emails
- ✅ Running every hour (free!)
- ✅ Using Resend for delivery

**Next Steps:**
1. Customize email templates
2. Monitor first few sends
3. Adjust timing if needed
4. (Optional) Add GoHighLevel integration

---

**Questions? Check the full guide:** `EMAIL_AUTOMATION_SETUP.md`
