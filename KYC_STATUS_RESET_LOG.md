# KYC Status Reset Log

**Date**: 2025-12-13  
**Action**: Reset KYC approval status  
**Reason**: Users have not completed iDenfy verification  
**Performed by**: Admin

---

## Users Affected

### User ID 13 - Tofael Miah
- **Email**: islamsuhan774@gmail.com
- **Previous Status**: approved
- **New Status**: pending
- **Submission ID**: 9
- **Scan Ref**: 263e638a-d82e-11f0-b958-369d754aea88
- **Applicant ID**: null (no iDenfy verification)

### User ID 15 - Darren Marcel
- **Email**: darrenmarcel40@gmail.com
- **Previous Status**: approved
- **New Status**: pending
- **Submission ID**: 12
- **Scan Ref**: legacy-15
- **Applicant ID**: null (no iDenfy verification)

---

## Changes Applied

### Users Table
```sql
UPDATE users 
SET kyc_status = 'pending', 
    kyc_approved_at = NULL 
WHERE id IN (13, 15);
```

### KYC Submissions Table
```sql
UPDATE kyc_submissions 
SET review_status = 'pending', 
    reviewed_at = NULL, 
    rejection_reason = NULL 
WHERE user_id IN (13, 15);
```

---

## Impact on Users

### Dashboard Access
- ❌ **BLOCKED** - Users cannot access `/dashboard`
- ⚠️ **Redirect** - Will be redirected to `/kyc` page
- 📧 **Alert** - "Please complete your KYC verification before accessing the dashboard"

### KYC Page
- ✅ **ACCESSIBLE** - Users can access `/kyc` page
- 📸 **Action Required** - Must complete iDenfy verification
- 🔄 **Status** - Will show "Pending Review"

---

## What Users Need to Do

1. **Login** to their account at `/login`
2. **Navigate** to `/kyc` page (automatic redirect)
3. **Complete** iDenfy verification:
   - Upload government ID
   - Take selfie photo
   - Complete liveness check
4. **Wait** for automatic webhook update from iDenfy
5. **Admin approval** (if needed for final verification)

---

## Admin Actions Required

1. ✅ **Status Reset** - Complete
2. 📧 **Notification** - Send email to users informing them to complete KYC
3. ⏳ **Monitor** - Check iDenfy dashboard for verification completion
4. ✅ **Approve** - After verification is complete, approve in admin panel

---

## Verification Commands

Check user status:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
SELECT u.id, u.email, u.kyc_status, k.review_status, k.applicant_id 
FROM users u 
LEFT JOIN kyc_submissions k ON k.user_id = u.id 
WHERE u.id IN (13, 15)"
```

Check all pending KYC submissions:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
SELECT u.id, u.email, u.full_name, u.kyc_status, k.review_status 
FROM users u 
LEFT JOIN kyc_submissions k ON k.user_id = u.id 
WHERE k.review_status = 'pending'"
```

---

## Current KYC Statistics

After reset:
- **Pending**: 3 users (including ID 13, 15, and 1 other)
- **Approved**: 4 users
- **Total**: 7 users

---

## Technical Notes

- **Database**: Production (deepmine-production)
- **Rows Updated**: 4 (2 users, 2 submissions)
- **Transaction**: Successful
- **Rollback Available**: Yes (backup exists)

---

## Follow-up Actions

### Immediate
- [ ] Notify users via email about KYC requirement
- [ ] Monitor iDenfy dashboard for new submissions

### Within 24 hours
- [ ] Check if users have completed verification
- [ ] Follow up with users who haven't completed

### Within 48 hours
- [ ] Review and approve completed verifications
- [ ] Contact users who still haven't completed KYC

---

**Status**: ✅ COMPLETE  
**Log Created**: 2025-12-13  
**Next Review**: Check in 24 hours
