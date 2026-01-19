# 🔐 Admin System Credentials

## Two Completely Separate Admin Systems

---

## 🎯 V4 Admin Dashboard (Existing)

### Login URL
```
https://www.deepmineai.vip/admin-login
```

### Credentials
```
Username: admin
Password: DeepMineAdmin2024!
```

### Features
- User management (view, edit, delete)
- Package type management (create, edit, delete)
- Active miners monitoring
- Platform statistics
- Commission tracking
- KYC approval

### Technical Details
- Authentication: **Username/Password**
- API Endpoint: `/api/auth/admin-login`
- Token: `admin_token` cookie (JWT)
- Redirects to: `/admin/dashboard`

---

## 🆕 NEW Admin Panel (Withdrawal & Machine Management)

### Login URL
```
https://www.deepmineai.vip/admin/panel/login
```

### Credentials
```
Email:    admin@deepmineai.vip
Password: DeepMine@Admin#2024!Secure
```

### Features
- Withdrawal approvals (approve/complete/reject)
- Machine purchase activations
- Request tracking and statistics
- Transaction hash management

### Technical Details
- Authentication: **Email/Password**
- API Endpoint: `/api/admin/auth/login`
- Token: `admin_token` cookie (JWT, base64 encoded)
- Redirects to: `/admin/panel/withdrawals`

---

## 🔑 Key Differences

| Feature | V4 Admin | NEW Panel |
|---------|----------|-----------|
| Login Field | Username | Email |
| Password | DeepMineAdmin2024! | DeepMine@Admin#2024!Secure |
| Login Page | /admin-login | /admin/panel/login |
| API Endpoint | /api/auth/admin-login | /api/admin/auth/login |
| Dashboard | /admin/dashboard | /admin/panel/withdrawals |
| Auth Method | Username/Password | Email/Password |

---

## ⚠️ Important Notes

1. **Completely Separate Systems**: These are TWO different admin systems with different credentials
2. **Different Login Pages**: Do NOT use the same login page for both
3. **Different Passwords**: V4 uses a different password than NEW panel
4. **No Cross-Login**: V4 credentials will NOT work on NEW panel and vice versa

---

## 🚀 Quick Access

### V4 Admin Dashboard
**For: User management, packages, KYC, platform operations**
1. Go to: `https://www.deepmineai.vip/admin-login`
2. Enter username: `admin`
3. Enter password: `DeepMineAdmin2024!`
4. Click "Sign In to V4 Dashboard"

### NEW Admin Panel
**For: Withdrawals, machine purchases**
1. Go to: `https://www.deepmineai.vip/admin/panel/login`
2. Enter email: `admin@deepmineai.vip`
3. Enter password: `DeepMine@Admin#2024!Secure`
4. Click "Sign In"

---

## 🔒 Security

- Both passwords are case-sensitive
- Always logout when done
- Use private browsing on shared computers
- V4 password: 20 characters
- NEW password: 28 characters with special chars

---

## 📅 Last Updated
2025-12-07 01:00 UTC

Two separate, independent admin systems ✅
