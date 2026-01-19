-- ============================================
-- DELETE TEST USERS AND ALL RELATED DATA
-- ============================================
-- Target Users: IDs 7, 8, 10, 11
-- These are test accounts that need to be cleaned up
-- ============================================

-- Summary of test users before deletion:
-- ID 7: rayhan@deepmineai.vip (balance: $1.10)
-- ID 8: jamesmichael02863@gmail.com (balance: $1,998.59)
-- ID 10: bnai48826@gmail.com (balance: $163.48, 4 active miners)
-- ID 11: dizang91777@gmail.com (balance: $0.00)

-- ============================================
-- STEP 1: Delete earnings history
-- ============================================
DELETE FROM earnings_history WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 2: Delete daily earnings
-- ============================================
DELETE FROM daily_earnings WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 3: Delete mining sessions
-- ============================================
DELETE FROM mining_sessions WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 4: Delete user miners (active machines)
-- ============================================
DELETE FROM user_miners WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 5: Delete user contracts
-- ============================================
DELETE FROM user_contracts WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 6: Delete deposits
-- ============================================
DELETE FROM deposits WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 7: Delete withdrawals
-- ============================================
DELETE FROM withdrawals WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 8: Delete transactions
-- ============================================
DELETE FROM transactions WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 9: Delete KYC submissions
-- ============================================
DELETE FROM kyc_submissions WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 10: Delete referrals (as referrer)
-- ============================================
DELETE FROM referrals WHERE referrer_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 11: Delete referrals (as referred)
-- ============================================
DELETE FROM referrals WHERE referred_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 12: Delete referral commissions
-- ============================================
DELETE FROM referral_commissions WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 13: Delete referral tree
-- ============================================
DELETE FROM referral_tree WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 14: Delete daily checkins
-- ============================================
DELETE FROM daily_checkins WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 15: Delete daily login bonuses
-- ============================================
DELETE FROM daily_login_bonuses WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 16: Delete registrations
-- ============================================
DELETE FROM registrations WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 17: Delete admin logs related to these users
-- ============================================
DELETE FROM admin_logs WHERE target_type = 'user' AND target_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 18: Finally, delete the users themselves
-- ============================================
DELETE FROM users WHERE id IN (7, 8, 10, 11);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if users are deleted
SELECT 'Remaining test users (should be 0):' as check_type, COUNT(*) as count FROM users WHERE id IN (7, 8, 10, 11);

-- Check if miners are deleted
SELECT 'Remaining test user miners (should be 0):' as check_type, COUNT(*) as count FROM user_miners WHERE user_id IN (7, 8, 10, 11);

-- Check if earnings are deleted
SELECT 'Remaining test user earnings (should be 0):' as check_type, COUNT(*) as count FROM earnings_history WHERE user_id IN (7, 8, 10, 11);

-- Show remaining users
SELECT 'Total remaining users:' as info, COUNT(*) as count FROM users;

-- Show remaining active miners
SELECT 'Total remaining active miners:' as info, COUNT(*) as count FROM user_miners WHERE activation_status = 'active';

-- Show total balance in system
SELECT 'Total user balances:' as info, CAST(SUM(balance) AS TEXT) as total_balance FROM users;

-- Show active users only (ID 3 and ID 5)
SELECT id, email, balance, wallet_balance, kyc_status FROM users ORDER BY id;
