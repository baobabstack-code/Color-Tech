# GitHub Actions Deployment Guide for ColorTech

This guide explains how to set up automated deployment for your ColorTech application using GitHub Actions and Vercel.

## 🚀 Overview

We've set up three main workflows:

1. **Continuous Integration** (`ci.yml`) - Runs on every push/PR
2. **Production Deployment** (`deploy.yml`) - Deploys to production on main branch
3. **Preview Deployment** (`preview.yml`) - Creates preview deployments for PRs
4. **Database Backup** (`database-backup.yml`) - Daily automated backups

## 📋 Prerequisites

Before setting up GitHub Actions, ensure you have:

- [x] GitHub repository with your code
- [x] Vercel account connected to your GitHub repo
- [x] Production database (Neon/PostgreSQL)
- [x] Google OAuth credentials
- [x] Domain configured (colortech.co.zw)

## 🔧 Setup Instructions

### Step 1: Get Vercel Credentials

1. **Install Vercel CLI locally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   vercel link
   ```

4. **Get your Vercel credentials:**
   ```bash
   # Get your Vercel token
   vercel whoami
   
   # Get project details
   cat .vercel/project.json
   ```

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these **Repository Secrets**:

#### Vercel Configuration
```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_from_project.json
VERCEL_PROJECT_ID=your_project_id_from_project.json
```

#### Database Configuration
```
DATABASE_URL=your_production_database_url
```

#### Authentication Configuration
```
NEXTAUTH_URL=https://www.colortech.co.zw
NEXTAUTH_URL_PREVIEW=https://your-preview-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key
```

#### Google OAuth Configuration
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Additional Services
```
NEXT_PUBLIC_MAPS_PLATFORM_API_KEY=your_google_maps_api_key
```

### Step 3: Configure Vercel Environment Variables

In your Vercel dashboard, add the same environment variables for both **Production** and **Preview** environments.

### Step 4: Update Google OAuth Settings

Add these redirect URIs to your Google OAuth configuration:
- `https://www.colortech.co.zw/api/auth/callback/google` (Production)
- `https://*.vercel.app/api/auth/callback/google` (Preview deployments)

## 🔄 Workflow Details

### 1. Continuous Integration (`ci.yml`)

**Triggers:** Every push and pull request

**What it does:**
- ✅ Lints code with ESLint
- ✅ Runs tests
- ✅ Type checks with TypeScript
- ✅ Builds application to verify no build errors

### 2. Production Deployment (`deploy.yml`)

**Triggers:** Push to `main` branch or manual dispatch

**What it does:**
- ✅ Runs CI checks
- ✅ Builds application with production environment
- ✅ Deploys to Vercel production
- ✅ Runs database migrations
- ✅ Seeds database (if needed)
- ✅ Notifies deployment status

### 3. Preview Deployment (`preview.yml`)

**Triggers:** Pull requests to `main` or pushes to `develop`/`staging`

**What it does:**
- ✅ Runs CI checks
- ✅ Creates preview deployment
- ✅ Comments on PR with preview URL
- ✅ Updates comment on subsequent pushes

### 4. Database Backup (`database-backup.yml`)

**Triggers:** Daily at 2 AM UTC or manual dispatch

**What it does:**
- ✅ Backs up database schema
- ✅ Stores backup as GitHub artifact
- ✅ Retains backups for 30 days

## 🚦 Deployment Process

### Automatic Deployment (Recommended)

1. **Make changes** to your code
2. **Commit and push** to a feature branch
3. **Create a pull request** to `main`
4. **Review the preview deployment** (automatically created)
5. **Merge the PR** to trigger production deployment

### Manual Deployment

1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy to Production** workflow
3. Click **Run workflow**
4. Choose the branch and click **Run workflow**

## 📊 Monitoring Deployments

### GitHub Actions Dashboard
- View all workflow runs in the **Actions** tab
- Monitor build logs and deployment status
- Download backup artifacts

### Vercel Dashboard
- Monitor deployment status and performance
- View deployment logs and analytics
- Manage environment variables

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify database connection string
   - Review build logs in Actions tab

2. **Database Migration Errors**
   - Ensure `DATABASE_URL` is correct
   - Check if migrations are compatible
   - Verify database permissions

3. **Authentication Issues**
   - Verify Google OAuth credentials
   - Check redirect URIs are configured
   - Ensure `NEXTAUTH_SECRET` is set

### Debug Commands

```bash
# Test build locally
npm run build

# Test database connection
npx prisma db pull

# Verify environment variables
vercel env ls
```

## 🔒 Security Best Practices

1. **Never commit secrets** to your repository
2. **Use GitHub Secrets** for all sensitive data
3. **Rotate secrets regularly** (especially tokens)
4. **Limit secret access** to necessary workflows only
5. **Monitor deployment logs** for any exposed secrets

## 📈 Performance Optimization

### Build Optimization
- Dependencies are cached between runs
- Only rebuilds when necessary
- Parallel job execution where possible

### Database Optimization
- Migrations run only on production deployments
- Seeding is optional and continues on error
- Regular automated backups

## 🎯 Next Steps

1. **Set up monitoring** with Vercel Analytics
2. **Configure alerts** for deployment failures
3. **Add integration tests** to the CI pipeline
4. **Set up staging environment** for additional testing
5. **Configure custom domains** for preview deployments

## 📞 Support

If you encounter issues:

1. Check the **Actions** tab for detailed logs
2. Review **Vercel deployment logs**
3. Verify all **environment variables** are set
4. Check **database connectivity**

---

**Happy Deploying! 🚀**

Your ColorTech application is now set up with professional-grade CI/CD pipelines that will automatically test, build, and deploy your changes safely and efficiently.