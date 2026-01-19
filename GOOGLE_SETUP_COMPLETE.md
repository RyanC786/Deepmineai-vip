# ✅ Google Cloud Setup - COMPLETE

**Status:** All Google Cloud services configured and ready for integration!

**Completed:** December 11, 2025

---

## 📋 **SETUP SUMMARY**

### **1. Google Cloud Project**
- **Project Name:** `DeepMine AI Platform`
- **Project ID:** `cool-framing-480917-a0`
- **Service Account:** `deepmine-api-service-155@cool-framing-480917-a0.iam.gserviceaccount.com`
- ✅ Google Drive API enabled
- ✅ Google Sheets API enabled

---

### **2. Google Drive Folders**

**KYC Documents Folder:**
- **Folder ID:** `19_SUGRYCv7vM858PqVytf8IXNAsP19do`
- **URL:** https://drive.google.com/drive/folders/19_SUGRYCv7vM858PqVytf8IXNAsP19do
- **Purpose:** Auto-backup of KYC uploads (ID front, ID back, selfie)
- **Shared with:** Service account (Editor access)

**User Logs Folder:**
- **Folder ID:** `1mZKqUcmWlj9mPwGjXsau1yJo43rNxwuG`
- **URL:** https://drive.google.com/drive/folders/1mZKqUcmWlj9mPwGjXsau1yJo43rNxwuG
- **Purpose:** Backup storage for activity logs
- **Shared with:** Service account (Editor access)

---

### **3. Google Sheets**

**Support Chat Logs:**
- **Sheet ID:** `1Esu92vUcN4OjgCOtd3gNXKDcLhZ_MfnywcBpjvWSSxU`
- **URL:** https://docs.google.com/spreadsheets/d/1Esu92vUcN4OjgCOtd3gNXKDcLhZ_MfnywcBpjvWSSxU
- **Purpose:** Log all AI chatbot conversations
- **Columns:** Timestamp, User ID, Email, User Message, Bot Response, Conversation ID
- **Shared with:** Service account (Editor access)

**User Activity Logs:**
- **Sheet ID:** `1kdcsO1ZTqrj2E_R2wKC1Fl-d_QqMK5gDbybQrs6QaLE`
- **URL:** https://docs.google.com/spreadsheets/d/1kdcsO1ZTqrj2E_R2wKC1Fl-d_QqMK5gDbybQrs6QaLE
- **Purpose:** Log user registrations and deposit activity
- **Tabs:**
  - **Registration Log:** Date, User ID, Email, Full Name, Phone, Country, Referral Code
  - **Deposit Log:** Date, User ID, Email, Amount, User Wallet Address, TX Hash, Status
- **Shared with:** Service account (Editor access)

---

### **4. Cloudflare Secrets**

All credentials securely stored in Cloudflare Pages:

```bash
✅ GOOGLE_SERVICE_ACCOUNT_KEY         (Service account JSON credentials)
✅ GOOGLE_DRIVE_KYC_FOLDER_ID         (19_SUGRYCv7vM858PqVytf8IXNAsP19do)
✅ GOOGLE_DRIVE_LOGS_FOLDER_ID        (1mZKqUcmWlj9mPwGjXsau1yJo43rNxwuG)
✅ GOOGLE_SHEET_SUPPORT_ID            (1Esu92vUcN4OjgCOtd3gNXKDcLhZ_MfnywcBpjvWSSxU)
✅ GOOGLE_SHEET_ACTIVITY_ID           (1kdcsO1ZTqrj2E_R2wKC1Fl-d_QqMK5gDbybQrs6QaLE)
```

**Verify secrets anytime:**
```bash
npx wrangler pages secret list --project-name=deepmine-ai
```

---

## 🔐 **SECURITY**

- ✅ Service account JSON file stored locally: `deepmine-service-account.json`
- ✅ Added to `.gitignore` (will NOT be committed to GitHub)
- ✅ All secrets encrypted in Cloudflare
- ✅ Service account has minimal permissions (only Drive + Sheets access)
- ✅ Folders/Sheets only accessible by service account

---

## 📋 **WHAT'S CONFIGURED**

### **Ready to Implement:**

1. **KYC Document Backup** ✅
   - Auto-upload to Google Drive when user submits KYC
   - Organized by user folders
   - Email notification to: `kyc@deepmineai.vip`

2. **Support Chatbot Logging** ✅
   - All conversations logged to Google Sheets
   - Real-time updates
   - Email notification to: `support@deepmineai.vip`

3. **User Activity Logging** ✅
   - Registration tracking
   - Deposit tracking with wallet addresses
   - Email notification to: `noreply@deepmineai.vip`

---

## 🎯 **NEXT STEPS**

Now we can implement the actual features:

### **Priority 1: KYC Document Management** (2-3 hours)
- Modify KYC upload endpoint to backup to Google Drive
- Create user folders automatically
- Send email notifications

### **Priority 2: User Activity Logging** (2-3 hours)
- Log new registrations to Google Sheets
- Log deposit submissions to Google Sheets
- Send email notifications

### **Priority 3: AI Support Chatbot** (3-4 hours)
- Create chatbot UI component
- Integrate OpenAI API
- Log conversations to Google Sheets
- Send email notifications

---

## 📊 **COST ESTIMATE**

**Google Cloud:**
- ✅ **FREE** - Drive API (15 GB free storage)
- ✅ **FREE** - Sheets API (unlimited reads/writes)
- ✅ **FREE** - Service account usage

**Total Google Cost:** $0/month

**OpenAI (for chatbot only):**
- Estimated: $10-50/month (GPT-3.5-turbo)

---

## 🔄 **MAINTENANCE**

**To re-add secrets (if needed):**
```bash
cd /home/user/webapp
./add-google-secrets.sh
```

**To rotate service account key:**
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click on service account
3. Go to KEYS tab
4. Delete old key
5. Create new key
6. Update `deepmine-service-account.json`
7. Run `./add-google-secrets.sh`

**To add more folders/sheets:**
1. Create in Google Drive/Sheets
2. Share with: `deepmine-api-service-155@cool-framing-480917-a0.iam.gserviceaccount.com`
3. Copy folder/sheet ID from URL
4. Add as Cloudflare secret

---

## ✅ **VERIFICATION CHECKLIST**

- [x] Google Cloud Project created
- [x] Google Drive API enabled
- [x] Google Sheets API enabled
- [x] Service Account created
- [x] Service Account JSON key downloaded
- [x] Google Drive folders created and shared
- [x] Google Sheets created and shared
- [x] All IDs collected
- [x] All secrets added to Cloudflare
- [x] Secrets verified in production
- [x] `.gitignore` updated for security

---

## 🎉 **STATUS: READY FOR INTEGRATION!**

All Google Cloud infrastructure is configured and ready. We can now:
1. Implement KYC document backup
2. Implement user activity logging
3. Implement AI support chatbot

**Which feature would you like to implement first?**

---

**Setup completed by:** AI Assistant  
**Date:** December 11, 2025  
**Verified:** ✅ All credentials working
