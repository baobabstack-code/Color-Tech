# Production Deployment Guide

## Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel --prod
```

### Step 4: Set Environment Variables in Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add these variables:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-new-secret-for-production
ADMIN_EMAIL=colorterch25@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL=colorterch25@gmail.com
GOOGLE_CLIENT_ID=96340485320-nocbsalrco3jls1bhvdi4i812oib88a9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
DATABASE_URL=your-production-database-url
```

## Alternative: Deploy to Netlify

### Step 1: Build for production
```bash
npm run build
```

### Step 2: Install Netlify CLI
```bash
npm i -g netlify-cli
```

### Step 3: Deploy
```bash
netlify deploy --prod --dir=.next
```

### Step 4: Set Environment Variables in Netlify
1. Go to Netlify dashboard
2. Select your site
3. Go to Site settings > Environment variables
4. Add the same variables as above

## Database Migration for Production

If using a new production database:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-db-url"

# Run migrations
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed
```

## Access Admin in Production

Once deployed:

1. **Direct URL**: `https://your-domain.com/admin/dashboard`
2. **Hidden link**: Click the tiny dot in footer after "All rights reserved"
3. **Sign in with**: `colorterch25@gmail.com`

## Security Checklist

- ✅ Change NEXTAUTH_SECRET for production
- ✅ Use production database URL
- ✅ Update Google OAuth redirect URIs
- ✅ Verify admin email is correct
- ✅ Test admin access after deployment

## Troubleshooting

### If admin access fails:
1. Check environment variables are set correctly
2. Verify Google OAuth redirect URIs include production domain
3. Check browser console for errors
4. Ensure database is accessible from production

### If Google OAuth fails:
1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
2. Check Google Cloud Console OAuth settings
3. Ensure production domain is in authorized origins