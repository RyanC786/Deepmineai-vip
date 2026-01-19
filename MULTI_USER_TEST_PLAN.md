# 🧪 Multi-User Testing Plan - Before Real Users

## 📅 Testing Timeline

### Phase 1: Daily Earnings Verification (Today → Tomorrow)
**Status**: ⏳ **WAITING**

**Current Setup** (ryan786w@gmail.com):
- 4 active machines
- Expected daily earnings: $62/day
- Test period: 24 hours

**What to Verify Tomorrow**:
1. ✅ Daily earnings credited correctly ($62)
2. ✅ Each machine shows earnings:
   - RTX 4090 East: $8
   - RTX 4090 South: $8
   - A100 48G: $18
   - A100 72G: $28
3. ✅ Total earned updates in dashboard
4. ✅ Balance increases automatically
5. ✅ Earnings history logs correctly

---

### Phase 2: Multi-User Load Testing (Before Real Users)
**Status**: 📋 **PLANNED**

Before adding real users, we need to test:

#### Test Scenario 1: Multiple Users Simultaneously
- Create 5-10 test accounts
- Simulate concurrent actions:
  - KYC submissions
  - Deposit submissions
  - Machine purchases
  - Withdrawal requests
  - Dashboard access

#### Test Scenario 2: Database Consistency
- Verify no race conditions
- Check balance integrity across users
- Test transaction isolation
- Verify foreign key constraints

#### Test Scenario 3: Admin Panel Performance
- Test admin panel with multiple pending items:
  - 10+ pending KYC verifications
  - 10+ pending deposits
  - 10+ pending machine activations
  - 10+ pending withdrawals
- Verify admin can handle bulk operations

#### Test Scenario 4: Daily Earnings at Scale
- Test daily earnings cron job with multiple users
- Verify correct earnings distribution
- Check performance with 50+ active machines

---

## 🔍 Critical Systems to Verify

### 1. User Isolation ✅
**Requirement**: Each user's data must be completely isolated

**Test Cases**:
- [ ] User A cannot see User B's machines
- [ ] User A cannot see User B's transactions
- [ ] User A cannot see User B's withdrawal history
- [ ] User A cannot access User B's KYC documents
- [ ] User A cannot modify User B's balance

**SQL Verification**:
```sql
-- All queries must have WHERE user_id = ?
-- Example:
SELECT * FROM user_miners WHERE user_id = ?
SELECT * FROM transactions WHERE user_id = ?
SELECT * FROM withdrawals WHERE user_id = ?
```

---

### 2. Balance Integrity 🔒
**Requirement**: Balance operations must be atomic and consistent

**Test Cases**:
- [ ] Two users purchase same machine tier simultaneously → Both succeed
- [ ] User purchases machine with insufficient balance → Purchase fails
- [ ] Admin approves deposit while user purchases → No race condition
- [ ] Daily earnings run while user withdraws → No conflicts
- [ ] Balance always matches: `wallet_balance = deposits - purchases - withdrawals + earnings`

**Critical Operations**:
1. **Deposit Approval**: ETH → USD conversion must be accurate per user
2. **Machine Purchase**: Balance deduction must be atomic (use transactions)
3. **Withdrawal**: Balance check and deduction must be atomic
4. **Daily Earnings**: Batch update must handle all users correctly

---

### 3. Authentication & Authorization 🔐
**Requirement**: Users can only access their own data

**Test Cases**:
- [ ] User cannot access another user's dashboard
- [ ] User cannot approve their own KYC
- [ ] User cannot activate their own machines
- [ ] Admin can access all user data
- [ ] Admin actions are logged correctly

**Routes to Verify**:
```typescript
// User routes - Must check user_id from JWT
/api/user/details        → requireAuth
/api/machines/my-machines → requireAuth
/api/deposits/history    → requireAuth
/api/withdrawals/history → requireAuth

// Admin routes - Must require admin role
/api/admin/*             → requireAdmin
```

---

### 4. Database Constraints ✅
**Requirement**: Data integrity must be enforced

**Test Cases**:
- [ ] Cannot delete user with active machines (foreign key)
- [ ] Cannot delete machine with earnings history (foreign key)
- [ ] Cannot create deposit without valid user_id
- [ ] Cannot purchase machine twice (one-per-tier constraint)
- [ ] Email must be unique across users

---

### 5. Performance Under Load ⚡
**Requirement**: System must handle multiple concurrent users

**Test Cases**:
- [ ] 10 users register simultaneously
- [ ] 10 users purchase machines simultaneously
- [ ] Admin panel loads with 100+ pending items
- [ ] Daily earnings job completes within 5 minutes for 100 users
- [ ] API response time < 500ms for all endpoints

---

## 🧪 Multi-User Test Script

### Create Test Users
```sql
-- User 2: Alice (Test User)
INSERT INTO users (email, password_hash, full_name, phone, country, referral_code, kyc_status, wallet_balance, balance)
VALUES ('alice@test.com', '$2b$10$...', 'Alice Johnson', '+1234567891', 'USA', 'ALICE001', 'approved', 0, 0);

-- User 3: Bob (Test User)
INSERT INTO users (email, password_hash, full_name, phone, country, referral_code, kyc_status, wallet_balance, balance)
VALUES ('bob@test.com', '$2b$10$...', 'Bob Smith', '+1234567892', 'USA', 'BOB002', 'approved', 0, 0);

-- User 4: Charlie (Test User)
INSERT INTO users (email, password_hash, full_name, phone, country, referral_code, kyc_status, wallet_balance, balance)
VALUES ('charlie@test.com', '$2b$10$...', 'Charlie Brown', '+1234567893', 'USA', 'CHARLIE003', 'approved', 0, 0);
```

### Test Scenario: Concurrent Purchases
```javascript
// Simulate 3 users purchasing machines simultaneously
const users = ['alice@test.com', 'bob@test.com', 'charlie@test.com'];

// Each user purchases RTX 4090 East at the same time
await Promise.all(users.map(email => {
  return fetch('/api/machines/purchase', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getTokenForUser(email)}` },
    body: JSON.stringify({ packageId: 6 })
  });
}));

// Expected: All 3 purchases succeed, each user owns RTX 4090 East
```

---

## 📊 Multi-User Load Test Plan

### Test Environment Setup
```bash
# 1. Create 10 test users
npm run test:create-users

# 2. Give each user $10,000 balance
npm run test:fund-users

# 3. Simulate concurrent purchases
npm run test:concurrent-purchases

# 4. Verify data integrity
npm run test:verify-integrity
```

### Expected Results
- ✅ All 10 users can login simultaneously
- ✅ All 10 users can purchase machines without conflicts
- ✅ Admin panel shows all 10 users' data correctly
- ✅ Daily earnings run successfully for all users
- ✅ No database errors or race conditions

---

## 🚨 Known Multi-User Risks

### Risk #1: Race Conditions in Balance Updates
**Problem**: Two operations update balance simultaneously
```sql
-- Transaction 1: Purchase machine
UPDATE users SET wallet_balance = wallet_balance - 500 WHERE id = 3;

-- Transaction 2: Daily earnings (at the same time)
UPDATE users SET balance = balance + 62 WHERE id = 3;

-- Risk: One update may be lost
```

**Solution**: Use database transactions
```typescript
// Wrap in transaction
await c.env.DB.batch([
  c.env.DB.prepare('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?').bind(500, userId),
  c.env.DB.prepare('INSERT INTO transactions ...').bind(...)
]);
```

---

### Risk #2: Insufficient Balance Checks
**Problem**: User balance checked before deduction, but balance changes between check and deduction

**Current Code**:
```typescript
// Check balance
if (user.wallet_balance < price) {
  return error;
}

// ... some delay ...

// Deduct balance (balance may have changed!)
UPDATE users SET wallet_balance = wallet_balance - price;
```

**Solution**: Use atomic operations
```typescript
// Atomic deduction with check
const result = await c.env.DB.prepare(`
  UPDATE users 
  SET wallet_balance = wallet_balance - ?
  WHERE id = ? AND wallet_balance >= ?
`).bind(price, userId, price).run();

if (result.meta.changes === 0) {
  return error('Insufficient balance');
}
```

---

### Risk #3: Daily Earnings Job Conflicts
**Problem**: Daily earnings job runs while user is purchasing/withdrawing

**Solution**: 
1. Run daily earnings at off-peak hours (e.g., 3 AM UTC)
2. Use SELECT FOR UPDATE to lock rows during earnings calculation
3. Implement retry logic for failed updates

---

## 🔧 Required Code Fixes Before Multi-User

### Fix #1: Atomic Balance Operations
**File**: `src/routes/machines.ts`

**Current**:
```typescript
if (user.wallet_balance < packagePrice) {
  return c.json({ error: 'Insufficient balance' }, 400);
}

await c.env.DB.prepare('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?')
  .bind(packagePrice, userId).run();
```

**Fixed**:
```typescript
const result = await c.env.DB.prepare(`
  UPDATE users 
  SET wallet_balance = wallet_balance - ?,
      total_invested = total_invested + ?
  WHERE id = ? AND wallet_balance >= ?
`).bind(packagePrice, packagePrice, userId, packagePrice).run();

if (result.meta.changes === 0) {
  return c.json({ 
    error: 'Insufficient balance',
    message: 'Balance may have changed. Please try again.'
  }, 400);
}
```

---

### Fix #2: Transaction Wrapping
**File**: `src/routes/deposits.ts`

**Current**: Multiple separate UPDATE statements

**Fixed**: Use batch operations
```typescript
await c.env.DB.batch([
  c.env.DB.prepare('UPDATE deposits SET status = ? WHERE id = ?').bind('approved', depositId),
  c.env.DB.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').bind(amountUSD, userId),
  c.env.DB.prepare('INSERT INTO transactions ...').bind(...)
]);
```

---

### Fix #3: User Isolation Checks
**File**: All API routes

**Verify**: Every query has `WHERE user_id = ?`
```typescript
// ✅ Good - User isolated
SELECT * FROM user_miners WHERE user_id = ? AND id = ?

// ❌ Bad - No user isolation
SELECT * FROM user_miners WHERE id = ?
```

---

## 📋 Multi-User Testing Checklist

### Before Adding Real Users
- [ ] Daily earnings verified for 24 hours (ryan786w@gmail.com)
- [ ] Create 10 test users with varying balances
- [ ] Test concurrent machine purchases (10 users simultaneously)
- [ ] Test concurrent deposits (10 pending deposits)
- [ ] Test concurrent withdrawals (10 withdrawal requests)
- [ ] Verify admin panel handles 50+ pending items
- [ ] Run daily earnings cron with 10 users, 50+ machines
- [ ] Load test API endpoints (100+ requests/second)
- [ ] Verify database integrity (no orphaned records)
- [ ] Test user login sessions (10 concurrent logins)

### Database Integrity Checks
```sql
-- Check for orphaned records
SELECT COUNT(*) FROM user_miners WHERE user_id NOT IN (SELECT id FROM users);
-- Expected: 0

-- Check balance consistency
SELECT id, email, wallet_balance, total_invested, 
       (SELECT SUM(purchase_price) FROM user_miners WHERE user_id = users.id) as calculated_invested
FROM users;
-- wallet_balance + calculated_invested should match deposits

-- Check foreign key integrity
PRAGMA foreign_key_check;
-- Expected: empty result
```

---

## 🎯 Success Criteria

### System is Ready for Real Users When:
1. ✅ Daily earnings run successfully for 24 hours (ryan786w@gmail.com)
2. ✅ 10 test users can register, deposit, purchase, withdraw simultaneously
3. ✅ No race conditions or database errors in logs
4. ✅ Admin panel responsive with 50+ pending items
5. ✅ All balance operations are atomic and consistent
6. ✅ User data completely isolated (no cross-user access)
7. ✅ Performance acceptable (API < 500ms, earnings job < 5min)
8. ✅ Database integrity checks pass
9. ✅ Error handling works correctly (insufficient balance, etc.)
10. ✅ Logging captures all critical operations

---

## 📅 Next Steps Timeline

### Day 1 (Today - Dec 8)
- ✅ Account reset complete
- ✅ 4 machines activated
- ✅ ETH to USD conversion working
- ⏳ **Waiting for tomorrow's daily earnings**

### Day 2 (Tomorrow - Dec 9)
- [ ] Verify daily earnings credited ($62)
- [ ] Check earnings history
- [ ] Create 10 test users
- [ ] Run multi-user load tests
- [ ] Fix any issues found

### Day 3 (Dec 10)
- [ ] Final multi-user testing
- [ ] Performance optimization if needed
- [ ] Documentation for new user onboarding
- [ ] **Ready for real user testing**

### Day 4+ (Dec 11+)
- [ ] Add first real user (new miner)
- [ ] Monitor KYC process
- [ ] Monitor real deposit flow
- [ ] Monitor machine purchases
- [ ] Collect feedback for improvements

---

## 📊 Current System Status

**Account**: ryan786w@gmail.com
- ✅ Balance: $4,289.23
- ✅ Total Invested: $3,500
- ✅ Active Machines: 4
- ✅ Expected Daily: $62
- ⏳ Waiting: Daily earnings verification

**System Health**:
- ✅ Deposit system working (ETH → USD)
- ✅ Machine purchase working
- ✅ Admin activation working
- ✅ Balance deduction working
- ⏳ Daily earnings (testing tomorrow)
- 📋 Multi-user testing (pending)

---

## 🚀 Deployment Checklist Before Real Users

- [ ] SSL certificate configured
- [ ] Domain properly configured (deepmineai.vip)
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Rate limiting enabled (prevent abuse)
- [ ] Email notifications working (KYC, deposits, etc.)
- [ ] Admin alerts configured (new users, large withdrawals)
- [ ] Terms of Service & Privacy Policy published
- [ ] Support email/contact form working
- [ ] FAQ documentation ready

---

**Status**: ⏳ Waiting for tomorrow's daily earnings test, then proceed with multi-user load testing before adding real users.

**Next Action**: Check daily earnings tomorrow (Dec 9) at the same time (19:48 UTC).
