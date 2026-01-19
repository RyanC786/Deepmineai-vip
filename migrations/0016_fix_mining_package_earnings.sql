-- Fix mining package daily earnings to match correct values
-- $500 = $8/day, $2000 = $38/day, $5000 = $88/day, $7000 = $108/day, $11000 = $168/day, $30000 = $545/day

UPDATE mining_packages SET daily_earnings = 8 WHERE price = 500;
UPDATE mining_packages SET daily_earnings = 38 WHERE price = 2000;
UPDATE mining_packages SET daily_earnings = 88 WHERE price = 5000;
UPDATE mining_packages SET daily_earnings = 108 WHERE price = 7000;
UPDATE mining_packages SET daily_earnings = 168 WHERE price = 11000;
UPDATE mining_packages SET daily_earnings = 545 WHERE price = 30000;

-- Update all existing active miners to have correct daily rates from their packages
UPDATE user_miners 
SET daily_rate = (
  SELECT daily_earnings 
  FROM mining_packages 
  WHERE mining_packages.id = user_miners.package_id
)
WHERE status = 'active';
