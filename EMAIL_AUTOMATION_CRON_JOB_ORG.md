# Email Automation with cron-job.org - Setup Guide 📧

**Updated**: January 15, 2026  
**Method**: cron-job.org (External HTTP Cron)

---

## 🎯 **Why cron-job.org?**

Cloudflare Pages **doesn't support Cron Triggers** (only Workers do). Since you're already using cron-job.org successfully for daily earnings, we'll use the same approach for email automation!

**Advantages:**
- ✅ Already working for your project
- ✅ Simple HTTP endpoint
- ✅ Flexible scheduling (hourly, 30 min, etc.)
- ✅ Reliable external trigger
- ✅ No Cloudflare limitations

---

## 🚀 **Quick Setup (4 Steps)**

### **Step 1: Database Setup** (5 minutes)

```bash
cd /home/user/webapp

# Apply migration to production
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

### **Step 2: Set Secrets** (3 minutes)

```bash
# Set Resend API key
npx wrangler secret put RESEND_API_KEY --project-name deepmine-ai
# Paste your Resend API key when prompted

# Set email cron secret (for security)
npx wrangler secret put EMAIL_CRON_SECRET --project-name deepmine-ai
# Paste a random secret key (e.g., "deepmine-email-cron-2026-xyz123")
```

**Generate a random secret:**
```bash
# On Mac/Linux
openssl rand -hex 32

# Or use any random string
echo "deepmine-email-cron-$(date +%s)-$RANDOM"
```

---

### **Step 3: Deploy** (2 minutes)

```bash
cd /home/user/webapp

# Build and deploy
npm run build
npx wrangler pages deploy dist --project-name deepmine-ai
```

---

### **Step 4: Setup cron-job.org** (5 minutes)

1. **Go to**: https://console.cron-job.org/

2. **Create New Cron Job**:
   - **Title**: DeepMine AI - Email Automation
   - **URL**: `https://www.deepmineai.vip/api/cron/email-automation?secret=YOUR_SECRET_KEY`
     - Replace `YOUR_SECRET_KEY` with the secret you set in Step 2
   - **Schedule**: `Every 1 hour` or `0 * * * *` (cron expression)
   - **Method**: `GET`
   - **Enabled**: ✅ Yes

3. **Save** the cron job

4. **Test it**: Click "Execute now" to test

---

## 🔌 **Integration Hooks**

Add these 4 hooks to trigger emails automatically:

### **Hook 1: User Registration** (`src/routes/auth.ts`)

Find your registration endpoint and add:

```typescript
import { onUserRegistered } from '../hooks/email-automation-hooks'

// After user is created
const userId = result.meta.last_row_id
const createdAt = new Date().toISOString()

// Trigger Segment A email automation
await onUserRegistered(c, userId, createdAt)
```

### **Hook 2: KYC Approval** (`src/routes/admin.ts` or wherever KYC is approved)

```typescript
import { onKycApproved } from '../hooks/email-automation-hooks'

// After KYC is approved
await c.env.DB.prepare(`
  UPDATE users 
  SET kyc_status = 'approved', kyc_approved_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).bind(userId).run()

// Trigger Segment B email automation
await onKycApproved(c, userId)
```

### **Hook 3: Deposit Approval** ⚡ **HIGHEST PRIORITY**

(`src/routes/deposits.ts` or `src/routes/admin.ts`)

```typescript
import { onDepositApproved } from '../hooks/email-automation-hooks'

// After deposit is approved
await c.env.DB.prepare(`
  UPDATE deposits 
  SET status = 'approved', approved_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).bind(depositId).run()

// Get user ID
const deposit = await c.env.DB.prepare(`
  SELECT user_id FROM deposits WHERE id = ?
`).bind(depositId).first()

// Trigger Segment C email automation (URGENT)
await onDepositApproved(c, deposit.user_id)
```

### **Hook 4: First Machine Purchase** (`src/routes/machines.ts`)

```typescript
import { onFirstMachinePurchased } from '../hooks/email-automation-hooks'

// After machine purchase
const userId = c.get('userId')

// Check if this is first purchase
const { results } = await c.env.DB.prepare(`
  SELECT COUNT(*) as count FROM mining_packages WHERE user_id = ?
`).bind(userId).all()

const isFirstPurchase = results[0].count === 1

if (isFirstPurchase) {
  // Complete email automation
  await onFirstMachinePurchased(c, userId)
}
```

---

## 📧 **Customize Email Templates**

Update templates in the database with your actual email content:

```sql
-- Segment A Email 1 (2 hours after signup)
UPDATE email_templates 
SET 
  subject = '⚡ Complete Your KYC to Start Mining Today!',
  from_name = 'DeepMine AI Team',
  from_email = 'support@deepmineai.vip',
  html_content = '<html>YOUR_HTML_HERE</html>',
  text_content = 'YOUR_PLAIN_TEXT_HERE'
WHERE template_key = 'segment_a_email_1';

-- Repeat for all 12 emails:
-- segment_a_email_1, segment_a_email_2, segment_a_email_3, segment_a_email_4
-- segment_b_email_1, segment_b_email_2, segment_b_email_3, segment_b_email_4
-- segment_c_email_1, segment_c_email_2, segment_c_email_3, segment_c_email_4
```

**Template Variables:**
- `{{full_name}}` - User's full name
- `{{email}}` - User's email address

**Run SQL:**
```bash
npx wrangler d1 execute deepmine-production --remote \
  --file=./email-templates-update.sql
```

---

## 🧪 **Testing**

### **Test 1: Check Status**

```bash
curl https://www.deepmineai.vip/api/cron/email-automation/status
```

**Expected response:**
```json
{
  "success": true,
  "status": {
    "pending_emails": 0,
    "sent_last_24h": 0,
    "failed_last_24h": 0,
    "active_automation_users": 0,
    "resend_configured": true
  },
  "timestamp": "2026-01-15T10:00:00.000Z"
}
```

### **Test 2: Manual Trigger (No Secret Required)**

```bash
curl https://www.deepmineai.vip/api/cron/email-automation/test
```

### **Test 3: Full Cron Test (With Secret)**

```bash
curl "https://www.deepmineai.vip/api/cron/email-automation?secret=YOUR_SECRET_KEY"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Email automation processed successfully",
  "duration_ms": 150,
  "timestamp": "2026-01-15T10:00:00.000Z"
}
```

### **Test 4: Full User Flow**

1. **Register a test user**
2. **Check automation state**:
   ```sql
   SELECT * FROM user_automation_state WHERE user_id = <user_id>;
   ```
3. **Check scheduled emails**:
   ```sql
   SELECT * FROM email_campaigns WHERE user_id = <user_id>;
   ```
4. **Wait 2 hours** (or change schedule in DB for testing)
5. **Trigger cron**: Click "Execute now" in cron-job.org
6. **Check email sent**:
   ```sql
   SELECT * FROM email_campaigns WHERE user_id = <user_id> AND status = 'sent';
   ```

---

## 📊 **Monitoring**

### **Check Pending Emails**

```sql
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

### **Check Sent Emails (Last 24 hours)**

```sql
SELECT 
  u.email,
  ec.campaign_type,
  ec.email_sequence,
  ec.sent_at,
  ec.resend_email_id
FROM email_campaigns ec
JOIN users u ON ec.user_id = u.id
WHERE ec.status = 'sent'
  AND ec.sent_at >= datetime('now', '-24 hours')
ORDER BY ec.sent_at DESC;
```

### **Check Failed Emails**

```sql
SELECT 
  u.email,
  ec.campaign_type,
  ec.email_sequence,
  ec.error_message,
  ec.updated_at
FROM email_campaigns ec
JOIN users u ON ec.user_id = u.id
WHERE ec.status = 'failed'
ORDER BY ec.updated_at DESC
LIMIT 20;
```

### **Active Automation Users**

```sql
SELECT 
  u.id,
  u.email,
  u.full_name,
  CASE 
    WHEN uas.segment_c_active = 1 THEN 'Segment C (Deposit, No Machine)' 
    WHEN uas.segment_b_active = 1 THEN 'Segment B (KYC, No Purchase)'
    WHEN uas.segment_a_active = 1 THEN 'Segment A (No KYC)'
  END as current_segment,
  uas.segment_a_last_email,
  uas.segment_b_last_email,
  uas.segment_c_last_email
FROM user_automation_state uas
JOIN users u ON uas.user_id = u.id
WHERE uas.segment_a_active = 1 
   OR uas.segment_b_active = 1 
   OR uas.segment_c_active = 1
ORDER BY 
  uas.segment_c_active DESC,
  uas.segment_b_active DESC,
  uas.segment_a_active DESC;
```

---

## 📅 **Email Timing Reference**

| Segment | Email | Delay from Previous | Total Time from Trigger |
|---------|-------|---------------------|-------------------------|
| **A** (No KYC) | A1 | Trigger | 2 hours |
| | A2 | +24 hours | 26 hours (1.1 days) |
| | A3 | +48 hours | 74 hours (3.1 days) |
| | A4 | +96 hours | 170 hours (7.1 days) |
| **B** (KYC, No Purchase) | B1 | Trigger | Immediate |
| | B2 | +48 hours | 48 hours (2 days) |
| | B3 | +72 hours | 120 hours (5 days) |
| | B4 | +120 hours | 240 hours (10 days) |
| **C** (Deposit, No Machine) ⚡ | C1 | Trigger | 1 hour |
| | C2 | +6 hours | 7 hours |
| | C3 | +24 hours | 31 hours (1.3 days) |
| | C4 | +48 hours | 79 hours (3.3 days) |

---

## ⚠️ **Troubleshooting**

### **Problem: Emails not sending**

**Check 1: Verify cron-job.org is running**
- Go to https://console.cron-job.org/
- Check "Execution history"
- Should show successful executions every hour

**Check 2: Test endpoint manually**
```bash
curl "https://www.deepmineai.vip/api/cron/email-automation?secret=YOUR_SECRET"
```

**Check 3: Verify secrets**
```bash
npx wrangler secret list --project-name deepmine-ai
```
Should show:
- `RESEND_API_KEY`
- `EMAIL_CRON_SECRET`

**Check 4: Check Resend dashboard**
- https://resend.com/emails
- Verify emails are being sent

### **Problem: 401 Unauthorized**

**Solution**: Secret key mismatch
- Check the secret in cron-job.org URL matches `EMAIL_CRON_SECRET`
- Re-set secret if needed:
  ```bash
  npx wrangler secret put EMAIL_CRON_SECRET --project-name deepmine-ai
  ```

### **Problem: 500 Internal Server Error**

**Check logs in Cloudflare:**
1. Go to: https://dash.cloudflare.com/
2. Workers & Pages → deepmine-ai
3. Logs → Real-time logs
4. Look for errors when cron runs

---

## 🎯 **cron-job.org Configuration Summary**

**URL**: `https://www.deepmineai.vip/api/cron/email-automation?secret=YOUR_SECRET_KEY`

**Schedule Options:**
- **Hourly**: `0 * * * *` or "Every 1 hour"
- **Every 30 min**: `*/30 * * * *` or "Every 30 minutes"
- **Every 2 hours**: `0 */2 * * *` or "Every 2 hours"

**Recommended**: Start with hourly, adjust based on email volume.

---

## 📈 **Scaling**

**Current Setup:**
- Hourly checks
- ~50 emails processed per run (configurable in code)
- Free Resend tier: 3,000 emails/month

**If You Need More:**
- **More frequent checks**: Change cron-job.org to every 30 minutes
- **More emails per run**: Increase `LIMIT 50` in `email-automation.ts`
- **Upgrade Resend**: $20/month for 100,000 emails

---

## ✅ **Deployment Checklist**

Before going live:

- [ ] Database migration applied (`Step 1`)
- [ ] Resend API key set (`Step 2`)
- [ ] Email cron secret set (`Step 2`)
- [ ] Application deployed (`Step 3`)
- [ ] cron-job.org configured (`Step 4`)
- [ ] cron-job.org tested (Execute now)
- [ ] Status endpoint tested
- [ ] Hooks integrated:
  - [ ] User registration
  - [ ] KYC approval
  - [ ] Deposit approval
  - [ ] Machine purchase
- [ ] Email templates customized (12 templates)
- [ ] Test user flow completed

---

## 📝 **Quick Reference**

### **Endpoints**

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `GET /api/cron/email-automation?secret=XXX` | Main cron endpoint | Secret key |
| `GET /api/cron/email-automation/test` | Manual test trigger | None |
| `GET /api/cron/email-automation/status` | Health check | None |

### **Environment Variables**

| Variable | Purpose | Set via |
|----------|---------|---------|
| `RESEND_API_KEY` | Resend API authentication | `wrangler secret put` |
| `EMAIL_CRON_SECRET` | Cron endpoint security | `wrangler secret put` |

### **Database Tables**

| Table | Purpose |
|-------|---------|
| `email_campaigns` | Scheduled/sent email history |
| `user_automation_state` | Current automation state per user |
| `email_templates` | Email content templates (12 templates) |

---

## 🎉 **Summary**

**What You Get:**
- ✅ Automated email campaigns (Segments A, B, C)
- ✅ Triggered by user behavior (signup, KYC, deposit, purchase)
- ✅ Reliable external cron (cron-job.org)
- ✅ Full email history and analytics
- ✅ Opt-out support
- ✅ Template system

**Cost:**
- cron-job.org: **FREE**
- Cloudflare: **FREE**
- Resend: **FREE** (3k emails/month) or **$20/month** (100k emails)

**Maintenance:**
- Setup once, runs automatically
- Monitor via SQL queries or Resend dashboard
- Update email templates as needed

---

**Ready to deploy? Follow the 4 steps above and you'll be sending automated emails within 20 minutes!** 🚀
