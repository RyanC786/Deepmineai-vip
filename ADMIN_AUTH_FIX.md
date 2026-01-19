# Admin Authentication Fix Guide

## Issue
Deposits and Reports pages redirect to login immediately after loading.

## Root Cause
The admin user (`admin@deepmineai.vip`) might not have `account_status = 'admin'` in the database.

## Fix Required

Run this SQL command in your production D1 database:

```sql
-- Check current status
SELECT id, email, account_status FROM users WHERE email = 'admin@deepmineai.vip';

-- Update to admin status
UPDATE users 
SET account_status = 'admin' 
WHERE email = 'admin@deepmineai.vip';

-- Verify the fix
SELECT id, email, account_status FROM users WHERE email = 'admin@deepmineai.vip';
```

## How to Execute

### Option 1: Via Wrangler CLI
```bash
# Check status
npx wrangler d1 execute webapp-production \
  --command="SELECT id, email, account_status FROM users WHERE email = 'admin@deepmineai.vip'"

# Fix the status
npx wrangler d1 execute webapp-production \
  --command="UPDATE users SET account_status = 'admin' WHERE email = 'admin@deepmineai.vip'"
```

### Option 2: Via Cloudflare Dashboard
1. Go to Cloudflare Dashboard
2. Workers & Pages → D1 Databases
3. Select `webapp-production`
4. Open Console tab
5. Run the UPDATE command above

## Verification

After running the fix, test:
1. Login at: https://www.deepmineai.vip/admin/panel/login
2. Navigate to: https://www.deepmineai.vip/admin/deposits
3. Page should load without redirect

## Alternative Solution

If the above doesn't work, the admin authentication logic can be modified to check for the user in a separate admin table or by email pattern matching.
