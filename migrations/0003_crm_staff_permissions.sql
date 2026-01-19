-- CRM Staff table with role-based permissions
CREATE TABLE IF NOT EXISTS crm_staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff', -- 'admin', 'manager', 'staff'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    
    -- Permissions (stored as JSON array or comma-separated)
    permissions TEXT DEFAULT '[]', -- JSON array of permission strings
    
    -- Access control
    can_view_dashboard BOOLEAN DEFAULT 1,
    can_view_leads BOOLEAN DEFAULT 1,
    can_edit_leads BOOLEAN DEFAULT 0,
    can_view_staff BOOLEAN DEFAULT 0,
    can_manage_staff BOOLEAN DEFAULT 0,
    can_view_tasks BOOLEAN DEFAULT 1,
    can_edit_tasks BOOLEAN DEFAULT 0,
    can_view_activity_logs BOOLEAN DEFAULT 0,
    
    -- Admin access
    can_view_kyc BOOLEAN DEFAULT 0,
    can_manage_kyc BOOLEAN DEFAULT 0,
    can_view_withdrawals BOOLEAN DEFAULT 0,
    can_manage_withdrawals BOOLEAN DEFAULT 0,
    can_view_deposits BOOLEAN DEFAULT 0,
    can_view_machines BOOLEAN DEFAULT 0,
    can_view_referrals BOOLEAN DEFAULT 0,
    can_view_reports BOOLEAN DEFAULT 0,
    can_view_users BOOLEAN DEFAULT 0,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    created_by INTEGER,
    
    FOREIGN KEY (created_by) REFERENCES crm_staff(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_staff_email ON crm_staff(email);
CREATE INDEX IF NOT EXISTS idx_crm_staff_status ON crm_staff(status);
CREATE INDEX IF NOT EXISTS idx_crm_staff_role ON crm_staff(role);

-- Activity log for staff actions
CREATE TABLE IF NOT EXISTS crm_staff_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT, -- 'lead', 'task', 'user', etc.
    resource_id INTEGER,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (staff_id) REFERENCES crm_staff(id)
);

CREATE INDEX IF NOT EXISTS idx_crm_staff_activity_staff ON crm_staff_activity(staff_id);
CREATE INDEX IF NOT EXISTS idx_crm_staff_activity_created ON crm_staff_activity(created_at);
