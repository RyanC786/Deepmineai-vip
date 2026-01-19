-- Fix User ID 5 Deposit Error
-- User deposited $1,000 USDT, not 1000 ETH
-- System incorrectly converted 1000 ETH to $3,245,381

-- Current incorrect balance: $3,245,381
-- Correct balance should be: $1,000
-- Amount to deduct: $3,244,381

-- Step 1: Correct the deposit record to show USDT instead of ETH
UPDATE deposits
SET amount = 1000,
    currency = 'USDT',
    admin_notes = 'Corrected: User deposited $1,000 USDT (not 1000 ETH)',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 8 AND user_id = 5;

-- Step 2: Correct user balance from $3,245,381 to $1,000
UPDATE users
SET balance = 1000,
    wallet_balance = 1000,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 5;

-- Verify the fix
SELECT 'User Balance After Fix:' as description, id, email, balance, wallet_balance FROM users WHERE id = 5;
SELECT 'Deposit Record After Fix:' as description, id, user_id, amount, currency, status, admin_notes FROM deposits WHERE id = 8;
