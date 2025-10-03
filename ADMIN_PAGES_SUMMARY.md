# Admin Pages Summary

## Access Control
**Only the business admin email can access any `/admin/*` route.**

## Available Admin Pages

### 1. **Dashboard** (`/admin/dashboard`)
- Business overview and analytics
- Total bookings and customers stats
- Reviews statistics (total, average rating, pending, flagged)
- Recent bookings table
- Recent reviews management

### 2. **Bookings Management** (`/admin/bookings`)
- View and manage all customer bookings
- Update booking status
- Customer booking details

### 3. **Content Management** (`/admin/content`)
- **Homepage** (`/admin/content/homepage`) - Manage homepage sections
- **Blog** (`/admin/content/blog`) - Create and manage blog posts
- **Gallery** (`/admin/content/gallery`) - Manage project photos and videos
- **Testimonials** (`/admin/content/testimonials`) - Manage customer testimonials
- **FAQs** (`/admin/content/faqs`) - Manage frequently asked questions
- **Videos** (`/admin/content/videos`) - Manage video content
- **Settings** (`/admin/content/settings`) - Content management settings

### 4. **Form Submissions** (`/admin/form-submissions`)
- View and manage contact form submissions
- Customer inquiries and messages

### 5. **Reviews Management** (`/admin/reviews`)
- Approve, reject, or flag customer reviews
- Review moderation and management

### 6. **Services Management** (`/admin/services`)
- Add, edit, and manage business services
- Service pricing and descriptions

### 7. **Settings** (`/admin/settings`)
- General admin settings and configurations
- Business settings and preferences

## Security Implementation
- **Layout-level protection**: All admin pages are protected by `AdminRoute` in `/admin/layout.tsx`
- **Middleware protection**: Server-side route protection for all `/admin/*` paths
- **Email-based access**: Only the exact email in `ADMIN_EMAIL` environment variable can access
- **Automatic redirect**: Unauthorized users are redirected to home page with access denied message

## No Client Dashboard
- Customers interact through public pages only
- No customer login area or personal dashboards
- All user management is done through the admin interface