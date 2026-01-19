-- Manually calculate earnings for user 3's active miners
-- Miner #8: daily_rate = 8, last earning = 2025-12-06 21:57:22
-- Miner #9: daily_rate = 28, last earning = null (rejected, should not earn)

-- Add earnings for Dec 7 for Miner #8
INSERT INTO earnings_history (user_id, miner_id, amount, date, created_at) 
VALUES (3, 8, 8.0, '2025-12-07', datetime('now'));

-- Add earnings for Dec 8 for Miner #8
INSERT INTO earnings_history (user_id, miner_id, amount, date, created_at) 
VALUES (3, 8, 8.0, '2025-12-08', datetime('now'));

-- Update user balance (64.51 + 8 + 8 = 80.51)
UPDATE users SET balance = balance + 16.0 WHERE id = 3;

-- Update miner total_earned and last_earning_at
UPDATE user_miners 
SET total_earned = total_earned + 16.0, last_earning_at = datetime('now')
WHERE id = 8;

-- Show updated values
SELECT 'User balance:' as info, balance FROM users WHERE id = 3;
SELECT 'Miner status:' as info, id, daily_rate, total_earned, last_earning_at FROM user_miners WHERE user_id = 3;
SELECT 'Recent earnings:' as info, * FROM earnings_history WHERE user_id = 3 ORDER BY created_at DESC LIMIT 5;
