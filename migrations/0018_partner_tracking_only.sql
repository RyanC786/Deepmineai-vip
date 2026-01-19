-- Partner Tracking System - Tables Only
-- This migration only creates partner tracking tables
-- Safe to apply to existing database

-- Partner configuration table
CREATE TABLE IF NOT EXISTS partner_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_name TEXT NOT NULL,
  partner_email TEXT NOT NULL,
  percentage REAL NOT NULL DEFAULT 2.0,
  calculation_type TEXT NOT NULL DEFAULT 'net_profit', -- 'net_profit' or 'total_return'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Partner residuals tracking table
CREATE TABLE IF NOT EXISTS partner_residuals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  machine_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  package_name TEXT NOT NULL,
  investment REAL NOT NULL,
  daily_rate REAL NOT NULL,
  contract_duration INTEGER NOT NULL DEFAULT 180,
  total_return REAL NOT NULL,
  net_profit REAL NOT NULL,
  residual_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'paid'
  start_date DATE NOT NULL,
  completed_at DATETIME,
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partner_config(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (machine_id) REFERENCES user_miners(id),
  FOREIGN KEY (package_id) REFERENCES mining_packages(id)
);

-- Partner payouts table
CREATE TABLE IF NOT EXISTS partner_payouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_id INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  residual_count INTEGER NOT NULL,
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partner_config(id)
);

-- Partner payout items (link residuals to payouts)
CREATE TABLE IF NOT EXISTS partner_payout_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payout_id INTEGER NOT NULL,
  residual_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payout_id) REFERENCES partner_payouts(id),
  FOREIGN KEY (residual_id) REFERENCES partner_residuals(id)
);

-- Withdrawal fee analytics
CREATE TABLE IF NOT EXISTS withdrawal_fee_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  withdrawal_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  withdrawal_amount REAL NOT NULL,
  fee_percentage REAL NOT NULL DEFAULT 2.0,
  gross_fee REAL NOT NULL,
  network_cost REAL NOT NULL DEFAULT 1.0, -- TRC-20 fee
  net_profit REAL NOT NULL,
  profit_margin REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (withdrawal_id) REFERENCES withdrawals(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default partner config
INSERT OR IGNORE INTO partner_config (id, partner_name, partner_email, percentage, calculation_type) 
VALUES (1, 'Aleena DeepMine', 'aleena@deepmineai.vip', 2.0, 'net_profit');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_residuals_partner_id ON partner_residuals(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_residuals_status ON partner_residuals(status);
CREATE INDEX IF NOT EXISTS idx_partner_residuals_user_id ON partner_residuals(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_residuals_machine_id ON partner_residuals(machine_id);
CREATE INDEX IF NOT EXISTS idx_partner_residuals_completed_at ON partner_residuals(completed_at);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_partner_id ON partner_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_fee_analytics_user_id ON withdrawal_fee_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_fee_analytics_created_at ON withdrawal_fee_analytics(created_at);
