/**
 * DeepMine AI - Activity Logs Viewer
 * Comprehensive audit trail and activity monitoring
 */

import { CRM_SIDEBAR_PERMISSION_SCRIPT } from '../components/crm-sidebar-permissions';

export const adminActivityLogsHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activity Logs - DeepMine Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .sidebar-link:hover { background-color: rgba(59, 130, 246, 0.1); }
        .sidebar-link.active { background-color: rgba(59, 130, 246, 0.2); border-left: 3px solid #3b82f6; }
        .log-row:hover { background-color: rgba(59, 130, 246, 0.05); }
    </style>
</head>
<body class="bg-gray-900 text-gray-100">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
            <div class="p-6">
                <h1 class="text-2xl font-bold text-blue-400">
                    <i class="fas fa-gem mr-2"></i>DeepMine CRM
                </h1>
            </div>
            <nav class="mt-6">
                <div class="px-6 py-2 text-xs font-semibold text-gray-500 uppercase">Main</div>
                <a href="/admin/crm/dashboard" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-chart-line mr-3 w-5"></i>Dashboard
                </a>
                
                <div class="px-6 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">CRM</div>
                <a href="/admin/crm/staff" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-users mr-3 w-5"></i>Staff
                </a>
                <a href="/admin/crm/tasks" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-tasks mr-3 w-5"></i>Tasks
                </a>
                <a href="/admin/crm/tickets" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-ticket-alt mr-3 w-5"></i>Support Tickets
                </a>
                <a href="/admin/crm/activity-logs" class="sidebar-link active flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-history mr-3 w-5"></i>Activity Logs
                </a>
                
                <div class="px-6 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">Admin</div>
                <a href="/admin/kyc" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-id-card mr-3 w-5"></i>KYC
                </a>
                <a href="/admin/panel/withdrawals" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-money-bill-wave mr-3 w-5"></i>Withdrawals
                </a>
                <a href="/admin/reports" class="sidebar-link flex items-center px-6 py-3 text-gray-300">
                    <i class="fas fa-chart-bar mr-3 w-5"></i>Reports
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto">
            <!-- Header -->
            <header class="bg-gray-800 border-b border-gray-700 px-8 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-3xl font-bold text-white">Activity Logs</h2>
                        <p class="text-gray-400 mt-1">Complete audit trail and activity monitoring</p>
                    </div>
                    <button onclick="refreshLogs()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-sync-alt mr-2"></i>Refresh
                    </button>
                </div>
            </header>

            <!-- Stats Cards -->
            <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Total Activities (7d)</p>
                                <p class="text-3xl font-bold text-white mt-2" id="statTotal">0</p>
                            </div>
                            <i class="fas fa-clipboard-list text-4xl text-blue-400"></i>
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Today's Activities</p>
                                <p class="text-3xl font-bold text-white mt-2" id="statToday">0</p>
                            </div>
                            <i class="fas fa-calendar-day text-4xl text-green-400"></i>
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Active Users</p>
                                <p class="text-3xl font-bold text-white mt-2" id="statActiveUsers">0</p>
                            </div>
                            <i class="fas fa-users text-4xl text-purple-400"></i>
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Top Action</p>
                                <p class="text-lg font-bold text-white mt-2" id="statTopAction">--</p>
                            </div>
                            <i class="fas fa-fire text-4xl text-orange-400"></i>
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 class="text-xl font-bold text-white mb-4">
                            <i class="fas fa-chart-line mr-2 text-blue-400"></i>Activity Trend (7 Days)
                        </h3>
                        <canvas id="activityTrendChart"></canvas>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 class="text-xl font-bold text-white mb-4">
                            <i class="fas fa-chart-pie mr-2 text-blue-400"></i>Top Actions
                        </h3>
                        <canvas id="topActionsChart"></canvas>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                    <h3 class="text-xl font-bold text-white mb-4">
                        <i class="fas fa-filter mr-2 text-blue-400"></i>Filters
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Actor</label>
                            <input type="text" id="filterActor" placeholder="Search by name or email" 
                                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Action</label>
                            <input type="text" id="filterAction" placeholder="e.g., login, update" 
                                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Resource Type</label>
                            <select id="filterResource" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                <option value="">All Resources</option>
                                <option value="user">User</option>
                                <option value="staff">Staff</option>
                                <option value="kyc">KYC</option>
                                <option value="withdrawal">Withdrawal</option>
                                <option value="task">Task</option>
                                <option value="note">Note</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Date Range</label>
                            <select id="filterDateRange" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="7days" selected>Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                    </div>
                    <div class="mt-4 flex gap-4">
                        <button onclick="applyFilters()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                            <i class="fas fa-search mr-2"></i>Apply Filters
                        </button>
                        <button onclick="clearFilters()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                            <i class="fas fa-times mr-2"></i>Clear
                        </button>
                    </div>
                </div>

                <!-- Activity Logs Table -->
                <div class="bg-gray-800 rounded-lg border border-gray-700">
                    <div class="p-6 border-b border-gray-700">
                        <h3 class="text-xl font-bold text-white">
                            <i class="fas fa-list mr-2 text-blue-400"></i>Activity History
                        </h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-700">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Resource</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Details</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">IP Address</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="logsTableBody" class="divide-y divide-gray-700">
                                <tr>
                                    <td colspan="7" class="px-6 py-8 text-center">
                                        <i class="fas fa-spinner fa-spin text-2xl text-blue-400"></i>
                                        <p class="mt-2 text-gray-400">Loading logs...</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="p-6 border-t border-gray-700 flex items-center justify-between">
                        <div class="text-sm text-gray-400">
                            Showing <span id="showingStart">0</span> to <span id="showingEnd">0</span> of <span id="showingTotal">0</span> logs
                        </div>
                        <div class="flex gap-2" id="paginationButtons">
                            <!-- Pagination buttons will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        let currentPage = 1;
        let totalPages = 1;
        let activityTrendChart = null;
        let topActionsChart = null;

        // Load stats
        async function loadStats() {
            try {
                const response = await fetch('/api/crm/activity-logs/stats?days=7', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    console.error('Stats API error:', response.status, response.statusText);
                    if (response.status === 401) {
                        showError('Authentication required. Please login as admin.');
                    }
                    return;
                }
                
                const data = await response.json();
                console.log('Stats data:', data);

                if (data.success) {
                    document.getElementById('statTotal').textContent = data.data.total;
                    
                    // Calculate today's activities
                    const today = new Date().toISOString().split('T')[0];
                    const todayData = data.data.dailyActivity.find(d => d.date === today);
                    document.getElementById('statToday').textContent = todayData ? todayData.count : 0;
                    
                    // Active users count
                    document.getElementById('statActiveUsers').textContent = data.data.topActors.length;
                    
                    // Top action
                    if (data.data.byAction.length > 0) {
                        document.getElementById('statTopAction').textContent = data.data.byAction[0].action;
                    } else {
                        document.getElementById('statTopAction').textContent = '--';
                    }

                    // Update charts
                    updateCharts(data.data);
                } else {
                    console.error('Stats API returned error:', data.error);
                    showError('Failed to load statistics: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error loading stats:', error);
                showError('Failed to load statistics. Check console for details.');
            }
        }

        // Update charts
        function updateCharts(stats) {
            // Activity Trend Chart
            const trendCtx = document.getElementById('activityTrendChart');
            if (activityTrendChart) activityTrendChart.destroy();
            
            activityTrendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: stats.dailyActivity.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                    datasets: [{
                        label: 'Activities',
                        data: stats.dailyActivity.map(d => d.count),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#9ca3af'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#9ca3af' },
                            grid: { color: 'rgba(75, 85, 99, 0.3)' }
                        },
                        x: {
                            ticks: { color: '#9ca3af' },
                            grid: { display: false }
                        }
                    }
                }
            });

            // Top Actions Chart
            const actionsCtx = document.getElementById('topActionsChart');
            if (topActionsChart) topActionsChart.destroy();
            
            topActionsChart = new Chart(actionsCtx, {
                type: 'doughnut',
                data: {
                    labels: stats.byAction.slice(0, 6).map(a => a.action),
                    datasets: [{
                        data: stats.byAction.slice(0, 6).map(a => a.count),
                        backgroundColor: [
                            '#3b82f6',
                            '#8b5cf6',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#6b7280'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#9ca3af' }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#9ca3af'
                        }
                    }
                }
            });
        }

        // Load logs
        async function loadLogs(page = 1) {
            currentPage = page;

            // Build query params
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50'
            });

            const actor = document.getElementById('filterActor').value;
            const action = document.getElementById('filterAction').value;
            const resource = document.getElementById('filterResource').value;
            const dateRange = document.getElementById('filterDateRange').value;

            if (actor) params.append('actor', actor);
            if (action) params.append('action', action);
            if (resource) params.append('resource', resource);

            // Calculate date range
            if (dateRange !== 'custom') {
                const endDate = new Date();
                let startDate = new Date();
                
                switch (dateRange) {
                    case 'today':
                        startDate = new Date();
                        break;
                    case 'yesterday':
                        startDate.setDate(startDate.getDate() - 1);
                        endDate.setDate(endDate.getDate() - 1);
                        break;
                    case '7days':
                        startDate.setDate(startDate.getDate() - 7);
                        break;
                    case '30days':
                        startDate.setDate(startDate.getDate() - 30);
                        break;
                }
                
                params.append('start_date', startDate.toISOString().split('T')[0]);
                params.append('end_date', endDate.toISOString().split('T')[0]);
            }

            try {
                const response = await fetch('/api/crm/activity-logs/list?' + params.toString(), {
                    credentials: 'include'
                });
                
                console.log('List API response:', response.status, response.statusText);
                
                if (!response.ok) {
                    if (response.status === 401) {
                        showError('Authentication required. Please login as admin.');
                    } else {
                        showError('Failed to load logs: HTTP ' + response.status);
                    }
                    return;
                }
                
                const data = await response.json();
                console.log('List data:', data);

                if (data.success) {
                    displayLogs(data.data.logs);
                    updatePagination(data.data.pagination);
                } else {
                    showError('Failed to load logs: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error loading logs:', error);
                showError('Failed to load logs. Check console for details.');
            }
        }

        // Display logs
        function displayLogs(logs) {
            const tbody = document.getElementById('logsTableBody');

            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-400">No logs found</td></tr>';
                return;
            }

            const logsHtml = logs.map(log => \`
                <tr class="log-row">
                    <td class="px-6 py-4 text-sm text-gray-300">
                        \${new Date(log.created_at).toLocaleString()}
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-white">\${log.actor_name || 'System'}</div>
                        <div class="text-xs text-gray-400">\${log.actor_email || '--'}</div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded text-xs font-medium bg-blue-900 text-blue-200">
                            \${log.action}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-300">
                        <div>\${log.resource_type || '--'}</div>
                        \${log.resource_id ? '<div class="text-xs text-gray-400">ID: ' + log.resource_id + '</div>' : ''}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-300">
                        \${log.description || '--'}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-400">
                        \${log.ip_address || '--'}
                    </td>
                    <td class="px-6 py-4 text-center">
                        <button onclick="deleteLog(\${log.id})" class="text-red-400 hover:text-red-300" title="Delete log">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            \`).join('');

            tbody.innerHTML = logsHtml;
        }

        // Update pagination
        function updatePagination(pagination) {
            totalPages = pagination.totalPages;
            
            document.getElementById('showingStart').textContent = ((pagination.page - 1) * pagination.limit + 1);
            document.getElementById('showingEnd').textContent = Math.min(pagination.page * pagination.limit, pagination.total);
            document.getElementById('showingTotal').textContent = pagination.total;

            const buttons = [];
            
            // Previous button
            if (pagination.page > 1) {
                buttons.push(\`<button onclick="loadLogs(\${pagination.page - 1})" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Previous</button>\`);
            }

            // Page numbers
            for (let i = Math.max(1, pagination.page - 2); i <= Math.min(totalPages, pagination.page + 2); i++) {
                const activeClass = i === pagination.page ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600';
                buttons.push(\`<button onclick="loadLogs(\${i})" class="px-4 py-2 \${activeClass} rounded-lg">\${i}</button>\`);
            }

            // Next button
            if (pagination.page < totalPages) {
                buttons.push(\`<button onclick="loadLogs(\${pagination.page + 1})" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Next</button>\`);
            }

            document.getElementById('paginationButtons').innerHTML = buttons.join('');
        }

        // Apply filters
        function applyFilters() {
            loadLogs(1);
        }

        // Clear filters
        function clearFilters() {
            document.getElementById('filterActor').value = '';
            document.getElementById('filterAction').value = '';
            document.getElementById('filterResource').value = '';
            document.getElementById('filterDateRange').value = '7days';
            loadLogs(1);
        }

        // Refresh logs
        function refreshLogs() {
            loadStats();
            loadLogs(currentPage);
        }

        // Show error
        function showError(message) {
            const tbody = document.getElementById('logsTableBody');
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-red-400">' + message + '</td></tr>';
        }

        // Delete activity log
        async function deleteLog(logId) {
            if (!confirm('Are you sure you want to delete this activity log?\\n\\nThis action cannot be undone and is typically only done for GDPR compliance or data cleanup.')) {
                return;
            }

            try {
                const response = await fetch('/api/crm/activity-logs/' + logId, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    alert('Activity log deleted successfully');
                    loadLogs(currentPage); // Refresh current page
                    loadStats(); // Refresh stats
                } else {
                    alert('Failed to delete activity log: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error deleting activity log:', error);
                alert('Failed to delete activity log. Please try again.');
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadStats();
            loadLogs();
        });
    </script>
    
      ${CRM_SIDEBAR_PERMISSION_SCRIPT}
  </body>
</html>
`;
