# ✅ User Deletion Complete - rayhan@deepmineai.vip

## 🎯 Purpose

Deleted user `rayhan@deepmineai.vip` from all database tables to test referral code functionality from scratch.

---

## 🗑️ What Was Deleted

### User Information
- **User ID**: 6
- **Email**: rayhan@deepmineai.vip
- **Name**: rayhan Khan
- **Referral Code**: DMMITEBQ714EQL (auto-generated)
- **Referred By**: null (no referral code used during registration)

---

## 📊 Records Deleted

### 1️⃣ Users Table
```sql
DELETE FROM users WHERE id = 6 AND email = 'rayhan@deepmineai.vip';
```
**Deleted**: 1 record
- Main user account
- Referral code
- KYC status
- Account balance

### 2️⃣ Registrations Table
```sql
DELETE FROM registrations WHERE email = 'rayhan@deepmineai.vip';
```
**Deleted**: 1 record
- Pre-registration data
- Unique code: DM1764970308735VX2V0
- Email verification token
- Access code: FIO3081

### 3️⃣ KYC Submissions Table
```sql
DELETE FROM kyc_submissions WHERE user_id = 6;
```
**Deleted**: 1 record
- KYC submission (ID: 3)
- Status: pending
- Scan reference: 35827a26-d224-11f0-a5ad-ae1c9d791393

### 4️⃣ Referral Tree Table
```sql
DELETE FROM referral_tree WHERE user_id = 6 OR ancestor_id = 6;
```
**Deleted**: 0 records (no referral relationships)

### 5️⃣ User Miners Table
```sql
DELETE FROM user_miners WHERE user_id = 6;
```
**Deleted**: 0 records (no miners purchased)

---

## 📝 Deletion Script

**File**: `delete_rayhan_user.sql`

```sql
-- Delete rayhan@deepmineai.vip user and all related records

-- 1. Delete from kyc_submissions (foreign key constraint)
DELETE FROM kyc_submissions WHERE user_id = 6;

-- 2. Delete from referral_tree (if any)
DELETE FROM referral_tree WHERE user_id = 6 OR ancestor_id = 6;

-- 3. Delete from user_miners (if any)
DELETE FROM user_miners WHERE user_id = 6;

-- 4. Delete from registrations table
DELETE FROM registrations WHERE email = 'rayhan@deepmineai.vip';

-- 5. Delete from users table (main record)
DELETE FROM users WHERE id = 6 AND email = 'rayhan@deepmineai.vip';

-- Verify deletion
SELECT 'Users table' as table_name, COUNT(*) as remaining_records 
FROM users WHERE email = 'rayhan@deepmineai.vip'
UNION ALL
SELECT 'Registrations table', COUNT(*) 
FROM registrations WHERE email = 'rayhan@deepmineai.vip'
UNION ALL
SELECT 'KYC submissions', COUNT(*) 
FROM kyc_submissions WHERE user_id = 6
UNION ALL
SELECT 'Referral tree', COUNT(*) 
FROM referral_tree WHERE user_id = 6 OR ancestor_id = 6;
```

---

## 🔧 Execution

**Command**:
```bash
npx wrangler d1 execute deepmine-production --remote --file=./delete_rayhan_user.sql
```

**Results**:
- ✅ 6 queries executed
- ✅ 5 rows read
- ✅ 3 rows written (deleted)
- ✅ Database size: 0.34 MB
- ✅ No errors

---

## ✅ Verification

### Users Table
```bash
SELECT * FROM users WHERE email = 'rayhan@deepmineai.vip'
```
**Result**: 0 records ✅

### Registrations Table
```bash
SELECT * FROM registrations WHERE email = 'rayhan@deepmineai.vip'
```
**Result**: 0 records ✅

### KYC Submissions
```bash
SELECT * FROM kyc_submissions WHERE user_id = 6
```
**Result**: 0 records ✅

### Referral Tree
```bash
SELECT * FROM referral_tree WHERE user_id = 6 OR ancestor_id = 6
```
**Result**: 0 records ✅

---

## 🧪 Testing Referral Code Flow

Now you can test the complete referral flow:

### Step 1: Get a Referral Code
1. Login as existing user (e.g., `ryan786w@gmail.com`)
2. Go to Dashboard → Referral section
3. Copy referral code (e.g., `DM123ABC456`)

### Step 2: Register with Referral Code
1. Go to `https://www.deepmineai.vip/start-mining`
2. Pre-register with:
   - **Name**: Rayhan Khan
   - **Email**: rayhan@deepmineai.vip
3. Verify email
4. Complete full registration at `/register`:
   - **Email**: rayhan@deepmineai.vip (pre-filled)
   - **Password**: Choose password
   - **Referral Code**: Paste the code from Step 1
   - **Terms**: Accept
5. Submit registration

### Step 3: Verify Referral
1. Login as the referrer (ryan786w@gmail.com)
2. Go to Dashboard → Referral section
3. Check "Direct Referrals" count
4. Should see: +1 referral
5. Should see: rayhan@deepmineai.vip in referral list

### Step 4: Check Database
```sql
-- Check new user's referred_by field
SELECT id, email, referral_code, referred_by 
FROM users 
WHERE email = 'rayhan@deepmineai.vip';

-- Should show:
-- referred_by: 'DM123ABC456' (the referral code used)

-- Check referral tree
SELECT * FROM referral_tree 
WHERE user_id = [new_user_id];

-- Should show referral relationship
```

---

## 📊 Referral Code Behavior

### When Referral Code IS Used
```
Registration Form:
├─ Email: rayhan@deepmineai.vip
├─ Password: ********
├─ Referral Code: DM123ABC456  ← USER ENTERS CODE
└─ Terms: [✓] Accepted

Database Result:
users.referred_by = 'DM123ABC456'
referral_tree has records linking to referrer
```

### When Referral Code is NOT Used
```
Registration Form:
├─ Email: rayhan@deepmineai.vip
├─ Password: ********
├─ Referral Code: [EMPTY]  ← NO CODE ENTERED
└─ Terms: [✓] Accepted

Database Result:
users.referred_by = null
users.referral_code = 'AUTO_GENERATED_CODE' (for future referrals)
referral_tree has no records
```

---

## 🔍 Why Referral Code Shows in Admin Dashboard

**Question**: "I registered without a code but admin dashboard shows a referral code?"

**Answer**: Every user gets TWO types of codes:

### 1️⃣ Referral Code (Always Generated)
```sql
users.referral_code = 'DMMITEBQ714EQL'
```
- **Purpose**: FOR THIS USER to refer others
- **Auto-generated**: Yes, always
- **Visible in**: Admin dashboard, user dashboard
- **Used when**: This user shares their code with others

### 2️⃣ Referred By Code (Optional)
```sql
users.referred_by = 'DM123ABC456' OR null
```
- **Purpose**: Shows WHO referred this user
- **Auto-generated**: No, only if user enters code during registration
- **Visible in**: Database, referral tree
- **Used when**: This user was referred by someone

---

## 📈 Testing Checklist

- [ ] **Step 1**: Get referral code from existing user
- [ ] **Step 2**: Register new user with that code
- [ ] **Step 3**: Verify `referred_by` field is populated
- [ ] **Step 4**: Check referral tree has records
- [ ] **Step 5**: Verify referrer sees +1 in their dashboard
- [ ] **Step 6**: Check referral earnings calculation
- [ ] **Step 7**: Test multi-level referrals (if applicable)

---

## 🎯 Expected Behavior

### Scenario 1: Registration WITH Referral Code
```
User Input: Referral Code = "DM123ABC456"

Database:
├─ users.referred_by = "DM123ABC456" ✅
├─ users.referral_code = "AUTO_GENERATED" ✅
└─ referral_tree has relationship ✅

Referrer Dashboard:
└─ Direct Referrals: +1 ✅
```

### Scenario 2: Registration WITHOUT Referral Code
```
User Input: Referral Code = [EMPTY]

Database:
├─ users.referred_by = null ✅
├─ users.referral_code = "AUTO_GENERATED" ✅
└─ referral_tree is empty ✅

Referrer Dashboard:
└─ No change ✅
```

---

## 🚀 Next Steps

1. ✅ User deleted successfully
2. ⏳ Test referral flow from scratch
3. ⏳ Verify `referred_by` field populates
4. ⏳ Check referral tree is built correctly
5. ⏳ Confirm referrer sees new referral
6. ⏳ Test referral earnings calculation

---

## 📝 Summary

### What Happened
- ✅ Deleted user ID 6 (rayhan@deepmineai.vip)
- ✅ Deleted 3 total records across tables
- ✅ Cleaned KYC submissions
- ✅ No referral relationships existed
- ✅ Ready for fresh registration test

### Why This Was Done
- Test referral code functionality
- Verify `referred_by` field populates correctly
- Ensure referral tree builds properly
- Confirm referrals show in dashboard

### Database State
- 🟢 Clean and ready for testing
- 🟢 No orphaned records
- 🟢 All constraints maintained
- 🟢 Database size: 0.34 MB

---

## 🎉 Result

**User `rayhan@deepmineai.vip` completely deleted from all tables!**

You can now:
1. Register fresh with a referral code
2. Test the complete referral flow
3. Verify referral tracking works correctly

🚀 **Ready for referral code testing!**
