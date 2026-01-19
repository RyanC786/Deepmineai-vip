-- ============================================
-- DELETE TEST USERS AND ALL RELATED DATA (SIMPLIFIED)
-- ============================================
-- Target Users: IDs 7, 8, 10, 11
-- ============================================

-- STEP 1: Delete earnings history
DELETE FROM earnings_history WHERE user_id IN (7, 8, 10, 11);

-- STEP 2: Delete user miners (active machines)
DELETE FROM user_miners WHERE user_id IN (7, 8, 10, 11);

-- STEP 3: Delete deposits
DELETE FROM deposits WHERE user_id IN (7, 8, 10, 11);

-- STEP 4: Delete withdrawals
DELETE FROM withdrawals WHERE user_id IN (7, 8, 10, 11);

-- STEP 5: Delete transactions
DELETE FROM transactions WHERE user_id IN (7, 8, 10, 11);

-- STEP 6: Delete KYC submissions
DELETE FROM kyc_submissions WHERE user_id IN (7, 8, 10, 11);

-- STEP 7: Delete referrals (as referrer)
DELETE FROM referrals WHERE referrer_id IN (7, 8, 10, 11);

-- STEP 8: Delete referrals (as referred)
DELETE FROM referrals WHERE referred_id IN (7, 8, 10, 11);

-- STEP 9: Delete admin logs related to these users
DELETE FROM admin_logs WHERE target_type = 'user' AND CAST(target_id AS INTEGER) IN (7, 8, 10, 11);

-- STEP 10: Finally, delete the users themselves
DELETE FROM users WHERE id IN (7, 8, 10, 11);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if users are deleted
SELECT 'Test users deleted (should be 0):' as status, COUNT(*) as count FROM users WHERE id IN (7, 8, 10, 11);

-- Check if miners are deleted
SELECT 'Test user miners deleted (should be 0):' as status, COUNT(*) as count FROM user_miners WHERE user_id IN (7, 8, 10, 11);

-- Show remaining users
SELECT 'Total remaining users:' as status, COUNT(*) as count FROM users;

-- Show remaining active miners
SELECT 'Total remaining active miners:' as status, COUNT(*) as count FROM user_miners WHERE activation_status = 'active';

-- Show total balance in system
SELECT 'Total user balances:' as status, CAST(ROUND(SUM(balance), 2) AS TEXT) as amount FROM users;

-- Show all remaining users
SELECT id, email, balance, wallet_balance, kyc_status, account_status FROM users ORDER BY id;
