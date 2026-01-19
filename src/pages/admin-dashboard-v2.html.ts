/**
 * DeepMine AI - Enhanced Admin Dashboard v2
 * Comprehensive dashboard with stats, charts, and quick actions
 */

export const adminDashboardV2HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - DeepMine AI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #3B82F6;
            --primary-dark: #2563EB;
            --success: #10B981;
            --warning: #F59E0B;
            --danger: #EF4444;
            --info: #06B6D4;
            --purple: #8B5CF6;
            --dark-bg: #0B0F1E;
            --dark-card: #1A1F35;
            --dark-hover: #252B45;
            --text-primary: #E0E7FF;
            --text-secondary: #9CA3AF;
            --border-color: rgba(59, 130, 246, 0.2);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--dark-bg);
            color: var(--text-primary);
            min-height: 100vh;
        }

        /* ===== LAYOUT ===== */
        .admin-container {
            display: flex;
            min-height: 100vh;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
            width: 260px;
            background: var(--dark-card);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 1000;
            transition: transform 0.3s ease;
        }

        .sidebar-header {
            padding: 24px 20px;
            border-bottom: 1px solid var(--border-color);
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .logo-text h1 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 2px;
        }

        .logo-text p {
            font-size: 11px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .nav-menu {
            flex: 1;
            overflow-y: auto;
            padding: 20px 0;
        }

        .nav-section-title {
            padding: 0 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-secondary);
            margin: 20px 0 10px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.2s ease;
            position: relative;
        }

        .nav-item:hover {
            background: var(--dark-hover);
            color: var(--text-primary);
        }

        .nav-item.active {
            background: rgba(59, 130, 246, 0.1);
            color: var(--primary);
            border-left: 3px solid var(--primary);
        }

        .nav-item i {
            width: 20px;
            font-size: 16px;
        }

        .nav-item-badge {
            margin-left: auto;
            background: var(--danger);
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 600;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
            flex: 1;
            margin-left: 260px;
            min-height: 100vh;
        }

        .topbar {
            background: var(--dark-card);
            border-bottom: 1px solid var(--border-color);
            padding: 16px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .topbar-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .menu-toggle {
            display: none;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 20px;
            cursor: pointer;
        }

        .page-title {
            font-size: 24px;
            font-weight: 700;
        }

        .topbar-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .topbar-icon {
            width: 40px;
            height: 40px;
            background: var(--dark-hover);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .topbar-icon:hover {
            background: var(--primary);
            transform: translateY(-2px);
        }

        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--danger);
            color: white;
            font-size: 10px;
            padding: 2px 5px;
            border-radius: 10px;
            font-weight: 600;
        }

        /* ===== CONTENT ===== */
        .content {
            padding: 30px;
        }

        .loading {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        }

        .loading i {
            font-size: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* ===== STATS GRID ===== */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--info));
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }

        .stat-card:hover::before {
            opacity: 1;
        }

        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }

        .stat-title {
            font-size: 13px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .stat-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
        .stat-icon.green { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .stat-icon.yellow { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .stat-icon.red { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.1); color: var(--purple); }
        .stat-icon.cyan { background: rgba(6, 182, 212, 0.1); color: var(--info); }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .stat-footer {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
        }

        .stat-change {
            display: flex;
            align-items: center;
            gap: 3px;
            font-weight: 600;
        }

        .stat-change.positive { color: var(--success); }
        .stat-change.negative { color: var(--danger); }

        /* ===== SECTION CARDS ===== */
        .section-card {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            margin-bottom: 25px;
            overflow: hidden;
        }

        .section-header {
            padding: 20px 25px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 700;
        }

        .section-title i {
            color: var(--primary);
        }

        .section-actions {
            display: flex;
            gap: 10px;
        }

        .section-content {
            padding: 25px;
        }

        /* ===== CHARTS ===== */
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .chart-container {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
        }

        .chart-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--text-primary);
        }

        #userGrowthChart,
        #revenueChart {
            max-height: 300px;
        }

        /* ===== QUICK ACTIONS ===== */
        .quick-actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .quick-action-card {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            overflow: hidden;
        }

        .quick-action-header {
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .quick-action-title {
            font-size: 14px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .quick-action-count {
            background: var(--danger);
            color: white;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 10px;
            font-weight: 600;
        }

        .quick-action-list {
            max-height: 300px;
            overflow-y: auto;
        }

        .quick-action-item {
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
            transition: background 0.2s ease;
            cursor: pointer;
        }

        .quick-action-item:last-child {
            border-bottom: none;
        }

        .quick-action-item:hover {
            background: var(--dark-hover);
        }

        .quick-action-item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .quick-action-item-name {
            font-weight: 600;
            font-size: 14px;
        }

        .quick-action-item-time {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .quick-action-item-desc {
            font-size: 13px;
            color: var(--text-secondary);
        }

        .quick-action-empty {
            padding: 30px 20px;
            text-align: center;
            color: var(--text-secondary);
        }

        /* ===== ACTIVITY FEED ===== */
        .activity-item {
            display: flex;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .activity-item:last-child {
            border-bottom: none;
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .activity-content {
            flex: 1;
        }

        .activity-title {
            font-weight: 600;
            margin-bottom: 3px;
        }

        .activity-desc {
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 5px;
        }

        .activity-time {
            font-size: 12px;
            color: var(--text-secondary);
        }

        /* ===== BUTTONS ===== */
        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: var(--dark-hover);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background: var(--border-color);
        }

        .btn-success {
            background: var(--success);
            color: white;
        }

        .btn-success:hover {
            background: #059669;
        }

        .btn-sm {
            padding: 6px 12px;
            font-size: 12px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .sidebar.mobile-visible {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .menu-toggle {
                display: block;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .charts-grid {
                grid-template-columns: 1fr;
            }

            .quick-actions-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo-section">
                    <div class="logo-icon">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="logo-text">
                        <h1>DeepMine AI</h1>
                        <p>Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav class="nav-menu">
                <div class="nav-section-title">Main</div>
                <a href="/admin/dashboard" class="nav-item active">
                    <i class="fas fa-chart-line"></i>
                    <span>Dashboard</span>
                </a>
                <a href="/admin/users" class="nav-item">
                    <i class="fas fa-users"></i>
                    <span>Users</span>
                </a>
                <a href="/admin/kyc" class="nav-item">
                    <i class="fas fa-id-card"></i>
                    <span>KYC Requests</span>
                    <span class="nav-item-badge" id="kyc-badge">0</span>
                </a>

                <div class="nav-section-title">Operations</div>
                <a href="/admin/machines" class="nav-item">
                    <i class="fas fa-server"></i>
                    <span>Mining Machines</span>
                </a>
                <a href="/admin/withdrawals" class="nav-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>Withdrawals</span>
                    <span class="nav-item-badge" id="withdrawals-badge">0</span>
                </a>
                <a href="/admin/deposits" class="nav-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span>Deposits</span>
                </a>
                <a href="/admin/referrals" class="nav-item">
                    <i class="fas fa-users-cog"></i>
                    <span>Referrals</span>
                    <span class="nav-item-badge" id="referrals-badge">0</span>
                </a>

                <div class="nav-section-title">Analytics</div>
                <a href="/admin/reports" class="nav-item">
                    <i class="fas fa-file-alt"></i>
                    <span>Reports</span>
                </a>
                <a href="/admin/analytics" class="nav-item">
                    <i class="fas fa-chart-bar"></i>
                    <span>Analytics</span>
                </a>

                <div class="nav-section-title">CRM</div>
                <a href="/admin/crm/dashboard" class="nav-item">
                    <i class="fas fa-headset"></i>
                    <span>CRM Dashboard</span>
                </a>

                <div class="nav-section-title">Settings</div>
                <a href="/admin/settings" class="nav-item">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar -->
            <div class="topbar">
                <div class="topbar-left">
                    <button class="menu-toggle" onclick="toggleSidebar()">
                        <i class="fas fa-bars"></i>
                    </button>
                    <h1 class="page-title">Dashboard</h1>
                </div>
                <div class="topbar-right">
                    <div class="topbar-icon" onclick="refreshDashboard()">
                        <i class="fas fa-sync-alt"></i>
                    </div>
                    <div class="topbar-icon" onclick="window.location.href='/admin/notifications'">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge" id="notif-badge">0</span>
                    </div>
                    <div class="topbar-icon" onclick="window.location.href='/admin/profile'">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="content">
                <!-- Loading State -->
                <div class="loading" id="loadingState">
                    <i class="fas fa-spinner"></i>
                    <p>Loading dashboard...</p>
                </div>

                <!-- Dashboard Content -->
                <div id="dashboardContent" style="display: none;">
                    <!-- Stats Grid -->
                    <div class="stats-grid" id="statsGrid">
                        <!-- Stats will be injected here -->
                    </div>

                    <!-- Charts -->
                    <div class="charts-grid">
                        <div class="chart-container">
                            <h3 class="chart-title">User Growth (Last 7 Days)</h3>
                            <canvas id="userGrowthChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3 class="chart-title">Revenue Breakdown</h3>
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="quick-actions-grid">
                        <!-- Pending KYC -->
                        <div class="quick-action-card">
                            <div class="quick-action-header">
                                <div class="quick-action-title">
                                    <i class="fas fa-id-card" style="color: var(--warning);"></i>
                                    Pending KYC
                                </div>
                                <span class="quick-action-count" id="kycCount">0</span>
                            </div>
                            <div class="quick-action-list" id="pendingKYCList">
                                <!-- Items will be injected here -->
                            </div>
                        </div>

                        <!-- Pending Withdrawals -->
                        <div class="quick-action-card">
                            <div class="quick-action-header">
                                <div class="quick-action-title">
                                    <i class="fas fa-money-bill-wave" style="color: var(--success);"></i>
                                    Pending Withdrawals
                                </div>
                                <span class="quick-action-count" id="withdrawalsCount">0</span>
                            </div>
                            <div class="quick-action-list" id="pendingWithdrawalsList">
                                <!-- Items will be injected here -->
                            </div>
                        </div>

                        <!-- Pending Payouts -->
                        <div class="quick-action-card">
                            <div class="quick-action-header">
                                <div class="quick-action-title">
                                    <i class="fas fa-wallet" style="color: var(--purple);"></i>
                                    Pending Payouts
                                </div>
                                <span class="quick-action-count" id="payoutsCount">0</span>
                            </div>
                            <div class="quick-action-list" id="pendingPayoutsList">
                                <!-- Items will be injected here -->
                            </div>
                        </div>

                        <!-- Recent Signups -->
                        <div class="quick-action-card">
                            <div class="quick-action-header">
                                <div class="quick-action-title">
                                    <i class="fas fa-user-plus" style="color: var(--info);"></i>
                                    Recent Signups (24h)
                                </div>
                                <span class="quick-action-count" id="signupsCount">0</span>
                            </div>
                            <div class="quick-action-list" id="recentSignupsList">
                                <!-- Items will be injected here -->
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="section-card">
                        <div class="section-header">
                            <div class="section-title">
                                <i class="fas fa-history"></i>
                                Recent Activity
                            </div>
                            <div class="section-actions">
                                <button class="btn btn-secondary btn-sm" onclick="window.location.href='/admin/activity'">
                                    View All
                                </button>
                            </div>
                        </div>
                        <div class="section-content">
                            <div id="activityFeed">
                                <!-- Activity will be injected here -->
                            </div>
                        </div>
                    </div>

                    <!-- Top Referrers -->
                    <div class="section-card">
                        <div class="section-header">
                            <div class="section-title">
                                <i class="fas fa-trophy"></i>
                                Top Referrers
                            </div>
                            <div class="section-actions">
                                <button class="btn btn-secondary btn-sm" onclick="window.location.href='/admin/referrals'">
                                    View All
                                </button>
                            </div>
                        </div>
                        <div class="section-content">
                            <div id="topReferrers">
                                <!-- Top referrers will be injected here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;

        // State
        let dashboardData = null;
        let userGrowthChart = null;
        let revenueChart = null;

        // Toggle sidebar
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('mobile-visible');
        }

        // Format number with commas
        function formatNumber(num) {
            return num?.toLocaleString() || '0';
        }

        // Format currency
        function formatCurrency(amount) {
            return '$' + (amount || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        // Format time ago
        function timeAgo(date) {
            const seconds = Math.floor((new Date() - new Date(date)) / 1000);
            if (seconds < 60) return 'Just now';
            if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
            if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
            return Math.floor(seconds / 86400) + 'd ago';
        }

        // Load dashboard data
        async function loadDashboard() {
            try {
                // Load stats
                const statsRes = await axios.get('/api/admin/stats');
                if (statsRes.data.success) {
                    dashboardData = statsRes.data.stats;
                    displayStats(dashboardData);
                    displayCharts(dashboardData);
                }

                // Load quick actions
                const actionsRes = await axios.get('/api/admin/quick-actions');
                if (actionsRes.data.success) {
                    displayQuickActions(actionsRes.data.data);
                }

                // Load recent activity
                const activityRes = await axios.get('/api/admin/recent-activity?limit=10');
                if (activityRes.data.success) {
                    displayActivity(activityRes.data.activities);
                }

                // Show content
                document.getElementById('loadingState').style.display = 'none';
                document.getElementById('dashboardContent').style.display = 'block';
            } catch (error) {
                console.error('Error loading dashboard:', error);
                alert('Failed to load dashboard data');
            }
        }

        // Display stats cards
        function displayStats(stats) {
            const statsHTML = \`
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Total Users</div>
                        <div class="stat-icon blue">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatNumber(stats.total_users)}</div>
                    <div class="stat-footer">
                        <span class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +\${formatNumber(stats.new_users_30d)}
                        </span>
                        <span class="stat-label">in last 30 days</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Verified Users</div>
                        <div class="stat-icon green">
                            <i class="fas fa-id-card"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatNumber(stats.verified_users)}</div>
                    <div class="stat-footer">
                        <span class="stat-change">
                            <i class="fas fa-clock"></i>
                            \${formatNumber(stats.pending_kyc)} pending
                        </span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Active Miners</div>
                        <div class="stat-icon purple">
                            <i class="fas fa-server"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatNumber(stats.active_miners)}</div>
                    <div class="stat-footer">
                        <span class="stat-label">Currently mining</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Total Balance</div>
                        <div class="stat-icon yellow">
                            <i class="fas fa-wallet"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatCurrency(stats.total_wallet_balance)}</div>
                    <div class="stat-footer">
                        <span class="stat-label">User wallet balances</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Pending Withdrawals</div>
                        <div class="stat-icon red">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatNumber(stats.pending_withdrawals)}</div>
                    <div class="stat-footer">
                        <span class="stat-label">Awaiting approval</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Total Withdrawn</div>
                        <div class="stat-icon cyan">
                            <i class="fas fa-hand-holding-usd"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatCurrency(stats.total_withdrawn)}</div>
                    <div class="stat-footer">
                        <span class="stat-label">All-time</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Commission Earned</div>
                        <div class="stat-icon green">
                            <i class="fas fa-chart-line"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatCurrency(stats.total_commission_amount)}</div>
                    <div class="stat-footer">
                        <span class="stat-label">\${formatNumber(stats.total_commissions)} transactions</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">Package Revenue</div>
                        <div class="stat-icon purple">
                            <i class="fas fa-box"></i>
                        </div>
                    </div>
                    <div class="stat-value">\${formatCurrency(stats.total_package_revenue)}</div>
                    <div class="stat-footer">
                        <span class="stat-label">Total sales</span>
                    </div>
                </div>
            \`;

            document.getElementById('statsGrid').innerHTML = statsHTML;

            // Update badges
            document.getElementById('kyc-badge').textContent = stats.pending_kyc || '0';
            document.getElementById('withdrawals-badge').textContent = stats.pending_withdrawals || '0';
            document.getElementById('referrals-badge').textContent = stats.pending_commission_payouts || '0';
        }

        // Display charts
        function displayCharts(stats) {
            // User Growth Chart
            const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
            const userGrowthData = stats.user_growth || [];
            
            if (userGrowthChart) userGrowthChart.destroy();
            
            userGrowthChart = new Chart(userGrowthCtx, {
                type: 'line',
                data: {
                    labels: userGrowthData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                    datasets: [{
                        label: 'New Users',
                        data: userGrowthData.map(d => d.count),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#9CA3AF',
                                stepSize: 1
                            },
                            grid: {
                                color: 'rgba(59, 130, 246, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#9CA3AF'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            const revenueData = stats.mining_revenue || [];
            
            if (revenueChart) revenueChart.destroy();
            
            revenueChart = new Chart(revenueCtx, {
                type: 'doughnut',
                data: {
                    labels: revenueData.map(r => r.package_name),
                    datasets: [{
                        data: revenueData.map(r => r.revenue),
                        backgroundColor: [
                            '#3B82F6',
                            '#10B981',
                            '#F59E0B',
                            '#EF4444',
                            '#8B5CF6',
                            '#06B6D4'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#E0E7FF',
                                padding: 15
                            }
                        }
                    }
                }
            });

            // Display top referrers
            if (stats.top_referrers && stats.top_referrers.length > 0) {
                const referrersHTML = stats.top_referrers.map((ref, index) => \`
                    <div class="activity-item">
                        <div class="activity-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">
                            <span style="font-weight: 700;">#\${index + 1}</span>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">\${ref.full_name || 'User ' + ref.id}</div>
                            <div class="activity-desc">\${ref.email}</div>
                            <div class="activity-time">
                                \${ref.total_referrals} referrals • \${formatCurrency(ref.total_referral_earnings)} earned
                            </div>
                        </div>
                    </div>
                \`).join('');
                document.getElementById('topReferrers').innerHTML = referrersHTML;
            } else {
                document.getElementById('topReferrers').innerHTML = '<div class="quick-action-empty">No referrers yet</div>';
            }
        }

        // Display quick actions
        function displayQuickActions(data) {
            // Pending KYC
            document.getElementById('kycCount').textContent = data.pending_kyc.length;
            if (data.pending_kyc.length > 0) {
                const kycHTML = data.pending_kyc.map(user => \`
                    <div class="quick-action-item" onclick="window.location.href='/admin/kyc'">
                        <div class="quick-action-item-header">
                            <div class="quick-action-item-name">\${user.full_name || 'User ' + user.id}</div>
                            <div class="quick-action-item-time">\${timeAgo(user.created_at)}</div>
                        </div>
                        <div class="quick-action-item-desc">\${user.email}</div>
                    </div>
                \`).join('');
                document.getElementById('pendingKYCList').innerHTML = kycHTML;
            } else {
                document.getElementById('pendingKYCList').innerHTML = '<div class="quick-action-empty">No pending KYC requests</div>';
            }

            // Pending Withdrawals
            document.getElementById('withdrawalsCount').textContent = data.pending_withdrawals.length;
            if (data.pending_withdrawals.length > 0) {
                const withdrawalsHTML = data.pending_withdrawals.map(w => \`
                    <div class="quick-action-item" onclick="window.location.href='/admin/withdrawals'">
                        <div class="quick-action-item-header">
                            <div class="quick-action-item-name">\${w.full_name || 'User ' + w.user_id}</div>
                            <div class="quick-action-item-time">\${timeAgo(w.created_at)}</div>
                        </div>
                        <div class="quick-action-item-desc">\${formatCurrency(w.amount)}</div>
                    </div>
                \`).join('');
                document.getElementById('pendingWithdrawalsList').innerHTML = withdrawalsHTML;
            } else {
                document.getElementById('pendingWithdrawalsList').innerHTML = '<div class="quick-action-empty">No pending withdrawals</div>';
            }

            // Pending Payouts
            document.getElementById('payoutsCount').textContent = data.pending_payouts.length;
            if (data.pending_payouts.length > 0) {
                const payoutsHTML = data.pending_payouts.map(p => \`
                    <div class="quick-action-item" onclick="window.location.href='/admin/referrals'">
                        <div class="quick-action-item-header">
                            <div class="quick-action-item-name">\${p.full_name || 'User ' + p.user_id}</div>
                            <div class="quick-action-item-time">\${timeAgo(p.created_at)}</div>
                        </div>
                        <div class="quick-action-item-desc">\${formatCurrency(p.amount)}</div>
                    </div>
                \`).join('');
                document.getElementById('pendingPayoutsList').innerHTML = payoutsHTML;
            } else {
                document.getElementById('pendingPayoutsList').innerHTML = '<div class="quick-action-empty">No pending payouts</div>';
            }

            // Recent Signups
            document.getElementById('signupsCount').textContent = data.recent_signups.length;
            if (data.recent_signups.length > 0) {
                const signupsHTML = data.recent_signups.map(user => \`
                    <div class="quick-action-item" onclick="window.location.href='/admin/users'">
                        <div class="quick-action-item-header">
                            <div class="quick-action-item-name">\${user.full_name || 'User ' + user.id}</div>
                            <div class="quick-action-item-time">\${timeAgo(user.created_at)}</div>
                        </div>
                        <div class="quick-action-item-desc">\${user.email}</div>
                    </div>
                \`).join('');
                document.getElementById('recentSignupsList').innerHTML = signupsHTML;
            } else {
                document.getElementById('recentSignupsList').innerHTML = '<div class="quick-action-empty">No recent signups</div>';
            }
        }

        // Display activity
        function displayActivity(activities) {
            if (activities.length === 0) {
                document.getElementById('activityFeed').innerHTML = '<div class="quick-action-empty">No recent activity</div>';
                return;
            }

            const activityHTML = activities.map(activity => {
                let iconClass = 'fa-circle';
                let iconColor = 'var(--info)';
                
                if (activity.type === 'user_signup') {
                    iconClass = 'fa-user-plus';
                    iconColor = 'var(--success)';
                } else if (activity.type === 'miner_purchase') {
                    iconClass = 'fa-server';
                    iconColor = 'var(--primary)';
                } else if (activity.type === 'withdrawal') {
                    iconClass = 'fa-money-bill-wave';
                    iconColor = 'var(--warning)';
                }

                return \`
                    <div class="activity-item">
                        <div class="activity-icon" style="background: \${iconColor}20; color: \${iconColor};">
                            <i class="fas \${iconClass}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">\${activity.title || 'Activity'}</div>
                            <div class="activity-desc">\${activity.description || ''}</div>
                            <div class="activity-time">\${timeAgo(activity.created_at)}</div>
                        </div>
                    </div>
                \`;
            }).join('');

            document.getElementById('activityFeed').innerHTML = activityHTML;
        }

        // Refresh dashboard
        async function refreshDashboard() {
            document.getElementById('loadingState').style.display = 'block';
            document.getElementById('dashboardContent').style.display = 'none';
            await loadDashboard();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadDashboard();
        });
    </script>
</body>
</html>
`;
