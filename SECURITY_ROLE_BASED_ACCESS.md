# 🔒 Role-Based Access Control (RBAC) - Security Documentation

## Critical Security Issue RESOLVED ✅

**Problem Identified:** All admin staff were logging in through the same endpoint and gaining access to the most sensitive financial pages (withdrawals, deposits, machines). This created a major security vulnerability where CRM staff could access financial data they shouldn't see.

**Solution Implemented:** Complete role-based access control system with separate middleware for different access levels.

---

## 🎯 Access Levels & Permissions

### 1. **Super Administrator** (`super_admin`)
- **Full System Access** - No restrictions
- **Can access:**
  - ✅ All financial pages (withdrawals, deposits, machines)
  - ✅ All CRM pages (dashboard, staff, tasks, leads, notes, activity logs)
  - ✅ All API endpoints
  - ✅ User management, KYC, reports
- **Login redirects to:** `/admin/panel/withdrawals` (financial dashboard)

### 2. **CRM Manager** (`crm_manager`)
- **CRM Full Access** - Can manage CRM but NO financial access
- **Can access:**
  - ✅ CRM Dashboard, Staff Management, Tasks, Leads
  - ✅ Internal Notes, Activity Logs
  - ✅ Create/Edit/Delete CRM data
- **BLOCKED from:**
  - ❌ `/api/admin/*` (machines, earnings, withdrawals, deposits)
  - ❌ `/admin/withdrawals`, `/admin/deposits`, `/admin/machines` pages
- **Login redirects to:** `/admin/crm/dashboard` (CRM only)

### 3. **CRM Agent** (`crm_agent`)
- **CRM Limited Access** - Can view and update assigned items only
- **Can access:**
  - ✅ CRM Dashboard, Tasks, Leads (assigned to them)
  - ✅ Internal Notes, Activity Logs
  - ✅ Update status on assigned items
- **BLOCKED from:**
  - ❌ All financial pages
  - ❌ Staff management (can't create/delete staff)
- **Login redirects to:** `/admin/crm/dashboard`

### 4. **CRM Viewer** (`crm_viewer`)
- **Read-Only CRM Access** - Can only view data
- **Can access:**
  - ✅ CRM Dashboard (view only)
  - ✅ View tasks, leads, notes
- **BLOCKED from:**
  - ❌ All financial pages
  - ❌ Creating/editing any CRM data
  - ❌ Staff management
- **Login redirects to:** `/admin/crm/dashboard`

---

## 🔐 Authentication & Middleware

### Middleware Functions

#### 1. `requireAuth` - User Authentication
```typescript
// For regular user endpoints (mining, withdrawals, deposits)
app.use('/api/withdrawals/*', requireAuth)
```
- Checks `auth_token` cookie
- Validates user JWT token
- Used for regular platform users

#### 2. `requireSuperAdmin` - Super Admin Only ⭐
```typescript
// For financial/sensitive endpoints
app.use('/api/admin/*', requireSuperAdmin)
```
- Checks `admin_token` cookie
- Validates JWT contains `role_name = 'super_admin'`
- **BLOCKS all CRM staff** (manager, agent, viewer)
- Returns **403 Forbidden** if user is not Super Admin

#### 3. `requireCRMAccess` - CRM Access
```typescript
// For CRM endpoints
app.use('/api/crm/*', requireCRMAccess)
```
- Checks `admin_token` cookie
- Allows roles: `super_admin`, `crm_manager`, `crm_agent`, `crm_viewer`
- Returns **403 Forbidden** if user doesn't have CRM access

#### 4. `requireAdmin` - Basic Admin (Legacy)
```typescript
// Used for public cron endpoints
app.post('/api/cron/calculate-earnings', requireAdmin, async (c) => {
```
- Checks `admin_token` cookie exists
- Does NOT check role (allows all admin types)
- Kept for backward compatibility

---

## 🛡️ Route Protection Map

### Super Admin Only Routes (Financial/Sensitive)
```
❌ CRM staff BLOCKED from these routes:

API Endpoints:
- /api/admin/machines/*
- /api/admin/earnings/*
- /api/admin/withdrawals/*
- /api/admin/deposits/*

Admin Pages:
- /admin/panel/withdrawals
- /admin/panel/machines
- /admin/deposits
- /admin/machines
- /admin/kyc
- /admin/reports
```

### CRM Access Routes (All CRM Staff + Super Admin)
```
✅ CRM staff CAN access these routes:

API Endpoints:
- /api/crm/staff/*
- /api/crm/notes/*
- /api/crm/activity-logs/*
- /api/crm/tasks/*
- /api/crm/leads/*

CRM Pages:
- /admin/crm/dashboard
- /admin/crm/staff
- /admin/crm/staff/profile
- /admin/crm/activity-logs
- /admin/crm/tasks
```

---

## 🔄 Login Flow & Redirect Logic

### Login Endpoints
1. **Main Admin Login:** `/admin/panel/login` or `/admin/login`
   - Used by both Super Admins and CRM staff
   - Redirects based on role after successful login

2. **CRM Login (Optional):** `/admin/crm/login`
   - Alternative login page designed for CRM staff
   - Always redirects to `/admin/crm/dashboard`

### Redirect Logic After Login

```javascript
// From src/pages/admin-panel-login.html.ts
const userRole = response.data.admin?.role_name || 'super_admin';

if (userRole === 'super_admin') {
    // Super Admin gets full access
    window.location.href = '/admin/panel/withdrawals';
} 
else if (userRole.startsWith('crm_')) {
    // CRM staff go to CRM dashboard only
    window.location.href = '/admin/crm/dashboard';
}
```

---

## 🎫 JWT Token Structure

### Enhanced Admin Token
```json
{
  "admin_id": 1,
  "email": "admin@deepmine.ai",
  "full_name": "John Doe",
  "account_status": "admin",
  "role_id": 1,
  "role_name": "super_admin",
  "role_display_name": "Super Administrator",
  "permissions": ["all"],
  "iat": 1702650000,
  "exp": 1702736400
}
```

**Key Fields:**
- `role_name`: Used for access control checks (`super_admin`, `crm_manager`, `crm_agent`, `crm_viewer`)
- `permissions`: Array of permission strings (currently `["all"]` for super admin)
- Token is base64 encoded and stored in `admin_token` cookie

---

## 📊 Database Schema

### `staff_roles` Table
```sql
CREATE TABLE staff_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions TEXT, -- JSON array of permissions
  can_manage_staff BOOLEAN DEFAULT 0,
  can_view_financial BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Default Roles:**
1. Super Administrator (`super_admin`) - Full access
2. CRM Manager (`crm_manager`) - CRM full access
3. CRM Agent (`crm_agent`) - CRM limited access
4. CRM Viewer (`crm_viewer`) - Read-only CRM access

### `admin_users` Table
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  role_id INTEGER NOT NULL,
  department TEXT,
  is_active BOOLEAN DEFAULT 1,
  hired_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES staff_roles(id)
);
```

### `users` Table (Enhanced)
```sql
-- Existing users table with account_status = 'admin'
-- Now linked to admin_users for role assignment
```

---

## 🧪 Testing the Security Model

### Test 1: Super Admin Access ✅
```bash
# Login as Super Admin
curl -X POST https://www.deepmineai.vip/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@deepmine.ai","password":"your_password"}'

# Should succeed
curl https://www.deepmineai.vip/api/admin/withdrawals

# Should succeed
curl https://www.deepmineai.vip/api/crm/staff
```

### Test 2: CRM Staff Access (Should Block Financial) ❌
```bash
# Login as CRM Manager
curl -X POST https://www.deepmineai.vip/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"crm@deepmine.ai","password":"password"}'

# Should return 403 Forbidden
curl https://www.deepmineai.vip/api/admin/withdrawals

# Should succeed
curl https://www.deepmineai.vip/api/crm/staff
```

---

## 🚀 Migration Guide

### For Existing Admins
1. **Super Admins:** No changes needed
   - Existing users with `account_status = 'admin'` automatically get `super_admin` role
   - They can access everything as before

2. **New CRM Staff:** Must be added with proper roles
   ```sql
   -- 1. Create user account with admin status
   INSERT INTO users (email, password_hash, full_name, account_status)
   VALUES ('crm@example.com', 'hashed_password', 'Jane Doe', 'admin');
   
   -- 2. Link to admin_users with CRM role
   INSERT INTO admin_users (user_id, role_id, department)
   VALUES (
     (SELECT id FROM users WHERE email = 'crm@example.com'),
     (SELECT id FROM staff_roles WHERE role_name = 'crm_manager'),
     'Customer Success'
   );
   ```

### For Developers
1. **New protected endpoints:** Use `requireSuperAdmin` for financial routes
2. **CRM endpoints:** Use `requireCRMAccess` for CRM-only routes
3. **Check user role in code:**
   ```typescript
   const userRole = c.get('adminRole'); // 'super_admin', 'crm_manager', etc.
   const permissions = c.get('adminPermissions'); // ['all'] or specific permissions
   ```

---

## 📋 Security Checklist

- ✅ Role-based middleware implemented (`requireSuperAdmin`, `requireCRMAccess`)
- ✅ Financial API endpoints protected from CRM staff
- ✅ Login redirects based on role
- ✅ JWT tokens include role and permissions
- ✅ Database schema supports role management
- ✅ CRM staff can only access CRM pages
- ✅ Super Admins retain full access
- ✅ 403 Forbidden responses for unauthorized access
- ✅ Deployed to production: https://www.deepmineai.vip

---

## 🔮 Future Enhancements

1. **Granular Permissions:**
   - Per-feature permissions (e.g., `can_create_tasks`, `can_delete_leads`)
   - Permission checking middleware

2. **Audit Logging:**
   - Log all access attempts (success/failure)
   - Track which staff accessed what data

3. **Session Management:**
   - Force logout on role change
   - Multi-device session tracking

4. **UI Role Indicators:**
   - Show role badge in navigation
   - Hide unavailable menu items based on role

5. **Time-Based Access:**
   - Temporary elevated permissions
   - Scheduled access windows

---

## 📞 Contact & Support

For security concerns or access issues:
- **Email:** security@deepmineai.vip
- **Emergency:** Contact system administrator immediately

**Last Updated:** December 15, 2025
**Version:** 1.0.0
**Status:** ✅ Active in Production
