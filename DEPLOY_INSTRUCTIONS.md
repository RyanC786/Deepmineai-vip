# 🚀 DeepMine AI - Cloudflare Pages Deployment Guide

## Current Status
- ✅ API Token configured
- ✅ Project built (dist/ folder ready)
- ⚠️ D1 Database needs manual setup (API token lacks D1 permissions)

---

## 📋 Deployment Steps

### **Step 1: Upload to Cloudflare Pages** ⭐

**Via Dashboard (Easiest):**
1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **Create application**
3. Select **"Pages"** tab
4. Click **"Drag and drop your files"** → **"Get started"**
5. Enter Project name: `deepmine-ai`
6. Upload ALL files from the `/home/user/webapp/dist/` folder:
   - `_worker.js`
   - `_routes.json`
   - `static/app.js`
   - `static/styles.css`
   - `static/Deepmineai-start.pdf`
7. Click **"Deploy"**

**Via CLI (Alternative):**
```bash
cd /home/user/webapp

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name deepmine-ai
```

This will give you a URL like: `deepmine-ai.pages.dev`

---

### **Step 2: Create D1 Database** ⭐

**Via Dashboard:**
1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **D1 SQL Database**
3. Click **"Create database"**
4. Database name: `deepmine-production`
5. Click **"Create"**
6. **IMPORTANT:** Copy the Database ID (looks like: `12345678-1234-1234-1234-123456789abc`)

---

### **Step 3: Apply Database Migrations**

**Via Dashboard Console:**
1. Go to your `deepmine-production` database
2. Click **"Console"** tab
3. Copy the SQL below and paste it:

```sql
-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unique_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  access_code TEXT NOT NULL DEFAULT 'FIO3081',
  signup_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  email_sent INTEGER DEFAULT 0,
  ip_address TEXT,
  user_agent TEXT
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_signup_date ON registrations(signup_date);
CREATE INDEX IF NOT EXISTS idx_registrations_unique_code ON registrations(unique_code);
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
```

4. Click **"Execute"**

---

### **Step 4: Bind Database to Pages Project**

1. Go to your **deepmine-ai** Pages project
2. Click **"Settings"** → **"Functions"**
3. Scroll to **"D1 database bindings"**
4. Click **"Add binding"**
5. Variable name: `DB`
6. Select database: `deepmine-production`
7. Click **"Save"**

---

### **Step 5: Connect Custom Domain** ⭐

1. In your **deepmine-ai** project
2. Go to **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Enter: `www.deepmineai.vip`
5. Click **"Continue"**
6. Cloudflare will automatically configure DNS
7. Wait 5-10 minutes for DNS propagation

**Verify DNS:**
- Go to **DNS** tab for `deepmineai.vip` domain
- Should see CNAME record:
  - Name: `www`
  - Target: Points to Cloudflare Pages
  - Proxied: ✅ Enabled (orange cloud)

---

### **Step 6: Verify Deployment**

1. **Test Pages URL:**
   - Visit: `https://deepmine-ai.pages.dev`
   - Should see your main website

2. **Test Custom Domain:**
   - Visit: `https://www.deepmineai.vip`
   - Should see your website

3. **Test Landing Page:**
   - Visit: `https://www.deepmineai.vip/join`
   - Register a test account

4. **Test Admin Dashboard:**
   - Visit: `https://www.deepmineai.vip/admin`
   - Login: `admin` / `deepmine2025`
   - Should see registrations

---

## 🔧 Troubleshooting

### Database Not Working?
- Check D1 binding is configured correctly
- Verify database ID in Settings → Functions → D1 bindings
- Ensure migrations were executed successfully

### Domain Not Working?
- Wait 5-10 minutes for DNS propagation
- Check DNS settings in Cloudflare dashboard
- Ensure domain is proxied (orange cloud)

### 404 Errors?
- Check all files uploaded correctly
- Verify `_worker.js` and `_routes.json` are present

---

## 📊 Expected Results

**After successful deployment:**

✅ Main Website: `https://www.deepmineai.vip`
✅ Join Page: `https://www.deepmineai.vip/join`
✅ Admin Dashboard: `https://www.deepmineai.vip/admin`
✅ Terms Page: `https://www.deepmineai.vip/terms`

**Admin Credentials:**
- Username: `admin`
- Password: `deepmine2025`

**Access Code for Users:**
- Code: `FIO3081`

---

## 📁 Files Being Deployed

```
dist/
├── _worker.js          # 122KB - Main Hono application
├── _routes.json        # Routing configuration
└── static/
    ├── app.js          # Frontend JavaScript
    ├── styles.css      # Complete CSS (85% compressed)
    └── Deepmineai-start.pdf  # Getting started guide (155KB)
```

---

## 🎯 Post-Deployment Checklist

- [ ] Website loads at custom domain
- [ ] Join page accepts registrations
- [ ] Database stores user data
- [ ] Admin dashboard shows registrations
- [ ] Delete function works
- [ ] CSV export works
- [ ] PDF download works
- [ ] All 10 mining servers display correctly
- [ ] Terms page accessible

---

## 🆘 Need Help?

If you encounter any issues:
1. Check Cloudflare Pages deployment logs
2. Verify D1 database binding
3. Check browser console for JavaScript errors
4. Verify DNS settings

---

**Last Updated:** 2025-11-12  
**Deployment Method:** Cloudflare Pages (Direct Upload)  
**Database:** Cloudflare D1 (Manual Setup Required)
