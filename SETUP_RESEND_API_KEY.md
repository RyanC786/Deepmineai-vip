# 🔐 SETUP RESEND_API_KEY IN CLOUDFLARE PAGES

**Project**: DeepMine AI  
**Required For**: Task 10 - KYC Activation Email  
**Urgency**: ⚠️ **REQUIRED** for production emails to work

---

## 📋 **QUICK SETUP GUIDE**

### **Step 1: Access Cloudflare Dashboard**

**URL**: https://dash.cloudflare.com/

**Login with your Cloudflare credentials**

---

### **Step 2: Navigate to DeepMine AI Project**

**Path**:
```
Cloudflare Dashboard
    → Workers & Pages (left sidebar)
    → deepmine-ai (click on project name)
```

**Visual Guide**:
```
┌─────────────────────────────────────┐
│  Cloudflare Dashboard               │
│                                     │
│  ☰ Menu                            │
│    • Overview                      │
│    • Websites                      │
│    • Workers & Pages  ← Click here │
│    • R2                            │
│    • D1                            │
│    • Analytics                     │
│                                     │
└─────────────────────────────────────┘

Then find:
┌─────────────────────────────────────┐
│  Workers & Pages                    │
│                                     │
│  📄 deepmine-ai  ← Click here      │
│     Last deployed: X minutes ago    │
│                                     │
└─────────────────────────────────────┘
```

---

### **Step 3: Access Settings Tab**

**Click on**: **"Settings"** (top navigation tabs)

```
┌─────────────────────────────────────────────────┐
│  deepmine-ai                                    │
│                                                 │
│  [Deployments] [Settings] [Functions] [Logs]   │
│                   ↑                             │
│                Click here                       │
└─────────────────────────────────────────────────┘
```

---

### **Step 4: Scroll to Environment Variables**

**Scroll down** to find: **"Environment variables"** section

```
Settings Page:
├── General
├── Builds & deployments
├── Environment variables  ← Find this section
├── Functions
├── Custom domains
└── Access control
```

---

### **Step 5: Add RESEND_API_KEY Variable**

**Click**: **"Add variable"** or **"Edit variables"** button

**Enter the following**:

```
┌─────────────────────────────────────────────────┐
│  Add environment variable                       │
│                                                 │
│  Variable name:                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ RESEND_API_KEY                            │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Value:                                         │
│  ┌───────────────────────────────────────────┐ │
│  │ re_JE9L6QBy_8bPUjA8rkDLb6QkABTQb4sC7     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Environment:                                   │
│  ☑ Production                                  │
│  ☐ Preview                                     │
│                                                 │
│  [Cancel]  [Save]                              │
│             ↑                                   │
│          Click here                             │
└─────────────────────────────────────────────────┘
```

**Important**:
- ✅ **Variable name**: `RESEND_API_KEY` (exact spelling, all caps)
- ✅ **Value**: `re_JE9L6QBy_8bPUjA8rkDLb6QkABTQb4sC7` (copy exactly)
- ✅ **Environment**: Check **"Production"** ✓
- ✅ **Optional**: Also check **"Preview"** if you want emails in preview deployments

---

### **Step 6: Save and Deploy**

**Click**: **"Save"** button

Cloudflare may ask if you want to redeploy:
- ✅ **Click "Yes"** or **"Redeploy"** to apply changes immediately
- Or changes will apply on next deployment

---

### **Step 7: Verify Setup**

After saving, you should see:

```
Environment variables:

┌──────────────────┬─────────────────────┬──────────────┐
│ Variable         │ Value               │ Environment  │
├──────────────────┼─────────────────────┼──────────────┤
│ RESEND_API_KEY   │ re_JE9L...4sC7     │ Production   │
└──────────────────┴─────────────────────┴──────────────┘

[Edit] [Delete]
```

---

## 🧪 **TESTING AFTER SETUP**

### **Method 1: Test KYC Approval Email**

1. Go to: https://www.deepmineai.vip/admin/panel/kyc
2. Find a pending KYC submission (or create a test user)
3. Click **"Approve"**
4. Open browser console (F12)
5. Look for log message: `✅ KYC approval email sent successfully`
6. Check user's email inbox (may take 1-2 minutes)

**Expected Email**:
- **Subject**: 🎉 KYC Approved - How to Purchase Your First Mining Machine
- **From**: DeepMine AI <noreply@deepmineai.vip>
- **Contains**: Step-by-step machine purchase guide

---

### **Method 2: Check Console Logs**

When KYC is approved, check browser console for:

**Success**:
```
🔍 Approve request: { submissionId: 'X', adminId: 1 }
📝 Found submission: { id: X, user_id: Y }
✅ Updated submission status
✅ Updated user status
✅ KYC approval email sent successfully  ← Look for this
✅ Logged admin action
```

**If RESEND_API_KEY is missing**:
```
⚠️ User email or RESEND_API_KEY not found, skipping email
```

---

### **Method 3: Check Resend Dashboard**

1. Go to: https://resend.com/emails
2. Log in with Resend account
3. Check **"Emails"** tab
4. You should see recent sent emails after KYC approval

**Email Details**:
- **To**: User's email address
- **Subject**: 🎉 KYC Approved - How to Purchase Your First Mining Machine
- **Status**: Delivered ✓

---

## 🔍 **TROUBLESHOOTING**

### **Problem 1: Email Not Sending**

**Symptoms**:
- Console shows: `⚠️ User email or RESEND_API_KEY not found`
- No email received

**Solution**:
1. ✅ Verify `RESEND_API_KEY` is set in Cloudflare Pages
2. ✅ Check spelling: `RESEND_API_KEY` (all caps, no spaces)
3. ✅ Verify environment is set to **"Production"**
4. ✅ Redeploy the project:
   ```bash
   npx wrangler pages deploy dist --project-name deepmine-ai
   ```

---

### **Problem 2: Wrong API Key**

**Symptoms**:
- Console shows: `⚠️ Failed to send KYC approval email: Failed to send email`
- Resend API error

**Solution**:
1. ✅ Verify API key is correct: `re_JE9L6QBy_8bPUjA8rkDLb6QkABTQb4sC7`
2. ✅ Check Resend dashboard for valid API key
3. ✅ Test API key with curl:
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer re_JE9L6QBy_8bPUjA8rkDLb6QkABTQb4sC7" \
     -H "Content-Type: application/json" \
     -d '{"from":"noreply@deepmineai.vip","to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
   ```

---

### **Problem 3: Email Goes to Spam**

**Symptoms**:
- Email sent successfully
- Not in inbox, found in spam folder

**Solution**:
1. ✅ Add `noreply@deepmineai.vip` to contacts
2. ✅ Mark email as "Not Spam"
3. ✅ Check Resend domain verification (should already be done)

---

### **Problem 4: Variable Not Showing**

**Symptoms**:
- Can't find "Environment variables" section
- Add variable button missing

**Solution**:
1. ✅ Make sure you're on **"Settings"** tab (not Deployments)
2. ✅ Scroll down past "General" and "Builds & deployments"
3. ✅ Look for **"Environment variables"** heading
4. ✅ If still missing, try refreshing the page

---

## 📧 **RESEND API KEY DETAILS**

**Current API Key**: `re_JE9L6QBy_8bPUjA8rkDLb6QkABTQb4sC7`

**From Email**: `noreply@deepmineai.vip`

**Domain**: `deepmineai.vip` (should be verified in Resend)

**Email Service**: Resend (https://resend.com)

**Monthly Limit**: 3,000 emails/month (free tier)

**Email Types Configured**:
- ✅ Welcome email
- ✅ Email verification
- ✅ Password reset
- ✅ KYC approval (NEW) ← Task 10
- ✅ Withdrawal confirmation
- ✅ Contract purchased

---

## 🎯 **VERIFICATION CHECKLIST**

Before marking setup as complete:

- [ ] Logged into Cloudflare Dashboard
- [ ] Navigated to Workers & Pages → deepmine-ai
- [ ] Clicked on "Settings" tab
- [ ] Found "Environment variables" section
- [ ] Clicked "Add variable"
- [ ] Entered: `RESEND_API_KEY` = `re_JE9L6QBy_8bPUjA8rkDLb6QkABTQb4sC7`
- [ ] Selected "Production" environment
- [ ] Clicked "Save"
- [ ] Saw confirmation that variable was added
- [ ] (Optional) Redeployed project
- [ ] Tested KYC approval
- [ ] Checked console for success message
- [ ] Verified email received in inbox

---

## ✅ **SUCCESS CONFIRMATION**

Once setup is complete, you should be able to:

1. ✅ Approve KYC submissions in admin panel
2. ✅ See console log: `✅ KYC approval email sent successfully`
3. ✅ Users receive automated email within 1-2 minutes
4. ✅ Email contains complete machine purchase guide
5. ✅ Email includes ETH wallet address and instructions

---

## 📞 **NEED HELP?**

If you encounter any issues during setup:

1. **Screenshot the issue** and describe what's wrong
2. **Check browser console** for error messages
3. **Verify Cloudflare Dashboard** shows the variable
4. **Try redeploying** the project after adding the variable

I'll be happy to help troubleshoot! 🚀

---

**Ready to test?** Once you've completed the setup, let me know and we can verify the KYC approval email is working correctly!
