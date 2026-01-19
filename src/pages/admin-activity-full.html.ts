/**
 * Admin Activity Log - Full Page
 * Complete activity history with filtering
 */

export const adminActivityFullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activity Log - DeepMine AI Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --primary: #3B82F6;
            --success: #10B981;
            --warning: #F59E0B;
            --danger: #EF4444;
            --dark-bg: #0B0F1E;
            --dark-card: #1A1F35;
            --dark-hover: #252B45;
            --text-primary: #E0E7FF;
            --text-secondary: #9CA3AF;
            --border-color: rgba(59, 130, 246, 0.2);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--dark-bg);
            color: var(--text-primary);
            padding: 30px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .back-btn {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .back-btn:hover {
            background: var(--dark-hover);
            transform: translateY(-2px);
        }

        .title {
            font-size: 32px;
            font-weight: 700;
        }

        .filters {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .filter-label {
            font-size: 12px;
            color: var(--text-secondary);
            font-weight: 600;
            text-transform: uppercase;
        }

        .filter-select, .filter-input {
            background: var(--dark-hover);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
        }

        .filter-btn {
            background: var(--primary);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-top: auto;
            transition: all 0.2s;
        }

        .filter-btn:hover {
            background: #2563EB;
            transform: translateY(-2px);
        }

        .stats-bar {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-chip {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 10px 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
        }

        .stat-icon {
            width: 30px;
            height: 30px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .activity-card {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            display: flex;
            gap: 15px;
            transition: all 0.2s;
        }

        .activity-card:hover {
            background: var(--dark-hover);
            transform: translateX(5px);
        }

        .activity-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }

        .activity-content {
            flex: 1;
        }

        .activity-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 8px;
        }

        .activity-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .activity-time {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .activity-desc {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 8px;
        }

        .activity-meta {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: var(--text-secondary);
        }

        .activity-badge {
            background: rgba(59, 130, 246, 0.1);
            color: var(--primary);
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
        }

        .loading {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        }

        .loading i {
            font-size: 40px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        }

        .empty-state i {
            font-size: 60px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 30px;
        }

        .page-btn {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .page-btn:hover {
            background: var(--primary);
        }

        .page-btn.active {
            background: var(--primary);
            border-color: var(--primary);
        }

        @media (max-width: 768px) {
            .filters {
                flex-direction: column;
            }

            .stats-bar {
                flex-direction: column;
            }

            .activity-header {
                flex-direction: column;
                gap: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">Activity Log</h1>
            <a href="/admin/dashboard" class="back-btn">
                <i class="fas fa-arrow-left"></i>
                Back to Dashboard
            </a>
        </div>

        <!-- Filters -->
        <div class="filters">
            <div class="filter-group">
                <label class="filter-label">Activity Type</label>
                <select class="filter-select" id="typeFilter">
                    <option value="">All Types</option>
                    <option value="user_signup">User Signups</option>
                    <option value="miner_purchase">Miner Purchases</option>
                    <option value="withdrawal">Withdrawals</option>
                </select>
            </div>

            <div class="filter-group">
                <label class="filter-label">Time Period</label>
                <select class="filter-select" id="periodFilter">
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d" selected>Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            <button class="filter-btn" onclick="applyFilters()">
                <i class="fas fa-filter"></i>
                Apply Filters
            </button>

            <button class="filter-btn" onclick="refreshActivities()" style="background: var(--success);">
                <i class="fas fa-sync-alt"></i>
                Refresh
            </button>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar" id="statsBar">
            <!-- Stats will be injected here -->
        </div>

        <!-- Loading State -->
        <div class="loading" id="loadingState">
            <i class="fas fa-spinner"></i>
            <p>Loading activities...</p>
        </div>

        <!-- Activities List -->
        <div id="activitiesList" style="display: none;">
            <!-- Activities will be injected here -->
        </div>

        <!-- Empty State -->
        <div class="empty-state" id="emptyState" style="display: none;">
            <i class="fas fa-inbox"></i>
            <h3>No Activities Found</h3>
            <p>There are no activities matching your filters.</p>
        </div>

        <!-- Pagination -->
        <div class="pagination" id="pagination" style="display: none;">
            <!-- Pagination will be injected here -->
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;

        let allActivities = [];
        let filteredActivities = [];
        let currentPage = 1;
        const itemsPerPage = 20;

        // Format time ago
        function timeAgo(date) {
            const seconds = Math.floor((new Date() - new Date(date)) / 1000);
            if (seconds < 60) return 'Just now';
            if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
            if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
            return Math.floor(seconds / 86400) + 'd ago';
        }

        // Format full date
        function formatDate(date) {
            return new Date(date).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Load activities
        async function loadActivities() {
            try {
                document.getElementById('loadingState').style.display = 'block';
                document.getElementById('activitiesList').style.display = 'none';
                document.getElementById('emptyState').style.display = 'none';

                const response = await axios.get('/api/admin/recent-activity?limit=100');
                if (response.data.success) {
                    allActivities = response.data.activities;
                    applyFilters();
                    displayStats();
                }
            } catch (error) {
                console.error('Error loading activities:', error);
                document.getElementById('loadingState').innerHTML = '<p style="color: #EF4444;">Failed to load activities</p>';
            }
        }

        // Apply filters
        function applyFilters() {
            const typeFilter = document.getElementById('typeFilter').value;
            const periodFilter = document.getElementById('periodFilter').value;

            // Filter by type
            filteredActivities = typeFilter ? 
                allActivities.filter(a => a.type === typeFilter) : 
                [...allActivities];

            // Filter by period
            if (periodFilter !== 'all') {
                const now = new Date();
                const cutoff = new Date();
                
                if (periodFilter === '24h') cutoff.setHours(now.getHours() - 24);
                else if (periodFilter === '7d') cutoff.setDate(now.getDate() - 7);
                else if (periodFilter === '30d') cutoff.setDate(now.getDate() - 30);

                filteredActivities = filteredActivities.filter(a => 
                    new Date(a.created_at) >= cutoff
                );
            }

            currentPage = 1;
            displayActivities();
        }

        // Display activities
        function displayActivities() {
            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            const pageActivities = filteredActivities.slice(startIdx, endIdx);

            if (pageActivities.length === 0) {
                document.getElementById('loadingState').style.display = 'none';
                document.getElementById('activitiesList').style.display = 'none';
                document.getElementById('emptyState').style.display = 'block';
                document.getElementById('pagination').style.display = 'none';
                return;
            }

            const html = pageActivities.map(activity => {
                let iconClass = 'fa-circle';
                let iconColor = 'var(--primary)';
                let badgeText = activity.type.replace('_', ' ').toUpperCase();
                
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
                    <div class="activity-card">
                        <div class="activity-icon" style="background: \${iconColor}20; color: \${iconColor};">
                            <i class="fas \${iconClass}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-header">
                                <div>
                                    <div class="activity-title">\${activity.title || 'Activity'}</div>
                                    <div class="activity-desc">\${activity.description || ''}</div>
                                </div>
                                <div class="activity-time">\${timeAgo(activity.created_at)}</div>
                            </div>
                            <div class="activity-meta">
                                <span class="activity-badge">\${badgeText}</span>
                                <span><i class="fas fa-calendar"></i> \${formatDate(activity.created_at)}</span>
                                <span><i class="fas fa-hashtag"></i> ID: \${activity.entity_id}</span>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');

            document.getElementById('activitiesList').innerHTML = html;
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('activitiesList').style.display = 'block';
            document.getElementById('emptyState').style.display = 'none';

            displayPagination();
        }

        // Display stats
        function displayStats() {
            const signups = allActivities.filter(a => a.type === 'user_signup').length;
            const purchases = allActivities.filter(a => a.type === 'miner_purchase').length;
            const withdrawals = allActivities.filter(a => a.type === 'withdrawal').length;

            const statsHTML = \`
                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success);">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <span>\${signups} Signups</span>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: var(--primary);">
                        <i class="fas fa-server"></i>
                    </div>
                    <span>\${purchases} Purchases</span>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <span>\${withdrawals} Withdrawals</span>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(139, 92, 246, 0.1); color: #8B5CF6;">
                        <i class="fas fa-list"></i>
                    </div>
                    <span>\${allActivities.length} Total</span>
                </div>
            \`;

            document.getElementById('statsBar').innerHTML = statsHTML;
        }

        // Display pagination
        function displayPagination() {
            const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
            
            if (totalPages <= 1) {
                document.getElementById('pagination').style.display = 'none';
                return;
            }

            let paginationHTML = '';
            
            // Previous button
            if (currentPage > 1) {
                paginationHTML += \`<button class="page-btn" onclick="changePage(\${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>\`;
            }

            // Page numbers
            for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                const active = i === currentPage ? 'active' : '';
                paginationHTML += \`<button class="page-btn \${active}" onclick="changePage(\${i})">\${i}</button>\`;
            }

            // Next button
            if (currentPage < totalPages) {
                paginationHTML += \`<button class="page-btn" onclick="changePage(\${currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>\`;
            }

            document.getElementById('pagination').innerHTML = paginationHTML;
            document.getElementById('pagination').style.display = 'flex';
        }

        // Change page
        function changePage(page) {
            currentPage = page;
            displayActivities();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Refresh activities
        function refreshActivities() {
            loadActivities();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadActivities();
        });
    </script>
</body>
</html>
`;
