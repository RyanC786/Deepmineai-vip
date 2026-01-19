/**
 * Admin Referral Management Panel
 * Platform-wide referral statistics, top referrers, payout management
 */

export const adminReferralsHTML = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referral Management - DeepMine Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            color: #E5E7EB;
            min-height: 100vh;
        }
        
        .admin-container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);
            padding: 30px;
            border-radius: 16px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: rgba(26, 31, 53, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
            border-color: rgba(59, 130, 246, 0.4);
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #3B82F6;
            margin: 10px 0;
        }
        
        .stat-label {
            color: #9CA3AF;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .section {
            background: rgba(26, 31, 53, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #3B82F6;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .data-table th {
            background: rgba(59, 130, 246, 0.1);
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #3B82F6;
            border-bottom: 2px solid rgba(59, 130, 246, 0.3);
        }
        
        .data-table td {
            padding: 12px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .data-table tr:hover {
            background: rgba(59, 130, 246, 0.05);
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .badge-pending { background: #FCD34D; color: #78350F; }
        .badge-processing { background: #60A5FA; color: #1E3A8A; }
        .badge-paid { background: #10B981; color: #064E3B; }
        .badge-rejected { background: #EF4444; color: #7F1D1D; }
        
        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 0.875rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%);
            color: white;
        }
        
        .btn-success {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #9CA3AF;
        }
        
        .spinner {
            border: 3px solid rgba(59, 130, 246, 0.2);
            border-top-color: #3B82F6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
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
        
        .modal-content {
            background: linear-gradient(135deg, #1A1F35 0%, #0B0F1E 100%);
            margin: 5% auto;
            padding: 30px;
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            color: #9CA3AF;
            font-size: 0.875rem;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 12px;
            background: rgba(26, 31, 53, 0.6);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 8px;
            color: #E5E7EB;
            font-size: 1rem;
        }
        
        .form-textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .nav-bar {
            background: rgba(26, 31, 53, 0.8);
            backdrop-filter: blur(10px);
            padding: 15px 0;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .nav-links {
            display: flex;
            gap: 20px;
            max-width: 1600px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .nav-links a {
            color: #9CA3AF;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .nav-links a:hover, .nav-links a.active {
            color: #3B82F6;
            background: rgba(59, 130, 246, 0.1);
        }
    </style>
</head>
<body>
    <div class="nav-bar">
        <div class="nav-links">
            <a href="/admin/dashboard"><i class="fas fa-chart-line"></i> Dashboard</a>
            <a href="/admin/users"><i class="fas fa-users"></i> Users</a>
            <a href="/admin/kyc"><i class="fas fa-id-card"></i> KYC</a>
            <a href="/admin/machines"><i class="fas fa-server"></i> Machines</a>
            <a href="/admin/withdrawals"><i class="fas fa-money-bill-wave"></i> Withdrawals</a>
            <a href="/admin/deposits"><i class="fas fa-wallet"></i> Deposits</a>
            <a href="/admin/referrals" class="active"><i class="fas fa-users-cog"></i> Referrals</a>
            <a href="/admin/reports"><i class="fas fa-chart-bar"></i> Reports</a>
            <a href="/admin/crm/dashboard" style="background: rgba(41, 121, 255, 0.3);"><i class="fas fa-headset"></i> CRM</a>
        </div>
    </div>

    <div class="admin-container">
        <div id="loadingState" class="loading">
            <div class="spinner"></div>
            <p style="margin-top: 20px;">Loading referral management data...</p>
        </div>

        <div id="mainContent" style="display: none;">
            <!-- Header -->
            <div class="header">
                <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px;">
                    <i class="fas fa-users"></i> Referral Management System
                </h1>
                <p style="color: rgba(255,255,255,0.8);">Monitor platform referrals, commissions, and process payouts</p>
            </div>

            <!-- Platform Stats -->
            <div class="stat-grid">
                <div class="stat-card">
                    <i class="fas fa-users" style="color: #3B82F6; font-size: 1.5rem;"></i>
                    <div class="stat-value" id="totalReferrals">0</div>
                    <div class="stat-label">Total Referrals</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-fire" style="color: #10B981; font-size: 1.5rem;"></i>
                    <div class="stat-value" id="activeReferrals">0</div>
                    <div class="stat-label">Active Referrals</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-dollar-sign" style="color: #F59E0B; font-size: 1.5rem;"></i>
                    <div class="stat-value" id="totalCommissions">$0</div>
                    <div class="stat-label">Total Commissions</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-money-bill-wave" style="color: #EF4444; font-size: 1.5rem;"></i>
                    <div class="stat-value" id="pendingPayouts">$0</div>
                    <div class="stat-label">Pending Payouts</div>
                </div>
            </div>

            <!-- Pending Payouts Section -->
            <div class="section">
                <div class="section-title">
                    <span><i class="fas fa-clock"></i> Pending Payout Requests</span>
                    <button class="btn btn-primary" onclick="loadPendingPayouts()">
                        <i class="fas fa-sync"></i> Refresh
                    </button>
                </div>
                <div id="pendingPayoutsTable">
                    <div class="loading">Loading pending payouts...</div>
                </div>
            </div>

            <!-- Top Referrers -->
            <div class="section">
                <div class="section-title">
                    <span><i class="fas fa-trophy"></i> Top Referrers</span>
                </div>
                <div id="topReferrersTable">
                    <div class="loading">Loading top referrers...</div>
                </div>
            </div>

            <!-- VIP Distribution -->
            <div class="section">
                <div class="section-title">
                    <span><i class="fas fa-crown"></i> VIP Level Distribution</span>
                </div>
                <div id="vipDistributionTable">
                    <div class="loading">Loading VIP distribution...</div>
                </div>
            </div>

            <!-- User Search & Details -->
            <div class="section">
                <div class="section-title">
                    <span><i class="fas fa-search"></i> Search User Referral Details</span>
                </div>
                <div style="margin-bottom: 20px;">
                    <input 
                        type="text" 
                        placeholder="Search by email or name..." 
                        onkeyup="searchUsers(event)"
                        style="width: 100%; padding: 12px; background: rgba(26, 31, 53, 0.8); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 8px; color: #E5E7EB; font-size: 1rem;"
                    />
                </div>
                <div id="userSearchResults" style="max-height: 400px; overflow-y: auto;">
                    <p style="color: #9CA3AF; text-align: center; padding: 30px;">
                        <i class="fas fa-search" style="font-size: 2rem; opacity: 0.5; display: block; margin-bottom: 10px;"></i>
                        Type to search for users
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- User Details Modal -->
    <div id="userDetailsModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;">
        <div style="max-width: 1000px; margin: 50px auto; background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%); border-radius: 16px; padding: 30px; border: 2px solid rgba(59, 130, 246, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #3B82F6; font-size: 1.8rem; font-weight: 700;">
                    <i class="fas fa-user-circle"></i> User Referral Details
                </h2>
                <button onclick="closeUserDetailsModal()" style="background: transparent; border: none; color: #9CA3AF; font-size: 1.5rem; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="userDetailsContent">
                <div class="loading">Loading user details...</div>
            </div>
        </div>
    </div>

    <!-- Process Payout Modal -->
    <div id="payoutModal" class="modal">
        <div class="modal-content">
            <h2 style="color: #3B82F6; font-weight: 700; margin-bottom: 20px;">
                <i class="fas fa-wallet"></i> Process Payout
            </h2>
            <div class="form-group">
                <label class="form-label">User</label>
                <input type="text" class="form-input" id="payoutUser" readonly>
            </div>
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="text" class="form-input" id="payoutAmount" readonly>
            </div>
            <div class="form-group">
                <label class="form-label">Action</label>
                <select class="form-select" id="payoutAction">
                    <option value="paid">Approve & Mark as Paid</option>
                    <option value="rejected">Reject Payout</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Transaction ID (for approved payouts)</label>
                <input type="text" class="form-input" id="transactionId" placeholder="Enter transaction ID">
            </div>
            <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea class="form-textarea" id="payoutNotes" placeholder="Add notes (optional)"></textarea>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-danger" onclick="closeModal()">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn btn-success" onclick="submitPayout()">
                    <i class="fas fa-check"></i> Process
                </button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;
        let currentPayoutId = null;

        async function loadAllData() {
            try {
                // Load overview stats
                const overviewResponse = await axios.get('/api/referrals/admin/overview');
                if (overviewResponse.data.success) {
                    displayOverview(overviewResponse.data.data);
                }

                // Load pending payouts
                await loadPendingPayouts();

                document.getElementById('loadingState').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
            } catch (error) {
                console.error('Error loading referral management data:', error);
                document.getElementById('loadingState').innerHTML = \`
                    <div style="color: #EF4444;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <p>Failed to load referral management data</p>
                        <p style="font-size: 0.875rem; margin-top: 10px;">\${error.response?.data?.message || error.message}</p>
                        <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 20px;">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                \`;
            }
        }

        function displayOverview(data) {
            // Platform stats
            document.getElementById('totalReferrals').textContent = data.referral_stats?.total_referrals || 0;
            document.getElementById('activeReferrals').textContent = data.referral_stats?.active_referrals || 0;

            const totalCommissions = data.commission_stats?.reduce((sum, stat) => sum + (stat.total_amount || 0), 0) || 0;
            document.getElementById('totalCommissions').textContent = \`$\${totalCommissions.toFixed(0)}\`;

            const pendingPayouts = data.payout_stats?.find(p => p.status === 'pending');
            document.getElementById('pendingPayouts').textContent = \`$\${(pendingPayouts?.total_amount || 0).toFixed(0)}\`;

            // Top referrers
            if (data.top_referrers && data.top_referrers.length > 0) {
                const tableHtml = \`
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>VIP Level</th>
                                <th>Total Referrals</th>
                                <th>Total Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${data.top_referrers.map(user => \`
                                <tr>
                                    <td><strong>\${user.username || 'User ' + user.id}</strong></td>
                                    <td>\${user.email}</td>
                                    <td><span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #F59E0B;">VIP \${user.vip_level}</span></td>
                                    <td>\${user.total_referrals}</td>
                                    <td style="font-weight: 600; color: #10B981;">$\${user.total_referral_earnings?.toFixed(2)}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;
                document.getElementById('topReferrersTable').innerHTML = tableHtml;
            } else {
                document.getElementById('topReferrersTable').innerHTML = '<p style="color: #9CA3AF; text-align: center; padding: 20px;">No referrers yet</p>';
            }

            // VIP distribution
            if (data.vip_distribution && data.vip_distribution.length > 0) {
                const tableHtml = \`
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>VIP Level</th>
                                <th>Users</th>
                                <th>Total Referrals</th>
                                <th>Total Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${data.vip_distribution.map(vip => \`
                                <tr>
                                    <td><span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #F59E0B;">VIP \${vip.vip_level}</span></td>
                                    <td>\${vip.user_count}</td>
                                    <td>\${vip.total_referrals || 0}</td>
                                    <td style="font-weight: 600; color: #10B981;">$\${(vip.total_earnings || 0).toFixed(2)}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;
                document.getElementById('vipDistributionTable').innerHTML = tableHtml;
            } else {
                document.getElementById('vipDistributionTable').innerHTML = '<p style="color: #9CA3AF; text-align: center; padding: 20px;">No VIP data yet</p>';
            }
        }

        async function loadPendingPayouts() {
            try {
                const response = await axios.get('/api/referrals/admin/pending-payouts');
                if (response.data.success) {
                    displayPendingPayouts(response.data.data);
                }
            } catch (error) {
                console.error('Error loading pending payouts:', error);
                document.getElementById('pendingPayoutsTable').innerHTML = '<p style="color: #EF4444; text-align: center; padding: 20px;">Failed to load pending payouts</p>';
            }
        }

        function displayPendingPayouts(payouts) {
            if (!payouts || payouts.length === 0) {
                document.getElementById('pendingPayoutsTable').innerHTML = '<p style="color: #9CA3AF; text-align: center; padding: 20px;">No pending payout requests</p>';
                return;
            }

            const tableHtml = \`
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>VIP Level</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${payouts.map(payout => \`
                            <tr>
                                <td>\${new Date(payout.created_at).toLocaleDateString()}</td>
                                <td><strong>\${payout.username || 'User ' + payout.user_id}</strong></td>
                                <td>\${payout.email}</td>
                                <td><span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #F59E0B;">VIP \${payout.vip_level}</span></td>
                                <td style="font-weight: 700; color: #10B981; font-size: 1.1rem;">$\${(payout.amount || payout.commission_amount)?.toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="openPayoutModal(\${payout.id}, '\${payout.username || payout.full_name || 'User ' + payout.user_id}', '\${payout.email}', \${payout.amount || payout.commission_amount})">
                                        <i class="fas fa-wallet"></i> Process
                                    </button>
                                </td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
            
            document.getElementById('pendingPayoutsTable').innerHTML = tableHtml;
        }

        function openPayoutModal(id, username, email, amount) {
            currentPayoutId = id;
            document.getElementById('payoutUser').value = \`\${username} (\${email})\`;
            document.getElementById('payoutAmount').value = \`$\${(amount || 0).toFixed(2)}\`;
            document.getElementById('transactionId').value = '';
            document.getElementById('payoutNotes').value = '';
            document.getElementById('payoutModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('payoutModal').style.display = 'none';
            currentPayoutId = null;
        }

        async function submitPayout() {
            const action = document.getElementById('payoutAction').value;
            const transactionId = document.getElementById('transactionId').value.trim();
            const notes = document.getElementById('payoutNotes').value.trim();

            if (action === 'paid' && !transactionId) {
                alert('Please enter a transaction ID for approved payouts');
                return;
            }

            if (!confirm(\`Are you sure you want to \${action === 'paid' ? 'approve' : 'reject'} this payout?\`)) {
                return;
            }

            try {
                const response = await axios.post(\`/api/referrals/admin/process-payout/\${currentPayoutId}\`, {
                    status: action,
                    transaction_id: transactionId || null,
                    notes: notes || null
                });

                if (response.data.success) {
                    alert('✅ Payout processed successfully!');
                    closeModal();
                    loadPendingPayouts();
                } else {
                    alert('❌ ' + (response.data.message || 'Failed to process payout'));
                }
            } catch (error) {
                console.error('Error processing payout:', error);
                alert('❌ ' + (error.response?.data?.message || 'Failed to process payout'));
            }
        }

        // User Search and Details
        let searchTimeout = null;
        
        async function searchUsers(event) {
            const query = event.target.value.trim();
            
            if (query.length < 2) {
                document.getElementById('userSearchResults').innerHTML = '';
                return;
            }

            // Debounce search
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                try {
                    const response = await axios.get('/api/referrals/admin/search?q=' + encodeURIComponent(query));
                    if (response.data.success) {
                        displaySearchResults(response.data.data);
                    }
                } catch (error) {
                    console.error('Error searching users:', error);
                }
            }, 300);
        }

        function displaySearchResults(users) {
            if (!users || users.length === 0) {
                document.getElementById('userSearchResults').innerHTML = '<p style="color: #9CA3AF; padding: 10px;">No users found</p>';
                return;
            }

            const html = users.map(user => 
                '<div class="referral-item" style="cursor: pointer;" onclick="viewUserDetails(' + user.id + ')">' +
                    '<div>' +
                        '<div style="font-weight: 600; color: #E5E7EB;">' + (user.full_name || 'User') + '</div>' +
                        '<div style="font-size: 0.875rem; color: #9CA3AF;">' + user.email + '</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                        '<div style="color: #F59E0B; font-weight: 600;">VIP ' + user.vip_level + '</div>' +
                        '<div style="font-size: 0.875rem; color: #9CA3AF;">' + user.total_referrals + ' referrals</div>' +
                    '</div>' +
                '</div>'
            ).join('');

            document.getElementById('userSearchResults').innerHTML = html;
        }

        async function viewUserDetails(userId) {
            try {
                const response = await axios.get('/api/referrals/admin/user/' + userId);
                if (response.data.success) {
                    displayUserDetails(response.data.data);
                    document.getElementById('userDetailsModal').style.display = 'block';
                }
            } catch (error) {
                console.error('Error loading user details:', error);
                alert('Failed to load user details');
            }
        }

        function displayUserDetails(data) {
            const user = data.user;
            const downline = data.downline;
            const commissions = data.commissions;

            document.getElementById('userDetailsContent').innerHTML = \`
                <div style="margin-bottom: 25px;">
                    <h2 style="color: #3B82F6; font-size: 1.5rem; font-weight: 700; margin-bottom: 10px;">
                        \${user.full_name || 'User Details'}
                    </h2>
                    <div style="color: #9CA3AF; margin-bottom: 15px;">
                        <div><strong>Email:</strong> \${user.email}</div>
                        <div><strong>Referral Code:</strong> \${user.referral_code}</div>
                        <div><strong>VIP Level:</strong> \${user.vip_level}</div>
                        <div><strong>Joined:</strong> \${new Date(user.created_at).toLocaleDateString()}</div>
                    </div>
                    \${data.referrer ? \`
                        <div style="padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 15px;">
                            <strong style="color: #3B82F6;">Referred By:</strong> 
                            \${data.referrer.full_name} (\${data.referrer.email})
                        </div>
                    \` : ''}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div class="stat-card">
                        <div class="stat-value" style="font-size: 1.5rem;">\${downline.total}</div>
                        <div class="stat-label">Total Network</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="font-size: 1.5rem;">\${downline.level1.count}</div>
                        <div class="stat-label">Direct (L1)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="font-size: 1.5rem;">\${downline.level2.count}</div>
                        <div class="stat-label">Level 2</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="font-size: 1.5rem;">\${downline.level3.count}</div>
                        <div class="stat-label">Level 3+</div>
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #3B82F6; font-weight: 600; margin-bottom: 10px;">Downline Network</h3>
                    \${downline.level1.count > 0 ? \`
                        <div style="max-height: 300px; overflow-y: auto;">
                            \${downline.level1.users.map(u => \`
                                <div class="referral-item" style="margin: 8px 0;">
                                    <div>
                                        <div style="font-weight: 600;">\${u.full_name}</div>
                                        <div style="font-size: 0.875rem; color: #9CA3AF;">\${u.email}</div>
                                    </div>
                                    <div style="text-align: right; font-size: 0.875rem;">
                                        <div>VIP \${u.vip_level}</div>
                                        <div style="color: #10B981;">$\${u.total_purchases.toFixed(2)}</div>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    \` : '<p style="color: #9CA3AF;">No direct referrals</p>'}
                </div>

                <div>
                    <h3 style="color: #3B82F6; font-weight: 600; margin-bottom: 10px;">
                        Commission Summary
                    </h3>
                    <div style="padding: 15px; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #10B981; margin-bottom: 5px;">
                            $\${commissions.total.toFixed(2)}
                        </div>
                        <div style="color: #9CA3AF; font-size: 0.875rem;">
                            \${commissions.count} commission\${commissions.count !== 1 ? 's' : ''} earned
                        </div>
                    </div>
                </div>
            \`;
        }

        function closeUserDetailsModal() {
            document.getElementById('userDetailsModal').style.display = 'none';
        }

        // Load data on page load
        loadAllData();
    </script>
</body>
</html>
`
