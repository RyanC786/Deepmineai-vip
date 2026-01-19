export const adminDashboardSimpleHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - DeepMine AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            min-height: 100vh;
        }
        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: linear-gradient(135deg, #33F0FF 0%, #2979FF 100%); color: white; }
        .btn-danger { background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%); color: white; }
        .btn-success { background: linear-gradient(135deg, #51CF66 0%, #37B24D 100%); color: white; }
        .tab-btn {
            padding: 12px 24px;
            background: transparent;
            color: #94A3B8;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        .tab-btn.active {
            color: #33F0FF;
            border-bottom-color: #33F0FF;
        }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(26, 31, 53, 0.6);
            border-radius: 12px;
            overflow: hidden;
        }
        th {
            background: rgba(51, 240, 255, 0.1);
            padding: 16px;
            text-align: left;
            font-weight: 700;
            color: #33F0FF;
            border-bottom: 2px solid rgba(51, 240, 255, 0.3);
        }
        td {
            padding: 16px;
            border-bottom: 1px solid rgba(51, 240, 255, 0.1);
            color: #E0E7FF;
        }
        tr:hover { background: rgba(51, 240, 255, 0.05); }
        .badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
        }
        .badge-success { background: rgba(81, 207, 102, 0.2); color: #51CF66; }
        .badge-warning { background: rgba(255, 165, 0, 0.2); color: #FFA500; }
        .badge-danger { background: rgba(255, 107, 107, 0.2); color: #FF6B6B; }
        .badge-primary { background: rgba(51, 240, 255, 0.2); color: #33F0FF; }
        .admin-logo {
            height: 50px;
            width: auto;
            margin-right: 15px;
            animation: logoGlow 2s ease-in-out infinite;
            filter: drop-shadow(0 0 15px rgba(255, 107, 107, 0.5));
            vertical-align: middle;
        }
        @keyframes logoGlow {
            0%, 100% { 
                filter: drop-shadow(0 0 15px rgba(255, 107, 107, 0.6));
                opacity: 1;
            }
            50% { 
                filter: drop-shadow(0 0 30px rgba(255, 107, 107, 0.9));
                opacity: 0.85;
            }
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            backdrop-filter: blur(5px);
        }
        .modal.active { display: flex; align-items: center; justify-content: center; }
        .modal-content {
            background: linear-gradient(135deg, #1A1F35 0%, #0B0F1E 100%);
            padding: 30px;
            border-radius: 12px;
            border: 2px solid rgba(51, 240, 255, 0.3);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .form-group { margin-bottom: 20px; }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #33F0FF;
            font-weight: 600;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid rgba(51, 240, 255, 0.3);
            background: rgba(26, 31, 53, 0.6);
            color: white;
        }
    </style>
</head>
<body class="text-white p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-lg p-6 mb-6 border border-cyan-500 border-opacity-20">
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-cyan-400 flex items-center">
                    <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="admin-logo">
                    <span><i class="fas fa-shield-alt"></i> Admin Dashboard v4.0</span>
                </h1>
                <div class="flex gap-3 items-center">
                    <div id="status" class="px-4 py-2 rounded bg-yellow-600 font-semibold">Loading...</div>
                    <a href="/admin/kyc" class="btn btn-primary">
                        <i class="fas fa-id-card"></i> KYC Management
                    </a>
                    <button onclick="handleLogout()" class="btn btn-danger">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-5 gap-4 mb-6">
            <div class="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-6 text-center shadow-lg">
                <div id="totalUsers" class="text-4xl font-bold">0</div>
                <div class="text-sm mt-2 opacity-90">Total Users</div>
            </div>
            <div class="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-6 text-center shadow-lg">
                <div id="verifiedUsers" class="text-4xl font-bold">0</div>
                <div class="text-sm mt-2 opacity-90">Verified Users</div>
            </div>
            <div class="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-6 text-center shadow-lg">
                <div id="activeMiners" class="text-4xl font-bold">0</div>
                <div class="text-sm mt-2 opacity-90">Active Miners</div>
            </div>
            <div class="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-6 text-center shadow-lg">
                <div id="totalBalance" class="text-4xl font-bold">$0</div>
                <div class="text-sm mt-2 opacity-90">Total Balance</div>
            </div>
            <div class="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-6 text-center shadow-lg">
                <div id="commissions" class="text-4xl font-bold">$0</div>
                <div class="text-sm mt-2 opacity-90">Commissions Paid</div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-lg border border-cyan-500 border-opacity-20 p-6">
            <div class="flex gap-2 border-b border-cyan-500 border-opacity-20 mb-6">
                <button class="tab-btn active" onclick="switchTab('users')">
                    <i class="fas fa-users"></i> Users
                </button>
                <button class="tab-btn" onclick="switchTab('miners')">
                    <i class="fas fa-server"></i> Active Miners
                </button>
                <button class="tab-btn" onclick="switchTab('packages')">
                    <i class="fas fa-box"></i> Package Types
                </button>
            </div>

            <!-- Users Tab -->
            <div id="usersTab" class="tab-content active">
                <div class="flex justify-between mb-4">
                    <h3 class="text-xl font-bold text-cyan-400">User Management</h3>
                    <input type="text" id="userSearch" placeholder="Search users..." 
                        class="px-4 py-2 rounded bg-gray-700 border border-cyan-500 border-opacity-30 text-white"
                        onkeyup="filterUsers()">
                </div>
                <div class="overflow-x-auto">
                    <table id="usersTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Referral Code</th>
                                <th>VIP</th>
                                <th>Referrals</th>
                                <th>Balance</th>
                                <th>KYC</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="9" class="text-center py-8">Loading users...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Active Miners Tab -->
            <div id="minersTab" class="tab-content">
                <h3 class="text-xl font-bold text-cyan-400 mb-4">Active Miners - Package Ownership</h3>
                <div class="overflow-x-auto">
                    <table id="minersTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Package</th>
                                <th>Hash Rate</th>
                                <th>Daily Rate</th>
                                <th>Total Earned</th>
                                <th>Started</th>
                                <th>Expires</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="9" class="text-center py-8">Loading miners...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Packages Tab -->
            <div id="packagesTab" class="tab-content">
                <div class="flex justify-between mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-cyan-400">Mining Package Types</h3>
                        <p class="text-sm text-gray-400 mt-1">
                            <i class="fas fa-info-circle"></i> These are package templates that users can purchase
                        </p>
                    </div>
                    <button onclick="showCreatePackageModal()" class="btn btn-success">
                        <i class="fas fa-plus"></i> Create Package Type
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table id="packagesTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Hash Rate</th>
                                <th>Price</th>
                                <th>Daily Earnings</th>
                                <th>Duration</th>
                                <th>Purchases</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="9" class="text-center py-8">Loading packages...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Create Package Modal -->
        <div id="createPackageModal" class="modal">
            <div class="modal-content">
                <h2 class="text-2xl font-bold text-cyan-400 mb-6">
                    <i class="fas fa-box"></i> Create New Package Type
                </h2>
                <form id="createPackageForm" onsubmit="createPackage(event)">
                    <div class="form-group">
                        <label>Package Name *</label>
                        <input type="text" name="name" placeholder="e.g., Starter Miner" required>
                    </div>
                    <div class="form-group">
                        <label>Hash Rate (TH/s) *</label>
                        <input type="number" name="hash_rate" step="0.01" placeholder="e.g., 1.5" required>
                    </div>
                    <div class="form-group">
                        <label>Price (USD) *</label>
                        <input type="number" name="price" step="0.01" placeholder="e.g., 99.99" required>
                    </div>
                    <div class="form-group">
                        <label>Daily Earnings (USD) *</label>
                        <input type="number" name="daily_earnings" step="0.0001" placeholder="e.g., 0.0015" required>
                    </div>
                    <div class="form-group">
                        <label>Duration (Days) *</label>
                        <input type="number" name="duration_days" placeholder="e.g., 365" required>
                    </div>
                    <div class="form-group">
                        <label>Description (Optional)</label>
                        <textarea name="description" rows="3" placeholder="Package description..."></textarea>
                    </div>
                    <div class="flex gap-3 justify-end">
                        <button type="button" onclick="closeModal()" class="btn btn-danger">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-check"></i> Create Package
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const status = document.getElementById('status');
        let allUsers = [];
        let allMiners = [];
        let allPackages = [];
        const VERSION = Date.now(); // Cache buster
        
        console.log('=== ADMIN DASHBOARD v4.0 LOADING ===');
        console.log('Timestamp:', new Date().toISOString());

        // Logout function
        window.handleLogout = async function() {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                } catch (e) {}
                window.location.href = '/admin-login';
            }
        }

        // Switch tabs
        window.switchTab = function(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tab + 'Tab').classList.add('active');
            
            if (tab === 'miners' && allMiners.length === 0) loadMiners();
            if (tab === 'packages' && allPackages.length === 0) loadPackages();
        }

        // Filter users
        window.filterUsers = function() {
            const search = document.getElementById('userSearch').value.toLowerCase();
            const filtered = allUsers.filter(u => 
                u.email.toLowerCase().includes(search) ||
                (u.full_name && u.full_name.toLowerCase().includes(search)) ||
                (u.referral_code && u.referral_code.toLowerCase().includes(search))
            );
            renderUsers(filtered);
        }

        // Load stats
        async function loadStats() {
            status.textContent = 'Loading...';
            status.className = 'px-4 py-2 rounded bg-yellow-600 font-semibold';
            
            try {
                console.log('[loadStats] Fetching stats...');
                const res = await fetch('/api/admin/stats?v=' + VERSION, { 
                    credentials: 'include',
                    cache: 'no-cache'
                });
                console.log('[loadStats] Response status:', res.status);
                const data = await res.json();
                
                if (data.success) {
                    document.getElementById('totalUsers').textContent = data.stats.total_users;
                    document.getElementById('verifiedUsers').textContent = data.stats.verified_users;
                    document.getElementById('activeMiners').textContent = data.stats.active_miners;
                    document.getElementById('totalBalance').textContent = '$' + data.stats.total_balance.toFixed(2);
                    document.getElementById('commissions').textContent = '$' + data.stats.total_commissions_paid.toFixed(2);
                    
                    status.textContent = 'Authenticated';
                    status.className = 'px-4 py-2 rounded bg-green-600 font-semibold';
                } else {
                    status.textContent = 'Not authenticated';
                    status.className = 'px-4 py-2 rounded bg-red-600 font-semibold';
                    setTimeout(() => { window.location.href = '/admin-login'; }, 2000);
                }
            } catch (error) {
                status.textContent = 'Error';
                status.className = 'px-4 py-2 rounded bg-red-600 font-semibold';
            }
        }

        // Load users
        async function loadUsers() {
            try {
                const res = await fetch('/api/admin/users', { credentials: 'include' });
                const data = await res.json();
                if (data.success) {
                    allUsers = data.users;
                    renderUsers(allUsers);
                }
            } catch (e) {}
        }

        // Render users
        function renderUsers(users) {
            const tbody = document.querySelector('#usersTable tbody');
            if (!users || users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center py-8">No users found</td></tr>';
                return;
            }
            
            tbody.innerHTML = users.map(u => {
                const kycBadge = u.kyc_status === 'approved' ? 'badge-success' : u.kyc_status === 'pending' ? 'badge-warning' : 'badge-danger';
                const statusBadge = u.account_status === 'active' ? 'badge-success' : 'badge-danger';
                const canDelete = (u.kyc_status === 'pending' || u.kyc_status === 'rejected') && (u.active_miners === 0);
                const deleteBtn = canDelete ? '<button data-id="' + u.id + '" data-email="' + u.email + '" onclick="deleteUserById(this)" class="btn btn-danger text-xs ml-2">Delete</button>' : '';
                
                return '<tr>' +
                    '<td>' + u.id + '</td>' +
                    '<td><div class="font-semibold">' + (u.full_name || 'N/A') + '</div><div class="text-xs text-gray-400">' + u.email + '</div></td>' +
                    '<td><code class="bg-gray-700 px-2 py-1 rounded text-xs">' + (u.referral_code || 'N/A') + '</code></td>' +
                    '<td><span class="badge badge-warning">VIP ' + (u.vip_level || 1) + '</span></td>' +
                    '<td>' + (u.direct_referrals || 0) + ' / ' + (u.network_size || 0) + '</td>' +
                    '<td class="font-semibold">$' + (u.balance || 0).toFixed(2) + '</td>' +
                    '<td><span class="badge ' + kycBadge + '">' + (u.kyc_status || 'pending') + '</span></td>' +
                    '<td><span class="badge ' + statusBadge + '">' + (u.account_status || 'active') + '</span></td>' +
                    '<td class="whitespace-nowrap"><button onclick="viewUser(' + u.id + ')" class="btn btn-primary text-xs">View</button>' + deleteBtn + '</td>' +
                '</tr>';
            }).join('');
        }

        // View user
        window.viewUser = function(userId) {
            alert('View user details for ID: ' + userId + ' - Feature coming soon');
        }

        // Delete user (using data attributes)
        window.deleteUserById = function(btn) {
            const userId = btn.getAttribute('data-id');
            const userEmail = btn.getAttribute('data-email');
            window.deleteUser(userId, userEmail);
        }
        
        // Delete user (using data attributes)
        window.deleteUserById = function(btn) {
            const userId = btn.getAttribute('data-id');
            const userEmail = btn.getAttribute('data-email');
            window.deleteUser(userId, userEmail);
        }
        
        // Delete user
        window.deleteUser = async function(userId, userEmail) {
            if (!confirm('Delete user: ' + userEmail + '? This cannot be undone!')) return;
            
            try {
                const res = await fetch('/api/admin/user/' + userId, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success) {
                    alert('User deleted successfully');
                    loadUsers();
                    loadStats();
                } else {
                    alert('Failed: ' + data.message);
                }
            } catch (e) {
                alert('Error deleting user');
            }
        }

        // Load miners
        async function loadMiners() {
            try {
                const res = await fetch('/api/admin/active-miners', { credentials: 'include' });
                const data = await res.json();
                if (data.success) {
                    allMiners = data.miners;
                    renderMiners(allMiners);
                }
            } catch (e) {}
        }

        // Render miners
        function renderMiners(miners) {
            const tbody = document.querySelector('#minersTable tbody');
            if (!miners || miners.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center py-8">No active miners found</td></tr>';
                return;
            }
            
            tbody.innerHTML = miners.map(m => {
                const statusColor = m.current_status === 'Active' ? 'badge-success' : 'badge-danger';
                const startDate = new Date(m.started_at).toLocaleDateString();
                const expiryDate = new Date(m.expires_at).toLocaleDateString();
                
                return '<tr>' +
                    '<td>' + m.id + '</td>' +
                    '<td><div class="font-semibold">' + (m.full_name || 'N/A') + '</div><div class="text-xs text-gray-400">' + m.email + '</div></td>' +
                    '<td><span class="badge badge-primary">' + m.package_name + '</span></td>' +
                    '<td>' + m.hash_rate.toFixed(2) + ' TH/s</td>' +
                    '<td>$' + m.daily_rate.toFixed(4) + '</td>' +
                    '<td class="font-semibold">$' + (m.total_earned || 0).toFixed(6) + '</td>' +
                    '<td>' + startDate + '</td>' +
                    '<td>' + expiryDate + '</td>' +
                    '<td><span class="badge ' + statusColor + '">' + m.current_status + '</span></td>' +
                '</tr>';
            }).join('');
        }

        // Load packages
        async function loadPackages() {
            try {
                const res = await fetch('/api/admin/packages', { credentials: 'include' });
                const data = await res.json();
                if (data.success) {
                    allPackages = data.packages;
                    renderPackages(allPackages);
                }
            } catch (e) {}
        }

        // Render packages
        function renderPackages(packages) {
            const tbody = document.querySelector('#packagesTable tbody');
            if (!packages || packages.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center py-8">No packages found</td></tr>';
                return;
            }
            
            tbody.innerHTML = packages.map(p => {
                const statusBadge = p.is_active ? 'badge-success' : 'badge-danger';
                const hasPurchases = (p.total_purchases || 0) > 0;
                const deleteBtn = hasPurchases 
                    ? '<span class="text-xs text-gray-500">Has Purchases</span>'
                    : '<button data-id="' + p.id + '" data-name="' + p.name + '" onclick="deletePackageById(this)" class="btn btn-danger text-xs">Delete</button>';
                
                return '<tr>' +
                    '<td>' + p.id + '</td>' +
                    '<td class="font-semibold">' + p.name + '</td>' +
                    '<td>' + p.hash_rate + ' TH/s</td>' +
                    '<td class="font-semibold">$' + p.price.toFixed(2) + '</td>' +
                    '<td>$' + p.daily_earnings.toFixed(4) + '</td>' +
                    '<td>' + p.duration_days + ' days</td>' +
                    '<td>' + (p.total_purchases || 0) + '</td>' +
                    '<td><span class="badge ' + statusBadge + '">' + (p.is_active ? 'Active' : 'Inactive') + '</span></td>' +
                    '<td class="whitespace-nowrap">' + deleteBtn + '</td>' +
                '</tr>';
            }).join('');
        }

        // Show create package modal
        window.showCreatePackageModal = function() {
            document.getElementById('createPackageModal').classList.add('active');
        }

        // Close modal
        window.closeModal = function() {
            document.getElementById('createPackageModal').classList.remove('active');
            document.getElementById('createPackageForm').reset();
        }

        // Create package
        window.createPackage = async function(event) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            
            const packageData = {
                name: formData.get('name'),
                hash_rate: parseFloat(formData.get('hash_rate')),
                price: parseFloat(formData.get('price')),
                daily_earnings: parseFloat(formData.get('daily_earnings')),
                duration_days: parseInt(formData.get('duration_days')),
                description: formData.get('description') || ''
            };

            try {
                const res = await fetch('/api/admin/packages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(packageData)
                });
                
                const data = await res.json();
                
                if (data.success) {
                    alert('Package created successfully!');
                    closeModal();
                    loadPackages();
                    loadStats();
                } else {
                    alert('Failed to create package: ' + data.message);
                }
            } catch (error) {
                alert('Error creating package: ' + error.message);
            }
        }

        // Delete package (using data attributes)
        window.deletePackageById = function(btn) {
            const packageId = btn.getAttribute('data-id');
            const packageName = btn.getAttribute('data-name');
            window.deletePackage(packageId, packageName);
        }
        
        // Delete package
        window.deletePackage = async function(packageId, packageName) {
            if (!confirm('Delete package: ' + packageName + '? This cannot be undone!')) return;
            
            try {
                const res = await fetch('/api/admin/packages/' + packageId, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success) {
                    alert('Package deleted successfully');
                    loadPackages();
                    loadStats();
                } else {
                    alert('Failed: ' + data.message);
                }
            } catch (e) {
                alert('Error deleting package');
            }
        }

        // Load all data on page load
        async function init() {
            await loadStats();
            await loadUsers();
        }

        init();
    </script>
</body>
</html>
`
