# 🔐 DeepMine AI - Admin Systems Guide

## Overview

The DeepMine AI platform has **TWO SEPARATE admin systems** that work together:

### 1. V4 Admin Dashboard (Existing)
**Primary system for managing users, packages, and platform operations**

### 2. NEW Admin Panel (Just Built)
**Specialized system for managing withdrawals and machine purchases**

---

## 🎯 V4 Admin Dashboard

### Login URL
```
https://www.deepmineai.vip/admin-login
```

### Features
- 📊 **Platform Statistics**: Total users, verified users, active miners, balance, commissions
- 👥 **User Management**: View, edit, delete users, update VIP levels, manage balances
- ⚙️ **Mining Packages**: Create, edit, delete package templates (types)
- 💻 **Active Miners**: View all users' package ownership and mining status
- 💰 **Commissions**: Track referral commissions
- 🆔 **KYC Management**: Approve/reject KYC submissions

### Access Points
- Login: `https://www.deepmineai.vip/admin-login`
- Dashboard: `https://www.deepmineai.vip/admin/dashboard`
- KYC Management: `https://www.deepmineai.vip/admin/kyc`

### Key Characteristics
- Uses `/admin/dashboard` route space
- Full platform management capabilities
- Integrated with V4 design system
- Dragon logo with glow animation

---

## 🆕 NEW Admin Panel

### Login URL
```
https://www.deepmineai.vip/admin/panel/login
```

### Features
- 💸 **Withdrawal Management**: Approve/complete/reject withdrawal requests
- 🖥️ **Machine Purchases**: Activate/reject machine purchase requests
- 📊 **Real-time Statistics**: Withdrawal and machine purchase stats
- 🔒 **Secure Operations**: JWT-based authentication with bcrypt hashing

### Access Points
- Login: `https://www.deepmineai.vip/admin/panel/login`
- Withdrawals: `https://www.deepmineai.vip/admin/panel/withdrawals`
- Machines: `https://www.deepmineai.vip/admin/panel/machines`

### Key Characteristics
- Uses `/admin/panel/*` route space (separate from V4)
- Focused on withdrawal and machine management only
- Modern dark theme with cyan accents
- Integrated with withdrawal system

---

## 🔑 Authentication

### Shared Credentials
**Both systems use the SAME admin account:**

```
Email:    admin@deepmineai.vip
Password: DeepMine@Admin#2024!Secure
```

### How It Works
1. Both systems use the **same login page** (`adminLoginPageHTML`)
2. Login page detects which URL you came from
3. **Smart redirect** based on entry point:
   - From `/admin-login` → redirects to `/admin/dashboard` (V4)
   - From `/admin/panel/login` → redirects to `/admin/panel/withdrawals` (NEW)
4. Both systems verify admin status from database

### Authentication Flow
```
User enters credentials
    ↓
Verify email/password with database
    ↓
Check account_status = 'admin'
    ↓
Create admin_token cookie (JWT, 24hr expiration)
    ↓
Redirect to appropriate dashboard
```

---

## 🚀 Quick Start Guide

### For V4 Admin Dashboard
1. Go to: `https://www.deepmineai.vip/admin-login`
2. Enter email: `admin@deepmineai.vip`
3. Enter password: `DeepMine@Admin#2024!Secure`
4. Click "Sign In"
5. You'll be redirected to V4 Dashboard at `/admin/dashboard`

### For NEW Admin Panel
1. Go to: `https://www.deepmineai.vip/admin/panel/login`
2. Enter email: `admin@deepmineai.vip`
3. Enter password: `DeepMine@Admin#2024!Secure`
4. Click "Sign In"
5. You'll be redirected to Withdrawals page at `/admin/panel/withdrawals`

---

## 🔀 When to Use Each System

### Use V4 Admin Dashboard For:
- Creating/editing mining package **types** (templates)
- Managing user accounts and VIP levels
- Viewing platform-wide statistics
- Managing user balances
- Approving KYC submissions
- Tracking commissions
- Viewing all active miners (who owns which packages)

### Use NEW Admin Panel For:
- Approving/rejecting **withdrawal requests**
- Completing withdrawals with transaction hashes
- Activating **machine purchase requests**
- Managing pending machine orders
- Viewing withdrawal/machine statistics

---

## 🛠️ Technical Details

### Route Structure
```
V4 Admin (existing):
/admin-login              → Login page
/admin/dashboard          → Main dashboard
/admin/kyc                → KYC management
/api/admin/stats          → Dashboard stats
/api/admin/users          → User management
/api/admin/packages       → Package management

NEW Admin Panel (just built):
/admin/panel/login        → Login page
/admin/panel/withdrawals  → Withdrawal management
/admin/panel/machines     → Machine management
/api/admin/withdrawals/*  → Withdrawal APIs
/api/admin/machines/*     → Machine APIs
/api/admin/auth/*         → Authentication APIs
```

### Database Schema
```sql
-- Admin user in users table
account_status = 'admin'  -- Required for admin access
password_hash              -- Bcrypt hashed password
email = 'admin@deepmineai.vip'
```

### Security Features
- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT-based session tokens (24-hour expiration)
- ✅ HTTP-only, secure, SameSite cookies
- ✅ Role-based access control (admin-only middleware)
- ✅ Database verification of admin status
- ✅ Auto-redirect to login if not authenticated

---

## 🔒 Security Best Practices

1. **Never share admin credentials**
2. **Always logout when done**
3. **Use private browsing on shared computers**
4. **Password is case-sensitive** - use copy-paste to avoid typos
5. **Check browser console** (F12) if login issues occur
6. **Clear cookies** if experiencing authentication problems

---

## 🐛 Troubleshooting

### Cannot Access V4 Dashboard
- Verify URL is exactly: `https://www.deepmineai.vip/admin-login` (with hyphen)
- Check you're using the correct credentials
- Try clearing browser cache and cookies
- Use incognito/private mode to test

### Cannot Access NEW Admin Panel
- Verify URL is exactly: `https://www.deepmineai.vip/admin/panel/login` (with /panel/)
- Use same credentials as V4 dashboard
- Check browser console for errors (F12)
- Try hard refresh (Ctrl+Shift+R)

### "Invalid admin token" Error
- Clear browser cookies
- Perform hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Logout and login again
- Try incognito/private mode

### Redirected to Wrong Dashboard
- URL determines redirect destination:
  - `/admin-login` → V4 dashboard
  - `/admin/panel/login` → NEW panel
- Clear cookies and try again

---

## 📊 Feature Comparison

| Feature | V4 Dashboard | NEW Panel |
|---------|-------------|-----------|
| User Management | ✅ Full | ❌ No |
| Package Types | ✅ CRUD | ❌ No |
| Active Miners | ✅ View All | ❌ No |
| Commissions | ✅ Track | ❌ No |
| KYC Management | ✅ Full | ❌ No |
| Withdrawals | ❌ No | ✅ Full |
| Machine Purchases | ❌ No | ✅ Full |
| Statistics | ✅ Platform | ✅ Withdrawals/Machines |

---

## 📝 Important Notes

1. **Both systems are PRODUCTION-READY** and fully functional
2. **Same admin account** works for both systems
3. **No conflicts** - systems use different URL spaces
4. **Independent operation** - can use either system without affecting the other
5. **Shared authentication** - login once, access either system

---

## 🚀 Live Deployment

- **Production**: `https://www.deepmineai.vip`
- **Latest Deploy**: `https://25ca4136.deepmine-ai.pages.dev`
- **Platform**: Cloudflare Pages
- **Status**: ✅ Both systems ACTIVE

---

## 📅 Last Updated
2025-12-07 00:45 UTC

Both admin systems fully operational ✅
