/**
 * DeepMine AI - Admin CRM Dashboard
 * Modern, responsive admin dashboard
 */

export const adminDashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - DeepMine AI CRM</title>
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
            --primary: #2979FF;
            --primary-dark: #1565C0;
            --success: #00C853;
            --warning: #FF9800;
            --danger: #F44336;
            --dark-bg: #0B0F1E;
            --dark-card: #1A1F35;
            --dark-hover: #252B45;
            --text-primary: #E0E7FF;
            --text-secondary: #9CA3AF;
            --border-color: rgba(41, 121, 255, 0.2);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--dark-bg);
            color: var(--text-primary);
            min-height: 100vh;
            overflow-x: hidden;
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

        .sidebar.mobile-hidden {
            transform: translateX(-100%);
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
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .sidebar-nav {
            flex: 1;
            overflow-y: auto;
            padding: 20px 0;
        }

        .nav-section {
            margin-bottom: 24px;
        }

        .nav-section-title {
            padding: 0 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-secondary);
            margin-bottom: 8px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            position: relative;
        }

        .nav-item:hover {
            background: var(--dark-hover);
            color: var(--text-primary);
        }

        .nav-item.active {
            background: rgba(41, 121, 255, 0.1);
            color: var(--primary);
            border-left: 3px solid var(--primary);
        }

        .nav-item i {
            width: 20px;
            text-align: center;
        }

        .nav-item-badge {
            margin-left: auto;
            background: var(--danger);
            color: white;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 600;
        }

        .sidebar-footer {
            padding: 16px 20px;
            border-top: 1px solid var(--border-color);
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .user-profile:hover {
            background: var(--dark-hover);
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }

        .user-info {
            flex: 1;
        }

        .user-name {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .user-role {
            font-size: 11px;
            color: var(--text-secondary);
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
            flex: 1;
            margin-left: 260px;
            background: var(--dark-bg);
        }

        .topbar {
            background: var(--dark-card);
            border-bottom: 1px solid var(--border-color);
            padding: 16px 32px;
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
            gap: 16px;
        }

        .menu-toggle {
            display: none;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 20px;
            cursor: pointer;
            padding: 8px;
        }

        .page-title {
            font-size: 24px;
            font-weight: 700;
        }

        .topbar-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .topbar-icon {
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: var(--dark-hover);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
        }

        .topbar-icon:hover {
            background: var(--primary);
        }

        .notification-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: var(--danger);
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 600;
        }

        .content {
            padding: 32px;
        }

        /* ===== STATS CARDS ===== */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .stat-icon.primary {
            background: rgba(41, 121, 255, 0.1);
            color: var(--primary);
        }

        .stat-icon.success {
            background: rgba(0, 200, 83, 0.1);
            color: var(--success);
        }

        .stat-icon.warning {
            background: rgba(255, 152, 0, 0.1);
            color: var(--warning);
        }

        .stat-icon.danger {
            background: rgba(244, 67, 54, 0.1);
            color: var(--danger);
        }

        .stat-trend {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 6px;
        }

        .stat-trend.up {
            background: rgba(0, 200, 83, 0.1);
            color: var(--success);
        }

        .stat-trend.down {
            background: rgba(244, 67, 54, 0.1);
            color: var(--danger);
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 14px;
            color: var(--text-secondary);
            font-weight: 500;
        }

        /* ===== SECTION CARDS ===== */
        .section-card {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            margin-bottom: 24px;
        }

        .section-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-actions {
            display: flex;
            gap: 8px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        .btn-secondary {
            background: var(--dark-hover);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background: var(--primary);
        }

        .section-content {
            padding: 24px;
        }

        /* ===== TASK LIST ===== */
        .task-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .task-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: var(--dark-hover);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .task-item:hover {
            background: rgba(41, 121, 255, 0.1);
            transform: translateX(4px);
        }

        .task-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid var(--border-color);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .task-checkbox:hover {
            border-color: var(--primary);
        }

        .task-info {
            flex: 1;
        }

        .task-title {
            font-weight: 500;
            margin-bottom: 4px;
        }

        .task-meta {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: var(--text-secondary);
        }

        .priority-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .priority-urgent {
            background: rgba(244, 67, 54, 0.2);
            color: var(--danger);
        }

        .priority-high {
            background: rgba(255, 152, 0, 0.2);
            color: var(--warning);
        }

        .priority-normal {
            background: rgba(41, 121, 255, 0.2);
            color: var(--primary);
        }

        /* ===== ACTIVITY FEED ===== */
        .activity-feed {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .activity-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            background: var(--dark-hover);
            border-radius: 8px;
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .activity-content {
            flex: 1;
        }

        .activity-text {
            margin-bottom: 4px;
        }

        .activity-text strong {
            font-weight: 600;
            color: var(--primary);
        }

        .activity-time {
            font-size: 12px;
            color: var(--text-secondary);
        }

        /* ===== LOADING STATE ===== */
        .loading {
            text-align: center;
            padding: 40px;
            color: var(--text-secondary);
        }

        .loading i {
            font-size: 32px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* ===== EMPTY STATE ===== */
        .empty-state {
            text-align: center;
            padding: 60px 24px;
        }

        .empty-icon {
            font-size: 48px;
            color: var(--text-secondary);
            margin-bottom: 16px;
        }

        .empty-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .empty-description {
            color: var(--text-secondary);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

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

            .content {
                padding: 16px;
            }

            .topbar {
                padding: 12px 16px;
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
                        <p>Admin CRM</p>
                    </div>
                </div>
            </div>

            <nav class="sidebar-nav">
                <div class="nav-section">
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
                        <span>KYC Management</span>
                        <span class="nav-item-badge" id="kyc-badge">0</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">CRM</div>
                    <a href="/admin/crm/tasks" class="nav-item">
                        <i class="fas fa-tasks"></i>
                        <span>Tasks</span>
                        <span class="nav-item-badge" id="tasks-badge">0</span>
                    </a>
                    <a href="/admin/crm/tickets" class="nav-item">
                        <i class="fas fa-ticket-alt"></i>
                        <span>Support Tickets</span>
                        <span class="nav-item-badge" id="tickets-badge">0</span>
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
                    <div class="nav-section-title">Support</div>
                    <a href="/admin/tickets" class="nav-item">
                        <i class="fas fa-ticket-alt"></i>
                        <span>Support Tickets</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Finance</div>
                    <a href="/admin/withdrawals" class="nav-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Withdrawals</span>
                        <span class="nav-item-badge" id="withdrawals-badge">0</span>
                    </a>
                    <a href="/admin/transactions" class="nav-item">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Transactions</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Analytics</div>
                    <a href="/admin/analytics" class="nav-item">
                        <i class="fas fa-chart-bar"></i>
                        <span>Analytics</span>
                    </a>
                    <a href="/admin/reports" class="nav-item">
                        <i class="fas fa-file-alt"></i>
                        <span>Reports</span>
                    </a>
                    <a href="/admin/activity" class="nav-item">
                        <i class="fas fa-history"></i>
                        <span>Activity Log</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">System</div>
                    <a href="/admin/notifications" class="nav-item">
                        <i class="fas fa-bell"></i>
                        <span>Notifications</span>
                    </a>
                    <a href="/admin/settings" class="nav-item">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </div>
            </nav>

            <div class="sidebar-footer">
                <div class="user-profile" onclick="window.location.href='/admin/profile'">
                    <div class="user-avatar" id="userAvatar">A</div>
                    <div class="user-info">
                        <div class="user-name" id="userName">Admin</div>
                        <div class="user-role" id="userRole">Administrator</div>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
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
                        <!-- Stats cards will be inserted here -->
                    </div>

                    <!-- My Tasks Section -->
                    <div class="section-card">
                        <div class="section-header">
                            <div class="section-title">
                                <i class="fas fa-tasks"></i>
                                My Tasks
                            </div>
                            <div class="section-actions">
                                <button class="btn btn-secondary" onclick="window.location.href='/admin/crm/tasks'">
                                    View All
                                </button>
                            </div>
                        </div>
                        <div class="section-content">
                            <div class="task-list" id="taskList">
                                <!-- Tasks will be inserted here -->
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity Section -->
                    <div class="section-card">
                        <div class="section-header">
                            <div class="section-title">
                                <i class="fas fa-history"></i>
                                Recent Activity
                            </div>
                            <div class="section-actions">
                                <button class="btn btn-secondary" onclick="window.location.href='/admin/activity'">
                                    View All
                                </button>
                            </div>
                        </div>
                        <div class="section-content">
                            <div class="activity-feed" id="activityFeed">
                                <!-- Activity will be inserted here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        // Configuration
        const API_BASE = '';

        // State
        let dashboardData = null;

        // Toggle sidebar on mobile
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('mobile-visible');
        }

        // Format number with commas
        function formatNumber(num) {
            return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
        }

        // Time ago helper
        function timeAgo(dateString) {
            const date = new Date(dateString);
            const seconds = Math.floor((new Date() - date) / 1000);
            
            if (seconds < 60) return 'Just now';
            if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
            if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
            if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
            return date.toLocaleDateString();
        }

        // Load dashboard data
        async function loadDashboard() {
            try {
                document.getElementById('loadingState').style.display = 'block';
                document.getElementById('dashboardContent').style.display = 'none';

                const response = await axios.get('/api/admin/dashboard');
                
                if (response.data.success) {
                    dashboardData = response.data.data;
                    renderDashboard(dashboardData);
                } else {
                    showError('Failed to load dashboard');
                }
            } catch (error) {
                console.error('Dashboard load error:', error);
                showError('Failed to load dashboard data');
            }
        }

        // Render dashboard
        function renderDashboard(data) {
            renderStats(data.stats);
            renderTasks(data.tasks);
            renderActivity(data.activity);
            updateBadges(data.stats);

            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('dashboardContent').style.display = 'block';
        }

        // Render stats cards
        function renderStats(stats) {
            const statsGrid = document.getElementById('statsGrid');
            
            const cards = [
                {
                    icon: 'fa-users',
                    iconClass: 'primary',
                    label: 'Total Users',
                    value: stats.overview.total_users,
                    trend: { value: '+' + stats.overview.new_users_today, up: true }
                },
                {
                    icon: 'fa-id-card',
                    iconClass: 'warning',
                    label: 'Pending KYC',
                    value: stats.kyc.pending,
                    trend: null
                },
                {
                    icon: 'fa-check-circle',
                    iconClass: 'success',
                    label: 'Approved Today',
                    value: stats.kyc.approved_today,
                    trend: null
                },
                {
                    icon: 'fa-money-bill-wave',
                    iconClass: 'danger',
                    label: 'Pending Withdrawals',
                    value: stats.withdrawals.pending,
                    trend: null
                },
                {
                    icon: 'fa-tasks',
                    iconClass: 'primary',
                    label: 'My Tasks',
                    value: stats.tasks.my_pending,
                    trend: null
                },
                {
                    icon: 'fa-ticket-alt',
                    iconClass: 'warning',
                    label: 'Open Tickets',
                    value: stats.tickets.open,
                    trend: null
                }
            ];

            statsGrid.innerHTML = cards.map(card => \`
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon \${card.iconClass}">
                            <i class="fas \${card.icon}"></i>
                        </div>
                        \${card.trend ? \`
                            <div class="stat-trend \${card.trend.up ? 'up' : 'down'}">
                                <i class="fas fa-arrow-\${card.trend.up ? 'up' : 'down'}"></i>
                                \${card.trend.value}
                            </div>
                        \` : ''}
                    </div>
                    <div class="stat-value">\${formatNumber(card.value)}</div>
                    <div class="stat-label">\${card.label}</div>
                </div>
            \`).join('');
        }

        // Render tasks
        function renderTasks(tasks) {
            const taskList = document.getElementById('taskList');
            
            if (!tasks || tasks.length === 0) {
                taskList.innerHTML = \`
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="empty-title">All caught up!</div>
                        <div class="empty-description">You have no pending tasks at the moment.</div>
                    </div>
                \`;
                return;
            }

            taskList.innerHTML = tasks.map(task => \`
                <div class="task-item" onclick="window.location.href='/admin/tasks/\${task.id}'">
                    <div class="task-checkbox"></div>
                    <div class="task-info">
                        <div class="task-title">\${task.title}</div>
                        <div class="task-meta">
                            <span><i class="fas fa-tag"></i> \${task.task_type.toUpperCase()}</span>
                            <span><i class="fas fa-clock"></i> \${timeAgo(task.created_at)}</span>
                        </div>
                    </div>
                    <span class="priority-badge priority-\${task.priority}">\${task.priority}</span>
                </div>
            \`).join('');
        }

        // Render activity
        function renderActivity(activities) {
            const activityFeed = document.getElementById('activityFeed');
            
            if (!activities || activities.length === 0) {
                activityFeed.innerHTML = \`
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="empty-title">No recent activity</div>
                        <div class="empty-description">Activity will appear here as actions are performed.</div>
                    </div>
                \`;
                return;
            }

            activityFeed.innerHTML = activities.map(activity => \`
                <div class="activity-item">
                    <div class="activity-icon \${getActivityIconClass(activity.action_category)}">
                        <i class="fas \${getActivityIcon(activity.action_category)}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">\${activity.description}</div>
                        <div class="activity-time">\${timeAgo(activity.created_at)}</div>
                    </div>
                </div>
            \`).join('');
        }

        // Get activity icon
        function getActivityIcon(category) {
            const icons = {
                'kyc': 'fa-id-card',
                'user': 'fa-user',
                'withdrawal': 'fa-money-bill-wave',
                'staff': 'fa-user-tie',
                'system': 'fa-cog',
                'security': 'fa-shield-alt'
            };
            return icons[category] || 'fa-circle';
        }

        // Get activity icon class
        function getActivityIconClass(category) {
            const classes = {
                'kyc': 'warning',
                'user': 'primary',
                'withdrawal': 'success',
                'staff': 'primary',
                'system': 'secondary',
                'security': 'danger'
            };
            return classes[category] || 'primary';
        }

        // Update badges
        function updateBadges(stats) {
            document.getElementById('kyc-badge').textContent = stats.kyc.pending;
            document.getElementById('tasks-badge').textContent = stats.tasks.my_pending;
            document.getElementById('tickets-badge').textContent = stats.tickets.open || 0;
            document.getElementById('withdrawals-badge').textContent = stats.withdrawals.pending;
            document.getElementById('notif-badge').textContent = stats.activity?.unread_notifications || 0;
        }

        // Refresh dashboard
        async function refreshDashboard() {
            await loadDashboard();
        }

        // Show error
        function showError(message) {
            document.getElementById('loadingState').innerHTML = \`
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="empty-title">Error Loading Dashboard</div>
                    <div class="empty-description">\${message}</div>
                    <button class="btn btn-primary" onclick="loadDashboard()" style="margin-top: 16px;">
                        <i class="fas fa-sync-alt"></i> Retry
                    </button>
                </div>
            \`;
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadDashboard();
            
            // Auto-refresh every 5 minutes
            setInterval(loadDashboard, 5 * 60 * 1000);
        });
    </script>
</body>
</html>
`
