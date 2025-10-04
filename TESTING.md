# Automated Testing Setup for Color-Tech

## Overview

This document describes the comprehensive automated testing setup for the Color-Tech application, including local development testing and CI/CD pipeline integration.

## 🚀 Quick Start

### Run All Tests Automatically
```bash
npm run test:auto
```

This single command runs the complete test suite including:
- ✅ Linting checks
- ✅ TypeScript compilation
- ✅ Unit tests  
- ✅ Integration tests
- ✅ Coverage reporting
- ✅ Build verification

## 📋 Available Test Commands

### Basic Testing
```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Specific Test Types
```bash
# Unit tests only
npm run test:unit

# Integration tests only  
npm run test:integration

# CI-specific test run (no watch mode)
npm run test:ci
```

### Debugging & Maintenance
```bash
# Debug tests
npm run test:debug

# Update snapshots
npm run test:update-snapshots

# Run automated test suite
npm run test:auto
```

## 🔧 Test Configuration

### Jest Configuration
- **Config File**: `jest.config.js`
- **Setup**: `src/tests/jest.setup.ts`
- **TypeScript Config**: `tsconfig.jest.json`

### Key Features
- ✅ TypeScript support
- ✅ JSX/React testing
- ✅ Automatic mocking for Next.js components
- ✅ Coverage reporting with thresholds
- ✅ Module path mapping (@/ aliases)

### Coverage Thresholds
- Branches: 60%
- Functions: 60% 
- Lines: 60%
- Statements: 60%

## 🤖 CI/CD Integration

### GitHub Actions Workflow
- **File**: `.github/workflows/test.yml`
- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Node.js Versions**: 18.x, 20.x

### CI Pipeline Steps
1. **Checkout code**
2. **Install dependencies** 
3. **Lint checking** (`npm run lint`)
4. **Type checking** (`npx tsc --noEmit`)
5. **Unit tests** (`npm run test:unit`)  
6. **Integration tests** (`npm run test:integration`)
7. **Coverage report** (`npm run test:coverage`)
8. **Build verification** (`npm run build`)
9. **Security audit** (`npm audit`)

### Parallel Jobs
- **Main Test Suite**: Runs on Node 18.x and 20.x
- **Security Audit**: Runs independently

## 📊 Coverage Reporting

### Local Coverage
```bash
npm run test:coverage
```
- HTML Report: `coverage/index.html`
- LCOV Report: `coverage/lcov.info`
- JSON Report: `coverage/coverage.json`

### CI Coverage
- Automatically uploaded to Codecov
- Coverage status checks on PRs
- Historical coverage tracking

## 🧪 Test Structure

### Directory Organization
```
src/
├── tests/                  # Test files
│   ├── setup.ts           # Test database setup
│   ├── jest.setup.ts      # Jest configuration  
│   ├── *.test.ts          # Unit tests
│   ├── *.test.tsx         # Component tests
│   └── *integration.test.ts # Integration tests
├── components/            # Component source
├── lib/                   # Utility functions
└── services/              # Business logic
```

### Test Types

#### Unit Tests
- Test individual functions/components
- Fast execution
- No external dependencies
- Pattern: `*.test.ts`, `*.test.tsx`

#### Integration Tests  
- Test component interactions
- API endpoint testing
- Database integration
- Pattern: `*integration.test.ts`

## 🔍 Mocking Strategy

### Automatic Mocks
- **Next.js Router**: `next/router`
- **Next.js Image**: `next/image`  
- **localStorage**: Global mock
- **fetch**: Global mock
- **IntersectionObserver**: Browser API mock
- **ResizeObserver**: Browser API mock

### Database Mocking
- In-memory SQLite for tests
- Prisma mock layer
- Test data factories

## 🐛 Debugging Tests

### VS Code Debugging
1. Set breakpoints in test files
2. Run: `npm run test:debug`
3. Attach VS Code debugger to Node process

### Test Debugging Tips
- Use `describe.only()` and `it.only()` for focus
- Add `console.log()` for debugging (removed in CI)
- Check `coverage/index.html` for uncovered code

## 🚨 Common Issues & Solutions

### Test Timeout Issues
```bash
# Increase timeout in jest.config.js
testTimeout: 30000
```

### Mock Issues
```bash
# Clear mocks between tests (automatic in setup)
jest.clearAllMocks()
```

### Coverage Issues
```bash
# Update coverage thresholds in jest.config.js
coverageThreshold: {
  global: {
    branches: 60,
    functions: 60,
    lines: 60,
    statements: 60
  }
}
```

### Build Failures in CI
1. Check Node.js version compatibility
2. Verify all dependencies are in package.json  
3. Check environment variables
4. Review GitHub Actions logs

## 📈 Test Performance

### Optimization Tips
- Use `jest --maxWorkers=50%` for CI
- Mock heavy external dependencies
- Keep test files focused and small
- Use test data factories for consistency

### Performance Monitoring
- Test execution time tracking
- Coverage calculation time
- CI pipeline duration monitoring

## 🔐 Security Testing

### Automated Security Checks
- `npm audit` in CI pipeline
- `audit-ci` for threshold enforcement
- Dependency vulnerability scanning

### Security Test Commands
```bash
# Run security audit
npm audit

# Run with specific severity level
npm audit --audit-level moderate

# Fix automatically (use with caution)
npm audit fix
```

## 🚀 Deployment Integration

### Pre-deployment Checks
The automated test suite ensures:
1. ✅ Code quality standards
2. ✅ Type safety  
3. ✅ Functional correctness
4. ✅ Build success
5. ✅ Security compliance

### Deployment Pipeline
1. **Push to main** → Triggers tests
2. **Tests pass** → Deployment allowed
3. **Tests fail** → Deployment blocked

## 📝 Contributing to Tests

### Adding New Tests
1. Create test file: `*.test.ts` or `*.test.tsx`
2. Follow naming convention: `ComponentName.test.tsx`
3. Use describe blocks for organization
4. Write descriptive test names
5. Include both positive and negative cases

### Test Best Practices
- **Arrange, Act, Assert** pattern
- **One assertion per test** (when possible)
- **Descriptive test names** 
- **Clean test data** 
- **Mock external dependencies**

## 📞 Support

For testing issues:
1. Check this documentation
2. Review test logs and error messages
3. Check GitHub Issues for similar problems
4. Contact development team

---

**Happy Testing! 🧪✨**