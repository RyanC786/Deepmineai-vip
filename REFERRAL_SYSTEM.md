# DeepMine AI - Referral System Documentation

## ✅ COMPLETED (Backend & Database)

### Database Schema
✅ **Users Table Columns Added:**
- `referred_by` TEXT - Referral code of the person who referred this user
- `vip_level` INTEGER (default 1) - User's VIP level (1-10)
- `direct_referrals` INTEGER (default 0) - Count of direct referrals
- `network_size` INTEGER (default 0) - Total network size (all levels)
- `total_referrals` INTEGER (default 0) - Total referrals count

✅ **New Tables Created:**
1. `referral_commissions` - Track all commission payments
2. `referral_tree` - Efficient network hierarchy queries
3. `vip_levels` - VIP level configuration (1-10 levels inserted)

### API Endpoints
✅ **Referral Routes (`/api/referral/*`)**:
- `GET /api/referral/code` - Get user's referral code and link
- `GET /api/referral/stats` - Get referral statistics and VIP info
- `GET /api/referral/downline` - Get direct referrals (Level 1)
- `GET /api/referral/network-tree` - Get 3-level network tree
- `GET /api/referral/commissions` - Get commission history

### Commission System
✅ **Multi-Level Commission Logic:**
- **Level 1 (Direct)**: $80
- **Level 2**: $60 to L2 user, $15 bonus to L1
- **Level 3+**: $60 to L2, $15 to L1, 3-5% to L3+ (based on VIP)

✅ **VIP Levels (Auto-upgrade):**
| VIP | Min Direct | Min Network | L3+ Commission |
|-----|-----------|-------------|----------------|
| VIP 1 | 0 | 0 | 3.0% |
| VIP 2 | 5 | 5 | 3.2% |
| VIP 3 | 10 | 25 | 3.4% |
| VIP 4 | 20 | 50 | 3.6% |
| VIP 5 | 35 | 100 | 3.8% |
| VIP 6 | 50 | 200 | 4.0% |
| VIP 7 | 75 | 400 | 4.2% |
| VIP 8 | 100 | 800 | 4.4% |
| VIP 9 | 150 | 1500 | 4.7% |
| VIP 10 | 200 | 3000 | 5.0% |

### Integration Points
✅ **Registration**: `buildReferralTree()` creates network hierarchy
✅ **Package Purchase**: `distributeCommissions()` pays all levels
✅ **VIP Updates**: Automatic upgrade based on network growth

---

## 🚧 TODO: Frontend Dashboard UI

### 1. Add Referral Section to User Dashboard

**Location**: Insert before "Mining Status" section (line ~689 in `src/pages/dashboard.html.ts`)

**HTML Structure Needed**:
```html
<!-- Referral Section -->
<div class="bg-white rounded-lg shadow-lg p-6 mb-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas fa-users mr-3 text-cyan-500"></i>
        Referral System
        <span id="vipBadge" class="ml-auto text-sm px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
            VIP 1
        </span>
    </h2>

    <!-- Referral Code & Link -->
    <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
            <label class="text-sm font-medium text-gray-600 mb-2 block">
                <i class="fas fa-tag mr-2"></i>Your Referral Code
            </label>
            <div class="flex items-center">
                <input type="text" id="referralCode" readonly 
                    class="flex-1 bg-white border border-cyan-300 rounded-l-lg px-4 py-2 font-mono text-lg font-bold text-cyan-600"
                    value="Loading...">
                <button onclick="copyReferralCode()" 
                    class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-r-lg transition">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <label class="text-sm font-medium text-gray-600 mb-2 block">
                <i class="fas fa-link mr-2"></i>Referral Link
            </label>
            <div class="flex items-center">
                <input type="text" id="referralLink" readonly 
                    class="flex-1 bg-white border border-blue-300 rounded-l-lg px-4 py-2 text-sm text-blue-600 truncate"
                    value="Loading...">
                <button onclick="copyReferralLink()" 
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 text-center">
            <div class="text-3xl font-bold text-green-600" id="directReferrals">0</div>
            <div class="text-sm text-gray-600 mt-1">Direct Referrals</div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 text-center">
            <div class="text-3xl font-bold text-purple-600" id="networkSize">0</div>
            <div class="text-sm text-gray-600 mt-1">Network Size</div>
        </div>
        <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 text-center">
            <div class="text-3xl font-bold text-yellow-600" id="totalCommissions">$0.00</div>
            <div class="text-sm text-gray-600 mt-1">Total Earned</div>
        </div>
        <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200 text-center">
            <div class="text-3xl font-bold text-indigo-600" id="vipProgress">0%</div>
            <div class="text-sm text-gray-600 mt-1">Next VIP Progress</div>
        </div>
    </div>

    <!-- Downline Table -->
    <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-users-line mr-2 text-gray-600"></i>
            Your Downline (Direct Referrals)
        </h3>
        <div id="downlineTable" class="overflow-x-auto">
            <p class="text-gray-500 text-center py-4">Loading...</p>
        </div>
    </div>
</div>
```

**JavaScript Functions Needed** (add to `<script>` section):

```javascript
// Load referral data
async function loadReferralData() {
    try {
        console.log('🔗 Loading referral data...')
        
        // Get referral code and link
        const codeRes = await fetch('/api/referral/code', { credentials: 'include' })
        const codeData = await codeRes.json()
        
        if (codeData.success) {
            document.getElementById('referralCode').value = codeData.referralCode
            document.getElementById('referralLink').value = codeData.referralLink
        }
        
        // Get referral stats
        const statsRes = await fetch('/api/referral/stats', { credentials: 'include' })
        const statsData = await statsRes.json()
        
        if (statsData.success) {
            const { stats, vipInfo, nextVip } = statsData
            
            // Update VIP badge
            document.getElementById('vipBadge').textContent = `VIP ${stats.vipLevel}`
            
            // Update stats cards
            document.getElementById('directReferrals').textContent = stats.directReferrals || 0
            document.getElementById('networkSize').textContent = stats.networkSize || 0
            document.getElementById('totalCommissions').textContent = `$${(stats.totalEarned || 0).toFixed(2)}`
            
            // Calculate VIP progress
            if (nextVip) {
                const directProgress = (stats.directReferrals / nextVip.min_direct_referrals) * 100
                const networkProgress = (stats.networkSize / nextVip.min_network_size) * 100
                const overallProgress = Math.min(directProgress, networkProgress)
                document.getElementById('vipProgress').textContent = `${Math.round(overallProgress)}%`
            } else {
                document.getElementById('vipProgress').textContent = 'MAX'
            }
        }
        
        // Get downline
        const downlineRes = await fetch('/api/referral/downline', { credentials: 'include' })
        const downlineData = await downlineRes.json()
        
        if (downlineData.success) {
            updateDownlineTable(downlineData.downline)
        }
        
        console.log('✅ Referral data loaded')
    } catch (error) {
        console.error('❌ Failed to load referral data:', error)
    }
}

// Update downline table
function updateDownlineTable(downline) {
    const table = document.getElementById('downlineTable')
    
    if (!downline || downline.length === 0) {
        table.innerHTML = '<p class="text-gray-500 text-center py-4">No referrals yet. Share your referral link to start earning!</p>'
        return
    }
    
    let html = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">User</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">VIP Level</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Network Size</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Active Miners</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Joined</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Commission Earned</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
    `
    
    downline.forEach(user => {
        const joinedDate = new Date(user.created_at).toLocaleDateString()
        const commissionEarned = user.commission_earned || 0
        
        html += `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">
                    <div class="font-medium text-gray-900">${user.full_name || 'User'}</div>
                    <div class="text-gray-500 text-xs">${user.email}</div>
                </td>
                <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        VIP ${user.vip_level}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">${user.network_size || 0}</td>
                <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 text-xs rounded-full ${user.active_miners > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}">
                        ${user.active_miners || 0} miners
                    </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">${joinedDate}</td>
                <td class="px-4 py-3 text-sm font-semibold text-green-600">$${commissionEarned.toFixed(2)}</td>
            </tr>
        `
    })
    
    html += '</tbody></table>'
    table.innerHTML = html
}

// Copy referral code
function copyReferralCode() {
    const codeInput = document.getElementById('referralCode')
    codeInput.select()
    document.execCommand('copy')
    alert('✅ Referral code copied to clipboard!')
}

// Copy referral link
function copyReferralLink() {
    const linkInput = document.getElementById('referralLink')
    linkInput.select()
    document.execCommand('copy')
    alert('✅ Referral link copied to clipboard!')
}

// Add to loadDashboardData() function
async function loadDashboardData() {
    // ... existing code ...
    
    // Load referral data
    await loadReferralData()
    
    // ... rest of existing code ...
}
```

---

## 🚧 TODO: Admin Dashboard

### Create Admin Dashboard Page (`src/pages/admin-dashboard.html.ts`)

**Features Needed:**
1. **User Management Table**
   - List all users with referral stats
   - View downline for any user
   - Edit VIP levels manually
   - View commission history per user

2. **Mining Package Management**
   - Add/Edit/Delete mining packages
   - Set pricing and daily earnings
   - Enable/disable packages

3. **Network Visualization**
   - Tree view of referral networks
   - Top performers leaderboard
   - Commission analytics

**Admin API Routes** (`src/routes/admin.ts` - TO BE CREATED):
```typescript
// GET /api/admin/users - List all users with stats
// GET /api/admin/user/:id/network - Get user's network tree
// POST /api/admin/user/:id/vip - Update user VIP level
// GET /api/admin/packages - Get all packages
// POST /api/admin/packages - Create package
// PUT /api/admin/packages/:id - Update package
// DELETE /api/admin/packages/:id - Delete package
// GET /api/admin/commissions - Get all commissions with filters
```

---

## 🧪 TODO: Testing Flow

### Test Scenario 1: Basic Referral
1. User A registers (gets referral code AUTO123)
2. User B registers with ?ref=AUTO123
3. User B buys Professional package ($449.99)
4. **Expected**: User A receives $80 commission

### Test Scenario 2: 2-Level Referral
1. User A → User B → User C (chain)
2. User C buys Professional package
3. **Expected**: 
   - User B gets $60
   - User A gets $15

### Test Scenario 3: VIP Upgrade
1. User A refers 5 users who purchase packages
2. **Expected**: User A auto-upgrades to VIP 2
3. Check commission percentage increases from 3.0% to 3.2%

---

## 📝 Next Steps (Priority Order)

1. ✅ **Backend Complete** - Database, API, commission logic
2. 🚧 **Add Referral Section to Dashboard** - Copy HTML/JS above
3. ⏳ **Test Registration with Referral Code** - Add `?ref=CODE` to register URL
4. ⏳ **Test Commission Distribution** - Buy package and verify commissions
5. ⏳ **Create Admin Dashboard** - User/package management
6. ⏳ **Add Network Visualization** - Tree view of downlines
7. ⏳ **Add Earnings Chart** - Commission history graph

---

## 🔗 API Testing

### Test Referral Code Generation:
```bash
curl -X GET https://www.deepmineai.vip/api/referral/code \
  -H "Cookie: auth_token=YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test Referral Stats:
```bash
curl -X GET https://www.deepmineai.vip/api/referral/stats \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

### Test Downline:
```bash
curl -X GET https://www.deepmineai.vip/api/referral/downline \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

---

## 📊 Current Deployment Status

- ✅ Backend API: Deployed to https://3251014b.deepmine-ai.pages.dev
- ✅ Database: Production schema updated
- ⏳ Dashboard UI: Needs referral section added
- ⏳ Admin Dashboard: Not created yet

---

## 💡 Notes

- All referral codes are automatically generated on registration
- VIP levels upgrade automatically when thresholds are met
- Commissions are paid instantly on package purchase
- Balance updates immediately in user account
- Existing users already have `referral_code` from old schema
