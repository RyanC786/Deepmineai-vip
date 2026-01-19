export const machinesPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Mining Machines - DeepMine AI</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
            border-bottom: 1px solid rgba(41, 121, 255, 0.2);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 100%;
        }
        .package-card {
            background: rgba(26, 31, 53, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            padding: 24px;
            transition: all 0.3s;
            border: 2px solid rgba(41, 121, 255, 0.2);
            color: #E0E7FF;
        }
        .package-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(51, 240, 255, 0.2);
            border-color: #33F0FF;
        }
        .package-card.owned {
            background: rgba(34, 197, 94, 0.1);
            border-color: #22c55e;
            box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
        }
        .package-card.pending {
            background: rgba(245, 158, 11, 0.1);
            border-color: #f59e0b;
            box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
        }
        .balance-card {
            background: linear-gradient(135deg, #2979FF 0%, #33F0FF 100%);
            color: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .purchase-btn {
            background: linear-gradient(135deg, #2979FF 0%, #33F0FF 100%);
            color: white;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
        }
        .purchase-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .purchase-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
        }
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-owned {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.4);
        }
        .badge-pending {
            background: rgba(245, 158, 11, 0.2);
            color: #F59E0B;
            border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .badge-popular {
            background: rgba(51, 240, 255, 0.2);
            color: #33F0FF;
            border: 1px solid rgba(51, 240, 255, 0.4);
        }
        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            display: none;
            backdrop-filter: blur(10px);
        }
        .alert.success {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .alert.error {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .alert.info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #93c5fd;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .nav-container .max-w-7xl {
                padding: 16px;
                flex-direction: column;
                gap: 12px;
            }

            .max-w-7xl {
                padding: 0 16px;
            }

            .package-card {
                padding: 20px 16px;
            }

            .package-card h3 {
                font-size: 18px;
            }

            .package-card img {
                max-width: 100%;
                height: auto;
            }

            .grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .stat-card {
                padding: 12px;
            }

            .btn {
                padding: 10px 16px;
                font-size: 14px;
            }

            h1 {
                font-size: 24px;
            }

            h2 {
                font-size: 20px;
            }
        }

        @media (max-width: 480px) {
            .package-card {
                padding: 16px 12px;
            }

            .package-card h3 {
                font-size: 16px;
            }

            .stat-card {
                padding: 10px;
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
<body style="background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%); min-height: 100vh; color: #E0E7FF;">
    <!-- Navigation -->
    <div class="nav-container">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="h-10">
                <h1 class="text-white text-xl font-bold">Purchase Mining Machines</h1>
            </div>
            <button onclick="window.location.href='/dashboard'" class="text-white hover:text-gray-200">
                <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
            </button>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Alert Messages -->
        <div id="alert" class="alert"></div>

        <!-- Balance Card -->
        <div class="balance-card">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm opacity-90">Available Balance</p>
                    <p class="text-3xl font-bold" id="balance">Loading...</p>
                </div>
                <div class="text-right">
                    <p class="text-sm opacity-90">Total Invested</p>
                    <p class="text-2xl font-bold" id="invested">$0</p>
                </div>
            </div>
            <div class="mt-4 flex gap-2">
                <button onclick="window.location.href='/deposit'" class="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
                    <i class="fas fa-plus mr-2"></i>Deposit ETH
                </button>
            </div>
        </div>

        <!-- Info Banner -->
        <div style="background: rgba(41, 121, 255, 0.1); border: 1px solid rgba(41, 121, 255, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <div class="flex items-start gap-2">
                <i class="fas fa-info-circle text-blue-400 mt-1"></i>
                <div>
                    <p class="font-semibold" style="color: #33F0FF;">Purchase Rules</p>
                    <ul class="text-sm mt-2 space-y-1" style="color: #B0B8D4;">
                        <li><i class="fas fa-check mr-2 text-green-400"></i>One unit per tier allowed</li>
                        <li><i class="fas fa-check mr-2 text-green-400"></i>Purchases require admin activation</li>
                        <li><i class="fas fa-check mr-2 text-green-400"></i>Mining starts after activation (within 24 hours)</li>
                        <li><i class="fas fa-check mr-2 text-green-400"></i>180-day contract duration</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Mining Packages Grid -->
        <div id="packages-container">
            <p class="text-center py-8" style="color: #B0B8D4;">Loading packages...</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        axios.defaults.withCredentials = true;

        let userBalance = 0;
        let ownedPackages = [];

        // Show alert message
        function showAlert(message, type = 'success') {
            const alert = document.getElementById('alert');
            alert.textContent = message;
            alert.className = \`alert \${type}\`;
            alert.style.display = 'block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }

        // Load user balance
        async function loadBalance() {
            try {
                console.log('Loading balance...');
                const response = await axios.get('/api/auth/me');
                console.log('Auth me response:', response.data);
                const user = response.data.user; // Fix: API returns {success, user}

                userBalance = user.wallet_balance || 0;
                console.log('User balance set to:', userBalance);
                document.getElementById('balance').textContent = \`$\${userBalance.toFixed(2)}\`;
                document.getElementById('invested').textContent = \`$\${(user.total_invested || 0).toFixed(2)}\`;

            } catch (error) {
                console.error('Load balance error:', error);
                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            }
        }

        // Load user's owned machines
        async function loadOwnedMachines() {
            try {
                const response = await axios.get('/api/machines/my-machines');
                ownedPackages = response.data.machines.map(m => m.package_id);
                console.log('Owned packages:', ownedPackages);
            } catch (error) {
                console.error('Load owned machines error:', error);
            }
        }

        // Load mining packages
        async function loadPackages() {
            try {
                const response = await axios.get('/api/machines/packages');
                const packages = response.data.packages;

                if (packages.length === 0) {
                    document.getElementById('packages-container').innerHTML = \`
                        <p class="text-center text-gray-500 py-8">No packages available</p>
                    \`;
                    return;
                }

                const packagesHTML = packages.map((pkg, index) => {
                    const isOwned = ownedPackages.includes(pkg.id);
                    const canAfford = userBalance >= pkg.price;
                    const roi = ((pkg.daily_earnings * pkg.duration_days) / pkg.price * 100).toFixed(0);
                    const isPopular = [1000, 5000].includes(pkg.price); // Mark $1000 and $5000 as popular

                    // Use consistent 3D mining server image for all packages
                    let imageUrl = '/static/mining-server.png';

                    return \`
                        <div class="package-card \${isOwned ? 'owned' : ''}">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-xl font-bold" style="color: #E0E7FF;">\${pkg.name}</h3>
                                \${isOwned ? '<span class="badge badge-owned"><i class="fas fa-check mr-1"></i>Owned</span>' : ''}
                                \${!isOwned && isPopular ? '<span class="badge badge-popular"><i class="fas fa-star mr-1"></i>Popular</span>' : ''}
                            </div>
                            
                            <!-- Mining Server Image -->
                            <div class="mb-4 flex justify-center">
                                <img src="\${imageUrl}" alt="\${pkg.name}" style="max-width: 200px; height: auto; border-radius: 8px;">
                            </div>
                            
                            <div class="space-y-3 mb-4">
                                <div class="flex justify-between">
                                    <span style="color: #B0B8D4;">Price:</span>
                                    <span class="font-bold text-lg" style="color: #A78BFA;">$\${pkg.price}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span style="color: #B0B8D4;">Daily Earnings:</span>
                                    <span class="font-semibold" style="color: #22C55E;">$\${pkg.daily_earnings}/day</span>
                                </div>
                                <div class="flex justify-between">
                                    <span style="color: #B0B8D4;">Total Return (180 days):</span>
                                    <span class="font-semibold">$\${(pkg.daily_earnings * pkg.duration_days).toFixed(0)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span style="color: #B0B8D4;">ROI:</span>
                                    <span class="font-bold" style="color: #33F0FF;">\${roi}%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span style="color: #B0B8D4;">Hash Rate:</span>
                                    <span class="text-sm">\${pkg.hash_rate} TH/s</span>
                                </div>
                            </div>

                            \${isOwned ? \`
                                <button disabled class="purchase-btn">
                                    <i class="fas fa-check mr-2"></i>Already Owned
                                </button>
                            \` : !canAfford ? \`
                                <button disabled class="purchase-btn">
                                    <i class="fas fa-lock mr-2"></i>Insufficient Balance
                                </button>
                                <p class="text-xs mt-2 text-center" style="color: #EF4444;">
                                    Need $\${(pkg.price - userBalance).toFixed(2)} more
                                </p>
                            \` : \`
                                <button onclick="purchaseMachine(\${pkg.id}, '\${pkg.name}', \${pkg.price})" class="purchase-btn">
                                    <i class="fas fa-shopping-cart mr-2"></i>Purchase Now
                                </button>
                            \`}
                        </div>
                    \`;
                }).join('');

                document.getElementById('packages-container').innerHTML = \`
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        \${packagesHTML}
                    </div>
                \`;

            } catch (error) {
                console.error('Load packages error:', error);
                document.getElementById('packages-container').innerHTML = \`
                    <p class="text-center text-red-500 py-8">Failed to load packages. Please try again.</p>
                \`;
            }
        }

        // Purchase machine
        async function purchaseMachine(packageId, packageName, price) {
            if (!confirm(\`Purchase \${packageName} for $\${price}?\\n\\nThis will deduct $\${price} from your balance.\\nThe machine will be activated by admin within 24 hours.\`)) {
                return;
            }

            try {
                const response = await axios.post('/api/machines/purchase', {
                    packageId: packageId
                });

                showAlert(response.data.message, 'success');

                // Reload data
                await loadBalance();
                await loadOwnedMachines();
                await loadPackages();

            } catch (error) {
                console.error('Purchase error:', error);
                const message = error.response?.data?.message || 'Failed to purchase machine. Please try again.';
                showAlert(message, 'error');
            }
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', async () => {
            await loadBalance();
            await loadOwnedMachines();
            await loadPackages();
        });
    </script>
</body>
</html>
`
