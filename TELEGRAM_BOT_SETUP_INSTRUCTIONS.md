# Telegram Bot Setup for DeepMine AI Admin Notifications

## Your Telegram Group
- **Group Link:** https://t.me/+I3GXGxAY5IBlOGY0
- **QR Code:** Provided ✅

---

## Step 1: Create Telegram Bot (5 minutes)

### 1.1 Open Telegram and Find BotFather
1. Open Telegram app on your phone or desktop
2. Search for: `@BotFather` (official bot creator)
3. Start chat with BotFather

### 1.2 Create Your Bot
Send these commands to BotFather:

```
/newbot
```

BotFather will ask: **"Alright, a new bot. How are we going to call it? Please choose a name for your bot."**

**Enter:** `DeepMine Admin Notifier`

Then BotFather asks: **"Good. Now let's choose a username for your bot. It must end in bot."**

**Enter:** `deepmine_admin_bot` (or any available name ending in `_bot`)

### 1.3 Get Your Bot Token
BotFather will reply with:
```
Done! Congratulations on your new bot. You will find it at t.me/deepmine_admin_bot

Use this token to access the HTTP API:
123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890

Keep your token secure and store it safely, it can be used by anyone to control your bot.
```

**⚠️ SAVE THIS TOKEN!** You'll need it in Step 2.

---

## Step 2: Add Bot to Your Telegram Group

### 2.1 Join Your Group (if not already)
Use your link: https://t.me/+I3GXGxAY5IBlOGY0

### 2.2 Add the Bot to Group
1. Open your Telegram group
2. Click on group name at top
3. Click "Add Members"
4. Search for your bot: `@deepmine_admin_bot`
5. Add the bot to the group
6. **Make the bot an ADMIN** (important for sending messages)
   - Go to group settings
   - Click "Administrators"
   - Click "Add Administrator"
   - Select your bot
   - Enable "Post Messages" permission
   - Save

---

## Step 3: Get Your Group Chat ID

### 3.1 Send a Test Message
1. In your Telegram group, send any message
2. Make sure the bot is in the group

### 3.2 Get Chat ID via API
Open your browser and go to:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Replace `<YOUR_BOT_TOKEN>` with the token from Step 1.3

**Example:**
```
https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890/getUpdates
```

### 3.3 Find Your Chat ID
You'll see JSON response like:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 1,
        "from": {...},
        "chat": {
          "id": -1001234567890,  <-- THIS IS YOUR CHAT ID
          "title": "DeepMine Admin Team",
          "type": "supergroup"
        },
        "date": 1234567890,
        "text": "test"
      }
    }
  ]
}
```

**Look for:** `"chat": { "id": -1001234567890 }`

**⚠️ SAVE THIS CHAT ID!** (It will be negative number like `-1001234567890`)

---

## Step 4: Add Credentials to Cloudflare

Now I'll add the bot token and chat ID to your Cloudflare secrets:

```bash
# Bot Token from Step 1.3
npx wrangler secret put TELEGRAM_BOT_TOKEN --project-name webapp

# Chat ID from Step 3.3 (negative number)
npx wrangler secret put TELEGRAM_ADMIN_CHAT_ID --project-name webapp
```

When prompted, paste:
1. Your bot token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890`
2. Your chat ID: `-1001234567890`

---

## Step 5: Test the Bot

After setup, I'll send a test message to verify it works:

**Expected message in your Telegram group:**
```
🤖 DeepMine AI Admin Bot Activated!

✅ Notifications enabled for:
- New user registrations
- KYC submissions
- Users awaiting approval

This bot will notify your admin team when action is required.
```

---

## What Notifications You'll Get

### 1. New User Registration
```
🆕 New User Registered

👤 Name: Rayhan Aryan Khan
📧 Email: caanray786@gmail.com
🕐 Time: 14:05 UTC

⏳ User may submit KYC documents soon.
```

### 2. New KYC Submission (iDenfy Complete)
```
✅ KYC Verification Complete - Awaiting Approval

👤 User: Rayhan Aryan Khan
📧 Email: caanray786@gmail.com
🆔 Document: UK Driving License
✅ iDenfy Status: APPROVED
🕐 Time: 14:05 UTC

⚠️ ACTION REQUIRED: Review and approve

👉 https://www.deepmineai.vip/admin/kyc
```

### 3. Urgent: Multiple Users Waiting
```
⚠️ 3 Users Awaiting KYC Approval

🔔 You have users waiting for review:
- Rayhan Aryan Khan (30 mins ago)
- John Smith (1 hour ago)
- Jane Doe (2 hours ago)

👉 Review Now: https://www.deepmineai.vip/admin/kyc
```

---

## Customization Options

### Notification Events:
- ✅ New user registration
- ✅ KYC submission completed
- ✅ User needs approval
- ⏳ Daily summary (optional)
- ⏳ Withdrawal requests (optional)
- ⏳ System alerts (optional)

### Notification Frequency:
- **Instant:** Every event triggers notification
- **Batched:** Group notifications every 15/30/60 minutes
- **Quiet Hours:** Disable notifications during specific hours

Let me know if you want any customizations!

---

## Security Notes

### ✅ Best Practices:
1. **Never share bot token publicly**
2. **Only add bot to your private admin group**
3. **Make bot an admin** to post messages
4. **Keep group link private** (invite-only)

### 🔒 Bot Permissions:
- Can send messages ✅
- Can read messages (to get chat ID) ✅
- Cannot delete messages ❌
- Cannot ban users ❌
- Cannot add new members ❌

---

## Troubleshooting

### Bot not sending messages?
1. Check bot is in the group
2. Verify bot is an admin with "Post Messages" permission
3. Verify chat ID is correct (negative number)
4. Check bot token is correct

### Wrong chat ID?
1. Send a new message in the group
2. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Look for latest message with your group name
4. Copy the chat ID (negative number)

### Need to change settings?
You can update secrets anytime:
```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_ADMIN_CHAT_ID
```

---

## Quick Summary

**What you need to do:**
1. ✅ Create bot with @BotFather → Get token
2. ✅ Add bot to your Telegram group
3. ✅ Make bot an admin
4. ✅ Get chat ID from browser
5. ✅ Give me the token and chat ID

**What I'll do:**
1. Add credentials to Cloudflare
2. Implement notification system
3. Test notifications
4. Deploy to production

**Time required:** 10 minutes total

---

## Ready to Start?

**Give me:**
1. Your **bot token** from BotFather (looks like: `123456789:ABCdef...`)
2. Your **chat ID** from the API (looks like: `-1001234567890`)

Then I'll:
1. Add them to Cloudflare secrets
2. Implement the notification system
3. Send a test message to your group
4. Deploy everything

Let's get your admin notifications working! 🚀

---

**Created:** 2025-12-14  
**Status:** Waiting for bot token and chat ID
