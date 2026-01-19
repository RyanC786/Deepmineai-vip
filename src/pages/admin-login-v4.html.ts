// V4 Admin Login page HTML template (username/password)
export const adminLoginV4PageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - DeepMine AI V4</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            max-width: 450px;
            width: 100%;
        }
        
        .login-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 24px;
            padding: 48px;
            box-shadow: 0 8px 32px rgba(255, 107, 107, 0.2);
        }
        
        .admin-badge {
            background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
            color: white;
            padding: 8px 24px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: inline-block;
            margin: 0 auto 24px;
            width: fit-content;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
        }
        
        .logo {
            height: 80px;
            width: auto;
            display: block;
            margin: 0 auto 24px;
            mix-blend-mode: screen;
        }
        
        h1 {
            font-size: 32px;
            text-align: center;
            background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 50%, #FF8787 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 32px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
        }
        
        input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 12px;
            color: #fff;
            font-size: 16px;
            box-sizing: border-box;
        }
        
        input:focus {
            outline: none;
            border-color: #FF6B6B;
            background: rgba(255, 255, 255, 0.08);
        }
        
        .btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 24px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .back-link {
            text-align: center;
            margin-top: 24px;
        }
        
        .back-link a {
            color: #33F0FF;
            text-decoration: none;
            font-size: 14px;
        }
        
        .error-message, .success-message {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        
        .error-message {
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.3);
            color: #FF8787;
        }
        
        .success-message {
            background: rgba(51, 240, 255, 0.1);
            border: 1px solid rgba(51, 240, 255, 0.3);
            color: #33F0FF;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div style="text-align: center;">
                <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
                <div class="admin-badge">
                    <i class="fas fa-shield-alt"></i>
                    V4 Admin Access
                </div>
            </div>
            
            <h1>Admin Dashboard</h1>
            
            <div id="errorMessage" class="error-message"></div>
            <div id="successMessage" class="success-message"></div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">
                        <i class="fas fa-user"></i> Username
                    </label>
                    <input type="text" id="username" name="username" required autocomplete="username" placeholder="Enter admin username">
                </div>
                
                <div class="form-group">
                    <label for="password">
                        <i class="fas fa-lock"></i> Password
                    </label>
                    <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="Enter password">
                </div>
                
                <button type="submit" class="btn" id="loginBtn">
                    <i class="fas fa-sign-in-alt"></i> Sign In to V4 Dashboard
                </button>
            </form>
            
            <div class="back-link">
                <a href="/"><i class="fas fa-arrow-left"></i> Back to Home</a>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        }

        function showSuccess(message) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }

            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

            try {
                const response = await fetch('/api/auth/admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    showSuccess('Login successful! Redirecting to dashboard...');
                    setTimeout(() => {
                        window.location.href = data.redirect || '/admin/dashboard';
                    }, 1000);
                } else {
                    showError(data.message || 'Invalid credentials');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In to V4 Dashboard';
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Login failed. Please try again.');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In to V4 Dashboard';
            }
        });
    </script>
</body>
</html>
`
