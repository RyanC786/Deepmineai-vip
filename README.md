# DeepMine AI - Complete Platform with CRM

A modern, futuristic platform combining AI and cloud mining for effortless daily crypto profits, with integrated email capture landing page and CRM backend.

## 🌐 Live URLs

- **Sandbox Development**: https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai
- **Main Website**: `/`
- **Join Landing Page**: `/join`
- **Admin CRM Dashboard**: `/admin`
- **Terms of Service**: `/terms`
- **Production**: (Deploy using `npm run deploy:prod`)

## ✨ Completed Features

### 🚀 NEW: CRM & Landing Page System

#### Landing Page (`/join`)
- **Modern Sign-up Form**
  - Full Name field with validation
  - Email field with real-time validation
  - Responsive, mobile-optimized design
  - Instant feedback on submission
  - Success/error message displays
  
- **Features Display**
  - Instant account activation
  - Secure and encrypted
  - Access code: FIO3081 highlighted
  
- **Backend Integration**
  - D1 Database storage for all registrations
  - Unique code generation per user
  - Automatic access code assignment (FIO3081)
  - Timestamp tracking for all sign-ups

#### Automated Email System
- **Web3Forms Integration**
  - Automated welcome emails on registration
  - Personalized with user's name and unique code
  - Includes access code: FIO3081
  - Login link: https://deepseek888.vip/web/index.html#/pages/login/login
  - **PDF attachment**: Deepmineai-start.pdf (getting started guide)
  - Professional HTML email template
  
- **Email Content**
  - Welcome message with branding
  - User's unique registration code
  - Access instructions and next steps
  - Contact information (email, Instagram, TikTok)

#### Admin CRM Dashboard (`/admin`)
- **Secure Login**
  - Username: `admin`
  - Password: `deepmine2025`
  - Session-based authentication
  
- **Dashboard Features**
  - **Statistics Overview**
    - Total registrations count
    - Today's registrations
    - Emails sent counter
  
  - **User Management Table**
    - Sortable columns (ID, Code, Name, Email, Date, Status)
    - Real-time search by name or email
    - Status badges (Email Sent, Pending)
    - Displays all registration data
  
  - **Export Functionality**
    - One-click CSV export
    - Includes all user data
    - Formatted for Excel/Google Sheets
  
  - **Actions**
    - Refresh data button
    - Export CSV button
    - Logout functionality

#### Database Schema (D1 - SQLite)
- **registrations table**
  - `id`: Auto-increment primary key
  - `unique_code`: Unique identifier for each user
  - `full_name`: User's full name
  - `email`: User's email (unique)
  - `access_code`: Default "FIO3081"
  - `signup_date`: Timestamp of registration
  - `email_sent`: Email delivery status (0/1)
  - `ip_address`: Optional IP tracking
  - `user_agent`: Optional browser info
  
- **admin_users table**
  - For future admin user management
  - Password hashing support

#### API Endpoints

##### Public APIs
- `POST /api/register` - User registration
  - Body: `{ fullName, email }`
  - Returns: `{ success, message, uniqueCode }`
  - Validates email format
  - Prevents duplicate emails
  - Generates unique codes

##### Admin APIs (Protected)
- `POST /api/admin/login` - Admin authentication
  - Body: `{ username, password }`
  - Returns: `{ success, token }`
  
- `GET /api/admin/registrations` - Fetch all registrations
  - Returns: `{ success, registrations: [] }`
  - Sorted by signup date (newest first)
  
- `GET /api/admin/export` - Export to CSV
  - Returns: CSV file download
  - Filename: registrations.csv

### 🎨 Main Website Features

#### Brand Identity & Design
- **Futuristic Theme**: Deep navy background with galaxy purple particles
- **Brand Colors**: Primary Blue (#2979FF), Aqua Glow (#33F0FF), Violet Gradient (#7B61FF)
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Smooth Animations**: Floating cards, particle effects, and hover interactions
- **Hero Video**: Vimeo background video with overlay and z-index layering

#### Website Sections

1. **Hero Section**
   - Dynamic call-to-action with invitation code **FIO3081**
   - Vimeo background video
   - Animated particle background
   - Key stats display (33.7M active miners, 1.5M machines, 157 countries)
   - Floating feature cards

2. **About DeepMine AI**
   - Mission statement and platform overview
   - Feature highlights with icons
   - Live statistics grid

3. **How It Works**
   - 6-step process visualization
   - Interactive profit calculator (updated: removed "Total Return", only shows "Total Profit")
   - Real-time earnings projection
   - **Minimum investment updated to $500**

4. **AI Technology**
   - 4 AI optimization features explained
   - Predictive market analysis
   - Automatic pool selection
   - Smart power management
   - Hardware health monitoring

5. **Mining Servers** (10 Real Servers)
   - **H800 8400G** - $50,000 (990M/d, 180 days)
   - **H800 6400G** - $30,000 (546M/d, 180 days)
   - **H800 320G** - $11,000 (168M/d, 180 days)
   - **H200 120G** - $7,000 (108M/d, 180 days)
   - **H200 84G** - $5,000 (88M/d, 180 days)
   - **A100 96G** - $2,000 (38M/d, 180 days)
   - **A100 72G** - $1,500 (28M/d, 180 days)
   - **A100 48G** - $1,000 (18M/d, 180 days)
   - **RTX 4090 24G (East)** - $500 (8M/d, 180 days)
   - **RTX 4090 24G (South)** - $500 (8M/d, 180 days)
   - 5-column grid layout
   - Flexbox-aligned pricing

6. **Daily Check-in Bonus**
   - $1 bonus before 5:00 PM (UK time)
   - Prominent box with calendar icon
   - Blue glowing border

7. **Referral Program**
   - 10% direct referral commission
   - 5% second-level commission
   - Interactive referral calculator
   - 4-step earning process

8. **Transparency & Security**
   - Bank-level security (256-bit SSL)
   - Daily records and reporting
   - Easy withdrawals
   - 24/7 support
   - Verified operations

9. **Contact Section**
   - Email: info@deepmineai.vip (redirects to deepmineai25@gmail.com)
   - Instagram: @deepmineai
   - TikTok: @deepmineai1
   - **Web3Forms integration** for contact submissions
   - Web3Forms Access Key: fed24453-8693-4111-b33d-dafd654c6571

10. **Terms of Service** (`/terms`)
    - Comprehensive 18-section legal document
    - **Highlighted transparency policy**: Server lock-in requirement
    - No withdrawal during contract period (e.g., days 1-179 for 180-day contract)
    - Full details on services, risks, and user obligations

### 🔧 Interactive Features

- **Profit Calculator**: Real-time calculation (daily profit, total profit only)
- **Referral Calculator**: Calculates earnings from direct and indirect referrals
- **Smooth Scrolling**: One-page navigation with smooth scroll effects
- **Floating CTA**: Sticky call-to-action button appearing on scroll
- **Code Copy**: Click any invitation code badge to copy to clipboard
- **Mobile Menu**: Responsive hamburger menu for mobile devices
- **Form Handling**: Web3Forms for contact and registration
- **Scroll Animations**: Elements fade in as you scroll
- **Logo Transparency**: mix-blend-mode: screen for transparent black backgrounds

## 📊 Functional URIs & API Endpoints

### Main Routes
- `GET /` - Homepage with all sections
- `GET /join` - Landing page with registration form
- `GET /register` - User registration page (Phase 2)
- `GET /login` - User login page (Phase 2)
- `GET /kyc` - KYC verification page (Phase 3 - requires auth)
- `GET /admin` - CRM admin dashboard (requires login)
- `GET /admin/kyc` - Admin KYC management (Phase 3 - requires admin)
- `GET /terms` - Terms of Service page
- `GET /static/styles.css` - Futuristic CSS theme (compact footer)
- `GET /static/app.js` - Interactive JavaScript
- `GET /static/Deepmineai-start.pdf` - Getting started guide (attached to emails)

### Authentication API (Phase 2)
- `POST /api/auth/register` - User registration
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "referredByCode": "DM1234567890ABC" // optional
  }
  ```

- `POST /api/auth/verify-email` - Email verification
  ```json
  {
    "email": "john@example.com",
    "code": "123456"
  }
  ```

- `POST /api/auth/login` - User login
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123",
    "rememberMe": true
  }
  ```

- `POST /api/auth/logout` - Logout (clears cookie)

- `GET /api/auth/me` - Get current user (requires auth)

- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### KYC API (Phase 3)
- `POST /api/kyc/init` - Initialize KYC with iDenfy (requires auth)
- `GET /api/kyc/status` - Check KYC status (requires auth)
- `POST /api/kyc/webhook` - iDenfy webhook (system)
- `GET /api/admin/kyc/submissions?status=all` - List submissions (admin)
- `POST /api/admin/kyc/:id/approve` - Approve KYC (admin)
- `POST /api/admin/kyc/:id/reject` - Reject KYC (admin)
- `GET /api/kyc/file/:key` - Download document (admin)

### Legacy CRM API (Phase 1)
- `POST /api/register` - Early registration (legacy)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/registrations` - Fetch all registrations
- `GET /api/admin/export` - CSV export

## ✨ Phase 2: Authentication System - COMPLETE

### User Authentication (`/register`, `/login`)
- **Registration Page**
  - Full name, email, password validation
  - Password strength requirements (8+ chars, uppercase, lowercase, numbers)
  - Referral code support (optional during registration)
  - Auto-generates unique referral code per user (format: DM<timestamp><random>)
  - Email verification with 6-digit code
  - Integration with Resend for email delivery

- **Login Page**
  - Email/password authentication
  - JWT-based session management with HTTP-only cookies
  - Remember me functionality (30 days vs 7 days session)
  - Forgot password flow with email reset token
  - Auto-redirect to dashboard after successful login

### Authentication API Endpoints
- `POST /api/auth/register` - User registration with referral support
- `POST /api/auth/verify-email` - Verify email with 6-digit code
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/login` - Login with JWT session
- `POST /api/auth/logout` - Clear auth cookie
- `POST /api/auth/forgot-password` - Generate password reset token
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current authenticated user

### Security Features
- bcrypt password hashing (10 rounds)
- JWT tokens with secure cookie storage
- Email verification required before login
- Password reset tokens with expiry
- Protected routes with authentication middleware
- Rate limiting ready for implementation

## ✨ Phase 3: KYC Verification System - COMPLETE (iDenfy Integration)

### User KYC Submission (`/kyc`)
- **iDenfy iframe SDK Integration**
  - Real-time document verification interface
  - Support for 4 document types:
    - Government ID (passport, driver's license, ID card)
    - Residence permit
    - Selfie verification
    - Liveness detection
  - Mobile-responsive dark theme design
  - Automatic status tracking
  - Session events: IDENFY_SUCCESS, IDENFY_ERROR, IDENFY_EXIT
  
- **Status Dashboard**
  - Real-time KYC status display
  - Status badges: pending, reviewing, approved, rejected
  - Submission timestamp tracking
  - Rejection reason display if applicable
  - Refresh status functionality

### Admin KYC Management (`/admin/kyc`)
- **Statistics Dashboard**
  - Pending review count
  - Under review count
  - Approved submissions count
  - Rejected submissions count
  
- **Submissions Management**
  - Filterable table (all, pending, reviewing, approved, rejected)
  - Search by name or email
  - User information display
  - iDenfy status sync
  - Submission date tracking
  
- **Review Actions**
  - Approve KYC submissions
  - Reject with detailed reason
  - Document viewing via iDenfy dashboard
  - Admin action logging
  - Real-time updates

### KYC API Endpoints

#### User Endpoints
- `POST /api/kyc/init` - Initialize KYC verification with iDenfy
  - Creates iDenfy verification token
  - Generates iframe auth token
  - Creates kyc_submission record
  - Returns: scanRef, authToken
  
- `GET /api/kyc/status` - Check current KYC status
  - Returns: status, submission details, timestamps

#### System Endpoints
- `POST /api/kyc/webhook` - iDenfy webhook handler
  - HMAC-SHA256 signature verification (optional)
  - Auto-updates submission status
  - Syncs with iDenfy platform
  - Handles: APPROVED, DENIED, REJECTED, REVIEWING, PENDING

#### Admin Endpoints (Protected)
- `GET /api/admin/kyc/submissions?status=all|pending|approved|rejected` - List submissions
- `POST /api/admin/kyc/:id/approve` - Approve submission
- `POST /api/admin/kyc/:id/reject` - Reject with reason
- `GET /api/kyc/file/:key` - Download KYC document from R2

### Cloudflare R2 Integration
- Document storage bucket: `deepmine-kyc-documents`
- File organization: `kyc-submissions/user-{id}/{type}-{timestamp}.{ext}`
- Supported formats: JPEG, PNG, WebP, PDF
- File size limit: 10MB per document
- Secure R2 bucket with proper CORS configuration
- **Status**: ✅ Bucket created and configured

### iDenfy Integration
- **API Key**: nqvo52FWIrK
- **Webhook URL**: https://www.deepmineai.vip/api/kyc/webhook
- Automated KYC verification service
- Webhook integration for status updates
- iframe-based verification flow (https://ivs.idenfy.com/)
- Token management with 24-hour expiry
- Status mapping: PENDING → REVIEWING → APPROVED/DENIED/REJECTED
- **Cost**: ~$0.40-$1.00 per verification (50-70% cheaper than Sumsub)

### Database Schema Updates (Phase 3)
- **kyc_submissions** - KYC submission records
  - Added columns: `scan_ref` (iDenfy scan reference), `auth_token` (verification token)
  - Indexes: `idx_kyc_scan_ref`, `idx_kyc_user_status`
- **kyc_documents** - Document metadata and R2 keys
- **admin_logs** - Admin action audit trail

## 🚀 Features Not Yet Implemented

### Phase 4-15 (Upcoming)
- [ ] USDT Payment Integration (NOWPayments)
- [ ] Mining Packages Catalog & Purchase Flow
- [ ] User Dashboard (contracts, earnings, transactions)
- [ ] Daily Check-in System ($1 bonus before 5 PM UK)
- [ ] Withdrawal System (USDT with admin approval)
- [ ] Referral Program (tracking & commission)
- [ ] Enhanced Admin Panel (financial reports)
- [ ] Production Cloudflare D1 database setup
- [ ] Production R2 bucket creation
- [ ] Sumsub account setup and credentials
- [ ] Rate limiting on all endpoints
- [ ] CAPTCHA for registration

## 📈 Recommended Next Steps

### 1. Production Deployment
```bash
# Set up Cloudflare API token first
npm run deploy:prod

# Create production D1 database
npx wrangler d1 create webapp-production

# Update wrangler.jsonc with production database_id

# Apply migrations to production
npm run db:migrate:prod

# Redeploy with database
npm run deploy:prod
```

### 2. Security Enhancements
- Implement JWT authentication for admin
- Add bcrypt password hashing for admin users
- Set up rate limiting (10 requests/minute per IP)
- Add CAPTCHA to registration form (hCaptcha or Turnstile)
- Enable CSRF protection
- Set up environment variables for sensitive data

### 3. Email System Improvements
- Track email delivery status in database
- Set up bounce handling
- Add email template editor in admin panel
- Support multiple email templates (welcome, verification, etc.)
- Add unsubscribe functionality

### 4. CRM Enhancements
- Add pagination for large datasets
- Advanced filtering (date range, email status, etc.)
- Bulk actions (delete, resend email, etc.)
- User detail view with activity log
- Email preview before sending
- Analytics dashboard with charts
- Export to Excel (XLSX) format

### 5. User Experience
- Email verification flow
- Password reset functionality
- Multi-language support
- Dark/light theme toggle
- Mobile app version
- Push notifications

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Hono (Lightweight Web Framework)
- **Database**: Cloudflare D1 (SQLite-based)
- **Runtime**: Cloudflare Workers/Pages
- **Build Tool**: Vite
- **Deployment**: Wrangler CLI
- **Email Service**: Web3Forms
- **Process Manager**: PM2 (development)
- **Fonts**: Google Fonts (Inter)
- **Icons**: Font Awesome 6.4.0

## 💻 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- PM2 (pre-installed in sandbox)
- Cloudflare account (for production deployment)
- Web3Forms account (for email functionality)

### Installation
```bash
cd /home/user/webapp
npm install
```

### Database Setup
```bash
# Apply migrations to local database
npm run db:migrate:local

# Check database
npx wrangler d1 execute webapp-production --local --command="SELECT * FROM registrations"
```

### Local Development
```bash
# Build the project first
npm run build

# Start development server with PM2 (includes D1 database)
pm2 start ecosystem.config.cjs

# Or use npm script
npm run dev:sandbox

# Check server status
pm2 list

# View logs
pm2 logs deepmine-ai --nostream

# Test the server
curl http://localhost:3000
curl http://localhost:3000/join
curl http://localhost:3000/admin
```

### Testing Registration Flow
```bash
# Test registration API
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Test User", "email": "test@example.com"}'

# Test admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "deepmine2025"}'

# Fetch registrations
curl http://localhost:3000/api/admin/registrations
```

### Build for Production
```bash
npm run build
```

### Deploy to Cloudflare Pages
```bash
# Setup Cloudflare API key first
# Then deploy
npm run deploy:prod

# Or manual deployment
npx wrangler pages deploy dist --project-name webapp

# Apply database migrations to production
npm run db:migrate:prod
```

## 📁 Project Structure

```
webapp/
├── src/
│   └── index.tsx           # Main Hono application with all routes
├── public/
│   └── static/
│       ├── styles.css      # Futuristic theme CSS (compact footer)
│       ├── app.js          # Interactive JavaScript
│       └── Deepmineai-start.pdf  # Getting started guide
├── migrations/
│   └── 0001_create_registrations.sql  # Database schema
├── dist/                   # Build output
├── .wrangler/              # Local D1 database storage
│   └── state/v3/d1/        # Local SQLite files
├── logs/                   # PM2 logs
├── .git/                   # Git repository
├── .gitignore              # Git ignore rules
├── ecosystem.config.cjs    # PM2 configuration (with D1 flag)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite build config
├── wrangler.jsonc          # Cloudflare config (D1 binding)
└── README.md               # This file
```

## 🎨 Design System

### Colors
- **Primary Blue**: #2979FF
- **Aqua Glow**: #33F0FF
- **Violet Gradient**: #7B61FF
- **Deep Navy Background**: #0B0F1E
- **Galaxy Purple**: #9E4DFF
- **Soft Cyan Highlight**: #52E5E7

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 700-800 weight
- **Body**: Regular, 400 weight
- **Code/Numbers**: Courier New (monospace)

### UI Elements
- **Border Radius**: 12px (buttons), 16-24px (cards)
- **Shadows**: Glowing effects with brand colors
- **Transitions**: 0.3s ease for all interactions
- **Gradients**: Linear gradients combining blue, violet, and cyan

## 🗄️ Database Schema

### registrations
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| unique_code | TEXT | Unique registration code (e.g., DM1762952589276SSQKV) |
| full_name | TEXT | User's full name |
| email | TEXT | User's email (unique) |
| access_code | TEXT | Access code (default: FIO3081) |
| signup_date | DATETIME | Timestamp of registration |
| email_sent | INTEGER | Email status (0=pending, 1=sent) |
| ip_address | TEXT | Optional IP tracking |
| user_agent | TEXT | Optional browser info |

### admin_users
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| username | TEXT | Admin username (unique) |
| password_hash | TEXT | Hashed password |
| email | TEXT | Admin email |
| created_at | DATETIME | Account creation timestamp |
| last_login | DATETIME | Last login timestamp |

## 🔐 Admin Credentials

**Default Admin Login:**
- **Username**: `admin`
- **Password**: `deepmine2025`

⚠️ **IMPORTANT**: Change these credentials before production deployment!

## 📧 Email Configuration

**Web3Forms Setup:**
- Access Key: `fed24453-8693-4111-b33d-dafd654c6571`
- Delivery Email: `deepmineai25@gmail.com`
- PDF Attachment: `/static/Deepmineai-start.pdf`
- Login Link: `https://deepseek888.vip/web/index.html#/pages/login/login`

## 🔐 Security Features

- SSL/TLS encryption (Cloudflare)
- CORS configuration
- Input validation (email format, required fields)
- XSS protection (framework level)
- SQL injection prevention (prepared statements)
- Duplicate email prevention
- Rate limiting ready for implementation
- CAPTCHA ready for implementation

## 📞 Contact & Support

- **Email**: info@deepmineai.vip → deepmineai25@gmail.com
- **Instagram**: https://instagram.com/deepmineai
- **TikTok**: https://tiktok.com/@deepmineai1

## 🎯 Invitation Code

Use code **FIO3081** when registering for exclusive benefits!

## 📄 License

© 2025 DeepMine AI. All rights reserved.

---

**Last Updated**: 2025-12-01  
**Status**: ✅ Phase 3 Complete - iDenfy KYC System Deployed  
**Deployment Status**: 🟢 Production LIVE at www.deepmineai.vip | 🟢 iDenfy Integration Active

## 🎉 Summary of Deliverables

### ✅ Phase 1: Landing Page & CRM (Complete)
1. ✅ Professional landing page at `/join` with form validation
2. ✅ D1 Database with migrations and schema
3. ✅ User registration API with unique code generation
4. ✅ Automated email system with PDF attachment (Web3Forms)
5. ✅ Admin CRM dashboard at `/admin` with authentication
6. ✅ Sortable, searchable data table
7. ✅ CSV export functionality
8. ✅ Statistics dashboard (total, today, emails sent)
9. ✅ Complete API documentation
10. ✅ Local development with PM2 and D1 --local mode
11. ✅ PDF getting started guide downloaded and served
12. ✅ Responsive design for all screen sizes

### ✅ Phase 2: Authentication System (Complete)
1. ✅ User registration page (`/register`) with password validation
2. ✅ Email verification system with 6-digit codes
3. ✅ Login page (`/login`) with JWT authentication
4. ✅ Password reset flow with email tokens
5. ✅ Referral code system (auto-generated per user)
6. ✅ Resend email integration for all communications
7. ✅ Protected routes with authentication middleware
8. ✅ bcrypt password hashing
9. ✅ HTTP-only cookie sessions
10. ✅ Remember me functionality

### ✅ Phase 3: KYC Verification System (Complete - iDenfy)
1. ✅ User KYC submission page (`/kyc`) with iDenfy iframe SDK
2. ✅ Admin KYC management panel (`/admin/kyc`)
3. ✅ Cloudflare R2 document storage integration (bucket created)
4. ✅ iDenfy automated verification integration
5. ✅ HMAC-SHA256 webhook signature verification
6. ✅ Real-time status tracking (pending/reviewing/approved/rejected)
7. ✅ Admin approve/reject with reason tracking
8. ✅ Statistics dashboard for submissions
9. ✅ Filterable submissions table with search
10. ✅ Document upload with validation (JPEG, PNG, WebP, PDF)
11. ✅ Complete KYC API backend (8 endpoints)
12. ✅ Admin action logging in database
13. ✅ Production deployment with iDenfy credentials
14. ✅ Database migration applied (scan_ref, auth_token columns)

### ✅ Production Deployment Status
**iDenfy Integration - COMPLETE:**
1. ✅ Cloudflare R2 bucket created: `deepmine-kyc-documents`
   - Bucket URL: https://1f5f9792a91d879d0fb5ca5630565c1d.r2.cloudflarestorage.com/
   - Workers binding configured
   - No custom domain needed (internal access)

2. ✅ iDenfy credentials configured:
   - API Key: nqvo52FWIrK
   - API Secret: 3GudBmfSkJhbwWZ8VAeas
   - Webhook URL: https://www.deepmineai.vip/api/kyc/webhook
   - Webhook Name: "Deepmine ai ashbook"
   - Event Type: ID VERIFICATION

3. ✅ Production secrets set:
   ```bash
   ✅ IDENFY_API_KEY
   ✅ IDENFY_API_SECRET
   ✅ RESEND_API_KEY
   ✅ JWT_SECRET
   ```

4. ✅ R2 bucket binding enabled in `wrangler.jsonc`

5. ✅ Deployed to production:
   - URL: https://www.deepmineai.vip
   - Latest deployment: https://08110732.deepmine-ai.pages.dev

### 🚀 Next Phases (4-15)
- **Phase 4**: USDT Payment Integration (NOWPayments API)
- **Phase 5**: Mining Packages (catalog, cart, purchase flow)
- **Phase 6**: User Dashboard (contracts, earnings, transactions)
- **Phase 7**: Daily Check-in System ($1 bonus)
- **Phase 8**: Withdrawal System (USDT with admin approval)
- **Phase 9**: Referral Program (tracking & commissions)
- **Phase 10**: Enhanced Admin Panel (reports, analytics)
- **Phases 11-15**: Additional features, testing, optimization

## Recent Updates

### ✅ Email Verification Improvements (2025-12-01)
**Issue:** Verification email was missing "Go to verification page" link
**Solution:** 
- Created dedicated `/verify-email` page with 6-digit code input interface
- Updated verification email template to include prominent "Go to Verification Page" button
- Email now contains both the 6-digit code AND a direct link: `https://www.deepmineai.vip/verify-email?email={user_email}`
- Users can either:
  1. Click the button in email to open verification page automatically
  2. Manually enter the 6-digit code on the verification page
  3. Copy/paste the verification URL from email

**Email Content:**
- Subject: "Verify Your Email - DeepMine AI"
- From: `noreply@deepmineai.vip`
- Contains: 6-digit code + "Go to Verification Page" button + URL fallback
- Expires: 24 hours

**Verification Flow:**
1. User registers → receives email with code and link
2. User clicks "Go to Verification Page" button in email
3. Opens `/verify-email?email={email}` page
4. Enters 6-digit code from email
5. System verifies code → redirects to login page
6. User can now login and access platform

