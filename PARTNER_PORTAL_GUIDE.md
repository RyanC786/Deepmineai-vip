# Partner Portal - Setup & Access Guide

## 🔐 Login Credentials

**Portal URL:** https://www.deepmineai.vip/partner/login

**Default Credentials:**
- Username: `partner`
- Password: `partner123`

> ⚠️ **IMPORTANT:** Change these credentials in production by modifying `/src/routes/partner.ts` line 51

---

## 📊 Dashboard Features

### Overview Stats
- **Total Contracts**: All mining contracts tracked
- **Pending**: Contracts still active (not yet 180 days)
- **Completed**: Contracts finished (ready for payout)
- **Paid**: Already processed residuals
- **Total Earned**: Lifetime residual earnings
- **Unpaid Balance**: Available for payout
- **Paid Out**: Historical payouts

### Recent Activity
- View last 30 days of completed contracts
- See user info, package details, and residual amounts
- Track which contracts are ready for payout

### Withdrawal Analytics
- Platform revenue from 2% withdrawal fees
- Network costs (TRC-20 fees)
- Net profit and margins
- Daily/Weekly/Monthly breakdowns

### Export Data
- Download CSV reports
- Filter by date range
- Export residuals and withdrawals

---

## 💰 Residual Calculation

**Current Setup: 2% on Net Profit**

### How It Works

1. **User Purchases Machine**
   - System creates `partner_residuals` record
   - Status: `pending`
   - Tracks: Investment, Daily Rate, Total Returns, Net Profit

2. **Contract Runs for 180 Days**
   - Daily earnings credited via cron job
   - Residual stays in `pending` status

3. **Day 180 - Contract Completes**
   - Cron job marks status: `completed`
   - Residual becomes payable
   - Shows in "Ready for Payout" section

4. **Partner Payment**
   - View completed residuals in dashboard
   - Click "Mark as Paid"
   - Status changes to: `paid`
   - Moves to paid history

---

## 📦 All 7 Packages Tracked

| Package | Investment | Daily | 180-Day Total | Net Profit | 2% Residual |
|---------|-----------|-------|---------------|------------|-------------|
| RTX 4090 | $500 | $8 | $1,440 | $940 | **$18.80** |
| Mid-Tier | $2,000 | $38 | $6,840 | $4,840 | **$96.80** |
| H800 2400 | $5,000 | $88 | $15,840 | $10,840 | **$216.80** |
| H200 3200 | $7,000 | $108 | $19,440 | $12,440 | **$248.80** |
| H800 3200G | $11,000 | $168 | $30,240 | $19,240 | **$384.80** |
| H800 6400G | $30,000 | $545 | $98,100 | $68,100 | **$1,362.00** |
| H800 8400G | $50,000 | $909 | $163,620 | $113,620 | **$2,272.40** |

**Total if 1 of each:** $4,600.40 residual

---

## 🔄 Automatic Tracking

### On Machine Purchase
```typescript
// Automatically creates residual record
{
  partner_id: 1,
  user_id: user.id,
  machine_id: machine.id,
  package_name: "RTX 4090 24G Server",
  investment: 500,
  daily_rate: 8,
  contract_duration: 180,
  total_return: 1440,
  net_profit: 940,
  residual_amount: 18.80,  // 2% of $940
  status: "pending",
  start_date: "2025-01-10"
}
```

### On Contract Completion (Day 180)
```typescript
// Cron job updates status
UPDATE partner_residuals 
SET status = 'completed', 
    completed_at = CURRENT_TIMESTAMP
WHERE DATE(start_date, '+180 days') <= DATE('now')
AND status = 'pending'
```

### On Payout
```typescript
// Manual mark as paid in dashboard
UPDATE partner_residuals 
SET status = 'paid', 
    paid_at = CURRENT_TIMESTAMP
WHERE id = ?
```

---

## 📈 Scale Examples

### 100 RTX 4090 Contracts
- Investment: $50,000
- Total Returns: $144,000
- Net Profit: $94,000
- **Your Residual: $1,880**

### 10 H800 8400G Contracts
- Investment: $500,000
- Total Returns: $1,636,200
- Net Profit: $1,136,200
- **Your Residual: $22,724**

### Mixed Portfolio
- 50× RTX 4090: $940 → $940
- 20× H800 2400: $4,336 → $4,336
- 5× H800 8400G: $11,362 → $11,362
- **Total Residual: $16,638**

---

## 🛠️ API Endpoints

All endpoints require authentication token (JWT)

### Login
```bash
POST /api/partner/login
{
  "username": "partner",
  "password": "partner123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "partner": {
    "id": 1,
    "name": "Partner Name",
    "percentage": 2.0,
    "calculation_type": "net_profit"
  }
}
```

### Dashboard Stats
```bash
GET /api/partner/dashboard
Authorization: Bearer <token>

Response:
{
  "success": true,
  "summary": {
    "total_contracts": 150,
    "pending_contracts": 80,
    "completed_contracts": 50,
    "paid_contracts": 20,
    "total_residual_earned": 15000,
    "unpaid_residual": 8000,
    "paid_residual": 7000
  },
  "recentCompletions": [...]
}
```

### Residuals List
```bash
GET /api/partner/residuals?status=completed&limit=50&offset=0
Authorization: Bearer <token>
```

### Mark as Paid
```bash
POST /api/partner/residuals/mark-paid
Authorization: Bearer <token>
{
  "residualIds": [1, 2, 3]
}
```

### Withdrawal Analytics
```bash
GET /api/partner/withdrawal-analytics?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer <token>
```

### Export CSV
```bash
GET /api/partner/export?type=residuals&status=completed&format=csv
Authorization: Bearer <token>
```

---

## 🔒 Security Notes

1. **Change Default Credentials**
   - Edit `/src/routes/partner.ts` line 51
   - Use bcrypt for password hashing in production

2. **JWT Secret**
   - Change secret key at line 29: `'partner-secret-key-change-in-production'`
   - Use environment variable: `process.env.PARTNER_JWT_SECRET`

3. **Token Expiry**
   - Default: 30 days
   - Modify at line 45: `60 * 60 * 24 * 30`

4. **Database Access**
   - Partner can only view their own data (partner_id = 1)
   - No admin access to user management

---

## 📊 Withdrawal Fee Analytics

The system tracks your 2% platform withdrawal fees:

### Per Transaction
- **Gross Fee**: 2% of withdrawal amount
- **Network Cost**: $1 (TRC-20)
- **Net Profit**: Gross - Network
- **Margin**: (Net / Gross) × 100

### Best Practices
- Encourage monthly withdrawals (79-99% margin)
- Minimum withdrawal: $100
- Avoid daily withdrawals (negative margin on small amounts)

---

## 🚀 Quick Start

1. **Login**
   ```
   https://www.deepmineai.vip/partner/login
   username: partner
   password: partner123
   ```

2. **View Dashboard**
   - See overview stats
   - Check recent completions
   - Review unpaid balance

3. **Monitor Residuals**
   - Filter by status (pending/completed/paid)
   - Export reports
   - Track earnings

4. **Process Payouts**
   - Select completed residuals
   - Mark as paid
   - Download payout reports

---

## 📞 Support

For questions or issues:
- Email: partner@deepmineai.vip
- System Admin: Check `/src/routes/partner.ts` for modifications
- Database: See `migrations/0017_partner_tracking_system.sql`

---

## 📝 Database Tables

### partner_config
- Stores partner settings
- Default: 2% on net profit

### partner_residuals
- Individual contract tracking
- Auto-created on purchase
- Auto-completed after 180 days

### partner_payouts
- Batch payout history
- Links multiple residuals

### partner_payout_items
- Line items for payouts
- Maps residuals to payments

### withdrawal_fee_analytics
- Tracks 2% platform fees
- Network costs and margins

---

**Last Updated:** January 10, 2025  
**Version:** 1.0  
**System:** DeepMine AI Partner Portal
