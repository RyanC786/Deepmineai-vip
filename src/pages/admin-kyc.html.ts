export const adminKYCPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KYC Management - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0B0F1E 0%, #1a1f3a 100%);
            color: #fff;
            min-height: 100vh;
        }

        .navbar {
            background: rgba(11, 15, 30, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(41, 121, 255, 0.2);
            padding: 16px 0;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo {
            height: 45px;
            width: auto;
            animation: logoGlow 2s ease-in-out infinite;
            filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
        }
        
        @keyframes logoGlow {
            0%, 100% { 
                filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.6));
                opacity: 1;
            }
            50% { 
                filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.9));
                opacity: 0.85;
            }
        }

        .nav-title {
            font-size: 18px;
            font-weight: 700;
            color: #FFFFFF;
        }

        .nav-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .nav-btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-btn-back {
            background: rgba(41, 121, 255, 0.1);
            color: #33F0FF;
            border: 1px solid rgba(41, 121, 255, 0.3);
        }

        .nav-btn-back:hover {
            background: rgba(41, 121, 255, 0.2);
            border-color: #33F0FF;
            transform: translateX(-2px);
        }

        .nav-btn-logout {
            background: rgba(239, 68, 68, 0.1);
            color: #FF6B6B;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .nav-btn-logout:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: #FF6B6B;
        }

        .container {
            max-width: 1400px;
            margin: 100px auto 40px;
            padding: 0 24px;
        }

        .page-header {
            margin-bottom: 32px;
        }

        .page-header h1 {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #33F0FF, #2979FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .page-header p {
            color: #B0B8D4;
            font-size: 16px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: rgba(26, 31, 53, 0.8);
            border: 2px solid #2979FF;
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            background: rgba(41, 121, 255, 0.1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 24px;
        }

        .stat-icon.pending { color: #FBB936; background: rgba(251, 191, 36, 0.1); }
        .stat-icon.approved { color: #22C55E; background: rgba(34, 197, 94, 0.1); }
        .stat-icon.rejected { color: #EF4444; background: rgba(239, 68, 68, 0.1); }
        .stat-icon.reviewing { color: #3B82F6; background: rgba(59, 130, 246, 0.1); }

        .stat-value {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .stat-label {
            color: #B0B8D4;
            font-size: 14px;
        }

        .filters {
            background: rgba(26, 31, 53, 0.8);
            border: 2px solid #2979FF;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            align-items: center;
        }

        .filter-group {
            display: flex;
            gap: 8px;
        }

        .filter-btn {
            padding: 10px 20px;
            background: rgba(41, 121, 255, 0.1);
            border: 2px solid rgba(41, 121, 255, 0.3);
            border-radius: 8px;
            color: #B0B8D4;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .filter-btn:hover {
            background: rgba(41, 121, 255, 0.2);
            color: #fff;
        }

        .filter-btn.active {
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border-color: transparent;
            color: #fff;
        }

        .search-box {
            flex: 1;
            min-width: 300px;
        }

        .search-box input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(41, 121, 255, 0.3);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
        }

        .search-box input::placeholder {
            color: #6B7280;
        }

        .submissions-table {
            background: rgba(26, 31, 53, 0.8);
            border: 2px solid #2979FF;
            border-radius: 16px;
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: rgba(41, 121, 255, 0.1);
        }

        th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #33F0FF;
            border-bottom: 2px solid rgba(41, 121, 255, 0.3);
        }

        tbody tr {
            border-bottom: 1px solid rgba(41, 121, 255, 0.1);
            transition: background 0.3s ease;
        }

        tbody tr:hover {
            background: rgba(41, 121, 255, 0.05);
        }

        td {
            padding: 16px;
            color: #E0E7FF;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-badge.pending {
            background: rgba(251, 191, 36, 0.1);
            color: #FBB936;
            border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .status-badge.approved {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-badge.rejected {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .status-badge.reviewing {
            background: rgba(59, 130, 246, 0.1);
            color: #3B82F6;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-view {
            background: rgba(41, 121, 255, 0.1);
            color: #33F0FF;
            border: 1px solid rgba(41, 121, 255, 0.3);
        }

        .btn-view:hover {
            background: rgba(41, 121, 255, 0.2);
        }

        .btn-approve {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .btn-approve:hover {
            background: rgba(34, 197, 94, 0.2);
        }

        .btn-reject {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-reject:hover {
            background: rgba(239, 68, 68, 0.2);
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal.show {
            display: flex;
        }

        .modal-content {
            background: #1A1F35;
            border: 2px solid #2979FF;
            border-radius: 24px;
            padding: 32px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            width: 100%;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .modal-header h2 {
            font-size: 24px;
            color: #33F0FF;
        }

        .btn-close {
            background: none;
            border: none;
            color: #E0E7FF;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .btn-close:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
        }

        .user-info {
            background: rgba(41, 121, 255, 0.1);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
        }

        .user-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        .user-info-row:last-child {
            margin-bottom: 0;
        }

        .user-info-label {
            color: #B0B8D4;
            font-weight: 500;
        }

        .user-info-value {
            color: #fff;
            font-weight: 600;
        }

        .documents-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }

        .document-card {
            background: rgba(26, 31, 53, 0.8);
            border: 2px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
        }

        .document-card h4 {
            margin-bottom: 12px;
            color: #33F0FF;
            font-size: 14px;
        }

        .document-preview {
            width: 100%;
            height: 200px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .document-preview:hover {
            transform: scale(1.02);
        }

        .document-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .document-preview .placeholder {
            color: #6B7280;
            font-size: 48px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #E0E7FF;
            font-weight: 500;
        }

        .form-group textarea {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(41, 121, 255, 0.3);
            border-radius: 8px;
            color: #fff;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            resize: vertical;
            min-height: 100px;
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
            color: #fff;
            font-weight: 600;
            cursor: pointer;
        }

        .btn-secondary {
            padding: 12px 24px;
            background: rgba(41, 121, 255, 0.1);
            border: 2px solid #2979FF;
            border-radius: 8px;
            color: #33F0FF;
            font-weight: 600;
            cursor: pointer;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #B0B8D4;
        }

        .empty-state i {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.3;
        }

        .loading {
            text-align: center;
            padding: 40px;
        }

        .spinner {
            border: 4px solid rgba(41, 121, 255, 0.2);
            border-top: 4px solid #2979FF;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .documents-grid {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo-container">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
                <span class="nav-title">Admin Dashboard - KYC Management</span>
            </div>
            <div class="nav-actions" style="display: flex; gap: 12px; align-items: center;">
                <a href="/admin/dashboard" class="nav-btn">
                    <i class="fas fa-chart-line"></i> Dashboard
                </a>
                <a href="/admin/users" class="nav-btn">
                    <i class="fas fa-users"></i> Users
                </a>
                <a href="/admin/kyc" class="nav-btn nav-btn-back">
                    <i class="fas fa-id-card"></i> KYC
                </a>
                <a href="/admin/machines" class="nav-btn">
                    <i class="fas fa-server"></i> Machines
                </a>
                <a href="/admin/withdrawals" class="nav-btn">
                    <i class="fas fa-money-bill-wave"></i> Withdrawals
                </a>
                <a href="/admin/deposits" class="nav-btn">
                    <i class="fas fa-wallet"></i> Deposits
                </a>
                <a href="/admin/referrals" class="nav-btn">
                    <i class="fas fa-users-cog"></i> Referrals
                </a>
                <a href="/admin/reports" class="nav-btn">
                    <i class="fas fa-chart-bar"></i> Reports
                </a>
                <a href="/admin/crm/dashboard" class="nav-btn" style="background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.4);">
                    <i class="fas fa-headset"></i> CRM
                </a>
                <button class="nav-btn nav-btn-logout" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="page-header">
            <h1>KYC Submissions</h1>
            <p>Review and manage user identity verification requests</p>
        </div>

        <!-- Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-value" id="statPending">0</div>
                <div class="stat-label">Pending Review</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon reviewing">
                    <i class="fas fa-hourglass-half"></i>
                </div>
                <div class="stat-value" id="statReviewing">0</div>
                <div class="stat-label">Under Review</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon approved">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-value" id="statApproved">0</div>
                <div class="stat-label">Approved</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon rejected">
                    <i class="fas fa-times-circle"></i>
                </div>
                <div class="stat-value" id="statRejected">0</div>
                <div class="stat-label">Rejected</div>
            </div>
        </div>

        <!-- Filters -->
        <div class="filters">
            <div class="filter-group">
                <button class="filter-btn active" data-status="all" onclick="filterByStatus('all')">
                    All Submissions
                </button>
                <button class="filter-btn" data-status="pending" onclick="filterByStatus('pending')">
                    Pending
                </button>
                <button class="filter-btn" data-status="reviewing" onclick="filterByStatus('reviewing')">
                    Reviewing
                </button>
                <button class="filter-btn" data-status="approved" onclick="filterByStatus('approved')">
                    Approved
                </button>
                <button class="filter-btn" data-status="rejected" onclick="filterByStatus('rejected')">
                    Rejected
                </button>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search by name or email..." onkeyup="filterSubmissions()">
                </div>
                <button class="nav-btn" onclick="refreshData()" style="background: rgba(41, 121, 255, 0.2); border: 1px solid rgba(41, 121, 255, 0.4); min-width: 120px;">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div id="loadingState" class="loading" style="display: none;">
            <div class="spinner"></div>
            <p>Loading submissions...</p>
        </div>

        <!-- Submissions Table -->
        <div class="submissions-table" id="submissionsTable" style="display: none;">
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Sumsub Status</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="submissionsBody">
                    <!-- Populated by JavaScript -->
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div id="emptyState" class="empty-state" style="display: none;">
            <i class="fas fa-folder-open"></i>
            <h3>No submissions found</h3>
            <p>No KYC submissions match your current filters</p>
        </div>
    </div>

    <!-- Review Modal -->
    <div id="reviewModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Review KYC Submission</h2>
                <button class="btn-close" onclick="closeReviewModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="user-info" id="modalUserInfo">
                <!-- Populated by JavaScript -->
            </div>

            <div class="documents-grid" id="modalDocuments">
                <!-- Populated by JavaScript -->
            </div>

            <div class="modal-actions">
                <button class="btn-sync" onclick="syncFromIdenfy()" style="background: #3b82f6; margin-right: auto;">
                    <i class="fas fa-sync-alt"></i> Sync from iDenfy
                </button>
                <button class="btn-approve" onclick="showApproveConfirm()">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" onclick="showRejectForm()">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    </div>

    <!-- Reject Form Modal -->
    <div id="rejectModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Reject KYC Submission</h2>
                <button class="btn-close" onclick="closeRejectModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="form-group">
                <label>Rejection Reason *</label>
                <textarea id="rejectionReason" placeholder="Please provide a clear reason for rejection..."></textarea>
            </div>

            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeRejectModal()">Cancel</button>
                <button class="btn-primary" onclick="confirmReject()">
                    <i class="fas fa-times"></i> Confirm Rejection
                </button>
            </div>
        </div>
    </div>

    <script>
        let allSubmissions = [];
        let currentFilter = 'all';
        let currentSubmissionId = null;

        // Load submissions on page load
        async function loadSubmissions() {
            try {
                document.getElementById('loadingState').style.display = 'block';
                document.getElementById('submissionsTable').style.display = 'none';
                document.getElementById('emptyState').style.display = 'none';

                console.log('📡 Fetching KYC submissions...');
                const response = await fetch('/api/kyc/admin/submissions?status=all');
                console.log('📡 Response status:', response.status);
                
                const data = await response.json();
                console.log('📡 API Response:', JSON.stringify(data, null, 2));

                document.getElementById('loadingState').style.display = 'none';

                if (!data.success) {
                    console.error('❌ API returned success=false');
                    showEmptyState();
                    return;
                }

                allSubmissions = data.submissions || [];
                console.log('📊 Total submissions:', allSubmissions.length);
                console.log('📊 First submission:', allSubmissions[0]);
                
                updateStatistics(allSubmissions);
                displaySubmissions(allSubmissions);
            } catch (error) {
                console.error('❌ Failed to load submissions:', error);
                document.getElementById('loadingState').style.display = 'none';
                showEmptyState();
            }
        }

        // Update statistics
        function updateStatistics(submissions) {
            const stats = {
                pending: 0,
                reviewing: 0,
                approved: 0,
                rejected: 0
            };

            submissions.forEach(sub => {
                const status = sub.review_status || sub.status || 'pending';
                if (stats[status] !== undefined) {
                    stats[status]++;
                }
            });

            document.getElementById('statPending').textContent = stats.pending;
            document.getElementById('statReviewing').textContent = stats.reviewing;
            document.getElementById('statApproved').textContent = stats.approved;
            document.getElementById('statRejected').textContent = stats.rejected;
        }

        // Display submissions
        function displaySubmissions(submissions) {
            console.log('🎨 displaySubmissions called with', submissions.length, 'submissions');
            const tbody = document.getElementById('submissionsBody');
            tbody.innerHTML = '';

            if (submissions.length === 0) {
                console.log('⚠️ No submissions to display');
                showEmptyState();
                return;
            }

            console.log('✅ Displaying submissions table');
            document.getElementById('submissionsTable').style.display = 'block';
            document.getElementById('emptyState').style.display = 'none';

            submissions.forEach((sub, index) => {
                console.log(\`📝 Processing submission \${index}:\`, sub);
                const row = document.createElement('tr');
                const status = sub.review_status || sub.status || 'pending';
                console.log(\`  Status: \${status}\`);
                row.innerHTML = \`
                    <td>\${sub.full_name}</td>
                    <td>\${sub.email}</td>
                    <td>
                        <span class="status-badge \${status}">
                            <i class="fas fa-\${getStatusIcon(status)}"></i>
                            \${status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </td>
                    <td>\${sub.kyc_status || 'N/A'}</td>
                    <td>\${new Date(sub.submitted_at).toLocaleDateString()}</td>
                    <td>
                        <div class="action-buttons">
                            \${sub.id && sub.applicant_id ? \`
                                <button class="btn btn-view" onclick="viewSubmission(\${sub.id})">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                \${status === 'pending' || status === 'reviewing' ? \`
                                    <button class="btn btn-approve" onclick="quickApprove(\${sub.id})">
                                        <i class="fas fa-check"></i> Approve
                                    </button>
                                    <button class="btn btn-reject" onclick="quickReject(\${sub.id})">
                                        <i class="fas fa-times"></i> Reject
                                    </button>
                                \` : ''}
                            \` : sub.kyc_status === 'approved' ? \`
                                <span style="color: #10b981; font-weight: 600;">
                                    <i class="fas fa-check-circle"></i> Approved
                                </span>
                            \` : \`
                                <span style="color: #888; font-style: italic; margin-right: 10px;">
                                    <i class="fas fa-info-circle"></i> Not Completed iDenfy
                                </span>
                                <button class="btn btn-danger" onclick="deleteUser(\${sub.user_id}, '\${sub.full_name}')" 
                                        style="background: #dc2626; font-size: 12px; padding: 6px 12px;">
                                    <i class="fas fa-trash"></i> Delete User
                                </button>
                            \`}
                        </div>
                    </td>
                \`;
                tbody.appendChild(row);
            });
            console.log(\`✅ Added \${submissions.length} rows to table\`);
        }

        // Get status icon
        function getStatusIcon(status) {
            const icons = {
                pending: 'clock',
                reviewing: 'hourglass-half',
                approved: 'check-circle',
                rejected: 'times-circle'
            };
            return icons[status] || 'question-circle';
        }

        // Filter by status
        function filterByStatus(status) {
            currentFilter = status;

            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(\`[data-status="\${status}"]\`).classList.add('active');

            // Filter submissions
            filterSubmissions();
        }

        // Filter submissions
        function filterSubmissions() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            
            let filtered = allSubmissions;

            // Filter by status
            if (currentFilter !== 'all') {
                filtered = filtered.filter(sub => sub.status === currentFilter);
            }

            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter(sub => 
                    sub.full_name.toLowerCase().includes(searchTerm) ||
                    sub.email.toLowerCase().includes(searchTerm)
                );
            }

            displaySubmissions(filtered);
        }

        // View submission details
        function viewSubmission(id) {
            const submission = allSubmissions.find(s => s.id === id);
            if (!submission) return;

            currentSubmissionId = id;

            // Populate user info
            document.getElementById('modalUserInfo').innerHTML = \`
                <div class="user-info-row">
                    <span class="user-info-label">Full Name:</span>
                    <span class="user-info-value">\${submission.full_name}</span>
                </div>
                <div class="user-info-row">
                    <span class="user-info-label">Email:</span>
                    <span class="user-info-value">\${submission.email}</span>
                </div>
                <div class="user-info-row">
                    <span class="user-info-label">Status:</span>
                    <span class="status-badge \${submission.status}">
                        <i class="fas fa-\${getStatusIcon(submission.status)}"></i>
                        \${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                </div>
                <div class="user-info-row">
                    <span class="user-info-label">Sumsub Status:</span>
                    <span class="user-info-value">\${submission.sumsub_review_status || 'N/A'}</span>
                </div>
                <div class="user-info-row">
                    <span class="user-info-label">Submitted:</span>
                    <span class="user-info-value">\${new Date(submission.submitted_at).toLocaleString()}</span>
                </div>
            \`;

            // Note: Document viewing would require R2 bucket setup
            document.getElementById('modalDocuments').innerHTML = \`
                <div class="document-card">
                    <h4>Documents via Sumsub</h4>
                    <div class="document-preview">
                        <div class="placeholder">
                            <i class="fas fa-file-alt"></i>
                        </div>
                    </div>
                    <p style="color: #B0B8D4; font-size: 13px;">
                        Documents are managed through Sumsub platform
                    </p>
                </div>
            \`;

            document.getElementById('reviewModal').classList.add('show');
        }

        // Close review modal
        function closeReviewModal() {
            document.getElementById('reviewModal').classList.remove('show');
            currentSubmissionId = null;
        }

        // Show approve confirmation
        function showApproveConfirm() {
            if (!confirm('Are you sure you want to approve this KYC submission?')) {
                return;
            }
            approveSubmission(currentSubmissionId);
        }

        // Quick approve
        function quickApprove(id) {
            if (!confirm('Are you sure you want to approve this KYC submission?')) {
                return;
            }
            approveSubmission(id);
        }

        // Approve submission
        async function approveSubmission(id) {
            try {
                const response = await fetch(\`/api/kyc/admin/\${id}/approve\`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    alert('KYC submission approved successfully!');
                    closeReviewModal();
                    loadSubmissions();
                } else {
                    alert('Failed to approve: ' + data.message);
                }
            } catch (error) {
                console.error('Approve failed:', error);
                alert('Network error. Please try again.');
            }
        }

        // Sync status from iDenfy
        async function syncFromIdenfy() {
            if (!currentSubmissionId) {
                alert('No submission selected');
                return;
            }

            const syncBtn = event.target.closest('button');
            const originalHTML = syncBtn.innerHTML;
            syncBtn.disabled = true;
            syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';

            try {
                console.log('🔄 Syncing from iDenfy for submission:', currentSubmissionId);
                
                const response = await fetch(\`/api/kyc/admin/\${currentSubmissionId}/sync\`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Sync successful:', data);
                    alert(\`Status synced from iDenfy: \${data.status.toUpperCase()}\\niDenfy Status: \${data.idenfyStatus}\`);
                    closeReviewModal();
                    loadSubmissions();
                } else {
                    console.error('❌ Sync failed:', data);
                    alert('Failed to sync: ' + data.message);
                }
            } catch (error) {
                console.error('❌ Sync error:', error);
                alert('Network error. Please try again.');
            } finally {
                syncBtn.disabled = false;
                syncBtn.innerHTML = originalHTML;
            }
        }

        // Show reject form
        function showRejectForm() {
            // Save the current ID before closing review modal
            const savedId = currentSubmissionId;
            closeReviewModal();
            // Restore the ID for rejection
            currentSubmissionId = savedId;
            document.getElementById('rejectModal').classList.add('show');
        }

        // Quick reject
        function quickReject(id) {
            console.log('🔴 quickReject called with ID:', id);
            currentSubmissionId = id;
            console.log('🔴 currentSubmissionId set to:', currentSubmissionId);
            document.getElementById('rejectModal').classList.add('show');
        }

        // Close reject modal
        function closeRejectModal() {
            document.getElementById('rejectModal').classList.remove('show');
            document.getElementById('rejectionReason').value = '';
            currentSubmissionId = null;
        }

        // Confirm reject
        async function confirmReject() {
            console.log('🔴 confirmReject called, currentSubmissionId:', currentSubmissionId);
            const reason = document.getElementById('rejectionReason').value.trim();

            if (!reason) {
                alert('Please provide a rejection reason');
                return;
            }

            console.log('🔴 About to fetch with ID:', currentSubmissionId, 'URL:', '/api/kyc/admin/' + currentSubmissionId + '/reject');

            try {
                const response = await fetch(\`/api/kyc/admin/\${currentSubmissionId}/reject\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reason })
                });

                const data = await response.json();

                if (data.success) {
                    alert('KYC submission rejected');
                    closeRejectModal();
                    loadSubmissions();
                } else {
                    alert('Failed to reject: ' + data.message);
                }
            } catch (error) {
                console.error('Reject failed:', error);
                alert('Network error. Please try again.');
            }
        }

        // Delete user (for users who haven't submitted KYC)
        async function deleteUser(userId, userName) {
            const confirmed = confirm('WARNING: DELETE USER ACCOUNT?\\n\\nUser: ' + userName + ' (ID: ' + userId + ')\\nStatus: No KYC submission\\n\\nThis will permanently delete:\\n- User account\\n- All associated data\\n\\nThis action CANNOT be undone!\\n\\nAre you absolutely sure?');
            
            if (!confirmed) {
                return;
            }

            // Second confirmation
            const doubleCheck = confirm('FINAL CONFIRMATION\\n\\nDelete ' + userName + '?\\n\\nClick OK to proceed.');
            if (!doubleCheck) {
                return;
            }

            try {
                const response = await fetch(\`/api/admin/user/\${userId}\`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    alert('User ' + userName + ' deleted successfully');
                    loadSubmissions();
                } else {
                    alert('Failed to delete user: ' + data.message);
                }
            } catch (error) {
                console.error('Delete user error:', error);
                alert('Network error. Please try again.');
            }
        }

        // Show empty state
        function showEmptyState() {
            document.getElementById('submissionsTable').style.display = 'none';
            document.getElementById('emptyState').style.display = 'block';
        }

        // Logout function
        async function logout() {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                window.location.href = '/admin-login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/admin-login';
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
                await loadSubmissions();
            } finally {
                // Remove spinning animation
                icon.classList.remove('fa-spin');
                btn.disabled = false;
            }
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', loadSubmissions);
    </script>
</body>
</html>
`
