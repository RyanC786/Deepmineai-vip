# Testing CRM Dashboard API

To verify the API is returning the correct data, Rayhan can:

## Option 1: Check Browser Console
1. Open the CRM Dashboard: https://www.deepmineai.vip/admin/crm/dashboard
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Type: `fetch('/api/crm/dashboard', {credentials: 'include'}).then(r => r.json()).then(d => console.log(d))`
5. Press Enter
6. Check the output - should show: `kyc: { pending: 1, ... }`

## Option 2: Check Network Tab
1. Press F12 to open Developer Tools
2. Go to Network tab
3. Refresh the page (Ctrl+F5 or Cmd+Shift+R for hard refresh)
4. Find the request to `/api/crm/dashboard`
5. Click on it
6. Go to Response tab
7. Should see: `"kyc": { "pending": 1, ... }`

## What to Look For
The response should contain:
```json
{
  "success": true,
  "data": {
    "kyc": {
      "pending": 1,
      "approved_today": 0,
      ...
    },
    ...
  }
}
```

If `pending: 0` then there's a database issue.
If `pending: 1` but not showing on page, it's a frontend display issue.
