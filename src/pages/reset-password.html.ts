export const resetPasswordPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - DeepMine AI</title>
    <link rel="icon" type="image/png" href="https://deepmineai.vip/favicon.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 450px;
        }

        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .logo-container {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }

        .logo i {
            color: white;
            font-size: 28px;
        }

        h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #718096;
            font-size: 14px;
            line-height: 1.5;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #4a5568;
            font-weight: 500;
            font-size: 14px;
        }

        .input-group {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #a0aec0;
        }

        .toggle-password {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #a0aec0;
            cursor: pointer;
            transition: color 0.3s;
        }

        .toggle-password:hover {
            color: #667eea;
        }

        input {
            width: 100%;
            padding: 12px 45px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-requirements {
            margin-top: 10px;
            padding: 12px;
            background: #f7fafc;
            border-radius: 8px;
            font-size: 13px;
            color: #4a5568;
        }

        .password-requirements ul {
            list-style: none;
            margin-top: 8px;
        }

        .password-requirements li {
            margin: 4px 0;
            padding-left: 20px;
            position: relative;
        }

        .password-requirements li:before {
            content: '•';
            position: absolute;
            left: 5px;
        }

        .btn-primary {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .back-link {
            text-align: center;
            margin-top: 20px;
        }

        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
        }

        .back-link a:hover {
            text-decoration: underline;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo-container">
                <div class="logo">
                    <i class="fas fa-lock"></i>
                </div>
                <h1>Reset Password</h1>
                <p class="subtitle">Enter your new password below.</p>
            </div>

            <div id="alertMessage" class="alert"></div>

            <form id="resetPasswordForm">
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" required>
                        <i class="fas fa-eye toggle-password" onclick="togglePassword('newPassword', this)"></i>
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm new password" required>
                        <i class="fas fa-eye toggle-password" onclick="togglePassword('confirmPassword', this)"></i>
                    </div>
                    <div class="password-requirements">
                        <strong>Password must contain:</strong>
                        <ul>
                            <li>At least 8 characters</li>
                            <li>Both uppercase and lowercase letters</li>
                            <li>At least one number</li>
                        </ul>
                    </div>
                </div>

                <button type="submit" class="btn-primary" id="submitBtn">
                    <span id="buttonText">Reset Password</span>
                    <span id="buttonSpinner" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i> Resetting...
                    </span>
                </button>
            </form>

            <div class="back-link">
                <a href="/login"><i class="fas fa-arrow-left"></i> Back to Login</a>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('resetPasswordForm');
        const alertMessage = document.getElementById('alertMessage');
        const submitBtn = document.getElementById('submitBtn');
        const buttonText = document.getElementById('buttonText');
        const buttonSpinner = document.getElementById('buttonSpinner');

        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            showAlert('Invalid or missing reset token. Please request a new password reset.', 'error');
            submitBtn.disabled = true;
        }

        function togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function showAlert(message, type) {
            alertMessage.textContent = message;
            alertMessage.className = \`alert alert-\${type}\`;
            alertMessage.style.display = 'block';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate passwords match
            if (newPassword !== confirmPassword) {
                showAlert('Passwords do not match!', 'error');
                return;
            }

            // Validate password strength
            if (newPassword.length < 8) {
                showAlert('Password must be at least 8 characters long!', 'error');
                return;
            }

            if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
                showAlert('Password must contain both uppercase and lowercase letters!', 'error');
                return;
            }

            if (!/[0-9]/.test(newPassword)) {
                showAlert('Password must contain at least one number!', 'error');
                return;
            }
            
            // Disable button and show spinner
            submitBtn.disabled = true;
            buttonText.style.display = 'none';
            buttonSpinner.style.display = 'inline';

            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        token: token,
                        newPassword: newPassword 
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showAlert(data.message || 'Password reset successfully!', 'success');
                    form.reset();
                    
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    showAlert(data.message || 'Failed to reset password. Please try again.', 'error');
                    submitBtn.disabled = false;
                    buttonText.style.display = 'inline';
                    buttonSpinner.style.display = 'none';
                }
            } catch (error) {
                console.error('Reset password error:', error);
                showAlert('An error occurred. Please try again later.', 'error');
                submitBtn.disabled = false;
                buttonText.style.display = 'inline';
                buttonSpinner.style.display = 'none';
            }
        });
    </script>
</body>
</html>
`
