export const partnerLoginHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partner Portal Login - DeepMine AI</title>
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-container {
            max-width: 450px;
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .logo-section {
            text-align: center;
            margin-bottom: 32px;
        }

        .logo-section img {
            width: 80px;
            height: 80px;
            margin-bottom: 16px;
            filter: drop-shadow(0 0 20px rgba(41, 121, 255, 0.6));
        }

        .logo-section h1 {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
        }

        .logo-section p {
            color: #94A3B8;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .form-group label {
            display: block;
            color: #E2E8F0;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .input-wrapper {
            position: relative;
        }

        .input-wrapper i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #64748B;
        }

        .form-control {
            width: 100%;
            padding: 14px 16px 14px 48px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            font-size: 15px;
            transition: all 0.3s;
        }

        .form-control:focus {
            outline: none;
            border-color: #2979FF;
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 0 3px rgba(41, 121, 255, 0.1);
        }

        .form-control::placeholder {
            color: #64748B;
        }

        .login-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #2979FF 0%, #1E40AF 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(41, 121, 255, 0.4);
        }

        .login-btn:active {
            transform: translateY(0);
        }

        .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #FCA5A5;
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
            align-items: center;
            gap: 8px;
        }

        .error-message.show {
            display: flex;
        }

        .back-link {
            text-align: center;
            margin-top: 24px;
        }

        .back-link a {
            color: #2979FF;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s;
        }

        .back-link a:hover {
            color: #60A5FA;
        }

        .spinner {
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .info-box {
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
        }

        .info-box p {
            color: #93C5FD;
            font-size: 13px;
            line-height: 1.6;
            margin: 0;
        }

        .info-box i {
            color: #2979FF;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo-section">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI">
            <h1>Partner Portal</h1>
            <p>Residual Tracking & Analytics</p>
        </div>

        <div class="info-box">
            <p>
                <i class="fas fa-info-circle"></i>
                Access your partner residuals, track earnings, and view comprehensive withdrawal analytics. 2% residual on net profit after contract completion.
            </p>
        </div>

        <div id="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span id="errorText"></span>
        </div>

        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <div class="input-wrapper">
                    <i class="fas fa-user"></i>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        class="form-control" 
                        placeholder="Enter your username"
                        required
                        autocomplete="username"
                    >
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrapper">
                    <i class="fas fa-lock"></i>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-control" 
                        placeholder="Enter your password"
                        required
                        autocomplete="current-password"
                    >
                </div>
            </div>

            <button type="submit" class="login-btn" id="loginBtn">
                <span id="btnText">
                    <i class="fas fa-sign-in-alt"></i> Login to Partner Portal
                </span>
                <div id="btnSpinner" class="spinner" style="display: none;"></div>
            </button>
        </form>

        <div class="back-link">
            <a href="/"><i class="fas fa-arrow-left"></i> Back to Homepage</a>
        </div>
    </div>

    <script>
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const loginBtn = document.getElementById('loginBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');

        function showError(message) {
            errorText.textContent = message;
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }

            // Show loading state
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';

            try {
                const response = await fetch('/api/partner/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Store token
                    localStorage.setItem('partner_token', data.token);
                    localStorage.setItem('partner_name', data.partner.name);
                    
                    // Redirect to dashboard
                    window.location.href = '/partner/dashboard';
                } else {
                    showError(data.message || 'Invalid username or password');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Connection error. Please try again.');
            } finally {
                // Reset button state
                loginBtn.disabled = false;
                btnText.style.display = 'flex';
                btnSpinner.style.display = 'none';
            }
        });
    </script>
</body>
</html>
`
