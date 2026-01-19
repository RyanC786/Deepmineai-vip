# Google Cloud Platform Setup Guide
## For DeepMine AI Support Features

---

## 🎯 **WHAT WE'RE SETTING UP**

1. ✅ Google Cloud Project
2. ✅ Google Drive API (for KYC document backup)
3. ✅ Google Sheets API (for logging)
4. ✅ Service Account (for API authentication)
5. ✅ Drive Folders & Sheets (for organizing data)

---

## 📋 **STEP-BY-STEP INSTRUCTIONS**

### **STEP 1: Create Google Cloud Project** (5 minutes)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account (use kyc@deepmineai.vip or your main account)

2. **Create New Project:**
   - Click "Select a project" dropdown at the top
   - Click "NEW PROJECT"
   - **Project Name:** `DeepMine AI Platform`
   - **Project ID:** Will auto-generate (e.g., `deepmine-ai-platform-12345`)
   - **Location:** Leave as "No organization"
   - Click "CREATE"
   - Wait ~30 seconds for project creation

3. **Select Your New Project:**
   - Click "Select a project" dropdown again
   - Click "DeepMine AI Platform" to select it
   - You should see the project name at the top

---

### **STEP 2: Enable Google Drive API** (2 minutes)

1. **Navigate to APIs & Services:**
   - In the left sidebar, click ☰ menu
   - Click "APIs & Services" → "Library"

2. **Enable Drive API:**
   - In the search box, type: `Google Drive API`
   - Click on "Google Drive API"
   - Click "ENABLE" button
   - Wait for it to enable (~10 seconds)

---

### **STEP 3: Enable Google Sheets API** (2 minutes)

1. **Go Back to API Library:**
   - Click "APIs & Services" → "Library" again

2. **Enable Sheets API:**
   - In the search box, type: `Google Sheets API`
   - Click on "Google Sheets API"
   - Click "ENABLE" button
   - Wait for it to enable (~10 seconds)

---

### **STEP 4: Create Service Account** (5 minutes)

1. **Navigate to Service Accounts:**
   - Click ☰ menu → "IAM & Admin" → "Service Accounts"
   - Click "+ CREATE SERVICE ACCOUNT" at the top

2. **Service Account Details:**
   - **Service account name:** `deepmine-api-service`
   - **Service account ID:** Will auto-fill (e.g., `deepmine-api-service@...`)
   - **Description:** `Service account for DeepMine AI platform APIs`
   - Click "CREATE AND CONTINUE"

3. **Grant Access (Optional):**
   - **Select a role:** Skip this (not needed)
   - Click "CONTINUE"

4. **Grant Users Access (Optional):**
   - Skip this step
   - Click "DONE"

---

### **STEP 5: Create Service Account Key** (3 minutes)

1. **Find Your Service Account:**
   - You should see `deepmine-api-service@...` in the list
   - Click on the email address

2. **Create JSON Key:**
   - Click the "KEYS" tab at the top
   - Click "ADD KEY" → "Create new key"
   - **Key type:** Select "JSON"
   - Click "CREATE"
   
3. **Download Key:**
   - A JSON file will download automatically
   - **IMPORTANT:** Keep this file safe! It's like a password
   - Rename it to: `deepmine-service-account.json`
   - **DON'T share this file or commit it to GitHub!**

4. **Copy the Service Account Email:**
   - Copy the full email address (e.g., `deepmine-api-service@deepmine-ai-platform-12345.iam.gserviceaccount.com`)
   - **Save this email** - you'll need it in the next steps!

---

### **STEP 6: Create Google Drive Folders** (5 minutes)

1. **Sign in to Google Drive:**
   - Go to: https://drive.google.com
   - Sign in with your account (kyc@deepmineai.vip recommended)

2. **Create Folder Structure:**
   
   **For KYC Documents:**
   - Click "+ New" → "Folder"
   - Name: `DeepMine KYC Documents`
   - Click "Create"
   - Open the folder
   - Create subfolders for organization:
     - `2025-12` (current month)
     - Add more month folders as needed

   **For User Activity Logs:**
   - Go back to "My Drive"
   - Click "+ New" → "Folder"
   - Name: `DeepMine User Logs`
   - Click "Create"

3. **Share Folders with Service Account:**
   
   **Share KYC Folder:**
   - Right-click "DeepMine KYC Documents"
   - Click "Share"
   - In "Add people and groups", paste your service account email
   - **Role:** Editor
   - **Uncheck** "Notify people"
   - Click "Share"
   - Click "Share anyway" if warned

   **Share Logs Folder:**
   - Right-click "DeepMine User Logs"
   - Click "Share"
   - Paste service account email
   - **Role:** Editor
   - **Uncheck** "Notify people"
   - Click "Share"

4. **Get Folder IDs:**
   
   **KYC Folder ID:**
   - Open "DeepMine KYC Documents" folder
   - Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the long ID after `/folders/`
   - Example: `1a2b3c4d5e6f7g8h9i0j`
   - **Save this as KYC_FOLDER_ID**

   **Logs Folder ID:**
   - Open "DeepMine User Logs" folder
   - Copy the folder ID from URL
   - **Save this as LOGS_FOLDER_ID**

---

### **STEP 7: Create Google Sheets** (5 minutes)

1. **Create Support Chat Log Sheet:**
   - Go to: https://sheets.google.com
   - Click "+ Blank" to create new sheet
   - Name it: `DeepMine Support Chat Logs`
   
   **Add Headers (Row 1):**
   - A1: `Timestamp`
   - B1: `User ID`
   - C1: `Email`
   - D1: `User Message`
   - E1: `Bot Response`
   - F1: `Conversation ID`

   **Format:**
   - Select row 1, make it bold
   - Add background color (light blue)
   - Freeze row 1 (View → Freeze → 1 row)

2. **Create User Activity Log Sheet:**
   - Click "+ " to create another new sheet
   - Name it: `DeepMine User Activity Logs`
   
   **Add Two Tabs:**
   
   **Tab 1: "Registration Log"**
   - Rename first sheet to "Registration Log"
   - Headers (Row 1):
     - A1: `Date`
     - B1: `User ID`
     - C1: `Email`
     - D1: `Full Name`
     - E1: `Phone`
     - F1: `Country`
     - G1: `Referral Code`

   **Tab 2: "Deposit Log"**
   - Click "+" at bottom to add new sheet
   - Name it: "Deposit Log"
   - Headers (Row 1):
     - A1: `Date`
     - B1: `User ID`
     - C1: `Email`
     - D1: `Amount`
     - E1: `User Wallet Address`
     - F1: `TX Hash`
     - G1: `Status`

   **Format Both Tabs:**
   - Select row 1, make it bold
   - Add background color
   - Freeze row 1

3. **Share Sheets with Service Account:**
   
   **Share Support Chat Log:**
   - Click "Share" button (top right)
   - Paste service account email
   - **Role:** Editor
   - **Uncheck** "Notify people"
   - Click "Share"

   **Share User Activity Log:**
   - Click "Share" button
   - Paste service account email
   - **Role:** Editor
   - **Uncheck** "Notify people"
   - Click "Share"

4. **Get Spreadsheet IDs:**
   
   **Support Chat Log ID:**
   - Look at URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the long ID between `/d/` and `/edit`
   - **Save this as SUPPORT_SHEET_ID**

   **User Activity Log ID:**
   - Open "DeepMine User Activity Logs"
   - Copy spreadsheet ID from URL
   - **Save this as ACTIVITY_SHEET_ID**

---

## 📝 **STEP 8: Collect All Credentials** (2 minutes)

You should now have:

1. ✅ **Service Account JSON File** (`deepmine-service-account.json`)
2. ✅ **Service Account Email** (e.g., `deepmine-api-service@...iam.gserviceaccount.com`)
3. ✅ **KYC Folder ID** (e.g., `1a2b3c4d5e6f7g8h9i0j`)
4. ✅ **Logs Folder ID** (e.g., `9i8h7g6f5e4d3c2b1a0`)
5. ✅ **Support Sheet ID** (e.g., `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`)
6. ✅ **Activity Sheet ID** (e.g., `1SmwA1YvwA8b2TdZEzj3MqTmsZ5dqE1H3vBwzKvQZUFQ`)

---

## 🔐 **STEP 9: Add Secrets to Cloudflare** (5 minutes)

Now we need to add these to Cloudflare as secrets.

**Open your terminal and run:**

```bash
cd /home/user/webapp

# 1. Add Service Account Credentials (JSON content)
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY
# When prompted, paste the ENTIRE contents of deepmine-service-account.json file
# Copy from: {"type":"service_account",...} to the end
# Press Enter twice when done

# 2. Add KYC Folder ID
npx wrangler secret put GOOGLE_DRIVE_KYC_FOLDER_ID
# Paste: 1a2b3c4d5e6f7g8h9i0j (your actual folder ID)
# Press Enter

# 3. Add Logs Folder ID
npx wrangler secret put GOOGLE_DRIVE_LOGS_FOLDER_ID
# Paste: 9i8h7g6f5e4d3c2b1a0 (your actual folder ID)
# Press Enter

# 4. Add Support Sheet ID
npx wrangler secret put GOOGLE_SHEET_SUPPORT_ID
# Paste: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms (your actual sheet ID)
# Press Enter

# 5. Add Activity Sheet ID
npx wrangler secret put GOOGLE_SHEET_ACTIVITY_ID
# Paste: 1SmwA1YvwA8b2TdZEzj3MqTmsZ5dqE1H3vBwzKvQZUFQ (your actual sheet ID)
# Press Enter
```

---

## ✅ **VERIFICATION CHECKLIST**

Before moving forward, verify:

- [ ] Google Cloud Project created
- [ ] Google Drive API enabled
- [ ] Google Sheets API enabled
- [ ] Service Account created
- [ ] Service Account JSON key downloaded
- [ ] Google Drive folders created and shared
- [ ] Google Sheets created and shared with service account
- [ ] All IDs collected and saved
- [ ] All secrets added to Cloudflare

---

## 🎯 **WHAT'S NEXT?**

Once you complete all these steps:

1. **I'll implement the code** to:
   - Upload KYC documents to Google Drive
   - Log support conversations to Google Sheets
   - Log user activity to Google Sheets
   - Send email notifications

2. **Test everything** to ensure:
   - Files upload correctly
   - Sheets are populated
   - Emails are sent

3. **Deploy to production**

---

## ⚠️ **SECURITY NOTES**

**IMPORTANT:**
- ✅ **NEVER** commit `deepmine-service-account.json` to GitHub
- ✅ **NEVER** share the JSON file publicly
- ✅ Keep the service account email private
- ✅ Only share Drive folders with the service account (not publicly)
- ✅ Regularly audit access to your Google Drive and Sheets

**The JSON file is like a master password - treat it accordingly!**

---

## 📞 **NEED HELP?**

**Common Issues:**

**Q: "I can't find the Service Accounts menu"**
- Make sure you selected the correct project at the top
- Go to ☰ menu → "IAM & Admin" → "Service Accounts"

**Q: "API not enabled" error**
- Go to APIs & Services → Library
- Search for the API and click "Enable"

**Q: "Permission denied" when sharing folders**
- Make sure you pasted the service account email correctly
- Set role to "Editor" not "Viewer"
- Uncheck "Notify people" before sharing

**Q: "Can't find folder ID"**
- Open the folder in Google Drive
- Look at the URL in browser
- Copy the long string after `/folders/`

---

## 🚀 **READY?**

**Follow each step carefully, and let me know when you've:**
1. ✅ Completed all 9 steps
2. ✅ Have all IDs ready
3. ✅ Added secrets to Cloudflare

**Then I'll start implementing the integration code!** 🎉

---

**Need help with any step? Take a screenshot and I'll guide you through it!** 📸
