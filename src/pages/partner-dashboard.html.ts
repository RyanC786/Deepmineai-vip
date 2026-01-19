export const partnerDashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partner Dashboard - DeepMine AI</title>
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .grid {
            display: grid;
        }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .gap-4 { gap: 16px; }
        .gap-6 { gap: 24px; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .space-x-4 > * + * { margin-left: 16px; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }
        .mt-4 { margin-top: 16px; }
        .mt-8 { margin-top: 32px; }
        .p-4 { padding: 16px; }
        .p-6 { padding: 24px; }
        .py-2 { padding-top: 8px; padding-bottom: 8px; }
        .py-3 { padding-top: 12px; padding-bottom: 12px; }
        .px-4 { padding-left: 16px; padding-right: 16px; }
        .px-6 { padding-left: 24px; padding-right: 24px; }
        .rounded { border-radius: 8px; }
        .rounded-lg { border-radius: 12px; }
        .text-white { color: white; }
        .text-gray-400 { color: #9CA3AF; }
        .text-blue-400 { color: #60A5FA; }
        .text-green-400 { color: #4ADE80; }
        .text-xl { font-size: 20px; }
        .text-2xl { font-size: 24px; }
        .text-3xl { font-size: 30px; }
        .text-sm { font-size: 14px; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-center { text-align: center; }
        .cursor-pointer { cursor: pointer; }
        .hidden { display: none; }
        .w-full { width: 100%; }
        @media (max-width: 768px) {
            .grid-cols-2, .grid-cols-3 { grid-template-columns: 1fr; }
        }
        
        body {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
        }
        .card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }
        .stat-card {
            background: linear-gradient(135deg, rgba(41, 121, 255, 0.1) 0%, rgba(123, 97, 255, 0.1) 100%);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            padding: 20px;
        }
        .stat-card.green {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
            border-color: rgba(16, 185, 129, 0.3);
        }
        .stat-card.yellow {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
            border-color: rgba(245, 158, 11, 0.3);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: rgba(41, 121, 255, 0.1);
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #33F0FF;
            border-bottom: 2px solid rgba(41, 121, 255, 0.3);
        }
        td {
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: #E2E8F0;
        }
        tr:hover {
            background: rgba(255, 255, 255, 0.02);
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge.pending { background: rgba(245, 158, 11, 0.2); color: #FCD34D; }
        .badge.completed { background: rgba(16, 185, 129, 0.2); color: #6EE7B7; }
        .badge.paid { background: rgba(99, 102, 241, 0.2); color: #A5B4FC; }
        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
        }
        .btn-primary {
            background: linear-gradient(135deg, #2979FF 0%, #1565C0 100%);
            color: white;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(41, 121, 255, 0.4);
        }
        .btn-success {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
        }
        .chart-container {
            height: 300px;
            position: relative;
        }
    </style>
</head>
<body class="text-white p-6">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-4xl font-bold mb-2">
                    <i class="fas fa-handshake mr-3" style="color: #33F0FF;"></i>
                    Partner Dashboard
                </h1>
                <p class="text-gray-400">2% Residual on Net Profit Tracking</p>
            </div>
            <div>
                <span class="text-gray-400 mr-4" id="partnerName">Loading...</span>
                <button onclick="logout()" class="btn btn-primary">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="stat-card">
                <div class="flex items-center justify-between mb-3">
                    <i class="fas fa-file-contract text-3xl" style="color: #2979FF;"></i>
                    <span class="text-gray-400 text-sm">Total Contracts</span>
                </div>
                <div class="text-3xl font-bold" id="totalContracts">0</div>
                <div class="text-sm text-gray-400 mt-1">All tracked contracts</div>
            </div>

            <div class="stat-card yellow">
                <div class="flex items-center justify-between mb-3">
                    <i class="fas fa-clock text-3xl" style="color: #F59E0B;"></i>
                    <span class="text-gray-400 text-sm">Pending</span>
                </div>
                <div class="text-3xl font-bold" id="pendingContracts">0</div>
                <div class="text-sm text-gray-400 mt-1">Active contracts</div>
            </div>

            <div class="stat-card green">
                <div class="flex items-center justify-between mb-3">
                    <i class="fas fa-check-circle text-3xl" style="color: #10B981;"></i>
                    <span class="text-gray-400 text-sm">Completed</span>
                </div>
                <div class="text-3xl font-bold" id="completedContracts">0</div>
                <div class="text-sm text-gray-400 mt-1">Ready for payout</div>
            </div>

            <div class="stat-card green">
                <div class="flex items-center justify-between mb-3">
                    <i class="fas fa-dollar-sign text-3xl" style="color: #10B981;"></i>
                    <span class="text-gray-400 text-sm">Total Earned</span>
                </div>
                <div class="text-3xl font-bold" id="totalEarned">$0</div>
                <div class="text-sm text-gray-400 mt-1">
                    <span class="text-yellow-400" id="unpaidAmount">$0</span> unpaid
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-4 mb-6">
            <button onclick="switchTab('overview')" id="tab-overview" class="btn btn-primary">
                <i class="fas fa-chart-line mr-2"></i>Overview
            </button>
            <button onclick="switchTab('residuals')" id="tab-residuals" class="btn" style="background: rgba(255,255,255,0.1);">
                <i class="fas fa-list mr-2"></i>All Residuals
            </button>
            <button onclick="switchTab('payouts')" id="tab-payouts" class="btn" style="background: rgba(255,255,255,0.1);">
                <i class="fas fa-money-check-alt mr-2"></i>Payouts
            </button>
            <button onclick="switchTab('projections')" id="tab-projections" class="btn" style="background: rgba(255,255,255,0.1);">
                <i class="fas fa-calendar-alt mr-2"></i>Monthly Projections
            </button>
            <button onclick="switchTab('analytics')" id="tab-analytics" class="btn" style="background: rgba(255,255,255,0.1);">
                <i class="fas fa-chart-bar mr-2"></i>Analytics
            </button>
        </div>

        <!-- Overview Tab -->
        <div id="content-overview" class="tab-content">
            <div class="card mb-6">
                <h2 class="text-2xl font-bold mb-4">
                    <i class="fas fa-clock mr-2" style="color: #33F0FF;"></i>
                    Recent Completions (Last 30 Days)
                </h2>
                <div class="overflow-x-auto">
                    <table id="recentCompletions">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Package</th>
                                <th>Investment</th>
                                <th>Net Profit</th>
                                <th>Residual (2%)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="recentCompletionsBody">
                            <tr><td colspan="7" class="text-center text-gray-400">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Residuals Tab -->
        <div id="content-residuals" class="tab-content" style="display: none;">
            <div class="card">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">
                        <i class="fas fa-list mr-2" style="color: #33F0FF;"></i>
                        All Residuals
                    </h2>
                    <div class="flex gap-3">
                        <select onchange="filterResiduals(this.value)" class="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="paid">Paid</option>
                        </select>
                        <button onclick="exportCSV()" class="btn btn-success">
                            <i class="fas fa-download mr-2"></i>Export CSV
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox" onchange="toggleSelectAll(this)"></th>
                                <th>ID</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>User</th>
                                <th>Package</th>
                                <th>Investment</th>
                                <th>Total Returns</th>
                                <th>Net Profit</th>
                                <th>Residual (2%)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="allResidualsBody">
                            <tr><td colspan="11" class="text-center text-gray-400">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <button onclick="markSelectedAsPaid()" class="btn btn-success">
                        <i class="fas fa-check mr-2"></i>Mark Selected as Paid
                    </button>
                    <div class="text-gray-400">
                        <span id="selectedCount">0</span> selected
                    </div>
                </div>
            </div>
        </div>

        <!-- Payouts Tab -->
        <div id="content-payouts" class="tab-content" style="display: none;">
            <div class="card">
                <h2 class="text-2xl font-bold mb-4">
                    <i class="fas fa-money-check-alt mr-2" style="color: #33F0FF;"></i>
                    Payout History
                </h2>
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Payout ID</th>
                                <th>Date</th>
                                <th>Period</th>
                                <th>Contracts</th>
                                <th>Amount</th>
                                <th>Reference</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="payoutsBody">
                            <tr><td colspan="7" class="text-center text-gray-400">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Monthly Projections Tab -->
        <div id="content-projections" class="tab-content" style="display: none;">
            <div class="card">
                <h2 class="text-2xl font-bold mb-4">
                    <i class="fas fa-calendar-alt mr-2" style="color: #33F0FF;"></i>
                    Monthly Payout Projections
                </h2>
                <p class="text-gray-400 mb-6">
                    See which contracts complete each month and the NEW residual amount available for payout that month.
                </p>
                <div id="projectionsContent">
                    <p class="text-center text-gray-400">Loading projections...</p>
                </div>
            </div>
        </div>

        <!-- Analytics Tab -->
        <div id="content-analytics" class="tab-content" style="display: none;">
            <div class="card">
                <h2 class="text-2xl font-bold mb-4">
                    <i class="fas fa-chart-bar mr-2" style="color: #33F0FF;"></i>
                    Withdrawal Fee Analytics
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="stat-card">
                        <div class="text-sm text-gray-400 mb-2">Total Withdrawals</div>
                        <div class="text-2xl font-bold" id="totalWithdrawals">0</div>
                    </div>
                    <div class="stat-card green">
                        <div class="text-sm text-gray-400 mb-2">Fees Collected (2%)</div>
                        <div class="text-2xl font-bold" id="totalFeesCollected">$0</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-sm text-gray-400 mb-2">Net Profit (After Network)</div>
                        <div class="text-2xl font-bold" id="netProfit">$0</div>
                    </div>
                </div>
                <p class="text-gray-400 text-center">Withdrawal analytics coming soon...</p>
            </div>
        </div>
    </div>

    <script>
        let currentData = null;
        let selectedResiduals = new Set();

        // Load dashboard data
        async function loadDashboard() {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('partner_token');
                if (!token) {
                    window.location.href = '/partner/login';
                    return;
                }

                const response = await fetch('/api/partner/dashboard', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('partner_token');
                        window.location.href = '/partner/login';
                        return;
                    }
                    throw new Error('Failed to load dashboard');
                }
                
                const data = await response.json();
                currentData = data;
                
                if (data.success) {
                    updateStats(data.summary);
                    updateRecentCompletions(data.recentCompletions);
                    updatePayouts(data.payouts);
                    
                    // Set partner name (use 'name' not 'partner_name')
                    document.getElementById('partnerName').textContent = data.partner.name || 'Partner';
                }
            } catch (error) {
                console.error('Error loading dashboard:', error);
                alert('Failed to load dashboard data: ' + error.message);
            }
        }

        function updateStats(summary) {
            document.getElementById('totalContracts').textContent = summary.totalContracts || 0;
            document.getElementById('pendingContracts').textContent = summary.pendingContracts || 0;
            document.getElementById('completedContracts').textContent = summary.completedContracts || 0;
            document.getElementById('totalEarned').textContent = '$' + (summary.totalResidualEarned || 0).toFixed(2);
            document.getElementById('unpaidAmount').textContent = '$' + (summary.unpaidResidual || 0).toFixed(2);
        }

        function updateRecentCompletions(completions) {
            const tbody = document.getElementById('recentCompletionsBody');
            if (!completions || completions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-400">No recent completions</td></tr>';
                return;
            }
            
            tbody.innerHTML = completions.map(c => \`
                <tr>
                    <td>\${new Date(c.completed_at).toLocaleDateString()}</td>
                    <td>\${c.user_name || c.user_email}</td>
                    <td>\${c.package_name}</td>
                    <td>$\${c.investment_amount.toFixed(2)}</td>
                    <td class="text-green-400">$\${c.net_profit.toFixed(2)}</td>
                    <td class="text-blue-400 font-bold">$\${c.residual_amount.toFixed(2)}</td>
                    <td><span class="badge \${c.status}">\${c.status}</span></td>
                </tr>
            \`).join('');
        }

        function updatePayouts(payouts) {
            const tbody = document.getElementById('payoutsBody');
            if (!payouts || payouts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-400">No payouts yet</td></tr>';
                return;
            }
            
            tbody.innerHTML = payouts.map(p => \`
                <tr>
                    <td>#\${p.id}</td>
                    <td>\${new Date(p.created_at).toLocaleDateString()}</td>
                    <td>\${new Date(p.payout_period_start).toLocaleDateString()} - \${new Date(p.payout_period_end).toLocaleDateString()}</td>
                    <td>\${p.total_contracts}</td>
                    <td class="text-green-400 font-bold">$\${p.total_residual_amount.toFixed(2)}</td>
                    <td>\${p.payment_reference || 'N/A'}</td>
                    <td><span class="badge \${p.payment_status}">\${p.payment_status}</span></td>
                </tr>
            \`).join('');
        }

        async function filterResiduals(status) {
            try {
                const token = localStorage.getItem('partner_token');
                if (!token) {
                    window.location.href = '/partner/login';
                    return;
                }
                
                const response = await fetch(\`/api/partner/residuals?status=\${status}\`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch residuals: ' + response.statusText);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    const tbody = document.getElementById('allResidualsBody');
                    if (!data.residuals || data.residuals.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="11" class="text-center text-gray-400">No residuals found</td></tr>';
                        return;
                    }
                    
                    tbody.innerHTML = data.residuals.map(r => {
                        // Calculate end date: start_date + contract_duration days
                        const startDate = new Date(r.start_date);
                        const endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + r.contract_duration);
                        
                        return \`
                        <tr>
                            <td><input type="checkbox" value="\${r.id}" onchange="updateSelected(this)"></td>
                            <td>#\${r.id}</td>
                            <td>\${startDate.toLocaleDateString()}</td>
                            <td>\${endDate.toLocaleDateString()}</td>
                            <td>\${r.user_name || r.user_email}</td>
                            <td>\${r.package_name}</td>
                            <td>$\${(r.investment || 0).toFixed(2)}</td>
                            <td>$\${(r.total_return || 0).toFixed(2)}</td>
                            <td class="text-green-400">$\${(r.net_profit || 0).toFixed(2)}</td>
                            <td class="text-blue-400 font-bold">$\${(r.residual_amount || 0).toFixed(2)}</td>
                            <td><span class="badge \${r.status}">\${r.status}</span></td>
                        </tr>
                        \`;
                    }).join('');
                }
            } catch (error) {
                console.error('Error filtering residuals:', error);
            }
        }

        function toggleSelectAll(checkbox) {
            const checkboxes = document.querySelectorAll('#allResidualsBody input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = checkbox.checked;
                updateSelected(cb);
            });
        }

        function updateSelected(checkbox) {
            if (checkbox.checked) {
                selectedResiduals.add(parseInt(checkbox.value));
            } else {
                selectedResiduals.delete(parseInt(checkbox.value));
            }
            document.getElementById('selectedCount').textContent = selectedResiduals.size;
        }

        async function markSelectedAsPaid() {
            if (selectedResiduals.size === 0) {
                alert('Please select residuals to mark as paid');
                return;
            }
            
            const reference = prompt('Enter payment reference:');
            if (!reference) return;
            
            const notes = prompt('Enter notes (optional):') || '';
            
            try {
                const response = await fetch('/api/partner/residuals/mark-paid', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        residualIds: Array.from(selectedResiduals),
                        paymentReference: reference,
                        notes: notes
                    })
                });
                
                const data = await response.json();
                if (data.success) {
                    alert(\`Successfully marked \${selectedResiduals.size} residuals as paid ($\${data.totalAmount.toFixed(2)})\`);
                    selectedResiduals.clear();
                    loadDashboard();
                    filterResiduals('all');
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error marking as paid:', error);
                alert('Failed to mark as paid');
            }
        }

        async function exportCSV() {
            window.location.href = '/api/partner/export?status=all';
        }

        function switchTab(tab) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('[id^="tab-"]').forEach(el => {
                el.style.background = 'rgba(255,255,255,0.1)';
            });
            
            // Show selected tab
            document.getElementById(\`content-\${tab}\`).style.display = 'block';
            document.getElementById(\`tab-\${tab}\`).className = 'btn btn-primary';
            
            // Load data if needed
            if (tab === 'residuals') {
                filterResiduals('all');
            } else if (tab === 'projections') {
                loadMonthlyProjections();
            }
        }
        
        async function loadMonthlyProjections() {
            try {
                const token = localStorage.getItem('partner_token');
                const response = await fetch('/api/partner/monthly-projections', {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = '/partner/login';
                        return;
                    }
                    throw new Error('Failed to load projections');
                }
                
                const data = await response.json();
                const container = document.getElementById('projectionsContent');
                
                if (!data.success || !data.projections || data.projections.length === 0) {
                    container.innerHTML = \`
                        <div class="text-center text-gray-400 py-8">
                            <i class="fas fa-calendar-times text-5xl mb-4 opacity-50"></i>
                            <p class="text-lg">No contracts completing in the next 12 months</p>
                            <p class="text-sm mt-2">Contracts will appear here as they approach completion</p>
                        </div>
                    \`;
                    return;
                }
                
                // Create timeline of monthly projections
                let html = \`
                    <div class="mb-6 p-4 rounded-lg" style="background: rgba(51, 240, 255, 0.1); border: 2px solid rgba(51, 240, 255, 0.3);">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-xl font-bold">Total Projected Revenue</h3>
                                <p class="text-sm text-gray-400 mt-1">\${data.total_contracts} active contracts</p>
                            </div>
                            <div class="text-3xl font-bold" style="color: #33F0FF;">
                                $\${data.total_potential.toFixed(2)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                \`;
                
                data.projections.forEach((proj, index) => {
                    const hasCompletions = proj.contracts_completing > 0;
                    const isNextPayout = hasCompletions && data.projections.slice(0, index).every(p => p.contracts_completing === 0);
                    
                    html += \`
                        <div class="p-4 rounded-lg \${isNextPayout ? 'border-2 border-green-500' : ''}" style="background: rgba(255,255,255,\${hasCompletions ? '0.05' : '0.02'});">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <h3 class="text-lg font-bold">\${proj.month}</h3>
                                        \${isNextPayout ? '<span class="badge" style="background: #10B981; font-size: 0.75rem;">Next Payout</span>' : ''}
                                    </div>
                                    <p class="text-sm text-gray-400 mt-1">
                                        <i class="fas fa-calendar mr-1"></i>
                                        Month ends: \${new Date(proj.month_end_date).toLocaleDateString()}
                                    </p>
                                    <p class="text-sm \${hasCompletions ? 'text-gray-400' : 'text-gray-500'}">
                                        <i class="fas fa-server mr-1"></i>
                                        \${hasCompletions 
                                            ? \`\${proj.contracts_completing} contract\${proj.contracts_completing > 1 ? 's' : ''} completing this month\`
                                            : 'No contracts completing'
                                        }
                                    </p>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold" style="color: \${hasCompletions ? '#10B981' : '#6B7280'};">
                                        $\${proj.total_residual.toFixed(2)}
                                    </div>
                                    <div class="text-xs text-gray-400 mt-1">\${hasCompletions ? 'New payout this month' : 'No payout'}</div>
                                </div>
                            </div>
                            \${hasCompletions ? \`
                            <!-- Contract Details -->
                            <div class="mt-3 pt-3 border-t border-gray-700">
                                <p class="text-sm text-gray-400 mb-2">Completing Contracts:</p>
                                <div class="space-y-1">
                    \` : ''}
                    \`;
                    
                    if (hasCompletions) {
                        proj.completing_contracts.forEach(contract => {
                            html += \`
                                <div class="flex items-center justify-between text-sm py-1">
                                    <span class="text-gray-300">
                                        <i class="fas fa-check-circle mr-1" style="color: #10B981;"></i>
                                        Miner #\${contract.machine_id} - \${contract.package_name}
                                    </span>
                                    <span class="font-bold" style="color: #33F0FF;">$\${contract.residual_amount.toFixed(2)}</span>
                                </div>
                            \`;
                        });
                        
                        html += \`
                                </div>
                            </div>
                        \`;
                    }
                    
                    html += '</div>';
                });
                
                html += '</div>';
                container.innerHTML = html;
                
            } catch (error) {
                console.error('Error loading monthly projections:', error);
                document.getElementById('projectionsContent').innerHTML = \`
                    <div class="text-center text-red-400 py-8">
                        <i class="fas fa-exclamation-triangle text-5xl mb-4"></i>
                        <p>Failed to load monthly projections</p>
                    </div>
                \`;
            }
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('partner_token');
                localStorage.removeItem('partner_name');
                window.location.href = '/partner/login';
            }
        }

        // Load data on page load
        loadDashboard();
    </script>
</body>
</html>
`;
