-- Add wallet_address column to users table
ALTER TABLE users ADD COLUMN wallet_address TEXT;
ALTER TABLE users ADD COLUMN wallet_locked INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN first_deposit_at DATETIME;

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  deposit_number TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'ETH',
  wallet_address TEXT NOT NULL,
  tx_hash TEXT,
  proof_url TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  rejection_reason TEXT,
  approved_by INTEGER,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for deposits
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_deposit_number ON deposits(deposit_number);

-- Add machine_id column to user_miners (will use this as user_machines)
ALTER TABLE user_miners ADD COLUMN purchase_price REAL DEFAULT 0;
ALTER TABLE user_miners ADD COLUMN activation_status TEXT DEFAULT 'pending';
ALTER TABLE user_miners ADD COLUMN activated_at DATETIME;
ALTER TABLE user_miners ADD COLUMN activated_by INTEGER;

-- Add indexes for user_miners
CREATE INDEX IF NOT EXISTS idx_user_miners_user_id ON user_miners(user_id);
CREATE INDEX IF NOT EXISTS idx_user_miners_status ON user_miners(status);
CREATE INDEX IF NOT EXISTS idx_user_miners_activation_status ON user_miners(activation_status);

-- Add new columns to transactions for better tracking
ALTER TABLE transactions ADD COLUMN machine_id INTEGER;
ALTER TABLE transactions ADD COLUMN deposit_id INTEGER;
ALTER TABLE transactions ADD COLUMN withdrawal_id INTEGER;

-- Create indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
