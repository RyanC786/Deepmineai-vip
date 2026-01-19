-- Migration: Daily Login Bonus System
-- Created: 2025-12-08
-- Description: Track daily login bonuses for users

-- Create daily_login_bonuses table
CREATE TABLE IF NOT EXISTS daily_login_bonuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  bonus_amount REAL DEFAULT 1.00,
  claimed_at DATETIME NOT NULL,
  claim_date DATE NOT NULL,  -- Date in UK timezone (YYYY-MM-DD)
  uk_time TIME NOT NULL,     -- Time when claimed in UK timezone (HH:MM:SS)
  is_valid BOOLEAN DEFAULT 1, -- 1 if claimed before 5 PM UK time, 0 otherwise
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, claim_date)  -- Prevent multiple claims per day
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_bonuses_user_date 
  ON daily_login_bonuses(user_id, claim_date);

CREATE INDEX IF NOT EXISTS idx_daily_bonuses_date 
  ON daily_login_bonuses(claim_date);

-- Add total_login_bonuses column to users table (track lifetime bonuses)
ALTER TABLE users ADD COLUMN total_login_bonuses REAL DEFAULT 0;

-- Create index for total_login_bonuses
CREATE INDEX IF NOT EXISTS idx_users_total_bonuses 
  ON users(total_login_bonuses);
