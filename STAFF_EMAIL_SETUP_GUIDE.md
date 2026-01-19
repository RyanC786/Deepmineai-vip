# Staff Email Notification Setup Guide

## ✅ What's Been Implemented

Automated email notifications are now sent to new staff members when their account is created. The email includes:

### Email Contents:
- ✅ **Login Credentials**: Username, email, temporary password, role
- ✅ **Permissions List**: All areas they have access to
- ✅ **Direct Login Link**: One-click access to CRM dashboard
- ✅ **Security Reminders**: Change password, keep credentials confidential
- ✅ **Professional Design**: Green-themed, branded email template

---

## 📧 Email Preview

When you create a new staff member, they receive:

**Subject**: Welcome to DeepMine AI Team - Your CRM Access

**From**: DeepMine AI <noreply@deepmineai.vip>

**Content Includes**:

```
🐉 Welcome to DeepMine AI Team!
Your CRM Account Has Been Created

Hello [Staff Name]!

Welcome to the DeepMine AI team! We're excited to have you onboard...

🔐 Your Login Credentials
────────────────────────────────
Username:          john.doe
Email:             john@example.com
Temporary Password: SecurePass123
Role:              Support Agent

⚠️ Important: Please change your password after your first login for security.

📋 Your Access Permissions
You have been granted access to the following areas:
• View Dashboard
• View Leads
• View Tasks

[Login to CRM Dashboard] (Big green button)

🔒 Security Reminder: Never share your login credentials with anyone.
```

---

## 🔧 Configuration Required (ONE-TIME SETUP)

### Step 1: Get Resend API Key

1. Go to https://resend.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `re_`)

### Step 2: Add API Key to Cloudflare

Run this command in your terminal:

```bash
npx wrangler secret put RESEND_API_KEY --project-name deepmine-ai
```

When prompted, paste your Resend API key.

### Step 3: Verify Domain (Optional but Recommended)

To send from `noreply@deepmineai.vip`:

1. In Resend dashboard, go to Domains
2. Add domain: `deepmineai.vip`
3. Add the DNS records shown by Resend to your Cloudflare DNS
4. Wait for verification (usually instant)

**Note**: You can test without domain verification using Resend's default domain, but emails may go to spam.

---

## 🧪 Testing the Email System

### Test Process:

1. Go to: https://www.deepmineai.vip/admin/crm/staff
2. Click "Add Staff Member"
3. Fill in the form:
   ```
   Full Name: Test Staff Member
   Email: [YOUR_EMAIL] (use your real email for testing)
   Username: teststaff
   Password: TestPassword123
   Role: Select any role
   ```
4. **Tick a few permissions** (e.g., View Dashboard, View Leads)
5. Click "Save Staff Member"
6. ✅ Check your email inbox (might take 1-2 minutes)
7. Look for email from "DeepMine AI"

### Expected Result:

- Staff member created successfully
- Success message shows: "Staff member created successfully. Welcome email sent to [email]"
- Email arrives with all login credentials
- Email lists the permissions you ticked
- "Login to CRM Dashboard" button works

### If Email Doesn't Arrive:

1. **Check spam/junk folder**
2. **Check browser console** for errors:
   - Open browser DevTools (F12)
   - Look for email-related errors
3. **Check Cloudflare logs**:
   ```bash
   npx wrangler pages deployment tail --project-name deepmine-ai
   ```
4. **Verify RESEND_API_KEY** is set:
   ```bash
   npx wrangler secret list --project-name deepmine-ai
   ```

---

## 🎯 How It Works

### For Admins (Creating Staff):

1. Navigate to Staff Management page
2. Fill in staff details (name, email, username, password)
3. **Tick permission checkboxes** for areas they can access
4. Click Save
5. System automatically:
   - Creates staff account in database
   - Saves permissions to crm_staff table
   - Builds permission list
   - Sends welcome email with credentials
   - Shows success message

### For New Staff (Receiving Email):

1. Receives email with subject "Welcome to DeepMine AI Team"
2. Sees their login credentials clearly displayed
3. Reviews their granted permissions
4. Clicks "Login to CRM Dashboard" button
5. Lands on: https://www.deepmineai.vip/admin/crm/login
6. Logs in with provided credentials
7. Sees only the navigation links they have permission for

---

## 📝 Email Details

### Email Provider:
- **Service**: Resend (https://resend.com)
- **Why Resend**: Reliable, developer-friendly, excellent deliverability
- **Cost**: Free tier includes 3,000 emails/month

### Email Template Features:
- ✅ Responsive design (works on mobile)
- ✅ Professional branding with DeepMine AI colors
- ✅ Clear credential presentation
- ✅ Security warnings
- ✅ Direct action button
- ✅ Footer with company info

### Security Measures:
- Password only sent once (in this email)
- Reminder to change password after first login
- Warning about keeping credentials confidential
- No plain password storage in database (hashed)

---

## 🐛 Troubleshooting

### Problem: No email received

**Solutions**:
1. Check if RESEND_API_KEY is configured:
   ```bash
   npx wrangler secret list --project-name deepmine-ai
   ```
2. Check browser console for errors
3. Verify email address is correct
4. Check spam/junk folder
5. Try with a different email provider (Gmail, Outlook)

### Problem: Email goes to spam

**Solutions**:
1. Verify domain in Resend
2. Add DNS records (SPF, DKIM, DMARC)
3. Ask recipient to mark as "Not Spam"
4. Warm up the domain by sending test emails gradually

### Problem: Wrong permissions in email

**Check**:
1. Make sure you ticked the correct checkboxes
2. Verify permissions were saved (check crm_staff table)
3. Refresh the staff list to see saved permissions

---

## 🔐 Security Notes

1. **Password Security**: 
   - Passwords are sent in plain text in email (only time visible)
   - Stored as hashed in database
   - Staff should change password immediately after first login

2. **Email Security**:
   - Email contains sensitive information
   - Footer warns: "This email contains sensitive information. Please keep it confidential."
   - Consider implementing password reset flow for additional security

3. **Production Best Practices**:
   - Use strong passwords for staff accounts
   - Enable 2FA for admin accounts
   - Implement password change enforcement
   - Log all staff account creations

---

## 📊 Monitoring

### Check Email Sending Logs:

```bash
# View real-time logs
npx wrangler pages deployment tail --project-name deepmine-ai

# Look for:
# ✅ "Welcome email sent to [email]"
# ❌ "Failed to send welcome email: [error]"
```

### Check Resend Dashboard:

1. Login to Resend
2. Go to Logs section
3. See all sent emails
4. Check delivery status
5. View bounce/complaint rates

---

## 🚀 Next Steps

1. **Configure RESEND_API_KEY** (one-time setup)
2. **Verify domain** for better deliverability
3. **Test with your email** to see the template
4. **Add a real staff member** to verify the flow
5. **Monitor delivery** in Resend dashboard

---

## 📎 Quick Reference

**Staff Management URL**: https://www.deepmineai.vip/admin/crm/staff
**Login URL**: https://www.deepmineai.vip/admin/crm/login
**Email From**: noreply@deepmineai.vip

**Command to set API key**:
```bash
npx wrangler secret put RESEND_API_KEY --project-name deepmine-ai
```

**Command to test**:
1. Add staff member with your email
2. Check email inbox
3. Click login button
4. Verify permissions work

---

## ✅ Status

- ✅ Email template created
- ✅ Email function implemented
- ✅ Integrated into staff creation
- ✅ Deployed to production
- ⏳ Pending: RESEND_API_KEY configuration
- ⏳ Pending: Domain verification (optional)
- ⏳ Pending: Testing with real email

---

**Ready to test!** Just configure the RESEND_API_KEY and add a new staff member with your email address.
