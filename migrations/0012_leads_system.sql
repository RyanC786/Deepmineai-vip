-- Leads Management System Tables

-- Main leads table
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Contact Information
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    
    -- Lead Details
    source TEXT NOT NULL, -- website, referral, social_media, cold_call, event, other
    status TEXT NOT NULL DEFAULT 'new', -- new, qualified, contacted, proposal, negotiation, won, lost
    stage TEXT NOT NULL DEFAULT 'new',
    score INTEGER DEFAULT 0, -- 0-100
    
    -- Assignment
    assigned_to INTEGER, -- staff member
    assigned_at DATETIME,
    
    -- Lead Value
    estimated_value DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    
    -- Qualification
    is_qualified INTEGER DEFAULT 0,
    qualified_at DATETIME,
    qualified_by INTEGER,
    
    -- Conversion
    is_converted INTEGER DEFAULT 0,
    converted_at DATETIME,
    converted_to_user_id INTEGER, -- Link to users table if converted
    
    -- Additional Info
    tags TEXT, -- JSON array of tags
    notes TEXT, -- Internal notes
    custom_fields TEXT, -- JSON for custom data
    
    -- Tracking
    last_contact_at DATETIME,
    next_follow_up DATETIME,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    
    FOREIGN KEY (assigned_to) REFERENCES admin_users(id),
    FOREIGN KEY (qualified_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id),
    FOREIGN KEY (converted_to_user_id) REFERENCES users(id)
);

-- Lead activities/interactions
CREATE TABLE IF NOT EXISTS lead_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    
    activity_type TEXT NOT NULL, -- call, email, meeting, note, status_change, etc.
    title TEXT NOT NULL,
    description TEXT,
    
    -- Activity details
    outcome TEXT, -- successful, unsuccessful, no_answer, etc.
    duration_minutes INTEGER,
    
    -- Scheduling
    scheduled_at DATETIME,
    completed_at DATETIME,
    
    -- Staff tracking
    performed_by INTEGER,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT, -- JSON for additional data
    
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES admin_users(id)
);

-- Lead sources for tracking
CREATE TABLE IF NOT EXISTS lead_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default lead sources
INSERT OR IGNORE INTO lead_sources (name, description) VALUES
('website', 'Website contact form'),
('referral', 'Customer referral'),
('social_media', 'Social media platforms'),
('cold_call', 'Cold calling'),
('email_campaign', 'Email marketing campaign'),
('event', 'Trade shows and events'),
('paid_ads', 'Paid advertising'),
('organic_search', 'Organic search (SEO)'),
('partnership', 'Partner referrals'),
('other', 'Other sources');

-- Lead tags for categorization
CREATE TABLE IF NOT EXISTS lead_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tags
INSERT OR IGNORE INTO lead_tags (name, color) VALUES
('hot', '#ef4444'),
('warm', '#f59e0b'),
('cold', '#3b82f6'),
('high_value', '#10b981'),
('enterprise', '#8b5cf6'),
('small_business', '#06b6d4'),
('follow_up', '#f97316'),
('demo_requested', '#14b8a6'),
('pricing_inquiry', '#a855f7'),
('competitor', '#ec4899');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at);
