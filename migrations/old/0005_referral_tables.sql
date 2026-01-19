-- Create referral system tables (without foreign keys for compatibility)

CREATE TABLE IF NOT EXISTS referral_commissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  from_user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  commission_type TEXT NOT NULL,
  level INTEGER NOT NULL,
  package_purchase_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referral_tree (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  ancestor_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vip_levels (
  level INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_direct_referrals INTEGER NOT NULL,
  min_network_size INTEGER NOT NULL,
  level3_commission_percent REAL NOT NULL,
  benefits TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vip_levels (level, name, min_direct_referrals, min_network_size, level3_commission_percent, benefits) VALUES
(1, 'VIP 1', 0, 0, 3.0, 'Basic referral benefits'),
(2, 'VIP 2', 5, 5, 3.2, '5 direct referrals'),
(3, 'VIP 3', 10, 25, 3.4, '10 direct + 25 network'),
(4, 'VIP 4', 20, 50, 3.6, '20 direct + 50 network'),
(5, 'VIP 5', 35, 100, 3.8, '35 direct + 100 network'),
(6, 'VIP 6', 50, 200, 4.0, '50 direct + 200 network'),
(7, 'VIP 7', 75, 400, 4.2, '75 direct + 400 network'),
(8, 'VIP 8', 100, 800, 4.4, '100 direct + 800 network'),
(9, 'VIP 9', 150, 1500, 4.7, '150 direct + 1500 network'),
(10, 'VIP 10', 200, 3000, 5.0, '200 direct + 3000 network - Maximum level');

CREATE INDEX IF NOT EXISTS idx_referral_commissions_user ON referral_commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_from ON referral_commissions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_tree_user ON referral_tree(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_tree_ancestor ON referral_tree(ancestor_id);
