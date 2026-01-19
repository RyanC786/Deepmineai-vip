/**
 * Admin Users Management Page
 * Complete user management with search, filter, and actions
 */

export const adminUsersHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - DeepMine AI Admin</title>
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
            max-width: 1600px;
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

        .toolbar {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .search-box {
            flex: 1;
            min-width: 300px;
            position: relative;
        }

        .search-input {
            width: 100%;
            background: var(--dark-hover);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 10px 15px 10px 40px;
            border-radius: 8px;
            font-size: 14px;
        }

        .search-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
        }

        .filter-select {
            background: var(--dark-hover);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
        }

        .btn {
            background: var(--primary);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn:hover {
            background: #2563EB;
            transform: translateY(-2px);
        }

        .btn-success { background: var(--success); }
        .btn-success:hover { background: #059669; }

        .stats-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-chip {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .stat-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .stat-content {
            flex: 1;
        }

        .stat-label {
            font-size: 12px;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
        }

        .users-table-container {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            overflow: hidden;
        }

        .users-table {
            width: 100%;
            border-collapse: collapse;
        }

        .users-table th {
            background: rgba(59, 130, 246, 0.1);
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border-color);
        }

        .users-table td {
            padding: 15px;
            border-bottom: 1px solid var(--border-color);
        }

        .users-table tr:hover {
            background: var(--dark-hover);
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: linear-gradient(135deg, var(--primary), #8B5CF6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
        }

        .user-details h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .user-details p {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); }
        .badge-warning { background: rgba(245, 158, 11, 0.2); color: var(--warning); }
        .badge-danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
        .badge-info { background: rgba(59, 130, 246, 0.2); color: var(--primary); }

        .action-btn {
            background: none;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }

        .action-btn:hover {
            background: var(--primary);
            border-color: var(--primary);
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

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: var(--dark-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 700;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            background: var(--dark-hover);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 30px;
        }

        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column;
            }

            .search-box {
                min-width: 100%;
            }

            .users-table-container {
                overflow-x: auto;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <div style="background: #1A1F35; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(59, 130, 246, 0.2);">
        <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" style="height: 35px;">
            <span style="font-size: 18px; font-weight: 700; color: #33F0FF;">DeepMine AI - Admin</span>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <a href="/admin/dashboard" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px; transition: all 0.3s;">
                <i class="fas fa-chart-line"></i> Dashboard
            </a>
            <a href="/admin/users" style="color: #33F0FF; text-decoration: none; padding: 8px 16px; border-radius: 8px; background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.5);">
                <i class="fas fa-users"></i> Users
            </a>
            <a href="/admin/kyc" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px;">
                <i class="fas fa-id-card"></i> KYC
            </a>
            <a href="/admin/machines" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px;">
                <i class="fas fa-server"></i> Machines
            </a>
            <a href="/admin/withdrawals" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px;">
                <i class="fas fa-money-bill-wave"></i> Withdrawals
            </a>
            <a href="/admin/deposits" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px;">
                <i class="fas fa-wallet"></i> Deposits
            </a>
            <a href="/admin/referrals" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px;">
                <i class="fas fa-users-cog"></i> Referrals
            </a>
            <a href="/admin/reports" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px;">
                <i class="fas fa-chart-bar"></i> Reports
            </a>
            <a href="/admin/crm/dashboard" style="color: #E0E7FF; text-decoration: none; padding: 8px 16px; border-radius: 8px; background: rgba(41, 121, 255, 0.2);">
                <i class="fas fa-headset"></i> CRM
            </a>
        </div>
    </div>

    <div class="container">
        <div class="header">
            <h1 class="title">User Management</h1>
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
            <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id="searchInput" placeholder="Search by name, email, or ID...">
            </div>

            <select class="filter-select" id="kycFilter">
                <option value="">All KYC Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
            </select>

            <select class="filter-select" id="statusFilter">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
            </select>

            <button class="btn btn-success" onclick="refreshUsers()">
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
            <p>Loading users...</p>
        </div>

        <!-- Users Table -->
        <div class="users-table-container" id="usersTable" style="display: none;">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>KYC Status</th>
                        <th>VIP Level</th>
                        <th>Balance</th>
                        <th>Referrals</th>
                        <th>Miners</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                    <!-- Users will be injected here -->
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div class="empty-state" id="emptyState" style="display: none;">
            <i class="fas fa-users"></i>
            <h3>No Users Found</h3>
            <p>No users match your search criteria.</p>
        </div>
    </div>

    <!-- User Details Modal -->
    <div class="modal" id="userModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">User Details</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div id="userModalContent">
                <!-- User details will be injected here -->
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;

        let allUsers = [];
        let filteredUsers = [];

        // Format currency
        function formatCurrency(amount) {
            return '$' + (amount || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        // Get initials
        function getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }

        // Load users
        async function loadUsers() {
            try {
                document.getElementById('loadingState').style.display = 'block';
                document.getElementById('usersTable').style.display = 'none';
                document.getElementById('emptyState').style.display = 'none';

                const response = await axios.get('/api/admin/users');
                if (response.data.success) {
                    allUsers = response.data.users || [];
                    applyFilters();
                    displayStats();
                }
            } catch (error) {
                console.error('Error loading users:', error);
                document.getElementById('loadingState').innerHTML = '<p style="color: #EF4444;">Failed to load users</p>';
            }
        }

        // Apply filters
        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const kycFilter = document.getElementById('kycFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;

            filteredUsers = allUsers.filter(user => {
                const matchesSearch = !searchTerm || 
                    user.full_name?.toLowerCase().includes(searchTerm) ||
                    user.email?.toLowerCase().includes(searchTerm) ||
                    user.id?.toString().includes(searchTerm);

                const matchesKyc = !kycFilter || user.kyc_status === kycFilter;
                const matchesStatus = !statusFilter || user.account_status === statusFilter;

                return matchesSearch && matchesKyc && matchesStatus;
            });

            displayUsers();
        }

        // Display users
        function displayUsers() {
            if (filteredUsers.length === 0) {
                document.getElementById('loadingState').style.display = 'none';
                document.getElementById('usersTable').style.display = 'none';
                document.getElementById('emptyState').style.display = 'block';
                return;
            }

            const html = filteredUsers.map(user => {
                const kycBadge = user.kyc_status === 'approved' ? 'badge-success' : 
                                user.kyc_status === 'pending' ? 'badge-warning' : 'badge-danger';
                
                const statusBadge = user.account_status === 'active' ? 'badge-success' :
                                   user.account_status === 'suspended' ? 'badge-warning' : 'badge-danger';

                return \`
                    <tr>
                        <td>
                            <div class="user-info">
                                <div class="user-avatar" title="User ID: \${user.id}">\${getInitials(user.full_name)}</div>
                                <div class="user-details">
                                    <h4>\${user.full_name || 'User ' + user.id}</h4>
                                    <p>\${user.email}</p>
                                    <p style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">ID: \${user.id}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="badge \${kycBadge}">\${user.kyc_status || 'pending'}</span>
                        </td>
                        <td>VIP \${user.vip_level || 1}</td>
                        <td>\${formatCurrency(user.balance)}</td>
                        <td>
                            <div>\${user.direct_referrals || 0} direct</div>
                            <div style="font-size: 11px; color: var(--text-secondary);">\${user.network_size || 0} network</div>
                        </td>
                        <td>\${user.active_miners || 0}</td>
                        <td>
                            <span class="badge \${statusBadge}">\${user.account_status || 'active'}</span>
                        </td>
                        <td>
                            <button class="action-btn" onclick="viewUser(\${user.id})">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                \`;
            }).join('');

            document.getElementById('usersTableBody').innerHTML = html;
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('usersTable').style.display = 'block';
            document.getElementById('emptyState').style.display = 'none';
        }

        // Display stats
        function displayStats() {
            const total = allUsers.length;
            const verified = allUsers.filter(u => u.kyc_status === 'approved').length;
            const pending = allUsers.filter(u => u.kyc_status === 'pending').length;
            const totalBalance = allUsers.reduce((sum, u) => sum + (u.balance || 0), 0);

            const statsHTML = \`
                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: var(--primary);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Users</div>
                        <div class="stat-value">\${total}</div>
                    </div>
                </div>

                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Verified</div>
                        <div class="stat-value">\${verified}</div>
                    </div>
                </div>

                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Pending KYC</div>
                        <div class="stat-value">\${pending}</div>
                    </div>
                </div>

                <div class="stat-chip">
                    <div class="stat-icon" style="background: rgba(139, 92, 246, 0.1); color: #8B5CF6;">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Balance</div>
                        <div class="stat-value">\${formatCurrency(totalBalance)}</div>
                    </div>
                </div>
            \`;

            document.getElementById('statsBar').innerHTML = statsHTML;
        }

        // View user details
        async function viewUser(userId) {
            try {
                const response = await axios.get(\`/api/admin/user/\${userId}\`);
                if (response.data.success) {
                    const user = response.data.user;
                    
                    const modalContent = \`
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-input" value="\${user.full_name || ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="text" class="form-input" value="\${user.email || ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Referral Code</label>
                            <input type="text" class="form-input" value="\${user.referral_code || ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Balance</label>
                            <input type="text" class="form-input" value="\${formatCurrency(user.balance)}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">KYC Status</label>
                            <input type="text" class="form-input" value="\${user.kyc_status || 'pending'}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">VIP Level</label>
                            <input type="text" class="form-input" value="VIP \${user.vip_level || 1}" readonly>
                        </div>
                        <div class="form-actions">
                            <button class="btn" onclick="window.location.href='/admin/referrals?user=\${user.id}'">
                                <i class="fas fa-users-cog"></i> View Referrals
                            </button>
                            <button class="btn" onclick="closeModal()">Close</button>
                        </div>
                    \`;

                    document.getElementById('userModalContent').innerHTML = modalContent;
                    document.getElementById('userModal').classList.add('active');
                }
            } catch (error) {
                console.error('Error loading user details:', error);
                alert('Failed to load user details');
            }
        }

        // Close modal
        function closeModal() {
            document.getElementById('userModal').classList.remove('active');
        }

        // Refresh users
        function refreshUsers() {
            loadUsers();
        }

        // Event listeners
        document.getElementById('searchInput').addEventListener('input', applyFilters);
        document.getElementById('kycFilter').addEventListener('change', applyFilters);
        document.getElementById('statusFilter').addEventListener('change', applyFilters);

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadUsers();
        });
    </script>
</body>
</html>
`;
