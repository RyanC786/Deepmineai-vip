# Email Automation System - Complete Setup Guide 📧

**Status**: ✅ Ready to Deploy  
**Date**: January 15, 2026

---

## 🎯 **System Overview**

**Automated email campaigns based on user behavior:**

### **Segment A: No KYC** (New signups who haven't started KYC)
- **Trigger**: User signs up
- **Goal**: Get them to complete KYC
- **Emails**: A1, A2, A3, A4 over 170 hours (7 days)

### **Segment B: KYC Done, No Purchase** (KYC approved but no machines)
- **Trigger**: KYC approved
- **Goal**: Get them to make first purchase
- **Emails**: B1, B2, B3, B4 over 240 hours (10 days)

### **Segment C: Deposit Made, No Machine** ⚡ **HIGHEST PRIORITY**
- **Trigger**: Deposit approved
- **Goal**: Get them to select a mining machine
- **Emails**: C1, C2, C3, C4 over 79 hours (3.3 days)

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Events (Triggers)                      │
├─────────────────────────────────────────────────────────────────┤
│  • User Registers → Segment A                                   │
│  • KYC Approved → Segment B (cancels Segment A)                 │
│  • Deposit Approved → Segment C (cancels Segment B) URGENT      │
│  • First Purchase → Complete (stops all campaigns)              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            Email Automation Service (TypeScript)                 │
├─────────────────────────────────────────────────────────────────┤
│  • Schedules emails based on delays                             │
│  • Checks user qualification before sending                     │
│  • Cancels emails when user progresses                          │
│  • Handles opt-outs and preferences                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Cloudflare Workers Cron (Hourly)                    │
├─────────────────────────────────────────────────────────────────┤
│  • Runs every hour: "0 * * * *"                                 │
│  • Fetches pending emails from D1 database                      │
│  • Sends via Resend API                                         │
│  • Updates email status and user state                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Resend API (Email Delivery)                    │
├─────────────────────────────────────────────────────────────────┤
│  • Delivers emails                                              │
│  • Tracks opens/clicks (optional webhooks)                      │
│  • Handles bounces/spam complaints                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│               D1 Database (State & History)                      │
├─────────────────────────────────────────────────────────────────┤
│  • user_automation_state: Current segment state                 │
│  • email_campaigns: Scheduled/sent email history                │
│  • email_templates: HTML/text templates                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 **Step-by-Step Setup**

### **Step 1: Apply Database Migration** ✅

```bash
cd /home/user/webapp

# Apply migration to local DB (for testing)
npx wrangler d1 migrations apply deepmine-production --local

# Apply migration to production DB
npx wrangler d1 migrations apply deepmine-production --remote
```

**What this creates:**
- ✅ `email_campaigns` table
- ✅ `user_automation_state` table
- ✅ `email_templates` table
- ✅ Sample template rows (you'll customize these)

---

### **Step 2: Configure Resend API Key** 🔑

**Option A: Production Secret (Recommended)**
```bash
# Set RESEND_API_KEY as a secret
npx wrangler secret put RESEND_API_KEY --project-name deepmine-ai

# When prompted, paste your Resend API key
# (Get from: https://resend.com/api-keys)
```

**Option B: Local Development (.dev.vars)**
```bash
# Create .dev.vars file (for local testing)
echo "RESEND_API_KEY=re_your_api_key_here" > .dev.vars
```

---

### **Step 3: Set Up Cloudflare Workers Cron** ⏰

**Option A: Cloudflare Dashboard (Easiest)**
1. Go to: https://dash.cloudflare.com/
2. Select your account → **Workers & Pages**
3. Click your project (**deepmine-ai**)
4. Go to **Settings** → **Triggers** → **Cron Triggers**
5. Click **Add Cron Trigger**
6. Enter cron schedule: `0 * * * *` (every hour)
7. Click **Save**

**Option B: Wrangler CLI**
```bash
# NOTE: Cron triggers for Pages projects must be set via Dashboard
# This is a Cloudflare limitation - CLI doesn't support it yet
```

**Cron Schedule Options:**
- `0 * * * *` - Every hour (recommended)
- `*/30 * * * *` - Every 30 minutes
- `*/15 * * * *` - Every 15 minutes (if you want faster response)

---

### **Step 4: Integrate Hooks into Your Routes** 🔗

**A. User Registration** (`src/routes/auth.ts`)

```typescript
import { onUserRegistered } from '../hooks/email-automation-hooks'

// In your registration endpoint
auth.post('/register', async (c) => {
  // ... existing registration code ...
  
  const result = await c.env.DB.prepare(`
    INSERT INTO users (email, password_hash, full_name, referral_code, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(email, hashedPassword, fullName, referralCode, createdAt).run()

  const userId = result.meta.last_row_id

  // ✅ Trigger Segment A email automation
  await onUserRegistered(c, userId, createdAt)

  return c.json({ success: true, user: { id: userId, email } })
})
```

**B. KYC Approval** (`src/routes/admin-kyc.ts` or wherever KYC is approved)

```typescript
import { onKycApproved } from '../hooks/email-automation-hooks'

// In your KYC approval endpoint
router.post('/admin/kyc/approve/:userId', async (c) => {
  const userId = parseInt(c.req.param('userId'))

  // ... existing KYC approval code ...
  
  await c.env.DB.prepare(`
    UPDATE users 
    SET kyc_status = 'approved', kyc_approved_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(userId).run()

  // ✅ Trigger Segment B email automation
  await onKycApproved(c, userId)

  return c.json({ success: true })
})
```

**C. Deposit Approval** (`src/routes/deposits.ts` or `src/routes/admin.ts`)

```typescript
import { onDepositApproved } from '../hooks/email-automation-hooks'

// In your deposit approval endpoint
router.post('/admin/deposits/approve/:id', async (c) => {
  const depositId = parseInt(c.req.param('id'))

  // ... existing deposit approval code ...
  
  // Get user ID from deposit
  const deposit = await c.env.DB.prepare(`
    SELECT user_id FROM deposits WHERE id = ?
  `).bind(depositId).first()

  await c.env.DB.prepare(`
    UPDATE deposits 
    SET status = 'approved', approved_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(depositId).run()

  // ✅ Trigger Segment C email automation (HIGHEST PRIORITY)
  await onDepositApproved(c, deposit.user_id)

  return c.json({ success: true })
})
```

**D. First Machine Purchase** (`src/routes/machines.ts`)

```typescript
import { onFirstMachinePurchased } from '../hooks/email-automation-hooks'

// In your machine purchase endpoint
router.post('/api/machines/purchase', async (c) => {
  const userId = c.get('userId')

  // ... existing purchase code ...

  // Check if this is first purchase
  const { results } = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM mining_packages WHERE user_id = ?
  `).bind(userId).all()

  const isFirstPurchase = results[0].count === 1

  if (isFirstPurchase) {
    // ✅ Complete email automation
    await onFirstMachinePurchased(c, userId)
  }

  return c.json({ success: true })
})
```

---

### **Step 5: Create Email Templates** ✉️

You mentioned you already have emails created. Now add them to the database:

```sql
-- Update Segment A Email 1
UPDATE email_templates 
SET 
  subject = '⚡ Complete Your KYC to Start Mining Today!',
  html_content = '<YOUR_HTML_CONTENT_HERE>',
  text_content = 'YOUR_TEXT_VERSION_HERE'
WHERE template_key = 'segment_a_email_1';

-- Update Segment A Email 2
UPDATE email_templates 
SET 
  subject = '🎯 Still Here? Let's Get You Started',
  html_content = '<YOUR_HTML_CONTENT_HERE>',
  text_content = 'YOUR_TEXT_VERSION_HERE'
WHERE template_key = 'segment_a_email_2';

-- ... repeat for all 12 emails (A1-A4, B1-B4, C1-C4)
```

**Template Variables:**
- `{{full_name}}` - User's full name
- `{{email}}` - User's email

---

### **Step 6: Add Manual Trigger Endpoint** (for testing) 🔧

Add this to your `src/index.tsx`:

```typescript
import { triggerEmailAutomationManually } from './cron-handler'

// Manual trigger for testing
app.get('/api/cron/trigger-email-automation', async (c) => {
  // Optional: Add authentication here
  const result = await triggerEmailAutomationManually(c.env)
  return c.json(result)
})
```

**Test it:**
```bash
curl https://www.deepmineai.vip/api/cron/trigger-email-automation
```

---

## 🚀 **Deployment**

```bash
cd /home/user/webapp

# 1. Install dependencies (if needed)
npm install resend

# 2. Apply migrations
npx wrangler d1 migrations apply deepmine-production --remote

# 3. Set Resend API key
npx wrangler secret put RESEND_API_KEY --project-name deepmine-ai

# 4. Build
npm run build

# 5. Deploy
npx wrangler pages deploy dist --project-name deepmine-ai

# 6. Set up cron trigger in Cloudflare Dashboard
# Go to: Dashboard → Workers & Pages → deepmine-ai → Settings → Triggers → Cron Triggers
# Add: "0 * * * *" (every hour)
```

---

## 🧪 **Testing**

### **Test 1: Manual Trigger**
```bash
# Trigger email processing manually
curl https://www.deepmineai.vip/api/cron/trigger-email-automation
```

### **Test 2: Create Test User**
```bash
# 1. Register a new user
# 2. Check database:
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM user_automation_state WHERE user_id = <user_id>;"

# 3. Check scheduled emails:
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM email_campaigns WHERE user_id = <user_id>;"
```

### **Test 3: Verify Cron is Running**
```bash
# Check Cloudflare Dashboard:
# Workers & Pages → deepmine-ai → Logs
# Filter by "cron" to see scheduled executions
```

---

## 📊 **Monitoring & Analytics**

### **Track Email Performance**

```sql
-- Overall campaign stats
SELECT 
  campaign_type,
  status,
  COUNT(*) as count
FROM email_campaigns
GROUP BY campaign_type, status;

-- Recent sends
SELECT 
  ec.*,
  u.email,
  u.full_name
FROM email_campaigns ec
JOIN users u ON ec.user_id = u.id
WHERE ec.status = 'sent'
ORDER BY ec.sent_at DESC
LIMIT 20;

-- Failed emails
SELECT * FROM email_campaigns 
WHERE status = 'failed' 
ORDER BY created_at DESC;

-- Active automation users
SELECT 
  u.id,
  u.email,
  uas.segment_a_active,
  uas.segment_b_active,
  uas.segment_c_active,
  uas.segment_a_last_email,
  uas.segment_b_last_email,
  uas.segment_c_last_email
FROM user_automation_state uas
JOIN users u ON uas.user_id = u.id
WHERE uas.segment_a_active = 1 
   OR uas.segment_b_active = 1 
   OR uas.segment_c_active = 1;
```

---

## 🔄 **GoHighLevel Integration (Optional)**

If you want to sync data to GoHighLevel for CRM visibility:

### **Option 1: Webhook to GHL**
```typescript
// After sending email, sync to GHL
async function syncToGoHighLevel(email: any) {
  const ghlWebhookUrl = 'https://services.leadconnectorhq.com/hooks/...'
  
  await fetch(ghlWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.email,
      tags: [email.campaign_type, email.email_sequence],
      custom_fields: {
        last_email_sent: email.email_sequence,
        last_email_date: email.sent_at,
      },
    }),
  })
}
```

### **Option 2: GHL Workflow Triggers**
- Set up a webhook in GHL to receive events
- Send webhook from Cloudflare when:
  - User registers
  - KYC approved
  - Deposit made
  - Machine purchased
- Use GHL workflows for additional automation

---

## 📞 **Support & Troubleshooting**

### **Common Issues:**

**1. Emails not sending**
- Check Resend API key is set: `npx wrangler secret list --project-name deepmine-ai`
- Check cron is running: Cloudflare Dashboard → Logs
- Check pending emails: `SELECT * FROM email_campaigns WHERE status = 'pending';`

**2. Duplicate emails**
- Check for duplicate cron triggers in Dashboard
- Check user_automation_state for incorrect active flags

**3. Emails sent but not received**
- Check Resend Dashboard: https://resend.com/emails
- Check spam folder
- Verify email template is valid HTML

---

## ✅ **Checklist**

Before going live:

- [ ] Database migration applied
- [ ] Resend API key configured
- [ ] Cron trigger set up (hourly)
- [ ] Hooks integrated into:
  - [ ] Registration endpoint
  - [ ] KYC approval endpoint
  - [ ] Deposit approval endpoint
  - [ ] Machine purchase endpoint
- [ ] Email templates customized (12 templates)
- [ ] Manual trigger tested
- [ ] Test user flow verified
- [ ] Monitoring queries ready
- [ ] (Optional) GoHighLevel integration

---

## 🎯 **Summary**

**What This System Does:**
1. ✅ Automatically sends emails based on user behavior
2. ✅ Tracks user progress through segments (A → B → C)
3. ✅ Cancels irrelevant emails when user progresses
4. ✅ Respects opt-outs and preferences
5. ✅ Stores complete email history
6. ✅ Runs hourly via Cloudflare Cron (free!)
7. ✅ Uses Resend API for reliable delivery

**Cost:**
- Cloudflare Cron: **FREE** (included in Workers)
- D1 Database: **FREE** (first 5GB)
- Resend: **$20/month** (100k emails) or **FREE** tier (3k/month)

**Maintenance:**
- Low: Runs automatically
- Just monitor failed emails occasionally
- Update templates as needed

---

**Ready to deploy? Let me know if you need help with any step!** 🚀
