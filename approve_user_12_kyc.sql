-- ============================================
-- APPROVE USER ID 12 (Suhanul Islam) KYC
-- ============================================
-- User: suhanulislam102594@gmail.com
-- Current Status: pending
-- Target Status: approved
-- ============================================

-- STEP 1: Update KYC submission to approved
UPDATE kyc_submissions
SET review_status = 'approved',
    reviewed_at = datetime('now'),
    reviewed_by = 'admin',
    admin_notes = 'KYC Approved - Manual approval via SQL'
WHERE user_id = 12 AND id = 8;

-- STEP 2: Update user's KYC status to approved
UPDATE users
SET kyc_status = 'approved',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 12;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check KYC submission status
SELECT 'KYC Submission Status:' as info, 
       id, user_id, review_status, reviewed_at, admin_notes 
FROM kyc_submissions 
WHERE user_id = 12;

-- Check user status
SELECT 'User KYC Status:' as info,
       id, email, kyc_status, account_status, balance, wallet_balance
FROM users
WHERE id = 12;
