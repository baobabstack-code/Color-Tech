# JWT Configuration Guide

This document provides an overview of the JWT (JSON Web Token) configuration in the Color-Tech application.

## Overview

JWT is used for authentication and authorization in the application. To ensure consistency and maintainability, we've centralized the JWT configuration in dedicated files for both server-side and client-side code.

## Server-Side Configuration

The server-side JWT configuration is located in `src/config/jwt.ts`. This file provides:

- JWT secret key management
- Token expiration time configuration
- Helper functions for consistent access to JWT settings

```typescript
// Example usage in server-side code
import jwtConfig from '../config/jwt';

// Generate a JWT token
const token = jwt.sign(
  payload, 
  jwtConfig.getSecret(), 
  { expiresIn: jwtConfig.getExpiresIn() }
);

// Verify a JWT token
const decoded = jwt.verify(token, jwtConfig.getSecret());
```

## Client-Side Configuration

The client-side JWT configuration is located in `src/lib/jwt.ts`. This file provides:

- Token storage management in localStorage
- Helper functions for token retrieval, storage, and removal
- Authorization header generation for API requests

```typescript
// Example usage in client-side code
import jwtConfig from '@/lib/jwt';

// Store a token
jwtConfig.setToken(token);

// Get a token
const token = jwtConfig.getToken();

// Remove a token (logout)
jwtConfig.removeToken();

// Get authorization header for API requests
const headers = jwtConfig.getAuthHeader();
```

## Benefits of Centralized Configuration

1. **Consistency**: Ensures the same JWT settings are used throughout the application
2. **Maintainability**: Makes it easier to update JWT settings in one place
3. **Security**: Reduces the risk of misconfiguration or inconsistent token handling
4. **Testability**: Makes it easier to mock JWT functionality in tests

## Environment Variables

The JWT configuration relies on the following environment variables:

- `JWT_SECRET`: The secret key used for signing and verifying tokens
- `JWT_EXPIRES_IN`: The token expiration time (e.g., "24h", "7d")

These should be set in the `.env` file for development and in the appropriate environment configuration for production.

## Best Practices

1. Always use the centralized configuration instead of direct access to environment variables
2. Never hardcode JWT secrets in the application code
3. Use appropriate token expiration times based on security requirements
4. Implement token refresh mechanisms for long-lived sessions
5. Include only necessary data in JWT payloads to minimize token size 