# 🔐 GitHub Secrets Setup for ColorTech

## Go to: https://github.com/nyashaushe/Color-Tech/settings/secrets/actions

Click "New repository secret" and add each of these:

### 1. VERCEL_ORG_ID
```
team_rpMfcIPeCbU9G8LFJIiYmnH5
```

### 2. VERCEL_PROJECT_ID
```
prj_5p5j6Xh9qQjAZiGwDekcXA3cbxtB
```

### 3. VERCEL_TOKEN
```
<Get this from https://vercel.com/account/tokens>
```

### 4. DATABASE_URL
```
<Copy from your .env file - the postgres:// URL>
```

### 5. NEXTAUTH_URL
```
https://www.colortech.co.zw
```

### 6. NEXTAUTH_SECRET
```
<Copy from your .env file>
```

### 7. GOOGLE_CLIENT_ID
```
<Copy from your .env file>
```

### 8. GOOGLE_CLIENT_SECRET
```
<Copy from your .env file>
```

### 9. NEXT_PUBLIC_MAPS_PLATFORM_API_KEY
```
<Copy from your .env file>
```

## After adding all secrets:

1. Go to: https://github.com/nyashaushe/Color-Tech/actions
2. You should see the CI workflow running
3. Once you add the VERCEL_TOKEN, you can manually trigger the deployment workflow

## To trigger deployment:
1. Go to Actions tab
2. Click "Deploy to Production"
3. Click "Run workflow"
4. Select "main" branch
5. Click "Run workflow"

Your site will be deployed to: https://www.colortech.co.zw

## Quick Reference - Values from your .env file:
- DATABASE_URL: The postgres:// connection string
- NEXTAUTH_SECRET: The base64 encoded secret
- GOOGLE_CLIENT_ID: Your Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Your Google OAuth client secret
- NEXT_PUBLIC_MAPS_PLATFORM_API_KEY: Your Google Maps API key