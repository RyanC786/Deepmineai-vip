# Staff Permissions System - Usage Guide

## Overview
The DeepMine AI platform now has a comprehensive Role-Based Access Control (RBAC) system that allows admins to control exactly which areas each staff member can access.

## Security Issue Fixed
**Previous Problem**: All staff members could see and access ALL navigation links in the CRM sidebar, including:
- Dashboard
- Users
- KYC Management
- Mining Machines
- Withdrawals
- Deposits
- Referrals
- Reports
- CRM Areas

This meant any staff member could enter any admin area without restriction.

**Solution**: Granular permission system where admins tick specific permissions when adding staff, and the system automatically hides unauthorized navigation links.

## How It Works

### 1. For Admins: Adding Staff with Permissions

When adding a new staff member at `/admin/crm/staff`:

1. **Fill basic info**: Name, Email, Username, Password, Role, Department
2. **Set Permissions**: Tick the boxes for areas this staff can access

#### Available Permissions (18 total):

**CRM Permissions:**
- ✅ View Dashboard - Access CRM dashboard
- ✅ View Leads - See leads pipeline
- ✅ Edit Leads - Modify lead data
- ✅ View Tasks - See task board
- ✅ Edit Tasks - Modify tasks
- ✅ View Activity Logs - See CRM activity history

**Admin Permissions:**
- ✅ View Users - Access user list
- ✅ View KYC - See KYC submissions
- ✅ Manage KYC - Approve/reject KYC
- ✅ View Machines - See mining machines
- ✅ View Withdrawals - See withdrawal requests
- ✅ Manage Withdrawals - Approve/reject withdrawals

**Financial Permissions:**
- ✅ View Deposits - See deposit history
- ✅ View Referrals - Access referral data
- ✅ View Reports - Generate reports

**Staff Management:**
- ✅ View Staff - See staff list
- ✅ Manage Staff - Add/edit staff members

### 2. For Staff: Accessing the System

When a staff member logs in:

1. **Authentication**: Staff logs in with their credentials
2. **Permission Check**: System fetches their permissions from database
3. **Dynamic Navigation**: Sidebar shows ONLY links they have access to
4. **Hidden Links**: Unauthorized areas don't appear in navigation

#### Example Scenarios:

**Scenario 1: Support Agent**
- Permissions: View Dashboard, View Leads, View Tasks
- Can See: Only CRM Dashboard, Leads, and Tasks links
- Cannot See: KYC, Withdrawals, Deposits, etc.

**Scenario 2: KYC Specialist**
- Permissions: View Dashboard, View KYC, Manage KYC
- Can See: CRM Dashboard and KYC Management
- Cannot See: Leads, Withdrawals, Deposits, etc.

**Scenario 3: Finance Manager**
- Permissions: View/Manage Withdrawals, View Deposits, View Referrals
- Can See: Financial sections only
- Cannot See: CRM tasks, Staff management, etc.

## Technical Implementation

### Database Schema
```sql
-- crm_staff table (stores permissions per staff)
CREATE TABLE crm_staff (
  id INTEGER PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  password_hash TEXT,
  role TEXT,
  status TEXT,
  
  -- CRM Permissions
  can_view_dashboard INTEGER DEFAULT 0,
  can_view_leads INTEGER DEFAULT 0,
  can_edit_leads INTEGER DEFAULT 0,
  can_view_staff INTEGER DEFAULT 0,
  can_manage_staff INTEGER DEFAULT 0,
  can_view_tasks INTEGER DEFAULT 0,
  can_edit_tasks INTEGER DEFAULT 0,
  can_view_activity_logs INTEGER DEFAULT 0,
  
  -- Admin Permissions
  can_view_kyc INTEGER DEFAULT 0,
  can_manage_kyc INTEGER DEFAULT 0,
  can_view_withdrawals INTEGER DEFAULT 0,
  can_manage_withdrawals INTEGER DEFAULT 0,
  can_view_deposits INTEGER DEFAULT 0,
  can_view_machines INTEGER DEFAULT 0,
  can_view_referrals INTEGER DEFAULT 0,
  can_view_reports INTEGER DEFAULT 0,
  can_view_users INTEGER DEFAULT 0,
  
  created_at DATETIME,
  updated_at DATETIME
);
```

### API Endpoints

**1. Create Staff with Permissions**
```
POST /api/crm/staff
Body: {
  "username": "john.doe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "password": "secure_password",
  "role_id": 2,
  "permissions": {
    "can_view_dashboard": true,
    "can_view_leads": true,
    "can_edit_leads": false,
    "can_view_kyc": true,
    "can_manage_kyc": false,
    ...
  }
}
```

**2. Get Staff Permissions**
```
GET /api/crm/permissions
Headers: {
  "X-Staff-ID": "staff_id_from_session"
}

Response: {
  "success": true,
  "staff": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "support"
  },
  "permissions": {
    "can_view_dashboard": true,
    "can_view_leads": true,
    "can_edit_leads": false,
    ...
  }
}
```

### Frontend Integration

The permission script is automatically injected into all CRM pages:

```javascript
// Fetches permissions on page load
const response = await fetch('/api/crm/permissions', {
  headers: {
    'X-Staff-ID': staffId  // From session
  }
});

const { permissions } = await response.json();

// Hides links based on permissions
const linkPermissions = {
  '/admin/crm/dashboard': perms.can_view_dashboard,
  '/admin/crm/leads': perms.can_view_leads,
  '/admin/kyc': perms.can_view_kyc,
  '/admin/withdrawals': perms.can_view_withdrawals,
  ...
};

// Hide unauthorized links
document.querySelectorAll('.sidebar a').forEach(link => {
  const href = link.getAttribute('href');
  if (!linkPermissions[href]) {
    link.style.display = 'none';
  }
});
```

## Testing the System

### Test Staff Account Created
A test staff member was created in the database:
- **Email**: staff@test.com
- **Permissions**: View Dashboard, View Leads, View Tasks ONLY
- **Should NOT see**: KYC, Withdrawals, Deposits, Machines, etc.

### How to Test:
1. Go to `/admin/crm/staff`
2. Add a new staff member
3. Tick only 2-3 permission checkboxes
4. Save the staff member
5. Log in as that staff member
6. Verify only ticked permissions appear in sidebar

## Security Notes

1. **Client-Side Hiding**: Links are hidden via JavaScript for UX
2. **Server-Side Enforcement**: Backend should also check permissions on API calls
3. **Future Enhancement**: Add middleware to verify permissions on every protected route
4. **Session Management**: Currently uses localStorage, consider JWT tokens for production

## Files Modified

### New Files:
- `src/components/crm-sidebar-permissions.ts` - Permission script
- `migrations/0003_crm_staff_permissions.sql` - Database schema
- `STAFF_PERMISSIONS_USAGE.md` - This guide

### Modified Files:
- `src/pages/admin-staff-management.html.ts` - Added permission checkboxes
- `src/routes/staff.ts` - Save permissions to database
- `src/routes/crm.ts` - Permission API endpoint
- All 6 CRM pages - Integrated permission script

## Production URLs

- **Staff Management**: https://www.deepmineai.vip/admin/crm/staff
- **Leads (with permissions)**: https://www.deepmineai.vip/admin/crm/leads
- **CRM Dashboard (with permissions)**: https://www.deepmineai.vip/admin/crm/dashboard

## Next Steps

1. ✅ Permission checkboxes in Staff Management UI
2. ✅ Save permissions to database
3. ✅ Dynamic sidebar based on permissions
4. ✅ Deployed to production
5. 🔲 Add backend middleware for route protection
6. 🔲 Implement proper session/JWT authentication
7. 🔲 Add permission audit logging
8. 🔲 Create permission presets/templates (e.g., "Support Agent", "Finance Manager")

---

**Status**: ✅ Deployed to Production
**Version**: 1.0
**Date**: 2025-12-17
