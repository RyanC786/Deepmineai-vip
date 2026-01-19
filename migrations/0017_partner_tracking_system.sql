-- ================================
-- Partner Residual Tracking System
-- 2% residual on net profit after 180 days
-- ================================

-- Partner configuration table
CREATE TABLE IF NOT EXISTS partner_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_name TEXT NOT NULL,
  partner_email TEXT NOT NULL,
  residual_percentage REAL NOT NULL DEFAULT 2.0, -- 2% default
  calculation_method TEXT NOT NULL DEFAULT 'net_profit', -- 'net_profit' or 'total_returns'
  payment_frequency TEXT NOT NULL DEFAULT 'per_contract', -- 'per_contract', 'monthly', 'quarterly'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Partner residual tracking table
CREATE TABLE IF NOT EXISTS partner_residuals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  miner_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  package_name TEXT NOT NULL,
  investment_amount REAL NOT NULL,
  daily_earnings REAL NOT NULL,
  total_earnings REAL NOT NULL, -- After 180 days
  net_profit REAL NOT NULL, -- total_earnings - investment_amount
  residual_percentage REAL NOT NULL,
  residual_amount REAL NOT NULL, -- Calculated residual
  contract_start_date DATE NOT NULL,
  contract_end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'paid'
  completed_at DATETIME,
  paid_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partner_config(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (miner_id) REFERENCES user_miners(id),
  FOREIGN KEY (package_id) REFERENCES mining_packages(id)
);

-- Partner payout history
CREATE TABLE IF NOT EXISTS partner_payouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_id INTEGER NOT NULL,
  payout_period_start DATE NOT NULL,
  payout_period_end DATE NOT NULL,
  total_contracts INTEGER NOT NULL,
  total_residual_amount REAL NOT NULL,
  payment_method TEXT, -- 'manual', 'crypto', 'bank_transfer'
  payment_reference TEXT,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  paid_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partner_config(id)
);

-- Link payout to individual residuals
CREATE TABLE IF NOT EXISTS partner_payout_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payout_id INTEGER NOT NULL,
  residual_id INTEGER NOT NULL,
  residual_amount REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payout_id) REFERENCES partner_payouts(id),
  FOREIGN KEY (residual_id) REFERENCES partner_residuals(id)
);

-- Withdrawal fee tracking (2% platform fee)
CREATE TABLE IF NOT EXISTS withdrawal_fee_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  withdrawal_id INTEGER,
  user_id INTEGER NOT NULL,
  withdrawal_amount REAL NOT NULL,
  fee_percentage REAL NOT NULL DEFAULT 2.0,
  fee_amount REAL NOT NULL, -- 2% of withdrawal_amount
  network_type TEXT NOT NULL, -- 'TRC-20', 'ERC-20', 'BTC'
  network_fee REAL NOT NULL, -- Actual network cost (e.g., $1 for TRC-20)
  net_profit REAL NOT NULL, -- fee_amount - network_fee
  profit_margin_percentage REAL NOT NULL, -- (net_profit / fee_amount) * 100
  withdrawal_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default partner configuration
INSERT INTO partner_config (partner_name, partner_email, residual_percentage, calculation_method, payment_frequency)
VALUES ('Primary Partner', 'partner@deepmineai.vip', 2.0, 'net_profit', 'per_contract');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_residuals_status ON partner_residuals(status);
CREATE INDEX IF NOT EXISTS idx_partner_residuals_partner_id ON partner_residuals(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_residuals_contract_end ON partner_residuals(contract_end_date);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_partner_id ON partner_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_analytics_date ON withdrawal_fee_analytics(withdrawal_date);
