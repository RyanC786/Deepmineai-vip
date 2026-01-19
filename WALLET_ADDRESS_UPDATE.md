# Deposit Wallet Address Updated
**Date**: January 14, 2026  
**Update Type**: Business ETH Wallet Address Change

---

## ✅ Changes Made

### **Old Wallet Address**
```
0x66a5957bdfa1371a651d5d932d03b8710cccd742
```

### **New Wallet Address** (Active)
```
0x806271F24f51681cE966338E19a73a7C5CF58507
```

---

## 📱 QR Code

**New QR Code saved to:**
- File: `/public/static/eth-wallet-qr.png`
- Size: 37.26 KB
- Format: PNG

**Note**: The deposit page dynamically generates QR codes from the wallet address, so it will automatically display the new QR code for the new address.

---

## 🔧 Technical Changes

### **File Updated**
- **File**: `src/routes/deposits.ts`
- **Line**: 19
- **Change**: Updated `BUSINESS_ETH_WALLET` constant

### **Code Change**
```typescript
// OLD
const BUSINESS_ETH_WALLET = '0x66a5957bdfa1371a651d5d932d03b8710cccd742'

// NEW
const BUSINESS_ETH_WALLET = '0x806271F24f51681cE966338E19a73a7C5CF58507'
```

---

## 🚀 Deployment Status

- **Production URL**: https://www.deepmineai.vip
- **Latest Build**: https://d7709a2f.deepmine-ai.pages.dev
- **Git Commit**: a0d5817
- **Status**: 🟢 **LIVE**

---

## ✅ What Changed for Users

### **Deposit Page** (https://www.deepmineai.vip/deposit)

**Before:**
- Wallet: `0x66a5...cd742`
- QR Code: Generated for old address

**After:**
- Wallet: `0x806271F24f51681cE966338E19a73a7C5CF58507`
- QR Code: Generated for new address ✅
- Copy button: Copies new address ✅

---

## 🔍 How It Works

1. **User visits deposit page**
2. **Page calls**: `GET /api/deposits/wallet`
3. **API returns**: New wallet address `0x806271F24f51681cE966338E19a73a7C5CF58507`
4. **QR code generated**: Dynamically created using QRCode.js library
5. **User sees**: New address and QR code

---

## 📊 Impact

### **Existing Deposits**
- ✅ Old deposits to old address: Still valid and tracked
- ✅ Historical data: Preserved in database
- ✅ Admin can still verify old transactions

### **New Deposits**
- ✅ All new deposits go to: `0x806271F24f51681cE966338E19a73a7C5CF58507`
- ✅ QR code scans to: New address
- ✅ Copy button copies: New address

---

## 🧪 Testing

### **Test Steps:**
1. Login at: https://www.deepmineai.vip/login
2. Go to: https://www.deepmineai.vip/deposit
3. Verify wallet shows: `0x806271F24f51681cE966338E19a73a7C5CF58507`
4. Verify QR code displays correctly
5. Click "Copy" button
6. Verify copied address matches

### **Expected Results:**
- ✅ New address displayed
- ✅ QR code generates correctly
- ✅ Copy function works
- ✅ Instructions reference new address

---

## 🔐 Security Notes

### **Network**
- **Network**: Ethereum Mainnet
- **Currency**: ETH only
- **Important**: Only send ETH on Ethereum Mainnet

### **User Wallet Locking**
- First deposit locks user's wallet address permanently
- All future deposits and withdrawals must use same user wallet
- This prevents address switching fraud

---

## 📝 Admin Notes

### **Verifying Deposits**

**Old Address (before Jan 14, 2026):**
- Check Etherscan: https://etherscan.io/address/0x66a5957bdfa1371a651d5d932d03b8710cccd742
- Old deposits still valid

**New Address (after Jan 14, 2026):**
- Check Etherscan: https://etherscan.io/address/0x806271F24f51681cE966338E19a73a7C5CF58507
- All new deposits here

### **Database Records**
Both old and new transactions are stored in the `deposits` table with:
- `from_address`: User's wallet
- `to_address`: Business wallet (old or new)
- `tx_hash`: Blockchain transaction hash

---

## ✅ Verification

**How to verify the update:**

1. **API Check:**
```bash
curl https://www.deepmineai.vip/api/deposits/wallet \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "wallet": "0x806271F24f51681cE966338E19a73a7C5CF58507",
  "currency": "ETH",
  "network": "Ethereum Mainnet"
}
```

2. **Visual Check:**
- Visit deposit page
- Wallet address should be: `0x806271F24f51681cE966338E19a73a7C5CF58507`
- QR code should encode same address

---

## 🎯 Summary

✅ **Wallet address updated** from old to new  
✅ **QR code** dynamically generated for new address  
✅ **Deployed** to production  
✅ **Tested** and verified  
✅ **Old deposits** still tracked  
✅ **New deposits** go to new address  

**Status**: 🟢 **COMPLETE AND LIVE**

---

**Updated by**: AI Developer  
**Date**: January 14, 2026  
**Commit**: a0d5817
