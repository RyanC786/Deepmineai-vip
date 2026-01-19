# DeepMine AI - Admin Login Guide

## 🚨 IMPORTANT: Two Different Login Systems

DeepMine AI has **TWO separate login systems** for different user types:

---

## 1️⃣ **Super Admin Login** (Full System Access)
**URL:** `https://www.deepmineai.vip/admin/panel/login`

### Who Should Use This:
- System administrators
- Financial managers
- Users who need access to:
  - User management
  - Financial data (withdrawals, deposits)
  - Machine management
  - System settings
  - All admin features

### Credentials:
- Use your **admin email and password**
- This is the main administrative account

### Features:
- Full system access
- Manage finances
- Manage users
- Manage machines
- View all reports

---

## 2️⃣ **CRM Staff Login** (Customer Relations Only)
**URL:** `https://www.deepmineai.vip/admin/crm/login`

### Who Should Use This:
- CRM staff members
- Support agents
- Customer service representatives
- Users who need access to:
  - Customer leads
  - Support tasks
  - Activity logs
  - CRM dashboard
  - KYC verification (if permitted)

### Credentials:
- Use your **staff username and password**
- Example: Rayhan uses username `Khan`

### Features:
- Limited CRM access only
- Cannot access financial data
- Cannot manage machines
- Cannot manage users
- Permission-based navigation

---

## 🔄 Switching Between Logins

### If you're on CRM login but need Super Admin:
1. Look for the link: **"Super Admin Access"**
2. Or go directly to: `https://www.deepmineai.vip/admin/panel/login`

### If you're on Super Admin login but need CRM Staff:
1. Look for the link: **"CRM Staff Access"** or **"Staff Portal"**
2. Or go directly to: `https://www.deepmineai.vip/admin/crm/login`

---

## 🆘 Troubleshooting

### "I can't log in as admin, it redirects to CRM staff login"
**Solution:** Go directly to the Super Admin login URL:
```
https://www.deepmineai.vip/admin/panel/login
```

### "I'm in incognito and forgot the URL"
**URLs to remember:**
- Super Admin: `/admin/panel/login`
- CRM Staff: `/admin/crm/login`

### "I see 'Internal Server Error' on leads page"
**Fixed!** The leads page now works correctly for CRM staff. Make sure you:
1. Log in with your CRM staff credentials
2. Hard refresh the page (Ctrl+Shift+R)
3. Check browser console for any remaining errors

---

## 📋 Quick Reference

| Login Type | URL | Use Case | Example User |
|------------|-----|----------|--------------|
| **Super Admin** | `/admin/panel/login` | Full system access | System admin |
| **CRM Staff** | `/admin/crm/login` | Customer relations | Rayhan (Khan) |

---

## 🔒 Security Notes

- Never share admin credentials with CRM staff
- CRM staff should only use their assigned username/password
- Super Admin has access to financial data
- CRM Staff access is permission-based and limited
- Both systems use secure token-based authentication

---

**Last Updated:** December 19, 2025
**Version:** 1.0.0
