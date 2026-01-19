-- ============================================
-- DeepMine AI - CRM Tables (Clean Migration)
-- Migration: 0011_crm_tables_only.sql
-- Created: 2024-12-14
-- Purpose: Add CRM-specific tables only
-- ============================================

-- ============================================
-- 1. STAFF ROLES
-- ============================================

CREATE TABLE IF NOT EXISTS staff_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions TEXT NOT NULL,
  is_system_role INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO staff_roles (name, display_name, description, permissions, is_system_role) VALUES
('super_admin', 'Super Administrator', 'Full access to all features', '["all"]', 1),
('admin', 'Administrator', 'Full access except system settings', '["users.*","kyc.*","withdrawals.*","staff.view","reports.*","analytics.*"]', 1),
('kyc_specialist', 'KYC Specialist', 'KYC review and approval', '["kyc.*","users.view"]', 0),
('support_agent', 'Support Agent', 'Support and tickets', '["users.view","tickets.*","kyc.view"]', 0),
('finance_manager', 'Finance Manager', 'Withdrawals and transactions', '["withdrawals.*","transactions.view","users.view"]', 0);

-- ============================================
-- 2. STAFF TASKS
-- ============================================

CREATE TABLE IF NOT EXISTS staff_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_type TEXT NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to INTEGER,
  assigned_by INTEGER,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  due_date DATETIME,
  started_at DATETIME,
  completed_at DATETIME,
  estimated_minutes INTEGER,
  actual_minutes INTEGER,
  tags TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON staff_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON staff_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON staff_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_tasks_reference ON staff_tasks(reference_type, reference_id);

-- ============================================
-- 3. INTERNAL NOTES
-- ============================================

CREATE TABLE IF NOT EXISTS internal_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_type TEXT NOT NULL,
  reference_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'comment',
  created_by INTEGER NOT NULL,
  is_private INTEGER DEFAULT 0,
  is_important INTEGER DEFAULT 0,
  mentioned_users TEXT,
  attachments TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_reference ON internal_notes(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON internal_notes(created_by);

-- ============================================
-- 4. ACTIVITY LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER,
  action TEXT NOT NULL,
  action_category TEXT,
  resource_type TEXT NOT NULL,
  resource_id INTEGER,
  resource_name TEXT,
  description TEXT NOT NULL,
  changes TEXT,
  metadata TEXT,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  severity TEXT DEFAULT 'info',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_staff_id ON activity_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_activity_category ON activity_logs(action_category);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_logs(created_at);

-- ============================================
-- 5. IN-APP NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  category TEXT,
  link TEXT,
  icon TEXT,
  reference_type TEXT,
  reference_id INTEGER,
  is_read INTEGER DEFAULT 0,
  read_at DATETIME,
  priority TEXT DEFAULT 'normal',
  expires_at DATETIME,
  action_required INTEGER DEFAULT 0,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- 6. SUPPORT TICKETS
-- ============================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_number TEXT UNIQUE NOT NULL,
  user_id INTEGER,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  assigned_to INTEGER,
  assigned_at DATETIME,
  first_response_at DATETIME,
  resolved_at DATETIME,
  closed_at DATETIME,
  closed_by INTEGER,
  satisfaction_rating INTEGER,
  satisfaction_feedback TEXT,
  tags TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  user_id INTEGER,
  staff_id INTEGER,
  message TEXT NOT NULL,
  is_internal INTEGER DEFAULT 0,
  is_solution INTEGER DEFAULT 0,
  attachments TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket_id ON ticket_responses(ticket_id);

-- ============================================
-- 7. SAVED FILTERS
-- ============================================

CREATE TABLE IF NOT EXISTS saved_filters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  filter_name TEXT NOT NULL,
  filter_type TEXT NOT NULL,
  filter_config TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  is_shared INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_saved_filters_user_id ON saved_filters(user_id);

-- ============================================
-- 8. STAFF PERFORMANCE
-- ============================================

CREATE TABLE IF NOT EXISTS staff_performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER NOT NULL,
  metric_date DATE NOT NULL,
  tasks_assigned INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  avg_completion_time_minutes INTEGER DEFAULT 0,
  kyc_approved INTEGER DEFAULT 0,
  kyc_rejected INTEGER DEFAULT 0,
  withdrawals_processed INTEGER DEFAULT 0,
  tickets_resolved INTEGER DEFAULT 0,
  avg_first_response_minutes INTEGER DEFAULT 0,
  total_work_minutes INTEGER DEFAULT 0,
  quality_score REAL DEFAULT 0,
  efficiency_score REAL DEFAULT 0,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_performance_staff_id ON staff_performance(staff_id);
CREATE INDEX IF NOT EXISTS idx_performance_date ON staff_performance(metric_date);

-- ============================================
-- 9. ASSIGNMENT RULES
-- ============================================

CREATE TABLE IF NOT EXISTS assignment_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  conditions TEXT NOT NULL,
  assignment_strategy TEXT DEFAULT 'round_robin',
  priority INTEGER DEFAULT 0,
  eligible_roles TEXT,
  is_active INTEGER DEFAULT 1,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO assignment_rules (rule_name, task_type, conditions, assignment_strategy, priority, eligible_roles, is_active) VALUES
('KYC Auto-Assignment', 'kyc', '{"status":"reviewing"}', 'load_balanced', 100, '[3]', 1),
('Withdrawal Auto-Assignment', 'withdrawal', '{"status":"pending"}', 'round_robin', 90, '[5]', 1),
('Support Ticket Auto-Assignment', 'ticket', '{"status":"open"}', 'load_balanced', 80, '[4]', 1);

-- ============================================
-- 10. SYSTEM HEALTH LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS system_health_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  metric_unit TEXT,
  status TEXT DEFAULT 'healthy',
  threshold_warning REAL,
  threshold_critical REAL,
  metadata TEXT,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_metric_name ON system_health_logs(metric_name);
CREATE INDEX IF NOT EXISTS idx_health_recorded_at ON system_health_logs(recorded_at);

-- ============================================
-- 11. UPDATE ADMIN_USERS (add new columns)
-- ============================================

-- Add role_id column (link to staff_roles)
ALTER TABLE admin_users ADD COLUMN role_id INTEGER DEFAULT 1;
ALTER TABLE admin_users ADD COLUMN department TEXT;
ALTER TABLE admin_users ADD COLUMN phone TEXT;
ALTER TABLE admin_users ADD COLUMN avatar_url TEXT;
ALTER TABLE admin_users ADD COLUMN login_count INTEGER DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN timezone TEXT DEFAULT 'UTC';
ALTER TABLE admin_users ADD COLUMN notification_preferences TEXT;
ALTER TABLE admin_users ADD COLUMN two_factor_enabled INTEGER DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN created_by INTEGER;

CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role_id);

-- ============================================
-- 12. TRIGGERS
-- ============================================

CREATE TRIGGER IF NOT EXISTS update_staff_tasks_timestamp 
AFTER UPDATE ON staff_tasks
BEGIN
  UPDATE staff_tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_internal_notes_timestamp 
AFTER UPDATE ON internal_notes
BEGIN
  UPDATE internal_notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_support_tickets_timestamp 
AFTER UPDATE ON support_tickets
BEGIN
  UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS generate_ticket_number
AFTER INSERT ON support_tickets
WHEN NEW.ticket_number IS NULL OR NEW.ticket_number = ''
BEGIN
  UPDATE support_tickets 
  SET ticket_number = 'TICKET-' || strftime('%Y', 'now') || '-' || printf('%06d', NEW.id)
  WHERE id = NEW.id;
END;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
