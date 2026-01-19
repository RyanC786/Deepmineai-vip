// Registration page HTML template
export const registerPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - DeepMine AI</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/dragon-logo-v2.png">
    <link rel="shortcut icon" href="/static/dragon-logo-v2.png">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-blue: #2979FF;
            --aqua-glow: #33F0FF;
            --violet-gradient: #7B61FF;
            --deep-navy: #0B0F1E;
            --dark-gray: #1A1F35;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--deep-navy) 0%, var(--dark-gray) 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            max-width: 500px;
            width: 100%;
        }
        
        .logo-container {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .logo {
            height: 120px;
            width: auto;
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
        
        .register-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 24px;
            padding: 48px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
            background: linear-gradient(135deg, var(--aqua-glow) 0%, var(--primary-blue) 50%, var(--violet-gradient) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 32px;
            font-size: 16px;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            font-size: 14px;
        }
        
        input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            color: #fff;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        input:focus {
            outline: none;
            border-color: var(--primary-blue);
            background: rgba(255, 255, 255, 0.08);
        }
        
        input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }
        
        .password-requirements {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 6px;
        }
        
        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--violet-gradient) 100%);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 12px;
        }
        
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(41, 121, 255, 0.4);
        }
        
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .login-link {
            text-align: center;
            margin-top: 24px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .login-link a {
            color: var(--aqua-glow);
            text-decoration: none;
            font-weight: 600;
        }
        
        .alert {
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-size: 14px;
            display: none;
        }
        
        .alert-success {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.5);
            color: #10B981;
        }
        
        .alert-error {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #EF4444;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            margin-bottom: 24px;
            font-size: 14px;
            transition: color 0.3s;
        }
        
        .back-link:hover {
            color: var(--aqua-glow);
        }
        
        .form-footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .register-card {
                padding: 32px 24px;
            }
            
            h1 {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Back to Home
        </a>
        
        <div class="logo-container">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
        </div>
        
        <div class="register-card">
            <h1>Create Account</h1>
            <p class="subtitle">Join thousands of miners earning daily passive income</p>
            
            <div id="alert" class="alert"></div>
            
            <form id="registerForm">
                <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input type="text" id="fullName" name="fullName" placeholder="John Doe" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" placeholder="john@example.com" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password *</label>
                    <input type="password" id="password" name="password" placeholder="Create a strong password" required>
                    <div class="password-requirements">
                        Must be at least 8 characters with uppercase, lowercase, and numbers
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password *</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                </div>
                
                <div class="form-group">
                    <label for="referralCode">Referral Code (Optional)</label>
                    <input type="text" id="referralCode" name="referralCode" placeholder="Enter referral code if you have one">
                </div>
                
                <button type="submit" class="submit-btn" id="submitBtn">
                    <i class="fas fa-user-plus"></i> Create Account
                </button>
            </form>
            
            <div class="login-link">
                Already have an account? <a href="/login">Log in here</a>
            </div>
            
            <div class="form-footer">
                By creating an account, you agree to our Terms of Service and Privacy Policy
            </div>
        </div>
    </div>
    
    <script>
        const form = document.getElementById('registerForm');
        const submitBtn = document.getElementById('submitBtn');
        const alertDiv = document.getElementById('alert');
        
        function showAlert(message, type = 'error') {
            alertDiv.textContent = message;
            alertDiv.className = 'alert alert-' + type;
            alertDiv.style.display = 'block';
            
            // Auto-hide success messages
            if (type === 'success') {
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 8000);
            }
        }
        
        function hideAlert() {
            alertDiv.style.display = 'none';
        }
        
        // Auto-fill referral code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        if (refCode) {
            document.getElementById('referralCode').value = refCode;
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAlert();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const referralCode = document.getElementById('referralCode').value.trim();
            
            // Validation
            if (!fullName || !email || !password) {
                showAlert('Please fill in all required fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match');
                return;
            }
            
            if (password.length < 8) {
                showAlert('Password must be at least 8 characters long');
                return;
            }
            
            if (!/[A-Z]/.test(password)) {
                showAlert('Password must contain at least one uppercase letter');
                return;
            }
            
            if (!/[a-z]/.test(password)) {
                showAlert('Password must contain at least one lowercase letter');
                return;
            }
            
            if (!/[0-9]/.test(password)) {
                showAlert('Password must contain at least one number');
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        password,
                        referredByCode: referralCode || null
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAlert('Registration successful! Please check your email for verification code.', 'success');
                    form.reset();
                    
                    // Redirect to verification page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/verify-email?email=' + encodeURIComponent(email);
                    }, 2000);
                } else {
                    showAlert(data.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showAlert('Network error. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            }
        });
    </script>
    
</body>
</html>
`
