# Color-Tech Auto Detailing

## Overview
This is a web application for Color-Tech Auto Detailing, featuring a Next.js frontend and a Strapi backend for content management.

## Admin Dashboard
This application uses Strapi as the exclusive admin dashboard for content management. The custom Next.js admin routes have been disabled.

### Accessing the Admin Dashboard

1. Start the Strapi backend:
   ```
   cd strapi-backend
   npm run develop
   ```

2. Access the Strapi admin panel at:
   ```
   http://localhost:1337/admin
   ```

3. Log in with your Strapi admin credentials.

### Managing Content in Strapi

Strapi provides a comprehensive admin interface for managing all aspects of your application:

- **Content Types**: Manage services, bookings, customers, blog posts, gallery items, testimonials, FAQs, etc.
- **Media Library**: Upload and manage images and other media files
- **User Management**: Create and manage user accounts and permissions
- **API Configuration**: Configure API endpoints and permissions

## Project Setup

We've created a setup script to help with environment configuration:

```
npm run setup
```

This will:
1. Create .env files from examples if they don't exist
2. Provide instructions for next steps

To also install dependencies automatically, use:

```
npm run setup:install
```

## Starting the Application

1. Start the Strapi backend:
   ```
   cd strapi-backend
   npm run develop
   ```

2. Start the Next.js frontend:
   ```
   npm run dev
   ```

3. Access the application at:
   - Frontend: `http://localhost:3000`
   - Strapi Admin: `http://localhost:1337/admin`

## Technical Notes

- A middleware has been implemented to redirect all `/admin/*` routes to the Strapi admin panel.
- The frontend connects to the Strapi backend API at `http://localhost:1337/api`.
- Authentication is handled through Strapi's authentication system.

## Updating Strapi

A new version of Strapi (5.17.0) is available. To update:

### Option 1: Using the Update Script (Recommended)

We've created a helper script to simplify the update process:

```
cd strapi-backend
npm run update
```

This script will:
1. Back up your current package.json
2. Run the Strapi upgrade command
3. Ensure all Strapi dependencies are updated to the same version
4. Install the updated dependencies

### Option 2: Using the Version-Specific Update Script

For updating to a specific version:

```
cd strapi-backend
npm run update:version 5.17.0
```

This script will automatically update all Strapi dependencies to the specified version and run npm install.

### Option 3: Manual Update

1. Run the upgrade command:
   ```
   cd strapi-backend
   npm run upgrade
   ```

2. Or run a dry-run first to see what changes will be made:
   ```
   cd strapi-backend
   npm run upgrade:dry
   ```

3. After upgrading, update the version numbers in `package.json`.

## Documentation

Additional documentation is available in the following files:

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guidelines for contributing to the project
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Checklist for deploying to production

## Docker Deployment

This project includes Docker configuration for containerized deployment:

### Prerequisites

- Docker and Docker Compose installed on your system
- Create a `.env` file in the project root with the required environment variables (see `.env.example`)

### Building and Running with Docker

1. Set up the Docker environment:
   ```bash
   npm run docker:setup
   ```
   This script creates a `.env` file with secure random values for all required environment variables.

2. Build and start the containers:
   ```bash
   npm run docker:up
   ```
   or manually with:
   ```bash
   docker-compose up -d --build
   ```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin

4. Stop the containers:
   ```bash
   npm run docker:down
   ```
   or manually with:
   ```bash
   docker-compose down
   ```

### Docker Configuration Files

- `docker-compose.yml` - Defines the multi-container setup
- `Dockerfile.frontend` - Builds the Next.js frontend
- `strapi-backend/Dockerfile` - Builds the Strapi backend

## CI/CD Workflows

This project includes GitHub Actions workflows for continuous integration and deployment:

### Main Workflow

The main CI/CD pipeline (`.github/workflows/ci.yml`) runs on pushes to `main` and `develop` branches and on pull requests:

1. **Lint and Test**: Runs linting and tests for the codebase
2. **Build Frontend**: Builds the Next.js frontend
3. **Build Strapi**: Builds the Strapi backend
4. **Docker Build**: Builds and pushes Docker images (only on push to `main`)

### Strapi Update Workflow

A dedicated workflow for updating Strapi (`.github/workflows/update-strapi.yml`):

```bash
# Trigger manually from GitHub Actions UI with:
# - Version: 5.17.0 (or other version)
# - Create PR: true/false
```

### Dependency Updates

An automated workflow (`.github/workflows/dependency-updates.yml`) checks for dependency updates weekly and creates a pull request with the changes.

## Code Quality and Maintainability

1. **Environment Variables**: Use `.env` files for all environment-specific configurations. TypeScript declarations are available in `src/types/env.d.ts`.

2. **Type Safety**: Ensure all API responses and data models have proper TypeScript interfaces.

3. **Error Handling**: Implement consistent error handling throughout the application.

4. **Testing**: Add unit and integration tests for critical functionality.

5. **Documentation**: Keep documentation up-to-date with any changes to the API or content structure.

6. **Monitoring**: Consider adding logging and monitoring for production deployments.

7. **Scripts**: Use the provided helper scripts for common tasks:
   - `npm run setup` - Set up environment configuration
   - `npm run setup:install` - Set up environment and install dependencies
   - `cd strapi-backend && npm run update` - Update Strapi to the latest version