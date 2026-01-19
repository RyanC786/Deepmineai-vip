# 🗓️ Monthly Payout Projections Feature

## ✨ New Feature Added!

Your partner dashboard now includes a **Monthly Projections** tab that shows exactly how much residual will be available for payout at the end of each month.

---

## 🎯 What This Feature Does

Instead of only seeing the final contract end dates (180 days), you can now see:

✅ **Monthly Timeline** - View payouts month by month for the next 12 months  
✅ **Accumulated Totals** - See how much grows month over month  
✅ **Contract Details** - Which specific contracts complete in each month  
✅ **Quick Overview** - Total projected revenue across all contracts  

---

## 📊 How It Works

### Logic
The system calculates when each contract completes (start date + 180 days), then groups them by month-end to show cumulative totals.

### Example with Your Current Contracts

**Current Active Contracts:**
- Miner #21 (Suhanul Islam) - Completes June 14, 2026 → $18.80
- Miner #22 (Suhanul Islam) - Completes June 14, 2026 → $18.80
- Miner #23 (Stacey Lucas) - Completes June 30, 2026 → $18.80
- Miner #24 (Daniel Kalashnikova) - Completes July 5, 2026 → $18.80

**Monthly Breakdown:**

### June 2026 (End of Month)
- **Available for Payout:** $56.40
- **Contracts Completing:** 3
  - ✅ Miner #21 - June 14 - $18.80
  - ✅ Miner #22 - June 14 - $18.80
  - ✅ Miner #23 - June 30 - $18.80

### July 2026 (End of Month)
- **Available for Payout:** $75.20 (all 4 contracts)
- **Contracts Completing:** 4
  - ✅ Miner #21 - June 14 - $18.80
  - ✅ Miner #22 - June 14 - $18.80
  - ✅ Miner #23 - June 30 - $18.80
  - ✅ Miner #24 - July 5 - $18.80

### August 2026 onwards
- **Available for Payout:** $75.20 (maintains)
- All 4 contracts remain completed and available

---

## 🚀 How to Use

### Step 1: Login
Go to: https://www.deepmineai.vip/partner/login
- Username: `aleena@deepmineai.vip`
- Password: `DeepMine2025!Partner`

### Step 2: Navigate to Monthly Projections
After login, click the **"Monthly Projections"** tab (calendar icon)

### Step 3: View Your Timeline
You'll see:

**📌 Total Projected Revenue Card**
- Shows total across all contracts: **$75.20**
- Number of active contracts: **4**

**📅 Monthly Timeline Cards**
Each month shows:
- Month name and end date
- Total residual available by end of that month
- Number of contracts completing
- List of specific contracts with completion dates
- Individual residual amounts per contract

**🎯 Next Payout Highlight**
- The nearest month is highlighted with a green border
- Shows "Next Payout" badge for easy identification

---

## 💡 Use Cases

### 1. Planning Monthly Withdrawals
Instead of waiting for all contracts to complete, you can plan to withdraw residuals at the end of each month as they become available.

**Example:**
- End of June 2026: Request payout of $56.40 (3 contracts)
- End of July 2026: Request payout of $18.80 (remaining 1 contract)

### 2. Cash Flow Forecasting
See your revenue timeline for the next 12 months to plan business expenses or reinvestment.

### 3. Performance Tracking
Monitor which months will have higher payouts based on contract completion timing.

### 4. Payout Strategy
Decide whether to:
- **Monthly Payouts:** Take smaller amounts each month as contracts complete
- **Quarterly Payouts:** Accumulate for 3 months, then withdraw
- **Full Payout:** Wait until all contracts complete for maximum efficiency

---

## 📋 API Endpoint

**Endpoint:** `GET /api/partner/monthly-projections`

**Authentication:** Bearer token (JWT)

**Response Structure:**
```json
{
  "success": true,
  "projections": [
    {
      "month": "June 2026",
      "month_end_date": "2026-06-30",
      "total_residual": 56.40,
      "contracts_completing": 3,
      "completing_contracts": [
        {
          "id": 3,
          "machine_id": 22,
          "package_name": "RTX 4090 24G Server (South China)",
          "residual_amount": 18.8,
          "completion_date": "2026-06-14"
        },
        ...
      ]
    },
    ...
  ],
  "total_contracts": 4,
  "total_potential": 507.60
}
```

**Key Fields:**
- `month` - Month name and year
- `month_end_date` - Last day of the month (YYYY-MM-DD)
- `total_residual` - Cumulative residual available by end of month
- `contracts_completing` - Number of contracts that complete by month end
- `completing_contracts` - Array of contract details
- `total_potential` - Sum of all residuals across all months

---

## 🎨 UI Features

### Visual Design
- **Glass-morphism cards** - Modern, translucent design
- **Color coding:**
  - Cyan (#33F0FF) - Headers and highlights
  - Green (#10B981) - Amounts and success states
  - Gray - Secondary information
- **Icons:**
  - 📅 Calendar - Month dates
  - 💻 Server - Contract counts
  - ✅ Check circle - Completed contracts

### Responsive Layout
- **Desktop:** Full-width cards with side-by-side information
- **Mobile:** Stacked layout with touch-friendly elements

### Interactive Elements
- Automatically loads when you click "Monthly Projections" tab
- Shows "Next Payout" badge on nearest month
- Lists individual contract details per month
- Scrollable timeline for 12 months

---

## 📊 Example Scenarios

### Scenario 1: Steady Monthly Income
If you had 20 contracts spread evenly across months:
- January: $94.00 (5 contracts)
- February: $94.00 (5 contracts)
- March: $94.00 (5 contracts)
- April: $94.00 (5 contracts)

### Scenario 2: Bulk Completion
If all contracts start the same day and complete 180 days later:
- June 2026: $376.00 (20 contracts complete)
- July onwards: $376.00 (all remain available)

### Scenario 3: Staggered Completions (Your Current Situation)
- June 2026: $56.40 (3 contracts)
- July 2026: $75.20 (4 contracts total)
- August onwards: $75.20 (maintains)

---

## 🔔 Important Notes

### Residual Tracking
- Residuals are tracked from **contract completion date** (start + 180 days)
- They remain "completed" status until you mark them as "paid"
- Monthly projections show **cumulative totals** (contracts stay in later months too)

### Payout Process
1. Contract reaches day 180 → Status changes to "completed"
2. You receive email notification
3. Residual shows in Monthly Projections
4. You can request payout anytime after completion
5. After processing payment, mark as "paid" in dashboard

### Data Updates
- Projections update automatically when:
  - New contracts are purchased
  - Contracts complete
  - You mark residuals as paid

---

## 🎯 Dashboard Tabs Overview

Your partner dashboard now has these tabs:

1. **Overview** - Summary stats and recent activity
2. **All Residuals** - Detailed table of all contracts
3. **Monthly Projections** ⭐ NEW - Monthly payout timeline
4. **Payouts** - Payment history
5. **Analytics** - Withdrawal fee analytics
6. **Export** - Download CSV reports

---

## 🚀 Try It Now!

**Step-by-Step:**

1. **Go to:** https://www.deepmineai.vip/partner/login
2. **Login** with your credentials
3. **Click:** "Monthly Projections" tab (4th tab with calendar icon)
4. **See:** Your timeline for the next 12 months

**What You'll See:**

📌 **Total Projected Revenue:** $75.20 across 4 contracts

📅 **June 2026** (Next Payout)
- $56.40 available
- 3 contracts completing
- Details: Miners #21, #22, #23

📅 **July 2026**
- $75.20 available
- 4 contracts total
- Details: All 4 miners

📅 **August - December 2026**
- $75.20 maintained
- All contracts remain completed

---

## 💼 Business Benefits

### For You (Aleena)
✅ **Better Planning** - Know exactly when funds will be available  
✅ **Flexible Payouts** - Choose monthly, quarterly, or full payouts  
✅ **Cash Flow Visibility** - 12-month revenue forecast  
✅ **Contract Tracking** - See which users' contracts complete when  

### For Business Operations
✅ **Payment Scheduling** - Plan when to process partner payouts  
✅ **Budget Forecasting** - Predict outgoing partner payments  
✅ **Performance Monitoring** - Track completion patterns  
✅ **Transparency** - Clear visibility into residual obligations  

---

## 📈 Future Enhancements (Potential)

Ideas for future improvements:
- **Year-end summary** - Total residuals for the full year
- **Comparison charts** - Month-over-month growth visualization
- **Payout reminders** - Notifications for upcoming available payouts
- **Historical data** - Compare with previous months/years
- **Export timeline** - Download monthly projections as PDF/CSV

---

## 🎊 Summary

**Feature:** Monthly Payout Projections  
**Status:** ✅ Live and Working  
**URL:** https://www.deepmineai.vip/partner/dashboard  
**Tab:** Monthly Projections (calendar icon)  
**Deployment:** https://507e9368.deepmine-ai.pages.dev  
**Git Commit:** cd47099  

**What It Shows:**
- 12-month payout timeline
- Cumulative residuals by month-end
- Contract completion details
- Total projected revenue
- Next payout highlight

**Current Data:**
- Total Contracts: 4
- First Payout: June 2026 ($56.40)
- Full Payout: July 2026 ($75.20)
- Projection Period: Jan 2026 - Dec 2026

---

**🎉 You can now plan your monthly payouts with complete visibility! 🎉**

Login and check your Monthly Projections tab to see your full timeline.
