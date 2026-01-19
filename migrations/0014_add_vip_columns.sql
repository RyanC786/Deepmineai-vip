-- Add VIP-related columns to users table

ALTER TABLE users ADD COLUMN vip_level INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN vip_updated_at DATETIME;
ALTER TABLE users ADD COLUMN total_referrals INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN referred_by_user_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_users_vip_level ON users(vip_level);
CREATE INDEX IF NOT EXISTS idx_users_referred_by_user ON users(referred_by_user_id);
