// NEW Admin Panel Login page HTML template (email/password)
export const adminPanelLoginPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - DeepMine AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #0B0F1E 0%, #1A1F35 50%, #0B0F1E 100%);
            min-height: 100vh;
        }
        
        .login-container {
            background: rgba(26, 31, 53, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(41, 121, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .input-field {
            background: rgba(11, 15, 30, 0.6);
            border: 1px solid rgba(41, 121, 255, 0.3);
            transition: all 0.3s ease;
        }
        
        .input-field:focus {
            outline: none;
            border-color: #2979FF;
            box-shadow: 0 0 0 3px rgba(41, 121, 255, 0.1);
        }
        
        .btn-login {
            background: linear-gradient(135deg, #2979FF 0%, #1565C0 100%);
            transition: all 0.3s ease;
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
        
        .logo {
            text-shadow: 0 0 20px rgba(51, 240, 255, 0.5);
        }
        
        .alert {
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="flex items-center justify-center p-4">
    <div class="login-container rounded-2xl p-8 w-full max-w-md">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
            <h1 class="logo text-4xl font-bold text-white mb-2">
                <i class="fas fa-shield-halved text-cyan-400"></i>
                DeepMine AI
            </h1>
            <p class="text-gray-400 text-lg">Admin Portal</p>
            <div class="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
        </div>
        
        <!-- Alert Container -->
        <div id="alertContainer" class="mb-4"></div>
        
        <!-- Login Form -->
        <form id="loginForm" class="space-y-6">
            <!-- Email Field -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                    <i class="fas fa-envelope mr-2 text-cyan-400"></i>
                    Admin Email
                </label>
                <input 
                    type="email" 
                    id="email" 
                    name="email"
                    class="input-field w-full px-4 py-3 rounded-lg text-white"
                    placeholder="admin@deepmineai.vip"
                    required
                    autocomplete="email"
                >
            </div>
            
            <!-- Password Field -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                    <i class="fas fa-lock mr-2 text-cyan-400"></i>
                    Password
                </label>
                <div class="relative">
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        class="input-field w-full px-4 py-3 rounded-lg text-white pr-12"
                        placeholder="Enter admin password"
                        required
                        autocomplete="current-password"
                    >
                    <button 
                        type="button" 
                        id="togglePassword"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition"
                    >
                        <i class="fas fa-eye" id="eyeIcon"></i>
                    </button>
                </div>
            </div>
            
            <!-- Submit Button -->
            <button 
                type="submit" 
                id="loginBtn"
                class="btn-login w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center"
            >
                <i class="fas fa-sign-in-alt mr-2"></i>
                <span id="loginBtnText">Sign In</span>
            </button>
        </form>
        
        <!-- Security Notice -->
        <div class="mt-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
            <p class="text-yellow-400 text-sm flex items-start">
                <i class="fas fa-shield-alt mt-1 mr-2"></i>
                <span>
                    <strong>Security Notice:</strong> This is a restricted admin area. 
                    All access attempts are logged and monitored.
                </span>
            </p>
        </div>
        
        <!-- Back to Home -->
        <div class="mt-6 text-center">
            <a href="/" class="text-gray-400 hover:text-cyan-400 transition text-sm">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Home
            </a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        // CRITICAL: Enable credentials to save cookies!
        axios.defaults.withCredentials = true;
        console.log('[LOGIN] axios.defaults.withCredentials set to true');
        
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const loginBtnText = document.getElementById('loginBtnText');
        const alertContainer = document.getElementById('alertContainer');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');
        
        // Toggle password visibility
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
        
        // Show alert
        function showAlert(message, type = 'error') {
            const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
            const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
            
            alertContainer.innerHTML = \`
                <div class="alert \${bgColor} bg-opacity-10 border border-\${type === 'success' ? 'green' : 'red'}-500 border-opacity-30 rounded-lg p-4">
                    <p class="text-\${type === 'success' ? 'green' : 'red'}-400 text-sm flex items-center">
                        <i class="fas \${icon} mr-2"></i>
                        \${message}
                    </p>
                </div>
            \`;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                alertContainer.innerHTML = '';
            }, 5000);
        }
        
        // Handle form submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showAlert('Please enter both email and password', 'error');
                return;
            }
            
            // Disable button
            loginBtn.disabled = true;
            loginBtnText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
            
            try {
                const response = await axios.post('/api/admin/auth/login', {
                    email,
                    password
                });
                
                if (response.data.success) {
                    console.log('✅ Login successful!', response.data);
                    
                    // Backup: Manually set cookie if server didn't set it
                    if (response.data.token) {
                        document.cookie = 'admin_token=' + response.data.token + '; path=/; max-age=86400; SameSite=Lax';
                        console.log('🍪 Manually set admin_token cookie');
                    }
                    
                    // Verify cookie was set
                    const cookies = document.cookie;
                    if (cookies.includes('admin_token')) {
                        console.log('✅ Cookie verified: admin_token is set');
                    } else {
                        console.error('❌ Cookie NOT set! This will cause 401 errors');
                    }
                    
                    // Get user info from response
                    const userRole = response.data.admin?.role_name || 'super_admin';
                    const accountStatus = response.data.admin?.account_status || '';
                    
                    console.log('[LOGIN] User role:', userRole);
                    console.log('[LOGIN] Account status:', accountStatus);
                    console.log('[LOGIN] Full admin data:', response.data.admin);
                    
                    showAlert('Login successful! Redirecting...', 'success');
                    
                    // Redirect to CRM Dashboard for ALL admin users
                    setTimeout(() => {
                        console.log('[LOGIN] ✅ Redirecting to CRM Dashboard');
                        window.location.href = '/admin/crm/dashboard';
                    }, 1000);
                } else {
                    showAlert(response.data.message || 'Login failed', 'error');
                    loginBtn.disabled = false;
                    loginBtnText.innerHTML = 'Sign In';
                }
            } catch (error) {
                console.error('Login error:', error);
                console.error('Error response:', error.response);
                console.error('Error data:', error.response?.data);
                console.error('Error status:', error.response?.status);
                const message = error.response?.data?.message || 'Invalid admin credentials. Please check your email and password.';
                console.error('Message to display:', message);
                showAlert(message, 'error');
                
                // Re-enable button
                loginBtn.disabled = false;
                loginBtnText.innerHTML = 'Sign In';
            }
        });
        
        // Check if already logged in
        async function checkAuth() {
            try {
                console.log('[LOGIN] Checking if already authenticated...');
                const response = await axios.get('/api/admin/auth/me');
                
                if (response.data.success) {
                    console.log('[LOGIN] ✅ Already logged in:', response.data.admin);
                    
                    const userRole = response.data.admin?.role_name || '';
                    const accountStatus = response.data.admin?.account_status || '';
                    
                    console.log('[LOGIN] Role:', userRole, '| Status:', accountStatus);
                    console.log('[LOGIN] ✅ Already logged in - Redirecting to CRM dashboard...');
                    window.location.href = '/admin/crm/dashboard';
                }
            } catch (error) {
                // Not logged in or invalid token, stay on login page
                console.log('[LOGIN] ❌ Not authenticated, showing login form');
            }
        }
        
        // Check authentication on page load
        checkAuth();
    </script>
</body>
</html>
`;
