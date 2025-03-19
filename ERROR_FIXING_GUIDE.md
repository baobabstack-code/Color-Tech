# Color-Tech Error Fixing Guide

This guide provides a systematic approach to identify and fix common errors in the Color-Tech application. Follow these steps to resolve issues and ensure the application runs smoothly.

## Database Errors

### Missing Columns
- **Issue**: `column "last_login" of relation "users" does not exist`
- **Fix**: Run the migration script to add the missing column:
  ```bash
  npx ts-node src/scripts/migrate.ts
  ```
- **Verification**: After running the migration, try logging in to verify the last_login column is properly updated.

### Blog Posts Table
- **Issue**: Missing blog_posts table for the blog functionality
- **Fix**: Run the blog posts migration script:
  ```bash
  npx ts-node src/scripts/migrate_blog.ts
  ```
- **Verification**: Check if the `/api/blog-posts` endpoint returns a 200 status code instead of 404.

## API Route Errors

### Registration Endpoint Mismatch
- **Issue**: Frontend uses `/users/register` but backend expects `/auth/register`
- **Fix**: Update the API endpoint in the frontend registration component:
  ```typescript
  // src/pages/auth/Register.tsx
  const response = await api.post<AuthResponse>('/auth/register', {
    ...registerData,
    role: 'client',
  });
  ```
- **Verification**: Try registering a new user to ensure the request is properly routed.

### Missing Blog Routes
- **Issue**: 404 errors when accessing `/api/blog-posts`
- **Fix**: 
  1. Ensure the blog controller is properly exported
  2. Verify the blog routes are registered in `server.ts`
  3. Check that the blog_posts table exists in the database
- **Verification**: Make a GET request to `/api/blog-posts` to confirm it returns a 200 status code.

## TypeScript Errors

### Type Mismatch in Register Form
- **Issue**: Type 'Resolver<{ email: string; ... }>' is not assignable to type 'Resolver<RegisterFormData & { confirmPassword: string; }, any>'
- **Fix**: Update the RegisterFormData type in `src/lib/types/auth.ts` to match the form schema:
  ```typescript
  export interface RegisterFormData {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role?: string;
  }
  ```
- **Verification**: The TypeScript error should be resolved after updating the type definition.

### Missing Module Errors
- **Issue**: Cannot find module '../controllers/BlogController'
- **Fix**: Ensure the BlogController.ts file is properly created and exported:
  ```typescript
  // src/controllers/BlogController.ts
  export { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost };
  ```
- **Verification**: The TypeScript error should be resolved after fixing the exports.

## Authentication Errors

### JWT Configuration Issues
- **Issue**: JWT configuration verification failed
- **Fix**: 
  1. Check the JWT secret in the .env file
  2. Verify the JWT expiration time is properly set
  3. Ensure the verifyJwtConfig function is correctly implemented
- **Verification**: The server logs should show "JWT configuration verified successfully" on startup.

### Login Failures
- **Issue**: Login attempts fail with 401 Unauthorized
- **Fix**: 
  1. Check the user credentials in the database
  2. Verify the password hashing mechanism
  3. Ensure the JWT token is properly generated and returned
- **Verification**: Successfully log in with valid credentials.

## Frontend Errors

### Form Validation Errors
- **Issue**: Form validation errors in the registration form
- **Fix**: Ensure the Zod schema matches the form fields and the expected API request format
- **Verification**: Fill out the registration form and check if validation works correctly.

### API Integration Errors
- **Issue**: Frontend API calls failing
- **Fix**: 
  1. Check the API base URL configuration
  2. Verify the API endpoints match between frontend and backend
  3. Ensure authentication tokens are properly included in requests
- **Verification**: Monitor network requests in the browser developer tools to confirm successful API calls.

## Server Configuration Errors

### CORS Issues
- **Issue**: Cross-Origin Resource Sharing (CORS) errors
- **Fix**: Update the CORS configuration in `server.ts` to allow requests from the frontend origin:
  ```typescript
  app.use(cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  ```
- **Verification**: API requests from the frontend should not trigger CORS errors.

### Port Conflicts
- **Issue**: Server fails to start due to port conflicts
- **Fix**: Change the port in the .env file or close any applications using the same port
- **Verification**: The server should start without port conflict errors.

## General Troubleshooting Steps

1. **Check Server Logs**: Review the server logs for error messages and stack traces
2. **Verify Database Connection**: Ensure the database is running and accessible
3. **Restart the Server**: Sometimes a simple restart resolves transient issues
4. **Clear Browser Cache**: Clear the browser cache to ensure the latest frontend code is loaded
5. **Update Dependencies**: Run `npm update` to ensure all dependencies are up to date
6. **TypeScript Compilation**: Run `tsc --noEmit` to check for TypeScript errors
7. **Database Migrations**: Ensure all migrations have been applied correctly
8. **Environment Variables**: Verify all required environment variables are set correctly

## Specific Error Messages and Solutions

| Error Message | Possible Cause | Solution |
|---------------|----------------|----------|
| `column "last_login" of relation "users" does not exist` | Missing database column | Run the migration script to add the column |
| `Route not found: POST /api/users/register` | Incorrect API endpoint | Update the frontend to use the correct endpoint |
| `Route not found: GET /api/blog-posts` | Missing blog routes | Add the blog routes to the server configuration |
| `JWT configuration verification failed` | Invalid JWT settings | Check the JWT secret and expiration settings |
| `TypeError: Cannot read property 'X' of undefined` | Accessing undefined object | Add null checks and default values |
| `EADDRINUSE: address already in use` | Port conflict | Change the port or close competing applications |

## Preventive Measures

1. **Automated Testing**: Implement unit and integration tests to catch errors early
2. **CI/CD Pipeline**: Set up continuous integration to run tests automatically
3. **Error Monitoring**: Use tools like Sentry to track and alert on production errors
4. **Database Versioning**: Use a migration system to manage database schema changes
5. **Code Reviews**: Implement a code review process to catch issues before they reach production
6. **Documentation**: Keep documentation up to date to help troubleshoot issues

By following this guide, you should be able to identify and fix most common errors in the Color-Tech application. If you encounter persistent issues, consider reaching out to the development team for additional support. 