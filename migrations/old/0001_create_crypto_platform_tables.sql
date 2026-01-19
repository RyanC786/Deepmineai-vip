-- Migration: Create Crypto Platform Tables
-- Purpose: Add deposit, withdrawal, machine ownership, and transaction tracking
-- Date: 2025-12-06

-- ============================================
-- 1. Update users table - Add wallet address
-- ============================================
ALTER TABLE users ADD COLUMN wallet_address TEXT;
ALTER TABLE users ADD COLUMN wallet_locked INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN wallet_locked_at DATETIME;
ALTER TABLE users ADD COLUMN last_login_bonus_at DATETIME;
ALTER TABLE users ADD COLUMN login_bonus_earned REAL DEFAULT 0;

-- ============================================
-- 2. Create deposits table
-- ============================================
CREATE TABLE IF NOT EXISTS deposits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount_eth REAL NOT NULL,
    amount_usd REAL,
    transaction_hash TEXT NOT NULL,
    deposit_address TEXT NOT NULL,
    screenshot_url TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    verified_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

CREATE INDEX idx_deposits_user_id ON deposits(user_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_deposits_txhash ON deposits(transaction_hash);

-- ============================================
-- 3. Create withdrawals table
-- ============================================
CREATE TABLE IF NOT EXISTS withdrawals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    machine_id INTEGER,
    amount_usdt REAL NOT NULL,
    wallet_address TEXT NOT NULL,
    transaction_hash TEXT,
    status TEXT DEFAULT 'pending',
    decline_reason TEXT,
    admin_notes TEXT,
    processed_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES user_machines(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_wallet ON withdrawals(wallet_address);

-- ============================================
-- 4. Create user_machines table
-- ============================================
CREATE TABLE IF NOT EXISTS user_machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    purchase_price REAL NOT NULL,
    daily_earnings REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    activation_date DATETIME,
    expiry_date DATETIME,
    total_earned REAL DEFAULT 0,
    last_earning_date DATETIME,
    activated_by INTEGER,
    purchase_transaction_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES mining_packages(id),
    FOREIGN KEY (activated_by) REFERENCES users(id),
    FOREIGN KEY (purchase_transaction_id) REFERENCES transactions(id)
);

CREATE INDEX idx_user_machines_user_id ON user_machines(user_id);
CREATE INDEX idx_user_machines_status ON user_machines(status);
CREATE INDEX idx_user_machines_package ON user_machines(package_id);

-- ============================================
-- 5. Create transactions table (universal log)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    description TEXT,
    reference_id INTEGER,
    reference_type TEXT,
    transaction_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_reference ON transactions(reference_type, reference_id);

-- ============================================
-- 6. Create daily_earnings table (track daily mining)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_earnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    machine_id INTEGER NOT NULL,
    earning_date DATE NOT NULL,
    mining_amount REAL NOT NULL,
    login_bonus REAL DEFAULT 0,
    total_amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES user_machines(id) ON DELETE CASCADE,
    UNIQUE(user_id, machine_id, earning_date)
);

CREATE INDEX idx_daily_earnings_user ON daily_earnings(user_id);
CREATE INDEX idx_daily_earnings_date ON daily_earnings(earning_date);
CREATE INDEX idx_daily_earnings_machine ON daily_earnings(machine_id);

-- ============================================
-- 7. Verify tables created
-- ============================================
SELECT 
    'deposits' as table_name, 
    COUNT(*) as record_count 
FROM deposits
UNION ALL
SELECT 'withdrawals', COUNT(*) FROM withdrawals
UNION ALL
SELECT 'user_machines', COUNT(*) FROM user_machines
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'daily_earnings', COUNT(*) FROM daily_earnings;
