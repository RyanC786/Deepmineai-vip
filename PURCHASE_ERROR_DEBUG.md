# 🐛 Machine Purchase Error - Debug Info

**Date:** December 9, 2025  
**User:** bnai48826@gmail.com (Yana, ID 10)  
**Issue:** D1_ERROR: Failed parse body as JSON! got:

---

## 📊 Error Details

**What happened:**
- Yana tried to purchase "RTX 4090 24G East China"
- Got error: "D1_ERROR: Failed parse body as JSON! got:"
- Purchase failed

**Expected behavior:**
- Balance deducted: $500
- Machine added to "My Machines" (pending activation)
- Success message shown

---

## 🔧 Debug Improvements Applied

### Added Enhanced Error Handling

```typescript
// In /src/routes/machines.ts, POST /api/machines/purchase

try {
  body = await c.req.json()
  console.log('[PURCHASE] Parsed body:', JSON.stringify(body))
} catch (parseError) {
  console.error('[PURCHASE] JSON parse error:', parseError.message)
  const rawBody = await c.req.text()
  console.error('[PURCHASE] Raw body:', rawBody)
  return c.json({ 
    error: 'Invalid request format',
    message: 'Request body must be valid JSON',
    details: parseError.message
  }, 400)
}
```

### Debug Logs Added

The endpoint now logs:
- ✅ Request method (POST)
- ✅ Content-Type header
- ✅ Parsed JSON body
- ✅ Raw body content (if parsing fails)
- ✅ Parse error message

---

## 🎯 Next Steps to Debug

### Option 1: Ask Yana to Try Again (RECOMMENDED)

1. **Ask Yana to try purchasing again:**
   - RTX 4090 24G East: $500
   
2. **Check PM2 logs immediately after:**
   ```bash
   pm2 logs deepmine-ai --nostream --lines 50
   ```

3. **Look for these log entries:**
   ```
   [PURCHASE] Request method: POST
   [PURCHASE] Content-Type: application/json
   [PURCHASE] Parsed body: {"packageId":1}
   ```

4. **Or if error:**
   ```
   [PURCHASE] JSON parse error: <error message>
   [PURCHASE] Raw body: <what was actually sent>
   ```

---

### Option 2: Test Manually with curl

Test the endpoint directly:

```bash
# First, get auth token from browser cookies
# Then test purchase:

curl -X POST http://localhost:3000/api/machines/purchase \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<token>" \
  -d '{"packageId": 1}' \
  -v
```

---

### Option 3: Check Browser Console

Ask Yana to:
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try purchase again
4. Click on the `/api/machines/purchase` request
5. Check:
   - **Request Headers:** Is `Content-Type: application/json` set?
   - **Request Payload:** What data was sent?
   - **Response:** What error message?

---

## 🔍 Possible Causes

### 1. CORS Issue
**Symptoms:** Request blocked before reaching server  
**Check:** Browser console for CORS errors  
**Fix:** Already configured CORS in `index.tsx`

### 2. Missing Content-Type Header
**Symptoms:** Server can't parse JSON  
**Check:** Network tab → Request Headers  
**Fix:** axios should auto-set this

### 3. Empty Request Body
**Symptoms:** `c.req.json()` fails  
**Check:** Our new logs will show raw body  
**Fix:** Frontend sending issue

### 4. Authentication Token Expired
**Symptoms:** 401 error before reaching purchase endpoint  
**Check:** PM2 logs for "Authentication required"  
**Fix:** Logout and login again

### 5. Axios Not Sending JSON
**Symptoms:** Body sent as form data or text  
**Check:** Network tab → Request payload format  
**Fix:** Ensure axios default config correct

---

## 📝 Frontend Code (Verified Correct)

```javascript
// src/pages/machines.html.ts line 316
async function purchaseMachine(packageId, packageName, price) {
    if (!confirm(`Purchase ${packageName} for $${price}?`)) {
        return;
    }

    try {
        const response = await axios.post('/api/machines/purchase', {
            packageId: packageId  // ✅ Correct format
        });

        showAlert(response.data.message, 'success');
        
        // Reload data
        await loadBalance();
        await loadOwnedMachines();
        await loadPackages();

    } catch (error) {
        console.error('Purchase error:', error);
        const message = error.response?.data?.message || 'Failed to purchase machine';
        showAlert(message, 'error');
    }
}
```

**This looks correct!** Axios should automatically:
- Set `Content-Type: application/json`
- Stringify the object to JSON
- Send as request body

---

## 🧪 Test Scenarios

### Scenario 1: Successful Purchase
```
Request: POST /api/machines/purchase
Body: {"packageId": 1}
Expected logs:
  [PURCHASE] Request method: POST
  [PURCHASE] Content-Type: application/json
  [PURCHASE] Parsed body: {"packageId":1}
  💰 Current ETH Price: $3379.09
  👤 User Balance: $2000.00 USD
  🏷️ Package Price: $500 USD
  💸 Deducting: 500.000000 USD (=$500 USD)

Response: 200 OK
{
  "success": true,
  "message": "Machine purchased successfully!",
  "purchase": { ... }
}
```

### Scenario 2: Parse Error (Current Issue)
```
Request: POST /api/machines/purchase
Body: ??? (Unknown - that's what we're debugging)
Expected logs:
  [PURCHASE] Request method: POST
  [PURCHASE] Content-Type: ??? 
  [PURCHASE] JSON parse error: <error message>
  [PURCHASE] Raw body: <actual content>

Response: 400 Bad Request
{
  "error": "Invalid request format",
  "message": "Request body must be valid JSON",
  "details": "<parse error>"
}
```

---

## ✅ System Status

**Server:** ✅ Running (PM2)  
**Build:** ✅ Latest (with debug logs)  
**Endpoint:** ✅ /api/machines/purchase  
**Auth Middleware:** ✅ Configured  
**Frontend:** ✅ Verified correct  

**Issue:** 🐛 JSON parse error (investigating)

---

## 📱 Instructions for Yana

**Please try this:**

1. **Make sure you're logged in** (fresh session after logout/login earlier)
2. **Go to:** https://www.deepmineai.vip/machines
3. **Check your balance shows:** $2,000.00 USD
4. **Try purchasing RTX 4090 24G East** ($500)
5. **If error appears:**
   - Take a screenshot
   - Press F12 to open DevTools
   - Go to "Network" tab
   - Find the failed request
   - Screenshot the "Headers" and "Payload" sections
   - Send screenshots to Ryan

**Alternative test:**
- Try purchasing a different machine first
- Try using a different browser (Chrome/Firefox)
- Try on a different device/computer

---

## 🎯 Expected Resolution

Once we see the debug logs from Yana's next purchase attempt, we'll know:
1. What format the request is arriving in
2. Whether Content-Type header is set
3. What the raw body contains
4. Exact parse error message

Then we can apply the specific fix needed.

---

**Status:** 🔍 Debugging in progress  
**Debug logs:** ✅ Added  
**Server:** ✅ Restarted with new code  
**Next:** Wait for Yana to try again and check logs

---

**Generated:** December 9, 2025 19:25 UTC  
**Platform:** https://www.deepmineai.vip
