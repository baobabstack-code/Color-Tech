# Admin Access Control Setup

## Overview
The application now has strict admin access control where only the business admin email can access admin features.

## Configuration

### Environment Variables
Set the admin email in your `.env` file:
```
ADMIN_EMAIL=admin@colortech.co.zw
NEXT_PUBLIC_ADMIN_EMAIL=admin@colortech.co.zw
```

**Important**: Replace `admin@colortech.co.zw` with your actual business email address.

## Access Control Levels

### 1. Public Access
- Home page
- Services page
- Gallery
- Blog
- About
- Contact
- No authentication required

### 2. Admin-Only Access
- Admin dashboard (`/admin/dashboard`)
- Admin bookings (`/admin/bookings`)
- Admin content management (`/admin/content/*`)
- Admin form submissions (`/admin/form-submissions`)
- Admin reviews (`/admin/reviews`)
- Admin services (`/admin/services`)
- Admin settings (`/admin/settings`)
- **All admin routes (`/admin/*`) only accessible by the email specified in `ADMIN_EMAIL`**
- Protected by `AdminRoute` component at layout level

## Security Implementation

### Client-Side Protection
- `AuthContext` includes `isAdmin` boolean
- `ProtectedRoute` component for general auth
- `AdminRoute` component for admin-only access
- Real-time email checking against admin email

### Server-Side Protection
- Middleware protects `/admin/*` routes
- NextAuth JWT includes admin status
- Database role assignment based on email

### Database Integration
- Users automatically get `admin` or `staff` role based on email
- Admin users have `role: "admin"`
- Regular users have `role: "staff"`

## Usage Examples

### Protecting Admin Pages
```tsx
import AdminRoute from '@/components/AdminRoute';

export default function AdminPage() {
  return (
    <AdminRoute>
      <div>Admin-only content</div>
    </AdminRoute>
  );
}
```

### Protecting Regular User Pages
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UserPage() {
  return (
    <ProtectedRoute>
      <div>Authenticated user content</div>
    </ProtectedRoute>
  );
}
```

### Checking Admin Status in Components
```tsx
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { isAdmin, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>You are signed in</p>}
      {isAdmin && <p>You have admin access</p>}
    </div>
  );
}
```

## Testing Admin Access

1. **Set your admin email** in the environment variables
2. **Sign in with that exact email** using Google OAuth
3. **Navigate to `/admin/dashboard`** - should work
4. **Sign out and sign in with a different email**
5. **Try to access `/admin/dashboard`** - should be blocked

## Security Notes

- Admin access is determined by exact email match
- No other user can access admin features, regardless of their Google account permissions
- The system automatically redirects unauthorized users to the home page
- All admin routes are protected at both client and server levels

## Changing Admin Email

To change the admin email:
1. Update `ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_EMAIL` in `.env`
2. Restart the development server
3. The new email will immediately have admin access
4. The old email will lose admin access