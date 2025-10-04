# 🚀 Deployment Checklist: Vercel Blob Migration

## ✅ Pre-Deployment Checklist

### 1. Environment Variables on Vercel
Ensure these environment variables are set in your Vercel dashboard:

```bash
DATABASE_URL=postgresql://your-connection-string
NEXTAUTH_URL=https://colortech.co.zw
NEXTAUTH_SECRET=your-nextauth-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
NODE_ENV=production

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Other existing variables
NEXT_PUBLIC_MAPS_PLATFORM_API_KEY=your-maps-key
```

### 2. ✅ Vercel Blob Setup
1. Go to [Vercel Dashboard → Storage](https://vercel.com/dashboard/stores)
2. Create a new Blob store (if not exists)
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Add it to your Vercel environment variables

### 3. ✅ Next.js Configuration
The `next.config.ts` file is configured with:
```typescript
{
  protocol: "https",
  hostname: "rystv5mdesdms7cf.public.blob.vercel-storage.com",
  pathname: "/**",
}
```

**Important:** If your Vercel Blob hostname is different, update this in `next.config.ts`

### 4. ✅ Database Migration Status
- ✅ All 24 files migrated to Vercel Blob
- ✅ All 29 database records updated with Vercel Blob URLs
- ✅ Local backup files preserved in `public/colortech/`

## 🚀 Deployment Process

### Option A: Git Push (Automatic)
```bash
git add .
git commit -m "feat: migrate gallery to Vercel Blob"
git push origin main
```
Vercel will automatically deploy from your connected Git repository.

### Option B: Vercel CLI
```bash
npx vercel --prod
```

## ✅ Post-Deployment Verification

### 1. Test Gallery Loading
- [ ] Visit `https://colortech.co.zw/gallery`
- [ ] Verify all images load correctly
- [ ] Check browser console for any 400/500 errors

### 2. Test Admin Gallery Management
- [ ] Login to admin: `https://colortech.co.zw/admin/dashboard`
- [ ] Navigate to Gallery management
- [ ] Try editing an existing gallery item
- [ ] Test uploading a new image

### 3. Image Optimization Check
- [ ] Right-click on gallery images → "Inspect Element"
- [ ] Check image URLs start with Next.js image optimizer: `/_next/image?url=https://...`
- [ ] Verify no 400 "Bad Request" errors in Network tab

## 🔧 Common Issues & Solutions

### Issue: Images return 400 "Bad Request"
**Cause:** Next.js image hostname not configured properly

**Solution:** 
1. Check your actual Vercel Blob hostname in the database
2. Update `next.config.ts` with the correct hostname
3. Redeploy

### Issue: PUT /api/content/gallery/[id] returns 500
**Cause:** Database schema validation issues

**Solution:** The updated API route now uses raw SQL to bypass Prisma validation

### Issue: New uploads failing
**Cause:** Missing `BLOB_READ_WRITE_TOKEN` or incorrect token

**Solution:**
1. Verify token is set in Vercel environment variables
2. Check token has read/write permissions
3. Test token with a simple upload

## 📊 Current Status Summary

| Component | Status | Details |
|-----------|---------|---------|
| ✅ Database | Ready | 29 items with Vercel Blob URLs |
| ✅ API Routes | Updated | Fixed PUT method and validation |
| ✅ Image Config | Configured | Next.js optimized for Vercel Blob |
| ✅ Build | Successful | No compilation errors |
| ✅ Migration | Complete | All media moved to Vercel Blob |

## 🎯 Success Criteria

After deployment, you should have:
- ✅ All gallery images loading from Vercel Blob
- ✅ Gallery editing functionality working
- ✅ New image uploads using Vercel Blob
- ✅ Fast global image delivery via CDN
- ✅ Consistent media storage system

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Test API endpoints directly in browser developer tools

---

**Ready to deploy!** 🚀