-- Delete rayhan@deepmineai.vip user and all related records
-- Execute on: deepmine-production (remote)

-- 1. Delete from kyc_submissions (foreign key constraint)
DELETE FROM kyc_submissions WHERE user_id = 6;

-- 2. Delete from referral_tree (if any)
DELETE FROM referral_tree WHERE user_id = 6 OR ancestor_id = 6;

-- 3. Delete from user_miners (if any)
DELETE FROM user_miners WHERE user_id = 6;

-- 4. Delete from registrations table
DELETE FROM registrations WHERE email = 'rayhan@deepmineai.vip';

-- 5. Delete from users table (main record)
DELETE FROM users WHERE id = 6 AND email = 'rayhan@deepmineai.vip';

-- Verify deletion
SELECT 'Users table' as table_name, COUNT(*) as remaining_records FROM users WHERE email = 'rayhan@deepmineai.vip'
UNION ALL
SELECT 'Registrations table', COUNT(*) FROM registrations WHERE email = 'rayhan@deepmineai.vip'
UNION ALL
SELECT 'KYC submissions', COUNT(*) FROM kyc_submissions WHERE user_id = 6
UNION ALL
SELECT 'Referral tree', COUNT(*) FROM referral_tree WHERE user_id = 6 OR ancestor_id = 6;
