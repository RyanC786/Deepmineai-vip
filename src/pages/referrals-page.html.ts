/**
 * User Referrals Dashboard Page
 * Shows referral stats, VIP level, commission history, referral tree
 */

export const referralsPageHTML = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Referrals - DeepMine AI</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
    
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
            overflow-x: hidden;
            width: 100%;
        }
        
        .dashboard-container {
            max-width: 1400px;
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
        
        .vip-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
            border-radius: 20px;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .referral-link-box {
            background: rgba(26, 31, 53, 0.8);
            border: 2px solid #3B82F6;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .referral-link {
            background: rgba(59, 130, 246, 0.1);
            padding: 12px;
            border-radius: 8px;
            color: #60A5FA;
            word-break: break-all;
            font-family: 'Courier New', monospace;
        }
        
        .copy-btn {
            background: linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .copy-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
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
            gap: 10px;
        }
        
        .tree-level {
            margin: 15px 0;
            padding: 15px;
            background: rgba(59, 130, 246, 0.05);
            border-left: 4px solid #3B82F6;
            border-radius: 8px;
        }
        
        .referral-item {
            background: rgba(26, 31, 53, 0.8);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .commission-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .commission-table th {
            background: rgba(59, 130, 246, 0.1);
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #3B82F6;
            border-bottom: 2px solid rgba(59, 130, 246, 0.3);
        }
        
        .commission-table td {
            padding: 12px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .commission-table tr:hover {
            background: rgba(59, 130, 246, 0.05);
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .badge-pending { background: #FCD34D; color: #78350F; }
        .badge-paid { background: #10B981; color: #064E3B; }
        .badge-active { background: #3B82F6; color: #1E3A8A; }
        
        .progress-bar {
            height: 8px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
            transition: width 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }
        
        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
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
            max-width: 1400px;
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

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .dashboard-container {
                padding: 12px;
                max-width: 100%;
            }

            .section {
                padding: 16px;
                margin-bottom: 16px;
            }

            .container {
                padding: 16px;
            }

            .nav-links {
                padding: 0 16px;
                gap: 12px;
                overflow-x: auto;
                white-space: nowrap;
            }

            .nav-links a {
                padding: 6px 12px;
                font-size: 14px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .stat-card {
                padding: 20px 16px;
            }

            .ref-card {
                padding: 24px 20px;
            }

            /* Center referral boxes on mobile */
            .referral-link-box {
                padding: 12px;
                margin: 16px 0;
                max-width: 100%;
            }

            .referral-link {
                padding: 10px;
                font-size: 13px;
                word-break: break-all;
            }

            .copy-btn {
                padding: 10px 12px;
                font-size: 14px;
                width: 100%;
                margin: 6px 0 !important;
            }

            .earnings-table {
                display: block;
                overflow-x: auto;
            }

            .earnings-table table {
                min-width: 600px;
            }

            .earnings-table th,
            .earnings-table td {
                padding: 8px;
                font-size: 13px;
            }

            h1 {
                font-size: 24px;
            }

            h2 {
                font-size: 20px;
            }

            .ref-info p {
                font-size: 14px;
            }
        }

        @media (max-width: 480px) {
            .dashboard-container {
                padding: 8px;
            }

            .section {
                padding: 12px;
                margin-bottom: 12px;
            }

            .container {
                padding: 12px;
            }

            .stat-card {
                padding: 16px 12px;
            }

            .ref-card {
                padding: 20px 16px;
            }

            .referral-link-box {
                padding: 10px;
                margin: 12px 0;
            }

            .referral-link {
                font-size: 11px;
                padding: 8px;
            }

            .copy-btn {
                font-size: 13px;
                padding: 8px 10px;
            }

            h1 {
                font-size: 20px;
            }

            h2 {
                font-size: 18px;
            }

            .stat-value {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="nav-bar">
        <div class="nav-links">
            <a href="/dashboard"><i class="fas fa-home"></i> Dashboard</a>
            <a href="/referrals" class="active"><i class="fas fa-users"></i> Referrals</a>
            <a href="/machines"><i class="fas fa-server"></i> Machines</a>
            <a href="/withdraw"><i class="fas fa-wallet"></i> Withdraw</a>
        </div>
    </div>

    <div class="dashboard-container">
        <div id="loadingState" class="loading">
            <div class="spinner"></div>
            <p style="margin-top: 20px;">Loading your referral data...</p>
        </div>

        <div id="mainContent" style="display: none;">
            <!-- Header with VIP Info -->
            <div class="header">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                    <div>
                        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px;">
                            <i class="fas fa-users"></i> My Referral Program
                        </h1>
                        <div class="vip-badge" id="vipBadge">
                            <i class="fas fa-crown"></i>
                            <span>VIP 1</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.875rem; color: rgba(255,255,255,0.8);">Total Earnings</div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: #FCD34D;" id="totalEarnings">$0.00</div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div class="stat-card">
                    <i class="fas fa-user-plus" style="color: #3B82F6; font-size: 1.5rem;"></i>
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
                    <div class="stat-value" id="pendingCommissions">$0.00</div>
                    <div class="stat-label">Pending Commissions</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-chart-line" style="color: #8B5CF6; font-size: 1.5rem;"></i>
                    <div class="stat-value" id="commissionRate">3.0%</div>
                    <div class="stat-label">Level 3+ Rate</div>
                </div>
            </div>

            <!-- Referral Link Section -->
            <div class="section">
                <div class="section-title">
                    <i class="fas fa-link"></i> Your Referral Link
                </div>
                <div class="referral-link-box">
                    <div style="margin-bottom: 15px;">
                        <label style="color: #9CA3AF; font-size: 0.875rem; margin-bottom: 8px; display: block;">Share this link to earn commissions:</label>
                        <div class="referral-link" id="referralLink">Loading...</div>
                    </div>
                    <button class="copy-btn" onclick="copyReferralLink()">
                        <i class="fas fa-copy"></i> Copy Link
                    </button>
                    <button class="copy-btn" onclick="shareReferralLink()" style="margin-left: 10px; background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
                <div style="margin-top: 15px; padding: 15px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                    <h3 style="color: #3B82F6; font-weight: 600; margin-bottom: 10px;">
                        <i class="fas fa-info-circle"></i> Commission Structure
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(59, 130, 246, 0.1);">
                            <i class="fas fa-check" style="color: #10B981;"></i> 
                            <strong>Level 1 (Direct):</strong> $80 per purchase
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(59, 130, 246, 0.1);">
                            <i class="fas fa-check" style="color: #10B981;"></i> 
                            <strong>Level 2:</strong> $15 per purchase
                        </li>
                        <li style="padding: 8px 0;">
                            <i class="fas fa-check" style="color: #10B981;"></i> 
                            <strong>Level 3+:</strong> <span id="vipRate">3.0%</span> of purchase (based on your VIP level)
                        </li>
                    </ul>
                </div>
            </div>

            <!-- VIP Progress -->
            <div class="section" id="vipProgressSection">
                <div class="section-title">
                    <i class="fas fa-trophy"></i> VIP Progress
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #9CA3AF;">Current: <strong style="color: #3B82F6;" id="currentVip">VIP 1</strong></span>
                    <span style="color: #9CA3AF;">Next: <strong style="color: #F59E0B;" id="nextVip">VIP 2</strong></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="vipProgress" style="width: 0%;"></div>
                </div>
                <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <div style="color: #9CA3AF; font-size: 0.875rem;">Required Referrals</div>
                        <div style="color: #E5E7EB; font-weight: 600;" id="requiredReferrals">0 / 5</div>
                    </div>
                    <div>
                        <div style="color: #9CA3AF; font-size: 0.875rem;">Required Purchases</div>
                        <div style="color: #E5E7EB; font-weight: 600;" id="requiredPurchases">$0 / $1,000</div>
                    </div>
                </div>
            </div>

            <!-- Referral Tree -->
            <div class="section">
                <div class="section-title">
                    <i class="fas fa-sitemap"></i> My Referral Network
                </div>
                <div id="referralTree">
                    <div class="loading">Loading referral tree...</div>
                </div>
            </div>

            <!-- Commission History -->
            <div class="section">
                <div class="section-title">
                    <i class="fas fa-history"></i> Commission History
                </div>
                <div id="commissionHistory">
                    <div class="loading">Loading commissions...</div>
                </div>
            </div>

            <!-- Payout Section -->
            <div class="section">
                <div class="section-title">
                    <i class="fas fa-money-bill-wave"></i> Request Payout
                </div>
                <div style="padding: 20px; background: rgba(59, 130, 246, 0.05); border-radius: 8px;">
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 0.875rem; color: #9CA3AF; margin-bottom: 5px;">Available for Payout</div>
                        <div style="font-size: 2rem; font-weight: 700; color: #10B981;" id="availablePayout">$0.00</div>
                    </div>
                    <button class="btn-primary" id="requestPayoutBtn" onclick="requestPayout()" disabled>
                        <i class="fas fa-wallet"></i> Request Payout (Minimum $50)
                    </button>
                    <p style="color: #9CA3AF; font-size: 0.875rem; margin-top: 10px;">
                        <i class="fas fa-info-circle"></i> Minimum payout amount is $50. Payouts are processed within 3-5 business days.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;
        let statsData = null;

        // Load all data on page load
        async function loadAllData() {
            try {
                // Load referral stats
                const statsResponse = await axios.get('/api/referrals/stats');
                if (statsResponse.data.success) {
                    statsData = statsResponse.data.data;
                    displayStats(statsData);
                }

                // Load referral tree with detailed downline
                const treeResponse = await axios.get('/api/referrals/downline');
                console.log('[REFERRALS] Downline API response:', treeResponse.data);
                if (treeResponse.data.success) {
                    console.log('[REFERRALS] Level 1 users sample:', treeResponse.data.data.level1?.users?.slice(0, 2));
                    displayReferralTree(treeResponse.data.data);
                }

                // Load commission history with details
                const commissionsResponse = await axios.get('/api/referrals/commission-details');
                if (commissionsResponse.data.success) {
                    displayCommissionHistory(commissionsResponse.data.data);
                }

                document.getElementById('loadingState').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
            } catch (error) {
                console.error('Error loading referral data:', error);
                const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
                document.getElementById('loadingState').innerHTML = \`
                    <div style="color: #EF4444;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <p>Failed to load referral data</p>
                        <p style="font-size: 0.875rem; color: #9CA3AF; margin-top: 10px;">\${errorMsg}</p>
                        <button class="btn-primary" onclick="location.reload()" style="margin-top: 20px;">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                \`;
            }
        }

        function displayStats(data) {
            // Header stats
            document.getElementById('totalEarnings').textContent = \`$\${data.total_earnings?.toFixed(2) || '0.00'}\`;
            document.getElementById('vipBadge').innerHTML = \`
                <i class="fas fa-crown"></i>
                <span>VIP \${data.vip_level || 1}</span>
            \`;

            // Stat cards
            document.getElementById('totalReferrals').textContent = data.total_referrals || 0;
            
            const activeCount = data.referrals_by_level?.reduce((sum, level) => sum + (level.active_count || 0), 0) || 0;
            document.getElementById('activeReferrals').textContent = activeCount;

            const pendingAmount = data.payout_stats?.pending_amount || 0;
            document.getElementById('pendingCommissions').textContent = \`$\${pendingAmount.toFixed(2)}\`;

            const commissionRate = data.vip_info?.level3_commission_percent || data.vip_info?.profit_share || 3.0;
            document.getElementById('commissionRate').textContent = \`\${commissionRate}%\`;
            document.getElementById('vipRate').textContent = \`\${commissionRate}%\`;

            // Referral link
            const referralLink = \`https://www.deepmineai.vip/register?ref=\${data.referral_code}\`;
            document.getElementById('referralLink').textContent = referralLink;

            // VIP Progress
            if (data.next_vip) {
                document.getElementById('currentVip').textContent = \`VIP \${data.vip_level}\`;
                document.getElementById('nextVip').textContent = \`VIP \${data.next_vip.level}\`;
                
                const referralProgress = Math.min((data.total_referrals / data.next_vip.min_direct_referrals) * 100, 100);
                document.getElementById('vipProgress').style.width = \`\${referralProgress}%\`;
                
                document.getElementById('requiredReferrals').textContent = \`\${data.total_referrals} / \${data.next_vip.min_direct_referrals}\`;
                document.getElementById('requiredPurchases').textContent = \`Progress tracking\`;
            } else {
                document.getElementById('vipProgressSection').innerHTML = \`
                    <div class="section-title"><i class="fas fa-trophy"></i> VIP Status</div>
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-crown" style="font-size: 3rem; color: #F59E0B; margin-bottom: 15px;"></i>
                        <h3 style="color: #F59E0B; font-size: 1.5rem; font-weight: 700;">Maximum VIP Level Reached!</h3>
                        <p style="color: #9CA3AF; margin-top: 10px;">You're enjoying the highest commission rates available.</p>
                    </div>
                \`;
            }

            // Payout button
            if (pendingAmount >= 50) {
                document.getElementById('requestPayoutBtn').disabled = false;
            }
            document.getElementById('availablePayout').textContent = \`$\${pendingAmount.toFixed(2)}\`;
        }

        function displayReferralTree(data) {
            const treeHtml = \`
                <div class="tree-level">
                    <h3 style="color: #3B82F6; font-weight: 600; margin-bottom: 15px;">
                        <i class="fas fa-layer-group"></i> Level 1 - Direct Referrals (\${data.level1?.count || 0})
                    </h3>
                    \${data.level1?.users?.length > 0 ? data.level1.users.map(ref => renderDetailedReferralItem(ref, 1)).join('') : '<p style="color: #9CA3AF; padding: 10px;">No direct referrals yet. Share your link to start earning!</p>'}
                </div>
                
                <div class="tree-level">
                    <h3 style="color: #10B981; font-weight: 600; margin-bottom: 15px;">
                        <i class="fas fa-layer-group"></i> Level 2 - Second Level (\${data.level2?.count || 0})
                    </h3>
                    \${data.level2?.users?.length > 0 ? data.level2.users.map(ref => renderDetailedReferralItem(ref, 2)).join('') : '<p style="color: #9CA3AF; padding: 10px;">No second level referrals yet</p>'}
                </div>
                
                <div class="tree-level">
                    <h3 style="color: #8B5CF6; font-weight: 600; margin-bottom: 15px;">
                        <i class="fas fa-layer-group"></i> Level 3+ - Deep Network (\${data.level3?.count || 0})
                    </h3>
                    \${data.level3?.users?.length > 0 ? data.level3.users.map(ref => renderDetailedReferralItem(ref, 3)).join('') : '<p style="color: #9CA3AF; padding: 10px;">No deep network referrals yet</p>'}
                </div>
            \`;
            
            document.getElementById('referralTree').innerHTML = treeHtml;
        }

        function renderDetailedReferralItem(ref, level) {
            const joinedDate = new Date(ref.registration_date).toLocaleDateString();
            const myEarnings = parseFloat(ref.my_earnings_from_them) || 0;
            const totalPurchases = parseFloat(ref.total_purchases) || 0;
            const theirReferrals = ref.their_referrals || 0;
            
            return \`
                <div class="referral-item" style="flex-direction: column; align-items: flex-start; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: flex-start;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #E5E7EB; font-size: 1.1rem; margin-bottom: 5px;">
                                <i class="fas fa-user-circle"></i> \${ref.display_name || (ref.initials ? ref.initials + ' (ID: ' + ref.user_id + ')' : 'User (ID: ' + ref.user_id + ')')}
                            </div>
                            <div style="font-size: 0.875rem; color: #9CA3AF;">
                                <i class="fas fa-id-badge"></i> User ID: \${ref.user_id}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span class="vip-badge" style="padding: 4px 12px; font-size: 0.875rem;">
                                <i class="fas fa-crown"></i> VIP \${ref.vip_level || 1}
                            </span>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; width: 100%; background: rgba(59, 130, 246, 0.05); padding: 12px; border-radius: 8px;">
                        <div>
                            <div style="color: #9CA3AF; font-size: 0.75rem; margin-bottom: 3px;">Joined</div>
                            <div style="color: #E5E7EB; font-weight: 600; font-size: 0.875rem;">
                                <i class="fas fa-calendar"></i> \${joinedDate}
                            </div>
                        </div>
                        <div>
                            <div style="color: #9CA3AF; font-size: 0.75rem; margin-bottom: 3px;">Total Purchases</div>
                            <div style="color: #10B981; font-weight: 600; font-size: 0.875rem;">
                                <i class="fas fa-shopping-cart"></i> $\${totalPurchases.toFixed(2)}
                            </div>
                        </div>
                        <div>
                            <div style="color: #9CA3AF; font-size: 0.75rem; margin-bottom: 3px;">Their Referrals</div>
                            <div style="color: #3B82F6; font-weight: 600; font-size: 0.875rem;">
                                <i class="fas fa-users"></i> \${theirReferrals}
                            </div>
                        </div>
                        <div>
                            <div style="color: #9CA3AF; font-size: 0.75rem; margin-bottom: 3px;">My Earnings</div>
                            <div style="color: #F59E0B; font-weight: 600; font-size: 0.875rem;">
                                <i class="fas fa-dollar-sign"></i> $\${myEarnings.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function displayCommissionHistory(data) {
            if (!data.commissions || data.commissions.length === 0) {
                document.getElementById('commissionHistory').innerHTML = \`
                    <p style="color: #9CA3AF; text-align: center; padding: 30px;">
                        <i class="fas fa-inbox" style="font-size: 3rem; display: block; margin-bottom: 15px; opacity: 0.5;"></i>
                        No commissions yet. Share your referral link to start earning!
                    </p>
                \`;
                return;
            }

            const totals = data.totals || {};
            const summaryHtml = \`
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; padding: 20px; background: rgba(59, 130, 246, 0.05); border-radius: 8px;">
                    <div>
                        <div style="color: #9CA3AF; font-size: 0.875rem; margin-bottom: 5px;">Total Earned</div>
                        <div style="color: #10B981; font-weight: 700; font-size: 1.5rem;">$\${(totals.total || 0).toFixed(2)}</div>
                    </div>
                    <div>
                        <div style="color: #9CA3AF; font-size: 0.875rem; margin-bottom: 5px;">Pending</div>
                        <div style="color: #F59E0B; font-weight: 700; font-size: 1.5rem;">$\${(totals.pending || 0).toFixed(2)}</div>
                    </div>
                    <div>
                        <div style="color: #9CA3AF; font-size: 0.875rem; margin-bottom: 5px;">Paid Out</div>
                        <div style="color: #3B82F6; font-weight: 700; font-size: 1.5rem;">$\${(totals.paid || 0).toFixed(2)}</div>
                    </div>
                </div>
            \`;

            const tableHtml = \`
                <table class="commission-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Level</th>
                            <th>From User</th>
                            <th>Purchase</th>
                            <th>Rate</th>
                            <th>Earned</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${data.commissions.map(comm => \`
                            <tr>
                                <td>\${new Date(comm.created_at).toLocaleDateString()}</td>
                                <td><span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #3B82F6;">\${comm.commission_type_label || comm.commission_type}</span></td>
                                <td>
                                    <div style="font-weight: 600;">\${comm.from_user_name || 'User'}</div>
                                    <div style="font-size: 0.75rem; color: #9CA3AF;">\${comm.from_user_email}</div>
                                </td>
                                <td style="color: #9CA3AF;">$\${(comm.purchase_amount || 0).toFixed(2)}</td>
                                <td style="color: #9CA3AF;">\${comm.commission_rate ? (comm.commission_rate * 100).toFixed(1) + '%' : 'Fixed'}</td>
                                <td style="font-weight: 600; color: #10B981;">$\${(comm.amount || 0).toFixed(2)}</td>
                                <td><span class="badge badge-\${comm.status}">\${comm.status}</span></td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
            
            document.getElementById('commissionHistory').innerHTML = summaryHtml + tableHtml;
        }

        function copyReferralLink() {
            const link = document.getElementById('referralLink').textContent;
            navigator.clipboard.writeText(link).then(() => {
                alert('✅ Referral link copied to clipboard!');
            });
        }

        function shareReferralLink() {
            const link = document.getElementById('referralLink').textContent;
            if (navigator.share) {
                navigator.share({
                    title: 'Join DeepMine AI',
                    text: 'Start earning with AI mining! Use my referral link:',
                    url: link
                });
            } else {
                copyReferralLink();
            }
        }

        async function requestPayout() {
            if (!confirm('Request payout for all pending commissions?')) return;

            try {
                const response = await axios.post('/api/referrals/payout/request');
                if (response.data.success) {
                    alert('✅ Payout request submitted successfully!');
                    location.reload();
                } else {
                    alert('❌ ' + (response.data.message || 'Failed to request payout'));
                }
            } catch (error) {
                alert('❌ ' + (error.response?.data?.message || 'Failed to request payout'));
            }
        }

        // Load data on page load
        loadAllData();
    </script>
</body>
</html>
`
