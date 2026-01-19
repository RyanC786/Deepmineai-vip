# 🏗️ DeepMine AI - Complete Platform Build Plan

## 🎯 Project Overview

Building a full-featured cryptocurrency mining platform with:
- USDT payment processing (TRC20/ERC20)
- Automated KYC verification
- Manual earnings distribution (preparing for real mining API)
- Complete user dashboard and admin panel
- Referral program and daily bonuses

---

## 💰 Technology Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| **Frontend** | Vanilla JS + TailwindCSS | Lightweight, fast |
| **Backend** | Hono Framework | Edge-optimized for Cloudflare |
| **Database** | Cloudflare D1 (SQLite) | Globally distributed |
| **Storage** | Cloudflare R2 | S3-compatible for KYC docs |
| **Email** | Resend (free tier initially) | 3,000 emails/month |
| **Payments** | NOWPayments (USDT) | 0.5% fee, TRC20/ERC20 support |
| **KYC** | Sumsub or Onfido | ~$1-3 per verification |
| **Hosting** | Cloudflare Pages | Free tier, global CDN |

---

## 📊 Database Schema

### Tables Created:

1. **users** - User accounts with wallet balance, referral codes
2. **kyc_submissions** - KYC documents and verification status
3. **mining_packages** - 10 mining server models (H800, H200, A100, RTX 4090, etc.)
4. **user_contracts** - Purchased mining contracts
5. **daily_earnings** - Daily profit distributions
6. **transactions** - All financial movements
7. **withdrawals** - USDT withdrawal requests
8. **referrals** - Referral relationship tracking
9. **referral_commissions** - Commission calculations
10. **daily_checkins** - Check-in bonus tracking
11. **admin_users** - Admin account management
12. **admin_logs** - Admin activity audit trail
13. **system_settings** - Platform configuration
14. **payment_webhooks** - USDT payment webhook logs

### 10 Mining Packages Seeded:

1. NVIDIA H800 - 0.8% daily return
2. NVIDIA H200 - 0.9% daily return
3. NVIDIA A100 80GB - 0.75% daily return
4. NVIDIA A100 40GB - 0.7% daily return
5. RTX 4090 - 0.65% daily return
6. RTX 4080 - 0.6% daily return
7. RTX 4070 Ti - 0.55% daily return
8. NVIDIA L40 - 0.72% daily return
9. AMD MI250X - 0.77% daily return
10. Antminer S19 Pro - 0.5% daily return

---

## 🚀 Build Phases

### ✅ Phase 1: Database Schema (COMPLETED)
- [x] Complete database design
- [x] Migration files created
- [x] Seed data for mining packages
- [x] Indexes for performance

### 📝 Phase 2: User Authentication (NEXT)
**Estimated Time:** 2-3 days

**Features:**
- Registration with email verification
- Login/logout with JWT sessions
- Password hashing (bcrypt)
- Password reset flow
- Email verification via Resend
- Session management

**API Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

**Pages:**
- `/register` - Registration form
- `/login` - Login form
- `/verify-email` - Email verification
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Password reset form

---

### 📝 Phase 3: KYC System
**Estimated Time:** 3-4 days

**Features:**
- File upload to Cloudflare R2
- Integration with Sumsub or Onfido
- Document verification (ID front/back, selfie, proof of address)
- Admin review and approval workflow
- Rejection with reasons
- Resubmission capability

**API Endpoints:**
- `POST /api/kyc/upload` - Upload documents to R2
- `POST /api/kyc/submit` - Submit KYC application
- `GET /api/kyc/status` - Check KYC status
- `POST /api/admin/kyc/:id/approve` - Admin approve
- `POST /api/admin/kyc/:id/reject` - Admin reject

**Pages:**
- `/dashboard/kyc` - KYC submission form
- `/admin/kyc` - Admin KYC review panel

---

### 📝 Phase 4: USDT Payment Integration
**Estimated Time:** 4-5 days

**Features:**
- NOWPayments API integration
- USDT TRC20 and ERC20 support
- Payment invoice generation
- Webhook handling for payment confirmations
- Transaction tracking
- Payment status updates

**API Endpoints:**
- `POST /api/payments/create-invoice` - Create USDT payment
- `POST /api/payments/webhook` - NOWPayments webhook
- `GET /api/payments/status/:id` - Check payment status

**Configuration Needed:**
- NOWPayments API key
- Platform USDT wallet addresses
- Webhook URL configuration

---

### 📝 Phase 5: Mining Packages & Purchase
**Estimated Time:** 3-4 days

**Features:**
- Package catalog display
- Investment calculator
- Shopping cart (single package at a time)
- Contract purchase flow
- Payment integration
- Contract activation after payment

**API Endpoints:**
- `GET /api/packages` - List all packages
- `GET /api/packages/:id` - Get package details
- `POST /api/contracts/create` - Create contract (initiates payment)
- `GET /api/contracts/my-contracts` - User's contracts

**Pages:**
- `/packages` - Browse mining packages
- `/packages/:id` - Package details
- `/purchase/:packageId` - Purchase flow
- `/payment/:contractId` - Payment page

---

### 📝 Phase 6: User Dashboard
**Estimated Time:** 4-5 days

**Features:**
- Dashboard overview (stats, balance, contracts)
- Active contracts list
- Earnings history
- Transaction history
- Wallet balance display
- Profile management

**API Endpoints:**
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/earnings` - Earnings history
- `GET /api/dashboard/transactions` - Transaction history
- `PUT /api/user/profile` - Update profile

**Pages:**
- `/dashboard` - Main dashboard
- `/dashboard/contracts` - My contracts
- `/dashboard/earnings` - Earnings history
- `/dashboard/transactions` - Transaction log
- `/dashboard/profile` - Profile settings

---

### 📝 Phase 7: Daily Check-in System
**Estimated Time:** 1-2 days

**Features:**
- Daily check-in button
- $1 USDT bonus if before 5 PM UK time
- Streak tracking
- Check-in history
- Bonus crediting to wallet

**API Endpoints:**
- `POST /api/checkin` - Submit daily check-in
- `GET /api/checkin/status` - Today's check-in status
- `GET /api/checkin/history` - Check-in history

**Pages:**
- `/dashboard/checkin` - Check-in page

---

### 📝 Phase 8: Withdrawal System
**Estimated Time:** 3-4 days

**Features:**
- USDT withdrawal requests
- TRC20/ERC20 address validation
- Minimum withdrawal amount (configurable)
- Withdrawal fee calculation
- Admin approval workflow
- Transaction hash tracking
- Email notifications

**API Endpoints:**
- `POST /api/withdrawals/request` - Create withdrawal
- `GET /api/withdrawals/my-withdrawals` - User's withdrawals
- `POST /api/admin/withdrawals/:id/approve` - Admin approve
- `POST /api/admin/withdrawals/:id/reject` - Admin reject
- `POST /api/admin/withdrawals/:id/complete` - Mark as sent

**Pages:**
- `/dashboard/withdraw` - Withdrawal request form
- `/dashboard/withdrawals` - Withdrawal history
- `/admin/withdrawals` - Admin withdrawal management

---

### 📝 Phase 9: Referral Program
**Estimated Time:** 2-3 days

**Features:**
- Unique referral codes per user
- Referral link generation
- Tracking of referred users
- Commission calculation (5% default)
- Commission crediting
- Referral dashboard

**API Endpoints:**
- `GET /api/referrals/my-code` - Get user's referral code
- `GET /api/referrals/stats` - Referral statistics
- `GET /api/referrals/earnings` - Commission earnings

**Pages:**
- `/dashboard/referrals` - Referral dashboard
- `/register?ref=CODE` - Registration with referral

---

### 📝 Phase 10: Admin Panel
**Estimated Time:** 5-6 days

**Features:**
- User management (view, suspend, activate)
- KYC approval workflow
- Contract management
- Manual earnings distribution
- Withdrawal approval
- Financial reports
- System settings
- Admin activity logs

**API Endpoints:**
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - User details
- `POST /api/admin/users/:id/suspend` - Suspend user
- `POST /api/admin/earnings/distribute` - Distribute earnings
- `GET /api/admin/reports/financial` - Financial reports
- `PUT /api/admin/settings` - Update system settings

**Pages:**
- `/admin` - Admin dashboard (current)
- `/admin/users` - User management
- `/admin/kyc` - KYC approvals
- `/admin/contracts` - Contract management
- `/admin/earnings` - Earnings distribution
- `/admin/withdrawals` - Withdrawal approvals
- `/admin/settings` - System configuration
- `/admin/reports` - Financial reports

---

### 📝 Phase 11: Cloudflare R2 Setup
**Estimated Time:** 1-2 days

**Features:**
- R2 bucket creation
- Upload API endpoints
- File access control
- Signed URL generation
- File deletion

**Configuration:**
- R2 bucket name
- R2 API credentials
- CORS configuration

---

### 📝 Phase 12: Email System (Resend)
**Estimated Time:** 2 days

**Features:**
- Email verification emails
- Welcome emails
- Password reset emails
- Withdrawal confirmation emails
- Contract purchase confirmations
- KYC status notifications
- Admin alerts

**Templates Needed:**
- Email verification
- Welcome email
- Password reset
- Withdrawal request
- Withdrawal approved
- Contract activated
- KYC approved/rejected

---

### 📝 Phase 13: Security & Validation
**Estimated Time:** 3-4 days

**Features:**
- Input sanitization and validation
- SQL injection prevention (prepared statements)
- XSS protection
- CSRF token implementation
- Rate limiting (login attempts, API calls)
- Password strength requirements
- Session security
- Admin action logging
- HTTPS enforcement

---

### 📝 Phase 14: Testing & Bug Fixes
**Estimated Time:** 4-5 days

**Testing:**
- Registration flow
- Login/logout
- KYC submission and approval
- Package purchase with USDT payment
- Contract activation
- Earnings distribution
- Withdrawal request and approval
- Referral tracking
- Check-in system
- Admin panel operations
- Email delivery
- Payment webhooks
- Security testing

---

### 📝 Phase 15: Production Deployment
**Estimated Time:** 2-3 days

**Tasks:**
- Apply all migrations to production D1
- Configure environment variables
- Set up Resend API key
- Configure NOWPayments
- Set up Sumsub/Onfido
- Configure R2 bucket
- Set platform wallet addresses
- DNS configuration
- SSL verification
- Final testing on production
- Enable maintenance mode toggle
- Go live!

---

## 🔐 Environment Variables Needed

```bash
# Database (Cloudflare D1)
# Configured in wrangler.jsonc

# R2 Storage
R2_BUCKET_NAME=deepmine-kyc-docs
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key

# Resend Email
RESEND_API_KEY=re_xxxxx

# NOWPayments (USDT)
NOWPAYMENTS_API_KEY=your-api-key
NOWPAYMENTS_IPN_SECRET=your-webhook-secret

# Sumsub KYC (or Onfido)
SUMSUB_APP_TOKEN=your-app-token
SUMSUB_SECRET_KEY=your-secret-key
SUMSUB_WEBHOOK_SECRET=your-webhook-secret

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Platform Settings
PLATFORM_USDT_TRC20_WALLET=your-trc20-wallet
PLATFORM_USDT_ERC20_WALLET=your-erc20-wallet

# URLs
FRONTEND_URL=https://www.deepmineai.vip
API_BASE_URL=https://www.deepmineai.vip/api
```

---

## 📦 Required Third-Party Services Setup

### 1. NOWPayments (USDT Payments)
- Sign up: https://nowpayments.io
- Create API key
- Configure webhook URL
- Set up USDT (TRC20 & ERC20)
- Cost: 0.5% per transaction

### 2. Sumsub or Onfido (KYC)
- **Sumsub**: https://sumsub.com (Recommended - better pricing)
  - ~$1-2 per verification
  - Supports 220+ countries
  - Webhook integration
  
- **Onfido**: https://onfido.com (Alternative)
  - ~$2-3 per verification
  - Premium quality
  - Excellent API

### 3. Resend (Email)
- Sign up: https://resend.com
- Verify domain (www.deepmineai.vip)
- Create API key
- Free tier: 3,000 emails/month
- Paid: $20/month for 50,000 emails

### 4. Cloudflare R2 (File Storage)
- Already have Cloudflare account
- Create R2 bucket in dashboard
- Generate R2 API tokens
- Free tier: 10GB storage

---

## 💵 Estimated Monthly Costs

| Service | Cost |
|---------|------|
| Cloudflare Pages | FREE |
| Cloudflare D1 | FREE (under 5GB) |
| Cloudflare R2 | FREE (under 10GB) |
| Resend Email | FREE initially ($20/month later) |
| NOWPayments | 0.5% per transaction |
| Sumsub KYC | $1-2 per user verification |
| **Total Fixed Costs** | ~$20/month + variable |

---

## 📈 Estimated Build Timeline

**Total Time: 6-8 weeks**

- Week 1-2: Authentication, KYC, R2 setup
- Week 3-4: USDT payments, mining packages, contracts
- Week 4-5: User dashboard, earnings, check-ins
- Week 5-6: Withdrawals, referrals, admin panel
- Week 6-7: Email system, security, testing
- Week 7-8: Bug fixes, final testing, deployment

**Aggressive Timeline (with full focus): 4-5 weeks**

---

## 🎯 Success Criteria

Before going live, all these must work:

1. ✅ User can register and verify email
2. ✅ User can complete KYC and get approved
3. ✅ User can browse mining packages
4. ✅ User can purchase contract with USDT
5. ✅ Contract activates after payment
6. ✅ Admin can distribute daily earnings
7. ✅ User can see earnings in dashboard
8. ✅ User can request withdrawal
9. ✅ Admin can approve and send withdrawal
10. ✅ Referral system tracks and pays commissions
11. ✅ Daily check-in works and credits bonus
12. ✅ All emails send correctly
13. ✅ Admin panel fully functional
14. ✅ Security measures in place
15. ✅ Mobile responsive

---

## 📞 Next Steps

**I'm ready to start building!**

Should I proceed with **Phase 2: User Authentication System**?

This includes:
- Complete registration with email verification
- Login/logout with JWT
- Password reset flow
- Session management
- Resend integration for emails

**Estimated time: 2-3 days of focused development**

Let me know if you want me to start, or if you have any questions about the plan!
