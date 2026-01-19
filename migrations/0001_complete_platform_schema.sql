-- ================================
-- DeepMine AI Complete Platform Schema
-- ================================

-- Users table (expanded from registrations)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by_code TEXT,
  email_verified INTEGER DEFAULT 0,
  email_verification_token TEXT,
  email_verification_expires DATETIME,
  password_reset_token TEXT,
  password_reset_expires DATETIME,
  kyc_status TEXT DEFAULT 'pending', -- pending, submitted, approved, rejected
  kyc_submitted_at DATETIME,
  kyc_approved_at DATETIME,
  account_status TEXT DEFAULT 'active', -- active, suspended, banned
  wallet_balance REAL DEFAULT 0.00,
  total_invested REAL DEFAULT 0.00,
  total_earned REAL DEFAULT 0.00,
  total_withdrawn REAL DEFAULT 0.00,
  total_referral_earnings REAL DEFAULT 0.00,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- KYC submissions table
CREATE TABLE IF NOT EXISTS kyc_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  applicant_id TEXT, -- Sumsub/Onfido applicant ID
  review_status TEXT DEFAULT 'pending', -- pending, reviewing, approved, rejected, resubmit
  id_document_type TEXT, -- passport, driver_license, id_card
  id_document_front_url TEXT,
  id_document_back_url TEXT,
  selfie_url TEXT,
  proof_of_address_url TEXT,
  rejection_reason TEXT,
  admin_notes TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  reviewed_by INTEGER, -- admin user ID
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Mining packages (the 10 server models)
CREATE TABLE IF NOT EXISTS mining_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, -- H800, H200, A100-80GB, etc.
  model_type TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  hash_rate TEXT, -- e.g., "450 TH/s"
  power_consumption TEXT, -- e.g., "5300W"
  daily_return_rate REAL NOT NULL, -- e.g., 0.8 for 0.8%
  min_investment REAL NOT NULL,
  max_investment REAL NOT NULL,
  min_contract_days INTEGER DEFAULT 30,
  max_contract_days INTEGER DEFAULT 365,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User contracts (purchased mining packages)
CREATE TABLE IF NOT EXISTS user_contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  contract_number TEXT UNIQUE NOT NULL, -- e.g., "DM-2025-000001"
  investment_amount REAL NOT NULL,
  daily_return_rate REAL NOT NULL,
  daily_return_amount REAL NOT NULL,
  contract_days INTEGER NOT NULL,
  total_expected_return REAL NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  current_return REAL DEFAULT 0.00,
  last_payout_date DATE,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  payment_tx_hash TEXT, -- USDT transaction hash
  payment_amount REAL,
  payment_currency TEXT DEFAULT 'USDT',
  payment_network TEXT, -- TRC20, ERC20
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (package_id) REFERENCES mining_packages(id)
);

-- Daily earnings (manual admin entries or API sync)
CREATE TABLE IF NOT EXISTS daily_earnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  contract_id INTEGER NOT NULL,
  earning_date DATE NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'credited', -- credited, pending
  notes TEXT,
  created_by INTEGER, -- admin user ID if manual
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (contract_id) REFERENCES user_contracts(id),
  UNIQUE(contract_id, earning_date)
);

-- Transactions (all financial movements)
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- deposit, withdrawal, earning, referral_bonus, checkin_bonus, investment
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USDT',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
  description TEXT,
  reference_id TEXT, -- contract_id, withdrawal_id, etc.
  payment_method TEXT, -- usdt_trc20, usdt_erc20
  wallet_address TEXT,
  tx_hash TEXT,
  fee_amount REAL DEFAULT 0.00,
  net_amount REAL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  withdrawal_number TEXT UNIQUE NOT NULL, -- e.g., "WD-2025-000001"
  amount REAL NOT NULL,
  fee_amount REAL DEFAULT 0.00,
  net_amount REAL NOT NULL,
  currency TEXT DEFAULT 'USDT',
  network TEXT NOT NULL, -- TRC20, ERC20
  wallet_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, processing, completed, rejected, cancelled
  admin_notes TEXT,
  rejection_reason TEXT,
  tx_hash TEXT,
  approved_by INTEGER, -- admin user ID
  approved_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Referral tracking
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id INTEGER NOT NULL, -- user who referred
  referred_id INTEGER NOT NULL, -- user who was referred
  referral_code TEXT NOT NULL,
  commission_rate REAL DEFAULT 5.0, -- 5%
  total_commission_earned REAL DEFAULT 0.00,
  status TEXT DEFAULT 'active', -- active, inactive
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referred_id) REFERENCES users(id),
  UNIQUE(referrer_id, referred_id)
);

-- Referral commissions
CREATE TABLE IF NOT EXISTS referral_commissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referral_id INTEGER NOT NULL,
  referrer_id INTEGER NOT NULL,
  referred_id INTEGER NOT NULL,
  contract_id INTEGER NOT NULL,
  commission_amount REAL NOT NULL,
  commission_rate REAL NOT NULL,
  base_amount REAL NOT NULL, -- original contract investment
  status TEXT DEFAULT 'credited', -- pending, credited
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referral_id) REFERENCES referrals(id),
  FOREIGN KEY (contract_id) REFERENCES user_contracts(id)
);

-- Daily check-ins
CREATE TABLE IF NOT EXISTS daily_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  checkin_date DATE NOT NULL,
  checkin_time TIME NOT NULL,
  bonus_amount REAL DEFAULT 1.00,
  is_before_deadline INTEGER DEFAULT 0, -- 1 if before 5 PM UK time
  streak_days INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, checkin_date)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  permissions TEXT,
  is_active INTEGER DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- kyc_approval, withdrawal_approval, user_suspension, etc.
  target_type TEXT, -- user, contract, withdrawal
  target_id INTEGER,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'string', -- string, number, boolean, json
  description TEXT,
  updated_by INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payment webhooks log (for USDT payments)
CREATE TABLE IF NOT EXISTS payment_webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_id TEXT,
  order_id TEXT,
  payment_status TEXT,
  amount REAL,
  currency TEXT,
  network TEXT,
  tx_hash TEXT,
  webhook_data TEXT, -- JSON payload
  processed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Indexes for Performance
-- ================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);

-- KYC indexes
CREATE INDEX IF NOT EXISTS idx_kyc_user_id ON kyc_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_submissions(review_status);
CREATE INDEX IF NOT EXISTS idx_kyc_applicant_id ON kyc_submissions(applicant_id);

-- Contracts indexes
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON user_contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON user_contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON user_contracts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_contracts_number ON user_contracts(contract_number);

-- Earnings indexes
CREATE INDEX IF NOT EXISTS idx_earnings_user_id ON daily_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_earnings_contract_id ON daily_earnings(contract_id);
CREATE INDEX IF NOT EXISTS idx_earnings_date ON daily_earnings(earning_date);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);

-- Withdrawals indexes
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_number ON withdrawals(withdrawal_number);

-- Referrals indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- Check-ins indexes
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON daily_checkins(checkin_date);

-- Admin logs indexes (idx_admin_username already exists from migration 0001)
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at);

-- ================================
-- Update existing admin user with new fields
-- ================================
UPDATE admin_users 
SET full_name = 'System Administrator', 
    role = 'super_admin', 
    is_active = 1,
    email = 'admin@deepmineai.vip'
WHERE username = 'admin';

-- ================================
-- Seed Data: Default System Settings
-- ================================
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('min_withdrawal_amount', '50', 'number', 'Minimum USDT withdrawal amount'),
('withdrawal_fee_percent', '2', 'number', 'Withdrawal fee percentage'),
('referral_commission_rate', '5', 'number', 'Referral commission percentage'),
('checkin_bonus_amount', '1', 'number', 'Daily check-in bonus in USDT'),
('checkin_deadline_hour', '17', 'number', 'Check-in deadline hour (UK time, 24h format)'),
('kyc_required_for_withdrawal', 'true', 'boolean', 'Require KYC approval before withdrawal'),
('platform_wallet_usdt_trc20', '', 'string', 'Platform USDT TRC20 wallet address'),
('platform_wallet_usdt_erc20', '', 'string', 'Platform USDT ERC20 wallet address'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('max_daily_withdrawal_limit', '10000', 'number', 'Maximum daily withdrawal limit per user');
