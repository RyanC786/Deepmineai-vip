export const adminReportsPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Reports - DeepMine AI Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        .nav-container {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(41, 121, 255, 0.2);
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo { 
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px; 
            font-weight: 700; 
            color: #33F0FF;
        }
        .logo img {
            height: 40px;
            width: auto;
            filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
        }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a {
            color: #E0E7FF;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.3s;
        }
        .nav-links a:hover, .nav-links a.active {
            background: rgba(41, 121, 255, 0.1);
            color: #33F0FF;
        }
        .main-content {
            max-width: 1600px;
            margin: 40px auto;
            padding: 0 24px;
        }
        .page-header {
            margin-bottom: 32px;
        }
        .page-header h1 {
            font-size: 32px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #33F0FF, #2979FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        .stat-card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 12px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #33F0FF, #2979FF);
        }
        .stat-icon {
            font-size: 36px;
            color: #33F0FF;
            margin-bottom: 16px;
        }
        .stat-label { color: #B0B8D4; font-size: 14px; margin-bottom: 8px; }
        .stat-value { font-size: 32px; font-weight: 700; color: #33F0FF; }
        .stat-trend {
            font-size: 14px;
            margin-top: 8px;
        }
        .trend-up { color: #22C55E; }
        .trend-down { color: #EF4444; }
        .card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(41, 121, 255, 0.1);
        }
        .card-title {
            font-size: 20px;
            font-weight: 700;
            color: #E0E7FF;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
            gap: 24px;
        }
        .table-container { overflow-x: auto; }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid rgba(41, 121, 255, 0.1);
        }
        th {
            color: #B0B8D4;
            font-weight: 600;
            font-size: 13px;
        }
        .badge {
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-success { background: rgba(34, 197, 94, 0.1); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3); }
        .badge-warning { background: rgba(251, 191, 36, 0.1); color: #FBBF24; border: 1px solid rgba(251, 191, 36, 0.3); }
        .badge-danger { background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); }
        .badge-info { background: rgba(41, 121, 255, 0.1); color: #2979FF; border: 1px solid rgba(41, 121, 255, 0.3); }
        .logout-btn {
            padding: 8px 16px;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            color: #EF4444;
            text-decoration: none;
            transition: all 0.3s;
        }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.3); }
        .refresh-btn {
            padding: 8px 16px;
            background: rgba(41, 121, 255, 0.2);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 8px;
            color: #2979FF;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        .refresh-btn:hover { background: rgba(41, 121, 255, 0.3); }
        .chart-placeholder {
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(41, 121, 255, 0.05);
            border-radius: 8px;
            color: #B0B8D4;
        }
    </style>
</head>
<body>
    <nav class="nav-container">
        <div class="logo">
            <!-- Logo placeholder -->
            <span>DeepMine AI Admin</span>
        </div>
        <div class="nav-links">
            <a href="/admin/dashboard"><i class="fas fa-chart-line"></i> Dashboard</a>
            <a href="/admin/users"><i class="fas fa-users"></i> Users</a>
            <a href="/admin/kyc"><i class="fas fa-id-card"></i> KYC</a>
            <a href="/admin/machines"><i class="fas fa-server"></i> Machines</a>
            <a href="/admin/withdrawals"><i class="fas fa-money-bill-wave"></i> Withdrawals</a>
            <a href="/admin/deposits"><i class="fas fa-wallet"></i> Deposits</a>
            <a href="/admin/referrals"><i class="fas fa-users-cog"></i> Referrals</a>
            <a href="/admin/reports" class="active"><i class="fas fa-chart-bar"></i> Reports</a>
            <a href="/admin/crm/dashboard" style="background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.5);"><i class="fas fa-headset"></i> CRM</a>
            <button id="logoutBtn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #F87171; cursor: pointer; padding: 8px 16px; border-radius: 8px; transition: all 0.3s;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    </nav>

    <div class="main-content">
        <div class="page-header">
            <h1><i class="fas fa-chart-bar"></i> Financial Reports & Analytics</h1>
            <p style="color: #B0B8D4;">Comprehensive platform financial overview</p>
        </div>

        <!-- Key Metrics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value" id="totalRevenue">$0</div>
                <div class="stat-trend trend-up" id="revenueTrend">
                    <i class="fas fa-arrow-up"></i> +0% this month
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-wallet"></i></div>
                <div class="stat-label">Deposits (ETH)</div>
                <div class="stat-value" id="totalDeposits">0</div>
                <div class="stat-trend" id="depositTrend">
                    <i class="fas fa-info-circle"></i> All time
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
                <div class="stat-label">Withdrawals (USDT)</div>
                <div class="stat-value" id="totalWithdrawals">$0</div>
                <div class="stat-trend" id="withdrawalTrend">
                    <i class="fas fa-info-circle"></i> Completed
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-server"></i></div>
                <div class="stat-label">Machines Sold</div>
                <div class="stat-value" id="machinesSold">0</div>
                <div class="stat-trend" id="machinesTrend">
                    <i class="fas fa-cog"></i> Active mining
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-label">Active Users</div>
                <div class="stat-value" id="activeUsers">0</div>
                <div class="stat-trend" id="usersTrend">
                    <i class="fas fa-user-check"></i> KYC approved
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                <div class="stat-label">Platform Balance</div>
                <div class="stat-value" id="platformBalance">$0</div>
                <div class="stat-trend" id="balanceTrend">
                    <i class="fas fa-piggy-bank"></i> User funds
                </div>
            </div>
        </div>

        <!-- Recent Activity Grid -->
        <div class="grid-2">
            <!-- Recent Deposits -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-wallet"></i> Recent Deposits (Last 5)</h3>
                    <button class="refresh-btn" onclick="loadReports()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="recentDepositsTable">
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 20px; color: #B0B8D4;">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Withdrawals -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-money-bill-wave"></i> Recent Withdrawals (Last 5)</h3>
                    <button class="refresh-btn" onclick="loadReports()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="recentWithdrawalsTable">
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 20px; color: #B0B8D4;">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Machine Sales & User Activity -->
        <div class="grid-2">
            <!-- Top Machines -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-trophy"></i> Top Selling Machines</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Machine</th>
                                <th>Sales</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody id="topMachinesTable">
                            <tr>
                                <td colspan="3" style="text-align: center; padding: 20px; color: #B0B8D4;">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Top Users -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-star"></i> Top Users by Balance</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Balance</th>
                                <th>Machines</th>
                            </tr>
                        </thead>
                        <tbody id="topUsersTable">
                            <tr>
                                <td colspan="3" style="text-align: center; padding: 20px; color: #B0B8D4;">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;

        // Check if admin_token cookie exists
        function checkAuthCookie() {
            const hasAdminToken = document.cookie.split(';').some(c => c.trim().startsWith('admin_token='));
            console.log('════════════════════════════════════════');
            console.log('[REPORTS] COOKIE CHECK START');
            console.log('[REPORTS] Admin token cookie exists:', hasAdminToken);
            console.log('[REPORTS] All cookies:', document.cookie);
            console.log('[REPORTS] Cookie count:', document.cookie.split(';').length);
            console.log('════════════════════════════════════════');
            
            if (!hasAdminToken) {
                console.error('❌❌❌ [REPORTS] NO ADMIN TOKEN FOUND! ❌❌❌');
                console.error('[REPORTS] Waiting 5 seconds before redirect...');
                alert('No admin_token cookie found! Check console. Redirecting in 5 seconds...');
                setTimeout(() => {
                    window.location.href = '/admin/panel/login';
                }, 5000);
                return false;
            }
            console.log('✅ [REPORTS] Cookie check passed!');
            return true;
        }

        async function loadReports() {
            if (!checkAuthCookie()) {
                return; // Exit if not authenticated
            }
            
            try {
                console.log('[REPORTS] Loading reports from APIs...');
                console.log('[REPORTS] Request config: { withCredentials: true }');
                // Load all data in parallel
                const [deposits, withdrawals, machines, users] = await Promise.all([
                    axios.get('/api/deposits/admin/list', { withCredentials: true }),
                    axios.get('/api/admin/withdrawals/list', { withCredentials: true }),
                    axios.get('/api/admin/machines/list', { withCredentials: true }),
                    axios.get('/api/admin/users', { withCredentials: true })
                ]);

                // Update key metrics
                updateMetrics(deposits.data, withdrawals.data, machines.data, users.data);

                // Update tables
                updateDepositsTable(deposits.data.deposits?.slice(0, 5) || []);
                updateWithdrawalsTable(withdrawals.data.withdrawals?.slice(0, 5) || []);
                updateMachinesTable(machines.data.machines || []);
                updateUsersTable(users.data.users || []);

            } catch (error) {
                console.error('════════════════════════════════════════');
                console.error('❌ [REPORTS] API CALLS FAILED!');
                console.error('[REPORTS] Error object:', error);
                console.error('[REPORTS] Error response:', error.response);
                console.error('[REPORTS] Error status:', error.response?.status);
                console.error('[REPORTS] Error message:', error.message);
                console.error('════════════════════════════════════════');
                
                if (error.response?.status === 401) {
                    alert('401 Unauthorized! Check console. Redirecting in 5 seconds...');
                    setTimeout(() => window.location.href = '/admin/panel/login', 5000);
                }
            }
        }

        function updateMetrics(deposits, withdrawals, machines, users) {
            // Total Deposits (converted to USD)
            const ethPrice = 3247; // Current ETH price (update as needed)
            let totalDepositsUSD = 0;
            let totalDepositsETH = 0;
            let totalDepositsStablecoin = 0;
            
            deposits.deposits?.filter(d => d.status === 'approved').forEach(d => {
                const amount = d.amount || 0;
                const currency = (d.currency || 'ETH').toUpperCase();
                
                if (currency === 'ETH') {
                    totalDepositsETH += amount;
                    totalDepositsUSD += amount * ethPrice;
                } else if (currency === 'USDT' || currency === 'USDC') {
                    // Stablecoins are 1:1 with USD
                    totalDepositsStablecoin += amount;
                    totalDepositsUSD += amount;
                } else if (currency === 'BTC') {
                    // BTC price approximation (update as needed)
                    const btcPrice = 95000;
                    totalDepositsUSD += amount * btcPrice;
                }
            });
            
            // Display total deposits in USD
            document.getElementById('totalDeposits').textContent = '$' + totalDepositsUSD.toFixed(2) + 
                ' (' + totalDepositsETH.toFixed(4) + ' ETH + $' + totalDepositsStablecoin.toFixed(2) + ' USDT/USDC)';

            // Total Withdrawals
            const totalWithdrawalsUSDT = withdrawals.withdrawals?.filter(w => w.status === 'completed')
                .reduce((sum, w) => sum + (w.amount || 0), 0) || 0;
            document.getElementById('totalWithdrawals').textContent = '$' + totalWithdrawalsUSDT.toFixed(2);

            // Revenue = Total Deposits (converted to USD)
            document.getElementById('totalRevenue').textContent = '$' + totalDepositsUSD.toFixed(2);

            // Machines Sold
            const machinesSold = machines.machines?.filter(m => m.status === 'active' || m.status === 'pending').length || 0;
            document.getElementById('machinesSold').textContent = machinesSold;

            // Active Users (KYC approved)
            const activeUsers = users.users?.filter(u => u.kyc_status === 'approved').length || 0;
            document.getElementById('activeUsers').textContent = activeUsers;

            // Platform Balance
            const platformBalance = users.users?.reduce((sum, u) => sum + (u.balance || 0), 0) || 0;
            document.getElementById('platformBalance').textContent = '$' + platformBalance.toFixed(2);
        }

        function updateDepositsTable(deposits) {
            const tbody = document.getElementById('recentDepositsTable');
            
            if (!deposits || deposits.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #B0B8D4;">No recent deposits</td></tr>';
                return;
            }

            tbody.innerHTML = deposits.map(d => {
                const statusClass = d.status === 'approved' ? 'badge-success' : 
                                   d.status === 'rejected' ? 'badge-danger' : 'badge-warning';
                const currency = d.currency || 'ETH';
                const displayAmount = currency === 'USDT' || currency === 'USDC' ? 
                    '$' + d.amount : d.amount + ' ' + currency;
                return \`
                    <tr>
                        <td><small>\${d.user_email || d.user_name || 'N/A'}</small></td>
                        <td><strong>\${displayAmount}</strong></td>
                        <td><span class="badge \${statusClass}">\${d.status}</span></td>
                        <td><small>\${new Date(d.created_at).toLocaleDateString()}</small></td>
                    </tr>
                \`;
            }).join('');
        }

        function updateWithdrawalsTable(withdrawals) {
            const tbody = document.getElementById('recentWithdrawalsTable');
            
            if (!withdrawals || withdrawals.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #B0B8D4;">No recent withdrawals</td></tr>';
                return;
            }

            tbody.innerHTML = withdrawals.map(w => {
                const statusClass = w.status === 'completed' ? 'badge-success' : 
                                   w.status === 'rejected' ? 'badge-danger' : 'badge-warning';
                return \`
                    <tr>
                        <td><small>\${w.email || w.full_name || 'N/A'}</small></td>
                        <td><strong>$\${w.amount?.toFixed(2) || '0.00'}</strong></td>
                        <td><span class="badge \${statusClass}">\${w.status}</span></td>
                        <td><small>\${new Date(w.created_at).toLocaleDateString()}</small></td>
                    </tr>
                \`;
            }).join('');
        }

        function updateMachinesTable(machines) {
            const tbody = document.getElementById('topMachinesTable');
            
            if (!machines || machines.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #B0B8D4;">No machines data</td></tr>';
                return;
            }

            // Group by machine package
            const packageStats = {};
            machines.forEach(m => {
                const pkg = m.package_name || 'Unknown';
                if (!packageStats[pkg]) {
                    packageStats[pkg] = { count: 0, revenue: 0 };
                }
                packageStats[pkg].count++;
                packageStats[pkg].revenue += m.investment || 0;
            });

            const sorted = Object.entries(packageStats)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5);

            tbody.innerHTML = sorted.map(([name, stats]) => \`
                <tr>
                    <td><strong>\${name}</strong></td>
                    <td>\${stats.count} units</td>
                    <td><strong>$\${stats.revenue.toFixed(2)}</strong></td>
                </tr>
            \`).join('');
        }

        function updateUsersTable(users) {
            const tbody = document.getElementById('topUsersTable');
            
            if (!users || users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #B0B8D4;">No users data</td></tr>';
                return;
            }

            const sorted = users
                .sort((a, b) => (b.balance || 0) - (a.balance || 0))
                .slice(0, 5);

            tbody.innerHTML = sorted.map(u => \`
                <tr>
                    <td><small>\${u.email}</small></td>
                    <td><strong>$\${(u.balance || 0).toFixed(2)}</strong></td>
                    <td>\${u.active_miners || 0}</td>
                </tr>
            \`).join('');
        }

        async function logout() {
            if (!confirm('Are you sure you want to logout?')) return;
            
            try {
                await axios.post('/api/admin/auth/logout');
                window.location.href = '/admin/panel/login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/admin/panel/login';
            }
        }

        // Load reports on page load
        loadReports();

        // Auto-refresh every 60 seconds
        setInterval(loadReports, 60000);
    </script>
</body>
</html>
`
