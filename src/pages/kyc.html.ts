export const kycPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KYC Verification - DeepMine AI</title>
    
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
            max-width: 1200px;
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
            filter: drop-shadow(0 0 10px rgba(51, 240, 255, 0.5));
        }
        
        @keyframes logoGlow {
            0%, 100% { 
                filter: drop-shadow(0 0 10px rgba(51, 240, 255, 0.6));
                opacity: 1;
            }
            50% { 
                filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.9));
                opacity: 0.85;
            }
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

        .user-menu {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #E0E7FF;
        }

        .btn-logout {
            padding: 8px 16px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            color: #EF4444;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-logout:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: #EF4444;
        }

        .container {
            max-width: 900px;
            margin: 120px auto 80px;
            padding: 0 24px;
        }

        .page-header {
            text-align: center;
            margin-bottom: 48px;
        }

        .page-header h1 {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #33F0FF 0%, #2979FF 50%, #7B61FF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .page-header p {
            font-size: 18px;
            color: #B0B8D4;
        }

        .kyc-card {
            background: rgba(26, 31, 53, 0.8);
            border: 2px solid #2979FF;
            border-radius: 24px;
            padding: 48px;
            backdrop-filter: blur(10px);
        }

        .status-banner {
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 32px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .status-banner.pending {
            background: rgba(251, 191, 36, 0.1);
            border: 2px solid rgba(251, 191, 36, 0.3);
        }

        .status-banner.approved {
            background: rgba(34, 197, 94, 0.1);
            border: 2px solid rgba(34, 197, 94, 0.3);
        }

        .status-banner.rejected {
            background: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.3);
        }

        .status-banner.reviewing {
            background: rgba(59, 130, 246, 0.1);
            border: 2px solid rgba(59, 130, 246, 0.3);
        }

        .status-icon {
            font-size: 32px;
        }

        .status-banner.pending .status-icon { color: #FBB936; }
        .status-banner.approved .status-icon { color: #22C55E; }
        .status-banner.rejected .status-icon { color: #EF4444; }
        .status-banner.reviewing .status-icon { color: #3B82F6; }

        .status-content h3 {
            font-size: 20px;
            margin-bottom: 4px;
        }

        .status-content p {
            color: #B0B8D4;
            font-size: 14px;
        }

        .info-box {
            background: rgba(41, 121, 255, 0.1);
            border-left: 4px solid #2979FF;
            padding: 20px 24px;
            margin: 24px 0;
            border-radius: 8px;
        }

        .info-box h4 {
            color: #33F0FF;
            margin-bottom: 12px;
            font-size: 16px;
        }

        .info-box ul {
            list-style: none;
            padding-left: 0;
        }

        .info-box li {
            color: #B0B8D4;
            margin-bottom: 8px;
            padding-left: 24px;
            position: relative;
        }

        .info-box li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #22C55E;
            font-weight: bold;
        }

        #idenfy-iframe-container {
            min-height: 600px;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            background: rgba(11, 15, 30, 0.5);
        }

        #idenfy-iframe {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 16px;
        }

        .btn-primary {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(41, 121, 255, 0.4);
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .btn-secondary {
            width: 100%;
            padding: 16px;
            background: rgba(41, 121, 255, 0.1);
            border: 2px solid #2979FF;
            border-radius: 12px;
            color: #33F0FF;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 16px;
        }

        .btn-secondary:hover {
            background: rgba(41, 121, 255, 0.2);
        }

        .loading {
            display: none;
            text-align: center;
            padding: 40px;
        }

        .loading.show {
            display: block;
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

        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px;
            padding: 16px;
            color: #EF4444;
            margin-top: 16px;
            display: none;
        }

        .error-message.show {
            display: block;
        }

        .success-message {
            background: rgba(34, 197, 94, 0.1);
            border: 2px solid rgba(34, 197, 94, 0.3);
            border-radius: 12px;
            padding: 16px;
            color: #22C55E;
            margin-top: 16px;
            display: none;
        }

        .success-message.show {
            display: block;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #2979FF;
            text-decoration: none;
            font-weight: 500;
            margin-bottom: 32px;
            transition: all 0.3s ease;
        }

        .back-link:hover {
            color: #33F0FF;
            transform: translateX(-4px);
        }

        /* Camera Help Modal */
        .help-button {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border: none;
            border-radius: 50%;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(41, 121, 255, 0.4);
            transition: all 0.3s ease;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: helpButtonPulse 2s ease-in-out infinite;
        }

        .help-button::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: rgba(41, 121, 255, 0.4);
            animation: ripple 2s ease-out infinite;
        }

        .help-button:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 32px rgba(41, 121, 255, 0.6);
            animation: none;
        }

        @keyframes helpButtonPulse {
            0%, 100% {
                box-shadow: 0 8px 24px rgba(41, 121, 255, 0.4);
            }
            50% {
                box-shadow: 0 12px 36px rgba(41, 121, 255, 0.7);
            }
        }

        @keyframes ripple {
            0% {
                transform: scale(1);
                opacity: 0.8;
            }
            100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }

        /* Help Button Tooltip */
        .help-tooltip {
            position: fixed;
            bottom: 90px;
            right: 24px;
            background: #1E293B;
            color: #fff;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 998;
            animation: fadeInUp 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
            max-width: 250px;
            text-align: center;
        }

        .help-tooltip::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #1E293B;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeOut {
            to {
                opacity: 0;
                display: none;
            }
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            z-index: 1001;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        }

        .modal.show {
            display: flex;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: linear-gradient(135deg, #1A1F35 0%, #0B0F1E 100%);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 16px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 32px;
            position: relative;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .modal-header h2 {
            color: #fff;
            font-size: 24px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .modal-header h2 i {
            color: #33F0FF;
        }

        .close-modal {
            width: 32px;
            height: 32px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            color: #EF4444;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .close-modal:hover {
            background: rgba(239, 68, 68, 0.2);
        }

        .help-section {
            margin-bottom: 24px;
        }

        .help-section h3 {
            color: #33F0FF;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .help-section p {
            color: #B0B8D4;
            line-height: 1.6;
            margin-bottom: 12px;
        }

        .help-steps {
            list-style: none;
            padding: 0;
        }

        .help-steps li {
            background: rgba(41, 121, 255, 0.05);
            border-left: 3px solid #2979FF;
            padding: 12px 16px;
            margin-bottom: 12px;
            border-radius: 8px;
            color: #E0E7FF;
        }

        .help-steps li strong {
            color: #33F0FF;
            display: block;
            margin-bottom: 4px;
        }

        .device-tabs {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }

        .device-tab {
            flex: 1;
            padding: 12px;
            background: rgba(41, 121, 255, 0.1);
            border: 2px solid transparent;
            border-radius: 8px;
            color: #B0B8D4;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            font-weight: 600;
        }

        .device-tab.active {
            background: rgba(41, 121, 255, 0.2);
            border-color: #2979FF;
            color: #33F0FF;
        }

        .device-tab:hover {
            background: rgba(41, 121, 255, 0.15);
        }

        .device-content {
            display: none;
        }

        .device-content.active {
            display: block;
        }

        .warning-box {
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid rgba(251, 191, 36, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-top: 20px;
            display: flex;
            gap: 12px;
        }

        .warning-box i {
            color: #FBBF24;
            font-size: 20px;
            flex-shrink: 0;
        }

        .warning-box p {
            color: #FDE68A;
            margin: 0;
        }

        /* Camera Help Banner */
        .camera-help-banner {
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border-radius: 16px;
            padding: 16px 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(41, 121, 255, 0.2);
            animation: slideDown 0.5s ease;
        }

        .banner-content {
            display: flex;
            align-items: center;
            gap: 16px;
            color: #fff;
        }

        .banner-content > i {
            font-size: 32px;
            flex-shrink: 0;
            animation: pulse 2s ease-in-out infinite;
        }

        .banner-text {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .banner-text strong {
            font-size: 16px;
            font-weight: 600;
        }

        .banner-text span {
            font-size: 14px;
            opacity: 0.95;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.8;
            }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .nav-container {
                padding: 0 16px;
            }

            .logo {
                height: 35px;
            }

            .nav-title {
                font-size: 14px;
            }

            .nav-actions {
                gap: 8px;
            }

            .nav-btn {
                padding: 6px 12px;
                font-size: 13px;
            }

            .main-content {
                margin: 80px auto 20px;
                padding: 0 16px;
            }

            .page-header h1 {
                font-size: 24px;
            }

            .page-header p {
                font-size: 14px;
            }

            .camera-help-banner {
                padding: 12px 16px;
                margin-bottom: 16px;
            }

            .banner-content {
                gap: 12px;
            }

            .banner-content > i {
                font-size: 24px;
            }

            .banner-text strong {
                font-size: 14px;
            }

            .banner-text span {
                font-size: 12px;
            }

            .help-button {
                width: 50px;
                height: 50px;
                font-size: 20px;
                bottom: 20px;
                right: 20px;
            }

            .help-tooltip {
                bottom: 78px;
                right: 20px;
                max-width: 200px;
                font-size: 12px;
                padding: 10px 12px;
            }

            .kyc-card {
                padding: 24px 20px;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .file-upload-area {
                padding: 24px 16px;
            }

            .upload-instructions {
                font-size: 13px;
            }

            .status-badge {
                padding: 6px 12px;
                font-size: 13px;
            }

            .warning-box {
                padding: 12px;
                font-size: 14px;
            }

            .btn-submit,
            .btn-secondary {
                padding: 12px 20px;
                font-size: 15px;
            }
        }

        @media (max-width: 480px) {
            .page-header h1 {
                font-size: 20px;
            }

            .kyc-card {
                padding: 20px 16px;
            }

            .file-upload-area {
                padding: 20px 12px;
            }

            .upload-instructions li {
                font-size: 12px;
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
            </div>
            <div class="nav-links">
                <a href="/dashboard">Dashboard</a>
                <a href="/kyc">KYC Verification</a>
            </div>
            <div class="user-menu">
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <span id="userName">Loading...</span>
                </div>
                <button class="btn-logout" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </nav>

    <div class="container">
        <a href="/dashboard" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Back to Dashboard
        </a>

        <div class="page-header">
            <h1>KYC Verification</h1>
            <p>Complete your identity verification to unlock full platform features</p>
        </div>

        <!-- Camera Help Notice Banner -->
        <div class="camera-help-banner">
            <div class="banner-content">
                <i class="fas fa-camera"></i>
                <div class="banner-text">
                    <strong>Need help with camera access?</strong>
                    <span>Click the blue <i class="fas fa-question"></i> button at the bottom-right corner for step-by-step instructions</span>
                </div>
            </div>
        </div>

        <div class="kyc-card">
            <!-- Status Banner -->
            <div id="statusBanner" class="status-banner pending" style="display: none;">
                <div class="status-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="status-content">
                    <h3 id="statusTitle">Verification Pending</h3>
                    <p id="statusDescription">Your documents are under review</p>
                </div>
            </div>

            <!-- Information Box -->
            <div class="info-box">
                <h4><i class="fas fa-info-circle"></i> Required Documents</h4>
                <ul>
                    <li>Government-issued ID (passport, driver's license, or national ID card)</li>
                    <li>Clear selfie photo for identity verification</li>
                    <li>Proof of address (utility bill, bank statement, or official document)</li>
                    <li>All documents must be valid and clearly legible</li>
                </ul>
            </div>

            <!-- Loading State -->
            <div id="loadingState" class="loading">
                <div class="spinner"></div>
                <p>Initializing verification...</p>
            </div>

            <!-- Start Verification Button -->
            <button id="startVerificationBtn" class="btn-primary" onclick="startKYC()" style="display: none;">
                <i class="fas fa-shield-alt"></i>
                <span>Start Verification</span>
            </button>

            <!-- iDenfy iframe Container -->
            <div id="idenfy-iframe-container" style="display: none;">
                <iframe id="idenfy-iframe" allow="camera *; microphone *; geolocation *; fullscreen *" allowfullscreen></iframe>
            </div>

            <!-- Error Message -->
            <div id="errorMessage" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span id="errorText">An error occurred. Please try again.</span>
            </div>

            <!-- Success Message -->
            <div id="successMessage" class="success-message">
                <i class="fas fa-check-circle"></i>
                <span>Verification completed successfully! Your documents are under review.</span>
            </div>

            <!-- Refresh Status Button -->
            <button id="refreshStatusBtn" class="btn-secondary" onclick="checkKYCStatus()" style="display: none;">
                <i class="fas fa-sync-alt"></i> Refresh Status
            </button>
        </div>
    </div>

    <script>
        let currentUser = null;
        let authToken = null;

        // Check authentication on page load
        async function checkAuth() {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (!data.success) {
                    window.location.href = '/login?redirect=/kyc';
                    return;
                }
                
                currentUser = data.user;
                document.getElementById('userName').textContent = data.user.full_name;
                
                // Check KYC status
                await checkKYCStatus();
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = '/login?redirect=/kyc';
            }
        }

        // Check KYC status
        async function checkKYCStatus() {
            try {
                document.getElementById('loadingState').classList.add('show');
                
                const response = await fetch('/api/kyc/status');
                const data = await response.json();
                
                document.getElementById('loadingState').classList.remove('show');
                
                if (!data.success) {
                    // No KYC submission yet - show start button
                    document.getElementById('startVerificationBtn').style.display = 'flex';
                    return;
                }
                
                // Display current status
                displayKYCStatus(data.kycStatus, data.submission);
            } catch (error) {
                console.error('Status check failed:', error);
                document.getElementById('loadingState').classList.remove('show');
                document.getElementById('startVerificationBtn').style.display = 'flex';
            }
        }

        // Display KYC status
        function displayKYCStatus(status, submission) {
            const statusBanner = document.getElementById('statusBanner');
            const statusIcon = statusBanner.querySelector('.status-icon i');
            const statusTitle = document.getElementById('statusTitle');
            const statusDescription = document.getElementById('statusDescription');
            
            // Remove all status classes
            statusBanner.classList.remove('pending', 'approved', 'rejected', 'reviewing');
            
            // Update based on status
            switch(status) {
                case 'pending':
                    statusBanner.classList.add('pending');
                    statusIcon.className = 'fas fa-clock';
                    statusTitle.textContent = 'Verification Pending';
                    statusDescription.textContent = 'Please complete your document submission';
                    document.getElementById('startVerificationBtn').style.display = 'flex';
                    break;
                    
                case 'reviewing':
                case 'submitted':
                    statusBanner.classList.add('reviewing');
                    statusIcon.className = 'fas fa-hourglass-half';
                    statusTitle.textContent = 'Under Review';
                    statusDescription.textContent = 'Our team is reviewing your documents';
                    document.getElementById('refreshStatusBtn').style.display = 'block';
                    break;
                    
                case 'approved':
                    statusBanner.classList.add('approved');
                    statusIcon.className = 'fas fa-check-circle';
                    statusTitle.textContent = 'Verification Approved';
                    statusDescription.textContent = 'Your identity has been verified successfully';
                    if (submission?.approved_at) {
                        statusDescription.textContent += ' on ' + new Date(submission.approved_at).toLocaleDateString();
                    }
                    break;
                    
                case 'rejected':
                    statusBanner.classList.add('rejected');
                    statusIcon.className = 'fas fa-times-circle';
                    statusTitle.textContent = 'Verification Rejected';
                    statusDescription.textContent = submission?.rejection_reason || 'Please contact support for more information';
                    document.getElementById('startVerificationBtn').style.display = 'flex';
                    document.querySelector('#startVerificationBtn span').textContent = 'Resubmit Documents';
                    break;
            }
            
            statusBanner.style.display = 'flex';
        }

        // Start KYC verification
        async function startKYC() {
            try {
                document.getElementById('errorMessage').classList.remove('show');
                document.getElementById('loadingState').classList.add('show');
                document.getElementById('startVerificationBtn').style.display = 'none';
                
                // Initialize KYC with backend
                const response = await fetch('/api/kyc/init', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                document.getElementById('loadingState').classList.remove('show');
                
                if (!data.success) {
                    showError(data.message || 'Failed to initialize KYC verification');
                    document.getElementById('startVerificationBtn').style.display = 'flex';
                    return;
                }
                
                authToken = data.authToken;
                
                // Launch iDenfy iframe
                launchIdenfyIframe(data.authToken);
                
            } catch (error) {
                console.error('KYC initialization failed:', error);
                document.getElementById('loadingState').classList.remove('show');
                showError('Network error. Please check your connection and try again.');
                document.getElementById('startVerificationBtn').style.display = 'flex';
            }
        }

        // Launch iDenfy iframe
        function launchIdenfyIframe(authToken) {
            const container = document.getElementById('idenfy-iframe-container');
            const iframe = document.getElementById('idenfy-iframe');
            
            // iDenfy iframe URL
            const idenfyUrl = \`https://ivs.idenfy.com/api/v2/redirect?authToken=\${authToken}\`;
            
            // Detect mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
                console.log('📱 Mobile device detected - opening iDenfy in new window');
                
                // On mobile, open in new window/tab for better camera access
                const idenfyWindow = window.open(idenfyUrl, '_blank');
                
                if (!idenfyWindow) {
                    showError('Please allow pop-ups for this site to complete verification');
                    document.getElementById('startVerificationBtn').style.display = 'flex';
                    return;
                }
                
                // Show message to user
                showError('Verification opened in new tab. Complete the process and return here.');
                document.getElementById('errorMessage').classList.remove('show');
                
                // Show refresh button
                document.getElementById('refreshStatusBtn').style.display = 'block';
                
                // Poll for status changes (user will return after completion)
                const pollInterval = setInterval(() => {
                    checkKYCStatus().then(() => {
                        // Check if status changed
                        fetch('/api/kyc/status')
                            .then(res => res.json())
                            .then(data => {
                                if (data.success && data.kycStatus !== 'pending') {
                                    clearInterval(pollInterval);
                                    checkKYCStatus();
                                }
                            });
                    });
                }, 5000); // Check every 5 seconds
                
                // Stop polling after 10 minutes
                setTimeout(() => clearInterval(pollInterval), 600000);
                
            } else {
                console.log('💻 Desktop device - using iframe');
                
                // On desktop, use iframe
                iframe.src = idenfyUrl;
                container.style.display = 'block';
            }
            
            // Listen for iframe events (desktop only)
            window.addEventListener('message', function(event) {
                console.log('iDenfy event:', event.data);
                
                // iDenfy sends events like:
                // { type: 'IDENFY_SUCCESS' } - Verification successful
                // { type: 'IDENFY_ERROR', error: '...' } - Error occurred
                // { type: 'IDENFY_EXIT' } - User closed the verification
                
                if (event.data && typeof event.data === 'object') {
                    switch(event.data.type) {
                        case 'IDENFY_SUCCESS':
                            console.log('Verification completed successfully');
                            document.getElementById('successMessage').classList.add('show');
                            container.style.display = 'none';
                            setTimeout(() => {
                                checkKYCStatus();
                            }, 2000);
                            break;
                            
                        case 'IDENFY_ERROR':
                            console.error('Verification error:', event.data.error);
                            showError('Verification error: ' + (event.data.error || 'Unknown error'));
                            container.style.display = 'none';
                            document.getElementById('startVerificationBtn').style.display = 'flex';
                            break;
                            
                        case 'IDENFY_EXIT':
                            console.log('User exited verification');
                            container.style.display = 'none';
                            document.getElementById('startVerificationBtn').style.display = 'flex';
                            break;
                    }
                }
            });
        }

        // Show error message
        function showError(message) {
            document.getElementById('errorText').textContent = message;
            document.getElementById('errorMessage').classList.add('show');
        }

        // Logout handler
        async function handleLogout() {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout failed:', error);
                window.location.href = '/login';
            }
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            checkAuth();
            
            // Auto-show help tooltip after 2 seconds
            setTimeout(() => {
                const tooltip = document.getElementById('helpTooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        tooltip.style.display = 'none';
                    }, 5000);
                }
            }, 2000);
        });

        // Camera Help Modal Functions
        function openHelpModal() {
            document.getElementById('helpModal').classList.add('show');
            // Hide tooltip when modal opens
            const tooltip = document.getElementById('helpTooltip');
            if (tooltip) tooltip.style.display = 'none';
        }

        function closeHelpModal() {
            document.getElementById('helpModal').classList.remove('show');
        }

        function switchDeviceTab(device) {
            // Remove active class from all tabs and contents
            document.querySelectorAll('.device-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.device-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            document.getElementById(device + 'Tab').classList.add('active');
            document.getElementById(device + 'Content').classList.add('active');
        }

        // Close modal when clicking outside
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('helpModal');
            if (event.target === modal) {
                closeHelpModal();
            }
        });
    </script>

    <!-- Camera Permission Help Button -->
    <button class="help-button" onclick="openHelpModal()" title="Camera Help">
        <i class="fas fa-question"></i>
    </button>

    <!-- Help Tooltip (auto-shows on page load) -->
    <div id="helpTooltip" class="help-tooltip" style="display: none;">
        <strong>Need camera help?</strong><br>
        Click here for instructions!
    </div>

    <!-- Camera Help Modal -->
    <div id="helpModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>
                    <i class="fas fa-camera"></i>
                    Camera Permission Help
                </h2>
                <button class="close-modal" onclick="closeHelpModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Device Tabs -->
            <div class="device-tabs">
                <div id="iphoneTab" class="device-tab active" onclick="switchDeviceTab('iphone')">
                    <i class="fab fa-apple"></i> iPhone / iPad
                </div>
                <div id="androidTab" class="device-tab" onclick="switchDeviceTab('android')">
                    <i class="fab fa-android"></i> Android
                </div>
                <div id="desktopTab" class="device-tab" onclick="switchDeviceTab('desktop')">
                    <i class="fas fa-desktop"></i> Desktop
                </div>
            </div>

            <!-- iPhone Content -->
            <div id="iphoneContent" class="device-content active">
                <div class="help-section">
                    <h3><i class="fab fa-safari"></i> Using Safari on iPhone</h3>
                    <p>Follow these steps to enable camera access for KYC verification:</p>
                    <ol class="help-steps">
                        <li>
                            <strong>Step 1: Open Settings</strong>
                            Go to your iPhone Settings app
                        </li>
                        <li>
                            <strong>Step 2: Find Safari</strong>
                            Scroll down and tap on "Safari"
                        </li>
                        <li>
                            <strong>Step 3: Camera Permissions</strong>
                            Tap on "Camera" and select "Allow"
                        </li>
                        <li>
                            <strong>Step 4: Return to Verification</strong>
                            Come back to this page and click "Start Verification"
                        </li>
                        <li>
                            <strong>Step 5: Grant Access</strong>
                            When prompted, tap "Allow" to grant camera access
                        </li>
                    </ol>
                </div>

                <div class="help-section">
                    <h3><i class="fas fa-lightbulb"></i> Tips for Best Results</h3>
                    <ul class="help-steps">
                        <li>Use Safari browser (not in-app browsers)</li>
                        <li>Ensure good lighting for clear photos</li>
                        <li>Keep documents flat and fully visible</li>
                        <li>Remove any protective cases that cover the camera</li>
                    </ul>
                </div>

                <div class="warning-box">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>
                        <strong>Important:</strong> If you're using an in-app browser (like Instagram, Facebook, or WhatsApp browser), 
                        copy this URL and paste it in Safari: <code>https://www.deepmineai.vip/kyc</code>
                    </p>
                </div>
            </div>

            <!-- Android Content -->
            <div id="androidContent" class="device-content">
                <div class="help-section">
                    <h3><i class="fab fa-chrome"></i> Using Chrome on Android</h3>
                    <p>Follow these steps to enable camera access:</p>
                    <ol class="help-steps">
                        <li>
                            <strong>Step 1: Open Site Settings</strong>
                            Tap the lock icon (🔒) in the address bar
                        </li>
                        <li>
                            <strong>Step 2: Permissions</strong>
                            Tap "Permissions" or "Site settings"
                        </li>
                        <li>
                            <strong>Step 3: Camera Access</strong>
                            Find "Camera" and set it to "Allow"
                        </li>
                        <li>
                            <strong>Step 4: Reload Page</strong>
                            Refresh this page and start verification
                        </li>
                    </ol>
                </div>

                <div class="help-section">
                    <h3><i class="fas fa-cog"></i> Alternative Method (Settings App)</h3>
                    <ol class="help-steps">
                        <li>Open Android Settings → Apps → Chrome</li>
                        <li>Tap "Permissions"</li>
                        <li>Enable "Camera" permission</li>
                        <li>Return to this page</li>
                    </ol>
                </div>
            </div>

            <!-- Desktop Content -->
            <div id="desktopContent" class="device-content">
                <div class="help-section">
                    <h3><i class="fab fa-chrome"></i> Chrome / Edge</h3>
                    <ol class="help-steps">
                        <li>
                            <strong>Step 1: Click Camera Icon</strong>
                            Click the camera icon in the address bar (right side)
                        </li>
                        <li>
                            <strong>Step 2: Allow Access</strong>
                            Select "Allow" to grant camera permission
                        </li>
                        <li>
                            <strong>Step 3: Start Verification</strong>
                            Click "Start Verification" button
                        </li>
                    </ol>
                </div>

                <div class="help-section">
                    <h3><i class="fab fa-firefox"></i> Firefox</h3>
                    <ol class="help-steps">
                        <li>Click the "i" icon in the address bar</li>
                        <li>Click "More Information"</li>
                        <li>Go to "Permissions" tab</li>
                        <li>Set Camera to "Allow"</li>
                    </ol>
                </div>

                <div class="help-section">
                    <h3><i class="fab fa-safari"></i> Safari (Mac)</h3>
                    <ol class="help-steps">
                        <li>Go to Safari menu → Preferences</li>
                        <li>Click "Websites" tab</li>
                        <li>Select "Camera" from left sidebar</li>
                        <li>Set this website to "Allow"</li>
                    </ol>
                </div>
            </div>

            <!-- General Troubleshooting -->
            <div class="help-section" style="margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(41, 121, 255, 0.2);">
                <h3><i class="fas fa-tools"></i> Still Having Issues?</h3>
                <ul class="help-steps">
                    <li><strong>Check Device Camera:</strong> Make sure your device camera works in other apps</li>
                    <li><strong>Clear Browser Cache:</strong> Clear your browser cache and cookies</li>
                    <li><strong>Try Another Browser:</strong> Switch to Chrome, Safari, or Firefox</li>
                    <li><strong>Update Browser:</strong> Ensure you're using the latest browser version</li>
                    <li><strong>Disable Extensions:</strong> Temporarily disable ad blockers or privacy extensions</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>
`
