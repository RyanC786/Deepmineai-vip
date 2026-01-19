-- Reject Miner #9 and Refund $1,500 to User Balance
-- User: ryan786w@gmail.com (ID: 3)
-- Miner: #9 (Package #7, Purchase Price: $1,500)

-- Step 1: Set miner status to 'inactive' (full rejection)
UPDATE user_miners
SET status = 'inactive',
    activation_status = 'rejected'
WHERE id = 9;

-- Step 2: Deduct the $28 that was incorrectly earned
-- (This was earned when cron had a bug allowing rejected miners to earn)
UPDATE users
SET balance = balance - 28,
    wallet_balance = wallet_balance - 28
WHERE id = 3;

-- Step 3: Refund the $1,500 purchase price
UPDATE users
SET balance = balance + 1500,
    wallet_balance = wallet_balance + 1500
WHERE id = 3;

-- Step 4: Log the refund transaction
INSERT INTO transactions (
    user_id,
    transaction_type,
    amount,
    status,
    reference_id,
    description,
    created_at
) VALUES (
    3,
    'refund',
    1500,
    'completed',
    'MINER-9-REJECTION',
    'Miner #9 rejected - Full refund of purchase price ($1,500). Also deducted $28 incorrectly earned.',
    datetime('now')
);

-- Step 5: Verify final balance
SELECT 
    'Final Balance' as info,
    id,
    email,
    balance,
    wallet_balance,
    (balance - wallet_balance) as difference
FROM users 
WHERE id = 3;

-- Step 6: Verify miner status
SELECT 
    'Miner #9 Status' as info,
    id,
    status,
    activation_status,
    total_earned,
    purchase_price
FROM user_miners
WHERE id = 9;
