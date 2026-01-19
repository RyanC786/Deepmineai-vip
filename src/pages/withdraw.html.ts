export const withdrawPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdraw Funds - DeepMine AI</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            color: #ffffff;
            min-height: 100vh;
            padding-bottom: 60px;
            overflow-x: hidden;
            width: 100%;
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
            width: 100%;
            z-index: 1000;
        }

        .nav-container {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(41, 121, 255, 0.2);
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
            color: #33F0FF;
            font-size: 24px;
            font-weight: 700;
            cursor: pointer;
        }
        
        .logo-container img {
            height: 40px;
            width: auto;
            filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
        }

        .nav-links {
            display: flex;
            gap: 32px;
            align-items: center;
        }

        .nav-links a {
            color: #E0E7FF;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: #33F0FF;
        }

        .main-content {
            max-width: 800px;
            margin: 100px auto 0;
            padding: 0 24px;
        }

        .page-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .page-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #33F0FF, #2979FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 24px;
        }

        .balance-display {
            background: rgba(41, 121, 255, 0.05);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 32px;
        }

        .balance-label {
            color: #B0B8D4;
            font-size: 14px;
            margin-bottom: 8px;
        }

        .balance-amount {
            font-size: 36px;
            font-weight: 700;
            color: #22C55E;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .form-group label {
            display: block;
            color: #E0E7FF;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px 16px;
            background: rgba(41, 121, 255, 0.05);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 8px;
            color: #ffffff;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #33F0FF;
            background: rgba(41, 121, 255, 0.1);
        }

        .fee-info {
            background: rgba(251, 191, 36, 0.05);
            border: 1px solid rgba(251, 191, 36, 0.2);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
        }

        .fee-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .fee-info-row:last-child {
            margin-bottom: 0;
            padding-top: 12px;
            border-top: 1px solid rgba(251, 191, 36, 0.2);
            font-weight: 600;
        }

        .btn-submit {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border: none;
            border-radius: 8px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(41, 121, 255, 0.3);
        }

        .btn-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
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

        .alert-info {
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            color: #2979FF;
        }

        .withdrawal-history {
            margin-top: 40px;
        }

        .history-table {
            width: 100%;
            border-collapse: collapse;
        }

        .history-table th,
        .history-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid rgba(41, 121, 255, 0.1);
        }

        .history-table th {
            color: #B0B8D4;
            font-weight: 600;
            font-size: 14px;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .status-pending {
            background: rgba(251, 191, 36, 0.1);
            color: #FBBF24;
            border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .status-approved {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-completed {
            background: rgba(41, 121, 255, 0.1);
            color: #2979FF;
            border: 1px solid rgba(41, 121, 255, 0.3);
        }

        .status-rejected {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .nav-container {
                padding: 0 16px;
            }

            .logo-container {
                font-size: 18px;
            }

            .logo-container img {
                height: 35px;
            }

            .nav-links {
                display: none;
            }

            .main-content {
                margin: 80px auto 20px;
                padding: 0 16px;
            }

            .page-header h1 {
                font-size: 24px;
            }

            .card {
                padding: 24px 20px;
            }

            .balance-display {
                padding: 16px;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .btn-primary {
                padding: 12px;
                font-size: 15px;
            }

            .history-table {
                display: block;
                overflow-x: auto;
            }

            .history-table table {
                min-width: 600px;
            }

            .history-table th,
            .history-table td {
                padding: 8px;
                font-size: 13px;
            }
        }

        @media (max-width: 480px) {
            .page-header h1 {
                font-size: 20px;
            }

            .card {
                padding: 20px 16px;
            }

            .balance-value {
                font-size: 28px;
            }

            .btn-primary {
                padding: 10px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo-container" onclick="window.location.href='/dashboard'">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI">
                <span>DeepMine AI</span>
            </div>
            <div class="nav-links">
                <a href="/dashboard">Dashboard</a>
                <a href="/machines">Machines</a>
                <a href="/deposit">Deposit</a>
                <a href="/withdraw" class="active">Withdraw</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
        <div class="page-header">
            <h1><i class="fas fa-money-bill-wave"></i> Withdraw Funds</h1>
            <p style="color: #B0B8D4;">Request a withdrawal to your crypto wallet</p>
        </div>

        <!-- Balance Display -->
        <div class="balance-display">
            <div class="balance-label">Available Balance</div>
            <div class="balance-amount" id="availableBalance">$0.00</div>
        </div>

        <!-- Alerts -->
        <div id="alertContainer"></div>

        <!-- Withdrawal Form -->
        <div class="card">
            <h2 style="margin-bottom: 24px; font-size: 20px;">New Withdrawal Request</h2>
            
            <form id="withdrawalForm">
                <div class="form-group">
                    <label for="amount">Withdrawal Amount (USD) *</label>
                    <input 
                        type="number" 
                        id="amount" 
                        name="amount" 
                        placeholder="Minimum: $100" 
                        min="100" 
                        step="0.01"
                        required
                    >
                    <small style="color: #B0B8D4; margin-top: 4px; display: block;">Minimum withdrawal: $100</small>
                </div>

                <div class="form-group">
                    <label for="wallet_address">USDT Wallet Address (ERC-20 - Ethereum Network) *</label>
                    <input 
                        type="text" 
                        id="wallet_address" 
                        name="wallet_address" 
                        placeholder="Enter your USDT ERC-20 wallet address (starts with 0x...)"
                        required
                    >
                    <small style="color: #B0B8D4; margin-top: 4px; display: block;">
                        <i class="fas fa-info-circle"></i> For testing, you can enter "test" as the wallet address
                    </small>
                </div>

                <div id="feeCalculation" class="fee-info" style="display: none;">
                    <div class="fee-info-row">
                        <span>Withdrawal Amount:</span>
                        <span id="feeAmount">$0.00</span>
                    </div>
                    <div class="fee-info-row">
                        <span>Processing Fee (2%):</span>
                        <span id="feeCharge">$0.00</span>
                    </div>
                    <div class="fee-info-row">
                        <span>You will receive:</span>
                        <span id="netAmount" style="color: #22C55E; font-size: 18px;">$0.00</span>
                    </div>
                </div>

                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Important:</strong> Withdrawals are processed within 24-48 hours after admin approval. Make sure your wallet address is correct - transactions cannot be reversed.
                </div>

                <button type="submit" class="btn-submit" id="submitBtn">
                    <i class="fas fa-paper-plane"></i> Submit Withdrawal Request
                </button>
            </form>
        </div>

        <!-- Withdrawal History -->
        <div class="card withdrawal-history">
            <h2 style="margin-bottom: 24px; font-size: 20px;">Withdrawal History</h2>
            <div id="historyContainer">
                <p style="text-align: center; color: #B0B8D4; padding: 40px 0;">
                    <i class="fas fa-history fa-2x" style="margin-bottom: 12px; display: block;"></i>
                    Loading withdrawal history...
                </p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        let userBalance = 0;

        // Load user balance and withdrawal history
        async function loadData() {
            try {
                // Get user balance
                const authRes = await axios.get('/api/auth/me', { withCredentials: true });
                if (authRes.data.success) {
                    // Use 'balance' field (primary), fallback to wallet_balance for backwards compatibility
                    userBalance = authRes.data.user.balance || authRes.data.user.wallet_balance || 0;
                    document.getElementById('availableBalance').textContent = '$' + userBalance.toFixed(2);
                }

                // Load withdrawal history
                const historyRes = await axios.get('/api/withdrawals/my-withdrawals', { withCredentials: true });
                if (historyRes.data.success) {
                    displayHistory(historyRes.data.withdrawals);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        }

        // Calculate fees when amount changes
        document.getElementById('amount').addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            if (amount > 0) {
                const fee = amount * 0.02;
                const net = amount - fee;

                document.getElementById('feeAmount').textContent = '$' + amount.toFixed(2);
                document.getElementById('feeCharge').textContent = '$' + fee.toFixed(2);
                document.getElementById('netAmount').textContent = '$' + net.toFixed(2);
                document.getElementById('feeCalculation').style.display = 'block';
            } else {
                document.getElementById('feeCalculation').style.display = 'none';
            }
        });

        // Submit withdrawal form
        document.getElementById('withdrawalForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const amount = parseFloat(document.getElementById('amount').value);
            const wallet_address = document.getElementById('wallet_address').value.trim();

            // Validation
            if (amount < 100) {
                showAlert('Minimum withdrawal amount is $100', 'error');
                return;
            }

            if (amount > userBalance) {
                showAlert('Insufficient balance. Available: $' + userBalance.toFixed(2), 'error');
                return;
            }

            if (!wallet_address) {
                showAlert('Please enter your wallet address', 'error');
                return;
            }

            // Confirm withdrawal
            if (!confirm(\`Confirm withdrawal of $\${amount.toFixed(2)} to your wallet?\\n\\nNetwork: ERC-20 (Ethereum)\\nAddress: \${wallet_address}\\n\\nThis action cannot be undone.\`)) {
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                const response = await axios.post('/api/withdrawals/request', {
                    amount,
                    wallet_address
                }, { withCredentials: true });

                console.log('Withdrawal response:', response.data);

                if (response.data && response.data.success) {
                    // Success!
                    const withdrawalNum = response.data.withdrawal.withdrawal_number;
                    const netAmount = response.data.withdrawal.net_amount;
                    
                    // Clear form first
                    document.getElementById('withdrawalForm').reset();
                    document.getElementById('feeCalculation').style.display = 'none';
                    
                    // Show success message
                    showAlert(
                        \`✅ Withdrawal request submitted successfully!\\n\\nRequest ID: \${withdrawalNum}\\nYou will receive: $\${netAmount.toFixed(2)} USDT\\n\\nStatus: PENDING (Awaiting admin approval)\`, 
                        'success'
                    );
                    
                    // Reload data after a short delay
                    setTimeout(() => {
                        loadData();
                    }, 500);
                } else {
                    // Server returned success=false
                    console.error('Server error:', response.data);
                    showAlert(response.data.message || 'Failed to submit withdrawal request', 'error');
                }
            } catch (error) {
                // Network or other error
                console.error('Withdrawal error:', error);
                console.error('Error type:', typeof error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                
                if (error.response) {
                    console.error('Response status:', error.response.status);
                    console.error('Response data:', error.response.data);
                    console.error('Response headers:', error.response.headers);
                }
                
                let errorMessage = 'Failed to submit withdrawal request';
                
                if (error.response && error.response.data) {
                    if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.error) {
                        errorMessage = error.response.data.error;
                    } else if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                showAlert(errorMessage, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Withdrawal Request';
            }
        });

        // Display withdrawal history
        function displayHistory(withdrawals) {
            const container = document.getElementById('historyContainer');

            if (!withdrawals || withdrawals.length === 0) {
                container.innerHTML = \`
                    <p style="text-align: center; color: #B0B8D4; padding: 40px 0;">
                        <i class="fas fa-history fa-2x" style="margin-bottom: 12px; display: block;"></i>
                        No withdrawal history yet
                    </p>
                \`;
                return;
            }

            container.innerHTML = \`
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Request #</th>
                            <th>Amount</th>
                            <th>Net Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${withdrawals.map(w => \`
                            <tr>
                                <td>\${w.withdrawal_number}</td>
                                <td>$\${w.amount.toFixed(2)}</td>
                                <td style="color: #22C55E;">$\${w.net_amount.toFixed(2)}</td>
                                <td><span class="status-badge status-\${w.status}">\${w.status.toUpperCase()}</span></td>
                                <td>\${new Date(w.created_at).toLocaleDateString()}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
        }

        // Show alert message
        function showAlert(message, type) {
            const container = document.getElementById('alertContainer');
            
            // Clear any existing alerts
            container.innerHTML = '';
            
            const alert = document.createElement('div');
            alert.className = 'alert alert-' + type;
            
            // Format the message (preserve line breaks)
            const formattedMessage = message.replace(/\\n/g, '<br>');
            
            const icon = type === 'error' ? 'exclamation-circle' : 
                        type === 'success' ? 'check-circle' : 'info-circle';
            
            alert.innerHTML = '<i class="fas fa-' + icon + '"></i> ' + formattedMessage;
            alert.style.whiteSpace = 'pre-line';
            container.appendChild(alert);

            // Auto-remove after delay (longer for success messages)
            const delay = type === 'success' ? 8000 : 5000;
            setTimeout(() => {
                alert.style.opacity = '0';
                alert.style.transition = 'opacity 0.5s';
                setTimeout(() => alert.remove(), 500);
            }, delay);
            
            // Scroll to top so user sees the alert
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Load data on page load
        loadData();
    </script>
</body>
</html>
`
