# 🔄 Step-by-Step: Setting Up cron-job.org for iDenfy Auto-Sync

## Overview
This guide will help you configure cron-job.org to automatically call the iDenfy auto-sync endpoint every 5 minutes.

---

## 📋 Prerequisites

### 1. Information You'll Need
- **Endpoint URL**: `https://www.deepmineai.vip/api/kyc/auto-sync`
- **CRON_SECRET**: `DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=`
- **Schedule**: Every 5 minutes (`*/5 * * * *`)

### 2. Create cron-job.org Account (if you don't have one)
1. Go to: **https://console.cron-job.org/signup**
2. Sign up with your email
3. Verify your email address
4. Login at: **https://console.cron-job.org/login**

---

## 🚀 Step-by-Step Setup

### Step 1: Access Your Dashboard
1. **Login** to cron-job.org: https://console.cron-job.org/login
2. You'll see your dashboard with existing cron jobs (if any)
3. Click the **"Create cronjob"** button (top right corner)

---

### Step 2: Configure Basic Settings

On the "Create cronjob" page, fill in these fields:

#### **Title** (Required)
```
DeepMine - iDenfy KYC Auto-Sync
```

#### **Address** (Required)
```
https://www.deepmineai.vip/api/kyc/auto-sync
```

#### **Enabled**
- ✅ **Check this box** to activate the cron job immediately

---

### Step 3: Set Schedule

#### **Schedule** Section
You have two options:

**Option A: Simple Selection** (RECOMMENDED)
1. Click the dropdown menu
2. Select: **"Every 5 minutes"**

**Option B: Advanced Cron Expression**
1. Click **"Advanced"** tab
2. Enter: `*/5 * * * *`

**What this means**:
- `*/5` = Every 5 minutes
- First `*` = Every hour
- Second `*` = Every day
- Third `*` = Every month
- Fourth `*` = Every day of week

**Visual**: Your job will run at:
```
00:00, 00:05, 00:10, 00:15, 00:20, 00:25, 00:30, 00:35, 00:40, 00:45, 00:50, 00:55
01:00, 01:05, 01:10, ... (and so on, 24/7)
```

---

### Step 4: Configure Request Settings

#### **Request method**
- Select: **POST** (from dropdown)

#### **Request timeout**
- Set to: **30 seconds**
- (Default is usually fine, but 30s gives enough time for API calls)

---

### Step 5: Add Custom Headers (CRITICAL!)

This is the most important part for security.

1. Scroll down to **"Headers"** section
2. Click **"+ Add header"** button twice to add 2 headers

#### **Header 1** (Authentication)
- **Name**: `X-Cron-Secret`
- **Value**: `DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=`

#### **Header 2** (Content Type)
- **Name**: `Content-Type`
- **Value**: `application/json`

**⚠️ IMPORTANT**: Make sure you copy the CRON_SECRET exactly as shown above, including the equals sign at the end!

---

### Step 6: Configure Notifications (Optional but Recommended)

#### **Notifications** Section
1. Expand the "Notifications" section
2. Configure email alerts:

**Recommended Settings**:
- ✅ **"Enable failure notifications"**
- **Notify after**: `3` consecutive failures
- **Email**: Your admin email address

**Why?** You'll be alerted if the auto-sync stops working (e.g., if Cloudflare is down or API key expires)

---

### Step 7: Save Configuration

1. Scroll to the bottom of the page
2. Click the big **"Create cronjob"** button (green/blue button)
3. You'll be redirected to your dashboard
4. Your new cron job should appear in the list

---

## ✅ Verification Steps

### Immediately After Creating

1. **Find your new cron job** in the dashboard
2. You should see:
   - **Status**: Green dot (Enabled)
   - **Title**: DeepMine - iDenfy KYC Auto-Sync
   - **Next execution**: In a few minutes

### Manual Test (Recommended)

1. **Hover over your cron job** in the dashboard
2. Click the **"▶ Execute now"** button (play icon)
3. Wait 10-30 seconds
4. Check the **"History"** tab to see the result

**Expected Result**:
- **Status**: ✅ Success (green checkmark)
- **HTTP Status**: 200 OK
- **Response**: JSON with sync statistics

**Example Response**:
```json
{
  "success": true,
  "message": "Auto-sync completed",
  "synced": 2,
  "approved": 1,
  "rejected": 0,
  "errors": 0,
  "total_checked": 5
}
```

---

## 🔍 Monitoring Your Cron Job

### View Execution History

1. Go to your cron job in the dashboard
2. Click on the job title to open details
3. Click **"History"** tab

You'll see:
- **Execution time**: When it ran
- **Status**: Success/Failure
- **HTTP status code**: 200 OK (success) or error codes
- **Response time**: How long it took
- **Response body**: The JSON response from our API

### Check Recent Executions

Look for these patterns:

**Healthy Execution** (No pending submissions):
```json
{
  "success": true,
  "message": "No pending submissions found",
  "synced": 0,
  "approved": 0,
  "rejected": 0
}
```

**Active Execution** (Syncing submissions):
```json
{
  "success": true,
  "message": "Auto-sync completed",
  "synced": 3,
  "approved": 2,
  "rejected": 1,
  "errors": 0,
  "total_checked": 5
}
```

**Error Execution** (Something wrong):
```json
{
  "success": false,
  "message": "Invalid secret"
}
```

---

## 🐛 Troubleshooting

### Problem 1: 401 Unauthorized Error

**Symptoms**:
- HTTP Status: 401
- Response: `{"success": false, "message": "Invalid secret"}`

**Cause**: CRON_SECRET header is missing or incorrect

**Fix**:
1. Click on your cron job in dashboard
2. Click **"Edit"** button
3. Scroll to **"Headers"** section
4. Verify `X-Cron-Secret` header is exactly:
   ```
   DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=
   ```
5. Make sure there are no extra spaces or missing characters
6. Click **"Save"**
7. Click **"Execute now"** to test

---

### Problem 2: 500 Internal Server Error

**Symptoms**:
- HTTP Status: 500
- Response: Error message from API

**Possible Causes**:
1. Database connection issue
2. iDenfy API credentials invalid
3. Bug in auto-sync code

**Fix**:
1. Check Cloudflare Pages dashboard for errors
2. Verify environment variables are set:
   - `IDENFY_API_KEY`
   - `IDENFY_API_SECRET`
   - `RESEND_API_KEY`
   - `CRON_SECRET`
3. Check application logs in Cloudflare
4. If issue persists, let me know the error message

---

### Problem 3: Timeout (Request took too long)

**Symptoms**:
- Status: Timeout
- No response received

**Cause**: Request took longer than 30 seconds

**Fix**:
1. This is rare but can happen if checking many submissions
2. Increase timeout in cron-job.org:
   - Edit cron job
   - Set **"Request timeout"** to **60 seconds**
   - Save
3. Or reduce the number of submissions checked at once (let me know if this happens)

---

### Problem 4: No Submissions Being Synced

**Symptoms**:
- Status: 200 OK
- Response: `"synced": 0, "approved": 0, "rejected": 0`
- But you know there are pending submissions

**Possible Causes**:
1. Submissions don't have `scan_ref` (not submitted to iDenfy yet)
2. Submissions are already approved/rejected
3. Users' `kyc_status` is already set

**Diagnosis**:
1. Check the monitoring endpoint:
   ```bash
   curl https://www.deepmineai.vip/api/kyc/auto-sync/status
   ```
2. This will show how many submissions need syncing:
   ```json
   {
     "success": true,
     "pending_count": 3,
     "reviewing_count": 2,
     "total_need_sync": 5
   }
   ```
3. If `total_need_sync` is 0, there's nothing to sync (which is good!)

---

## 📊 Expected Behavior

### First Week
- **Executions**: 288 per day (every 5 minutes × 12 per hour × 24 hours)
- **Most executions**: Will return "No pending submissions found" (this is normal!)
- **Active executions**: Only when users submit KYC or get approved in iDenfy

### Typical Response Distribution
- **~95% of runs**: "No pending submissions found" (nothing to sync)
- **~4% of runs**: Actually syncing 1-5 submissions
- **~1% of runs**: Errors (temporary network issues, API hiccups)

### Healthy System Indicators
- ✅ Cron job runs every 5 minutes without failures
- ✅ HTTP 200 status on all executions
- ✅ Users approved in iDenfy get synced within 5 minutes
- ✅ Approval emails sent automatically
- ✅ No 401 Unauthorized errors

---

## 🎯 Success Checklist

After setup, verify these:

- [ ] Cron job created and enabled
- [ ] Schedule set to every 5 minutes (`*/5 * * * *`)
- [ ] Request method is POST
- [ ] URL is correct: `https://www.deepmineai.vip/api/kyc/auto-sync`
- [ ] `X-Cron-Secret` header added with correct value
- [ ] `Content-Type: application/json` header added
- [ ] Manually executed once to test
- [ ] Saw 200 OK response
- [ ] Email notifications configured (optional)
- [ ] Bookmarked cron-job.org dashboard for monitoring

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the execution history** in cron-job.org dashboard
2. **Note the error message** (HTTP status + response body)
3. **Check Cloudflare logs**:
   - Go to: https://dash.cloudflare.com
   - Workers & Pages > deepmine-ai > Logs
   - Filter by: `[AUTO-SYNC]`
4. **Share the error details** with me and I'll help debug

---

## 🔐 Security Notes

### CRON_SECRET Protection
- ✅ Secret is stored in Cloudflare environment variables (not in code)
- ✅ Secret is only shared via HTTPS (encrypted in transit)
- ✅ Secret is validated on every request
- ✅ Invalid requests are rejected with 401 Unauthorized

### Best Practices
- 🔒 Don't share the CRON_SECRET publicly
- 🔒 Don't commit it to GitHub (it's in environment variables)
- 🔒 If compromised, generate a new secret and update:
  1. Cloudflare Pages environment variable
  2. cron-job.org header
  3. Any documentation

### Generate New Secret (if needed)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📈 What Happens Next?

Once configured:

1. **Every 5 minutes**: cron-job.org calls your endpoint
2. **Auto-sync checks**: All pending/reviewing KYC submissions
3. **Fetches status**: From iDenfy API for each submission
4. **Updates database**: Changes status to approved/rejected if needed
5. **Sends emails**: Approval emails to users automatically
6. **Logs everything**: Activity logs track all changes

**Result**: Users approved in iDenfy will be automatically approved in your system within 5 minutes, with zero manual work!

---

## 🎉 Final Notes

- **Free Tier**: cron-job.org free tier allows up to 20 cron jobs (more than enough)
- **Reliability**: cron-job.org has 99.9%+ uptime
- **Alternative**: If you ever need it, you can switch to Cloudflare Workers Cron Triggers (requires paid Workers plan)

**You're all set!** Once this is configured, the iDenfy auto-sync will run continuously in the background. 🚀

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│     iDenfy Auto-Sync - Quick Reference         │
├─────────────────────────────────────────────────┤
│ URL:      https://www.deepmineai.vip/          │
│           api/kyc/auto-sync                     │
│                                                 │
│ Method:   POST                                  │
│                                                 │
│ Schedule: */5 * * * * (every 5 minutes)         │
│                                                 │
│ Headers:                                        │
│   X-Cron-Secret:                                │
│     DEg/0NDbuOciXfxfU1NEW5Hyp+7Unf6Jz41CFvlh0lM=│
│   Content-Type: application/json                │
│                                                 │
│ Monitor:  https://console.cron-job.org         │
│                                                 │
│ Status:   https://www.deepmineai.vip/          │
│           api/kyc/auto-sync/status              │
└─────────────────────────────────────────────────┘
```
