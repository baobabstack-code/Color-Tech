# Contributing to Color-Tech Auto Detailing

Thank you for your interest in contributing to the Color-Tech Auto Detailing project! This document provides guidelines and best practices for working with this codebase.

## Development Environment

### Setup

1. Clone the repository
2. Run the setup script to configure your environment:
   ```
   npm run setup:install
   ```
3. Start the development servers as described in the README.md

## Code Quality Standards

### TypeScript

- Always use proper TypeScript types for variables, function parameters, and return values
- Create interfaces for all data models in their respective service files
- Use type guards when necessary to ensure type safety

### React Components

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use proper prop typing with TypeScript interfaces
- Implement proper error handling and loading states

### API Services

- All API calls should be centralized in service files
- Use consistent error handling patterns
- Implement proper data transformation between API and frontend

### Styling

- Use Tailwind CSS for styling components
- Follow the established design patterns in the codebase
- Ensure responsive design for all components

## Testing

- Write unit tests for critical functionality
- Test components in isolation using mocks for services
- Ensure all tests pass before submitting a pull request

## Git Workflow

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Write tests for your changes
4. Update documentation if necessary
5. Submit a pull request with a clear description of the changes

## Working with Strapi

### Content Types

- When modifying Strapi content types, update the corresponding TypeScript interfaces
- Document any changes to the API structure
- Test API endpoints after making changes

### Authentication

- Use the established authentication patterns
- Never hardcode credentials or tokens
- Use environment variables for sensitive information

## Environment Variables

- Never commit `.env` files to the repository
- Update `.env.example` files when adding new environment variables
- Document the purpose of each environment variable

## Documentation

- Update the README.md when making significant changes
- Document complex functions and components with JSDoc comments
- Keep API documentation up-to-date

## Code Review

- All pull requests should be reviewed by at least one other developer
- Address all review comments before merging
- Ensure all tests pass before merging

## Deployment

- Follow the deployment checklist in the README.md
- Test the application thoroughly after deployment
- Monitor for any issues after deployment