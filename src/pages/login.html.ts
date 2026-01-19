// Login page HTML template
export const loginPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - DeepMine AI</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
            width: 100%;
        }
        
        .login-container {
            max-width: 450px;
            width: 100%;
        }
        
        .login-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 24px;
            padding: 48px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .logo {
            height: 120px;
            width: auto;
            display: block;
            margin: 0 auto 32px;
            animation: logoGlow 2s ease-in-out infinite;
            filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.5));
        }
        
        @keyframes logoGlow {
            0%, 100% { 
                filter: drop-shadow(0 0 20px rgba(51, 240, 255, 0.6));
                opacity: 1;
            }
            50% { 
                filter: drop-shadow(0 0 40px rgba(51, 240, 255, 0.9));
                opacity: 0.85;
            }
        }
        
        h1 {
            font-size: 32px;
            text-align: center;
            background: linear-gradient(135deg, #33F0FF 0%, #2979FF 50%, #7B61FF 100%);
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
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            color: #fff;
            font-size: 16px;
        }
        
        input:focus {
            outline: none;
            border-color: #2979FF;
            background: rgba(255, 255, 255, 0.08);
        }
        
        .remember-forgot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            font-size: 14px;
        }
        
        .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .forgot-link {
            color: #33F0FF;
            text-decoration: none;
        }
        
        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #2979FF 0%, #7B61FF 100%);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(41, 121, 255, 0.4);
        }
        
        .submit-btn:disabled {
            opacity: 0.6;
        }
        
        .register-link {
            text-align: center;
            margin-top: 24px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .register-link a {
            color: #33F0FF;
            text-decoration: none;
            font-weight: 600;
        }
        
        .alert {
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: none;
        }
        
        .alert-error {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #EF4444;
        }
        
        .alert-success {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.5);
            color: #10B981;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            margin-bottom: 24px;
            font-size: 14px;
        }
        
        .back-link:hover {
            color: #33F0FF;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            body {
                padding: 16px;
            }

            .login-card {
                padding: 32px 24px;
            }

            .logo {
                height: 80px;
                margin-bottom: 24px;
            }

            h1 {
                font-size: 24px;
                margin-bottom: 24px;
            }

            input {
                padding: 12px 14px;
                font-size: 16px; /* Prevent iOS zoom */
            }

            .submit-btn {
                padding: 14px;
                font-size: 16px;
            }

            .remember-forgot {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
        }

        @media (max-width: 480px) {
            .login-card {
                padding: 24px 20px;
            }

            .logo {
                height: 60px;
            }

            h1 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <a href="/" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Home
        </a>
        
        <div class="login-card">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
            <h1>Welcome Back</h1>
            
            <div id="alert" class="alert"></div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required>
                </div>
                
                <div class="remember-forgot">
                    <label class="remember-me">
                        <input type="checkbox" id="rememberMe">
                        <span>Remember me</span>
                    </label>
                    <a href="/forgot-password" class="forgot-link">Forgot Password?</a>
                </div>
                
                <button type="submit" class="submit-btn" id="submitBtn">
                    <i class="fas fa-sign-in-alt"></i> Log In
                </button>
            </form>
            
            <div class="register-link">
                Don't have an account? <a href="/register">Create one now</a>
            </div>
        </div>
    </div>
    
    <script>
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');
        const alertDiv = document.getElementById('alert');
        
        function showAlert(message, type = 'error') {
            alertDiv.textContent = message;
            alertDiv.className = 'alert alert-' + type;
            alertDiv.style.display = 'block';
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            alertDiv.style.display = 'none';
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging In...';
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, rememberMe })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store token as cookie manually if not set by server
                    if (data.token) {
                        const maxAge = rememberMe ? 2592000 : 86400;
                        document.cookie = 'auth_token=' + data.token + '; path=/; max-age=' + maxAge + '; SameSite=Lax; Secure';
                    }
                    
                    // Check KYC status - redirect to KYC if not approved
                    if (data.requiresKyc) {
                        showAlert('Please complete KYC verification first!', 'success');
                        setTimeout(() => {
                            window.location.href = '/kyc';
                        }, 1000);
                    } else {
                        showAlert('Login successful! Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 1000);
                    }
                } else {
                    if (data.requiresVerification) {
                        showAlert('Please verify your email first.');
                        setTimeout(() => {
                            window.location.href = '/verify-email?email=' + encodeURIComponent(email);
                        }, 2000);
                    } else {
                        showAlert(data.message || 'Login failed');
                    }
                }
            } catch (error) {
                showAlert('Network error. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In';
            }
        });
    </script>
    
</body>
</html>
`
