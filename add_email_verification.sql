-- Add email verification columns to registrations table
ALTER TABLE registrations ADD COLUMN verification_token TEXT;
ALTER TABLE registrations ADD COLUMN email_verified INTEGER DEFAULT 0;
ALTER TABLE registrations ADD COLUMN verified_at DATETIME;
