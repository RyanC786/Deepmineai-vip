# 🔄 iDenfy Auto-Sync Setup Guide

## Overview
The iDenfy Auto-Sync system automatically checks pending KYC submissions every 5 minutes and syncs approval/rejection status from the iDenfy platform to the DeepMine database.

## ✅ What's Already Done

### 1. Auto-Sync Endpoint
**Endpoint**: `POST /api/kyc/auto-sync`
**Location**: `src/routes/kyc-auto-sync.ts`

**Features**:
- ✅ Automatically checks all pending/reviewing KYC submissions
- ✅ Fetches current status from iDenfy API
- ✅ Updates database (kyc_submissions + users tables)
- ✅ Sends approval emails via Resend
- ✅ Protected with X-Cron-Secret header
- ✅ Returns sync statistics (synced, approved, rejected, errors)

### 2. Status Monitoring Endpoint
**Endpoint**: `GET /api/kyc/auto-sync/status`
**Purpose**: Monitor how many submissions need syncing

## 🔧 Setup Instructions

### Step 1: Set CRON_SECRET on Cloudflare

1. **Generate Secret** (already done):
   ```
   CRON_SECRET=DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=
   ```

2. **Set on Cloudflare Pages**:
   ```bash
   # Method A: Via CLI (manual input required)
   npx wrangler pages secret put CRON_SECRET --project-name deepmine-ai
   # Then paste: DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=
   
   # Method B: Via Cloudflare Dashboard
   # 1. Go to: https://dash.cloudflare.com
   # 2. Workers & Pages > deepmine-ai > Settings > Environment variables
   # 3. Add variable: CRON_SECRET = DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=
   ```

### Step 2: Configure cron-job.org

1. **Go to**: https://console.cron-job.org
2. **Create New Cron Job**:
   - **Title**: `DeepMine - iDenfy KYC Auto-Sync`
   - **URL**: `https://www.deepmineai.vip/api/kyc/auto-sync`
   - **Schedule**: Every 5 minutes
     - Pattern: `*/5 * * * *` (every 5 minutes)
     - Or: `0,5,10,15,20,25,30,35,40,45,50,55 * * * *`

3. **Request Settings**:
   - **Method**: POST
   - **Request timeout**: 30 seconds
   - **Custom Headers**:
     ```
     X-Cron-Secret: DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=
     Content-Type: application/json
     ```

4. **Notification Settings** (optional):
   - Enable email alerts on failure
   - Set threshold: Alert after 3 consecutive failures

### Step 3: Test the Endpoint

```bash
# Test with correct secret
curl -X POST https://www.deepmineai.vip/api/kyc/auto-sync \
  -H "X-Cron-Secret: DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=" \
  -H "Content-Type: application/json"

# Expected response:
{
  "success": true,
  "message": "Auto-sync completed",
  "synced": 2,
  "approved": 1,
  "rejected": 0,
  "errors": 0,
  "total_checked": 5
}

# Test without secret (should fail)
curl -X POST https://www.deepmineai.vip/api/kyc/auto-sync

# Expected: 401 Unauthorized
```

### Step 4: Monitor Status

```bash
# Check how many submissions need syncing
curl https://www.deepmineai.vip/api/kyc/auto-sync/status

# Response:
{
  "success": true,
  "pending_count": 3,
  "reviewing_count": 2,
  "total_need_sync": 5
}
```

## 🔍 How It Works

### Sync Flow

1. **Cron Trigger**: cron-job.org calls `/api/kyc/auto-sync` every 5 minutes
2. **Fetch Pending**: Query database for submissions with:
   - `review_status IN ('pending', 'reviewing')`
   - `scan_ref IS NOT NULL` (has iDenfy verification)
   - `kyc_status NOT IN ('approved', 'rejected')` (not already decided)
3. **Check iDenfy**: For each submission, call iDenfy API:
   ```
   GET https://ivs.idenfy.com/api/v2/status?scanRef={scanRef}
   ```
4. **Update Database**:
   - If `status = APPROVED`: Set `review_status = 'approved'`, `kyc_status = 'approved'`
   - If `status = DENIED/REJECTED`: Set `review_status = 'rejected'`, `kyc_status = 'rejected'`
   - If `status = REVIEWING`: Set `review_status = 'reviewing'` (intermediate state)
5. **Send Email**: On approval, send KYC approved email via Resend
6. **Return Stats**: Report synced, approved, rejected, errors

### Security

- **Protected Endpoint**: Requires `X-Cron-Secret` header matching `CRON_SECRET` env var
- **Secret Management**: Secret stored in Cloudflare environment variables (not in code)
- **Graceful Errors**: Individual submission errors don't stop entire sync job

## 📊 Expected Behavior

### First Run (with pending submissions)
```json
{
  "success": true,
  "message": "Auto-sync completed",
  "synced": 3,
  "approved": 2,
  "rejected": 1,
  "errors": 0,
  "total_checked": 3
}
```

### Subsequent Runs (all synced)
```json
{
  "success": true,
  "message": "No pending submissions found",
  "synced": 0,
  "approved": 0,
  "rejected": 0
}
```

### With Errors
```json
{
  "success": true,
  "message": "Auto-sync completed",
  "synced": 4,
  "approved": 3,
  "rejected": 1,
  "errors": 1,
  "total_checked": 5
}
```

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
**Cause**: Missing or incorrect `X-Cron-Secret` header
**Fix**: Verify header matches secret in Cloudflare environment variables

### Issue: No submissions synced
**Cause**: All submissions already approved/rejected OR missing `scan_ref`
**Fix**: Check `/api/kyc/auto-sync/status` to see if any need syncing

### Issue: iDenfy API errors
**Cause**: Invalid API credentials or rate limiting
**Fix**: 
- Verify `IDENFY_API_KEY` and `IDENFY_API_SECRET` in Cloudflare
- Check iDenfy dashboard for API status
- Review error logs in Cloudflare Pages dashboard

### Issue: Emails not sending
**Cause**: Invalid `RESEND_API_KEY`
**Fix**: Verify Resend API key is set correctly

## 📈 Monitoring

### Check Logs in Cloudflare
1. Go to: https://dash.cloudflare.com
2. Workers & Pages > deepmine-ai > Logs
3. Filter by: `[AUTO-SYNC]`

### Sample Log Output
```
🔄 [AUTO-SYNC] Starting KYC auto-sync job...
📋 [AUTO-SYNC] Found 5 submissions to check
🔍 [AUTO-SYNC] Checking submission 9 (user 13, scan: e39a5706...)
🔄 [AUTO-SYNC] Updating submission 9: pending → approved
✅ [AUTO-SYNC] User 13 (islamsuhan774@gmail.com) approved!
📧 [AUTO-SYNC] Approval email sent to islamsuhan774@gmail.com
✅ [AUTO-SYNC] Job complete: 1 synced, 1 approved, 0 rejected, 0 errors
```

## ✅ Success Criteria

- [ ] CRON_SECRET set on Cloudflare Pages
- [ ] cron-job.org configured to run every 5 minutes
- [ ] Test endpoint returns success with correct secret
- [ ] Test endpoint returns 401 with wrong/missing secret
- [ ] Manual approval in iDenfy → Auto-synced within 5 minutes
- [ ] User receives approval email automatically
- [ ] Admin can see sync stats in logs

## 🔄 Alternative: Cloudflare Workers Cron Trigger

If you upgrade to Cloudflare Workers (not Pages), you can use native cron triggers:

```jsonc
// wrangler.jsonc (Workers only, NOT Pages)
{
  "triggers": {
    "crons": ["*/5 * * * *"]  // Every 5 minutes
  }
}
```

**Current Setup**: Using cron-job.org (works perfectly, no changes needed)

## 📝 Deployment Status

- ✅ Auto-sync code implemented
- ✅ Endpoint deployed to production
- ✅ CRON_SECRET generated
- ⏳ CRON_SECRET needs to be set on Cloudflare (manual)
- ⏳ cron-job.org needs to be configured (manual)

**Next Steps**:
1. Set `CRON_SECRET` on Cloudflare Pages (see Step 1)
2. Configure cron-job.org (see Step 2)
3. Test endpoint (see Step 3)
4. Monitor first sync run (see Step 4)

**Live URL**: https://www.deepmineai.vip
**Preview**: https://33490149.deepmine-ai.pages.dev
**Endpoint**: POST https://www.deepmineai.vip/api/kyc/auto-sync
