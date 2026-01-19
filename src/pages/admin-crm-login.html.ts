/**
 * DeepMine AI - CRM Staff Login
 * Separate login page for CRM staff (no financial access)
 */

export const adminCRMLoginHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM Staff Login - DeepMine AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .login-container {
            background: rgba(11, 15, 30, 0.8);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 24px;
            padding: 48px;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .logo-container {
            text-align: center;
            margin-bottom: 32px;
        }
        .logo-container img {
            height: 60px;
            margin-bottom: 16px;
            filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.5));
        }
        .logo-container h1 {
            font-size: 28px;
            background: linear-gradient(135deg, #33F0FF, #2979FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
        }
        .logo-container p {
            color: #B0B8D4;
            font-size: 14px;
        }
        .badge-crm {
            display: inline-block;
            background: rgba(41, 121, 255, 0.2);
            border: 1px solid rgba(41, 121, 255, 0.5);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: #33F0FF;
            margin-top: 8px;
        }
        .form-group {
            margin-bottom: 24px;
        }
        .form-group label {
            display: block;
            color: #E0E7FF;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
        }
        .form-group input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(26, 31, 53, 0.8);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            color: #ffffff;
            font-size: 15px;
            transition: all 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #33F0FF;
            box-shadow: 0 0 0 3px rgba(51, 240, 255, 0.1);
        }
        .btn-login {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #2979FF, #33F0FF);
            border: none;
            border-radius: 12px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(41, 121, 255, 0.4);
        }
        .btn-login:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #FCA5A5;
            padding: 12px 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        .success-message {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #6EE7B7;
            padding: 12px 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        .divider {
            text-align: center;
            margin: 24px 0;
            position: relative;
        }
        .divider::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            width: 100%;
            height: 1px;
            background: rgba(41, 121, 255, 0.2);
        }
        .divider span {
            background: rgba(11, 15, 30, 0.8);
            padding: 0 16px;
            position: relative;
            color: #B0B8D4;
            font-size: 13px;
        }
        .admin-link {
            text-align: center;
            margin-top: 20px;
        }
        .admin-link a {
            color: #6B7280;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.3s;
        }
        .admin-link a:hover {
            color: #33F0FF;
        }
        .info-box {
            background: rgba(41, 121, 255, 0.05);
            border: 1px solid rgba(41, 121, 255, 0.2);
            border-radius: 12px;
            padding: 16px;
            margin-top: 24px;
        }
        .info-box h3 {
            font-size: 14px;
            color: #33F0FF;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-box ul {
            list-style: none;
            font-size: 13px;
            color: #B0B8D4;
        }
        .info-box ul li {
            padding: 4px 0;
            padding-left: 20px;
            position: relative;
        }
        .info-box ul li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10B981;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo-container">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI">
            <h1>CRM Staff Portal</h1>
            <p>Customer Relationship Management</p>
            <span class="badge-crm"><i class="fas fa-shield-alt"></i> Staff Access</span>
        </div>

        <div id="errorMessage" class="error-message"></div>
        <div id="successMessage" class="success-message"></div>

        <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group">
                <label for="username">
                    <i class="fas fa-user"></i> Username or Email
                </label>
                <input type="text" id="username" name="username" required autocomplete="username">
            </div>

            <div class="form-group">
                <label for="password">
                    <i class="fas fa-lock"></i> Password
                </label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>

            <button type="submit" class="btn-login" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i>
                <span>Login to CRM</span>
            </button>
        </form>

        <div class="divider">
            <span>or</span>
        </div>

        <div class="admin-link">
            <a href="/admin/login">
                <i class="fas fa-crown"></i> Super Admin Access
            </a>
        </div>

        <div class="info-box">
            <h3><i class="fas fa-info-circle"></i> CRM Staff Access</h3>
            <ul>
                <li>Manage customer interactions</li>
                <li>Track tasks and leads</li>
                <li>View team activities</li>
                <li>No financial data access</li>
            </ul>
        </div>
    </div>

    <script>
        async function handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            const errorMessage = document.getElementById('errorMessage');
            const successMessage = document.getElementById('successMessage');

            // Hide messages
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            // Disable button
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Authenticating...</span>';

            try {
                const response = await fetch('/api/admin/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Login successful!', data);
                    
                    // Store staff ID for permission checking
                    if (data.admin && data.admin.id) {
                        localStorage.setItem('crm_staff_id', data.admin.id.toString());
                        sessionStorage.setItem('crm_staff_id', data.admin.id.toString());
                        console.log('📝 Staff ID stored:', data.admin.id);
                    }
                    
                    // Backup: Manually set cookie if server didn't set it
                    if (data.token) {
                        document.cookie = 'admin_token=' + data.token + '; path=/; max-age=86400; SameSite=Lax';
                        console.log('🍪 Manually set admin_token cookie');
                    }
                    
                    // Verify cookie was set
                    const cookies = document.cookie;
                    if (cookies.includes('admin_token')) {
                        console.log('✅ Cookie verified: admin_token is set');
                    } else {
                        console.error('❌ Cookie NOT set! This will cause 401 errors');
                    }
                    
                    successMessage.textContent = 'Login successful! Redirecting to CRM...';
                    successMessage.style.display = 'block';
                    
                    // Redirect to CRM dashboard (not main admin panel)
                    setTimeout(() => {
                        window.location.href = '/admin/crm/dashboard';
                    }, 1000);
                } else {
                    errorMessage.textContent = data.message || 'Invalid credentials. Please try again.';
                    errorMessage.style.display = 'block';
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Login to CRM</span>';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Login to CRM</span>';
            }
        }

        // Check if already logged in
        async function checkAuth() {
            try {
                const response = await fetch('/api/admin/auth/me', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.success) {
                    // Already logged in, redirect to CRM
                    window.location.href = '/admin/crm/dashboard';
                }
            } catch (error) {
                // Not logged in, stay on login page
            }
        }

        // Run auth check on page load
        checkAuth();
    </script>
</body>
</html>
`;
