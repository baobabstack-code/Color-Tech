# 🚀 ColorTech Deployment Checklist

Use this checklist to ensure your GitHub Actions deployment is set up correctly.

## ✅ Pre-Deployment Setup

### GitHub Repository
- [ ] Code is pushed to GitHub repository
- [ ] Repository has `main` branch as default
- [ ] All sensitive data is removed from code (no hardcoded secrets)

### Vercel Setup
- [ ] Vercel account is connected to GitHub
- [ ] Project is linked to Vercel (`vercel link` completed)
- [ ] Domain `colortech.co.zw` is configured in Vercel
- [ ] SSL certificate is active

### Database Setup
- [ ] Production database is running (Neon/PostgreSQL)
- [ ] Database URL is accessible from Vercel
- [ ] Database migrations are up to date
- [ ] Seed data is prepared (optional)

## 🔐 GitHub Secrets Configuration

Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

### Required Secrets
- [ ] `VERCEL_TOKEN` - Your Vercel authentication token
- [ ] `VERCEL_ORG_ID` - From `.vercel/project.json`
- [ ] `VERCEL_PROJECT_ID` - From `.vercel/project.json`
- [ ] `DATABASE_URL` - Production database connection string
- [ ] `NEXTAUTH_URL` - `https://www.colortech.co.zw`
- [ ] `NEXTAUTH_SECRET` - Secure random string (32+ characters)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `NEXT_PUBLIC_MAPS_PLATFORM_API_KEY` - Google Maps API key

### Optional Secrets
- [ ] `NEXTAUTH_URL_PREVIEW` - Preview deployment URL pattern

## 🌐 External Service Configuration

### Google OAuth
- [ ] OAuth application is created in Google Cloud Console
- [ ] Authorized redirect URIs include:
  - [ ] `https://www.colortech.co.zw/api/auth/callback/google`
  - [ ] `https://*.vercel.app/api/auth/callback/google`
- [ ] Client ID and secret are added to GitHub secrets

### Google Maps (if used)
- [ ] Google Maps API key is generated
- [ ] API key has appropriate restrictions
- [ ] API key is added to GitHub secrets

## 📋 Vercel Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

### Production Environment
- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `NEXT_PUBLIC_MAPS_PLATFORM_API_KEY`

### Preview Environment
- [ ] Same variables as production
- [ ] `NEXTAUTH_URL` set to preview domain pattern

## 🔄 Workflow Files

Ensure these workflow files exist in `.github/workflows/`:
- [ ] `ci.yml` - Continuous Integration
- [ ] `deploy.yml` - Production Deployment
- [ ] `preview.yml` - Preview Deployments
- [ ] `database-backup.yml` - Database Backups

## 🧪 Testing Deployment

### Local Testing
- [ ] `npm run build` succeeds locally
- [ ] `npm run start` works locally
- [ ] Database connection works
- [ ] Authentication flow works

### CI Testing
- [ ] Push a test commit to trigger CI
- [ ] All CI checks pass (lint, test, build)
- [ ] No errors in GitHub Actions logs

### Preview Deployment Testing
- [ ] Create a test pull request
- [ ] Preview deployment is created automatically
- [ ] Preview URL is commented on PR
- [ ] Preview site loads correctly
- [ ] Authentication works on preview

### Production Deployment Testing
- [ ] Merge PR to main branch
- [ ] Production deployment triggers automatically
- [ ] Deployment completes successfully
- [ ] Production site loads at `https://www.colortech.co.zw`
- [ ] All features work correctly
- [ ] Database migrations applied successfully

## 🔍 Post-Deployment Verification

### Functionality Check
- [ ] Homepage loads correctly
- [ ] Admin portal is accessible
- [ ] Google OAuth login works
- [ ] Content management functions work
- [ ] Blog posts display correctly
- [ ] Gallery items load
- [ ] Testimonials show properly
- [ ] FAQs are accessible

### Performance Check
- [ ] Site loads quickly (< 3 seconds)
- [ ] Images are optimized
- [ ] No console errors
- [ ] Mobile responsiveness works

### SEO Check
- [ ] Meta tags are present
- [ ] Sitemap is accessible
- [ ] Robots.txt is configured
- [ ] Analytics are tracking (if configured)

## 🚨 Troubleshooting

If deployment fails, check:

### Common Issues
- [ ] All required secrets are set in GitHub
- [ ] Environment variables match in Vercel
- [ ] Database URL is correct and accessible
- [ ] Google OAuth redirect URIs are configured
- [ ] Domain DNS settings are correct

### Debug Steps
1. [ ] Check GitHub Actions logs for specific errors
2. [ ] Verify Vercel deployment logs
3. [ ] Test database connection manually
4. [ ] Validate environment variables
5. [ ] Check external service configurations

## 📊 Monitoring Setup

### GitHub Actions
- [ ] Enable email notifications for failed deployments
- [ ] Set up Slack/Discord webhooks (optional)
- [ ] Monitor workflow run history

### Vercel
- [ ] Enable deployment notifications
- [ ] Set up performance monitoring
- [ ] Configure error tracking

### Database
- [ ] Monitor database performance
- [ ] Set up backup verification
- [ ] Configure connection pooling

## 🎉 Deployment Complete!

Once all items are checked:
- [ ] Document any custom configurations
- [ ] Share access credentials with team members
- [ ] Set up monitoring and alerting
- [ ] Plan regular maintenance schedule

---

**Congratulations! Your ColorTech application is now deployed with professional CI/CD pipelines! 🚀**

For ongoing maintenance, refer to:
- `GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md` for detailed instructions
- GitHub Actions dashboard for deployment monitoring
- Vercel dashboard for performance metrics