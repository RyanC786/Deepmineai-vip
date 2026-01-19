// Send welcome email to Aleena
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_FWsaDVMa_78CsfBDXgwxh9LFV93bZkPXP';

async function sendEmail() {
  const loginUrl = 'https://www.deepmineai.vip/admin/crm/login';
  const email = 'aleena@deepmineai.vip';
  const fullName = 'Aleena Khan';
  const username = 'Aleena K7';
  const password = 'AleenaDmai@777!#';
  const role = 'Administrator';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .credentials-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 24px; margin: 24px 0; }
            .credentials-box h3 { color: #059669; margin-top: 0; }
            .credential-row { padding: 12px 0; border-bottom: 1px solid #d1fae5; }
            .credential-row:last-child { border-bottom: none; }
            .credential-label { color: #6b7280; font-weight: 600; }
            .credential-value { color: #0B0F1E; font-weight: 700; font-family: monospace; background: #ffffff; padding: 4px 12px; border-radius: 4px; }
            .button { display: inline-block; background: #10b981; color: #ffffff; padding: 16px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🐉 Welcome to DeepMine AI Team!</h1>
                <p style="color: #d1fae5; margin: 10px 0 0;">Your CRM Account Has Been Created</p>
            </div>
            <div class="content">
                <h2>Hello ${fullName}!</h2>
                <p>Welcome to the DeepMine AI team! Your admin account has been created with full access to our CRM system.</p>
                
                <div class="credentials-box">
                    <h3>🔐 Your Login Credentials</h3>
                    <div class="credential-row">
                        <div class="credential-label">Username:</div>
                        <div class="credential-value">${username}</div>
                    </div>
                    <div class="credential-row">
                        <div class="credential-label">Email:</div>
                        <div class="credential-value">${email}</div>
                    </div>
                    <div class="credential-row">
                        <div class="credential-label">Password:</div>
                        <div class="credential-value">${password}</div>
                    </div>
                    <div class="credential-row">
                        <div class="credential-label">Role:</div>
                        <div class="credential-value">${role}</div>
                    </div>
                </div>

                <div class="warning">
                    <p><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
                </div>

                <div style="text-align: center;">
                    <a href="${loginUrl}" class="button">Login to CRM Dashboard</a>
                </div>

                <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 DeepMine AI. All rights reserved.</p>
                <p><a href="https://www.deepmineai.vip">www.deepmineai.vip</a></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'DeepMine AI <noreply@deepmineai.vip>',
      to: [email],
      subject: 'Welcome to DeepMine AI Team - Your CRM Access',
      html: html
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ Email send failed:', data);
    process.exit(1);
  }
  
  console.log('✅ Email sent successfully!');
  console.log('Email ID:', data.id);
  console.log('\nLogin Details:');
  console.log('URL:', loginUrl);
  console.log('Email:', email);
  console.log('Username:', username);
  console.log('Password:', password);
}

sendEmail().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
