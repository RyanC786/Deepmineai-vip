-- ============================================
-- DELETE TEST USERS WITH PROPER CASCADE
-- ============================================
-- Target Users: IDs 7, 8, 10, 11
-- Delete child records first to avoid FK constraints
-- ============================================

-- Disable foreign keys temporarily (if supported)
PRAGMA foreign_keys = OFF;

-- STEP 1: Delete child records first (no FK dependencies)
DELETE FROM earnings_history WHERE user_id IN (7, 8, 10, 11);
DELETE FROM mining_sessions WHERE miner_id IN (SELECT id FROM user_miners WHERE user_id IN (7, 8, 10, 11));
DELETE FROM admin_logs WHERE target_type = 'miner' AND target_id IN (SELECT id FROM user_miners WHERE user_id IN (7, 8, 10, 11));

-- STEP 2: Delete user miners
DELETE FROM user_miners WHERE user_id IN (7, 8, 10, 11);

-- STEP 3: Delete financial records
DELETE FROM deposits WHERE user_id IN (7, 8, 10, 11);
DELETE FROM withdrawals WHERE user_id IN (7, 8, 10, 11);
DELETE FROM transactions WHERE user_id IN (7, 8, 10, 11);

-- STEP 4: Delete KYC and user-related records
DELETE FROM kyc_submissions WHERE user_id IN (7, 8, 10, 11);
DELETE FROM referrals WHERE referrer_id IN (7, 8, 10, 11);
DELETE FROM referrals WHERE referred_id IN (7, 8, 10, 11);
DELETE FROM admin_logs WHERE target_type = 'user' AND CAST(target_id AS TEXT) IN ('7', '8', '10', '11');

-- STEP 5: Delete the users
DELETE FROM users WHERE id IN (7, 8, 10, 11);

-- Re-enable foreign keys
PRAGMA foreign_keys = ON;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'DELETED - Test users remaining:' as status, COUNT(*) as count FROM users WHERE id IN (7, 8, 10, 11);
SELECT 'DELETED - Test miners remaining:' as status, COUNT(*) as count FROM user_miners WHERE user_id IN (7, 8, 10, 11);
SELECT 'RESULT - Total users:' as status, COUNT(*) as count FROM users;
SELECT 'RESULT - Total active miners:' as status, COUNT(*) as count FROM user_miners WHERE activation_status = 'active';
SELECT 'RESULT - Total balances:' as status, ROUND(SUM(balance), 2) as amount FROM users;
