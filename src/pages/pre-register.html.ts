// Pre-Registration page HTML template (Step 1: Capture email)
export const preRegisterPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Start Mining - DeepMine AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
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
        }
        
        .pre-register-container {
            max-width: 500px;
            width: 100%;
        }
        
        .pre-register-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 24px;
            padding: 48px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .logo {
            height: 100px;
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
            margin-bottom: 16px;
        }
        
        .subtitle {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 32px;
            font-size: 16px;
            line-height: 1.5;
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
            margin-top: 24px;
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
            color: rgba(255, 255, 255, 0.7);
        }
        
        .login-link a {
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
        
        .features {
            display: grid;
            gap: 16px;
            margin-top: 32px;
            padding-top: 32px;
            border-top: 1px solid rgba(41, 121, 255, 0.2);
        }
        
        .feature {
            display: flex;
            align-items: center;
            gap: 12px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .feature i {
            color: #33F0FF;
            font-size: 20px;
        }
        
        @media (max-width: 768px) {
            .pre-register-card {
                padding: 32px 24px;
            }
            
            h1 {
                font-size: 28px;
            }
            
            .logo {
                height: 80px;
            }
        }
    </style>
</head>
<body>
    <div class="pre-register-container">
        <a href="/" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Home
        </a>
        
        <div class="pre-register-card">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
            <h1>Start Mining Today</h1>
            <p class="subtitle">
                Join thousands of miners earning daily passive income.<br>
                Enter your details to get started.
            </p>
            
            <div id="alert" class="alert"></div>
            
            <form id="preRegisterForm">
                <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input type="text" id="fullName" name="fullName" placeholder="John Doe" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" placeholder="your@email.com" required>
                </div>
                
                <button type="submit" class="submit-btn" id="submitBtn">
                    <i class="fas fa-envelope"></i> Send Verification Email
                </button>
            </form>
            
            <div class="login-link">
                Already have an account? <a href="/login">Log in here</a>
            </div>
            
            <div class="features">
                <div class="feature">
                    <i class="fas fa-check-circle"></i>
                    <span>Email verification required for security</span>
                </div>
                <div class="feature">
                    <i class="fas fa-shield-alt"></i>
                    <span>KYC verification for account access</span>
                </div>
                <div class="feature">
                    <i class="fas fa-clock"></i>
                    <span>Start mining in minutes</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('preRegisterForm');
        const submitBtn = document.getElementById('submitBtn');
        const alertDiv = document.getElementById('alert');

        function showAlert(message, type) {
            alertDiv.textContent = message;
            alertDiv.className = 'alert alert-' + type;
            alertDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds for errors
            if (type === 'error') {
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 5000);
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // Validation
            if (!fullName || !email) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                const response = await fetch('/api/pre-register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullName, email })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    showAlert(data.message, 'success');
                    form.reset();
                    
                    // Show verification message
                    setTimeout(() => {
                        showAlert('Please check your email and click the verification link to continue registration.', 'success');
                    }, 2000);
                } else {
                    showAlert(data.message || 'Registration failed. Please try again.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Send Verification Email';
                }
            } catch (error) {
                console.error('Pre-registration error:', error);
                showAlert('An error occurred. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Send Verification Email';
            }
        });
    </script>
    
</body>
</html>
`;
