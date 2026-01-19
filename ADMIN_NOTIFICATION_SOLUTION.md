# Admin Notification System for KYC Submissions

## Current Status: ❌ NO ADMIN NOTIFICATIONS

Your platform currently:
- ✅ Sends email to users when KYC is approved
- ❌ Does NOT notify admins when new KYC submissions arrive
- ❌ No SMS/mobile notifications configured

---

## Solution Options

### Option 1: Email Notifications (Easiest) ⚡
**Notify admin by email when:**
- New user registers
- New KYC submission received
- User completes iDenfy verification
- User needs approval

**Cost:** Free (using existing Resend)  
**Setup Time:** 5 minutes  
**Platforms:** Any email client (Gmail, Outlook, etc.)

---

### Option 2: SMS Notifications via Twilio 📱
**Send SMS to your mobile when:**
- New KYC submission needs review
- User completes iDenfy verification

**Cost:** ~$0.0075 per SMS (very cheap)  
**Setup Time:** 10 minutes  
**Requirements:** Twilio account + phone number

---

### Option 3: Telegram Bot Notifications 💬
**Instant messages to Telegram when:**
- New KYC submissions
- Users need approval
- Important platform events

**Cost:** Free  
**Setup Time:** 15 minutes  
**Requirements:** Telegram account + Bot API key

---

### Option 4: Discord Webhook 🎮
**Send notifications to Discord channel:**
- Real-time KYC submission alerts
- Approval needed notifications
- Platform activity feed

**Cost:** Free  
**Setup Time:** 10 minutes  
**Requirements:** Discord server + webhook URL

---

### Option 5: Slack Notifications 💼
**Professional notifications to Slack:**
- KYC submission alerts
- Admin action reminders
- Platform monitoring

**Cost:** Free  
**Setup Time:** 10 minutes  
**Requirements:** Slack workspace + webhook URL

---

## Recommended Solution: Email + Telegram

**Best combination:**
1. **Email notifications** - For detailed information
2. **Telegram Bot** - For instant mobile alerts

**Why this combo:**
- Email: Professional, detailed, can include links
- Telegram: Instant, always on mobile, free
- Both are easy to implement
- No cost for Telegram, minimal for email

---

## Implementation Plan

### Phase 1: Email Notifications (Immediate) ⚡

**What you'll get:**
```
📧 Email to: admin@deepmineai.vip
Subject: 🆕 New KYC Submission - Rayhan Aryan Khan
Body:
  - User: Rayhan Aryan Khan (caanray786@gmail.com)
  - Status: Completed iDenfy Verification
  - Action Required: Approve in admin panel
  - Link: https://www.deepmineai.vip/admin/kyc
  - Time: 2025-12-14 14:05:45
```

**Events that trigger email:**
1. New user registration (optional)
2. User completes iDenfy verification ✅
3. KYC submission needs review ✅
4. User waiting for approval ✅

**Implementation:**
- Add admin email notification to iDenfy webhook
- Add notification when user completes verification
- Use existing Resend API (already configured)

---

### Phase 2: Telegram Bot (Recommended) 💬

**What you'll get:**
```
🤖 Telegram Message:
🆕 New KYC Submission

👤 User: Rayhan Aryan Khan
📧 Email: caanray786@gmail.com
🆔 Document: UK Driving License
✅ iDenfy: APPROVED
⏰ Time: 14:05 UTC

👉 [Approve Now](https://www.deepmineai.vip/admin/kyc)
```

**Setup Steps:**
1. Create Telegram bot with @BotFather
2. Get bot token
3. Get your chat ID
4. Add to Cloudflare secrets
5. Send notifications on KYC events

**Benefits:**
- ✅ Instant notifications on your phone
- ✅ Always online (Telegram app)
- ✅ Can include action buttons
- ✅ Completely free
- ✅ More reliable than email

---

## Quick Implementation: Email Notifications

I can add email notifications right now. Here's what needs to be done:

### 1. Add Admin Email Helper Function

**File:** `src/utils/email.ts` (create if doesn't exist)

```typescript
export async function sendAdminKYCNotification(
  userName: string,
  userEmail: string,
  submissionId: number,
  documentType: string,
  resendApiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DeepMine AI <noreply@deepmineai.vip>',
        to: 'admin@deepmineai.vip', // Your admin email
        subject: `🆕 New KYC Submission - ${userName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2979FF;">🆕 New KYC Submission Requires Review</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">User Details</h3>
              <p><strong>Name:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Document Type:</strong> ${documentType}</p>
              <p><strong>Submission ID:</strong> #${submissionId}</p>
              <p><strong>Status:</strong> ✅ iDenfy Verification Complete</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0;">
              <p style="margin: 0;"><strong>⚠️ Action Required:</strong> Please review and approve this submission in your admin panel.</p>
            </div>
            
            <a href="https://www.deepmineai.vip/admin/kyc" 
               style="display: inline-block; background: #2979FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Review in Admin Panel →
            </a>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px;">
              This is an automated notification from DeepMine AI Platform.<br>
              Time: ${new Date().toUTCString()}
            </p>
          </div>
        `
      })
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, error: data.message || 'Failed to send email' }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
```

### 2. Update iDenfy Webhook to Send Admin Notifications

**File:** `src/routes/kyc.ts` (around line 170)

Add after iDenfy webhook processes the submission:

```typescript
// After updating submission status (around line 243)
if (mappedStatus === 'reviewing' || mappedStatus === 'approved') {
  // Get user details
  const user = await DB.prepare(
    'SELECT email, full_name FROM users WHERE id = ?'
  ).bind(submission.user_id).first() as any
  
  const kycSubmission = await DB.prepare(
    'SELECT id, id_document_type FROM kyc_submissions WHERE id = ?'
  ).bind(submission.id).first() as any
  
  if (user) {
    // 📧 Send admin notification
    const adminNotif = await sendAdminKYCNotification(
      user.full_name || 'New User',
      user.email,
      kycSubmission.id,
      kycSubmission.id_document_type || 'Unknown',
      c.env.RESEND_API_KEY
    )
    
    if (adminNotif.success) {
      console.log('✅ Admin notification sent for submission:', kycSubmission.id)
    } else {
      console.warn('⚠️ Failed to send admin notification:', adminNotif.error)
    }
  }
}
```

---

## SMS Notifications with Twilio

### Setup Steps:

1. **Create Twilio Account:**
   - Go to: https://www.twilio.com/try-twilio
   - Sign up (free trial gives $15 credit)
   - Get phone number ($1/month)

2. **Get Credentials:**
   - Account SID: `ACxxxxxxxxxxxxx`
   - Auth Token: `your_auth_token`
   - Twilio Phone Number: `+1234567890`

3. **Add to Cloudflare Secrets:**
   ```bash
   npx wrangler secret put TWILIO_ACCOUNT_SID
   npx wrangler secret put TWILIO_AUTH_TOKEN
   npx wrangler secret put TWILIO_PHONE_NUMBER
   npx wrangler secret put ADMIN_PHONE_NUMBER  # Your mobile
   ```

4. **Add SMS Helper Function:**

```typescript
export async function sendAdminSMS(
  message: string,
  accountSid: string,
  authToken: string,
  fromNumber: string,
  toNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = btoa(`${accountSid}:${authToken}`)
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: toNumber,
          Body: message
        })
      }
    )

    if (response.ok) {
      return { success: true }
    } else {
      const error = await response.text()
      return { success: false, error }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Usage in webhook:
await sendAdminSMS(
  `🆕 New KYC: ${user.full_name} (${user.email}) - Approve at deepmineai.vip/admin/kyc`,
  c.env.TWILIO_ACCOUNT_SID,
  c.env.TWILIO_AUTH_TOKEN,
  c.env.TWILIO_PHONE_NUMBER,
  c.env.ADMIN_PHONE_NUMBER
)
```

---

## Telegram Bot Notifications

### Setup Steps:

1. **Create Telegram Bot:**
   - Open Telegram
   - Search for @BotFather
   - Send: `/newbot`
   - Follow instructions
   - Get Bot Token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

2. **Get Your Chat ID:**
   - Search for @userinfobot in Telegram
   - Send any message
   - Bot replies with your User ID: `123456789`

3. **Add to Cloudflare Secrets:**
   ```bash
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_ADMIN_CHAT_ID
   ```

4. **Add Telegram Helper Function:**

```typescript
export async function sendTelegramNotification(
  message: string,
  botToken: string,
  chatId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      }
    )

    if (response.ok) {
      return { success: true }
    } else {
      const error = await response.json()
      return { success: false, error: error.description }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Usage in webhook:
const telegramMessage = `
🆕 <b>New KYC Submission</b>

👤 <b>User:</b> ${user.full_name}
📧 <b>Email:</b> ${user.email}
🆔 <b>Document:</b> ${kycSubmission.id_document_type}
✅ <b>Status:</b> iDenfy Approved

👉 <a href="https://www.deepmineai.vip/admin/kyc">Review Now</a>
`

await sendTelegramNotification(
  telegramMessage,
  c.env.TELEGRAM_BOT_TOKEN,
  c.env.TELEGRAM_ADMIN_CHAT_ID
)
```

---

## Which Solution Do You Want?

**Let me know and I'll implement it for you:**

1. ⚡ **Email Only** (5 min) - Quick, uses existing Resend
2. 📱 **Email + SMS** (15 min) - Requires Twilio setup
3. 💬 **Email + Telegram** (15 min) - Free, instant, mobile-friendly
4. 🎮 **Email + Discord** (10 min) - If you use Discord
5. 💼 **Email + Slack** (10 min) - If you use Slack for business

**My Recommendation:** Start with **Option 1 (Email)** now, then add **Telegram** later for mobile alerts.

---

## Quick Start: Email Notifications

Want me to implement email notifications right now? I can:
1. Create the email helper function
2. Update the iDenfy webhook
3. Add admin email to environment variables
4. Test it immediately

Just tell me your **admin email address** and I'll set it up! 📧

---

**Created:** 2025-12-14  
**Status:** Ready for implementation
