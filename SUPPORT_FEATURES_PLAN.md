# Support Features Implementation Plan
## Date: December 11, 2025

---

## 🎯 **OVERVIEW**

Three major features to implement for customer support and compliance:

1. **AI Support Chatbot** - User dashboard support with full knowledge
2. **KYC Document Management** - Automated backup to Google Drive + Email
3. **User Activity Logging** - Registration & deposit tracking

---

## 📋 **TASK 1: AI SUPPORT CHATBOT**

### **Requirements:**
- ✅ Appears on user dashboard
- ✅ Has full knowledge of platform features
- ✅ Answers user questions about mining, deposits, withdrawals, KYC, etc.
- ✅ All conversations logged to Google Sheets
- ✅ All conversations emailed to support@deepmineai.vip

### **Technical Approach:**

**Option A: OpenAI ChatGPT API (RECOMMENDED)**
- Use GPT-4 or GPT-3.5-turbo
- Create custom system prompt with platform knowledge
- Embed chatbot widget in dashboard
- Cost: ~$0.001-0.03 per conversation

**Option B: Free/Open Source Alternatives**
- Tidio (free plan available)
- Tawk.to (completely free)
- Crisp (free plan)

### **Implementation:**
```typescript
// src/routes/support-chat.ts
import { Hono } from 'hono'

const supportChat = new Hono()

// POST /api/support/chat - Send message to AI
supportChat.post('/chat', requireAuth, async (c) => {
  const { message, conversationId } = await c.req.json()
  const userId = c.get('userId')
  
  // 1. Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: SUPPORT_BOT_KNOWLEDGE_BASE
        },
        {
          role: 'user',
          content: message
        }
      ]
    })
  })
  
  const aiResponse = await response.json()
  
  // 2. Log to database
  await c.env.DB.prepare(`
    INSERT INTO support_conversations (user_id, message, response, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).bind(userId, message, aiResponse.choices[0].message.content).run()
  
  // 3. Log to Google Sheets (async)
  // 4. Send email to support@deepmineai.vip (async)
  
  return c.json({ reply: aiResponse.choices[0].message.content })
})

export default supportChat
```

### **Knowledge Base Content:**
- Platform overview (DeepMine AI features)
- How to deposit (USDT ERC20)
- How to purchase mining machines
- How to withdraw funds
- KYC requirements
- Daily earnings explanation
- Referral program details
- Daily check-in bonus
- Account security tips

---

## 📋 **TASK 2: KYC DOCUMENT MANAGEMENT**

### **Requirements:**
- ✅ When user uploads KYC documents (ID, selfie)
- ✅ Send documents to kyc@deepmineai.vip email
- ✅ Upload documents to Google Drive (kyc@deepmineai.vip account)
- ✅ Organize by user ID/email

### **Technical Approach:**

**Google Drive Structure:**
```
DeepMine KYC Documents/
├── 2025-12/
│   ├── user_3_ryan786w@gmail.com/
│   │   ├── id_front.jpg
│   │   ├── id_back.jpg
│   │   └── selfie.jpg
│   └── user_10_bnai48826@gmail.com/
│       ├── id_front.jpg
│       └── selfie.jpg
```

**Implementation:**
```typescript
// src/routes/kyc.ts - Modify existing KYC upload

// After successful KYC submission:
async function backupKYCToGoogleDrive(userId: number, email: string, documents: any) {
  // 1. Upload to Google Drive
  const driveResponse = await uploadToGoogleDrive({
    folderId: c.env.GOOGLE_DRIVE_KYC_FOLDER_ID,
    fileName: `user_${userId}_${email}/id_front.jpg`,
    fileData: documents.idFront,
    mimeType: 'image/jpeg'
  })
  
  // 2. Send email to kyc@deepmineai.vip
  await sendEmail({
    to: 'kyc@deepmineai.vip',
    from: 'noreply@deepmineai.vip',
    subject: `New KYC Submission - User ${userId} (${email})`,
    html: `
      <h2>New KYC Documents Received</h2>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
      <p><strong>Documents:</strong> ID Front, ID Back, Selfie</p>
      <p><strong>Google Drive Link:</strong> ${driveResponse.webViewLink}</p>
    `,
    attachments: [
      { filename: 'id_front.jpg', content: documents.idFront },
      { filename: 'id_back.jpg', content: documents.idBack },
      { filename: 'selfie.jpg', content: documents.selfie }
    ]
  })
}
```

---

## 📋 **TASK 3: USER ACTIVITY LOGGING**

### **Requirements:**
- ✅ Log all user registrations
- ✅ Log all deposit wallet addresses used
- ✅ Send to noreply@deepmineai.vip email
- ✅ Store in Google Drive (noreply@deepmineai.vip account)
- ✅ Google Sheets log for easy tracking

### **Technical Approach:**

**Google Sheets Structure:**
```
User Registration Log:
| Date       | User ID | Email              | Full Name    | Phone      | Country | Referral Code |
|------------|---------|--------------------|--------------  |------------|---------|---------------|
| 2025-12-11 | 3       | ryan786w@gmail.com | Rayhan Khan  | +1234...   | UK      | FIO3081       |

Deposit Tracking Log:
| Date       | User ID | Email              | Amount | Wallet Address (User) | TX Hash | Status   |
|------------|---------|--------------------  |--------|----------------------|---------|----------|
| 2025-12-11 | 3       | ryan786w@gmail.com | 1000   | 0x1234...            | 0xabc... | approved |
```

**Implementation:**
```typescript
// src/routes/auth.ts - Modify registration

// After successful registration:
async function logUserRegistration(userData: any) {
  // 1. Append to Google Sheets
  await appendToGoogleSheet({
    spreadsheetId: c.env.GOOGLE_SHEET_USERS_ID,
    range: 'Registration Log!A:G',
    values: [[
      new Date().toISOString(),
      userData.id,
      userData.email,
      userData.full_name,
      userData.phone,
      userData.country,
      userData.referral_code
    ]]
  })
  
  // 2. Send email notification
  await sendEmail({
    to: 'noreply@deepmineai.vip',
    from: 'system@deepmineai.vip',
    subject: `New User Registration - ${userData.email}`,
    html: `
      <h2>New User Registered</h2>
      <ul>
        <li><strong>User ID:</strong> ${userData.id}</li>
        <li><strong>Email:</strong> ${userData.email}</li>
        <li><strong>Name:</strong> ${userData.full_name}</li>
        <li><strong>Country:</strong> ${userData.country}</li>
      </ul>
    `
  })
}

// src/routes/deposits.ts - Modify deposit submission

// After deposit proof uploaded:
async function logDepositActivity(depositData: any) {
  // 1. Append to Google Sheets
  await appendToGoogleSheet({
    spreadsheetId: c.env.GOOGLE_SHEET_USERS_ID,
    range: 'Deposit Log!A:G',
    values: [[
      new Date().toISOString(),
      depositData.user_id,
      depositData.email,
      depositData.amount,
      depositData.wallet_address, // User's wallet
      depositData.tx_hash,
      depositData.status
    ]]
  })
  
  // 2. Send email notification
  await sendEmail({
    to: 'noreply@deepmineai.vip',
    subject: `New Deposit - ${depositData.email} ($${depositData.amount})`,
    html: `
      <h2>New Deposit Submitted</h2>
      <ul>
        <li><strong>User:</strong> ${depositData.email}</li>
        <li><strong>Amount:</strong> $${depositData.amount} USDT</li>
        <li><strong>User Wallet:</strong> ${depositData.wallet_address}</li>
        <li><strong>TX Hash:</strong> ${depositData.tx_hash}</li>
      </ul>
    `
  })
}
```

---

## 🔧 **REQUIRED INTEGRATIONS**

### **1. Google Drive API**
**Setup Steps:**
1. Create Google Cloud Project
2. Enable Google Drive API
3. Create Service Account
4. Download JSON credentials
5. Share Drive folders with service account email
6. Store credentials as Cloudflare secret

**Cloudflare Secrets:**
```bash
npx wrangler secret put GOOGLE_DRIVE_CREDENTIALS
# Paste JSON content

npx wrangler secret put GOOGLE_DRIVE_KYC_FOLDER_ID
# Paste folder ID for KYC documents

npx wrangler secret put GOOGLE_DRIVE_USERS_FOLDER_ID
# Paste folder ID for user activity logs
```

### **2. Google Sheets API**
**Setup Steps:**
1. Create Google Sheet for logs
2. Share with service account email (edit access)
3. Get spreadsheet ID from URL
4. Store as Cloudflare secret

**Cloudflare Secrets:**
```bash
npx wrangler secret put GOOGLE_SHEET_SUPPORT_ID
# Spreadsheet ID for support chat logs

npx wrangler secret put GOOGLE_SHEET_USERS_ID
# Spreadsheet ID for user activity logs
```

### **3. OpenAI API (for Chatbot)**
**Setup Steps:**
1. Create OpenAI account
2. Generate API key
3. Store as Cloudflare secret

**Cloudflare Secrets:**
```bash
npx wrangler secret put OPENAI_API_KEY
# Your OpenAI API key
```

### **4. Email Service (Resend - Already Set Up)**
- ✅ Already using Resend for email verification
- ✅ Add new sender: support@deepmineai.vip
- ✅ Add new sender: kyc@deepmineai.vip
- ✅ Verify domains in Resend dashboard

---

## 📊 **DATABASE SCHEMA UPDATES**

### **New Tables Needed:**

**1. Support Conversations Table:**
```sql
CREATE TABLE support_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  conversation_id TEXT,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_support_user ON support_conversations(user_id);
CREATE INDEX idx_support_conversation ON support_conversations(conversation_id);
```

**2. Activity Logs Table (Optional - can use Google Sheets only):**
```sql
CREATE TABLE activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  activity_type TEXT NOT NULL, -- 'registration', 'deposit', 'kyc_upload'
  details TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
```

---

## 💰 **COST ESTIMATION**

### **Google Services:**
- **Google Drive:** Free (15GB included)
- **Google Sheets:** Free
- **Service Account:** Free

### **OpenAI ChatGPT:**
- **GPT-3.5-turbo:** ~$0.001 per conversation
- **GPT-4:** ~$0.03 per conversation
- **Estimated:** $10-50/month (depending on usage)

### **Email (Resend):**
- **Current Plan:** Already set up
- **Additional Emails:** Included in current quota

### **Total Additional Cost:** ~$10-50/month for ChatGPT

---

## 🎯 **IMPLEMENTATION PRIORITY**

### **Phase 1: Email & Google Drive (High Priority)**
1. Set up Google Cloud Project
2. Configure Google Drive & Sheets API
3. Implement KYC backup to Drive + Email
4. Implement user activity logging
5. **ETA:** 2-3 hours

### **Phase 2: Support Chatbot (Medium Priority)**
1. Set up OpenAI API
2. Create knowledge base prompt
3. Build chat UI on dashboard
4. Implement conversation logging
5. **ETA:** 3-4 hours

### **Phase 3: Testing & Refinement**
1. Test all integrations
2. Verify Google Drive uploads
3. Test email notifications
4. Refine chatbot responses
5. **ETA:** 1-2 hours

**Total Implementation Time:** 6-9 hours

---

## ⚠️ **IMPORTANT NOTES**

### **Email Addresses:**
Make sure these are set up in your domain:
- ✅ **support@deepmineai.vip** - Support inbox
- ✅ **kyc@deepmineai.vip** - KYC documents inbox
- ✅ **noreply@deepmineai.vip** - System notifications

### **Google Drive Organization:**
- Separate folders for KYC, User Logs, Support Logs
- Proper access control (service account only)
- Regular backups
- Compliance with data protection regulations

### **Privacy & Security:**
- ✅ Encrypt sensitive data before storing
- ✅ Comply with GDPR/data protection laws
- ✅ Limit access to authorized personnel only
- ✅ Regular security audits

---

## 🚀 **NEXT STEPS**

**TO START IMPLEMENTATION:**
1. **Provide Google Account Credentials** (for Drive/Sheets setup)
2. **Confirm OpenAI API Key** (or choose alternative chatbot)
3. **Confirm Email Setup** (Resend sender addresses)
4. **Review Knowledge Base Content** (for chatbot)

**Once you provide these, I can:**
- Set up Google Drive/Sheets integration
- Implement KYC backup system
- Build support chatbot
- Add activity logging

---

**Ready to proceed?** Let me know which task you want to tackle first! 🎯
