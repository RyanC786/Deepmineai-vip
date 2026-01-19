export const forgotPasswordPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - DeepMine AI</title>
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

        input {
            width: 100%;
            padding: 12px 15px 12px 45px;
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

        .alert-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo-container">
                <div class="logo">
                    <i class="fas fa-key"></i>
                </div>
                <h1>Forgot Password?</h1>
                <p class="subtitle">Enter your email address and we'll send you instructions to reset your password.</p>
            </div>

            <div id="alertMessage" class="alert"></div>

            <form id="forgotPasswordForm">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <div class="input-group">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" id="email" name="email" placeholder="your@email.com" required>
                    </div>
                </div>

                <button type="submit" class="btn-primary" id="submitBtn">
                    <span id="buttonText">Send Reset Instructions</span>
                    <span id="buttonSpinner" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i> Sending...
                    </span>
                </button>
            </form>

            <div class="back-link">
                <a href="/login"><i class="fas fa-arrow-left"></i> Back to Login</a>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('forgotPasswordForm');
        const alertMessage = document.getElementById('alertMessage');
        const submitBtn = document.getElementById('submitBtn');
        const buttonText = document.getElementById('buttonText');
        const buttonSpinner = document.getElementById('buttonSpinner');

        function showAlert(message, type) {
            alertMessage.textContent = message;
            alertMessage.className = \`alert alert-\${type}\`;
            alertMessage.style.display = 'block';
            
            setTimeout(() => {
                alertMessage.style.display = 'none';
            }, 5000);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Disable button and show spinner
            submitBtn.disabled = true;
            buttonText.style.display = 'none';
            buttonSpinner.style.display = 'inline';

            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (data.success) {
                    showAlert(data.message || 'Password reset instructions have been sent to your email!', 'success');
                    form.reset();
                    
                    // Show info message
                    setTimeout(() => {
                        showAlert('Please check your email inbox (and spam folder) for reset instructions.', 'info');
                    }, 5500);
                } else {
                    showAlert(data.message || 'Failed to send reset instructions. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                showAlert('An error occurred. Please try again later.', 'error');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                buttonText.style.display = 'inline';
                buttonSpinner.style.display = 'none';
            }
        });
    </script>
</body>
</html>
`
