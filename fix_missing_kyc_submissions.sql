-- Fix missing KYC submissions for users
-- This script creates kyc_submissions records for users who don't have them yet

-- Insert KYC submissions for users without submissions
INSERT INTO kyc_submissions (user_id, scan_ref, auth_token, review_status, submitted_at)
SELECT 
  u.id as user_id,
  'legacy-' || u.id as scan_ref,
  'legacy-auth-' || u.id as auth_token,
  CASE 
    WHEN u.kyc_status = 'approved' THEN 'approved'
    WHEN u.kyc_status = 'rejected' THEN 'rejected'
    ELSE 'pending'
  END as review_status,
  datetime('now') as submitted_at
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM kyc_submissions k WHERE k.user_id = u.id
);

-- Verify the fix
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.kyc_status as user_kyc_status,
  k.id as submission_id,
  k.review_status as submission_status
FROM users u
LEFT JOIN kyc_submissions k ON k.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 20;
