# Admin Portal Testing Guide

This guide provides instructions for testing the admin portal functionality after the recent JWT configuration centralization.

## Prerequisites

1. Ensure you have Node.js installed (v14 or higher)
2. Make sure all dependencies are installed by running `npm install`
3. Set up your environment variables in a `.env` file:

```
# JWT Configuration
JWT_SECRET=your-strong-secret-here
JWT_EXPIRES_IN=1d

# Test Admin Credentials
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=Admin123!

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Testing Steps

### 1. Verify JWT Configuration

First, verify that your JWT configuration is correct:

```bash
# Using npm
npm run ts-node src/scripts/verifyJwtConfig.ts

# Using npx
npx ts-node src/scripts/verifyJwtConfig.ts
```

This script will:
- Check if your JWT secret is properly configured
- Validate the JWT expiration format
- Report any issues with your JWT configuration

### 2. Test Admin Portal Functionality

After verifying your JWT configuration, test the admin portal functionality:

```bash
# Using npm
npm run ts-node src/scripts/testAdminPortal.ts

# Using npx
npx ts-node src/scripts/testAdminPortal.ts
```

This script will:
1. Log in as an admin user
2. Test CRUD operations using the admin token
3. Report any issues with the admin portal functionality

## Recent Fixes

The following issues have been fixed:

1. **JWT Verification**: The JWT verification utility has been updated to properly validate the JWT configuration without attempting to generate tokens, which was causing type errors.

2. **AuthContext**: The AuthContext has been updated to handle different API response formats for user data, ensuring compatibility with both `first_name/last_name` and `fullName` formats.

3. **Error Handling**: Improved error handling throughout the authentication flow, with better error messages and logging.

4. **Type Definitions**: Fixed type definitions to ensure proper TypeScript compatibility.

## Troubleshooting

If you encounter issues during testing, check the following:

### JWT Configuration Issues

- Ensure your JWT secret is properly set in your `.env` file
- Verify that the same JWT secret is used in both client and server configurations
- Check that the JWT expiration time is reasonable (e.g., "1d" for one day)

### Authentication Issues

- Verify that your admin credentials are correct
- Check that the admin user has the appropriate role and permissions
- Ensure that the API URL is correct and the server is running

### CRUD Operation Issues

- Check the server logs for any errors related to the CRUD operations
- Verify that the admin user has the appropriate permissions for the operations
- Ensure that the database is properly configured and accessible

## Manual Testing

If you prefer to test the admin portal manually:

1. Navigate to the admin login page
2. Log in with your admin credentials
3. Try to perform CRUD operations on users, products, or other resources
4. Check that all buttons and functionality work as expected

## Reporting Issues

If you encounter any issues that cannot be resolved through troubleshooting, please report them with:

1. A description of the issue
2. Steps to reproduce the issue
3. Any error messages or logs
4. Your environment details (OS, Node.js version, etc.) 