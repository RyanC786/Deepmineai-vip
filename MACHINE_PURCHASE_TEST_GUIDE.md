# 🧪 MACHINE PURCHASE SYSTEM - TEST GUIDE

**Test Date**: December 6, 2025  
**Tester**: User Testing Required  
**Environment**: Production (`https://www.deepmineai.vip`)

---

## ✅ Automated Test Results

| Test | Status | Result |
|------|--------|--------|
| Page Loading | ✅ PASS | HTTP 200, title correct |
| Package Cards | ✅ PASS | 5 CSS classes found |
| JavaScript Functions | ✅ PASS | All 3 functions loaded |
| API Endpoints | ✅ READY | Configured and waiting |
| Test User Setup | ✅ READY | $2,000 balance added |

---

## 👤 Test User Account

**Login Credentials**:
```
URL: https://www.deepmineai.vip/login
Email: ryan786w@gmail.com
Password: [your password]
```

**Account Status**:
- ✅ KYC Status: Approved
- ✅ Wallet Balance: $2,000.00 (added for testing)
- ✅ Total Invested: $0.00
- ✅ Owned Machines: 0

**This balance allows you to test purchasing**:
- ✅ $500 packages (RTX 4090) - Can buy 4 units
- ✅ $1,000 package (A100 48G) - Can buy 2 units
- ✅ $1,500 package (A100 72G) - Can buy 1 unit
- ❌ $2,000+ packages - Insufficient balance

---

## 🎯 Manual Testing Checklist

### Test 1: Page Access & Display

**Steps**:
1. Login at `https://www.deepmineai.vip/login`
2. Navigate to `https://www.deepmineai.vip/machines`
3. Wait for page to fully load (2-3 seconds)

**Expected Results**:
- [ ] Page loads without errors
- [ ] Navigation bar shows "Purchase Mining Machines"
- [ ] Balance card displays at top
- [ ] Balance shows: **$2,000.00**
- [ ] Total Invested shows: **$0.00**
- [ ] "Deposit ETH" button visible
- [ ] Info banner with purchase rules visible
- [ ] Package grid displays below

**Console Checks** (F12):
```
No errors should appear
Should see axios requests to:
- /api/auth/me
- /api/machines/my-machines
- /api/machines/packages
```

---

### Test 2: Package Display

**Expected to See 10 Packages**:

| # | Package | Price | Daily Earnings | ROI | Purchase Status |
|---|---------|-------|----------------|-----|-----------------|
| 1 | RTX 4090 East | $500 | $8/day | 288% | ✅ Can Purchase |
| 2 | RTX 4090 South | $500 | $8/day | 288% | ✅ Can Purchase |
| 3 | A100 48G | $1,000 | $18/day | 324% | ✅ Can Purchase |
| 4 | A100 72G | $1,500 | $28/day | 336% | ✅ Can Purchase |
| 5 | A100 96G | $2,000 | $38/day | 342% | ❌ Insufficient |
| 6 | H200 84G | $5,000 | $88/day | 317% | ❌ Insufficient |
| 7 | H200 120G | $7,000 | $108/day | 278% | ❌ Insufficient |
| 8 | H800 320G | $11,000 | $168/day | 275% | ❌ Insufficient |
| 9 | H800 6400G | $30,000 | $545/day | 327% | ❌ Insufficient |
| 10 | H800 8400G | $50,000 | $909/day | 327% | ❌ Insufficient |

**Check Each Package Card**:
- [ ] Package name displayed
- [ ] Price shown in large purple text
- [ ] Daily earnings in green
- [ ] Total return (180 days) calculated
- [ ] ROI percentage in blue
- [ ] Hash rate shown
- [ ] Button state correct:
  - 🟢 "Purchase Now" (if affordable)
  - 🔒 "Insufficient Balance" (if too expensive)
  - Shows "Need $X more" for expensive packages

**Special Badges**:
- [ ] "Popular" badge on $1,000 and $5,000 packages

---

### Test 3: First Purchase (Success)

**Purchase Package**: RTX 4090 24G Server (East China) - $500

**Steps**:
1. Scroll to **RTX 4090 East** package ($500)
2. Verify button says "Purchase Now" (green gradient)
3. Click **"Purchase Now"** button
4. **Confirmation dialog appears** with:
   - Package name: RTX 4090 24G Server (East China)
   - Price: $500
   - Warning: "This will deduct $500 from your balance"
   - Warning: "Machine will be activated by admin within 24 hours"
5. Click **"OK"** to confirm

**Expected Results**:
- [ ] Success alert appears at top (green)
- [ ] Message: "Machine purchased successfully! Pending admin activation."
- [ ] **Balance updates** to: **$1,500.00** (was $2,000)
- [ ] **Total Invested updates** to: **$500.00** (was $0)
- [ ] RTX 4090 East card **changes appearance**:
  - Background becomes **light green**
  - Border becomes **green**
  - Button changes to **"Already Owned"** (disabled)
  - Badge appears: **"✓ Owned"**
- [ ] Other packages still show "Purchase Now"

**Database Verification** (I can check):
```sql
-- Should see new record in user_miners
SELECT * FROM user_miners WHERE user_id = 3;

-- Should see new transaction
SELECT * FROM transactions WHERE user_id = 3 AND transaction_type = 'purchase';

-- User balance should be $1,500
SELECT wallet_balance, total_invested FROM users WHERE id = 3;
```

---

### Test 4: Duplicate Purchase Prevention

**Attempt to Purchase Same Package Again**

**Steps**:
1. Try to click the **RTX 4090 East** button again
2. Button should be **disabled** (grayed out)
3. Button text: **"Already Owned"**
4. Badge shows: **"✓ Owned"**

**Expected Results**:
- [ ] Cannot click button (disabled)
- [ ] Tooltip or visual indication it's owned
- [ ] No confirmation dialog appears
- [ ] Balance remains **$1,500.00**

**This confirms**: ✅ One unit per tier rule is enforced

---

### Test 5: Second Purchase (Different Tier)

**Purchase Package**: A100 48G Server - $1,000

**Steps**:
1. Scroll to **A100 48G Server** ($1,000)
2. Verify button says "Purchase Now"
3. Click **"Purchase Now"**
4. Confirm purchase in dialog

**Expected Results**:
- [ ] Success alert appears
- [ ] Balance updates to: **$500.00** (was $1,500)
- [ ] Total Invested: **$1,500.00** (was $500)
- [ ] A100 48G card shows **"Already Owned"**
- [ ] RTX 4090 East still shows owned
- [ ] Both cards have green styling

---

### Test 6: Insufficient Balance

**Attempt**: Try to purchase A100 72G Server ($1,500) with only $500 balance

**Steps**:
1. Scroll to **A100 72G Server** ($1,500)
2. Observe button state

**Expected Results**:
- [ ] Button is **disabled** (grayed out)
- [ ] Button text: **"🔒 Insufficient Balance"**
- [ ] Small text below: **"Need $1,000.00 more"**
- [ ] Cannot click button
- [ ] No purchase dialog appears

**This confirms**: ✅ Balance validation working

---

### Test 7: Purchase with Exact Balance

**Current State**: Balance $500, trying to purchase $500 package

**Steps**:
1. Find **RTX 4090 South** ($500)
2. Click "Purchase Now"
3. Confirm purchase

**Expected Results**:
- [ ] Purchase succeeds
- [ ] Balance becomes: **$0.00**
- [ ] Total Invested: **$2,000.00**
- [ ] All 3 owned packages show green styling
- [ ] All other packages show "Insufficient Balance"

---

### Test 8: Purchase History

**Check Transaction Log**

**Expected in Database**:
```sql
-- Should see 3 transactions
SELECT * FROM transactions 
WHERE user_id = 3 AND transaction_type = 'purchase'
ORDER BY created_at DESC;

Transaction 1: RTX 4090 East - $500
Transaction 2: A100 48G - $1,000
Transaction 3: RTX 4090 South - $500
```

---

### Test 9: Owned Machines Display

**API Endpoint Test**:
```bash
curl https://www.deepmineai.vip/api/machines/my-machines
```

**Expected Response**:
```json
{
  "success": true,
  "machines": [
    {
      "id": 1,
      "package_name": "RTX 4090 24G Server (East China)",
      "status": "inactive",
      "activation_status": "pending",
      "purchase_price": 500,
      "daily_rate": 8,
      "hash_rate": 8,
      ...
    },
    {
      "id": 2,
      "package_name": "A100 48G Server",
      "status": "inactive",
      "activation_status": "pending",
      ...
    },
    {
      "id": 3,
      "package_name": "RTX 4090 24G Server (South China)",
      ...
    }
  ],
  "total": 3
}
```

---

## 🎨 Visual Appearance Check

### Balance Card
- **Background**: Purple gradient
- **Text**: White
- **Layout**: Available Balance (left), Total Invested (right)
- **Button**: White "Deposit ETH" button

### Package Cards
**Normal State**:
- White background
- Gray border
- Hover: Lifts up, purple border

**Owned State**:
- Light green background
- Green border
- "✓ Owned" badge (green)

**Insufficient Balance**:
- Normal white background
- Disabled button (gray)
- Red text showing shortfall

### Buttons
- **Purchase Now**: Purple gradient, white text
- **Already Owned**: Gray, disabled
- **Insufficient Balance**: Gray, disabled with lock icon

---

## 📊 Expected Console Output

**Success Flow**:
```javascript
// Initial load
Loading balance...
Loading owned machines...
Loading packages...

// After purchase
Purchase successful!
Reloading balance...
Reloading owned machines...
Reloading packages...
```

**No Errors Should Appear!**

---

## 🐛 Common Issues to Check

### Issue 1: Balance Not Showing
**Check**: Console for errors in `/api/auth/me`
**Fix**: Ensure you're logged in

### Issue 2: Packages Not Loading
**Check**: Console for errors in `/api/machines/packages`
**Fix**: Clear cache, refresh page

### Issue 3: Purchase Button Disabled
**Check**: Balance sufficient? Already owned?
**Expected**: Button should be enabled if balance OK and not owned

### Issue 4: Purchase Fails
**Check**: Console error message
**Possible**: KYC not approved, duplicate purchase

---

## ✅ Success Criteria

**All tests pass if**:
1. ✅ Page loads without errors
2. ✅ Balance displays correctly ($2,000)
3. ✅ All 10 packages display
4. ✅ Can purchase affordable packages
5. ✅ Balance deducts correctly
6. ✅ Cannot purchase same package twice
7. ✅ Cannot purchase with insufficient balance
8. ✅ Owned packages show green styling
9. ✅ Purchase history tracked
10. ✅ UI updates in real-time

---

## 📸 Screenshots Needed

If testing, please capture:
1. **Initial page load** - showing $2,000 balance and all packages
2. **After first purchase** - showing updated balance and owned badge
3. **After all purchases** - showing $0 balance and 3 owned packages
4. **Insufficient balance state** - showing disabled buttons
5. **Console logs** - showing no errors

---

## 🎯 Testing Priority

### High Priority (Must Test):
1. ✅ **First purchase** - Test 3
2. ✅ **Duplicate prevention** - Test 4
3. ✅ **Balance update** - Test 3, 5, 7
4. ✅ **UI state changes** - Test 3, 4

### Medium Priority:
5. ✅ **Multiple purchases** - Test 5, 7
6. ✅ **Insufficient balance** - Test 6

### Low Priority:
7. ✅ **API verification** - Test 9
8. ✅ **Visual appearance** - Visual check

---

## 🚀 After Testing

**If all tests pass**:
1. ✅ Machine purchase system is working
2. ✅ Ready for Task 5 (Machine Activation)
3. ✅ Can proceed with admin activation features

**Report any issues**:
- [ ] Screenshots of errors
- [ ] Console error messages
- [ ] Unexpected behavior
- [ ] UI issues

---

## 💾 Database Reset (If Needed)

**To reset test user for re-testing**:
```sql
-- Delete purchased machines
DELETE FROM user_miners WHERE user_id = 3;

-- Delete purchase transactions
DELETE FROM transactions WHERE user_id = 3 AND transaction_type = 'purchase';

-- Reset balance
UPDATE users 
SET wallet_balance = 2000.00, 
    total_invested = 0.00 
WHERE id = 3;
```

---

## 🎉 Expected Final State

**After completing all tests**:
- **Balance**: $0.00
- **Total Invested**: $2,000.00
- **Owned Machines**: 3
  - RTX 4090 East ($500)
  - A100 48G ($1,000)
  - RTX 4090 South ($500)
- **Status**: All pending admin activation

---

**Test Status**: 🟡 READY FOR USER TESTING  
**Test URL**: https://www.deepmineai.vip/machines  
**Test User**: ryan786w@gmail.com ($2,000 balance ready)

**Please proceed with the testing checklist above and report your results!** 🧪✨
