# DeepMine AI - Deployment Guide

## Quick Start (Development)
Your website is currently running at:
**https://3000-ivu49x7axflktk0lc493l-82b888ba.sandbox.novita.ai**

## Local Development Commands

### View Current Status
```bash
pm2 list
pm2 logs deepmine-ai --nostream
```

### Restart Service
```bash
pm2 restart deepmine-ai
```

### Make Changes and Rebuild
```bash
cd /home/user/webapp
# Make your edits to files
npm run build
pm2 restart deepmine-ai
```

### Stop Service
```bash
pm2 stop deepmine-ai
pm2 delete deepmine-ai
```

## Deploy to Cloudflare Pages

### Prerequisites
1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com/
2. **API Token**: Get from Cloudflare dashboard (Account > API Tokens)

### Step 1: Setup Cloudflare Authentication
When you're ready to deploy to production, run:
```bash
# This will configure your Cloudflare credentials
# Follow the instructions to complete setup
```

### Step 2: Create Cloudflare Pages Project
```bash
cd /home/user/webapp

# Create project (run once)
npx wrangler pages project create deepmine-ai \
  --production-branch main \
  --compatibility-date 2024-01-01
```

### Step 3: Deploy to Production
```bash
# Build and deploy
npm run deploy:prod

# Or manually:
npm run build
npx wrangler pages deploy dist --project-name deepmine-ai
```

### Step 4: Setup Custom Domain (Optional)
```bash
# Add custom domain
npx wrangler pages domain add yourdomain.com --project-name deepmine-ai
```

## Deploy to GitHub

### Step 1: Setup GitHub Authentication
When you're ready to push to GitHub, first setup authentication:
```bash
# This will configure your GitHub credentials
# Follow the instructions to complete setup
```

### Step 2: Create GitHub Repository
Go to https://github.com/new and create a new repository named `deepmine-ai`

### Step 3: Push Code to GitHub
```bash
cd /home/user/webapp

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/deepmine-ai.git

# Push code
git push -u origin main
```

## Environment Variables

### For Production Deployment
When deploying to Cloudflare Pages, you may need these environment variables:

```bash
# None required for current static version

# Future requirements (when backend is added):
# Database
npx wrangler pages secret put DATABASE_ID --project-name deepmine-ai

# API Keys
npx wrangler pages secret put API_SECRET --project-name deepmine-ai
npx wrangler pages secret put PAYMENT_API_KEY --project-name deepmine-ai
```

## Continuous Deployment

### Setup GitHub Actions
Create `.github/workflows/deploy.yml` for automatic deployment:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name deepmine-ai
```

## Performance Optimization

### Before Production Deployment
1. **Optimize Images**: Compress logo and any images
2. **Minify Assets**: Already handled by Vite build
3. **Enable Caching**: Configured in wrangler.jsonc
4. **Test Performance**: Use Lighthouse or PageSpeed Insights

### Cloudflare Pages Features
- **Global CDN**: Automatic worldwide distribution
- **HTTPS**: Free SSL certificate
- **Fast Build**: ~30 second deployment
- **Zero Config**: Works out of the box

## Monitoring

### Check Deployment Status
```bash
# View recent deployments
npx wrangler pages deployment list --project-name deepmine-ai

# View deployment details
npx wrangler pages deployment tail --project-name deepmine-ai
```

### Analytics
- Enable Cloudflare Web Analytics in dashboard
- Monitor traffic and performance
- Track user engagement

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Deployment Fails
```bash
# Check Cloudflare authentication
npx wrangler whoami

# Verify project exists
npx wrangler pages project list
```

### Static Files Not Loading
- Ensure files are in `public/static/` directory
- Check `serveStatic` configuration in `src/index.tsx`
- Verify build output includes static files

## Production URLs

After deployment, your site will be available at:
- **Primary**: `https://deepmine-ai.pages.dev`
- **Branch**: `https://main.deepmine-ai.pages.dev`
- **Custom**: `https://yourdomain.com` (if configured)

## Next Steps

1. **Deploy to Production**: Follow Cloudflare deployment steps
2. **Setup Custom Domain**: Add your own domain name
3. **Enable Analytics**: Track website performance
4. **Setup CI/CD**: Automate deployments with GitHub Actions
5. **Add Backend**: Implement user authentication and database

## Support

For deployment issues:
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/
- Contact: deepmineai25@gmail.com

---

**Ready to Deploy?** 🚀

Start with the Cloudflare deployment steps above, or push to GitHub first for version control!
