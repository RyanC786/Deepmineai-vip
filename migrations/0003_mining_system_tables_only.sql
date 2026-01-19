-- Mining Packages Table
CREATE TABLE IF NOT EXISTS mining_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  hash_rate REAL NOT NULL,
  price REAL NOT NULL,
  daily_earnings REAL NOT NULL,
  duration_days INTEGER NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Miners Table (Purchased packages)
CREATE TABLE IF NOT EXISTS user_miners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  hash_rate REAL NOT NULL,
  daily_rate REAL NOT NULL,
  total_earned REAL DEFAULT 0,
  started_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  last_earning_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (package_id) REFERENCES mining_packages(id)
);

-- Earnings History Table
CREATE TABLE IF NOT EXISTS earnings_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  miner_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (miner_id) REFERENCES user_miners(id)
);

-- Mining Sessions Table
CREATE TABLE IF NOT EXISTS mining_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  miner_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (miner_id) REFERENCES user_miners(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_miners_user_id ON user_miners(user_id);
CREATE INDEX IF NOT EXISTS idx_user_miners_status ON user_miners(status);
CREATE INDEX IF NOT EXISTS idx_earnings_history_user_id ON earnings_history(user_id);
CREATE INDEX IF NOT EXISTS idx_earnings_history_date ON earnings_history(date);
CREATE INDEX IF NOT EXISTS idx_mining_sessions_user_id ON mining_sessions(user_id);
