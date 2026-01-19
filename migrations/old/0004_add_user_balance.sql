-- Add balance column to users table
ALTER TABLE users ADD COLUMN balance REAL DEFAULT 0;

-- Create index for balance queries
CREATE INDEX IF NOT EXISTS idx_users_balance ON users(balance);
