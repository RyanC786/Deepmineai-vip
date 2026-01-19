# 🧪 DEPOSIT SYSTEM - COMPREHENSIVE TEST GUIDE

**Test Date**: 2025-12-08  
**System**: DeepMineAI Deposit Submission & Verification  
**Production URL**: https://www.deepmineai.vip

---

## 📊 **Test Setup Complete**

### **Test Deposit Created**
| Field | Value |
|-------|-------|
| **Deposit ID** | 2 |
| **Deposit Number** | DEP-TEST-002 |
| **User** | Rayhan Khan (rayhan@deepmineai.vip) |
| **User ID** | 7 |
| **Amount** | 0.1 ETH |
| **TX Hash** | 0xabcdef1234567890... |
| **Status** | ⏳ **PENDING** (waiting for your approval) |
| **Current Balance** | $0.00 |

### **Expected After Approval**
| Field | Current | After Approval | Change |
|-------|---------|----------------|--------|
| Deposit Status | Pending | Approved | ✅ |
| User Balance | $0.00 | ~$350-400 | +$350-400 |
| Wallet Balance | $0.00 | ~$350-400 | +$350-400 |

*(Exact amount depends on current ETH/USD rate)*

---

## 🧪 **TEST SCENARIO 1: Admin Deposit Approval Workflow**

### **Step 1: Navigate to Admin Deposits Panel** 🚀

**URL**: https://www.deepmineai.vip/admin/panel/deposits

**Alternative URL**: https://www.deepmineai.vip/admin/deposits

**What You Should See**:
```
┌─────────────────────────────────────────────┐
│ 📊 STATS DASHBOARD                          │
├─────────────────────────────────────────────┤
│ Total Deposits: 2                           │
│ Pending Review: 1    ← NEW TEST DEPOSIT    │
│ Approved: 1                                 │
│ Rejected: 0                                 │
│ Total Value: 0.15 ETH                       │
└─────────────────────────────────────────────┘
```

---

### **Step 2: Open Browser Console** 🔧

**How to Open Console**:
- **Windows/Linux**: Press `F12` or `Ctrl + Shift + J`
- **Mac**: Press `Cmd + Option + J`

**Expected Console Output** (on page load):
```javascript
✅ DEPOSITS cookie check
admin_token exists: true
Cookie check passed!
Loading deposits...
```

**If You See Error**:
```javascript
❌ No admin_token cookie found!
```
→ **Solution**: Login again at https://www.deepmineai.vip/admin/panel/login

---

### **Step 3: Find the Test Deposit** 🔍

**Filter to "Pending" Tab**:
- Click on **"Pending"** tab
- You should see **DEP-TEST-002**

**Deposit Details**:
```
┌────────────────────────────────────────────────────────┐
│ Deposit #: DEP-TEST-002                                │
├────────────────────────────────────────────────────────┤
│ User:        rayhan@deepmineai.vip                     │
│ Full Name:   Rayhan Khan                               │
│ Amount:      0.1 ETH                                   │
│ Wallet:      0x8f7B3c9d5E4a1F2b6C8D9e0A1B2C3D4E5F... │
│ TX Hash:     0xabcdef1234567890abcdef1234567890...    │
│ Status:      🟡 Pending                                │
│ Date:        2025-12-08 (today)                        │
├────────────────────────────────────────────────────────┤
│ Actions:     [Approve] [Reject]                        │
└────────────────────────────────────────────────────────┘
```

---

### **Step 4: Click TX Hash Link** 🔗

**Action**: Click on the TX hash link (should open Etherscan)

**Expected Behavior**:
- Opens new tab to Etherscan
- URL: `https://etherscan.io/tx/0xabcdef...`
- *(Note: This is a test TX, won't exist on Etherscan)*

**In Real Scenario**:
- Admin verifies transaction on blockchain
- Checks amount matches deposit
- Confirms transaction is confirmed

---

### **Step 5: View Proof Screenshot** 📸

**Action**: Click **"View Proof"** or screenshot preview

**Expected Behavior**:
- Modal popup opens
- Shows uploaded screenshot
- *(Test deposit has placeholder URL)*

**In Real Scenario**:
- Admin views user's transaction screenshot
- Verifies it matches TX hash and amount

---

### **Step 6: Approve the Deposit** ✅

**IMPORTANT**: Keep browser console open!

**Action**: Click the **"Approve"** button

**Expected Console Output** (watch carefully):
```javascript
// 1. Initial request
POST https://www.deepmineai.vip/api/deposits/admin/2/approve

// 2. Success response
✅ Deposit approved successfully

// 3. Page auto-refreshes
Loading deposits...

// 4. Updated stats loaded
✅ Deposits loaded: {success: true, deposits: Array(2), total: 2}
```

**Expected UI Changes**:
1. **Stats Dashboard Updates**:
   - Pending Review: 1 → 0
   - Approved: 1 → 2
   - Total Value: 0.15 ETH (unchanged)

2. **Deposit Moves to "Approved" Tab**:
   - Status changes from 🟡 Pending → 🟢 Approved
   - Deposit disappears from "Pending" tab
   - Appears in "Approved" tab

3. **Page Auto-Refreshes**:
   - No manual refresh needed
   - Stats update automatically

---

### **Step 7: Verify Deposit Status in Database** ✅

**After approval, check database**:

Run this command to verify:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT id, deposit_number, status, approved_at 
  FROM deposits 
  WHERE id = 2
"
```

**Expected Result**:
```json
{
  "id": 2,
  "deposit_number": "DEP-TEST-002",
  "status": "approved",
  "approved_at": "2025-12-08 17:XX:XX"  // Current timestamp
}
```

---

### **Step 8: Verify User Balance Updated** 💰

**Check user's new balance**:

Run this command:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT id, email, balance, wallet_balance 
  FROM users 
  WHERE id = 7
"
```

**Expected Result**:
```json
{
  "id": 7,
  "email": "rayhan@deepmineai.vip",
  "balance": 350.00,          // ~0.1 ETH in USD
  "wallet_balance": 350.00     // Same as balance
}
```

**Calculation**:
- 0.1 ETH × $3,500/ETH = $350 USD (approximate)
- Exact amount depends on ETH price at approval time

---

## 🧪 **TEST SCENARIO 2: Reject Deposit Workflow**

### **If You Want to Test Rejection**:

**Step 1**: Create another test deposit:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  INSERT INTO deposits (
    user_id, deposit_number, amount, currency,
    wallet_address, tx_hash, status
  ) VALUES (
    7, 'DEP-TEST-003', 0.05, 'ETH',
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xtest123456789', 'pending'
  )
"
```

**Step 2**: Click **"Reject"** button

**Step 3**: Enter rejection reason:
```
Reason: Test rejection - Invalid transaction hash
```

**Expected Result**:
- Deposit status changes to "Rejected"
- Rejection reason saved
- User balance NOT updated
- Deposit appears in "Rejected" tab

---

## 🧪 **TEST SCENARIO 3: Verify Email Notifications**

### **If Email System is Configured**:

**Expected Behavior** (after approval):
1. User receives email notification
2. Subject: "💰 Deposit Approved - DeepMine AI"
3. Content:
   - Deposit amount: 0.1 ETH
   - New balance: $XXX
   - Next steps: Purchase mining machines

**To Check**:
- Login to: rayhan@deepmineai.vip
- Check inbox for deposit confirmation email

---

## 📊 **EXPECTED TEST RESULTS - CHECKLIST**

### ✅ **Admin Panel Tests**

- [ ] **Stats Dashboard Loads**
  - Shows correct totals
  - Pending count accurate
  - Approved count accurate
  - Total value calculated

- [ ] **Filter Tabs Work**
  - Can switch between All/Pending/Approved/Rejected
  - Deposits filter correctly
  - Count badges update

- [ ] **Deposit Table Displays**
  - All columns visible
  - Data formatted correctly
  - TX hash is clickable
  - Actions buttons appear

- [ ] **Approve Button Works**
  - No console errors
  - Success message appears
  - Page auto-refreshes
  - Stats update

- [ ] **User Balance Updates**
  - Balance increases by deposit amount
  - wallet_balance syncs with balance
  - Database records update

- [ ] **Deposit Status Changes**
  - Status changes to "approved"
  - approved_at timestamp set
  - Deposit moves to Approved tab

---

### ✅ **Console Output Tests**

- [ ] **No JavaScript Errors**
  ```javascript
  ✅ No errors in console
  ```

- [ ] **API Calls Succeed**
  ```javascript
  ✅ POST /api/deposits/admin/2/approve
  ✅ Status: 200 OK
  ```

- [ ] **Success Messages Show**
  ```javascript
  ✅ Deposit approved successfully
  ```

- [ ] **Page Refreshes Automatically**
  ```javascript
  ✅ Loading deposits...
  ✅ Deposits loaded: {success: true}
  ```

---

### ✅ **Database Tests**

- [ ] **Deposit Record Updated**
  - status = 'approved'
  - approved_at = timestamp
  - approved_by = admin_id (if tracked)

- [ ] **User Record Updated**
  - balance increased
  - wallet_balance increased
  - Both fields match

- [ ] **Transaction Log Updated**
  - Status = 'completed'
  - Reference matches deposit_id

---

## 🐛 **TROUBLESHOOTING GUIDE**

### **Issue 1: "No admin_token cookie found"**

**Symptoms**:
```javascript
❌ No admin_token cookie found! Redirecting...
```

**Solution**:
1. Login again: https://www.deepmineai.vip/admin/panel/login
2. Use admin credentials:
   - Email: admin@deepmineai.vip
   - Password: [your admin password]

---

### **Issue 2: "500 Internal Server Error"**

**Symptoms**:
```javascript
POST /api/deposits/admin/2/approve
Status: 500 (Internal Server Error)
```

**Solution**:
1. Check if deposit ID exists
2. Check if deposit is still pending
3. Check database connection
4. Review server logs

**Debug Command**:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT * FROM deposits WHERE id = 2
"
```

---

### **Issue 3: Balance Not Updating**

**Symptoms**:
- Deposit approved successfully
- But user balance stays at $0

**Check**:
```bash
# Check user balance
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT id, email, balance, wallet_balance 
  FROM users WHERE id = 7
"
```

**Possible Causes**:
1. ETH price conversion failed
2. Database transaction failed
3. Balance field not syncing

---

### **Issue 4: Deposit Not Appearing**

**Symptoms**:
- Created deposit in database
- Not showing in admin panel

**Solutions**:
1. Refresh the page (Ctrl+R or Cmd+R)
2. Check if filtering to wrong tab
3. Verify deposit exists in database

**Debug Command**:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT * FROM deposits ORDER BY id DESC LIMIT 5
"
```

---

### **Issue 5: Page Not Refreshing**

**Symptoms**:
- Clicked Approve
- No page refresh
- Stats don't update

**Solution**:
1. Manually refresh page
2. Check console for errors
3. Verify JavaScript loaded

---

## 📊 **FINAL VERIFICATION**

### **After All Tests Complete**

Run these commands to verify system state:

**1. Check All Deposits**:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT deposit_number, amount, status, approved_at 
  FROM deposits 
  ORDER BY id
"
```

**Expected**:
```
DEP-TEST-001: approved (earlier test)
DEP-TEST-002: approved (just approved)
```

**2. Check User Balances**:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT id, email, balance, wallet_balance 
  FROM users 
  WHERE id IN (3, 7)
"
```

**Expected**:
```
User 3 (ryan786w@gmail.com):    $2,081.38
User 7 (rayhan@deepmineai.vip): $350.00 (new)
```

**3. Check Deposit Stats**:
```bash
npx wrangler d1 execute deepmine-production --remote --command="
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) as rejected,
    SUM(amount) as total_eth
  FROM deposits
"
```

**Expected**:
```json
{
  "total": 2,
  "pending": 0,
  "approved": 2,
  "rejected": 0,
  "total_eth": 0.15
}
```

---

## 🎯 **SUCCESS CRITERIA**

### ✅ **Test Passes If**:

1. ✅ Admin panel loads without errors
2. ✅ Test deposit appears in Pending tab
3. ✅ Approve button works without 500 error
4. ✅ Console shows "✅ Deposit approved successfully"
5. ✅ Stats update: Pending 1→0, Approved 1→2
6. ✅ Deposit moves to Approved tab
7. ✅ User balance increases from $0 to ~$350
8. ✅ Database records update correctly
9. ✅ No JavaScript errors in console
10. ✅ Page auto-refreshes after approval

---

## 📸 **SCREENSHOT CHECKLIST**

### **Please Capture These Screenshots**:

1. **Before Approval**:
   - [ ] Admin panel showing Pending tab with DEP-TEST-002
   - [ ] Stats dashboard showing "Pending Review: 1"

2. **During Approval**:
   - [ ] Browser console showing success message
   - [ ] Approve button clicked

3. **After Approval**:
   - [ ] Stats dashboard showing "Pending Review: 0"
   - [ ] Approved tab showing DEP-TEST-002
   - [ ] User balance update (if visible in admin panel)

---

## 🚀 **NEXT STEPS AFTER TESTING**

### **If All Tests Pass** ✅:
1. Mark Task 11 as VERIFIED COMPLETE ✅
2. Proceed to **Task 12: Machine Purchase System**
3. Clean up test deposits (optional)

### **If Tests Fail** ❌:
1. Report specific error messages
2. Share console output
3. Share screenshots
4. I'll debug and fix immediately

---

## 📞 **REPORTING TEST RESULTS**

### **Please Report**:

1. **Console Output**:
   - Copy/paste entire console log
   - Include any errors or warnings

2. **Stats Before/After**:
   - Pending count before/after
   - Approved count before/after
   - Total value

3. **User Balance**:
   - Balance before approval
   - Balance after approval
   - Change amount

4. **Any Issues**:
   - Error messages
   - Unexpected behavior
   - Missing features

---

## 📝 **TEST NOTES**

**Test Environment**: Production (https://www.deepmineai.vip)  
**Test Data**: DEP-TEST-002 (0.1 ETH)  
**Test User**: Rayhan Khan (ID: 7)  
**Expected Result**: Balance increases by ~$350-400 USD  

**⚠️ IMPORTANT**:
- This is a real test on production database
- Balance changes are permanent
- Test user will have real balance after approval
- Can be used to test machine purchase next

---

## 🎉 **READY TO TEST**

**Your test deposit is ready!**

👉 **Start here**: https://www.deepmineai.vip/admin/panel/deposits

**Look for**: DEP-TEST-002 in the Pending tab

**Then**: Click "Approve" and watch the magic happen! ✨

---

**Good luck with testing! Report back with results! 🚀**
