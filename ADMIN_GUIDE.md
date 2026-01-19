# 📋 DeepMine AI - Admin Quick Guide

## 🔑 Admin Credentials

**Login URL**: https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai/admin

- **Username**: `admin`
- **Password**: `deepmine2025`

⚠️ **IMPORTANT**: Change these credentials before production deployment!

---

## 🌐 Important URLs

| Page | URL |
|------|-----|
| **Main Website** | https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai |
| **Join/Register** | https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai/join |
| **Admin Dashboard** | https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai/admin |
| **Terms Page** | https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai/terms |

---

## ✨ What Just Got Fixed

### 1. ✅ Join Now Buttons Now Work
All "Join Now" buttons across the site now redirect to `/join` landing page:
- Hero section "Join Now with Code" button
- Calculator section "Start Mining with FIO3081" button
- Floating CTA "Join with FIO3081" button

### 2. ✅ Email System Fixed
- Fixed template literal syntax issues
- Email now sends automatically on registration
- PDF attachment included (Deepmineai-start.pdf)
- Personalized welcome message with unique code

---

## 📊 Admin Dashboard Features

### Statistics Overview
- **Total Registrations**: Count of all users who signed up
- **Today's Registrations**: Count of today's new sign-ups
- **Emails Sent**: Count of successfully sent welcome emails

### User Management Table
- **Sortable Columns**: Click column headers to sort
- **Search**: Type in search box to filter by name or email
- **Data Displayed**:
  - ID
  - Unique Code (e.g., DM1762952589276SSQKV)
  - Full Name
  - Email
  - Access Code (FIO3081)
  - Signup Date
  - Email Status (Sent/Pending)

### Actions
- **Export CSV**: Downloads all registration data as CSV file
- **Refresh**: Reloads data from database
- **Logout**: Exits admin dashboard

---

## 📧 Email System Details

### When Email Sends
- Automatically after successful registration
- Triggered by frontend after database save

### Email Content Includes
1. Personalized welcome with user's name
2. Unique registration code (e.g., DM1762952589276SSQKV)
3. Access code: **FIO3081**
4. Login link: https://deepseek888.vip/web/index.html#/pages/login/login
5. PDF attachment: Deepmineai-start.pdf (getting started guide)
6. Contact information (email, Instagram, TikTok)

### Email Configuration
- **Service**: Web3Forms
- **Access Key**: fed24453-8693-4111-b33d-dafd654c6571
- **Delivery To**: deepmineai25@gmail.com (your inbox)
- **From Name**: DeepMine AI

---

## 🧪 Testing the System

### Test Registration Flow
1. Go to: https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai/join
2. Fill in:
   - Full Name: Test User
   - Email: youremail@example.com
3. Click "Join Now"
4. Check your email inbox for welcome message
5. Verify PDF attachment is included

### View in Admin Dashboard
1. Go to: https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai/admin
2. Login with admin/deepmine2025
3. See your test registration in the table
4. Click "Export CSV" to download data

---

## 🗄️ Database Information

### Local Development
- Database: SQLite via Cloudflare D1 (--local mode)
- Location: `.wrangler/state/v3/d1/`
- Migrations: `migrations/0001_create_registrations.sql`

### Data Stored
- Unique Code (auto-generated)
- Full Name
- Email (unique, validated)
- Access Code (FIO3081)
- Signup Date/Time
- Email Sent Status
- IP Address (optional, currently null)
- User Agent (optional, currently null)

### View Database Directly
```bash
cd /home/user/webapp
npx wrangler d1 execute webapp-production --local --command="SELECT * FROM registrations"
```

---

## 🚀 Production Deployment (When Ready)

### Prerequisites
1. Cloudflare account
2. Cloudflare API token configured
3. Web3Forms account (already configured)

### Deployment Steps
```bash
# 1. Create production database
npx wrangler d1 create webapp-production

# 2. Copy database_id from output and update wrangler.jsonc

# 3. Apply migrations to production
npm run db:migrate:prod

# 4. Deploy to Cloudflare Pages
npm run deploy:prod

# 5. Test production site
# Visit your-project.pages.dev/join
```

---

## 🔧 Troubleshooting

### Email Not Received?
1. Check spam/junk folder
2. Verify email address was typed correctly
3. Check Web3Forms dashboard for delivery status
4. Confirm access key is correct in code

### Can't Login to Admin?
- Username: `admin` (lowercase)
- Password: `deepmine2025` (no spaces)
- Clear browser cache if issues persist

### User Not Showing in Dashboard?
1. Click "Refresh" button
2. Check search box is empty
3. Verify registration was successful (check for success message)

### CSV Export Not Working?
- Ensure you're logged in as admin
- Try refreshing the page
- Check browser console for errors

---

## 📞 Support Contacts

- **Email**: info@deepmineai.vip → deepmineai25@gmail.com
- **Instagram**: @deepmineai
- **TikTok**: @deepmineai1

---

## ✅ What's Working Now

- ✅ Landing page at `/join` with beautiful design
- ✅ All "Join Now" buttons redirect to landing page
- ✅ Form validation (name, email)
- ✅ Database storage (D1 SQLite)
- ✅ Unique code generation per user
- ✅ **Email sending with PDF attachment**
- ✅ Admin login with credentials
- ✅ User management table (sortable, searchable)
- ✅ CSV export functionality
- ✅ Real-time statistics
- ✅ Main website with 10 mining servers
- ✅ Terms of Service page
- ✅ Compact footer
- ✅ Video background hero section

---

**Last Updated**: 2025-11-12  
**Status**: 🟢 All Systems Operational
