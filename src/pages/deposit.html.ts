export const depositPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deposit Crypto - DeepMine AI</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            overflow-x: hidden;
            width: 100%;
        }
        
        .nav-container {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(41, 121, 255, 0.2);
            width: 100%;
        }
        .deposit-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 24px;
            margin-bottom: 24px;
        }
        .qr-container {
            display: flex;
            justify-content: center;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            margin: 20px 0;
        }
        .wallet-address {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            font-family: monospace;
            word-break: break-all;
            font-size: 14px;
            border: 2px solid #e5e7eb;
        }
        .copy-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .copy-btn:hover {
            background: #5568d3;
            transform: translateY(-1px);
        }
        .instruction-step {
            display: flex;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .instruction-step:last-child {
            border-bottom: none;
        }
        .step-number {
            background: #667eea;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        .submit-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .submit-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
        }
        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            display: none;
        }
        .alert.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
        }
        .alert.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        .alert.warning {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fcd34d;
        }
        .history-table {
            width: 100%;
            border-collapse: collapse;
        }
        .history-table th,
        .history-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .history-table th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .status-approved {
            background: #d1fae5;
            color: #065f46;
        }
        .status-rejected {
            background: #fee2e2;
            color: #991b1b;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            body {
                overflow-x: hidden;
            }

            .nav-container .max-w-7xl {
                padding: 16px;
            }

            .max-w-7xl {
                padding: 0 12px;
                max-width: 100%;
            }

            .deposit-card {
                padding: 20px 12px;
                margin: 0;
            }

            .qr-container {
                padding: 16px;
            }

            .qr-container canvas,
            .qr-container img {
                max-width: 100%;
                height: auto;
            }

            .wallet-address {
                font-size: 12px;
                padding: 10px;
                word-break: break-all;
            }

            .grid {
                grid-template-columns: 1fr;
            }

            /* Fix currency dropdown overflow */
            select, #currency {
                max-width: 100% !important;
                width: 100% !important;
                font-size: 13px !important;
                padding: 10px 8px !important;
                box-sizing: border-box !important;
            }

            select option {
                font-size: 13px;
                padding: 8px 4px;
            }

            input[type="number"],
            input[type="text"] {
                max-width: 100%;
                font-size: 14px;
            }

            .copy-btn {
                padding: 6px 12px;
                font-size: 14px;
            }

            table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
            }

            th, td {
                padding: 8px;
                font-size: 13px;
            }
        }

        @media (max-width: 480px) {
            .max-w-7xl {
                padding: 0 8px;
            }

            .deposit-card {
                padding: 16px 8px;
            }

            .wallet-address {
                font-size: 11px;
            }

            select, #currency {
                font-size: 12px !important;
                padding: 8px 6px !important;
            }

            select option {
                font-size: 12px;
            }

            input[type="number"],
            input[type="text"] {
                font-size: 13px;
                padding: 8px;
            }

            h1 {
                font-size: 20px;
            }

            h2 {
                font-size: 18px;
            }
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <div class="nav-container">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="h-10">
                <h1 class="text-white text-xl font-bold">Deposit Crypto (ETH, USDT, USDC, BTC)</h1>
            </div>
            <button onclick="window.location.href='/dashboard'" class="text-white hover:text-gray-200">
                <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
            </button>
        </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Alert Messages -->
        <div id="alert" class="alert"></div>

        <!-- KYC Warning (hidden by default) -->
        <div id="kyc-warning" class="alert warning" style="display: none;">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span id="kyc-message">Please complete KYC verification before making deposits.</span>
            <a href="/kyc" class="underline ml-2">Complete KYC Now</a>
        </div>

        <!-- Wallet Lock Warning -->
        <div id="wallet-lock-warning" class="alert warning" style="display: none;">
            <i class="fas fa-lock mr-2"></i>
            <strong>Important:</strong> Your first deposit will lock your wallet address permanently. 
            All future deposits and withdrawals must use the same wallet address for security.
        </div>

        <!-- Deposit Form -->
        <div class="deposit-card">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">
                <i class="fas fa-wallet mr-2 text-purple-600"></i>
                Deposit Cryptocurrency
            </h2>
            
            <!-- Quick Currency Guide -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 class="font-semibold text-purple-900 mb-3 flex items-center">
                    <i class="fas fa-info-circle mr-2"></i>
                    Which Currency Should I Choose?
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div class="bg-white rounded-lg p-3 border border-green-200">
                        <div class="font-semibold text-green-700 mb-1">💵 Stablecoins (Recommended)</div>
                        <div class="text-gray-600 text-xs">
                            <strong>USDT or USDC</strong> - Your deposit amount will be exactly your balance (1:1 with USD). No conversion risk!
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-3 border border-blue-200">
                        <div class="font-semibold text-blue-700 mb-1">🔷 Cryptocurrencies</div>
                        <div class="text-gray-600 text-xs">
                            <strong>ETH or BTC</strong> - Converted to USD at current market rate. Amount may vary based on price.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Business Wallet Address -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Send ETH to this address:
                </label>
                <div class="flex gap-2 items-center">
                    <div class="wallet-address flex-1" id="business-wallet">
                        Loading...
                    </div>
                    <button class="copy-btn" onclick="copyWalletAddress()">
                        <i class="fas fa-copy mr-1"></i>Copy
                    </button>
                </div>
            </div>

            <!-- QR Code -->
            <div class="qr-container">
                <img src="/static/eth-wallet-qr.png" alt="ETH Wallet QR Code" id="qr-code" style="width: 256px; height: 256px; margin: 0 auto; display: block;">
            </div>

            <!-- Network Info -->
            <div id="network-info" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div class="flex items-start gap-2">
                    <i class="fas fa-info-circle text-blue-600 mt-1"></i>
                    <div id="network-content">
                        <p class="font-semibold text-blue-900">Network: Ethereum Mainnet</p>
                        <p class="text-sm text-blue-700 mt-1">
                            Only send ETH on Ethereum Mainnet. Sending other tokens or using other networks will result in loss of funds.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Instructions -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">How to Deposit:</h3>
                <div id="instructions-container">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        <div class="text-gray-700"><strong>Select your currency below</strong> (ETH, USDT, USDC, or BTC)</div>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        <div class="text-gray-700">Send funds to the wallet address above using the <strong>correct network</strong></div>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">3</div>
                        <div class="text-gray-700">Take a screenshot of the transaction or copy the Transaction Hash (TXID)</div>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">4</div>
                        <div class="text-gray-700">Upload the proof using the form below</div>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">5</div>
                        <div class="text-gray-700">Wait for admin verification (usually within 24 hours)</div>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">6</div>
                        <div class="text-gray-700">Once approved, your balance will be updated and you can purchase mining machines</div>
                    </div>
                </div>
            </div>

            <!-- CRITICAL NOTICE -->
            <div class="bg-red-50 border-2 border-red-500 rounded-lg p-5 mb-6">
                <div class="flex items-start gap-3">
                    <i class="fas fa-exclamation-triangle text-red-600 text-3xl mt-1"></i>
                    <div>
                        <h4 class="font-bold text-red-900 text-lg mb-3">⚠️ IMPORTANT - READ CAREFULLY!</h4>
                        <p class="text-red-900 font-semibold mb-3">
                            After sending your crypto deposit, you MUST:
                        </p>
                        <ol class="text-red-900 space-y-2 ml-6 list-decimal font-medium">
                            <li><strong>Complete the deposit submission form below</strong></li>
                            <li><strong>Upload proof of transaction</strong></li>
                            <li><strong>Wait for admin approval</strong></li>
                        </ol>
                        <div class="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                            <p class="text-red-900 font-bold text-sm">
                                <i class="fas fa-times-circle mr-2"></i>
                                Simply sending funds to our wallet is NOT enough - you MUST submit the deposit form for us to process it!
                            </p>
                        </div>
                        <p class="text-red-800 text-sm mt-3">
                            <i class="fas fa-info-circle mr-1"></i>
                            <strong>Note:</strong> If you send crypto but don't submit this form, your deposit will not be processed automatically. Please contact support if you forgot to submit the form.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Deposit Proof Form -->
            <form id="deposit-form" class="space-y-4">
                <!-- IMPORTANT: Currency Selection Warning -->
                <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-yellow-600 text-2xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-yellow-900 mb-2">⚠️ IMPORTANT: Select Correct Currency!</h4>
                            <p class="text-sm text-yellow-800 mb-2">
                                <strong>You MUST select the exact currency you are depositing below.</strong> 
                                If you deposit USDT but select ETH, your balance will be incorrect.
                            </p>
                            <ul class="text-xs text-yellow-800 space-y-1 ml-4">
                                <li>✅ Depositing USDT? → Select "Tether USD (USDT)"</li>
                                <li>✅ Depositing USDC? → Select "USD Coin (USDC)"</li>
                                <li>✅ Depositing ETH? → Select "Ethereum (ETH)"</li>
                                <li>✅ Depositing BTC? → Select "Bitcoin (BTC)"</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-coins mr-1"></i> Currency <span class="text-red-500">*</span>
                    </label>
                    <select 
                        id="currency" 
                        name="currency"
                        class="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-semibold"
                        required
                        onchange="updateCurrencyInfo()"
                    >
                        <option value="">-- Select Currency You Are Depositing --</option>
                        <option value="ETH">🔷 Ethereum (ETH) - Cryptocurrency</option>
                        <option value="USDT">💵 Tether USD (USDT) - Stablecoin (1:1 USD)</option>
                        <option value="USDC">💵 USD Coin (USDC) - Stablecoin (1:1 USD)</option>
                        <option value="BTC">🟠 Bitcoin (BTC) - Cryptocurrency</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1" id="currency-note">⚠️ Select the EXACT currency you are depositing from your wallet</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Deposit Amount <span id="currency-label" class="text-purple-600"></span> <span class="text-red-500">*</span>
                    </label>
                    <input 
                        type="number" 
                        id="amount" 
                        name="amount"
                        step="0.001"
                        min="0.001"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Select currency first"
                        required
                        disabled
                    >
                    <p class="text-xs mt-1" id="amount-hint">
                        <span class="text-red-600">⚠️ Please select currency first</span>
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Your Wallet Address <span class="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="wallet-address" 
                        name="walletAddress"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Select currency first"
                        required
                        disabled
                    >
                    <p class="text-xs text-gray-500 mt-1">Enter the wallet address you're sending from</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Transaction Hash (TXID) <span class="text-gray-400">(optional)</span>
                    </label>
                    <input 
                        type="text" 
                        id="tx-hash" 
                        name="txHash"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Select currency first"
                        disabled
                    >
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Proof (Screenshot) <span class="text-gray-400">(optional)</span>
                    </label>
                    <input 
                        type="file" 
                        id="proof-file" 
                        name="proofFile"
                        accept="image/*"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled
                    >
                    <p class="text-xs text-gray-500 mt-1">Upload a screenshot of your transaction</p>
                </div>

                <button type="submit" id="submit-btn" class="submit-btn w-full">
                    <i class="fas fa-paper-plane mr-2"></i>
                    Submit Deposit Proof
                </button>
            </form>
        </div>

        <!-- Deposit History -->
        <div class="deposit-card">
            <h2 class="text-xl font-bold mb-4 text-gray-800">
                <i class="fas fa-history mr-2 text-purple-600"></i>
                Deposit History
            </h2>
            <div id="history-container">
                <p class="text-gray-500 text-center py-8">Loading...</p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        let businessWallet = '';
        let userWallet = '';
        let walletLocked = false;
        let selectedCurrency = '';

        // Update currency-specific UI
        function updateCurrencyInfo() {
            selectedCurrency = document.getElementById('currency').value;
            const currencyLabel = document.getElementById('currency-label');
            const amountHint = document.getElementById('amount-hint');
            const networkContent = document.getElementById('network-content');
            const networkInfo = document.getElementById('network-info');
            
            const amountInput = document.getElementById('amount');
            const walletInput = document.getElementById('wallet-address');
            const txHashInput = document.getElementById('tx-hash');
            const proofInput = document.getElementById('proof-file');
            
            // Show warning if no currency selected
            if (!selectedCurrency) {
                networkInfo.className = 'bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6';
                networkContent.innerHTML = '<p class="font-semibold text-red-900"><i class="fas fa-exclamation-triangle mr-2"></i>Please select a currency first!</p>' +
                    '<p class="text-sm text-red-700 mt-1">You must select the currency you are depositing before proceeding.</p>';
                amountHint.innerHTML = '<span class="text-red-600">⚠️ Select currency first</span>';
                currencyLabel.textContent = '';
                document.getElementById('currency-note').innerHTML = '<span class="text-red-600 font-semibold">⚠️ REQUIRED: Select the currency you are depositing!</span>';
                // Disable all form inputs
                amountInput.disabled = true;
                amountInput.placeholder = 'Select currency first';
                walletInput.disabled = true;
                walletInput.placeholder = 'Select currency first';
                txHashInput.disabled = true;
                txHashInput.placeholder = 'Select currency first';
                proofInput.disabled = true;
                return;
            }
            
            // Enable all form inputs and update label
            amountInput.disabled = false;
            amountInput.placeholder = '0.00';
            walletInput.disabled = false;
            walletInput.placeholder = '0x...';
            txHashInput.disabled = false;
            txHashInput.placeholder = '0x...';
            proofInput.disabled = false;
            currencyLabel.textContent = '(' + selectedCurrency + ')';
            networkInfo.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6';
            
            // Update amount hint based on currency
            if (selectedCurrency === 'USDT' || selectedCurrency === 'USDC') {
                amountHint.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle"></i> Stablecoins are 1:1 with USD (no conversion needed)</span>';
                networkContent.innerHTML = '<p class="font-semibold text-blue-900"><i class="fas fa-network-wired mr-2"></i>Network: Ethereum Mainnet (ERC-20)</p>' +
                    '<p class="text-sm text-blue-700 mt-2"><strong>⚠️ IMPORTANT:</strong> Send <strong>' + selectedCurrency + '</strong> as an <strong>ERC-20 token</strong> on <strong>Ethereum Mainnet</strong>.</p>' +
                    '<p class="text-sm text-red-600 mt-1"><i class="fas fa-exclamation-triangle mr-1"></i>Make sure you select <strong>' + selectedCurrency + '</strong> token (NOT ETH) in your wallet!</p>';
            } else if (selectedCurrency === 'ETH') {
                amountHint.innerHTML = '<span class="text-gray-500">ETH will be converted to USD at current market rate</span>';
                networkContent.innerHTML = '<p class="font-semibold text-blue-900"><i class="fas fa-network-wired mr-2"></i>Network: Ethereum Mainnet</p>' +
                    '<p class="text-sm text-blue-700 mt-2"><strong>⚠️ IMPORTANT:</strong> Only send <strong>native ETH</strong> on <strong>Ethereum Mainnet</strong>.</p>' +
                    '<p class="text-sm text-red-600 mt-1"><i class="fas fa-exclamation-triangle mr-1"></i>Sending other tokens or using other networks will result in loss of funds!</p>';
            } else if (selectedCurrency === 'BTC') {
                amountHint.innerHTML = '<span class="text-gray-500">BTC will be converted to USD at current market rate</span>';
                networkContent.innerHTML = '<p class="font-semibold text-blue-900"><i class="fas fa-network-wired mr-2"></i>Network: Bitcoin Mainnet</p>' +
                    '<p class="text-sm text-blue-700 mt-2"><strong>⚠️ IMPORTANT:</strong> Only send <strong>BTC</strong> on <strong>Bitcoin Mainnet</strong>.</p>' +
                    '<p class="text-sm text-red-600 mt-1"><i class="fas fa-exclamation-triangle mr-1"></i>Double-check the address before sending. Bitcoin transactions are irreversible!</p>';
            }
            
            // Update currency note
            const currencyNote = document.getElementById('currency-note');
            if (selectedCurrency === 'USDT' || selectedCurrency === 'USDC') {
                currencyNote.innerHTML = '<span class="text-green-600"><i class="fas fa-shield-alt"></i> <strong>Stablecoin:</strong> Your balance will be exactly the amount you deposit (1:1 with USD)</span>';
            } else {
                currencyNote.innerHTML = '<span class="text-orange-600"><i class="fas fa-chart-line"></i> <strong>Cryptocurrency:</strong> Will be converted to USD at current market rate when approved</span>';
            }
        }

        // Configure axios to include credentials
        axios.defaults.withCredentials = true;

        // Show alert message
        function showAlert(message, type = 'success') {
            const alert = document.getElementById('alert');
            alert.textContent = message;
            alert.className = \`alert \${type}\`;
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }

        // Copy wallet address
        function copyWalletAddress() {
            navigator.clipboard.writeText(businessWallet);
            showAlert('Wallet address copied to clipboard!', 'success');
        }

        // Load wallet information
        async function loadWalletInfo() {
            try {
                console.log('Loading wallet info...');
                const response = await axios.get('/api/deposits/wallet');
                console.log('Wallet response:', response.data);
                const data = response.data;

                businessWallet = data.wallet;
                userWallet = data.userWallet || '';
                walletLocked = data.walletLocked;

                // Display business wallet
                document.getElementById('business-wallet').textContent = businessWallet;

                // QR code is now a static image - no dynamic generation needed
                console.log('QR code loaded from static image: /static/eth-wallet-qr.png');
                console.log('Wallet address:', businessWallet);

                // Display instructions
                const instructionsHTML = data.instructions.map((instruction, index) => \`
                    <div class="instruction-step">
                        <div class="step-number">\${index + 1}</div>
                        <div class="text-gray-700">\${instruction}</div>
                    </div>
                \`).join('');
                const instructionsElement = document.getElementById('instructions-container');
                if (instructionsElement) {
                    instructionsElement.innerHTML = instructionsHTML;
                }

                // Pre-fill user wallet if locked
                const walletAddressInput = document.getElementById('wallet-address');
                const walletLockWarning = document.getElementById('wallet-lock-warning');
                
                if (walletLocked && userWallet && walletAddressInput) {
                    walletAddressInput.value = userWallet;
                    walletAddressInput.readOnly = true;
                    walletAddressInput.classList.add('bg-gray-100');
                } else if (walletLockWarning) {
                    // Show wallet lock warning for first deposit
                    walletLockWarning.style.display = 'block';
                }

            } catch (error) {
                console.error('Load wallet error:', error);
                console.error('Error details:', error.response);
                
                if (error.response?.status === 403) {
                    // KYC not approved
                    const kycWarning = document.getElementById('kyc-warning');
                    const kycMessage = document.getElementById('kyc-message');
                    const depositForm = document.getElementById('deposit-form');
                    
                    if (kycWarning) kycWarning.style.display = 'block';
                    if (kycMessage) kycMessage.textContent = error.response.data.message;
                    if (depositForm) depositForm.style.display = 'none';
                } else if (error.response?.status === 401) {
                    // Not authenticated
                    showAlert('Please login first. Redirecting...', 'error');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    showAlert('Failed to load wallet information: ' + (error.response?.data?.message || error.message), 'error');
                }
            }
        }

        // Submit deposit proof
        document.getElementById('deposit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';

            try {
                const formData = new FormData(e.target);
                
                const response = await axios.post('/api/deposits/submit', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                showAlert(response.data.message, 'success');
                
                // Reset form
                e.target.reset();
                
                // Reload history
                loadDepositHistory();

                // If wallet was just locked, update UI
                if (response.data.walletLocked && !walletLocked) {
                    walletLocked = true;
                    document.getElementById('wallet-address').readOnly = true;
                    document.getElementById('wallet-address').classList.add('bg-gray-100');
                    document.getElementById('wallet-lock-warning').style.display = 'none';
                }

            } catch (error) {
                console.error('Submit deposit error:', error);
                const message = error.response?.data?.message || 'Failed to submit deposit. Please try again.';
                showAlert(message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Deposit Proof';
            }
        });

        // Load deposit history
        async function loadDepositHistory() {
            try {
                const response = await axios.get('/api/deposits/history');
                const deposits = response.data.deposits;

                if (deposits.length === 0) {
                    document.getElementById('history-container').innerHTML = \`
                        <p class="text-gray-500 text-center py-8">No deposits yet</p>
                    \`;
                    return;
                }

                const tableHTML = \`
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Deposit #</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>TX Hash</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${deposits.map(deposit => \`
                                <tr>
                                    <td>\${new Date(deposit.created_at).toLocaleDateString()}</td>
                                    <td class="font-mono text-sm">\${deposit.deposit_number}</td>
                                    <td>\${deposit.amount} \${deposit.currency}</td>
                                    <td>
                                        <span class="status-badge status-\${deposit.status}">
                                            \${deposit.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td class="font-mono text-xs">
                                        \${deposit.tx_hash ? deposit.tx_hash.substring(0, 10) + '...' : 'N/A'}
                                    </td>
                                </tr>
                                \${deposit.rejection_reason ? \`
                                    <tr>
                                        <td colspan="5" class="text-sm text-red-600">
                                            <i class="fas fa-exclamation-circle mr-1"></i>
                                            Rejection reason: \${deposit.rejection_reason}
                                        </td>
                                    </tr>
                                \` : ''}
                                \${deposit.admin_notes && deposit.status === 'approved' ? \`
                                    <tr>
                                        <td colspan="5" class="text-sm text-green-600">
                                            <i class="fas fa-check-circle mr-1"></i>
                                            Admin notes: \${deposit.admin_notes}
                                        </td>
                                    </tr>
                                \` : ''}
                            \`).join('')}
                        </tbody>
                    </table>
                \`;

                document.getElementById('history-container').innerHTML = tableHTML;

            } catch (error) {
                console.error('Load history error:', error);
                document.getElementById('history-container').innerHTML = \`
                    <p class="text-red-500 text-center py-8">Failed to load deposit history</p>
                \`;
            }
        }

        // Wait for QRCode library to load
        function waitForQRCode(callback, timeout = 5000) {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (typeof QRCode !== 'undefined') {
                    clearInterval(checkInterval);
                    callback();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    console.error('QRCode library load timeout');
                    callback(); // Continue anyway
                }
            }, 100);
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            waitForQRCode(() => {
                loadWalletInfo();
                loadDepositHistory();
                updateCurrencyInfo(); // Initialize currency info
            });
        });
    </script>
</body>
</html>
`
