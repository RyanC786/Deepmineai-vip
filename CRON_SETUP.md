# Cloudflare Cron Trigger Setup for Mining Earnings

## Overview
The mining system uses Cloudflare Cron Triggers to automatically calculate and distribute earnings to users every hour.

## Configuration

### Important: Cloudflare Pages Cron Setup
**Cron triggers for Cloudflare Pages MUST be configured through the Dashboard, not wrangler.jsonc**

#### Step-by-Step Setup:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to: **Workers & Pages** → **deepmine-ai**
3. Click **Settings** tab
4. Scroll to **Functions** section
5. Click **Add Cron Trigger**
6. Enter cron schedule: `0 * * * *` (every hour)
7. Click **Save**

### ~~wrangler.jsonc~~ (Not supported for Pages)
```jsonc
// ❌ This does NOT work for Cloudflare Pages
"triggers": {
  "crons": ["0 * * * *"]
}
```

### Cron Schedule Syntax
- `0 * * * *` - Every hour at minute 0 (e.g., 1:00, 2:00, 3:00)
- `*/30 * * * *` - Every 30 minutes
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Once per day at midnight UTC

## How It Works

1. **Automatic Trigger**: Cloudflare calls the `scheduled()` function every hour
2. **Find Active Miners**: Queries all users with active mining packages
3. **Calculate Earnings**: Based on:
   - Package daily rate
   - Time elapsed since last calculation
   - Maximum 24 hours per day
4. **Update Database**:
   - Insert earnings record in `earnings_history`
   - Update `user_miners.total_earned`
   - Update `user_miners.last_earning_at`
   - Add to `users.balance`

## Manual Testing

### Option 1: Admin API Endpoint
```bash
# Call the manual trigger (requires admin auth)
curl -X POST https://www.deepmineai.vip/api/cron/calculate-earnings \
  -H "Cookie: auth_token=YOUR_ADMIN_TOKEN"
```

### Option 2: Mining API Endpoint
```bash
# Alternative endpoint (requires auth)
curl -X POST https://www.deepmineai.vip/api/mining/calculate-earnings \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

### Option 3: Cloudflare Dashboard
1. Go to Cloudflare Dashboard
2. Workers & Pages → deepmine-ai
3. Settings → Triggers → Cron Triggers
4. Click "Test" to manually trigger

## Monitoring

### View Logs
```bash
# Tail worker logs
npx wrangler pages deployment tail --project-name deepmine-ai

# Or view in Cloudflare Dashboard:
# Workers & Pages → deepmine-ai → Logs
```

### Expected Log Output
```
🕐 Cron trigger fired: 2024-12-01T12:00:00.000Z
✅ Cron job completed: Processed 5 miners
```

## Earnings Calculation Logic

```javascript
// For each active miner:
const lastEarning = miner.last_earning_at || miner.started_at
const hoursElapsed = Math.min(24, (now - lastEarning) / (1000 * 60 * 60))
const earnings = (miner.daily_rate / 24) * hoursElapsed

// Example: Professional package ($13.50/day)
// After 1 hour: $13.50 / 24 × 1 = $0.5625
// After 24 hours: $13.50 / 24 × 24 = $13.50
```

## Troubleshooting

### Cron Not Running
1. **Check Configuration**: Ensure `wrangler.jsonc` has triggers configured
2. **Redeploy**: Run `npm run deploy` to apply changes
3. **Verify in Dashboard**: Cloudflare Dashboard → Triggers → Cron Triggers

### No Earnings Calculated
1. **Check Active Miners**: Ensure users have purchased packages
2. **Check Expiry**: Packages must not be expired
3. **Check Last Calculation**: `last_earning_at` must be > 1 hour ago
4. **Check Logs**: Look for errors in worker logs

### Duplicate Calculations
- The system prevents duplicate calculations by checking `last_earning_at`
- Only processes miners where `last_earning_at < today 00:00:00`
- Maximum 24 hours of earnings per day

## Database Schema

### earnings_history
```sql
CREATE TABLE earnings_history (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  miner_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Key Fields in user_miners
- `last_earning_at`: Last time earnings were calculated
- `total_earned`: Cumulative earnings from this miner
- `expires_at`: Package expiration date

## Production Deployment

### Deploy with Cron Triggers
```bash
# Build and deploy
npm run build
npx wrangler pages deploy dist --project-name deepmine-ai

# Verify cron is active
# Check Cloudflare Dashboard → Triggers tab
```

### First-Time Setup
1. Deploy application with cron configuration
2. Go to Cloudflare Dashboard
3. Navigate to Workers & Pages → deepmine-ai → Settings → Triggers
4. Verify "Cron Triggers" section shows: `0 * * * *`
5. Click "Test" to manually trigger once
6. Check logs to verify execution

## Cost Considerations

- **Cloudflare Cron Triggers**: Free on all plans
- **Workers Requests**: Included in Pages plan
- **D1 Reads/Writes**: Calculated per cron execution
- **Estimated Cost**: ~$0 for small scale (< 10,000 miners)

## Best Practices

1. **Log Everything**: Use console.log for debugging
2. **Error Handling**: Wrap in try-catch to prevent failures
3. **Idempotency**: Ensure multiple runs don't duplicate earnings
4. **Rate Limits**: Consider batch processing for large user bases
5. **Monitoring**: Set up alerts for failed executions
