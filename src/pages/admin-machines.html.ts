export const adminMachinesPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Machines - DeepMine AI Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            min-height: 100vh;
        }
        .nav-container {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(41, 121, 255, 0.2);
            padding: 16px 24px;
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
        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-pending {
            background: rgba(251, 191, 36, 0.1);
            color: #FBBF24;
            border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .status-active {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .status-rejected {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .status-expired {
            background: rgba(156, 163, 175, 0.1);
            color: #9CA3AF;
            border: 1px solid rgba(156, 163, 175, 0.3);
        }
        .action-btn {
            padding: 6px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
        }
        .btn-activate {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .btn-activate:hover {
            background: rgba(34, 197, 94, 0.3);
        }
        .btn-reject {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .btn-reject:hover {
            background: rgba(239, 68, 68, 0.3);
        }
        .stats-card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
        }
        .stats-card .text-gray-600 {
            color: #B0B8D4 !important;
        }
        .stats-card .text-gray-800 {
            color: #33F0FF !important;
        }
        .stats-card .text-yellow-600 {
            color: #FBBF24 !important;
        }
        .stats-card .text-green-600 {
            color: #22C55E !important;
        }
        .stats-card .text-red-600 {
            color: #EF4444 !important;
        }
        .stats-card .text-blue-600 {
            color: #2979FF !important;
        }
        .table-container {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 12px;
            overflow: hidden;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: rgba(41, 121, 255, 0.05);
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #B0B8D4;
            border-bottom: 1px solid rgba(41, 121, 255, 0.2);
        }
        td {
            padding: 12px;
            border-bottom: 1px solid rgba(41, 121, 255, 0.1);
            color: #E0E7FF;
        }
        tr:hover {
            background: rgba(41, 121, 255, 0.05);
        }
        .filter-btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid rgba(41, 121, 255, 0.3);
            background: rgba(41, 121, 255, 0.1);
            color: #B0B8D4;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
        }
        .filter-btn.active {
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            color: #ffffff;
            border-color: #33F0FF;
            box-shadow: 0 4px 12px rgba(51, 240, 255, 0.3);
        }
        .filter-btn:hover {
            background: rgba(41, 121, 255, 0.2);
            border-color: #2979FF;
            color: #E0E7FF;
        }
        h1, h2 {
            color: #ffffff;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="nav-container">
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center">
                <div class="logo">
                    <img src="/static/dragon-logo-v2.png" alt="DeepMine AI">
                    <span>DeepMine AI Admin</span>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/admin/dashboard" class="text-white hover:text-gray-200">
                        <i class="fas fa-chart-line mr-2"></i>Dashboard
                    </a>
                    <a href="/admin/users" class="text-white hover:text-gray-200">
                        <i class="fas fa-users mr-2"></i>Users
                    </a>
                    <a href="/admin/kyc" class="text-white hover:text-gray-200">
                        <i class="fas fa-id-card mr-2"></i>KYC
                    </a>
                    <a href="/admin/machines" class="text-white hover:text-gray-200 font-bold">
                        <i class="fas fa-server mr-2"></i>Machines
                    </a>
                    <a href="/admin/withdrawals" class="text-white hover:text-gray-200">
                        <i class="fas fa-money-bill-wave mr-2"></i>Withdrawals
                    </a>
                    <a href="/admin/deposits" class="text-white hover:text-gray-200">
                        <i class="fas fa-wallet mr-2"></i>Deposits
                    </a>
                    <a href="/admin/referrals" class="text-white hover:text-gray-200">
                        <i class="fas fa-users-cog mr-2"></i>Referrals
                    </a>
                    <a href="/admin/reports" class="text-white hover:text-gray-200">
                        <i class="fas fa-chart-bar mr-2"></i>Reports
                    </a>
                    <a href="/admin/crm/dashboard" class="text-white hover:text-gray-200" style="background: rgba(41, 121, 255, 0.2); padding: 8px 16px; border-radius: 8px;">
                        <i class="fas fa-headset mr-2"></i>CRM
                    </a>
                    <button onclick="logout()" class="text-white hover:text-gray-200">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div class="stats-card">
                <div class="text-gray-600 text-sm mb-1">Total Machines</div>
                <div id="stat-total" class="text-2xl font-bold text-gray-800">-</div>
            </div>
            <div class="stats-card">
                <div class="text-gray-600 text-sm mb-1">Pending</div>
                <div id="stat-pending" class="text-2xl font-bold text-yellow-600">-</div>
            </div>
            <div class="stats-card">
                <div class="text-gray-600 text-sm mb-1">Active</div>
                <div id="stat-active" class="text-2xl font-bold text-green-600">-</div>
            </div>
            <div class="stats-card">
                <div class="text-gray-600 text-sm mb-1">Rejected</div>
                <div id="stat-rejected" class="text-2xl font-bold text-red-600">-</div>
            </div>
            <div class="stats-card">
                <div class="text-gray-600 text-sm mb-1">Total Invested</div>
                <div id="stat-invested" class="text-2xl font-bold text-purple-600">-</div>
            </div>
        </div>

        <!-- Filters -->
        <div style="background: rgba(26, 31, 53, 0.6); backdrop-filter: blur(10px); border: 1px solid rgba(41, 121, 255, 0.2); border-radius: 12px; padding: 16px; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);">
            <div class="flex items-center space-x-4">
                <span style="color: #E0E7FF; font-weight: 600;">Filter:</span>
                <button class="filter-btn active" onclick="filterMachines('all')">All</button>
                <button class="filter-btn" onclick="filterMachines('pending')">Pending</button>
                <button class="filter-btn" onclick="filterMachines('active')">Active</button>
                <button class="filter-btn" onclick="filterMachines('rejected')">Rejected</button>
                <button class="filter-btn" onclick="filterMachines('expired')">Expired</button>
            </div>
        </div>

        <!-- Machines Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Package</th>
                        <th>Price</th>
                        <th>Daily Earnings</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Purchase Date</th>
                        <th>Expires At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="machines-table-body">
                    <tr>
                        <td colspan="10" class="text-center py-8 text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i>Loading machines...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;
        
        let allMachines = [];
        let currentFilter = 'all';

        // Load statistics
        async function loadStats() {
            try {
                const response = await axios.get('/api/admin/machines/stats');
                const stats = response.data.stats;
                
                document.getElementById('stat-total').textContent = stats.total_machines || 0;
                document.getElementById('stat-pending').textContent = stats.pending || 0;
                document.getElementById('stat-active').textContent = stats.active || 0;
                document.getElementById('stat-rejected').textContent = stats.rejected || 0;
                document.getElementById('stat-invested').textContent = '$' + (stats.total_invested || 0).toFixed(2);
            } catch (error) {
                console.error('Load stats error:', error);
            }
        }

        // Load machines
        async function loadMachines() {
            try {
                const response = await axios.get('/api/admin/machines/list');
                allMachines = response.data.machines;
                renderMachines();
            } catch (error) {
                console.error('Load machines error:', error);
                document.getElementById('machines-table-body').innerHTML = \`
                    <tr>
                        <td colspan="10" class="text-center py-8 text-red-500">
                            Failed to load machines. Please try again.
                        </td>
                    </tr>
                \`;
            }
        }

        // Render machines table
        function renderMachines() {
            const tbody = document.getElementById('machines-table-body');
            
            let filteredMachines = allMachines;
            if (currentFilter !== 'all') {
                filteredMachines = allMachines.filter(m => m.activation_status === currentFilter);
            }

            if (filteredMachines.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="10" class="text-center py-8 text-gray-500">
                            No machines found with status: \${currentFilter}
                        </td>
                    </tr>
                \`;
                return;
            }

            tbody.innerHTML = filteredMachines.map(machine => {
                const statusClass = \`status-\${machine.activation_status}\`;
                const purchaseDate = new Date(machine.created_at).toLocaleDateString();
                const expiresAt = machine.expires_at ? new Date(machine.expires_at).toLocaleDateString() : '-';
                
                let actions = '';
                if (machine.activation_status === 'pending') {
                    actions = \`
                        <button onclick="activateMachine(\${machine.machine_id})" class="action-btn btn-activate">
                            <i class="fas fa-check mr-1"></i>Activate
                        </button>
                        <button onclick="rejectMachine(\${machine.machine_id})" class="action-btn btn-reject ml-2">
                            <i class="fas fa-times mr-1"></i>Reject
                        </button>
                    \`;
                } else {
                    actions = '<span class="text-gray-400 text-sm">No actions</span>';
                }

                return \`
                    <tr>
                        <td>#\${machine.machine_id}</td>
                        <td>
                            <div class="font-semibold">\${machine.full_name || 'N/A'}</div>
                            <div class="text-sm text-gray-600">\${machine.email}</div>
                        </td>
                        <td>\${machine.package_name}</td>
                        <td class="font-semibold">$\${machine.purchase_price}</td>
                        <td class="text-green-600 font-semibold">$\${machine.daily_earnings}/day</td>
                        <td>\${machine.duration_days} days</td>
                        <td>
                            <span class="status-badge \${statusClass}">
                                \${machine.activation_status.toUpperCase()}
                            </span>
                        </td>
                        <td>\${purchaseDate}</td>
                        <td>\${expiresAt}</td>
                        <td>\${actions}</td>
                    </tr>
                \`;
            }).join('');
        }

        // Filter machines
        function filterMachines(status) {
            currentFilter = status;
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            renderMachines();
        }

        // Activate machine
        async function activateMachine(machineId) {
            if (!confirm('Are you sure you want to activate this machine?\\n\\nThis will:\\n- Start the 180-day contract\\n- Begin daily earnings\\n- Cannot be undone')) {
                return;
            }

            try {
                console.log('Activating machine:', machineId);
                const response = await axios.post(\`/api/admin/machines/\${machineId}/activate\`);
                console.log('Activation response:', response.data);
                alert('✅ ' + response.data.message);
                
                // Reload data
                await loadStats();
                await loadMachines();
            } catch (error) {
                console.error('Activate error:', error);
                console.error('Error response:', error.response);
                const errorMsg = error.response?.data?.message || 'Failed to activate machine';
                alert('❌ ' + errorMsg);
                
                // If authentication failed, redirect to login
                if (error.response?.status === 401) {
                    if (confirm('Session expired. Redirect to login?')) {
                        window.location.href = '/admin/panel/login';
                    }
                }
            }
        }

        // Reject machine
        async function rejectMachine(machineId) {
            const reason = prompt('Reason for rejection (optional):');
            if (reason === null) return; // User cancelled

            if (!confirm('Are you sure you want to reject this machine?\\n\\nThis will:\\n- Refund the purchase price to user\\n- Update total_invested\\n- Cannot be undone')) {
                return;
            }

            try {
                console.log('Rejecting machine:', machineId);
                const response = await axios.post(\`/api/admin/machines/\${machineId}/reject\`, {
                    reason: reason || 'No reason provided'
                });
                console.log('Rejection response:', response.data);
                alert('✅ ' + response.data.message + '\\n\\nRefund: $' + response.data.refund_amount);
                
                // Reload data
                await loadStats();
                await loadMachines();
            } catch (error) {
                console.error('Reject error:', error);
                console.error('Error response:', error.response);
                const errorMsg = error.response?.data?.message || 'Failed to reject machine';
                alert('❌ ' + errorMsg);
                
                // If authentication failed, redirect to login
                if (error.response?.status === 401) {
                    if (confirm('Session expired. Redirect to login?')) {
                        window.location.href = '/admin/panel/login';
                    }
                }
            }
        }

        // Logout
        async function logout() {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await axios.post('/api/admin/auth/logout');
                    window.location.href = '/admin/login';
                } catch (error) {
                    console.error('Logout error:', error);
                    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    window.location.href = '/admin/login';
                }
            }
        }
        
        // Check authentication on page load
        async function checkAuth() {
            try {
                await axios.get('/api/admin/auth/me');
            } catch (error) {
                // Not authenticated, redirect to login
                window.location.href = '/admin/login';
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', async () => {
            await checkAuth();
            await loadStats();
            await loadMachines();
        });
    </script>
</body>
</html>
`;
