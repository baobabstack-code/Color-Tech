# Google OAuth Setup Instructions

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "ColorTech Panel Beaters"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if available

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name it "ColorTech Admin Login"

## Step 4: Configure OAuth Settings

### Authorized JavaScript Origins:
```
http://localhost:3000
https://your-domain.com
```

### Authorized Redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://your-domain.com/api/auth/callback/google
```

## Step 5: Get Your Credentials

1. After creating, you'll get:
   - Client ID (starts with numbers, ends with .apps.googleusercontent.com)
   - Client Secret (random string)

## Step 6: Update Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## Step 7: Configure Admin Emails

In `src/app/api/auth/[...nextauth]/route.ts`, update the ADMIN_EMAILS array:

```typescript
const ADMIN_EMAILS = [
  "your-admin-email@gmail.com",
  "another-admin@gmail.com",
];
```

## Step 8: Test the Setup

1. Start your development server: `pnpm run dev`
2. Go to `/login`
3. Click "Continue with Google"
4. Sign in with your Gmail account
5. If your email is in the ADMIN_EMAILS list, you'll have admin access

## Security Notes

- Only Gmail accounts listed in ADMIN_EMAILS can access admin features
- Other users will be assigned 'client' role automatically
- Make sure to use HTTPS in production
- Keep your Client Secret secure and never commit it to version control

## Troubleshooting

- **"redirect_uri_mismatch"**: Check your redirect URIs in Google Console
- **"invalid_client"**: Verify your Client ID and Secret
- **"access_denied"**: Make sure your email is in the ADMIN_EMAILS list