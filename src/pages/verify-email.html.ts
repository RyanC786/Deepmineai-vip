// Email verification page HTML template
export const verifyEmailPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email - DeepMine AI</title>
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
        
        .verify-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 24px;
            padding: 48px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            text-align: center;
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
        
        .icon-container {
            width: 80px;
            height: 80px;
            background: rgba(41, 121, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            border: 2px solid rgba(41, 121, 255, 0.3);
        }
        
        .icon-container i {
            font-size: 36px;
            color: var(--aqua-glow);
        }
        
        .subtitle {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 32px;
            font-size: 16px;
        }
        
        .email-display {
            background: rgba(41, 121, 255, 0.1);
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 32px;
            color: var(--aqua-glow);
            font-weight: 600;
            font-size: 16px;
        }
        
        .code-input-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-bottom: 24px;
        }
        
        .code-input {
            width: 56px;
            height: 64px;
            text-align: center;
            font-size: 28px;
            font-weight: 700;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            color: #fff;
            transition: all 0.3s ease;
        }
        
        .code-input:focus {
            outline: none;
            border-color: var(--primary-blue);
            background: rgba(41, 121, 255, 0.1);
            box-shadow: 0 0 20px rgba(41, 121, 255, 0.3);
        }
        
        .btn-primary {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, var(--primary-blue), var(--aqua-glow));
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
            gap: 8px;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(41, 121, 255, 0.4);
        }
        
        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-secondary {
            width: 100%;
            padding: 14px;
            background: transparent;
            border: 1px solid rgba(41, 121, 255, 0.3);
            border-radius: 12px;
            color: var(--aqua-glow);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 16px;
        }
        
        .btn-secondary:hover {
            background: rgba(41, 121, 255, 0.1);
            border-color: var(--primary-blue);
        }
        
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            color: #EF4444;
            display: none;
        }
        
        .success-message {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            color: #22C55E;
            display: none;
        }
        
        .message-icon {
            font-size: 18px;
            margin-right: 8px;
        }
        
        .help-text {
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            margin-top: 24px;
        }
        
        .link {
            color: var(--aqua-glow);
            text-decoration: none;
            font-weight: 500;
        }
        
        .link:hover {
            text-decoration: underline;
        }
        
        .timer {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            margin-top: 16px;
        }
        
        .spinner {
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top: 3px solid #fff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img src="/static/dragon-logo-v2.png" alt="DeepMine AI" class="logo">
        </div>
        
        <div class="verify-card">
            <div class="icon-container">
                <i class="fas fa-envelope"></i>
            </div>
            
            <h1>Verify Your Email</h1>
            <p class="subtitle">Enter the 6-digit code we sent to:</p>
            
            <div class="email-display" id="emailDisplay">
                Loading...
            </div>
            
            <div id="errorMessage" class="error-message">
                <i class="fas fa-exclamation-circle message-icon"></i>
                <span id="errorText"></span>
            </div>
            
            <div id="successMessage" class="success-message">
                <i class="fas fa-check-circle message-icon"></i>
                <span>Email verified successfully! Redirecting to KYC verification...</span>
            </div>
            
            <form id="verifyForm">
                <div class="code-input-container">
                    <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="code1" autofocus>
                    <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="code2">
                    <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="code3">
                    <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="code4">
                    <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="code5">
                    <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" id="code6">
                </div>
                
                <button type="submit" class="btn-primary" id="verifyBtn">
                    <i class="fas fa-check"></i>
                    Verify Email
                </button>
            </form>
            
            <button class="btn-secondary" id="resendBtn">
                <i class="fas fa-redo"></i>
                Resend Code
            </button>
            
            <p class="timer" id="timer"></p>
            
            <p class="help-text">
                Didn't receive the code? Check your spam folder or 
                <a href="/login" class="link">try logging in</a>
            </p>
        </div>
    </div>
    
    <script>
        let userEmail = '';
        let resendCooldown = 0;
        
        // Get token from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        // If token exists, automatically verify
        if (token) {
            document.getElementById('emailDisplay').textContent = 'Verifying your email...';
            verifyEmailWithToken(token);
        } else {
            // Fallback to email parameter for manual entry
            userEmail = urlParams.get('email');
            
            if (!userEmail) {
                window.location.href = '/register';
            }
            
            document.getElementById('emailDisplay').textContent = userEmail;
        }
        
        // Auto-verify function for token-based verification
        async function verifyEmailWithToken(verificationToken) {
            const verifyBtn = document.getElementById('verifyBtn');
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<div class="spinner"></div> Verifying...';
            
            // Hide form inputs for token-based verification
            document.querySelector('.code-input-container').style.display = 'none';
            document.querySelector('.subtitle').textContent = 'Please wait while we verify your email...';
            
            try {
                const response = await fetch('/api/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: verificationToken
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('errorMessage').style.display = 'none';
                    document.getElementById('emailDisplay').textContent = data.email || 'Email verified!';
                    document.querySelector('.subtitle').textContent = 'Your email has been successfully verified!';
                    
                    setTimeout(() => {
                        window.location.href = '/register?email=' + encodeURIComponent(data.email);
                    }, 2000);
                } else {
                    showError(data.message || 'Invalid or expired verification link');
                    verifyBtn.disabled = false;
                    verifyBtn.innerHTML = '<i class="fas fa-check"></i> Verify Email';
                    document.querySelector('.code-input-container').style.display = 'flex';
                }
            } catch (error) {
                showError('Network error. Please try again or contact support.');
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = '<i class="fas fa-check"></i> Verify Email';
                document.querySelector('.code-input-container').style.display = 'flex';
            }
        }
        
        // Auto-focus and auto-tab between code inputs
        const inputs = document.querySelectorAll('.code-input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '') {
                    if (index > 0) {
                        inputs[index - 1].focus();
                    }
                }
            });
            
            // Only allow numbers
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });
        
        // Handle form submission
        document.getElementById('verifyForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const code = Array.from(inputs).map(input => input.value).join('');
            
            if (code.length !== 6) {
                showError('Please enter all 6 digits');
                return;
            }
            
            const verifyBtn = document.getElementById('verifyBtn');
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<div class="spinner"></div> Verifying...';
            
            try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        verificationCode: code
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('successMessage').querySelector('span').textContent = 'Email verified! Redirecting to KYC verification...';
                    document.getElementById('errorMessage').style.display = 'none';
                    
                    setTimeout(() => {
                        window.location.href = '/kyc';
                    }, 2000);
                } else {
                    showError(data.message || 'Invalid verification code');
                    verifyBtn.disabled = false;
                    verifyBtn.innerHTML = '<i class="fas fa-check"></i> Verify Email';
                    
                    // Clear inputs
                    inputs.forEach(input => input.value = '');
                    inputs[0].focus();
                }
            } catch (error) {
                showError('Network error. Please try again.');
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = '<i class="fas fa-check"></i> Verify Email';
            }
        });
        
        // Handle resend button
        document.getElementById('resendBtn').addEventListener('click', async () => {
            if (resendCooldown > 0) {
                return;
            }
            
            const resendBtn = document.getElementById('resendBtn');
            resendBtn.disabled = true;
            resendBtn.innerHTML = '<div class="spinner"></div> Sending...';
            
            try {
                const response = await fetch('/api/auth/resend-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    resendCooldown = 60;
                    startTimer();
                    showError(''); // Clear any errors
                    document.getElementById('errorMessage').style.display = 'none';
                    
                    // Show success briefly
                    const timer = document.getElementById('timer');
                    timer.style.color = '#22C55E';
                    timer.textContent = 'Code sent! Check your email.';
                    
                    setTimeout(() => {
                        timer.style.color = 'rgba(255, 255, 255, 0.6)';
                        startTimer();
                    }, 3000);
                } else {
                    showError(data.message || 'Failed to resend code');
                }
            } catch (error) {
                showError('Network error. Please try again.');
            } finally {
                resendBtn.disabled = false;
                resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
            }
        });
        
        function startTimer() {
            const timerEl = document.getElementById('timer');
            const resendBtn = document.getElementById('resendBtn');
            
            const interval = setInterval(() => {
                if (resendCooldown > 0) {
                    timerEl.textContent = \`Resend code in \${resendCooldown}s\`;
                    resendBtn.disabled = true;
                    resendCooldown--;
                } else {
                    timerEl.textContent = '';
                    resendBtn.disabled = false;
                    clearInterval(interval);
                }
            }, 1000);
        }
        
        function showError(message) {
            const errorEl = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            
            if (message) {
                errorText.textContent = message;
                errorEl.style.display = 'block';
            } else {
                errorEl.style.display = 'none';
            }
        }
    </script>
</body>
</html>
`
