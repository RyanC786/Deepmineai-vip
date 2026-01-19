-- Update Mining Packages with CORRECT Daily Earnings
-- Based on real mining data provided by client

-- Update existing packages with correct daily earnings
UPDATE mining_packages SET daily_earnings = 8.00 WHERE id = 6;  -- RTX 4090 24G: $8/day
UPDATE mining_packages SET daily_earnings = 18.00 WHERE id = 8; -- A100 48G: $18/day
UPDATE mining_packages SET daily_earnings = 28.00 WHERE id = 7; -- A100 72G: $28/day
UPDATE mining_packages SET daily_earnings = 38.00 WHERE id = 9; -- A100 96G: $38/day
UPDATE mining_packages SET daily_earnings = 88.00 WHERE id = 5; -- H200 84G: $88/day
UPDATE mining_packages SET daily_earnings = 108.00 WHERE id = 4; -- H200 120G: $108/day
UPDATE mining_packages SET daily_earnings = 168.00 WHERE id = 3; -- H800 320G: $168/day
UPDATE mining_packages SET daily_earnings = 545.00 WHERE id = 2; -- H800 6400G: $545/day
UPDATE mining_packages SET daily_earnings = 909.00 WHERE id = 1; -- H800 8400G: $909/day

-- Update RTX 4090 name to specify East China Region
UPDATE mining_packages SET 
  name = 'RTX 4090 24G Server (East China)',
  description = 'East China Region - Perfect for beginners with gaming-grade RTX 4090.'
WHERE id = 6;

-- Add 10th package: RTX 4090 South China Region
INSERT INTO mining_packages (
  name, 
  description, 
  price, 
  hash_rate, 
  daily_earnings, 
  duration_days, 
  is_active
) VALUES (
  'RTX 4090 24G Server (South China)',
  'South China Region - Affordable entry point with RTX 4090 performance.',
  500,
  8,
  8.00,
  180,
  1
);

-- Verify the updates
SELECT 
  id,
  name,
  price,
  daily_earnings,
  (daily_earnings * duration_days) as total_earnings_180d,
  ROUND(((daily_earnings * duration_days) / price * 100), 2) as roi_percentage
FROM mining_packages 
ORDER BY price ASC;
