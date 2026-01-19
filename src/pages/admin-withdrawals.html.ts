export const adminWithdrawalsPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Withdrawals Management</title>
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
        .status-completed { background: rgba(41, 121, 255, 0.1); color: #2979FF; border: 1px solid rgba(41, 121, 255, 0.3); }
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
        .btn-complete {
            background: rgba(41, 121, 255, 0.2);
            color: #2979FF;
            border: 1px solid rgba(41, 121, 255, 0.3);
        }
        .btn-complete:hover { background: rgba(41, 121, 255, 0.3); }
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
        .modal.show { display: flex; }
        .modal-content {
            background: #1A1F35;
            border-radius: 16px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            border: 1px solid rgba(41, 121, 255, 0.2);
        }
        .modal-header {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #33F0FF;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            color: #B0B8D4;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 12px;
            background: rgba(41, 121, 255, 0.05);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 8px;
            color: #ffffff;
            font-size: 16px;
        }
        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        .btn-primary {
            padding: 12px 24px;
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border: none;
            border-radius: 8px;
            color: #ffffff;
            font-weight: 600;
            cursor: pointer;
        }
        .btn-secondary {
            padding: 12px 24px;
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 8px;
            color: #E0E7FF;
            font-weight: 600;
            cursor: pointer;
        }
        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .alert-success {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22C55E;
        }
        .alert-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #EF4444;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #B0B8D4;
        }
        .empty-state i {
            font-size: 64px;
            margin-bottom: 20px;
            color: #2979FF;
        }
    </style>
</head>
<body>
    <nav class="nav-container">
        <div class="logo">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI">
            <span>DeepMine AI - Admin</span>
        </div>
        <div class="nav-links">
            <a href="/admin/dashboard"><i class="fas fa-chart-line"></i> Dashboard</a>
            <a href="/admin/users"><i class="fas fa-users"></i> Users</a>
            <a href="/admin/kyc"><i class="fas fa-id-card"></i> KYC</a>
            <a href="/admin/machines"><i class="fas fa-server"></i> Machines</a>
            <a href="/admin/withdrawals" class="active"><i class="fas fa-money-bill-wave"></i> Withdrawals</a>
            <a href="/admin/deposits"><i class="fas fa-wallet"></i> Deposits</a>
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
            <h1><i class="fas fa-money-bill-wave"></i> Withdrawal Management</h1>
            <p style="color: #B0B8D4;">Review and process user withdrawal requests</p>
        </div>

        <div id="alertContainer"></div>

        <div class="stats-grid" id="statsGrid">
            <div class="stat-card">
                <div class="stat-label">Total Withdrawals</div>
                <div class="stat-value" id="totalWithdrawals">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Pending</div>
                <div class="stat-value" style="color: #FBBF24;" id="pendingCount">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Approved</div>
                <div class="stat-value" style="color: #22C55E;" id="approvedCount">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Completed</div>
                <div class="stat-value" style="color: #2979FF;" id="completedCount">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Paid Out</div>
                <div class="stat-value" style="color: #22C55E;" id="totalPaid">$0</div>
            </div>
        </div>

        <div class="card">
            <div class="filters" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <button class="filter-btn active" onclick="filterWithdrawals('all')">All</button>
                    <button class="filter-btn" onclick="filterWithdrawals('pending')">Pending</button>
                    <button class="filter-btn" onclick="filterWithdrawals('approved')">Approved</button>
                    <button class="filter-btn" onclick="filterWithdrawals('completed')">Completed</button>
                    <button class="filter-btn" onclick="filterWithdrawals('rejected')">Rejected</button>
                </div>
                <button class="filter-btn" onclick="refreshData()" style="background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.4);">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>

            <div class="table-container">
                <table id="withdrawalsTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Net Amount</th>
                            <th>Network</th>
                            <th>Wallet Address</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="withdrawalsBody">
                        <tr><td colspan="9" class="empty-state"><i class="fas fa-spinner fa-spin"></i><br>Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Complete Withdrawal Modal -->
    <div id="completeModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">Complete Withdrawal</div>
            <div class="form-group">
                <label>Transaction Hash (ERC-20) *</label>
                <input type="text" id="txHash" placeholder="Enter TRON transaction hash">
            </div>
            <div class="form-group">
                <label>Notes (Optional)</label>
                <textarea id="txNotes" placeholder="Add any notes about this payment"></textarea>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" onclick="submitComplete()">Mark as Completed</button>
            </div>
        </div>
    </div>

    <!-- Reject Modal -->
    <div id="rejectModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">Reject Withdrawal</div>
            <div class="form-group">
                <label>Rejection Reason *</label>
                <textarea id="rejectReason" placeholder="Explain why this withdrawal is being rejected"></textarea>
            </div>
            <p style="color: #FBBF24; margin-bottom: 20px;">
                <i class="fas fa-info-circle"></i> The amount will be automatically refunded to the user's balance.
            </p>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" style="background: linear-gradient(135deg, #EF4444, #DC2626);" onclick="submitReject()">Reject & Refund</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        let currentFilter = 'all';
        let currentWithdrawalId = null;

        async function loadStats() {
            try {
                const response = await axios.get('/api/admin/withdrawals/stats', { withCredentials: true });
                if (response.data.success) {
                    const stats = response.data.stats;
                    document.getElementById('totalWithdrawals').textContent = stats.total_withdrawals;
                    document.getElementById('pendingCount').textContent = stats.pending_count;
                    document.getElementById('approvedCount').textContent = stats.approved_count;
                    document.getElementById('completedCount').textContent = stats.completed_count;
                    document.getElementById('totalPaid').textContent = '$' + stats.total_paid.toFixed(2);
                }
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        }

        async function loadWithdrawals() {
            try {
                const response = await axios.get('/api/admin/withdrawals/list?status=' + currentFilter, { withCredentials: true });
                if (response.data.success) {
                    allWithdrawals = response.data.withdrawals;
                    displayWithdrawals(allWithdrawals);
                }
            } catch (error) {
                console.error('Failed to load withdrawals:', error);
                showAlert('Failed to load withdrawals', 'error');
            }
        }

        function displayWithdrawals(withdrawals) {
            const tbody = document.getElementById('withdrawalsBody');
            
            if (!withdrawals || withdrawals.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="empty-state"><i class="fas fa-inbox"></i><br>No withdrawals found</td></tr>';
                return;
            }

            tbody.innerHTML = withdrawals.map(w => {
                const actions = getActions(w);
                const date = new Date(w.created_at).toLocaleString();
                const walletShort = w.wallet_address.substring(0, 10) + '...';
                
                return \`
                    <tr>
                        <td><strong>\${w.withdrawal_number}</strong></td>
                        <td>
                            <div>\${w.email}</div>
                            <small style="color: #B0B8D4;">\${w.full_name || 'N/A'}</small>
                        </td>
                        <td><strong>$\${w.amount.toFixed(2)}</strong></td>
                        <td style="color: #22C55E;"><strong>$\${w.net_amount.toFixed(2)}</strong></td>
                        <td>\${w.network}</td>
                        <td><code style="font-size: 12px;">\${walletShort}</code></td>
                        <td><span class="status-badge status-\${w.status}">\${w.status}</span></td>
                        <td><small>\${date}</small></td>
                        <td>\${actions}</td>
                    </tr>
                \`;
            }).join('');
        }

        function getActions(withdrawal) {
            let viewBtn = \`
                <button class="action-btn btn-view" onclick="viewWithdrawal(\${withdrawal.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            \`;
            
            if (withdrawal.status === 'pending') {
                return viewBtn + \`
                    <button class="action-btn btn-approve" onclick="approveWithdrawal(\${withdrawal.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn btn-reject" onclick="openRejectModal(\${withdrawal.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                \`;
            } else if (withdrawal.status === 'approved') {
                return viewBtn + \`
                    <button class="action-btn btn-complete" onclick="openCompleteModal(\${withdrawal.id})">
                        <i class="fas fa-check-double"></i> Complete
                    </button>
                \`;
            } else {
                return viewBtn;
            }
        }

        let allWithdrawals = [];

        function viewWithdrawal(id) {
            const withdrawal = allWithdrawals.find(w => w.id === id);
            if (!withdrawal) return;

            const businessWallet = '0x66a5957bdfa1371a651d5d932d03b8710cccd742';
            const approvedBy = withdrawal.approved_by || 'N/A';
            const approvedDate = withdrawal.approved_at ? new Date(withdrawal.approved_at).toLocaleString() : 'N/A';
            const completedDate = withdrawal.completed_at ? new Date(withdrawal.completed_at).toLocaleString() : 'N/A';

            const modalHTML = \`
                <div class="modal-overlay" onclick="closeViewModal()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                    <div class="modal-content" onclick="event.stopPropagation()" style="background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%); border: 1px solid rgba(41, 121, 255, 0.3); border-radius: 16px; padding: 32px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 style="font-size: 24px; font-weight: 700; color: #33F0FF;">Withdrawal Details</h3>
                            <button onclick="closeViewModal()" style="background: none; border: none; color: #B0B8D4; font-size: 24px; cursor: pointer;">&times;</button>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                            <span style="color: #B0B8D4;">Withdrawal Number</span>
                            <span style="color: #E0E7FF; font-weight: 500;">\${withdrawal.withdrawal_number}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                            <span style="color: #B0B8D4;">User</span>
                            <span style="color: #E0E7FF; font-weight: 500;">\${withdrawal.full_name} (\${withdrawal.email})</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                            <span style="color: #B0B8D4;">Amount</span>
                            <span style="color: #E0E7FF; font-weight: 500;">$\${withdrawal.amount.toFixed(2)}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                            <span style="color: #B0B8D4;">Net Amount</span>
                            <span style="color: #22C55E; font-weight: 500;">$\${withdrawal.net_amount.toFixed(2)}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                            <span style="color: #B0B8D4;">Network</span>
                            <span style="color: #E0E7FF; font-weight: 500;">\${withdrawal.network}</span>
                        </div>
                        <div style="background: rgba(41, 121, 255, 0.1); padding: 16px; border-radius: 8px; margin: 12px 0;">
                            <div style="margin-bottom: 8px; color: #B0B8D4;"><i class="fas fa-user-circle"></i> User's Wallet Address (TO)</div>
                            <div style="font-family: monospace; word-break: break-all; font-size: 13px; color: #33F0FF;">\${withdrawal.wallet_address}</div>
                        </div>
                        <div style="background: rgba(34, 197, 94, 0.1); padding: 16px; border-radius: 8px; margin: 12px 0;">
                            <div style="margin-bottom: 8px; color: #B0B8D4;"><i class="fas fa-building"></i> Business Wallet (FROM)</div>
                            <div style="font-family: monospace; word-break: break-all; font-size: 13px; color: #22C55E;">\${businessWallet}</div>
                        </div>
                        \${withdrawal.tx_hash ? \`
                            <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                                <span style="color: #B0B8D4;">TX Hash</span>
                                <span style="color: #E0E7FF; font-weight: 500; font-family: monospace; font-size: 12px; word-break: break-all;">\${withdrawal.tx_hash}</span>
                            </div>
                        \` : ''}
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                            <span style="color: #B0B8D4;">Status</span>
                            <span><span class="status-badge status-\${withdrawal.status}">\${withdrawal.status}</span></span>
                        </div>
                        \${withdrawal.status !== 'pending' && withdrawal.status !== 'rejected' ? \`
                            <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                                <span style="color: #B0B8D4;">Approved By</span>
                                <span style="color: #33F0FF; font-weight: 500;">\${approvedBy}</span>
                            </div>
                            <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                                <span style="color: #B0B8D4;">Approved At</span>
                                <span style="color: #E0E7FF; font-weight: 500;">\${approvedDate}</span>
                            </div>
                        \` : ''}
                        \${withdrawal.status === 'completed' ? \`
                            <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                                <span style="color: #B0B8D4;">Completed At</span>
                                <span style="color: #E0E7FF; font-weight: 500;">\${completedDate}</span>
                            </div>
                        \` : ''}
                        <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                            <span style="color: #B0B8D4;">Submitted</span>
                            <span style="color: #E0E7FF; font-weight: 500;">\${new Date(withdrawal.created_at).toLocaleString()}</span>
                        </div>
                        \${withdrawal.admin_notes ? \`
                            <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                                <span style="color: #B0B8D4;">Admin Notes</span>
                                <span style="color: #E0E7FF; font-weight: 500;">\${withdrawal.admin_notes}</span>
                            </div>
                        \` : ''}
                        \${withdrawal.rejection_reason ? \`
                            <div class="detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(41, 121, 255, 0.1);">
                                <span style="color: #B0B8D4;">Rejection Reason</span>
                                <span style="color: #EF4444; font-weight: 500;">\${withdrawal.rejection_reason}</span>
                            </div>
                        \` : ''}
                    </div>
                </div>
            \`;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        function closeViewModal() {
            const modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
        }

        async function approveWithdrawal(id) {
            if (!confirm('Approve this withdrawal for payment?')) return;

            try {
                const response = await axios.post(\`/api/admin/withdrawals/\${id}/approve\`, {}, { withCredentials: true });
                if (response.data.success) {
                    // Refresh data FIRST to show updated status
                    await loadStats();
                    await loadWithdrawals();
                    // Then show alert
                    showAlert('Withdrawal approved successfully', 'success');
                } else {
                    showAlert(response.data.message || 'Failed to approve withdrawal', 'error');
                }
            } catch (error) {
                showAlert(error.response?.data?.message || 'Failed to approve withdrawal', 'error');
            }
        }

        function openCompleteModal(id) {
            currentWithdrawalId = id;
            document.getElementById('completeModal').classList.add('show');
        }

        function openRejectModal(id) {
            currentWithdrawalId = id;
            document.getElementById('rejectModal').classList.add('show');
        }

        function closeModal() {
            document.getElementById('completeModal').classList.remove('show');
            document.getElementById('rejectModal').classList.remove('show');
            currentWithdrawalId = null;
        }

        async function submitComplete() {
            const txHash = document.getElementById('txHash').value.trim();
            const notes = document.getElementById('txNotes').value.trim();

            if (!txHash) {
                alert('Please enter transaction hash');
                return;
            }

            try {
                const response = await axios.post(
                    \`/api/admin/withdrawals/\${currentWithdrawalId}/complete\`,
                    { tx_hash: txHash, notes: notes },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    // Refresh data FIRST to show updated status
                    await loadStats();
                    await loadWithdrawals();
                    // Then close modal and show alert
                    closeModal();
                    document.getElementById('txHash').value = '';
                    document.getElementById('txNotes').value = '';
                    showAlert('Withdrawal marked as completed', 'success');
                } else {
                    showAlert(response.data.message || 'Failed to complete withdrawal', 'error');
                    closeModal(); // Close modal even on failure
                }
            } catch (error) {
                showAlert(error.response?.data?.message || 'Failed to complete withdrawal', 'error');
                closeModal(); // Close modal even on error
            }
        }

        async function submitReject() {
            const reason = document.getElementById('rejectReason').value.trim();

            if (!reason) {
                alert('Please enter rejection reason');
                return;
            }

            try {
                const response = await axios.post(
                    \`/api/admin/withdrawals/\${currentWithdrawalId}/reject\`,
                    { reason: reason },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    console.log('✅ Rejection successful, refreshing data...');
                    // Refresh data FIRST to show updated status
                    await loadStats();
                    console.log('✅ Stats refreshed');
                    await loadWithdrawals();
                    console.log('✅ Withdrawals list refreshed');
                    // Then close modal and show alert
                    closeModal();
                    document.getElementById('rejectReason').value = '';
                    showAlert('Withdrawal rejected and refunded', 'success');
                } else {
                    showAlert(response.data.message || 'Failed to reject withdrawal', 'error');
                    closeModal(); // Close modal even on failure
                }
            } catch (error) {
                showAlert(error.response?.data?.message || 'Failed to reject withdrawal', 'error');
                closeModal(); // Close modal even on error
            }
        }

        function filterWithdrawals(status) {
            currentFilter = status;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            loadWithdrawals();
        }

        function showAlert(message, type) {
            const container = document.getElementById('alertContainer');
            container.innerHTML = \`<div class="alert alert-\${type}"><i class="fas fa-\${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> \${message}</div>\`;
            setTimeout(() => container.innerHTML = '', 5000);
        }

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await axios.post('/api/admin/auth/logout');
                    window.location.href = '/admin/panel/login';
                } catch (error) {
                    console.error('Logout error:', error);
                    window.location.href = '/admin/panel/login';
                }
            }
        });

        // Check authentication on page load
        async function checkAuth() {
            try {
                await axios.get('/api/admin/auth/me');
            } catch (error) {
                // Not authenticated, redirect to login
                window.location.href = '/admin/login';
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
                await loadStats();
                await loadWithdrawals();
            } finally {
                // Remove spinning animation
                icon.classList.remove('fa-spin');
                btn.disabled = false;
            }
        }

        checkAuth();
        loadStats();
        loadWithdrawals();
    </script>
</body>
</html>
`;
