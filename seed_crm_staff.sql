-- Seed CRM Staff for Testing
-- These are test staff members to demonstrate the CRM system

INSERT OR IGNORE INTO crm_staff (id, full_name, email, password_hash, role, status, can_view_activity_logs) VALUES
(1, 'Admin User', 'admin@deepmineai.vip', '$2a$10$dummy', 'admin', 'active', 1),
(2, 'Support Staff', 'staff@deepmineai.vip', '$2a$10$dummy', 'staff', 'active', 1);
