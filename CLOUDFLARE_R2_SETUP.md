# Cloudflare R2 Setup Guide for DeepMine AI

## 🗄️ Creating R2 Bucket

### Step 1: Create R2 Bucket

1. Go to Cloudflare Dashboard: https://dash.cloudflare.com
2. Navigate to **R2** in the left sidebar
3. Click **"Create bucket"**
4. **Bucket name:** `deepmine-kyc-documents`
5. **Location:** Automatic (Cloudflare will optimize)
6. Click **"Create bucket"**

### Step 2: Generate R2 API Tokens

1. In R2 page, click **"Manage R2 API Tokens"**
2. Click **"Create API token"**
3. **Token name:** `deepmine-kyc-upload`
4. **Permissions:** 
   - ✅ Object Read & Write
5. **Bucket scope:** Select `deepmine-kyc-documents`
6. Click **"Create API Token"**
7. **IMPORTANT:** Copy and save these values:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (e.g., `https://<account-id>.r2.cloudflarestorage.com`)

### Step 3: Update wrangler.jsonc

Add R2 bucket binding to your `wrangler.jsonc`:

```jsonc
{
  // ... existing config
  "r2_buckets": [
    {
      "binding": "KYC_BUCKET",
      "bucket_name": "deepmine-kyc-documents"
    }
  ]
}
```

### Step 4: Add R2 Credentials to .dev.vars

Add these lines to your `.dev.vars` file (local development):

```bash
# Cloudflare R2 for KYC Documents
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_BUCKET_NAME=deepmine-kyc-documents
```

### Step 5: Set Production Secrets

For production deployment, set secrets via wrangler:

```bash
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
npx wrangler secret put R2_ACCOUNT_ID
```

## 📂 Bucket Structure

Your bucket will organize files like this:

```
deepmine-kyc-documents/
├── kyc-submissions/
│   ├── user-123/
│   │   ├── id-front-20250121-abc123.jpg
│   │   ├── id-back-20250121-abc124.jpg
│   │   ├── selfie-20250121-abc125.jpg
│   │   └── proof-address-20250121-abc126.pdf
│   ├── user-456/
│   │   └── ...
├── profile-pictures/
│   ├── user-123-profile.jpg
│   └── ...
```

## 🔐 Security Settings

### CORS Configuration (if accessing from browser)

In R2 bucket settings, add CORS rules:

```json
[
  {
    "AllowedOrigins": ["https://www.deepmineai.vip", "https://deepmine-ai.pages.dev"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### Object Lifecycle (Optional)

You can set retention policies:
- Keep KYC documents for 7 years (regulatory requirement)
- Auto-delete rejected submissions after 90 days

## 💰 Pricing

**R2 Storage Costs:**
- Storage: $0.015 per GB/month
- Class A operations (write): $4.50 per million
- Class B operations (read): $0.36 per million
- **Free tier:** 10 GB storage, 1M Class A, 10M Class B per month

**Estimated Costs for 1,000 users:**
- Storage: ~2GB = $0.03/month
- Operations: ~$0.10/month
- **Total: ~$0.13/month** (basically free!)

## ✅ Verification

After setup, test with:

```bash
# List buckets
npx wrangler r2 bucket list

# Check bucket info
npx wrangler r2 bucket info deepmine-kyc-documents
```

## 🔗 Next Steps

Once R2 is set up, the application will automatically:
1. Upload KYC documents to R2
2. Generate signed URLs for secure access
3. Store file references in D1 database
4. Allow admin review via secure links

---

**You'll need to complete Steps 1-4 manually in Cloudflare Dashboard**
