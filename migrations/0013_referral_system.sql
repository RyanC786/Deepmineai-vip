-- Referral System Tables Only (no indexes or data)
-- This is a simplified version to avoid migration issues

-- VIP Levels
CREATE TABLE IF NOT EXISTS vip_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profit_share REAL NOT NULL,
  min_total_purchase REAL DEFAULT 0,
  min_referrals INTEGER DEFAULT 0,
  benefits TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Referral Tracking
CREATE TABLE IF NOT EXISTS user_referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  referrer_id INTEGER NOT NULL,
  referral_code TEXT,
  referral_level INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  first_purchase_date DATETIME,
  total_purchases REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, referrer_id)
);

-- Referral Commissions
CREATE TABLE IF NOT EXISTS referral_commissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  referred_user_id INTEGER NOT NULL,
  purchase_id INTEGER,
  commission_type TEXT NOT NULL,
  commission_level INTEGER NOT NULL,
  vip_level INTEGER,
  amount REAL NOT NULL,
  percentage REAL,
  purchase_amount REAL,
  status TEXT DEFAULT 'pending',
  approved_by INTEGER,
  approved_at DATETIME,
  paid_at DATETIME,
  payment_method TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Referral Statistics
CREATE TABLE IF NOT EXISTS referral_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  new_referrals INTEGER DEFAULT 0,
  active_referrals INTEGER DEFAULT 0,
  total_purchases REAL DEFAULT 0,
  commissions_earned REAL DEFAULT 0,
  level1_commissions REAL DEFAULT 0,
  level2_commissions REAL DEFAULT 0,
  level3_commissions REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Referral Payouts
CREATE TABLE IF NOT EXISTS referral_payouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  commission_ids TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_details TEXT,
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME,
  processed_by INTEGER,
  notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_referrals_user ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer ON user_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_status ON user_referrals(status);

CREATE INDEX IF NOT EXISTS idx_commissions_user ON referral_commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_referred_user ON referral_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON referral_commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_created ON referral_commissions(created_at);

CREATE INDEX IF NOT EXISTS idx_referral_stats_user_date ON referral_stats(user_id, date);

CREATE INDEX IF NOT EXISTS idx_payouts_user ON referral_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON referral_payouts(status);
