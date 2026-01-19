/**
 * DeepMine AI - Admin CRM Dashboard
 * Comprehensive admin interface for managing users, KYC, tasks, and analytics
 */

import { CRM_SIDEBAR_PERMISSION_SCRIPT } from '../components/crm-sidebar-permissions';

export const adminCRMDashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM Dashboard - DeepMine AI Admin</title>
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
            --primary-bg: #0B0F1E;
            --secondary-bg: #1A1F35;
            --card-bg: #252B45;
            --border-color: rgba(41, 121, 255, 0.2);
            --text-primary: #FFFFFF;
            --text-secondary: #B0B8D4;
            --text-muted: #7C8198;
            --primary-blue: #2979FF;
            --aqua-glow: #33F0FF;
            --success-green: #00E396;
            --warning-yellow: #FEB019;
            --danger-red: #FF4560;
            --sidebar-width: 280px;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--primary-bg);
            color: var(--text-primary);
            overflow-x: hidden;
        }

        /* Sidebar Navigation */
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: var(--sidebar-width);
            height: 100vh;
            background: var(--secondary-bg);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            z-index: 1000;
            transition: transform 0.3s ease;
        }

        .sidebar-header {
            padding: 24px 20px;
            border-bottom: 1px solid var(--border-color);
        }

        .sidebar-logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-logo img {
            height: 40px;
            width: auto;
        }

        .sidebar-logo-text {
            font-size: 18px;
            font-weight: 700;
            background: linear-gradient(135deg, var(--aqua-glow), var(--primary-blue));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
            flex: 1;
            padding: 20px 0;
            overflow-y: auto;
        }

        .nav-section {
            margin-bottom: 24px;
        }

        .nav-section-title {
            padding: 8px 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
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
            background: rgba(41, 121, 255, 0.1);
            color: var(--aqua-glow);
        }

        .nav-item.active {
            background: rgba(41, 121, 255, 0.15);
            color: var(--aqua-glow);
            font-weight: 500;
        }

        .nav-item.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: var(--aqua-glow);
        }

        .nav-item i {
            width: 20px;
            text-align: center;
            font-size: 16px;
        }

        .nav-badge {
            margin-left: auto;
            background: var(--danger-red);
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 12px;
        }

        .sidebar-footer {
            padding: 20px;
            border-top: 1px solid var(--border-color);
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--card-bg);
            border-radius: 12px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-blue), var(--aqua-glow));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }

        .user-info {
            flex: 1;
        }

        .user-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .user-role {
            font-size: 12px;
            color: var(--text-muted);
        }

        /* Main Content */
        .main-content {
            margin-left: var(--sidebar-width);
            min-height: 100vh;
            padding: 24px;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .header-left h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .header-left p {
            color: var(--text-secondary);
            font-size: 14px;
        }

        .header-right {
            display: flex;
            gap: 12px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary-blue), var(--aqua-glow));
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3);
        }

        .btn-secondary {
            background: var(--card-bg);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            background: var(--secondary-bg);
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
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
            background: linear-gradient(90deg, var(--primary-blue), var(--aqua-glow));
        }

        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }

        .stat-title {
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
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

        .stat-icon.blue {
            background: rgba(41, 121, 255, 0.1);
            color: var(--primary-blue);
        }

        .stat-icon.green {
            background: rgba(0, 227, 150, 0.1);
            color: var(--success-green);
        }

        .stat-icon.yellow {
            background: rgba(254, 176, 25, 0.1);
            color: var(--warning-yellow);
        }

        .stat-icon.red {
            background: rgba(255, 69, 96, 0.1);
            color: var(--danger-red);
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .stat-subtitle {
            font-size: 12px;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .stat-change {
            font-weight: 600;
        }

        .stat-change.positive {
            color: var(--success-green);
        }

        .stat-change.negative {
            color: var(--danger-red);
        }

        /* Activity Feed & Content Grid */
        .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .card-title {
            font-size: 18px;
            font-weight: 600;
        }

        .card-action {
            font-size: 13px;
            color: var(--primary-blue);
            cursor: pointer;
            text-decoration: none;
        }

        .card-action:hover {
            color: var(--aqua-glow);
        }

        /* Activity List */
        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .activity-item {
            display: flex;
            gap: 12px;
            padding: 16px;
            background: var(--secondary-bg);
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .activity-item:hover {
            background: rgba(41, 121, 255, 0.05);
        }

        .activity-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .activity-content {
            flex: 1;
        }

        .activity-title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .activity-description {
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }

        .activity-time {
            font-size: 12px;
            color: var(--text-muted);
        }

        /* Tasks List */
        .tasks-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .task-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--secondary-bg);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .task-item:hover {
            background: rgba(41, 121, 255, 0.05);
        }

        .task-checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid var(--border-color);
            border-radius: 4px;
            flex-shrink: 0;
            cursor: pointer;
        }

        .task-content {
            flex: 1;
        }

        .task-title {
            font-size: 14px;
            margin-bottom: 2px;
        }

        .task-meta {
            font-size: 12px;
            color: var(--text-muted);
        }

        .task-priority {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .task-priority.high {
            background: rgba(255, 69, 96, 0.1);
            color: var(--danger-red);
        }

        .task-priority.normal {
            background: rgba(41, 121, 255, 0.1);
            color: var(--primary-blue);
        }

        .task-priority.low {
            background: rgba(124, 129, 152, 0.1);
            color: var(--text-muted);
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 48px 20px;
        }

        .empty-state i {
            font-size: 48px;
            color: var(--text-muted);
            margin-bottom: 16px;
        }

        .empty-state h3 {
            font-size: 18px;
            margin-bottom: 8px;
        }

        .empty-state p {
            color: var(--text-secondary);
            font-size: 14px;
        }

        /* Loading State */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top-color: var(--aqua-glow);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .content-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            :root {
                --sidebar-width: 0;
            }

            .sidebar {
                transform: translateX(-100%);
            }

            .sidebar.open {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }

        .mobile-menu-btn {
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-blue), var(--aqua-glow));
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(41, 121, 255, 0.4);
            z-index: 999;
        }

        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI">
                <span class="sidebar-logo-text">DeepMine CRM</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <div class="nav-section">
                <div class="nav-section-title">Main</div>
                <a href="/admin/crm/dashboard" class="nav-item active">
                    <i class="fas fa-th-large"></i>
                    <span>Dashboard</span>
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-title">CRM</div>
                <a href="/admin/referrals" class="nav-item">
                    <i class="fas fa-users"></i>
                    <span>Referral Program</span>
                </a>
                <a href="/admin/crm/tasks" class="nav-item">
                    <i class="fas fa-tasks"></i>
                    <span>Task Management</span>
                </a>
                <a href="/admin/crm/tickets" class="nav-item">
                    <i class="fas fa-ticket-alt"></i>
                    <span>Support Tickets</span>
                </a>
                <a href="/admin/crm/staff" class="nav-item">
                    <i class="fas fa-user-tie"></i>
                    <span>Staff</span>
                </a>
                <a href="/admin/crm/activity-logs" class="nav-item">
                    <i class="fas fa-history"></i>
                    <span>Activity Logs</span>
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-title">Admin</div>
                <a href="/admin/kyc" class="nav-item">
                    <i class="fas fa-id-card"></i>
                    <span>KYC Management</span>
                    <span class="nav-badge" id="kycBadge">0</span>
                </a>
                <a href="/admin/panel/withdrawals" class="nav-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>Withdrawals</span>
                    <span class="nav-badge" id="withdrawalBadge">0</span>
                </a>
                <a href="/admin/reports" class="nav-item">
                    <i class="fas fa-chart-bar"></i>
                    <span>Reports</span>
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-title">System</div>
                <a href="/admin/crm/profile" class="nav-item">
                    <i class="fas fa-user-circle"></i>
                    <span>My Profile</span>
                </a>
                <a href="/admin/dashboard" class="nav-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Admin Dashboard</span>
                </a>
            </div>
        </nav>

        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="user-avatar" id="userAvatar" onclick="window.location.href='/admin/crm/profile'" style="cursor: pointer;" title="Go to Profile">AD</div>
                <div class="user-info" onclick="window.location.href='/admin/crm/profile'" style="cursor: pointer;" title="Go to Profile">
                    <div class="user-name" id="userName">Loading...</div>
                    <div class="user-role" id="userRole">Staff</div>
                </div>
                <i class="fas fa-sign-out-alt" style="cursor: pointer; color: var(--text-muted);" onclick="logout()" title="Logout"></i>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <h1>CRM Dashboard</h1>
                <p id="currentDate">Loading...</p>
            </div>
            <div class="header-right">
                <a href="/admin/kyc" class="btn btn-primary">
                    <i class="fas fa-tasks"></i>
                    Pending KYC
                </a>
                <button class="btn btn-secondary" onclick="refreshDashboard()">
                    <i class="fas fa-sync-alt"></i>
                    Refresh
                </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Pending KYC</span>
                    <div class="stat-icon red">
                        <i class="fas fa-id-card"></i>
                    </div>
                </div>
                <div class="stat-value" id="statKYCPending">0</div>
                <div class="stat-subtitle">
                    <span class="stat-change positive">+<span id="statKYCToday">0</span></span>
                    approved today
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Pending Withdrawals</span>
                    <div class="stat-icon yellow">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                </div>
                <div class="stat-value" id="statWithdrawalsPending">0</div>
                <div class="stat-subtitle">
                    $<span id="statWithdrawalsAmount">0</span> total amount
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Active Users</span>
                    <div class="stat-icon green">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
                <div class="stat-value" id="statActiveUsers">0</div>
                <div class="stat-subtitle">
                    <span class="stat-change positive">+<span id="statNewUsers">0</span></span>
                    new today
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Users</span>
                    <div class="stat-icon blue">
                        <i class="fas fa-user-friends"></i>
                    </div>
                </div>
                <div class="stat-value" id="statTotalUsers">0</div>
                <div class="stat-subtitle">
                    <span class="stat-change positive">+<span id="statWeekUsers">0</span></span>
                    this week
                </div>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
            <!-- Recent Activity -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Activity</h3>
                    <a href="/admin/crm/activity-logs" class="card-action">View All →</a>
                </div>
                <div class="activity-list" id="activityList">
                    <div class="loading">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>

            <!-- My Tasks -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">My Tasks</h3>
                    <a href="/admin/crm/tasks" class="card-action">View All →</a>
                </div>
                <div class="tasks-list" id="tasksList">
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <h3>All Caught Up!</h3>
                        <p>No pending tasks at the moment</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" onclick="toggleSidebar()">
        <i class="fas fa-bars"></i>
    </button>

    <script>
        // Initialize dashboard
        let dashboardData = null;

        // Format date
        function formatDate() {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', options);
        }

        // Format time ago
        function timeAgo(dateString) {
            const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
            
            let interval = seconds / 31536000;
            if (interval > 1) return Math.floor(interval) + ' years ago';
            
            interval = seconds / 2592000;
            if (interval > 1) return Math.floor(interval) + ' months ago';
            
            interval = seconds / 86400;
            if (interval > 1) return Math.floor(interval) + ' days ago';
            
            interval = seconds / 3600;
            if (interval > 1) return Math.floor(interval) + ' hours ago';
            
            interval = seconds / 60;
            if (interval > 1) return Math.floor(interval) + ' minutes ago';
            
            return Math.floor(seconds) + ' seconds ago';
        }

        // Get activity icon class
        function getActivityIconClass(category) {
            const icons = {
                kyc: { icon: 'fa-id-card', class: 'blue' },
                user: { icon: 'fa-user', class: 'green' },
                withdrawal: { icon: 'fa-money-bill-wave', class: 'yellow' },
                staff: { icon: 'fa-user-tie', class: 'green' },
                system: { icon: 'fa-cog', class: 'blue' },
                security: { icon: 'fa-shield-alt', class: 'red' }
            };
            return icons[category] || { icon: 'fa-bell', class: 'blue' };
        }

        // Load dashboard data
        async function loadDashboardData() {
            try {
                console.log('[CRM Dashboard] Loading dashboard data...');
                
                // First, get current user info to determine filtering
                const authResponse = await fetch('/api/admin/auth/me', {
                    credentials: 'include'
                });
                const authData = await authResponse.json();
                
                let currentUserId = null;
                let isAdmin = false;
                
                if (authData.success && authData.admin) {
                    currentUserId = authData.admin.id;
                    // Admin roles that can see all tasks: super_admin and admin
                    isAdmin = authData.admin.role_name === 'super_admin' || authData.admin.role_name === 'admin';
                    console.log('[CRM Dashboard] Current user ID:', currentUserId);
                    console.log('[CRM Dashboard] Role:', authData.admin.role_name);
                    console.log('[CRM Dashboard] Can see all tasks:', isAdmin);
                }
                
                // Load stats
                const statsResponse = await fetch('/api/crm/dashboard', {
                    credentials: 'include'
                });
                console.log('[CRM Dashboard] Stats response status:', statsResponse.status);
                
                const statsData = await statsResponse.json();
                console.log('[CRM Dashboard] Stats data received:', statsData);
                
                if (statsData.success) {
                    dashboardData = statsData.data;
                    console.log('[CRM Dashboard] Dashboard data:', dashboardData);
                    updateStats(dashboardData);
                } else {
                    console.error('[CRM Dashboard] Stats fetch failed:', statsData.message);
                }

                // Load activity
                const activityResponse = await fetch('/api/crm/activity?limit=10', {
                    credentials: 'include'
                });
                const activityData = await activityResponse.json();
                
                if (activityData.success) {
                    renderActivity(activityData.data);
                }

                // Load tasks - filter by assigned_to for non-admin staff, show all for admin/super_admin
                let tasksUrl = '/api/crm/tasks/list?limit=10&status=todo,in_progress';
                if (!isAdmin && currentUserId) {
                    tasksUrl += '&assigned_to=' + currentUserId;
                    console.log('[CRM Dashboard] Filtering tasks for user:', currentUserId);
                } else {
                    console.log('[CRM Dashboard] Loading all tasks (Admin/Super Admin)');
                }
                
                const tasksResponse = await fetch(tasksUrl, {
                    credentials: 'include'
                });
                const tasksData = await tasksResponse.json();
                
                if (tasksData.success) {
                    console.log('[CRM Dashboard] Tasks loaded:', tasksData.data?.tasks?.length || 0);
                    renderTasks(tasksData.data?.tasks || []);
                } else {
                    console.error('[CRM Dashboard] Tasks fetch failed:', tasksData.error);
                    renderTasks([]);
                }

            } catch (error) {
                console.error('[CRM Dashboard] Error loading dashboard:', error);
            }
        }

        // Update stats
        function updateStats(data) {
            console.log('[CRM Dashboard] Updating stats with data:', data);
            
            // KYC Stats
            console.log('[CRM Dashboard] KYC Pending:', data.kyc.pending);
            document.getElementById('statKYCPending').textContent = data.kyc.pending;
            document.getElementById('statKYCToday').textContent = data.kyc.approved_today;
            
            // Withdrawal Stats
            document.getElementById('statWithdrawalsPending').textContent = data.withdrawals.pending;
            document.getElementById('statWithdrawalsAmount').textContent = data.withdrawals.total_amount_pending.toFixed(2);
            
            // User Stats
            document.getElementById('statActiveUsers').textContent = data.overview.active_users;
            document.getElementById('statNewUsers').textContent = data.overview.new_users_today;
            document.getElementById('statTotalUsers').textContent = data.overview.total_users;
            document.getElementById('statWeekUsers').textContent = data.overview.new_users_this_week;
            
            // Update badges
            document.getElementById('kycBadge').textContent = data.kyc.pending;
            document.getElementById('withdrawalBadge').textContent = data.withdrawals.pending;
            
            console.log('[CRM Dashboard] Stats updated successfully');
        }

        // Render activity list
        function renderActivity(activities) {
            const container = document.getElementById('activityList');
            
            if (!activities || activities.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <h3>No Activity Yet</h3>
                        <p>Recent activity will appear here</p>
                    </div>
                \`;
                return;
            }

            container.innerHTML = activities.map(activity => {
                const iconData = getActivityIconClass(activity.action_category);
                return \`
                    <div class="activity-item">
                        <div class="activity-icon \${iconData.class}">
                            <i class="fas \${iconData.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">\${activity.resource_name || activity.resource_type}</div>
                            <div class="activity-description">\${activity.description}</div>
                            <div class="activity-time">\${timeAgo(activity.created_at)}</div>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        // Render tasks list
        function renderTasks(tasks) {
            const container = document.getElementById('tasksList');
            
            if (!tasks || tasks.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <h3>All Caught Up!</h3>
                        <p>No pending tasks at the moment</p>
                    </div>
                \`;
                return;
            }

            container.innerHTML = tasks.map(task => \`
                <div class="task-item">
                    <div class="task-checkbox"></div>
                    <div class="task-content">
                        <div class="task-title">\${task.title}</div>
                        <div class="task-meta">\${task.task_type} • Due \${task.due_date || 'No deadline'}</div>
                    </div>
                    <span class="task-priority \${task.priority}">\${task.priority}</span>
                </div>
            \`).join('');
        }

        // Refresh dashboard
        async function refreshDashboard() {
            await loadDashboardData();
        }

        // Toggle sidebar on mobile
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
        }

        // Check if user is authenticated
        async function checkAuth() {
            try {
                console.log('[CRM-DASHBOARD] 🔍 Checking authentication...');
                const response = await fetch('/api/admin/auth/me', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (!data.success) {
                    console.log('[CRM-DASHBOARD] ❌ Not authenticated, redirecting to login...');
                    window.location.href = '/admin/crm/login';
                    return false;
                }
                
                console.log('[CRM-DASHBOARD] ✅ Authentication successful');
                console.log('[CRM-DASHBOARD] User:', data.admin?.full_name || 'Unknown');
                return true;
            } catch (error) {
                console.error('[CRM-DASHBOARD] ❌ Auth check failed:', error);
                window.location.href = '/admin/crm/login';
                return false;
            }
        }

        // Load current user info
        async function loadUserInfo() {
            try {
                const response = await fetch('/api/admin/auth/me', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.success && data.admin) {
                    const admin = data.admin;
                    const accountStatus = admin.account_status || '';
                    const roleName = admin.role_name || '';
                    
                    console.log('[USER-INFO] Account status:', accountStatus);
                    console.log('[USER-INFO] Role name:', roleName);
                    console.log('[USER-INFO] Role display name:', admin.role_display_name);
                    
                    // Set user name
                    document.getElementById('userName').textContent = admin.full_name || admin.email || 'Admin User';
                    
                    // Check if Super Admin (only from users table with account_status='admin')
                    if (roleName === 'super_admin') {
                        console.log('[USER-INFO] ✅ Super Admin detected');
                        document.getElementById('userRole').textContent = 'Super Admin';
                        
                        // Set avatar initials
                        const initials = admin.full_name
                            ? admin.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                            : 'SA';
                        document.getElementById('userAvatar').textContent = initials;
                    } else {
                        // For CRM Staff, use role_display_name from the response
                        console.log('[USER-INFO] 👤 CRM Staff');
                        const roleDisplay = admin.role_display_name || admin.role || 'Staff';
                        document.getElementById('userRole').textContent = roleDisplay;
                        
                        // Set avatar initials
                        const initials = admin.full_name
                            ? admin.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                            : 'ST';
                        document.getElementById('userAvatar').textContent = initials;
                    }
                }
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        }

        // Logout
        async function logout() {
            if (confirm('Are you sure you want to logout?')) {
                // Check if Super Admin or CRM Staff to redirect correctly
                try {
                    const response = await fetch('/api/admin/auth/me', { credentials: 'include' });
                    const data = await response.json();
                    // Only Super Admins have role_name = 'super_admin'
                    const isSuperAdmin = data.admin?.role_name === 'super_admin';
                    
                    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    localStorage.removeItem('crm_staff_id');
                    sessionStorage.removeItem('crm_staff_id');
                    
                    // Redirect based on user type
                    if (isSuperAdmin) {
                        window.location.href = '/admin/panel/login';
                    } else {
                        window.location.href = '/admin/crm/login';
                    }
                } catch (error) {
                    // Default to CRM login if error
                    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = '/admin/crm/login';
                }
            }
        }

        // Initialize - Check auth first!
        async function init() {
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                formatDate();
                loadUserInfo();
                loadDashboardData();
                
                // Auto-refresh every 30 seconds
                setInterval(() => {
                    loadDashboardData();
                }, 30000);
            }
        }
        
        // Start initialization
        init();
    </script>
    
      ${CRM_SIDEBAR_PERMISSION_SCRIPT}
  </body>
</html>
`
