-- ================================
-- iDenfy Integration Migration
-- Update KYC submissions table for iDenfy
-- ================================

-- Add iDenfy-specific columns
ALTER TABLE kyc_submissions ADD COLUMN scan_ref TEXT;
ALTER TABLE kyc_submissions ADD COLUMN auth_token TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_kyc_scan_ref ON kyc_submissions(scan_ref);
CREATE INDEX IF NOT EXISTS idx_kyc_user_status ON kyc_submissions(user_id, review_status);

-- Update existing records to use new fields (if any exist)
-- This is safe as it will only affect test data
UPDATE kyc_submissions SET scan_ref = applicant_id WHERE scan_ref IS NULL AND applicant_id IS NOT NULL;
