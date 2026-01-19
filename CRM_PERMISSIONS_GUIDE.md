# CRM Staff Permission System Guide

## 🔒 Role-Based Access Control (RBAC)

The CRM now has a comprehensive permission system to control what staff members can access.

## 📋 Permission Categories

### CRM Permissions
| Permission | Description | Default for Staff |
|-----------|-------------|-------------------|
| `can_view_dashboard` | View CRM dashboard | ✅ Yes |
| `can_view_leads` | View leads pipeline | ✅ Yes |
| `can_edit_leads` | Edit/update leads | ❌ No |
| `can_view_staff` | View staff list | ❌ No |
| `can_manage_staff` | Add/edit/remove staff | ❌ No |
| `can_view_tasks` | View tasks | ✅ Yes |
| `can_edit_tasks` | Create/edit tasks | ❌ No |
| `can_view_activity_logs` | View activity logs | ❌ No |

### Admin Permissions
| Permission | Description | Default for Staff |
|-----------|-------------|-------------------|
| `can_view_kyc` | View KYC submissions | ❌ No |
| `can_manage_kyc` | Approve/reject KYC | ❌ No |
| `can_view_withdrawals` | View withdrawals | ❌ No |
| `can_manage_withdrawals` | Approve/reject withdrawals | ❌ No |
| `can_view_deposits` | View deposits | ❌ No |
| `can_view_machines` | View mining machines | ❌ No |
| `can_view_referrals` | View referrals | ❌ No |
| `can_view_reports` | View reports | ❌ No |
| `can_view_users` | View user list | ❌ No |

## 🎭 Role Presets

### Staff Role (Basic)
```
✅ can_view_dashboard
✅ can_view_leads
✅ can_view_tasks
❌ All other permissions disabled
```

### Manager Role (Moderate)
```
✅ can_view_dashboard
✅ can_view_leads
✅ can_edit_leads
✅ can_view_staff
✅ can_view_tasks
✅ can_edit_tasks
✅ can_view_activity_logs
❌ Admin permissions disabled
```

### Admin Role (Full Access)
```
✅ All permissions enabled
```

## 💻 How It Works

### 1. Database Structure
```sql
CREATE TABLE crm_staff (
    id INTEGER PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'staff',
    status TEXT DEFAULT 'active',
    
    -- CRM Permissions
    can_view_dashboard BOOLEAN DEFAULT 1,
    can_view_leads BOOLEAN DEFAULT 1,
    can_edit_leads BOOLEAN DEFAULT 0,
    -- ... more permissions
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. API Endpoint
```
GET /api/crm/permissions
Headers: X-Staff-ID: 1

Response:
{
  "success": true,
  "staff": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  },
  "permissions": {
    "can_view_dashboard": true,
    "can_view_leads": true,
    "can_edit_leads": false,
    "can_view_kyc": false,
    ...
  }
}
```

### 3. Frontend Navigation Hiding
When a staff member logs in:
1. JavaScript fetches their permissions from `/api/crm/permissions`
2. Navigation links are automatically hidden if not permitted
3. Example: If `can_view_kyc: false`, the KYC link won't appear

### 4. Backend Middleware Protection
```typescript
import { requireCRMAuth, requirePermission } from './middleware/crm-auth'

// Protect a route
app.get('/api/crm/leads', 
  requireCRMAuth,
  requirePermission('can_view_leads'),
  async (c) => {
    // Handler code
  }
)

// Multiple permissions (must have all)
app.post('/api/crm/leads/:id',
  requireCRMAuth,
  requireAllPermissions('can_view_leads', 'can_edit_leads'),
  async (c) => {
    // Handler code
  }
)

// Multiple permissions (must have at least one)
app.get('/api/admin/data',
  requireCRMAuth,
  requireAnyPermission('can_view_reports', 'can_view_users'),
  async (c) => {
    // Handler code
  }
)
```

## 🔧 Adding a New Staff Member

### SQL Example:
```sql
INSERT INTO crm_staff (
  full_name, email, password_hash, role,
  can_view_dashboard, can_view_leads, can_edit_leads,
  can_view_kyc, can_view_withdrawals
) VALUES (
  'Jane Smith', 'jane@company.com', 'hashed_password', 'manager',
  1, 1, 1,  -- Can view dashboard, leads, and edit leads
  0, 0       -- Cannot access KYC or withdrawals
);
```

### Via API (future):
```javascript
POST /api/crm/staff
{
  "fullName": "Jane Smith",
  "email": "jane@company.com",
  "password": "securepass123",
  "role": "manager",
  "permissions": {
    "can_view_dashboard": true,
    "can_view_leads": true,
    "can_edit_leads": true,
    "can_view_kyc": false,
    ...
  }
}
```

## 📊 Activity Logging

All staff actions are logged in `crm_staff_activity` table:
```sql
SELECT 
  staff_id, action, resource_type, resource_id, 
  details, ip_address, created_at
FROM crm_staff_activity
WHERE staff_id = 1
ORDER BY created_at DESC
LIMIT 50;
```

Example logs:
```
staff_id: 1
action: "view_lead"
resource_type: "lead"
resource_id: 123
details: "Viewed lead details"
ip_address: "192.168.1.100"
created_at: "2025-12-17 17:00:00"
```

## 🛡️ Security Best Practices

1. **Never expose all admin features to regular staff**
   - Only grant KYC/withdrawal access to trusted managers
   - Financial data should be restricted

2. **Use roles as presets, then customize**
   - Start with role presets (staff/manager/admin)
   - Customize individual permissions as needed

3. **Regular permission audits**
   - Review staff permissions quarterly
   - Remove access when staff changes roles

4. **Monitor activity logs**
   - Check `crm_staff_activity` for suspicious patterns
   - Alert on unauthorized access attempts

## 🧪 Testing

### Test Staff Account
```
Email: staff@test.com
Staff ID: 1
Permissions: 
  ✅ Dashboard, Leads (view only), Tasks (view only)
  ❌ All admin features disabled
```

### Testing Permission Hiding:
1. Set `localStorage.setItem('crm_staff_id', '1')` in browser console
2. Reload the CRM page
3. Navigation links for KYC, Withdrawals, etc. should be hidden

### Testing API:
```bash
curl -H "X-Staff-ID: 1" https://www.deepmineai.vip/api/crm/permissions
```

## 🚀 Next Steps

### To Implement Staff Management UI:
1. Create `/admin/crm/staff` page with staff list
2. Add "Add Staff" modal with permission checkboxes
3. Add "Edit Permissions" functionality
4. Show activity log per staff member

### UI Mockup for Add Staff:
```
┌─────────────────────────────────────┐
│ Add New CRM Staff Member            │
├─────────────────────────────────────┤
│ Full Name: [________________]       │
│ Email: [____________________]       │
│ Password: [_________________]       │
│ Role: [▼ Staff    ]                 │
│                                      │
│ CRM Permissions:                    │
│ ☑ View Dashboard                    │
│ ☑ View Leads                        │
│ ☐ Edit Leads                        │
│ ☐ View Staff                        │
│ ☐ Manage Staff                      │
│ ☑ View Tasks                        │
│ ☐ Edit Tasks                        │
│ ☐ View Activity Logs                │
│                                      │
│ Admin Permissions:                  │
│ ☐ View KYC                          │
│ ☐ Manage KYC                        │
│ ☐ View Withdrawals                  │
│ ☐ Manage Withdrawals                │
│ ☐ View Deposits                     │
│ ☐ View Machines                     │
│ ☐ View Referrals                    │
│ ☐ View Reports                      │
│ ☐ View Users                        │
│                                      │
│ [Cancel]  [Create Staff Member]     │
└─────────────────────────────────────┘
```

## 📝 Summary

✅ **Implemented**: Database, API, Frontend hiding, Middleware
⏳ **Pending**: Staff management UI with permission checkboxes
🎯 **Goal**: Secure, granular access control for CRM staff

---

**Production**: https://www.deepmineai.vip  
**Migration Applied**: Yes  
**Test Staff Created**: Yes (ID: 1)
