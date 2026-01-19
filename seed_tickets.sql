-- Seed data for support tickets
-- Create test tickets with various statuses and priorities

-- Ticket 1: Urgent - Account Access Issue (Open)
INSERT INTO support_tickets (
  ticket_number, user_id, customer_name, customer_email, subject, description,
  category, status, priority, assigned_to, created_by, created_at, updated_at
) VALUES (
  'TKT-2024-0001', 
  1, 
  'John Smith', 
  'john.smith@example.com',
  'Cannot login to account',
  'I have been trying to login for the past 2 hours but keep getting "Invalid credentials" error even though I am using the correct password. Please help urgently as I need to withdraw funds.',
  'Technical',
  'open',
  'urgent',
  1, -- Assigned to admin ID 1
  1,
  datetime('now', '-2 hours'),
  datetime('now', '-2 hours')
);

-- Ticket 2: High - Withdrawal Delay (In Progress)
INSERT INTO support_tickets (
  ticket_number, user_id, customer_name, customer_email, subject, description,
  category, status, priority, assigned_to, assigned_at, first_response_at, created_by, created_at, updated_at
) VALUES (
  'TKT-2024-0002',
  2,
  'Sarah Johnson',
  'sarah.johnson@example.com',
  'Withdrawal pending for 3 days',
  'My withdrawal request of $500 has been pending for 3 days now. Transaction ID: WD-2024-0123. When will it be processed?',
  'Billing',
  'in_progress',
  'high',
  2, -- Assigned to admin ID 2
  datetime('now', '-2 days'),
  datetime('now', '-2 days', '+30 minutes'),
  1,
  datetime('now', '-3 days'),
  datetime('now', '-1 hour')
);

-- Ticket 3: Medium - Mining Package Question (Waiting)
INSERT INTO support_tickets (
  ticket_number, customer_name, customer_email, subject, description,
  category, status, priority, assigned_to, assigned_at, first_response_at, created_by, created_at, updated_at
) VALUES (
  'TKT-2024-0003',
  'Michael Brown',
  'michael.brown@example.com',
  'Question about Gold package benefits',
  'What are the exact daily returns for the Gold mining package? The website shows 2-3% but I want to confirm before purchasing.',
  'Sales',
  'waiting',
  'medium',
  1,
  datetime('now', '-1 day'),
  datetime('now', '-1 day', '+15 minutes'),
  2,
  datetime('now', '-1 day', '-2 hours'),
  datetime('now', '-1 day', '+1 hour')
);

-- Ticket 4: Low - Profile Update Request (Resolved)
INSERT INTO support_tickets (
  ticket_number, user_id, customer_name, customer_email, subject, description,
  category, status, priority, assigned_to, assigned_at, first_response_at, resolved_at, resolved_by, created_by, created_at, updated_at
) VALUES (
  'TKT-2024-0004',
  3,
  'Emily Davis',
  'emily.davis@example.com',
  'How to change email address?',
  'I would like to update my email address on my account. Can you guide me through the process?',
  'General',
  'resolved',
  'low',
  2,
  datetime('now', '-5 days'),
  datetime('now', '-5 days', '+10 minutes'),
  datetime('now', '-4 days'),
  2,
  1,
  datetime('now', '-5 days'),
  datetime('now', '-4 days')
);

-- Ticket 5: High - KYC Verification Issue (Open)
INSERT INTO support_tickets (
  ticket_number, user_id, customer_name, customer_email, subject, description,
  category, status, priority, assigned_to, created_by, created_at, updated_at
) VALUES (
  'TKT-2024-0005',
  4,
  'David Wilson',
  'david.wilson@example.com',
  'KYC documents rejected',
  'My KYC verification was rejected but no reason was given. I uploaded passport, utility bill, and selfie as requested. Please review again.',
  'KYC',
  'open',
  'high',
  1,
  2,
  datetime('now', '-6 hours'),
  datetime('now', '-6 hours')
);

-- Ticket 6: Medium - Referral Bonus Query (Closed)
INSERT INTO support_tickets (
  ticket_number, user_id, customer_name, customer_email, subject, description,
  category, status, priority, assigned_to, assigned_at, first_response_at, resolved_at, resolved_by, closed_at, closed_by, satisfaction_rating, satisfaction_feedback, created_by, created_at, updated_at
) VALUES (
  'TKT-2024-0006',
  5,
  'Lisa Anderson',
  'lisa.anderson@example.com',
  'Referral bonus not received',
  'I referred 3 friends last month but only received 2 referral bonuses. Please check my account.',
  'Billing',
  'closed',
  'medium',
  1,
  datetime('now', '-10 days'),
  datetime('now', '-10 days', '+20 minutes'),
  datetime('now', '-9 days'),
  1,
  datetime('now', '-8 days'),
  1,
  5,
  'Great support! Issue was resolved quickly and I received my missing bonus.',
  1,
  datetime('now', '-10 days'),
  datetime('now', '-8 days')
);

-- Add messages for tickets

-- Messages for Ticket 1 (Urgent - Account Access)
-- No messages yet (just created)

-- Messages for Ticket 2 (High - Withdrawal Delay)
INSERT INTO ticket_messages (
  ticket_id, message, is_internal, author_type, author_id, author_name, author_email, created_at, updated_at
) VALUES 
(
  2,
  'Thank you for contacting us. I am reviewing your withdrawal request now. Our finance team typically processes withdrawals within 48-72 hours, but there may have been a verification delay. Let me check the status.',
  0, -- Public message
  'staff',
  2,
  'Admin User',
  'admin@deepmineai.vip',
  datetime('now', '-2 days', '+30 minutes'),
  datetime('now', '-2 days', '+30 minutes')
),
(
  2,
  'Withdrawal is stuck in compliance review. Need to verify source of funds.',
  1, -- Internal note
  'staff',
  2,
  'Admin User',
  'admin@deepmineai.vip',
  datetime('now', '-1 day'),
  datetime('now', '-1 day')
);

-- Messages for Ticket 3 (Medium - Mining Package)
INSERT INTO ticket_messages (
  ticket_id, message, is_internal, author_type, author_id, author_name, author_email, created_at, updated_at
) VALUES 
(
  3,
  'The Gold package offers 2.5% daily returns on average, with a range of 2-3% depending on mining performance. Returns are calculated daily and credited to your account automatically. Would you like help with purchasing?',
  0, -- Public message
  'staff',
  1,
  'Admin User',
  'admin@deepmineai.vip',
  datetime('now', '-1 day', '+15 minutes'),
  datetime('now', '-1 day', '+15 minutes')
),
(
  3,
  'Thank you for the explanation. Yes, I would like to purchase the Gold package. What payment methods do you accept?',
  0, -- Customer reply
  'customer',
  NULL,
  'Michael Brown',
  'michael.brown@example.com',
  datetime('now', '-1 day', '+1 hour'),
  datetime('now', '-1 day', '+1 hour')
);

-- Messages for Ticket 4 (Low - Profile Update - Resolved)
INSERT INTO ticket_messages (
  ticket_id, message, is_internal, author_type, author_id, author_name, author_email, created_at, updated_at
) VALUES 
(
  4,
  'To change your email address, please: 1) Log in to your account 2) Go to Profile Settings 3) Click "Update Email" 4) Verify the change via email sent to your NEW address. Please note that for security, you will need to complete KYC verification again with the new email.',
  0, -- Public message
  'staff',
  2,
  'Admin User',
  'admin@deepmineai.vip',
  datetime('now', '-5 days', '+10 minutes'),
  datetime('now', '-5 days', '+10 minutes')
),
(
  4,
  'Perfect! I was able to update my email successfully. Thank you for the clear instructions.',
  0, -- Customer reply
  'customer',
  3,
  'Emily Davis',
  'emily.davis@example.com',
  datetime('now', '-4 days', '-1 hour'),
  datetime('now', '-4 days', '-1 hour')
),
(
  4,
  'Great! I''m marking this as resolved. Feel free to reach out if you need any further assistance.',
  0, -- Public message
  'staff',
  2,
  'Admin User',
  'admin@deepmineai.vip',
  datetime('now', '-4 days'),
  datetime('now', '-4 days')
);

-- Messages for Ticket 5 (High - KYC Verification)
-- No messages yet

-- Messages for Ticket 6 (Medium - Referral Bonus - Closed)
INSERT INTO ticket_messages (
  ticket_id, message, is_internal, author_type, author_id, author_name, author_email, created_at, updated_at
) VALUES 
(
  6,
  'I have reviewed your account and found that one of your referrals did not meet the minimum deposit requirement ($50) which is why you only received 2 bonuses instead of 3. I have credited the third bonus to your account as a goodwill gesture. Please check your balance.',
  0, -- Public message
  'staff',
  1,
  'Admin User',
  'admin@deepmineai.vip',
  datetime('now', '-9 days'),
  datetime('now', '-9 days')
),
(
  6,
  'Thank you so much! I can see the bonus in my account now. Appreciate your help!',
  0, -- Customer reply
  'customer',
  5,
  'Lisa Anderson',
  'lisa.anderson@example.com',
  datetime('now', '-8 days', '-2 hours'),
  datetime('now', '-8 days', '-2 hours')
);
