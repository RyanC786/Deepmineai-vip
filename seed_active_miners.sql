-- Seed Active Miners with Partner Residual Tracking
-- Based on existing active contracts

-- First, let's check if these miners already exist and get the user/package IDs
-- Miner #24: Daniel Kalashnikova - RTX 4090 24G Server (East China)
-- Started: 06/01/2026, Expires: 05/07/2026
-- Miner #23: Stacey Lucas - RTX 4090 24G Server (East China)  
-- Started: 01/01/2026, Expires: 30/06/2026
-- Miner #22: Suhanul Islam - RTX 4090 24G Server (South China)
-- Started: 16/12/2025, Expires: 14/06/2026
-- Miner #21: Suhanul Islam - RTX 4090 24G Server (East China)
-- Started: 16/12/2025, Expires: 14/06/2026

-- Get user IDs
-- Daniel Kalashnikova: katerinajaily@gmail.com
-- Stacey Lucas: stacey6122@gmail.com  
-- Suhanul Islam: suhanulislam102594@gmail.com

-- Get package IDs for RTX 4090 servers
-- We need to find the correct package IDs from mining_packages table

-- Insert partner residuals for existing active miners
-- Each miner: Investment $500, Daily $8, 180 days
-- Net Profit: (180 * $8) - $500 = $1,440 - $500 = $940
-- 2% Residual: $940 * 0.02 = $18.80

-- Miner #24: Daniel Kalashnikova
INSERT OR IGNORE INTO partner_residuals (
  partner_id,
  user_id,
  machine_id,
  package_id,
  package_name,
  investment,
  daily_rate,
  contract_duration,
  total_return,
  net_profit,
  residual_amount,
  status,
  start_date,
  created_at
) 
SELECT 
  1, -- partner_id
  (SELECT id FROM users WHERE email = 'katerinajaily@gmail.com' LIMIT 1),
  24, -- machine_id
  (SELECT id FROM mining_packages WHERE name LIKE '%RTX 4090%' AND name LIKE '%East China%' LIMIT 1),
  'RTX 4090 24G Server (East China)',
  500,
  8,
  180,
  1440,
  940,
  18.80,
  'pending',
  '2026-01-06',
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'katerinajaily@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM partner_residuals 
    WHERE machine_id = 24
  );

-- Miner #23: Stacey Lucas
INSERT OR IGNORE INTO partner_residuals (
  partner_id,
  user_id,
  machine_id,
  package_id,
  package_name,
  investment,
  daily_rate,
  contract_duration,
  total_return,
  net_profit,
  residual_amount,
  status,
  start_date,
  created_at
) 
SELECT 
  1,
  (SELECT id FROM users WHERE email = 'stacey6122@gmail.com' LIMIT 1),
  23,
  (SELECT id FROM mining_packages WHERE name LIKE '%RTX 4090%' AND name LIKE '%East China%' LIMIT 1),
  'RTX 4090 24G Server (East China)',
  500,
  8,
  180,
  1440,
  940,
  18.80,
  'pending',
  '2026-01-01',
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'stacey6122@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM partner_residuals 
    WHERE machine_id = 23
  );

-- Miner #22: Suhanul Islam - South China
INSERT OR IGNORE INTO partner_residuals (
  partner_id,
  user_id,
  machine_id,
  package_id,
  package_name,
  investment,
  daily_rate,
  contract_duration,
  total_return,
  net_profit,
  residual_amount,
  status,
  start_date,
  created_at
) 
SELECT 
  1,
  (SELECT id FROM users WHERE email = 'suhanulislam102594@gmail.com' LIMIT 1),
  22,
  (SELECT id FROM mining_packages WHERE name LIKE '%RTX 4090%' AND name LIKE '%South China%' LIMIT 1),
  'RTX 4090 24G Server (South China)',
  500,
  8,
  180,
  1440,
  940,
  18.80,
  'pending',
  '2025-12-16',
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'suhanulislam102594@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM partner_residuals 
    WHERE machine_id = 22
  );

-- Miner #21: Suhanul Islam - East China
INSERT OR IGNORE INTO partner_residuals (
  partner_id,
  user_id,
  machine_id,
  package_id,
  package_name,
  investment,
  daily_rate,
  contract_duration,
  total_return,
  net_profit,
  residual_amount,
  status,
  start_date,
  created_at
) 
SELECT 
  1,
  (SELECT id FROM users WHERE email = 'suhanulislam102594@gmail.com' LIMIT 1),
  21,
  (SELECT id FROM mining_packages WHERE name LIKE '%RTX 4090%' AND name LIKE '%East China%' LIMIT 1),
  'RTX 4090 24G Server (East China)',
  500,
  8,
  180,
  1440,
  940,
  18.80,
  'pending',
  '2025-12-16',
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'suhanulislam102594@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM partner_residuals 
    WHERE machine_id = 21
  );
