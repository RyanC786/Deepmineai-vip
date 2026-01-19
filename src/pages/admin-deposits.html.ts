export const adminDepositsPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Deposits Management</title>
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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        .stat-card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
        }
        .stat-label { color: #B0B8D4; font-size: 14px; margin-bottom: 8px; }
        .stat-value { font-size: 32px; font-weight: 700; color: #33F0FF; }
        .card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .filters {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }
        .filter-btn {
            padding: 10px 20px;
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 8px;
            color: #E0E7FF;
            cursor: pointer;
            transition: all 0.3s;
        }
        .filter-btn:hover, .filter-btn.active {
            background: rgba(41, 121, 255, 0.2);
            border-color: #33F0FF;
            color: #33F0FF;
        }
        .table-container { overflow-x: auto; }
        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1200px;
        }
        th, td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid rgba(41, 121, 255, 0.1);
        }
        th {
            color: #B0B8D4;
            font-weight: 600;
            font-size: 14px;
        }
        .status-badge {
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-pending { background: rgba(251, 191, 36, 0.1); color: #FBBF24; border: 1px solid rgba(251, 191, 36, 0.3); }
        .status-approved { background: rgba(34, 197, 94, 0.1); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3); }
        .status-rejected { background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); }
        .action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            margin-right: 8px;
        }
        .btn-approve {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .btn-approve:hover { background: rgba(34, 197, 94, 0.3); }
        .btn-reject {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .btn-reject:hover { background: rgba(239, 68, 68, 0.3); }
        .btn-view {
            background: rgba(41, 121, 255, 0.2);
            color: #2979FF;
            border: 1px solid rgba(41, 121, 255, 0.3);
        }
        .btn-view:hover { background: rgba(41, 121, 255, 0.3); }
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
        .modal-content {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 16px;
            padding: 32px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        .modal-title {
            font-size: 24px;
            font-weight: 700;
            color: #33F0FF;
        }
        .modal-close {
            background: none;
            border: none;
            color: #B0B8D4;
            font-size: 24px;
            cursor: pointer;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: #B0B8D4;
            font-weight: 500;
        }
        .form-input {
            width: 100%;
            padding: 12px;
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 8px;
            color: #E0E7FF;
            font-size: 14px;
        }
        .form-input:focus {
            outline: none;
            border-color: #33F0FF;
        }
        textarea.form-input {
            min-height: 100px;
            resize: vertical;
        }
        .btn-submit {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(41, 121, 255, 0.4); }
        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        .alert-success { background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.3); color: #22C55E; }
        .alert-error { background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: #EF4444; }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(41, 121, 255, 0.1);
        }
        .detail-label { color: #B0B8D4; }
        .detail-value { color: #E0E7FF; font-weight: 500; }
        .proof-image {
            width: 100%;
            max-width: 400px;
            border-radius: 8px;
            margin-top: 12px;
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
            <a href="/admin/deposits" class="active"><i class="fas fa-wallet"></i> Deposits</a>
            <a href="/admin/referrals"><i class="fas fa-users-cog"></i> Referrals</a>
            <a href="/admin/reports"><i class="fas fa-chart-bar"></i> Reports</a>
            <a href="/admin/crm/dashboard" style="background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.5);"><i class="fas fa-headset"></i> CRM</a>
            <button id="logoutBtn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #F87171; cursor: pointer; padding: 8px 16px; border-radius: 8px; transition: all 0.3s;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    </nav>

    <div class="main-content">
        <div class="page-header">
            <h1><i class="fas fa-wallet"></i> Deposit Management</h1>
            <p style="color: #B0B8D4;">Review and approve user deposits</p>
        </div>

        <div class="alert alert-success" id="successAlert"></div>
        <div class="alert alert-error" id="errorAlert"></div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Deposits</div>
                <div class="stat-value" id="totalDeposits">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Pending Review</div>
                <div class="stat-value" id="pendingDeposits">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Approved</div>
                <div class="stat-value" id="approvedDeposits">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Rejected</div>
                <div class="stat-value" id="rejectedDeposits">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Value</div>
                <div class="stat-value" id="totalValue">$0</div>
            </div>
        </div>

        <div class="card">
            <div class="filters" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <button class="filter-btn active" onclick="filterDeposits('all')">All</button>
                    <button class="filter-btn" onclick="filterDeposits('pending')">Pending</button>
                    <button class="filter-btn" onclick="filterDeposits('approved')">Approved</button>
                    <button class="filter-btn" onclick="filterDeposits('rejected')">Rejected</button>
                </div>
                <button class="filter-btn" onclick="refreshData()" style="background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.4);">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Deposit #</th>
                            <th>User</th>
                            <th>Amount (ETH)</th>
                            <th>Wallet Address</th>
                            <th>TX Hash</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="depositsTableBody">
                        <tr>
                            <td colspan="8" style="text-align: center; padding: 40px; color: #B0B8D4;">
                                Loading deposits...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- View Details Modal -->
    <div class="modal" id="viewModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Deposit Details</h3>
                <button class="modal-close" onclick="closeModal('viewModal')">&times;</button>
            </div>
            <div id="depositDetails"></div>
        </div>
    </div>

    <!-- Reject Modal -->
    <div class="modal" id="rejectModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Reject Deposit</h3>
                <button class="modal-close" onclick="closeModal('rejectModal')">&times;</button>
            </div>
            <div class="form-group">
                <label class="form-label">Rejection Reason <span style="color: #EF4444;">*</span></label>
                <textarea class="form-input" id="rejectReason" placeholder="Please provide a reason for rejection..." required></textarea>
            </div>
            <button class="btn-submit" onclick="submitRejection()">
                <i class="fas fa-times-circle"></i> Reject Deposit
            </button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;

        let allDeposits = [];
        let currentFilter = 'all';
        let currentDepositId = null;

        // Check if admin_token cookie exists
        function checkAuthCookie() {
            const hasAdminToken = document.cookie.split(';').some(c => c.trim().startsWith('admin_token='));
            console.log('════════════════════════════════════════');
            console.log('[DEPOSITS] COOKIE CHECK START');
            console.log('[DEPOSITS] Admin token cookie exists:', hasAdminToken);
            console.log('[DEPOSITS] All cookies:', document.cookie);
            console.log('[DEPOSITS] Cookie count:', document.cookie.split(';').length);
            console.log('════════════════════════════════════════');
            
            if (!hasAdminToken) {
                console.error('❌❌❌ [DEPOSITS] NO ADMIN TOKEN FOUND! ❌❌❌');
                console.error('[DEPOSITS] Waiting 5 seconds before redirect...');
                alert('No admin_token cookie found! Check console. Redirecting in 5 seconds...');
                setTimeout(() => {
                    window.location.href = '/admin/panel/login';
                }, 5000);
                return false;
            }
            console.log('✅ [DEPOSITS] Cookie check passed!');
            return true;
        }

        // Load deposits on page load
        async function loadDeposits() {
            if (!checkAuthCookie()) {
                return; // Exit if not authenticated
            }
            
            try {
                console.log('[DEPOSITS] Loading deposits from API...');
                console.log('[DEPOSITS] Request config: { withCredentials: true }');
                const response = await axios.get('/api/deposits/admin/list', {
                    withCredentials: true  // Explicitly set for this request
                });
                console.log('[DEPOSITS] API Response:', response.data);
                
                if (response.data.success) {
                    allDeposits = response.data.deposits;
                    updateStats();
                    renderDeposits();
                } else {
                    console.error('[DEPOSITS] API returned success=false:', response.data);
                    showAlert(response.data.message || 'Failed to load deposits', 'error');
                }
            } catch (error) {
                console.error('════════════════════════════════════════');
                console.error('❌ [DEPOSITS] API CALL FAILED!');
                console.error('[DEPOSITS] Error object:', error);
                console.error('[DEPOSITS] Error response:', error.response);
                console.error('[DEPOSITS] Error status:', error.response?.status);
                console.error('[DEPOSITS] Error data:', error.response?.data);
                console.error('[DEPOSITS] Error message:', error.message);
                console.error('════════════════════════════════════════');
                
                if (error.response?.status === 401) {
                    alert('401 Unauthorized! Check console. Redirecting in 5 seconds...');
                    showAlert('Session expired. Please login again.', 'error');
                    setTimeout(() => window.location.href = '/admin/panel/login', 5000);
                } else {
                    showAlert('Failed to load deposits', 'error');
                }
            }
        }

        function updateStats() {
            const total = allDeposits.length;
            const pending = allDeposits.filter(d => d.status === 'pending').length;
            const approved = allDeposits.filter(d => d.status === 'approved').length;
            const rejected = allDeposits.filter(d => d.status === 'rejected').length;
            const totalValue = allDeposits.reduce((sum, d) => sum + (d.amount || 0), 0).toFixed(4);

            document.getElementById('totalDeposits').textContent = total;
            document.getElementById('pendingDeposits').textContent = pending;
            document.getElementById('approvedDeposits').textContent = approved;
            document.getElementById('rejectedDeposits').textContent = rejected;
            document.getElementById('totalValue').textContent = totalValue + ' ETH';
        }

        function filterDeposits(status) {
            currentFilter = status;
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            renderDeposits();
        }

        function renderDeposits() {
            const tbody = document.getElementById('depositsTableBody');
            
            let filtered = allDeposits;
            if (currentFilter !== 'all') {
                filtered = allDeposits.filter(d => d.status === currentFilter);
            }

            if (filtered.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px; color: #B0B8D4;">
                            <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block; opacity: 0.5;"></i>
                            No deposits found
                        </td>
                    </tr>
                \`;
                return;
            }

            tbody.innerHTML = filtered.map(deposit => {
                const statusClass = 'status-' + deposit.status;
                const date = new Date(deposit.created_at).toLocaleDateString();
                const actions = deposit.status === 'pending' ? \`
                    <button class="action-btn btn-approve" onclick="approveDeposit(\${deposit.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn btn-reject" onclick="openRejectModal(\${deposit.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                \` : '';

                return \`
                    <tr>
                        <td><strong>\${deposit.deposit_number}</strong></td>
                        <td>\${deposit.user_email || 'N/A'}<br><small style="color: #B0B8D4;">\${deposit.user_name || ''}</small></td>
                        <td><strong>\${deposit.amount} \${deposit.currency || 'ETH'}</strong></td>
                        <td><small style="color: #B0B8D4;">\${deposit.wallet_address ? deposit.wallet_address.substring(0, 10) + '...' : 'N/A'}</small></td>
                        <td><small style="color: #B0B8D4;">\${deposit.tx_hash ? deposit.tx_hash.substring(0, 10) + '...' : 'N/A'}</small></td>
                        <td>\${date}</td>
                        <td><span class="status-badge \${statusClass}">\${deposit.status}</span></td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewDeposit(\${deposit.id})">
                                <i class="fas fa-eye"></i> View
                            </button>
                            \${actions}
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        function viewDeposit(depositId) {
            const deposit = allDeposits.find(d => d.id === depositId);
            if (!deposit) return;

            // Business wallet address (where users deposit TO)
            const businessWallet = '0x66a5957bdfa1371a651d5d932d03b8710cccd742';
            const userWallet = deposit.wallet_address || deposit.registered_wallet || 'N/A';
            const approvedBy = deposit.approved_by || 'N/A';
            const approvedDate = deposit.approved_at ? new Date(deposit.approved_at).toLocaleString() : 'N/A';

            const details = \`
                <div class="detail-row">
                    <span class="detail-label">Deposit Number</span>
                    <span class="detail-value">\${deposit.deposit_number}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">User</span>
                    <span class="detail-value">\${deposit.user_name} (\${deposit.user_email})</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount</span>
                    <span class="detail-value">\${deposit.amount} \${deposit.currency || 'ETH'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Currency Type</span>
                    <span class="detail-value">
                        \${deposit.currency || 'ETH'}
                        \${(deposit.currency === 'USDT' || deposit.currency === 'USDC') 
                          ? '<span style="color: #22C55E; font-size: 12px; margin-left: 8px;"><i class="fas fa-shield-alt"></i> Stablecoin (1:1 USD)</span>' 
                          : '<span style="color: #F59E0B; font-size: 12px; margin-left: 8px;"><i class="fas fa-chart-line"></i> Requires conversion</span>'}
                    </span>
                </div>
                <div style="background: rgba(34, 197, 94, 0.1); padding: 16px; border-radius: 8px; margin: 12px 0;">
                    <div style="width: 100%;">
                        <div class="detail-label" style="margin-bottom: 8px;">
                            <i class="fas fa-user-circle"></i> User's Wallet Address (FROM)
                        </div>
                        <div class="detail-value" style="font-family: monospace; word-break: break-all; font-size: 13px; color: #22C55E;">
                            \${userWallet}
                        </div>
                    </div>
                </div>
                <div style="background: rgba(41, 121, 255, 0.1); padding: 16px; border-radius: 8px; margin: 12px 0;">
                    <div style="width: 100%;">
                        <div class="detail-label" style="margin-bottom: 8px;">
                            <i class="fas fa-building"></i> Business Wallet (TO)
                        </div>
                        <div class="detail-value" style="font-family: monospace; word-break: break-all; font-size: 13px; color: #33F0FF;">
                            \${businessWallet}
                        </div>
                    </div>
                </div>
                <div class="detail-row">
                    <span class="detail-label">TX Hash</span>
                    <span class="detail-value" style="word-break: break-all; font-family: monospace; font-size: 12px;">\${deposit.tx_hash || 'Not provided'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value"><span class="status-badge status-\${deposit.status}">\${deposit.status}</span></span>
                </div>
                \${deposit.status === 'approved' ? \`
                    <div class="detail-row">
                        <span class="detail-label">Approved By</span>
                        <span class="detail-value" style="color: #33F0FF;">\${approvedBy}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Approved At</span>
                        <span class="detail-value">\${approvedDate}</span>
                    </div>
                \` : ''}
                <div class="detail-row">
                    <span class="detail-label">Submitted</span>
                    <span class="detail-value">\${new Date(deposit.created_at).toLocaleString()}</span>
                </div>
                \${deposit.proof_url ? \`
                    <div style="margin-top: 20px;">
                        <div class="form-label">Proof Screenshot</div>
                        <img src="/api/deposits/proof/\${deposit.proof_url}" class="proof-image" alt="Deposit Proof" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="display:none; padding: 10px; background: #FEE; color: #C00; border-radius: 4px;">
                            Failed to load proof image
                        </div>
                    </div>
                \` : ''}
                \${deposit.admin_notes ? \`
                    <div class="detail-row">
                        <span class="detail-label">Admin Notes</span>
                        <span class="detail-value">\${deposit.admin_notes}</span>
                    </div>
                \` : ''}
                \${deposit.rejection_reason ? \`
                    <div class="detail-row">
                        <span class="detail-label">Rejection Reason</span>
                        <span class="detail-value" style="color: #EF4444;">\${deposit.rejection_reason}</span>
                    </div>
                \` : ''}
            \`;

            document.getElementById('depositDetails').innerHTML = details;
            document.getElementById('viewModal').style.display = 'flex';
        }

        async function approveDeposit(depositId) {
            if (!confirm('Are you sure you want to approve this deposit? The user balance will be updated.')) return;

            try {
                const response = await axios.post(\`/api/deposits/admin/\${depositId}/approve\`);
                
                if (response.data.success) {
                    showAlert('Deposit approved successfully!', 'success');
                    await loadDeposits();
                } else {
                    showAlert(response.data.message || 'Failed to approve deposit', 'error');
                }
            } catch (error) {
                console.error('Approve error:', error);
                showAlert(error.response?.data?.message || 'Failed to approve deposit', 'error');
            }
        }

        function openRejectModal(depositId) {
            currentDepositId = depositId;
            document.getElementById('rejectReason').value = '';
            document.getElementById('rejectModal').style.display = 'flex';
        }

        async function submitRejection() {
            const reason = document.getElementById('rejectReason').value.trim();
            
            if (!reason) {
                showAlert('Please provide a rejection reason', 'error');
                return;
            }

            try {
                const response = await axios.post(\`/api/deposits/admin/\${currentDepositId}/reject\`, {
                    rejectionReason: reason
                });
                
                if (response.data.success) {
                    showAlert('Deposit rejected', 'success');
                    closeModal('rejectModal');
                    await loadDeposits();
                } else {
                    showAlert(response.data.message || 'Failed to reject deposit', 'error');
                }
            } catch (error) {
                console.error('Reject error:', error);
                showAlert(error.response?.data?.message || 'Failed to reject deposit', 'error');
            }
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function showAlert(message, type) {
            const alertId = type === 'success' ? 'successAlert' : 'errorAlert';
            const alert = document.getElementById(alertId);
            alert.textContent = message;
            alert.style.display = 'block';
            setTimeout(() => alert.style.display = 'none', 5000);
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

        // Refresh data
        async function refreshData() {
            const btn = event.target.closest('button');
            const icon = btn.querySelector('i');
            
            // Add spinning animation
            icon.classList.add('fa-spin');
            btn.disabled = true;
            
            try {
                await loadDeposits();
            } finally {
                // Remove spinning animation
                icon.classList.remove('fa-spin');
                btn.disabled = false;
            }
        }

        // Load deposits on page load
        loadDeposits();

        // Auto-refresh every 30 seconds
        setInterval(loadDeposits, 30000);
    </script>
</body>
</html>
`
