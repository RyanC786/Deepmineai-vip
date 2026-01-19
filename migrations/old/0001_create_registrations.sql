-- Registrations table for user sign-ups
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unique_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  access_code TEXT NOT NULL DEFAULT 'FIO3081',
  signup_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  email_sent INTEGER DEFAULT 0,
  ip_address TEXT,
  user_agent TEXT
);

-- Admin users table for CRM access
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_signup_date ON registrations(signup_date);
CREATE INDEX IF NOT EXISTS idx_registrations_unique_code ON registrations(unique_code);
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
