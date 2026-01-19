-- Email Automation System
-- Tracks automated email campaigns and user engagement

-- Email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    campaign_type TEXT NOT NULL, -- 'segment_a', 'segment_b', 'segment_c'
    email_sequence TEXT NOT NULL, -- 'A1', 'A2', 'A3', 'A4', 'B1', etc.
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'skipped'
    scheduled_for DATETIME NOT NULL,
    sent_at DATETIME,
    opened_at DATETIME,
    clicked_at DATETIME,
    error_message TEXT,
    resend_email_id TEXT, -- Resend API email ID
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User automation state table
CREATE TABLE IF NOT EXISTS user_automation_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    
    -- Segment A: No KYC
    segment_a_active INTEGER DEFAULT 0, -- 1 if in Segment A flow
    segment_a_last_email TEXT, -- 'A1', 'A2', 'A3', 'A4'
    segment_a_last_sent DATETIME,
    
    -- Segment B: KYC done, no purchase
    segment_b_active INTEGER DEFAULT 0,
    segment_b_last_email TEXT,
    segment_b_last_sent DATETIME,
    
    -- Segment C: Deposit made, no machine
    segment_c_active INTEGER DEFAULT 0,
    segment_c_last_email TEXT,
    segment_c_last_sent DATETIME,
    
    -- Opt-out flags
    opted_out_segment_a INTEGER DEFAULT 0,
    opted_out_segment_b INTEGER DEFAULT 0,
    opted_out_segment_c INTEGER DEFAULT 0,
    opted_out_all INTEGER DEFAULT 0,
    
    -- Completion tracking
    completed_kyc_at DATETIME,
    completed_first_purchase_at DATETIME,
    first_deposit_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_key TEXT NOT NULL UNIQUE, -- 'segment_a_email_1', etc.
    subject TEXT NOT NULL,
    from_name TEXT DEFAULT 'DeepMine AI Team',
    from_email TEXT DEFAULT 'support@deepmineai.vip',
    html_content TEXT NOT NULL,
    text_content TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON email_campaigns(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON email_campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_automation_state_user_id ON user_automation_state(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_state_segment_a ON user_automation_state(segment_a_active);
CREATE INDEX IF NOT EXISTS idx_automation_state_segment_b ON user_automation_state(segment_b_active);
CREATE INDEX IF NOT EXISTS idx_automation_state_segment_c ON user_automation_state(segment_c_active);

-- Seed email templates (you'll customize these with your actual content)
INSERT OR IGNORE INTO email_templates (template_key, subject, html_content, text_content) VALUES 
-- Segment A: No KYC
('segment_a_email_1', '⚡ Complete Your KYC to Start Mining Today!', '<html>...</html>', 'Complete KYC...'),
('segment_a_email_2', '🎯 Still Here? Let's Get You Started', '<html>...</html>', 'Still here?...'),
('segment_a_email_3', '💎 Your Mining Account is Waiting', '<html>...</html>', 'Your account...'),
('segment_a_email_4', '🚀 Last Chance: Unlock Your Mining Potential', '<html>...</html>', 'Last chance...'),

-- Segment B: KYC Done, No Purchase
('segment_b_email_1', '✅ KYC Approved! Here's Your Next Step', '<html>...</html>', 'KYC approved...'),
('segment_b_email_2', '💰 Special Offer: Get Started with 20% Bonus', '<html>...</html>', 'Special offer...'),
('segment_b_email_3', '⏰ Don't Miss Out: Limited Time Offer', '<html>...</html>', 'Dont miss...'),
('segment_b_email_4', '🎁 Final Offer: 30% Bonus on First Purchase', '<html>...</html>', 'Final offer...'),

-- Segment C: Deposit Made, No Machine (HIGHEST PRIORITY)
('segment_c_email_1', '💵 Deposit Received! Select Your Mining Machine', '<html>...</html>', 'Deposit received...'),
('segment_c_email_2', '⚠️ Your Funds are Ready - Choose Your Machine Now', '<html>...</html>', 'Funds ready...'),
('segment_c_email_3', '🚨 Action Required: Complete Your Machine Selection', '<html>...</html>', 'Action required...'),
('segment_c_email_4', '💸 Refund Available: Need Help Selecting a Machine?', '<html>...</html>', 'Refund available...');
