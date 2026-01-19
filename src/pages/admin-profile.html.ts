export const adminProfileHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Profile - DeepMine AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen p-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">
                        <i class="fas fa-user-circle mr-2"></i>
                        Admin Profile
                    </h1>
                    <p class="text-gray-600 mt-2">Manage your admin account settings</p>
                </div>
                <a href="/admin/dashboard" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to Dashboard
                </a>
            </div>

            <!-- Profile Info Card -->
            <div class="bg-white rounded-lg shadow-md p-8 mb-6">
                <h2 class="text-2xl font-semibold mb-6 text-gray-800">
                    <i class="fas fa-user mr-2"></i>
                    Profile Information
                </h2>
                <div class="space-y-4" id="profileInfo">
                    <div class="flex items-center border-b pb-4">
                        <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                            <span id="avatarInitial">A</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold" id="profileName">Loading...</h3>
                            <p class="text-gray-600" id="profileEmail">Loading...</p>
                            <span class="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                <i class="fas fa-shield-alt mr-1"></i>
                                Super Administrator
                            </span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 pt-4">
                        <div>
                            <label class="text-gray-600 text-sm">User ID</label>
                            <p class="text-gray-800 font-medium" id="profileUserId">-</p>
                        </div>
                        <div>
                            <label class="text-gray-600 text-sm">Account Status</label>
                            <p class="text-green-600 font-medium" id="profileStatus">Active</p>
                        </div>
                        <div>
                            <label class="text-gray-600 text-sm">Balance</label>
                            <p class="text-gray-800 font-medium" id="profileBalance">$0.00</p>
                        </div>
                        <div>
                            <label class="text-gray-600 text-sm">Total Invested</label>
                            <p class="text-gray-800 font-medium" id="profileInvested">$0.00</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Security Card -->
            <div class="bg-white rounded-lg shadow-md p-8 mb-6">
                <h2 class="text-2xl font-semibold mb-6 text-gray-800">
                    <i class="fas fa-lock mr-2"></i>
                    Security Settings
                </h2>
                
                <!-- Change Password Form -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">Current Password</label>
                        <input type="password" id="currentPassword" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="Enter current password">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">New Password</label>
                        <input type="password" id="newPassword" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="Enter new password (min 8 characters)">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                        <input type="password" id="confirmPassword" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="Confirm new password">
                    </div>
                    
                    <div id="passwordError" class="hidden bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p class="text-red-700"></p>
                    </div>
                    <div id="passwordSuccess" class="hidden bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p class="text-green-700"></p>
                    </div>
                    
                    <button onclick="changePassword()" 
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                        <i class="fas fa-key mr-2"></i>
                        Change Password
                    </button>
                </div>

                <!-- Password Tips -->
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 class="font-semibold text-blue-900 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>
                        Password Security Tips
                    </h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>• Use at least 8 characters</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Add numbers and special characters</li>
                        <li>• Avoid common words or personal information</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Load profile data
        async function loadProfile() {
            try {
                const response = await fetch('/api/admin/auth/me', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    window.location.href = '/admin/panel/login';
                    return;
                }

                const data = await response.json();
                document.getElementById('profileName').textContent = data.full_name || data.email;
                document.getElementById('profileEmail').textContent = data.email;
                document.getElementById('profileUserId').textContent = data.id;
                document.getElementById('profileBalance').textContent = '$' + (data.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
                document.getElementById('profileInvested').textContent = '$' + (data.total_invested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
                document.getElementById('avatarInitial').textContent = (data.full_name || data.email).charAt(0).toUpperCase();
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        }

        // Change password
        async function changePassword() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            const errorDiv = document.getElementById('passwordError');
            const successDiv = document.getElementById('passwordSuccess');
            
            // Hide previous messages
            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
            // Validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                errorDiv.querySelector('p').textContent = 'Please fill in all password fields';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            if (newPassword.length < 8) {
                errorDiv.querySelector('p').textContent = 'New password must be at least 8 characters long';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                errorDiv.querySelector('p').textContent = 'New passwords do not match';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            try {
                const response = await fetch('/api/admin/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    successDiv.querySelector('p').textContent = 'Password changed successfully!';
                    successDiv.classList.remove('hidden');
                    
                    // Clear form
                    document.getElementById('currentPassword').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                } else {
                    errorDiv.querySelector('p').textContent = result.error || 'Failed to change password';
                    errorDiv.classList.remove('hidden');
                }
            } catch (error) {
                errorDiv.querySelector('p').textContent = 'Network error. Please try again.';
                errorDiv.classList.remove('hidden');
            }
        }

        // Load profile on page load
        loadProfile();
    </script>
</body>
</html>
`
