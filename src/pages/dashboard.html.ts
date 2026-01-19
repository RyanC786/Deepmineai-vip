export const dashboardPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - DeepMine AI</title>
    <meta name="description" content="DeepMine AI Dashboard - Track your mining operations, earnings, and manage your crypto mining account">
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#2979FF">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="DeepMine AI">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="/manifest.json">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
    
    <!-- iOS Icons - Multiple sizes required -->
    <link rel="apple-touch-icon" href="/static/dragon-logo-v2.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/static/dragon-logo-v2.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/static/dragon-logo-v2.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/static/dragon-logo-v2.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/static/dragon-logo-v2.png">
    
    <!-- iOS Splash Screens -->
    <link rel="apple-touch-startup-image" href="/static/dragon-logo-v2.png">
    
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
            background: #0B0F1E;
            border-bottom: 1px solid rgba(41, 121, 255, 0.3);
            padding: 16px 0;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .nav-container {
            max-width: 1400px;
            width: 100%;
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
            transition: transform 0.3s ease;
        }
        
        .logo-container:hover {
            transform: scale(1.05);
        }
        
        .logo-container img {
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

        .nav-links a:hover,
        .nav-links a.active {
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
        }

        .main-content {
            max-width: 1400px;
            width: 100%;
            margin: 100px auto 40px;
            padding: 0 24px;
        }

        .page-header {
            margin-bottom: 32px;
        }

        .page-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #33F0FF, #2979FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .page-header p {
            color: #B0B8D4;
            font-size: 16px;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            border-color: rgba(41, 121, 255, 0.4);
            transform: translateY(-2px);
        }

        .stat-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .stat-card-title {
            color: #B0B8D4;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-card-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .stat-card-icon.blue {
            background: rgba(41, 121, 255, 0.1);
            color: #2979FF;
        }

        .stat-card-icon.green {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
        }

        .stat-card-icon.purple {
            background: rgba(168, 85, 247, 0.1);
            color: #A855F7;
        }

        .stat-card-icon.cyan {
            background: rgba(51, 240, 255, 0.1);
            color: #33F0FF;
        }

        .stat-card-value {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #ffffff;
        }

        .stat-card-change {
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .stat-card-change.positive {
            color: #22C55E;
        }

        .stat-card-change.negative {
            color: #EF4444;
        }

        /* Content Grid */
        .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
        }

        /* Mobile Hamburger Menu */
        .mobile-menu-toggle {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 8px;
        }

        .mobile-menu-toggle span {
            width: 25px;
            height: 3px;
            background: #33F0FF;
            border-radius: 3px;
            transition: all 0.3s ease;
        }

        /* Tablet Responsive (1024px and below) */
        @media (max-width: 1024px) {
            .content-grid {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Mobile Responsive (768px and below) */
        @media (max-width: 768px) {
            .navbar {
                padding: 12px 0;
            }

            .nav-container {
                padding: 0 12px;
                gap: 8px;
            }

            .logo-container {
                font-size: 16px;
                flex: 1;
            }

            .logo-container span {
                display: none; /* Hide "DeepMine AI" text on mobile */
            }

            .logo-container img {
                height: 32px;
            }

            .nav-links {
                display: none;
                position: fixed;
                top: 57px;
                left: 0;
                right: 0;
                width: 100%;
                background: rgba(11, 15, 30, 0.98);
                backdrop-filter: blur(10px);
                flex-direction: column;
                padding: 20px;
                gap: 16px;
                border-bottom: 1px solid rgba(41, 121, 255, 0.2);
                z-index: 999;
            }

            .nav-links.active {
                display: flex;
            }

            .nav-links a {
                padding: 12px;
                text-align: center;
                font-size: 16px;
                border-bottom: 1px solid rgba(41, 121, 255, 0.1);
            }

            .mobile-menu-toggle {
                display: flex;
                order: 2;
                margin-left: auto;
                margin-right: 12px;
            }

            .user-menu {
                gap: 8px;
                order: 3;
            }

            .user-info {
                display: none; /* Hide user email on mobile */
            }

            .btn-logout {
                padding: 6px 10px;
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

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .stat-card {
                padding: 16px;
            }

            .stat-value {
                font-size: 24px;
            }

            .card {
                padding: 16px;
            }

            .card-title {
                font-size: 18px;
            }

            /* Fix Referral System boxes - override inline styles */
            .card [style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
            }

            .card [style*="minmax(300px"] {
                grid-template-columns: 1fr !important;
            }

            .card [style*="minmax(150px"] {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
            }

            /* Referral code/link input boxes */
            .card input[type="text"][readonly] {
                font-size: 14px !important;
                padding: 8px 12px !important;
            }

            .card button[onclick*="copy"] {
                padding: 8px 12px !important;
            }
        }

        /* Small Mobile (480px and below) */
        @media (max-width: 480px) {
            .nav-container {
                padding: 0 12px;
            }

            .logo-container {
                font-size: 16px;
            }

            .logo-container img {
                height: 30px;
            }

            .page-header h1 {
                font-size: 20px;
            }

            .main-content {
                padding: 0 12px;
            }

            .stat-card {
                padding: 12px;
            }

            .card {
                padding: 12px;
            }

            /* Smaller referral inputs on small phones */
            .card input[type="text"][readonly] {
                font-size: 12px !important;
                padding: 6px 10px !important;
            }

            .card button[onclick*="copy"] {
                padding: 6px 10px !important;
            }

            /* Stack stats in single column on very small screens */
            .card [style*="minmax(150px"] {
                grid-template-columns: 1fr !important;
            }
        }

        .card {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .card-title {
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
        }

        .card-action {
            color: #2979FF;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .card-action:hover {
            color: #33F0FF;
        }

        /* Mining Status */
        .mining-status {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .mining-indicator {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: rgba(41, 121, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(41, 121, 255, 0.1);
        }

        .mining-indicator.active {
            background: rgba(34, 197, 94, 0.05);
            border-color: rgba(34, 197, 94, 0.2);
        }

        .mining-indicator.inactive {
            background: rgba(107, 114, 128, 0.05);
            border-color: rgba(107, 114, 128, 0.2);
        }

        .mining-pulse {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #6B7280;
        }

        .mining-pulse.active {
            background: #22C55E;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .mining-info h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .mining-info p {
            font-size: 14px;
            color: #B0B8D4;
        }

        /* Active Machines */
        .machines-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
        }

        .machine-card {
            background: rgba(41, 121, 255, 0.05);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
        }

        .machine-card:hover {
            border-color: rgba(51, 240, 255, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(41, 121, 255, 0.15);
        }

        .machine-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .machine-name {
            font-size: 16px;
            font-weight: 600;
            color: #33F0FF;
            margin-bottom: 4px;
        }

        .machine-status {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .machine-details {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .machine-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
        }

        .machine-detail-label {
            color: #B0B8D4;
        }

        .machine-detail-value {
            font-weight: 600;
            color: #ffffff;
        }

        .machine-detail-value.earnings {
            color: #22C55E;
        }

        .machine-detail-value.expiring-soon {
            color: #FBBF24;
        }

        .machine-detail-value.expired {
            color: #EF4444;
        }

        .machine-footer {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(41, 121, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
        }

        .machine-purchased {
            color: #9CA3AF;
        }

        .machine-expires {
            color: #B0B8D4;
            font-weight: 500;
        }

        /* Recent Activity */
        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .activity-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(41, 121, 255, 0.05);
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .activity-item:hover {
            background: rgba(41, 121, 255, 0.1);
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .activity-icon.mining {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
        }

        .activity-icon.withdrawal {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
        }

        .activity-icon.deposit {
            background: rgba(59, 130, 246, 0.1);
            color: #3B82F6;
        }

        .activity-details {
            flex: 1;
        }

        .activity-title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 2px;
        }

        .activity-time {
            font-size: 12px;
            color: #B0B8D4;
        }

        .activity-amount {
            font-size: 14px;
            font-weight: 600;
        }

        .activity-amount.positive {
            color: #22C55E;
        }

        .activity-amount.negative {
            color: #EF4444;
        }

        /* Quick Actions */
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .action-btn {
            padding: 16px;
            border-radius: 12px;
            border: none;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        .action-btn i {
            font-size: 24px;
        }

        .action-btn.primary {
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            color: #ffffff;
        }

        .action-btn.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(41, 121, 255, 0.4);
        }

        .action-btn.secondary {
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            color: #33F0FF;
        }

        .action-btn.secondary:hover {
            background: rgba(41, 121, 255, 0.2);
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #B0B8D4;
        }

        .empty-state i {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .empty-state p {
            font-size: 14px;
        }

        /* Loading State */
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

        /* KYC Status Badge */
        .kyc-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .kyc-badge.pending {
            background: rgba(251, 191, 36, 0.1);
            color: #FBBF24;
        }

        .kyc-badge.approved {
            background: rgba(34, 197, 94, 0.1);
            color: #22C55E;
        }

        .kyc-badge.rejected {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
        }
        
        /* Package Cards */
        .package-card {
            background: linear-gradient(135deg, rgba(41, 121, 255, 0.1) 0%, rgba(51, 240, 255, 0.1) 100%);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .package-card:hover {
            transform: translateY(-4px);
            border-color: #2979FF;
            box-shadow: 0 8px 24px rgba(41, 121, 255, 0.3);
        }
        
        .package-card h3 {
            margin: 0 0 12px 0;
            color: #33F0FF;
            font-size: 20px;
        }
        
        .package-hash {
            font-size: 32px;
            font-weight: 700;
            color: #fff;
            margin: 12px 0;
        }
        
        .package-price {
            font-size: 28px;
            font-weight: 600;
            color: #22C55E;
            margin: 8px 0;
        }
        
        .package-daily {
            color: #FBBF24;
            font-size: 16px;
            margin: 8px 0;
        }
        
        .package-duration {
            color: #9CA3AF;
            font-size: 14px;
            margin: 8px 0;
        }
        
        .package-card p {
            color: #D1D5DB;
            font-size: 14px;
            margin: 16px 0 0 0;
            line-height: 1.5;
        }
        /* Daily Bonus Modal Styles */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }

        .bonus-modal {
            background: linear-gradient(135deg, #1a1f35 0%, #0f1420 100%);
            border: 2px solid #33f0ff;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(51, 240, 255, 0.3);
            animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .bonus-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #33f0ff, #2979ff);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
            color: white;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .bonus-title {
            color: #33f0ff;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .bonus-description {
            color: #b0b8d4;
            font-size: 16px;
            margin-bottom: 10px;
        }

        .bonus-time-info {
            color: #ffa500;
            font-size: 14px;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .bonus-amount {
            font-size: 48px;
            font-weight: bold;
            color: #4ade80;
            margin: 20px 0;
            text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
        }

        .btn-claim-bonus {
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
            width: 100%;
            box-shadow: 0 5px 15px rgba(74, 222, 128, 0.3);
        }

        .btn-claim-bonus:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(74, 222, 128, 0.4);
        }

        .btn-claim-bonus:disabled {
            background: #4b5563;
            cursor: not-allowed;
            box-shadow: none;
        }

        .btn-close-bonus {
            background: transparent;
            color: #9ca3af;
            border: 1px solid #4b5563;
            padding: 10px 30px;
            font-size: 14px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }

        .btn-close-bonus:hover {
            border-color: #6b7280;
            color: #d1d5db;
        }

        /* PWA Install Banner */
        .pwa-install-banner {
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            color: #fff;
            padding: 16px 24px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(41, 121, 255, 0.4);
            z-index: 9999;
            max-width: 600px;
            width: calc(100% - 32px);
            animation: slideDown 0.5s ease;
        }

        .pwa-banner-content {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .pwa-banner-icon {
            font-size: 32px;
            flex-shrink: 0;
        }

        .pwa-banner-text {
            flex: 1;
        }

        .pwa-banner-text strong {
            display: block;
            font-size: 16px;
            margin-bottom: 4px;
        }

        .pwa-banner-text p {
            font-size: 14px;
            margin: 0;
            opacity: 0.9;
        }

        .pwa-banner-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }

        .pwa-install-btn {
            background: rgba(255, 255, 255, 0.9);
            color: #2979FF;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .pwa-install-btn:hover {
            background: #fff;
            transform: translateY(-2px);
        }

        .pwa-close-btn {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .pwa-close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        @media (max-width: 768px) {
            .pwa-install-banner {
                top: 60px;
            }

            .pwa-banner-content {
                gap: 12px;
            }

            .pwa-banner-icon {
                font-size: 24px;
            }

            .pwa-banner-text strong {
                font-size: 14px;
            }

            .pwa-banner-text p {
                font-size: 12px;
            }

            .pwa-install-btn {
                padding: 8px 16px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- iOS PWA Install Banner (only shows on iOS Safari) -->
    <div id="iosInstallBanner" style="display: none; position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, #2979FF 0%, #1565C0 100%); color: white; padding: 16px; text-align: center; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 250px;">
                <i class="fas fa-mobile-alt" style="font-size: 32px;"></i>
                <div style="text-align: left;">
                    <div style="font-weight: 700; font-size: 16px;">Install DeepMine AI on iPhone</div>
                    <div style="font-size: 13px; opacity: 0.9;">Tap Share → Add to Home Screen</div>
                </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
                <a href="/install-ios" style="background: white; color: #2979FF; padding: 10px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s ease;">
                    <i class="fas fa-info-circle mr-2"></i>View Guide
                </a>
                <button onclick="document.getElementById('iosInstallBanner').style.display='none'" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Daily Login Bonus Modal -->
    <div id="dailyBonusModal" class="modal" style="display: none;">
        <div class="modal-content bonus-modal">
            <div class="bonus-icon">
                <i class="fas fa-gift"></i>
            </div>
            <h2 class="bonus-title">🎁 Daily Login Bonus!</h2>
            <p class="bonus-description">Claim your daily $1 bonus now!</p>
            <p class="bonus-time-info" id="bonusTimeInfo">Available until 5:00 PM UK time</p>
            <div class="bonus-amount">$1.00</div>
            <button id="claimBonusBtn" class="btn-claim-bonus" onclick="claimDailyBonus()">
                <i class="fas fa-hand-holding-usd"></i> Claim Now
            </button>
            <button class="btn-close-bonus" onclick="closeBonusModal()">
                Maybe Later
            </button>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo-container" onclick="window.location.href='/dashboard'">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI">
                <span>DeepMine AI</span>
            </div>
            <div class="nav-links" id="navLinks">
                <a href="/dashboard" class="active">Dashboard</a>
                <a href="/referrals"><i class="fas fa-users"></i> Referrals</a>
                <a href="/machines"><i class="fas fa-server"></i> Machines</a>
                <a href="/faq"><i class="fas fa-question-circle"></i> FAQ</a>
                <a href="/kyc">KYC Verification</a>
            </div>
            <div class="mobile-menu-toggle" id="mobileMenuToggle" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="user-menu">
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <span id="userEmail">Loading...</span>
                </div>
                <button class="btn-logout" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </nav>

    <!-- PWA Install Banner -->
    <div id="pwaInstallBanner" class="pwa-install-banner" style="display: none;">
        <div class="pwa-banner-content">
            <div class="pwa-banner-icon">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="pwa-banner-text">
                <strong>Install DeepMine AI App</strong>
                <p>Get quick access and work offline!</p>
            </div>
            <div class="pwa-banner-actions">
                <button class="pwa-install-btn" id="pwaInstallBtn">
                    <i class="fas fa-download"></i> Install
                </button>
                <button class="pwa-close-btn" id="pwaCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Loading State -->
        <div id="loadingState" class="loading show">
            <div class="spinner"></div>
            <p>Loading dashboard...</p>
        </div>

        <!-- Dashboard Content -->
        <div id="dashboardContent" style="display: none;">
            <!-- Page Header -->
            <div class="page-header">
                <h1>Welcome back, <span id="userName">User</span>!</h1>
                <p>Here's what's happening with your mining account today</p>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-card-title">Account Balance</div>
                        </div>
                        <div class="stat-card-icon blue">
                            <i class="fas fa-wallet"></i>
                        </div>
                    </div>
                    <div class="stat-card-value" id="accountBalance">$0.00</div>
                    <div class="stat-card-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>Available for withdrawal</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-card-title">Daily Earnings</div>
                        </div>
                        <div class="stat-card-icon green">
                            <i class="fas fa-calendar-day"></i>
                        </div>
                    </div>
                    <div class="stat-card-value" id="dailyEarnings">$0.00</div>
                    <div class="stat-card-change positive">
                        <i class="fas fa-clock"></i>
                        <span id="dailyEarningsTime">Today's earnings</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-card-title">Active Miners</div>
                        </div>
                        <div class="stat-card-icon purple">
                            <i class="fas fa-server"></i>
                        </div>
                    </div>
                    <div class="stat-card-value" id="activeMiners">0</div>
                    <div class="stat-card-change">
                        <i class="fas fa-info-circle"></i>
                        <span id="minerStatus">No active miners</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-card-title">Hash Rate</div>
                        </div>
                        <div class="stat-card-icon cyan">
                            <i class="fas fa-tachometer-alt"></i>
                        </div>
                    </div>
                    <div class="stat-card-value" id="hashRate">0 TH/s</div>
                    <div class="stat-card-change">
                        <i class="fas fa-bolt"></i>
                        <span>Current speed</span>
                    </div>
                </div>
            </div>

            <!-- Referral Section -->
            <div class="card mb-6">
                <div class="card-header" style="border-bottom: 2px solid #e5e7eb;">
                    <h2 class="card-title" style="display: flex; align-items: center;">
                        <i class="fas fa-users" style="margin-right: 12px; color: #06b6d4;"></i>
                        Referral System
                    </h2>
                    <span id="vipBadge" class="px-4 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                        VIP 1
                    </span>
                </div>
                
                <div style="padding: 24px;">
                    <!-- Referral Code & Link -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
                        <div style="background: linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; border: 1px solid #a5f3fc;">
                            <label style="display: block; font-size: 14px; font-weight: 500; color: #4b5563; margin-bottom: 8px;">
                                <i class="fas fa-tag" style="margin-right: 8px;"></i>Your Referral Code
                            </label>
                            <div style="display: flex; align-items: center;">
                                <input type="text" id="referralCode" readonly 
                                    style="flex: 1; background: white; border: 1px solid #67e8f9; border-radius: 8px 0 0 8px; padding: 10px 16px; font-family: monospace; font-size: 18px; font-weight: bold; color: #0891b2;"
                                    value="Loading...">
                                <button onclick="copyReferralCode()" 
                                    style="background: #06b6d4; color: white; padding: 10px 16px; border: none; border-radius: 0 8px 8px 0; cursor: pointer; transition: background 0.3s;"
                                    onmouseover="this.style.background='#0891b2'" 
                                    onmouseout="this.style.background='#06b6d4'">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>

                        <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 20px; border-radius: 12px; border: 1px solid #93c5fd;">
                            <label style="display: block; font-size: 14px; font-weight: 500; color: #4b5563; margin-bottom: 8px;">
                                <i class="fas fa-link" style="margin-right: 8px;"></i>Referral Link
                            </label>
                            <div style="display: flex; align-items: center;">
                                <input type="text" id="referralLink" readonly 
                                    style="flex: 1; background: white; border: 1px solid #93c5fd; border-radius: 8px 0 0 8px; padding: 10px 16px; font-size: 14px; color: #2563eb; overflow: hidden; text-overflow: ellipsis;"
                                    value="Loading...">
                                <button onclick="copyReferralLink()" 
                                    style="background: #3b82f6; color: white; padding: 10px 16px; border: none; border-radius: 0 8px 8px 0; cursor: pointer; transition: background 0.3s;"
                                    onmouseover="this.style.background='#2563eb'" 
                                    onmouseout="this.style.background='#3b82f6'">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Cards -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 20px; border-radius: 12px; border: 1px solid #6ee7b7; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #059669;" id="directReferrals">0</div>
                            <div style="font-size: 13px; color: #4b5563; margin-top: 4px;">Direct Referrals</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #fae8ff 0%, #f3e8ff 100%); padding: 20px; border-radius: 12px; border: 1px solid #d8b4fe; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #9333ea;" id="networkSize">0</div>
                            <div style="font-size: 13px; color: #4b5563; margin-top: 4px;">Network Size</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border: 1px solid #fcd34d; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #d97706;" id="totalCommissions">$0.00</div>
                            <div style="font-size: 13px; color: #4b5563; margin-top: 4px;">Total Earned</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); padding: 20px; border-radius: 12px; border: 1px solid #a5b4fc; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #4f46e5;" id="vipProgress">0%</div>
                            <div style="font-size: 13px; color: #4b5563; margin-top: 4px;">Next VIP Progress</div>
                        </div>
                    </div>

                    <!-- Downline Table -->
                    <div style="background: #f9fafb; border-radius: 12px; padding: 20px;">
                        <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px; display: flex; align-items: center;">
                            <i class="fas fa-users-line" style="margin-right: 8px; color: #6b7280;"></i>
                            Your Downline (Direct Referrals)
                        </h3>
                        <div id="downlineTable" style="overflow-x: auto;">
                            <p style="color: #6b7280; text-align: center; padding: 20px 0;">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Machines Section -->
            <div class="card" id="activeMachinesSection" style="display: none;">
                <div class="card-header">
                    <h2 class="card-title">
                        <i class="fas fa-server" style="margin-right: 8px; color: #33F0FF;"></i>
                        Active Mining Machines
                    </h2>
                    <a href="/machines" class="card-action">
                        <i class="fas fa-plus"></i> Add More
                    </a>
                </div>
                <div id="machinesGrid" class="machines-grid">
                    <!-- Machines will be loaded here -->
                </div>
                <div id="emptyMachines" class="empty-state">
                    <i class="fas fa-server"></i>
                    <p>No active machines yet</p>
                    <a href="/machines" class="card-action" style="margin-top: 12px;">Purchase your first machine</a>
                </div>
            </div>

            <!-- Content Grid -->
            <div class="content-grid">
                <!-- Mining Status -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Mining Status</h2>
                        <span class="kyc-badge" id="kycBadge">
                            <i class="fas fa-clock"></i>
                            <span>Pending</span>
                        </span>
                    </div>
                    <div class="mining-status">
                        <div class="mining-indicator" id="miningIndicator">
                            <div class="mining-pulse"></div>
                            <div class="mining-info">
                                <h3 id="miningStatusTitle">No Active Mining</h3>
                                <p id="miningStatusDesc">Complete KYC verification to start mining</p>
                            </div>
                        </div>
                        
                        <div class="quick-actions">
                            <button class="action-btn primary" id="startMiningBtn" onclick="startMining()" disabled>
                                <i class="fas fa-play"></i>
                                <span>Start Mining</span>
                            </button>
                            <button class="action-btn secondary" onclick="window.location.href='/kyc'">
                                <i class="fas fa-id-card"></i>
                                <span>Verify KYC</span>
                            </button>
                            <button class="action-btn primary" onclick="depositFunds()">
                                <i class="fas fa-wallet"></i>
                                <span>Deposit Funds</span>
                            </button>
                            <button class="action-btn secondary" onclick="viewPackages()">
                                <i class="fas fa-shopping-cart"></i>
                                <span>View Packages</span>
                            </button>
                            <button class="action-btn secondary" onclick="requestWithdrawal()">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Withdraw</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Recent Activity</h2>
                        <a href="#" class="card-action">View All</a>
                    </div>
                    <div id="activityList" class="activity-list">
                        <!-- Activity items will be loaded here -->
                    </div>
                    <div id="emptyActivity" class="empty-state">
                        <i class="fas fa-history"></i>
                        <p>No recent activity</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        console.log('✅ Dashboard JavaScript is executing');
        let currentUser = null;

        // Toggle mobile menu
        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navLinks = document.getElementById('navLinks');
            const toggle = document.getElementById('mobileMenuToggle');
            if (navLinks && navLinks.classList.contains('active') && 
                !toggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Check authentication on page load
        async function checkAuth() {
            console.log('🔐 Checking authentication...');
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (!data.success) {
                    window.location.href = '/login?redirect=/dashboard';
                    return;
                }
                
                currentUser = data.user;
                
                // Check KYC status - redirect to KYC page if not approved
                // TEMPORARILY DISABLED for debugging
                // if (!currentUser.kyc_status || currentUser.kyc_status === 'pending' || currentUser.kyc_status === 'rejected') {
                //     console.log('⚠️ KYC not approved, redirecting to KYC page. Status:', currentUser.kyc_status);
                //     alert('Please complete your KYC verification before accessing the dashboard.');
                //     window.location.href = '/kyc';
                //     return;
                // }
                
                console.log('✅ Loading dashboard. KYC Status:', currentUser.kyc_status);
                
                document.getElementById('userEmail').textContent = currentUser.email;
                document.getElementById('userName').textContent = currentUser.full_name || currentUser.email.split('@')[0];
                
                // Load dashboard data
                await loadDashboardData();
                
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = '/login?redirect=/dashboard';
            }
        }

        // Load dashboard data
        async function loadDashboardData() {
            try {
                console.log('🔄 Loading dashboard data...');
                
                // Load KYC status
                const kycResponse = await fetch('/api/kyc/status', {
                    credentials: 'include'
                });
                console.log('📡 KYC Response status:', kycResponse.status);
                
                const kycData = await kycResponse.json();
                console.log('📊 KYC Data:', kycData);
                
                if (kycData.success && kycData.kycStatus) {
                    console.log('✅ Updating KYC status to:', kycData.kycStatus);
                    updateKYCStatus(kycData.kycStatus);
                } else {
                    console.warn('⚠️ No KYC status in response, using default');
                    updateKYCStatus('pending');
                }
                
                // Load mining status and earnings
                const [miningStatusRes, dailyEarningsRes] = await Promise.all([
                    fetch('/api/mining/status', { credentials: 'include' }),
                    fetch('/api/mining/earnings/today', { credentials: 'include' })
                ]);
                
                const miningStatus = await miningStatusRes.json();
                const dailyEarnings = await dailyEarningsRes.json();
                
                console.log('⛏️ Mining Status:', miningStatus);
                console.log('💰 Daily Earnings:', dailyEarnings);
                
                // Get user balance from auth data
                const authRes = await fetch('/api/auth/me', { credentials: 'include' });
                const authData = await authRes.json();
                // Use 'balance' as primary field, fallback to wallet_balance for backwards compatibility
                const userBalance = authData.user?.balance || authData.user?.wallet_balance || 0;
                
                updateDashboardStats({
                    balance: userBalance,
                    dailyEarnings: dailyEarnings.dailyEarnings || 0,
                    activeMiners: miningStatus.status?.activeMiners || 0,
                    hashRate: miningStatus.status?.totalHashRate || 0
                });
                
                // Load active machines
                await loadActiveMachines();
                
                // Load referral data
                await loadReferralData();
                
                console.log('✅ Dashboard data loaded, showing content');
                
                // Show dashboard
                document.getElementById('loadingState').classList.remove('show');
                document.getElementById('dashboardContent').style.display = 'block';
                
            } catch (error) {
                console.error('❌ Failed to load dashboard:', error);
                document.getElementById('loadingState').innerHTML = '<p>Failed to load dashboard. Please refresh the page.</p>';
            }
        }

        // Load active machines
        async function loadActiveMachines() {
            try {
                console.log('🖥️ Loading active machines...');
                
                const response = await fetch('/api/machines/my-active', {
                    credentials: 'include'
                });
                
                const data = await response.json();
                console.log('💻 Active machines data:', data);
                
                if (data.success && data.machines && data.machines.length > 0) {
                    // Show machines section
                    document.getElementById('activeMachinesSection').style.display = 'block';
                    document.getElementById('emptyMachines').style.display = 'none';
                    
                    // Render machines
                    const machinesGrid = document.getElementById('machinesGrid');
                    machinesGrid.innerHTML = data.machines.map(machine => {
                        const expiresDate = new Date(machine.expires_at);
                        const now = new Date();
                        const daysLeft = Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24));
                        
                        let expiryClass = '';
                        let expiryText = '';
                        if (daysLeft < 0) {
                            expiryClass = 'expired';
                            expiryText = 'Expired';
                        } else if (daysLeft <= 7) {
                            expiryClass = 'expiring-soon';
                            expiryText = daysLeft + ' days left';
                        } else {
                            expiryClass = '';
                            expiryText = daysLeft + ' days left';
                        }
                        
                        const activatedDate = new Date(machine.activated_at);
                        const purchaseDate = new Date(machine.created_at);
                        
                        return \`
                            <div class="machine-card">
                                <div class="machine-header">
                                    <div>
                                        <div class="machine-name">\${machine.package_name}</div>
                                    </div>
                                    <span class="machine-status">
                                        <i class="fas fa-check-circle"></i> ACTIVE
                                    </span>
                                </div>
                                <div class="machine-details">
                                    <div class="machine-detail">
                                        <span class="machine-detail-label">Daily Earnings:</span>
                                        <span class="machine-detail-value earnings">$\${machine.daily_rate}/day</span>
                                    </div>
                                    <div class="machine-detail">
                                        <span class="machine-detail-label">Total Earned:</span>
                                        <span class="machine-detail-value">$\${(machine.total_earned || 0).toFixed(2)}</span>
                                    </div>
                                    <div class="machine-detail">
                                        <span class="machine-detail-label">Contract Status:</span>
                                        <span class="machine-detail-value \${expiryClass}">\${expiryText}</span>
                                    </div>
                                    <div class="machine-detail">
                                        <span class="machine-detail-label">Hash Rate:</span>
                                        <span class="machine-detail-value">\${machine.hash_rate} TH/s</span>
                                    </div>
                                </div>
                                <div class="machine-footer">
                                    <span class="machine-purchased">
                                        <i class="fas fa-calendar-alt"></i> 
                                        Purchased: \${purchaseDate.toLocaleDateString()}
                                    </span>
                                    <span class="machine-expires">
                                        <i class="fas fa-clock"></i> 
                                        Expires: \${expiresDate.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    // Show empty state
                    document.getElementById('activeMachinesSection').style.display = 'block';
                    document.getElementById('machinesGrid').innerHTML = '';
                    document.getElementById('emptyMachines').style.display = 'flex';
                }
                
            } catch (error) {
                console.error('❌ Failed to load active machines:', error);
            }
        }

        // Load referral data
        async function loadReferralData() {
            try {
                console.log('🔗 Loading referral data...');
                
                // Get referral code and link
                const codeRes = await fetch('/api/referral/code', { credentials: 'include' });
                const codeData = await codeRes.json();
                
                if (codeData.success) {
                    document.getElementById('referralCode').value = codeData.referralCode;
                    document.getElementById('referralLink').value = codeData.referralLink;
                }
                
                // Get referral stats
                const statsRes = await fetch('/api/referral/stats', { credentials: 'include' });
                const statsData = await statsRes.json();
                
                if (statsData.success) {
                    const { stats, vipInfo, nextVip } = statsData;
                    
                    // Update VIP badge
                    document.getElementById('vipBadge').textContent = 'VIP ' + (stats.vipLevel || 1);
                    
                    // Update stats cards
                    document.getElementById('directReferrals').textContent = stats.directReferrals || 0;
                    document.getElementById('networkSize').textContent = stats.networkSize || 0;
                    document.getElementById('totalCommissions').textContent = '$' + ((stats.totalEarned || 0).toFixed(2));
                    
                    // Calculate VIP progress
                    if (nextVip) {
                        const directProgress = (stats.directReferrals / nextVip.min_direct_referrals) * 100;
                        const networkProgress = (stats.networkSize / nextVip.min_network_size) * 100;
                        const overallProgress = Math.min(directProgress, networkProgress);
                        document.getElementById('vipProgress').textContent = Math.round(overallProgress) + '%';
                    } else {
                        document.getElementById('vipProgress').textContent = 'MAX';
                    }
                }
                
                // Get downline
                const downlineRes = await fetch('/api/referral/downline', { credentials: 'include' });
                const downlineData = await downlineRes.json();
                
                if (downlineData.success) {
                    updateDownlineTable(downlineData.downline);
                }
                
                console.log('✅ Referral data loaded');
            } catch (error) {
                console.error('❌ Failed to load referral data:', error);
            }
        }

        // Update downline table
        function updateDownlineTable(downline) {
            const table = document.getElementById('downlineTable');
            
            if (!downline || downline.length === 0) {
                table.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px 0;">No referrals yet. Share your referral link to start earning!</p>';
                return;
            }
            
            let html = '<table style="width: 100%; border-collapse: collapse;">';
            html += '<thead style="background: #f3f4f6;">';
            html += '<tr>';
            html += '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">User</th>';
            html += '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">VIP Level</th>';
            html += '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Network Size</th>';
            html += '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Active Miners</th>';
            html += '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Joined</th>';
            html += '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Commission Earned</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody style="background: white;">';
            
            downline.forEach((user, index) => {
                const joinedDate = new Date(user.created_at).toLocaleDateString();
                const commissionEarned = user.commission_earned || 0;
                const bgColor = index % 2 === 0 ? 'white' : '#f9fafb';
                
                html += '<tr style="background: ' + bgColor + '; border-bottom: 1px solid #e5e7eb;">';
                html += '<td style="padding: 12px; font-size: 14px;">';
                html += '<div style="font-weight: 500; color: #111827;">' + (user.full_name || 'User') + '</div>';
                html += '<div style="color: #6b7280; font-size: 12px;">' + user.email + '</div>';
                html += '</td>';
                html += '<td style="padding: 12px; font-size: 14px;">';
                html += '<span style="padding: 4px 8px; font-size: 12px; border-radius: 9999px; background: #fef3c7; color: #92400e;">VIP ' + (user.vip_level || 1) + '</span>';
                html += '</td>';
                html += '<td style="padding: 12px; font-size: 14px; color: #4b5563;">' + (user.network_size || 0) + '</td>';
                html += '<td style="padding: 12px; font-size: 14px;">';
                const minerBg = (user.active_miners || 0) > 0 ? '#d1fae5' : '#f3f4f6';
                const minerColor = (user.active_miners || 0) > 0 ? '#065f46' : '#6b7280';
                html += '<span style="padding: 4px 8px; font-size: 12px; border-radius: 9999px; background: ' + minerBg + '; color: ' + minerColor + ';">';
                html += (user.active_miners || 0) + ' miners';
                html += '</span>';
                html += '</td>';
                html += '<td style="padding: 12px; font-size: 14px; color: #4b5563;">' + joinedDate + '</td>';
                html += '<td style="padding: 12px; font-size: 14px; font-weight: 600; color: #059669;">$' + commissionEarned.toFixed(2) + '</td>';
                html += '</tr>';
            });
            
            html += '</tbody>';
            html += '</table>';
            table.innerHTML = html;
        }

        // Copy referral code
        function copyReferralCode() {
            const codeInput = document.getElementById('referralCode');
            codeInput.select();
            codeInput.setSelectionRange(0, 99999); // For mobile
            document.execCommand('copy');
            alert('Referral code copied to clipboard!');
        }

        // Copy referral link
        function copyReferralLink() {
            const linkInput = document.getElementById('referralLink');
            linkInput.select();
            linkInput.setSelectionRange(0, 99999); // For mobile
            document.execCommand('copy');
            alert('Referral link copied to clipboard!');
        }

        // Update KYC status badge
        function updateKYCStatus(status) {
            try {
                console.log('🔄 Updating KYC status UI for:', status);
                
                const badge = document.getElementById('kycBadge');
                const startMiningBtn = document.getElementById('startMiningBtn');
                const miningIndicator = document.getElementById('miningIndicator');
                const miningStatusTitle = document.getElementById('miningStatusTitle');
                const miningStatusDesc = document.getElementById('miningStatusDesc');
                
                if (!badge || !startMiningBtn || !miningIndicator || !miningStatusTitle || !miningStatusDesc) {
                    console.error('❌ Missing DOM elements for KYC status update');
                    return;
                }
                
                badge.className = 'kyc-badge ' + status;
            
            switch(status) {
                case 'approved':
                    badge.innerHTML = '<i class="fas fa-check-circle"></i><span>Verified</span>';
                    startMiningBtn.disabled = false;
                    miningStatusTitle.textContent = 'Ready to Mine';
                    miningStatusDesc.textContent = 'Your account is verified. Start mining to earn rewards!';
                    miningIndicator.classList.remove('inactive');
                    miningIndicator.classList.add('active');
                    break;
                case 'pending':
                case 'submitted':
                case 'reviewing':
                    badge.innerHTML = '<i class="fas fa-clock"></i><span>Pending</span>';
                    startMiningBtn.disabled = true;
                    miningStatusTitle.textContent = 'Verification Pending';
                    miningStatusDesc.textContent = 'Your KYC is under review. You will be able to mine once approved.';
                    miningIndicator.classList.add('inactive');
                    break;
                case 'rejected':
                    badge.innerHTML = '<i class="fas fa-times-circle"></i><span>Rejected</span>';
                    startMiningBtn.disabled = true;
                    miningStatusTitle.textContent = 'Verification Rejected';
                    miningStatusDesc.textContent = 'Please contact support or resubmit your documents.';
                    miningIndicator.classList.add('inactive');
                    break;
                default:
                    badge.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Not Verified</span>';
                    startMiningBtn.disabled = true;
                    miningStatusTitle.textContent = 'Verification Required';
                    miningStatusDesc.textContent = 'Complete KYC verification to start mining.';
                    miningIndicator.classList.add('inactive');
            }
            
            console.log('✅ KYC status UI updated successfully');
            } catch (error) {
                console.error('❌ Error updating KYC status UI:', error);
            }
        }

        // Update dashboard statistics
        function updateDashboardStats(data) {
            document.getElementById('accountBalance').textContent = '$' + (data.balance || 0).toFixed(2);
            document.getElementById('dailyEarnings').textContent = '$' + (data.dailyEarnings || 0).toFixed(2);
            document.getElementById('activeMiners').textContent = data.activeMiners || 0;
            document.getElementById('hashRate').textContent = (data.hashRate || 0) + ' TH/s';
            
            // Update miner status
            const minerStatus = document.getElementById('minerStatus');
            if (data.activeMiners > 0) {
                minerStatus.innerHTML = '<i class="fas fa-check-circle"></i> Mining active';
            } else {
                minerStatus.innerHTML = '<i class="fas fa-info-circle"></i> No active miners';
            }
        }

        // Start mining
        async function startMining() {
            window.location.href = '/machines';
        }

        // View packages
        async function viewPackages() {
            window.location.href = '/machines';
        }


        // Deposit funds
        function depositFunds() {
            window.location.href = '/deposit';
        }

        // Request withdrawal
        function requestWithdrawal() {
            window.location.href = '/withdraw';
        }

        // Logout
        async function logout() {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout failed:', error);
                window.location.href = '/login';
            }
        }

        // Attach logout event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // Daily Bonus Functions
        async function checkDailyBonus() {
            try {
                console.log('🎁 [DAILY BONUS] Checking bonus eligibility...');
                const response = await fetch('/api/daily-bonus/status', {
                    credentials: 'include'
                });
                const data = await response.json();
                console.log('🎁 [DAILY BONUS] API Response:', data);
                
                if (data.success && data.canClaim) {
                    console.log('🎁 [DAILY BONUS] User CAN claim! Showing modal...');
                    // Show the bonus modal
                    const modal = document.getElementById('dailyBonusModal');
                    if (modal) {
                        modal.style.display = 'flex';
                        console.log('🎁 [DAILY BONUS] Modal displayed');
                    } else {
                        console.error('🎁 [DAILY BONUS] Modal element not found!');
                    }
                    
                    const timeInfo = document.getElementById('bonusTimeInfo');
                    if (timeInfo) {
                        timeInfo.textContent = 'Available until ' + data.cutoffHour + ':00 UK time (Current: ' + data.currentUKTime + ')';
                    }
                } else if (data.alreadyClaimed) {
                    console.log('✅ [DAILY BONUS] Already claimed today');
                } else {
                    console.log('⏰ [DAILY BONUS] Cannot claim - ' + data.message);
                }
            } catch (error) {
                console.error('❌ [DAILY BONUS] Error checking bonus:', error);
            }
        }

        async function claimDailyBonus() {
            const claimBtn = document.getElementById('claimBonusBtn');
            claimBtn.disabled = true;
            claimBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Claiming...';
            
            try {
                const response = await fetch('/api/daily-bonus/claim', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                
                if (data.success) {
                    console.log('🎉 [DAILY BONUS] Claim successful! New balance:', data.newBalance);
                    // Success animation
                    const modal = document.querySelector('.bonus-modal');
                    modal.innerHTML = '<div class="bonus-icon" style="background: linear-gradient(135deg, #4ade80, #22c55e);"><i class="fas fa-check"></i></div>' +
                        '<h2 class="bonus-title" style="color: #4ade80;">Success!</h2>' +
                        '<p class="bonus-description">' + data.message + '</p>' +
                        '<div class="bonus-amount">+$' + data.bonusAmount.toFixed(2) + '</div>' +
                        '<p class="bonus-description">New Balance: $' + data.newBalance.toFixed(2) + '</p>' +
                        '<p style="color: #9ca3af; font-size: 14px; margin-top: 10px;">Refreshing in 3 seconds...</p>';
                    
                    // Auto-reload after 3 seconds
                    setTimeout(() => {
                        console.log('🔄 [DAILY BONUS] Auto-reloading page...');
                        location.reload();
                    }, 3000);
                } else {
                    alert(data.message || 'Failed to claim bonus');
                    closeBonusModal();
                }
            } catch (error) {
                console.error('Failed to claim daily bonus:', error);
                alert('Failed to claim bonus. Please try again.');
                claimBtn.disabled = false;
                claimBtn.innerHTML = '<i class="fas fa-hand-holding-usd"></i> Claim Now';
            }
        }

        function closeBonusModal() {
            document.getElementById('dailyBonusModal').style.display = 'none';
        }

        // Initialize on page load
        console.log('🚀 Dashboard script loaded');
        console.log('🎁 Daily bonus check will run after authentication');
        
        // iOS PWA Install Banner Detection
        function detectIOSAndShowBanner() {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
            const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
            
            // Show banner only if: iOS device + Safari browser + NOT already installed
            if (isIOS && isSafari && !isInStandaloneMode) {
                const banner = document.getElementById('iosInstallBanner');
                if (banner) {
                    banner.style.display = 'block';
                    console.log('📱 iOS detected - Showing install banner');
                }
            }
        }
        
        // Run iOS detection after page loads
        setTimeout(detectIOSAndShowBanner, 1000);
        
        // Add immediate test to verify script is running
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                checkAuth();
                // Wait longer to ensure auth is complete
                setTimeout(() => {
                    console.log('🎁 Running daily bonus check now...');
                    checkDailyBonus();
                }, 3000); // Check bonus after 3 seconds
            });
        } else {
            // DOM already loaded
            checkAuth();
            // Wait longer to ensure auth is complete
            setTimeout(() => {
                console.log('🎁 Running daily bonus check now...');
                checkDailyBonus();
            }, 3000); // Check bonus after 3 seconds
        }

        // ============================================
        // AI ASSISTANT FUNCTIONALITY
        // ============================================
        
        let aiUserData = null;
        let aiConversationHistory = [];
        
        // Knowledge Base - Everything about DeepMine AI platform
        const knowledgeBase = {
            platform: {
                name: "DeepMine AI",
                description: "AI-powered cloud mining platform for cryptocurrency",
                features: ["Bitcoin Mining", "Ethereum Mining", "Daily Earnings", "Automatic Payouts", "24/7 Support"]
            },
            deposit: {
                currencies: ["USDT (TRC20)", "ETH (ERC20)", "USDC (ERC20)", "BTC (Bitcoin)"],
                minAmount: 500,
                processingTime: "10-30 minutes (blockchain confirmations)",
                steps: [
                    "Go to Deposit page in sidebar",
                    "Select your cryptocurrency",
                    "Copy the deposit address",
                    "Send funds from your wallet",
                    "Wait for blockchain confirmations",
                    "Balance updates automatically"
                ],
                tips: [
                    "Always double-check the wallet address",
                    "Use the correct network (TRC20 for USDT)",
                    "Keep transaction hash for reference",
                    "Contact support if funds do not arrive in 1 hour"
                ]
            },
            machines: {
                minPrice: 500,
                packages: [
                    {
                        name: "RTX 4090 24G Server",
                        price: 500,
                        dailyReturn: 8,
                        total180Days: 1440,
                        netProfit: 940,
                        roi: "188%",
                        description: "Entry level - Perfect for beginners"
                    },
                    {
                        name: "H800 2400 Server",
                        price: 5000,
                        dailyReturn: 88,
                        total180Days: 15840,
                        netProfit: 10840,
                        roi: "216.8%",
                        description: "Best daily ROI percentage"
                    },
                    {
                        name: "H200 3200 Server",
                        price: 7000,
                        dailyReturn: 108,
                        total180Days: 19440,
                        netProfit: 12440,
                        roi: "177.7%",
                        description: "Mid-tier performance"
                    },
                    {
                        name: "H800 3200G Server",
                        price: 11000,
                        dailyReturn: 168,
                        total180Days: 30240,
                        netProfit: 19240,
                        roi: "174.9%",
                        description: "High performance option"
                    },
                    {
                        name: "H800 6400G Server",
                        price: 30000,
                        dailyReturn: 545,
                        total180Days: 98100,
                        netProfit: 68100,
                        roi: "227%",
                        description: "Premium - High daily income"
                    },
                    {
                        name: "H800 8400G Server",
                        price: 50000,
                        dailyReturn: 909,
                        total180Days: 163620,
                        netProfit: 113620,
                        roi: "227.2%",
                        description: "Ultimate - Highest ROI and daily return"
                    }
                ],
                contractDuration: "180 days (6 months)",
                earnings: "Daily earnings deposited to your balance automatically",
                requirements: ["KYC verification approved", "Sufficient balance"],
                steps: [
                    "Complete KYC verification",
                    "Make a deposit",
                    "Browse available machines",
                    "Select machine package",
                    "Confirm purchase",
                    "Mining starts immediately"
                ]
            },
            withdraw: {
                minAmount: 100,
                fee: "2% of withdrawal amount",
                currencies: ["USDT", "ETH", "USDC", "BTC"],
                processingTime: "24-48 hours",
                requirements: ["KYC verification approved", "Minimum $100 balance"],
                steps: [
                    "Go to Withdraw page",
                    "Enter withdrawal amount",
                    "Enter your wallet address",
                    "Verify wallet address is correct",
                    "Submit withdrawal request",
                    "Wait for admin approval",
                    "Funds sent to your wallet"
                ],
                tips: [
                    "Withdrawals processed within 24-48 hours",
                    "2% fee deducted from withdrawal",
                    "Always verify wallet address",
                    "Contact support for urgent withdrawals"
                ]
            },
            kyc: {
                required: true,
                documents: [
                    "Government-issued ID (Passport, Driver License, or National ID)",
                    "Selfie photo for identity verification",
                    "Proof of address (optional)"
                ],
                processingTime: "Usually approved within 24 hours",
                tips: [
                    "Use clear, high-quality photos",
                    "Ensure all document details are visible",
                    "Selfie should clearly show your face",
                    "Documents must be valid and not expired"
                ],
                cameraHelp: "If camera issues, click the blue ? button at bottom-right"
            },
            earnings: {
                frequency: "Daily",
                payout: "Automatic daily earnings to balance",
                calculation: "Based on machine hash rate and current mining difficulty",
                viewHistory: "Check earnings history in dashboard",
                reinvest: "Use earnings to buy more machines"
            },
            referral: {
                enabled: true,
                commission: "Earn from referrals",
                howTo: [
                    "Get your referral link from dashboard",
                    "Share with friends",
                    "Earn commission when they deposit/mine",
                    "Track referrals in dashboard"
                ]
            },
            support: {
                methods: [
                    "AI Assistant (this chat)",
                    "Support tickets",
                    "Email: support@deepmineai.vip",
                    "Live chat widget"
                ],
                responseTime: "Usually within 24 hours",
                availability: "24/7 support available"
            },
            faq: {
                "How long until I see profits?": "Daily earnings start immediately after machine purchase. First payout within 24 hours.",
                "Can I withdraw anytime?": "Yes, minimum withdrawal is $100 with 2% fee. Processing takes 24-48 hours.",
                "What if my deposit does not arrive?": "Contact support with transaction hash. Usually resolved within 1 hour.",
                "How do I buy a machine?": "Complete KYC, deposit funds, browse machines, and purchase. Mining starts immediately.",
                "What is KYC and why is it required?": "KYC (Know Your Customer) verification ensures platform security and regulatory compliance.",
                "How are earnings calculated?": "Based on machine hash rate, mining difficulty, and current crypto prices.",
                "Can I cancel a withdrawal?": "Contact support immediately if withdrawal is still pending.",
                "What if I forgot my password?": "Use Forgot Password link on login page to reset.",
                "Is my money safe?": "Yes, platform uses secure blockchain technology and cold storage.",
                "How many machines can I buy?": "Unlimited! Buy as many as your balance allows."
            }
        };

        // Toggle AI Assistant
        // Show Install Guide - Smart detection for iOS vs Android
        function showInstallGuide() {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isAndroid = /Android/.test(navigator.userAgent);
            const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;
            
            // If already installed, show success message
            if (isInStandaloneMode) {
                alert('App is already installed! You are using it right now.');
                return;
            }
            
            // iOS users - go to detailed guide
            if (isIOS) {
                window.location.href = '/install-ios';
                return;
            }
            
            // Android/Desktop users - show quick instructions
            if (isAndroid) {
                alert('To install on Android:\\n\\n1. Tap the menu in Chrome\\n2. Tap Add to Home screen or Install app\\n3. Tap Add\\n\\nDone! The app will appear on your home screen.');
            } else {
                // Desktop users
                alert('To install on Desktop:\\n\\n1. Look for the install icon in your browser address bar\\n2. Click it and select Install\\n\\nOr press Ctrl+D (Cmd+D on Mac) to bookmark this page.');
            }
        }

        function toggleAIAssistant() {
            const assistant = document.getElementById('aiAssistant');
            const badge = document.getElementById('aiNotificationBadge');
            
            if (assistant.classList.contains('show')) {
                assistant.classList.remove('show');
            } else {
                assistant.classList.add('show');
                badge.style.display = 'none';
                
                // Load user data if not loaded
                if (!aiUserData) {
                    loadUserDataForAI();
                }
            }
        }

        // Load user data for AI recommendations
        async function loadUserDataForAI() {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    aiUserData = data.user || data;
                    console.log('AI: User data loaded', aiUserData);
                    
                    // Show personalized welcome message after data loads
                    showPersonalizedWelcome();
                }
            } catch (error) {
                console.error('AI: Failed to load user data', error);
            }
        }
        
        // Show personalized welcome based on user status
        function showPersonalizedWelcome() {
            if (!aiUserData) return;
            
            const balance = aiUserData.balance || 0;
            const kycStatus = aiUserData.kyc_status;
            
            let welcomeMsg = '<p>Welcome back! 👋</p>';
            
            if (kycStatus !== 'approved') {
                welcomeMsg += '<p>⚠️ <strong>Action Required:</strong> Complete KYC verification to unlock all features.</p>';
                welcomeMsg += '<p><a href="/kyc" style="color: #33F0FF; text-decoration: underline;">Complete KYC Now →</a></p>';
            } else if (balance < 500) {
                welcomeMsg += '<p>💰 Your account is verified! Balance: <strong>$' + balance.toFixed(2) + '</strong></p>';
                welcomeMsg += '<p>Make a deposit to buy mining machines (minimum $500).</p>';
                welcomeMsg += '<p><a href="/deposit" style="color: #33F0FF; text-decoration: underline;">Make Deposit →</a></p>';
            } else {
                welcomeMsg += '<p>✅ Your account is ready! Balance: <strong>$' + balance.toFixed(2) + '</strong></p>';
                welcomeMsg += '<p>You can buy mining machines and start earning!</p>';
            }
            
            // Update welcome message if chat body exists
            const welcomeBubble = document.querySelector('.ai-welcome .ai-bubble');
            if (welcomeBubble) {
                welcomeBubble.innerHTML = welcomeMsg + '<p><strong>How can I help you today?</strong></p>';
            }
        }

        // Handle quick action buttons
        function handleQuickAction(action) {
            const chatBody = document.getElementById('aiChatBody');
            
            // Add user message
            let userMessage = '';
            if (action === 'deposit') userMessage = 'I want to make a deposit';
            else if (action === 'machine') userMessage = 'I want to buy a mining machine';
            else if (action === 'withdraw') userMessage = 'I want to withdraw funds';
            else userMessage = 'I need help';
            
            addAIMessage(userMessage, true);
            
            // Add AI response based on action
            setTimeout(function() {
                let response = '';
                
                switch(action) {
                    case 'deposit':
                        response = getDepositGuidance();
                        break;
                    case 'machine':
                        response = getMachineGuidance();
                        break;
                    case 'withdraw':
                        response = getWithdrawGuidance();
                        break;
                    case 'help':
                        response = getGeneralHelp();
                        break;
                }
                
                addAIMessage(response, false);
            }, 500);
        }

        // Get deposit guidance
        function getDepositGuidance() {
            const kb = knowledgeBase.deposit;
            let response = '<p>💰 <strong>Making a Deposit</strong></p>';
            
            // Add user-specific info if available
            if (aiUserData) {
                const balance = aiUserData.balance || 0;
                response += '<p>Current Balance: <strong>$' + balance.toFixed(2) + '</strong></p>';
            }
            
            response += '<p><strong>Supported Currencies:</strong></p><ul>';
            kb.currencies.forEach(function(currency) {
                response += '<li>' + currency + '</li>';
            });
            response += '</ul>';
            
            response += '<p><strong>Steps:</strong></p><ol>';
            kb.steps.forEach(function(step) {
                response += '<li>' + step + '</li>';
            });
            response += '</ol>';
            
            response += '<p><strong>Processing Time:</strong> ' + kb.processingTime + '</p>';
            response += '<p><strong>Minimum:</strong> $' + kb.minAmount + '</p>';
            
            response += '<p><strong>💡 Tips:</strong></p><ul>';
            kb.tips.forEach(function(tip) {
                response += '<li>' + tip + '</li>';
            });
            response += '</ul>';
            
            response += '<p><a href="/deposit" style="color: #33F0FF; text-decoration: underline;">Go to Deposit Page →</a></p>';
            return response;
        }

        // Get machine purchase guidance
        function getMachineGuidance() {
            const kb = knowledgeBase.machines;
            let response = '<p>🖥️ <strong>Mining Machines</strong></p>';
            
            // Check user status
            if (aiUserData) {
                const balance = aiUserData.balance || 0;
                const kycStatus = aiUserData.kyc_status;
                
                if (kycStatus !== 'approved') {
                    response += '<p>⚠️ <strong>KYC Required:</strong> Complete KYC verification first.</p>';
                    response += '<p><a href="/kyc" style="color: #33F0FF; text-decoration: underline;">Complete KYC Now →</a></p>';
                    return response;
                }
                
                response += '<p>Current Balance: <strong>$' + balance.toFixed(2) + '</strong></p>';
                
                if (balance < kb.minPrice) {
                    response += '<p>⚠️ You need at least <strong>$' + kb.minPrice + '</strong> to buy a machine.</p>';
                    response += '<p><a href="/deposit" style="color: #33F0FF; text-decoration: underline;">Make a Deposit →</a></p>';
                    return response;
                }
                
                response += '<p>✅ You can buy a mining machine now!</p>';
            }
            
            response += '<p><strong>Available Packages:</strong></p>';
            response += '<table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">';
            response += '<tr style="background: #1E293B; color: #33F0FF;"><th style="padding: 8px; text-align: left;">Package</th><th style="padding: 8px; text-align: right;">Price</th><th style="padding: 8px; text-align: right;">Daily</th><th style="padding: 8px; text-align: right;">180 Days</th><th style="padding: 8px; text-align: right;">ROI</th></tr>';
            kb.packages.forEach(function(pkg) {
                response += '<tr style="border-bottom: 1px solid #2D3748;">';
                response += '<td style="padding: 8px;">' + pkg.name + '</td>';
                response += '<td style="padding: 8px; text-align: right;">$' + pkg.price.toLocaleString() + '</td>';
                response += '<td style="padding: 8px; text-align: right; color: #10B981;">$' + pkg.dailyReturn + '</td>';
                response += '<td style="padding: 8px; text-align: right; font-weight: 600;">$' + pkg.total180Days.toLocaleString() + '</td>';
                response += '<td style="padding: 8px; text-align: right; color: #33F0FF; font-weight: 600;">' + pkg.roi + '</td>';
                response += '</tr>';
            });
            response += '</table>';
            
            response += '<p><strong>Contract Duration:</strong> ' + kb.contractDuration + '</p>';
            response += '<p><strong>Earnings:</strong> ' + kb.earnings + '</p>';
            response += '<p><strong>Example:</strong> RTX 4090 ($500) earns $8/day = $1,440 after 180 days (188% ROI)</p>';
            
            response += '<p><strong>Steps:</strong></p><ol>';
            kb.steps.forEach(function(step) {
                response += '<li>' + step + '</li>';
            });
            response += '</ol>';
            
            response += '<p><a href="/dashboard" style="color: #33F0FF; text-decoration: underline;">View Machines →</a></p>';
            return response;
        }

        // Get withdrawal guidance
        function getWithdrawGuidance() {
            const kb = knowledgeBase.withdraw;
            let response = '<p>💸 <strong>Withdrawing Funds</strong></p>';
            
            // Check user status
            if (aiUserData) {
                const balance = aiUserData.balance || 0;
                const kycStatus = aiUserData.kyc_status;
                
                if (kycStatus !== 'approved') {
                    response += '<p>⚠️ <strong>KYC Required:</strong> Complete KYC verification first.</p>';
                    response += '<p><a href="/kyc" style="color: #33F0FF; text-decoration: underline;">Complete KYC Now →</a></p>';
                    return response;
                }
                
                response += '<p>Current Balance: <strong>$' + balance.toFixed(2) + '</strong></p>';
                
                if (balance < kb.minAmount) {
                    response += '<p>⚠️ Minimum withdrawal is <strong>$' + kb.minAmount + '</strong></p>';
                    return response;
                }
                
                response += '<p>✅ You can withdraw now!</p>';
            }
            
            response += '<p><strong>Supported Currencies:</strong> ' + kb.currencies.join(', ') + '</p>';
            response += '<p><strong>Minimum:</strong> $' + kb.minAmount + ' | <strong>Fee:</strong> ' + kb.fee + '</p>';
            response += '<p><strong>Processing Time:</strong> ' + kb.processingTime + '</p>';
            
            response += '<p><strong>Steps:</strong></p><ol>';
            kb.steps.forEach(function(step) {
                response += '<li>' + step + '</li>';
            });
            response += '</ol>';
            
            response += '<p><strong>💡 Tips:</strong></p><ul>';
            kb.tips.forEach(function(tip) {
                response += '<li>' + tip + '</li>';
            });
            response += '</ul>';
            
            response += '<p><a href="/withdraw" style="color: #33F0FF; text-decoration: underline;">Go to Withdraw Page →</a></p>';
            return response;
        }

        // Get general help
        function getGeneralHelp() {
            let response = '<p>👋 <strong>How can I help you?</strong></p>';
            response += '<p>I can assist with:</p><ul>';
            response += '<li>💰 <strong>Deposits:</strong> Fund your account</li>';
            response += '<li>🖥️ <strong>Mining Machines:</strong> Buy and manage machines</li>';
            response += '<li>💸 <strong>Withdrawals:</strong> Cash out your earnings</li>';
            response += '<li>✅ <strong>KYC:</strong> Complete verification</li>';
            response += '<li>📊 <strong>Earnings:</strong> Track your profits</li>';
            response += '<li>👥 <strong>Referrals:</strong> Earn from friends</li>';
            response += '</ul>';
            response += '<p><strong>Quick Tips:</strong></p><ul>';
            response += '<li>Daily earnings are automatically added to your balance</li>';
            response += '<li>Minimum deposit: $500</li>';
            response += '<li>Minimum withdrawal: $100 (2% fee)</li>';
            response += '<li>Machine contracts: 180 days</li>';
            response += '</ul>';
            response += '<p>Need human support? <a href="#" onclick="createSupportTicket(); return false;" style="color: #33F0FF; text-decoration: underline;">Create a support ticket</a></p>';
            return response;
        }
        
        // Get KYC guidance
        function getKYCGuidance() {
            const kb = knowledgeBase.kyc;
            let response = '<p>✅ <strong>KYC Verification</strong></p>';
            response += '<p>KYC is required to unlock all platform features.</p>';
            
            if (aiUserData && aiUserData.kyc_status) {
                const status = aiUserData.kyc_status;
                if (status === 'approved') {
                    response += '<p>✅ Your KYC is <strong>approved</strong>!</p>';
                    return response;
                } else if (status === 'pending') {
                    response += '<p>⏳ Your KYC is <strong>under review</strong>.</p>';
                    response += '<p>Processing Time: ' + kb.processingTime + '</p>';
                    return response;
                } else if (status === 'rejected') {
                    response += '<p>❌ Your KYC was rejected. Please resubmit with correct documents.</p>';
                }
            }
            
            response += '<p><strong>Required Documents:</strong></p><ul>';
            kb.documents.forEach(function(doc) {
                response += '<li>' + doc + '</li>';
            });
            response += '</ul>';
            
            response += '<p><strong>💡 Tips:</strong></p><ul>';
            kb.tips.forEach(function(tip) {
                response += '<li>' + tip + '</li>';
            });
            response += '</ul>';
            
            response += '<p><strong>Processing Time:</strong> ' + kb.processingTime + '</p>';
            response += '<p>💡 ' + kb.cameraHelp + '</p>';
            response += '<p><a href="/kyc" style="color: #33F0FF; text-decoration: underline;">Start KYC Verification →</a></p>';
            return response;
        }
        
        // Get earnings info
        function getEarningsInfo() {
            const kb = knowledgeBase.earnings;
            let response = '<p>📊 <strong>Earnings Information</strong></p>';
            
            if (aiUserData) {
                const balance = aiUserData.balance || 0;
                response += '<p>Current Balance: <strong>$' + balance.toFixed(2) + '</strong></p>';
            }
            
            response += '<p><strong>How Earnings Work:</strong></p><ul>';
            response += '<li><strong>Frequency:</strong> ' + kb.frequency + '</li>';
            response += '<li><strong>Payout:</strong> ' + kb.payout + '</li>';
            response += '<li><strong>Calculation:</strong> ' + kb.calculation + '</li>';
            response += '<li><strong>View History:</strong> ' + kb.viewHistory + '</li>';
            response += '<li><strong>Reinvest:</strong> ' + kb.reinvest + '</li>';
            response += '</ul>';
            
            response += '<p>💡 Earnings are automatically added to your balance daily!</p>';
            return response;
        }
        
        // Get referral info
        function getReferralInfo() {
            const kb = knowledgeBase.referral;
            let response = '<p>👥 <strong>Referral Program</strong></p>';
            response += '<p>' + kb.commission + '</p>';
            
            response += '<p><strong>How to Earn:</strong></p><ol>';
            kb.howTo.forEach(function(step) {
                response += '<li>' + step + '</li>';
            });
            response += '</ol>';
            
            response += '<p>💡 Share your referral link and earn passive income!</p>';
            return response;
        }
        
        // Search FAQ
        function searchFAQ(query) {
            const kb = knowledgeBase.faq;
            const lowerQuery = query.toLowerCase();
            
            // Find matching FAQ
            for (const question in kb) {
                const lowerQuestion = question.toLowerCase();
                if (lowerQuestion.includes(lowerQuery) || lowerQuery.includes(lowerQuestion.split(' ').slice(0, 3).join(' '))) {
                    return '<p><strong>Q: ' + question + '</strong></p><p>A: ' + kb[question] + '</p>';
                }
            }
            
            return null;
        }

        // Add AI message to chat
        function addAIMessage(message, isUser) {
            if (isUser === undefined) isUser = false;
            
            const chatBody = document.getElementById('aiChatBody');
            
            const messageDiv = document.createElement('div');
            messageDiv.className = isUser ? 'ai-message user-message' : 'ai-message';
            
            messageDiv.innerHTML = 
                '<div class="ai-avatar">' +
                    '<i class="fas fa-' + (isUser ? 'user' : 'robot') + '"></i>' +
                '</div>' +
                '<div class="ai-bubble">' +
                    message +
                '</div>';
            
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        // Handle input keypress
        function handleAIInputKeyPress(event) {
            if (event.key === 'Enter') {
                sendAIMessage();
            }
        }

        // Send AI message
        function sendAIMessage() {
            const input = document.getElementById('aiInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            addAIMessage(message, true);
            input.value = '';
            
            // Enhanced keyword-based responses with FAQ search
            setTimeout(function() {
                let response = '';
                const lowerMessage = message.toLowerCase();
                
                // Check for specific topics
                if (lowerMessage.includes('deposit') || lowerMessage.includes('fund') || lowerMessage.includes('add money')) {
                    response = getDepositGuidance();
                } 
                else if (lowerMessage.includes('machine') || lowerMessage.includes('mining') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
                    response = getMachineGuidance();
                } 
                else if (lowerMessage.includes('withdraw') || lowerMessage.includes('cash out') || lowerMessage.includes('payout')) {
                    response = getWithdrawGuidance();
                } 
                else if (lowerMessage.includes('kyc') || lowerMessage.includes('verify') || lowerMessage.includes('verification') || lowerMessage.includes('document')) {
                    response = getKYCGuidance();
                } 
                else if (lowerMessage.includes('earning') || lowerMessage.includes('profit') || lowerMessage.includes('income') || lowerMessage.includes('balance')) {
                    response = getEarningsInfo();
                } 
                else if (lowerMessage.includes('referral') || lowerMessage.includes('refer') || lowerMessage.includes('friend') || lowerMessage.includes('invite')) {
                    response = getReferralInfo();
                } 
                else if (lowerMessage.includes('support') || lowerMessage.includes('ticket') || lowerMessage.includes('contact')) {
                    response = '<p>📞 <strong>Contact Support</strong></p>';
                    response += '<p>Our support team is available 24/7!</p>';
                    response += '<p><strong>Methods:</strong></p><ul>';
                    response += '<li>Create a support ticket (fastest)</li>';
                    response += '<li>Email: support@deepmineai.vip</li>';
                    response += '<li>Live chat widget</li>';
                    response += '</ul>';
                    response += '<p><a href="#" onclick="createSupportTicket(); return false;" style="color: #33F0FF; text-decoration: underline;">Create Support Ticket →</a></p>';
                }
                else if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('when') || lowerMessage.includes('?')) {
                    // Try FAQ search
                    const faqResult = searchFAQ(lowerMessage);
                    if (faqResult) {
                        response = faqResult;
                    } else {
                        response = getGeneralHelp();
                    }
                }
                else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                    response = '<p>👋 Hello! How can I assist you today?</p>';
                    response += '<p>Ask me about:</p><ul>';
                    response += '<li>Making deposits 💰</li>';
                    response += '<li>Buying machines 🖥️</li>';
                    response += '<li>Withdrawing funds 💸</li>';
                    response += '<li>KYC verification ✅</li>';
                    response += '<li>Earnings & referrals 📊</li>';
                    response += '</ul>';
                }
                else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
                    response = '<p>You are welcome! 😊 Let me know if you need anything else!</p>';
                }
                else {
                    // Default response
                    response = getGeneralHelp();
                }
                
                addAIMessage(response, false);
            }, 500);
        }

        // Create support ticket - Open modal
        window.createSupportTicket = function() {
            console.log('createSupportTicket() - Opening modal');
            
            // Show modal
            document.getElementById('ticketModal').style.display = 'flex';
            
            // Check if user email exists
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                document.getElementById('emailGroup').style.display = 'block';
            } else {
                document.getElementById('emailGroup').style.display = 'none';
            }
            
            // Clear previous values
            document.getElementById('ticketSubject').value = '';
            document.getElementById('ticketDescription').value = '';
            document.getElementById('ticketEmail').value = '';
            document.getElementById('charCount').textContent = '0';
            document.getElementById('ticketError').style.display = 'none';
            document.getElementById('ticketSuccess').style.display = 'none';
            
            // Focus on subject field
            setTimeout(function() {
                document.getElementById('ticketSubject').focus();
            }, 100);
        }

        // Close ticket modal
        window.closeTicketModal = function() {
            document.getElementById('ticketModal').style.display = 'none';
        }

        // Update character count
        document.addEventListener('DOMContentLoaded', function() {
            const descriptionField = document.getElementById('ticketDescription');
            if (descriptionField) {
                descriptionField.addEventListener('input', function() {
                    document.getElementById('charCount').textContent = this.value.length;
                });
            }
        });

        // Submit ticket from modal
        window.submitTicket = function() {
            console.log('submitTicket() called');
            
            const subject = document.getElementById('ticketSubject').value.trim();
            const description = document.getElementById('ticketDescription').value.trim();
            let userEmail = localStorage.getItem('userEmail');
            
            // If no email in localStorage, get from form
            if (!userEmail) {
                userEmail = document.getElementById('ticketEmail').value.trim();
            }
            
            // Validation
            const errorDiv = document.getElementById('ticketError');
            if (!subject) {
                errorDiv.textContent = '❌ Please enter a subject';
                errorDiv.style.display = 'block';
                document.getElementById('ticketSubject').focus();
                return;
            }
            
            if (subject.length < 5) {
                errorDiv.textContent = '❌ Subject must be at least 5 characters';
                errorDiv.style.display = 'block';
                document.getElementById('ticketSubject').focus();
                return;
            }
            
            if (!description) {
                errorDiv.textContent = '❌ Please describe your issue';
                errorDiv.style.display = 'block';
                document.getElementById('ticketDescription').focus();
                return;
            }
            
            if (description.length < 10) {
                errorDiv.textContent = '❌ Description must be at least 10 characters';
                errorDiv.style.display = 'block';
                document.getElementById('ticketDescription').focus();
                return;
            }
            
            if (!userEmail) {
                errorDiv.textContent = '❌ Please enter your email';
                errorDiv.style.display = 'block';
                document.getElementById('ticketEmail').focus();
                return;
            }
            
            if (!userEmail.includes('@') || !userEmail.includes('.')) {
                errorDiv.textContent = '❌ Please enter a valid email address';
                errorDiv.style.display = 'block';
                document.getElementById('ticketEmail').focus();
                return;
            }
            
            // Hide error
            errorDiv.style.display = 'none';
            
            // Disable submit button
            const submitBtn = document.querySelector('.btn-ticket-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
            
            console.log('Sending ticket:', { subject, description, userEmail });
            
            fetch('/api/tickets/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    subject: subject,
                    description: description,
                    customer_email: userEmail,
                    customer_name: localStorage.getItem('userName') || 'User',
                    priority: 'medium',
                    category: 'general',
                    user_id: localStorage.getItem('userId') || null
                })
            })
            .then(function(response) { 
                console.log('Response status:', response.status);
                return response.json(); 
            })
            .then(function(data) {
                console.log('Ticket creation response:', data);
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Create Ticket';
                
                if (data.success) {
                    // Show success message
                    const successDiv = document.getElementById('ticketSuccess');
                    successDiv.innerHTML = '✅ <strong>Ticket created!</strong> Ticket #' + data.data.ticket_number;
                    successDiv.style.display = 'block';
                    
                    // Also show in AI chat
                    addAIMessage('<p>✅ <strong>Support ticket created!</strong></p><p>Ticket #' + data.data.ticket_number + '</p><p>Our team will respond to ' + userEmail + ' soon.</p>', false);
                    
                    // Close modal after 2 seconds
                    setTimeout(function() {
                        closeTicketModal();
                    }, 2000);
                } else {
                    errorDiv.textContent = '❌ ' + (data.error || 'Failed to create ticket');
                    errorDiv.style.display = 'block';
                }
            })
            .catch(function(error) {
                console.error('Failed to create ticket:', error);
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Create Ticket';
                
                errorDiv.textContent = '❌ Failed to create ticket. Please try again or email support@deepmineai.vip';
                errorDiv.style.display = 'block';
            });
        }

        // Show notification badge after 5 seconds
        setTimeout(function() {
            const badge = document.getElementById('aiNotificationBadge');
            if (badge && !document.getElementById('aiAssistant').classList.contains('show')) {
                badge.style.display = 'flex';
            }
        }, 5000);
        
        // END AI ASSISTANT FUNCTIONALITY

        // ============================================
        // PWA INSTALLATION
        // ============================================
        
        let deferredPrompt;
        const pwaInstallBanner = document.getElementById('pwaInstallBanner');
        const pwaInstallBtn = document.getElementById('pwaInstallBtn');
        const pwaCloseBtn = document.getElementById('pwaCloseBtn');

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('PWA: App is already installed');
            if (pwaInstallBanner) pwaInstallBanner.style.display = 'none';
        }

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', function(e) {
            console.log('PWA: beforeinstallprompt event fired');
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install banner after 5 seconds
            setTimeout(function() {
                if (pwaInstallBanner) {
                    pwaInstallBanner.style.display = 'block';
                }
            }, 5000);
        });

        // Fallback: Show manual install banner on mobile if beforeinstallprompt doesn't fire
        setTimeout(function() {
            const isAlreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isAndroid = /Android/.test(navigator.userAgent);
            const isMobile = isIOS || isAndroid;
            const dismissedTime = localStorage.getItem('pwa-install-dismissed');
            const daysSinceDismissed = dismissedTime ? (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24) : 999;
            
            // If no deferredPrompt after 10 seconds AND on mobile AND not installed AND not recently dismissed
            if (!deferredPrompt && isMobile && !isAlreadyInstalled && daysSinceDismissed >= 7) {
                console.log('PWA: Showing manual install banner for mobile (beforeinstallprompt not available)');
                if (pwaInstallBanner) {
                    pwaInstallBanner.style.display = 'block';
                }
            }
        }, 10000); // Wait 10 seconds to see if beforeinstallprompt fires

        // Handle install button click
        if (pwaInstallBtn) {
            pwaInstallBtn.addEventListener('click', async function() {
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                const isAndroid = /Android/.test(navigator.userAgent);
                
                if (!deferredPrompt) {
                    console.log('PWA: No deferredPrompt available');
                    
                    // For iOS, redirect to detailed guide
                    if (isIOS) {
                        window.location.href = '/install-ios';
                        return;
                    }
                    
                    // For Android, try to guide user to browser's native install
                    if (isAndroid) {
                        // Check if already installed
                        if (window.matchMedia('(display-mode: standalone)').matches) {
                            alert('App is already installed! You are using it right now.');
                            return;
                        }
                        
                        // Show better instructions
                        alert('To install DeepMine AI: Tap the menu (3 dots) > Add to Home screen > Add. Done!');
                        return;
                    }
                    
                    // Desktop fallback
                    alert('To install:\\n\\n- Look for the install icon in your browser address bar\\n- Or press Ctrl+D (Cmd+D on Mac) to bookmark');
                    return;
                }

                // Native install prompt available - use it
                try {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log('PWA: User choice:', outcome);

                    if (outcome === 'accepted') {
                        console.log('PWA: User accepted the install prompt');
                    }

                    // Hide banner
                    if (pwaInstallBanner) {
                        pwaInstallBanner.style.display = 'none';
                    }

                    deferredPrompt = null;
                } catch (error) {
                    console.error('PWA: Install prompt error:', error);
                }
            });
        }

        // Handle close button click
        if (pwaCloseBtn) {
            pwaCloseBtn.addEventListener('click', function() {
                if (pwaInstallBanner) {
                    pwaInstallBanner.style.display = 'none';
                }
                // Don't show again for 7 days
                localStorage.setItem('pwa-install-dismissed', Date.now().toString());
            });
        }

        // Check if user dismissed banner recently
        const dismissedTime = localStorage.getItem('pwa-install-dismissed');
        if (dismissedTime) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) {
                if (pwaInstallBanner) pwaInstallBanner.style.display = 'none';
            }
        }

        // Listen for app installed event
        window.addEventListener('appinstalled', function() {
            console.log('PWA: App was installed successfully');
            if (pwaInstallBanner) {
                pwaInstallBanner.style.display = 'none';
            }
            
            // Show success message
            alert('DeepMine AI has been installed! You can now access it from your home screen.');
        });

        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('PWA: Service Worker registered successfully:', registration.scope);
                        
                        // Check for updates every hour
                        setInterval(function() {
                            registration.update();
                        }, 60 * 60 * 1000);
                    })
                    .catch(function(error) {
                        console.error('PWA: Service Worker registration failed:', error);
                    });

                // Listen for service worker updates
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                    console.log('PWA: New service worker activated, reloading...');
                    window.location.reload();
                });
            });
        }
        
        // END PWA INSTALLATION
    </script>

    <!-- AI Dashboard Assistant Widget -->
    <div id="aiAssistant" class="ai-assistant">
        <div class="ai-assistant-header">
            <div class="ai-assistant-title">
                <i class="fas fa-robot"></i>
                <span>AI Assistant</span>
            </div>
            <button class="ai-assistant-close" onclick="toggleAIAssistant()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="ai-assistant-body" id="aiChatBody">
            <div class="ai-message ai-welcome">
                <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-bubble">
                    <p>👋 Hi! I'm your DeepMine AI Assistant. I can help you with:</p>
                    <ul>
                        <li>Making deposits</li>
                        <li>Buying mining machines</li>
                        <li>Withdrawing funds</li>
                        <li>Answering questions</li>
                    </ul>
                    <p><strong>How can I assist you today?</strong></p>
                </div>
            </div>
        </div>

        <div class="ai-quick-actions">
            <button class="ai-action-btn" onclick="handleQuickAction('deposit')">
                <i class="fas fa-wallet"></i> Make Deposit
            </button>
            <button class="ai-action-btn" onclick="handleQuickAction('machine')">
                <i class="fas fa-server"></i> Buy Machine
            </button>
            <button class="ai-action-btn" onclick="handleQuickAction('withdraw')">
                <i class="fas fa-money-bill-wave"></i> Withdraw
            </button>
            <button class="ai-action-btn" onclick="handleQuickAction('help')">
                <i class="fas fa-question-circle"></i> Get Help
            </button>
        </div>

        <div class="ai-assistant-input">
            <input type="text" id="aiInput" placeholder="Type your question..." onkeypress="handleAIInputKeyPress(event)">
            <button onclick="sendAIMessage()">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>

    <!-- Install App Button (Always Visible) -->
    <button class="pwa-install-button" id="pwaInstallBtn" onclick="showInstallGuide()">
        <i class="fas fa-mobile-alt"></i>
        <span class="pwa-install-text">Install App</span>
    </button>

    <!-- AI Assistant Toggle Button -->
    <button class="ai-assistant-toggle" id="aiToggle" onclick="toggleAIAssistant()">
        <i class="fas fa-robot"></i>
        <span class="ai-toggle-badge" id="aiNotificationBadge" style="display: none;">1</span>
    </button>

    <!-- Support Ticket Modal -->
    <div id="ticketModal" class="ticket-modal" style="display: none;">
        <div class="ticket-modal-content">
            <div class="ticket-modal-header">
                <h3><i class="fas fa-ticket-alt"></i> Create Support Ticket</h3>
                <button class="ticket-modal-close" onclick="closeTicketModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="ticket-modal-body">
                <div class="ticket-form-group">
                    <label for="ticketSubject">What do you need help with? *</label>
                    <input type="text" id="ticketSubject" placeholder="e.g., Withdrawal issue, Account question..." maxlength="200">
                </div>
                <div class="ticket-form-group">
                    <label for="ticketDescription">Please describe your issue in detail: *</label>
                    <textarea id="ticketDescription" rows="5" placeholder="Provide as much detail as possible to help us assist you better..." maxlength="2000"></textarea>
                    <div class="char-count"><span id="charCount">0</span>/2000</div>
                </div>
                <div class="ticket-form-group" id="emailGroup" style="display: none;">
                    <label for="ticketEmail">Your Email: *</label>
                    <input type="email" id="ticketEmail" placeholder="your@email.com">
                </div>
                <div class="ticket-form-error" id="ticketError" style="display: none;"></div>
                <div class="ticket-form-success" id="ticketSuccess" style="display: none;"></div>
            </div>
            <div class="ticket-modal-footer">
                <button class="btn-ticket-cancel" onclick="closeTicketModal()">Cancel</button>
                <button class="btn-ticket-submit" onclick="submitTicket()">
                    <i class="fas fa-paper-plane"></i> Create Ticket
                </button>
            </div>
        </div>
    </div>

    <style>
        /* AI Assistant Styles */
        .ai-assistant {
            position: fixed;
            bottom: 90px;
            right: 24px;
            width: 380px;
            max-height: 600px;
            background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            z-index: 1000;
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }

        .ai-assistant.show {
            display: flex;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .ai-assistant-header {
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #fff;
        }

        .ai-assistant-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: 600;
        }

        .ai-assistant-title i {
            font-size: 20px;
        }

        .ai-assistant-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .ai-assistant-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .ai-assistant-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-height: 350px;
        }

        .ai-message {
            display: flex;
            gap: 12px;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .ai-avatar {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 18px;
            flex-shrink: 0;
        }

        .ai-bubble {
            background: #334155;
            border-radius: 16px;
            padding: 12px 16px;
            color: #E2E8F0;
            flex: 1;
            line-height: 1.5;
        }

        .ai-bubble p {
            margin: 0 0 8px 0;
        }

        .ai-bubble p:last-child {
            margin-bottom: 0;
        }

        .ai-bubble ul {
            margin: 8px 0;
            padding-left: 20px;
        }

        .ai-bubble li {
            margin: 4px 0;
        }

        .ai-bubble strong {
            color: #33F0FF;
        }

        .user-message {
            flex-direction: row-reverse;
        }

        .user-message .ai-bubble {
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            color: #fff;
        }

        .ai-quick-actions {
            padding: 12px 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-action-btn {
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            color: #33F0FF;
            padding: 10px 12px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
        }

        .ai-action-btn:hover {
            background: rgba(41, 121, 255, 0.2);
            border-color: rgba(41, 121, 255, 0.5);
            transform: translateY(-2px);
        }

        .ai-action-btn i {
            font-size: 14px;
        }

        .ai-assistant-input {
            padding: 16px 20px;
            display: flex;
            gap: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-assistant-input input {
            flex: 1;
            background: #334155;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 10px 16px;
            color: #E2E8F0;
            font-size: 14px;
        }

        .ai-assistant-input input:focus {
            outline: none;
            border-color: #2979FF;
        }

        .ai-assistant-input button {
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .ai-assistant-input button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(41, 121, 255, 0.4);
        }

        /* Toggle Button */
        /* PWA Install Button - Always Visible */
        .pwa-install-button {
            position: fixed;
            bottom: 24px;
            right: 92px;
            background: linear-gradient(135deg, #10B981, #059669);
            border: none;
            border-radius: 28px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
            transition: all 0.3s ease;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 20px;
            animation: installPulse 3s ease-in-out infinite;
        }

        .pwa-install-button:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 32px rgba(16, 185, 129, 0.6);
        }

        .pwa-install-button i {
            font-size: 20px;
        }

        @keyframes installPulse {
            0%, 100% {
                box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
            }
            50% {
                box-shadow: 0 12px 32px rgba(16, 185, 129, 0.7);
            }
        }

        .ai-assistant-toggle {
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
            animation: togglePulse 2s ease-in-out infinite;
        }

        .ai-assistant-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 32px rgba(41, 121, 255, 0.6);
        }

        @keyframes togglePulse {
            0%, 100% {
                box-shadow: 0 8px 24px rgba(41, 121, 255, 0.4);
            }
            50% {
                box-shadow: 0 12px 36px rgba(41, 121, 255, 0.7);
            }
        }

        .ai-toggle-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #EF4444;
            color: #fff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 11px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #1E293B;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .ai-assistant {
                width: calc(100% - 32px);
                max-width: 380px;
                right: 16px;
                bottom: 80px;
            }

            .pwa-install-button {
                right: 80px;
                bottom: 20px;
                padding: 10px 16px;
                font-size: 14px;
            }

            .pwa-install-button i {
                font-size: 18px;
            }

            .pwa-install-text {
                display: none;
            }

            .ai-assistant-toggle {
                width: 50px;
                height: 50px;
                font-size: 20px;
                bottom: 20px;
                right: 20px;
            }

            .ai-quick-actions {
                grid-template-columns: 1fr;
            }
        }

        /* Support Ticket Modal Styles */
        .ticket-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        }

        .ticket-modal-content {
            background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow: hidden;
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .ticket-modal-header {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .ticket-modal-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ticket-modal-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .ticket-modal-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .ticket-modal-body {
            padding: 24px;
            max-height: calc(90vh - 200px);
            overflow-y: auto;
        }

        .ticket-form-group {
            margin-bottom: 20px;
        }

        .ticket-form-group label {
            display: block;
            color: #E2E8F0;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .ticket-form-group input,
        .ticket-form-group textarea {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        .ticket-form-group input:focus,
        .ticket-form-group textarea:focus {
            outline: none;
            border-color: #3B82F6;
            background: rgba(255, 255, 255, 0.15);
        }

        .ticket-form-group textarea {
            resize: vertical;
            min-height: 120px;
        }

        .char-count {
            text-align: right;
            color: #94A3B8;
            font-size: 12px;
            margin-top: 4px;
        }

        .ticket-form-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #FCA5A5;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
        }

        .ticket-form-success {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #86EFAC;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
        }

        .ticket-modal-footer {
            padding: 20px 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .btn-ticket-cancel,
        .btn-ticket-submit {
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-ticket-cancel {
            background: rgba(255, 255, 255, 0.1);
            color: #E2E8F0;
        }

        .btn-ticket-cancel:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .btn-ticket-submit {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white;
        }

        .btn-ticket-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-ticket-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        @media (max-width: 768px) {
            .ticket-modal-content {
                width: 95%;
                max-height: 95vh;
            }

            .ticket-modal-body {
                max-height: calc(95vh - 200px);
            }
        }
    </style>
</body>
</html>
`
