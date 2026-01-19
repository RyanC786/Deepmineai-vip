-- First, let's check if Rayhan exists and his current password
SELECT id, username, email, full_name, password_hash FROM admin_users WHERE username = 'rayhan' OR email LIKE '%rayhan%';
