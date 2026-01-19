-- Seed Activity Logs for Testing
-- This creates realistic activity log entries to demonstrate the Activity Logs system

-- Insert activity logs for various actions
-- Note: staff_id 1 and 2 are from crm_staff table (seeded earlier)

-- Task activities
INSERT OR IGNORE INTO activity_logs (staff_id, action, resource_type, resource_id, description, severity, created_at) VALUES
(1, 'task_created', 'task', 1, 'Created task: Setup new mining pool', 'info', datetime('now', '-5 days')),
(2, 'task_updated', 'task', 1, 'Updated task: Setup new mining pool', 'info', datetime('now', '-4 days')),
(1, 'task_status_changed', 'task', 1, 'Changed task status to: in_progress', 'info', datetime('now', '-4 days')),
(2, 'task_status_changed', 'task', 1, 'Changed task status to: completed', 'info', datetime('now', '-3 days')),
(1, 'task_deleted', 'task', 999, 'Deleted task: Old test task', 'warning', datetime('now', '-3 days')),

-- Ticket activities  
(1, 'ticket_created', 'ticket', 1, 'Created support ticket: Cannot login to account', 'info', datetime('now', '-6 days')),
(2, 'ticket_updated', 'ticket', 1, 'Updated ticket status: in_progress', 'info', datetime('now', '-5 days')),
(1, 'ticket_message_added', 'ticket', 1, 'Added message to ticket #TKT-2024-0001', 'info', datetime('now', '-5 days')),
(2, 'ticket_resolved', 'ticket', 1, 'Resolved ticket: Cannot login to account', 'info', datetime('now', '-4 days')),

-- Staff activities
(1, 'staff_created', 'staff', 3, 'Created staff member: John Doe', 'info', datetime('now', '-7 days')),
(1, 'staff_updated', 'staff', 2, 'Updated staff permissions', 'info', datetime('now', '-6 days')),
(1, 'staff_deleted', 'staff', 999, 'Deleted inactive staff member', 'warning', datetime('now', '-5 days')),

-- KYC activities
(2, 'kyc_reviewed', 'kyc', 101, 'Reviewed KYC submission', 'info', datetime('now', '-2 days')),
(2, 'kyc_approved', 'kyc', 101, 'Approved KYC submission', 'info', datetime('now', '-2 days')),
(1, 'kyc_rejected', 'kyc', 102, 'Rejected KYC submission: Invalid documents', 'warning', datetime('now', '-1 day')),

-- Withdrawal activities
(2, 'withdrawal_approved', 'withdrawal', 201, 'Approved withdrawal: $500', 'info', datetime('now', '-3 days')),
(1, 'withdrawal_rejected', 'withdrawal', 202, 'Rejected withdrawal: Insufficient balance', 'warning', datetime('now', '-2 days')),

-- System activities
(1, 'system_login', 'system', NULL, 'Admin logged in', 'info', datetime('now', '-1 hour')),
(2, 'system_login', 'system', NULL, 'Staff logged in', 'info', datetime('now', '-30 minutes')),
(1, 'system_settings_changed', 'system', NULL, 'Updated system settings', 'info', datetime('now', '-15 minutes'));
