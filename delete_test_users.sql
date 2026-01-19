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
-- STEP 2: Delete user miners (active machines)
-- ============================================
DELETE FROM user_miners WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 3: Delete deposits
-- ============================================
DELETE FROM deposits WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 4: Delete withdrawals
-- ============================================
DELETE FROM withdrawals WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 5: Delete transactions
-- ============================================
DELETE FROM transactions WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 6: Delete KYC documents (if exists)
-- ============================================
DELETE FROM kyc_documents WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 7: Delete sessions
-- ============================================
DELETE FROM sessions WHERE user_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 8: Delete admin logs related to these users
-- ============================================
DELETE FROM admin_logs WHERE target_type = 'user' AND target_id IN (7, 8, 10, 11);

-- ============================================
-- STEP 9: Finally, delete the users themselves
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
