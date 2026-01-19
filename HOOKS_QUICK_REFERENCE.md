# 🔌 Email Automation Hooks - Quick Reference

## Status: ✅ LIVE & OPERATIONAL

**Production:** https://www.deepmineai.vip  
**Cron URL:** https://www.deepmineai.vip/api/cron/email-automation?secret=2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF  
**Schedule:** Every 1 hour via cron-job.org

---

## 🎯 4 Hooks Integrated

| # | Hook | File | Location | Trigger | Segment |
|---|------|------|----------|---------|---------|
| 1 | User Registration | `src/routes/auth.ts` | After user INSERT | User signs up | Start **Segment A** |
| 2 | KYC Approval | `src/routes/kyc.ts` | After KYC approved | KYC approved | End A → Start **Segment B** |
| 3 | Deposit Approval | `src/routes/deposits.ts` | After deposit approved | Deposit approved | End B → Start **Segment C** 🚨 |
| 4 | First Purchase | `src/routes/machines.ts` | After machine purchase | User buys machine | End all segments ✅ |

---

## 📧 Email Timeline

### Segment A: No KYC (After Registration)
- **A1:** 2 hours → "Complete your KYC"
- **A2:** 26 hours → "KYC reminder"
- **A3:** 74 hours → "Final KYC reminder"
- **A4:** 170 hours → "Re-engagement"

### Segment B: No Purchase (After KYC)
- **B1:** Immediate → "KYC approved! Make a deposit"
- **B2:** 48 hours → "Deposit reminder"
- **B3:** 120 hours → "Special offer"
- **B4:** 240 hours → "Final offer"

### Segment C: No Machine (After Deposit) 🚨 HIGHEST PRIORITY
- **C1:** 1 hour → "Select your mining machine NOW"
- **C2:** 7 hours → "Machine selection urgent"
- **C3:** 31 hours → "Final reminder"
- **C4:** 79 hours → "Refund option"

---

## 🧪 Quick Tests

```bash
# 1. Status check (public)
curl https://www.deepmineai.vip/api/cron/email-automation/status

# 2. Manual trigger (with secret)
curl "https://www.deepmineai.vip/api/cron/email-automation?secret=2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF"

# 3. Check pending emails
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT COUNT(*) FROM email_campaigns WHERE status = 'pending'"

# 4. Check sent emails (last 10)
npx wrangler d1 execute deepmine-production --remote \
  --command="SELECT * FROM email_campaigns WHERE status = 'sent' ORDER BY sent_at DESC LIMIT 10"
```

---

## 🔐 Secrets (Already Configured)

```bash
# EMAIL_CRON_SECRET
2026-fR2vGQuMscLAVsLzPmccjnsN9yGPRygF

# RESEND_API_KEY
(Set in Cloudflare)
```

---

## 📝 Update Email Templates

```sql
-- Example: Update any template
UPDATE email_templates 
SET 
  subject = 'Your Subject Here',
  html_content = '<html>Your Email HTML Here</html>',
  updated_at = CURRENT_TIMESTAMP
WHERE template_key = 'segment_a_email_1';

-- List all templates
SELECT template_key, subject FROM email_templates ORDER BY template_key;
```

**Template Keys:**
- `segment_a_email_1` to `segment_a_email_4` (No KYC)
- `segment_b_email_1` to `segment_b_email_4` (No Purchase)
- `segment_c_email_1` to `segment_c_email_4` (No Machine) 🚨

---

## ⚠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| Emails not sending | Check `RESEND_API_KEY` in Cloudflare secrets |
| 401 Unauthorized | Verify `EMAIL_CRON_SECRET` and redeploy |
| Hooks not triggering | Check console logs for `✅ Hook triggered for user X` |
| Pending emails stuck | Run manual trigger via curl |

---

## 🎯 TODO

- [ ] Customize 12 email templates
- [ ] Test full user journey
- [ ] Monitor first 24 hours
- [ ] Review sent emails for quality

---

**Last Updated:** 2026-01-15  
**Git Commit:** `50b69ff`  
**Status:** LIVE ✅
