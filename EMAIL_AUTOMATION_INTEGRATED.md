# ✅ Email Automation System - FULLY INTEGRATED

## 🎉 Status: LIVE & OPERATIONAL

**Production URL:** https://www.deepmineai.vip  
**Latest Deployment:** https://c515565d.deepmine-ai.pages.dev  
**Git Commit:** `a2f4616`  
**Date:** 2026-01-15

---

## 📊 System Architecture

```
┌─────────────────────┐
│  cron-job.org       │  ⏰ Every hour
│  (External Cron)    │
└──────────┬──────────┘
           │
           │ GET /api/cron/email-automation?secret=XXX
           ▼
┌─────────────────────────────────────────────────┐
│  Cloudflare Worker (Email Automation Service)   │
│                                                  │
│  1. Check DB for pending emails                 │
│  2. Send via Resend API                         │
│  3. Update campaign status                      │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│  D1 Database (State Management)                 │
│                                                  │
│  • email_campaigns (pending/sent/failed)        │
│  • user_automation_state (active segments)      │
│  • email_templates (12 templates)               │
└─────────────────────────────────────────────────┘
```

---

## 🔌 4 Hooks Integrated

### ✅ Hook 1: User Registration
**File:** `src/routes/auth.ts`  
**Line:** After user INSERT  
**Trigger:** User signs up  
**Action:** Start Segment A (No KYC)

```typescript
await onUserRegistered(c, userId as number, new Date())
```

**Email Flow:**
- **A1:** 2 hours after registration (No KYC yet)
- **A2:** 26 hours after registration (Still no KYC)
- **A3:** 74 hours after registration (Final reminder)
- **A4:** 170 hours after registration (Re-engagement)

---

### ✅ Hook 2: KYC Approval
**File:** `src/routes/kyc.ts`  
**Lines:** 2 locations (auto-sync and manual approval)  
**Trigger:** KYC approved  
**Action:** Cancel Segment A → Start Segment B (No Purchase)

```typescript
await onKycApproved(c, finalSubmission.user_id)
```

**Email Flow:**
- **B1:** Immediate (KYC approved)
- **B2:** 48 hours after KYC (No purchase yet)
- **B3:** 120 hours after KYC (Special offer)
- **B4:** 240 hours after KYC (Final offer)

---

### ✅ Hook 3: Deposit Approval
**File:** `src/routes/deposits.ts`  
**Lines:** 2 locations (admin approval endpoints)  
**Trigger:** Deposit approved  
**Action:** Cancel Segment B → Start Segment C (No Machine Selected) 🚨 **HIGHEST PRIORITY**

```typescript
await onDepositApproved(c, depositData.user_id)
```

**Email Flow:**
- **C1:** 1 hour after deposit (No machine yet) 🚨
- **C2:** 7 hours after deposit (Still waiting)
- **C3:** 31 hours after deposit (Urgent reminder)
- **C4:** 79 hours after deposit (Refund option)

---

### ✅ Hook 4: First Purchase
**File:** `src/routes/machines.ts`  
**Line:** After machine purchase  
**Trigger:** User purchases first machine  
**Action:** Cancel all active segments (user is fully onboarded)

```typescript
await onFirstMachinePurchased(c, user.id)
```

**Result:** User exits all automation flows ✅

---

## 📧 Email Templates (12 Total)

All stored in `email_templates` table. Update with your content:

```sql
-- Example: Update Segment A Email 1
UPDATE email_templates 
SET 
  subject = 'Welcome to DeepMine AI! Complete Your KYC to Start Mining',
  html_content = '<html>Your beautiful email here...</html>',
  updated_at = CURRENT_TIMESTAMP
WHERE template_key = 'segment_a_email_1';
```

**Template Keys:**
- `segment_a_email_1` → A1 (2h after registration)
- `segment_a_email_2` → A2 (26h after registration)
- `segment_a_email_3` → A3 (74h after registration)
- `segment_a_email_4` → A4 (170h after registration)
- `segment_b_email_1` → B1 (KYC approved)
- `segment_b_email_2` → B2 (48h after KYC)
- `segment_b_email_3` → B3 (120h after KYC)
- `segment_b_email_4` → B4 (240h after KYC)
- `segment_c_email_1` → C1 (1h after deposit) 🚨
- `segment_c_email_2` → C2 (7h after deposit)
- `segment_c_email_3` → C3 (31h after deposit)
- `segment_c_email_4` → C4 (79h after deposit)

---

## 🔐 Environment Configuration

### Cloudflare Secrets (Already Set)
```bash
# ✅ EMAIL_CRON_SECRET (set)
npx wrangler secret list --project-name deepmine-ai

# If you need to update:
npx wrangler secret put EMAIL_CRON_SECRET --project-name deepmine-ai
# Paste: 2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF

npx wrangler secret put RESEND_API_KEY --project-name deepmine-ai
# Paste: re_XXX (your Resend API key)
```

### cron-job.org Configuration (Already Set)
- **URL:** `https://www.deepmineai.vip/api/cron/email-automation?secret=2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF`
- **Schedule:** Every 1 hour (`0 * * * *`)
- **Method:** GET
- **Timeout:** 30 seconds

---

## 🧪 Testing

### 1. Test Endpoints
```bash
# Status check (public)
curl https://www.deepmineai.vip/api/cron/email-automation/status

# Manual trigger (requires secret)
curl "https://www.deepmineai.vip/api/cron/email-automation?secret=2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF"

# Test endpoint (requires secret)
curl "https://www.deepmineai.vip/api/cron/email-automation/test?secret=2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF"
```

### 2. Database Monitoring
```bash
# Check pending emails
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM email_campaigns WHERE status = 'pending' ORDER BY scheduled_send_at"

# Check sent emails (last 10)
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM email_campaigns WHERE status = 'sent' ORDER BY sent_at DESC LIMIT 10"

# Check active automation users
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM user_automation_state WHERE is_active = 1"
```

### 3. Full User Journey Test
```bash
# Step 1: Register a test user
curl -X POST https://www.deepmineai.vip/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "fullName": "Test User"
  }'

# Step 2: Check if Segment A started
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM email_campaigns WHERE user_id = (SELECT id FROM users WHERE email = 'test@example.com')"

# Step 3: Wait for cron to run (or trigger manually)
curl "https://www.deepmineai.vip/api/cron/email-automation?secret=2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF"

# Step 4: Verify email sent
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM email_campaigns WHERE status = 'sent' ORDER BY sent_at DESC LIMIT 1"
```

---

## 📈 Email Campaign Timeline

| Segment | Email | Trigger | Delay | Action |
|---------|-------|---------|-------|--------|
| **A** | A1 | User registers | 2 hours | No KYC reminder |
| **A** | A2 | Still no KYC | 26 hours | KYC importance |
| **A** | A3 | Still no KYC | 74 hours | Final KYC reminder |
| **A** | A4 | Still no KYC | 170 hours | Re-engagement |
| **B** | B1 | KYC approved | 0 hours | Congrats + Deposit |
| **B** | B2 | No purchase | 48 hours | Purchase reminder |
| **B** | B3 | No purchase | 120 hours | Special offer |
| **B** | B4 | No purchase | 240 hours | Final offer |
| **C** | C1 | Deposit approved | 1 hour | 🚨 Select machine NOW |
| **C** | C2 | No machine | 7 hours | Machine selection urgent |
| **C** | C3 | No machine | 31 hours | Final machine reminder |
| **C** | C4 | No machine | 79 hours | Refund option |

---

## 🔍 Troubleshooting

### Issue: Emails not sending
**Check:**
1. Resend API key configured: `npx wrangler secret list --project-name deepmine-ai`
2. Cron job running: Check execution history at cron-job.org
3. Pending campaigns: `SELECT * FROM email_campaigns WHERE status = 'pending'`

### Issue: 401 Unauthorized on cron endpoint
**Fix:**
1. Verify secret in Cloudflare: `EMAIL_CRON_SECRET = 2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF`
2. Redeploy: `npx wrangler pages deploy dist --project-name deepmine-ai`
3. Test: `curl "https://www.deepmineai.vip/api/cron/email-automation?secret=2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF"`

### Issue: Hooks not triggering
**Check:**
1. Look for console logs: `✅ User registration hook triggered for user X`
2. Check database: `SELECT * FROM user_automation_state WHERE user_id = X`
3. Verify hooks are called after DB operations (not before)

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Limit |
|---------|------|------|-------|
| **cron-job.org** | Free | $0/month | Unlimited |
| **Cloudflare Pages** | Free | $0/month | 100k requests/day |
| **Cloudflare D1** | Free | $0/month | 5 GB storage, 5M reads/day |
| **Resend** | Free | $0/month | 3,000 emails/month |
| **Resend** | Paid | $20/month | 100,000 emails/month |

**Total Cost:** $0-20/month (depending on email volume)

---

## 📚 Documentation Files

1. **EMAIL_AUTOMATION_SETUP.md** - Technical architecture
2. **QUICK_START_EMAIL_AUTOMATION.md** - Quick start guide
3. **EMAIL_AUTOMATION_CRON_JOB_ORG.md** - cron-job.org setup
4. **EMAIL_AUTOMATION_INTEGRATED.md** - This file (integration summary)

---

## ✅ Integration Checklist

- [x] Database migration applied (3 tables created)
- [x] Email templates seeded (12 templates)
- [x] Resend API key configured
- [x] Cron secret configured
- [x] cron-job.org scheduled (every hour)
- [x] Hook 1: User Registration integrated
- [x] Hook 2: KYC Approval integrated (2 locations)
- [x] Hook 3: Deposit Approval integrated (2 locations)
- [x] Hook 4: First Purchase integrated
- [x] Built and deployed to production
- [ ] **TODO:** Customize 12 email templates with real content
- [ ] **TODO:** Test full user journey (register → KYC → deposit → purchase)
- [ ] **TODO:** Monitor first 24 hours of real user emails

---

## 🚀 Next Steps

### 1. Update Email Templates (Priority)
Use the SQL commands above to update all 12 templates with your actual email content.

### 2. Test with Real Users
Monitor the first few automated emails to ensure they're working correctly:
```bash
# Watch for sent emails
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM email_campaigns WHERE status = 'sent' ORDER BY sent_at DESC LIMIT 20"
```

### 3. Monitor Performance
Check cron-job.org execution history daily for the first week.

### 4. Optional: Add More Segments
The system is extensible. You can add more email sequences by:
1. Adding new templates to `email_templates`
2. Creating new segments in `user_automation_state`
3. Updating `src/services/email-automation.ts` logic

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs: `pm2 logs deepmine-ai --nostream` (local)
3. Check Cloudflare dashboard for deployment errors
4. Review execution history at cron-job.org

---

## 🎉 Summary

**Your email automation system is LIVE and fully integrated!**

✅ 4 hooks monitoring user journey  
✅ Hourly cron checking for pending emails  
✅ Database tracking automation state  
✅ Fail-safe error handling (hooks don't break main flow)  
✅ 12 email templates ready to customize  
✅ Production deployment complete  

**Next action:** Customize your 12 email templates and monitor the first automated emails! 🚀

---

**Last Updated:** 2026-01-15  
**Git Commit:** `a2f4616`  
**Deployed At:** https://c515565d.deepmine-ai.pages.dev  
**Production URL:** https://www.deepmineai.vip
