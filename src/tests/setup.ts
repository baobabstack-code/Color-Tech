// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

// Increase timeout for tests
jest.setTimeout(10000);

// Mock the database connection
jest.mock('../utils/db', () => {
  return {
    query: jest.fn(),
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
  };
});

// Mock the logger to prevent console output during tests
jest.mock('../utils/logger', () => {
  return {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };
});

// Global teardown
afterAll(async () => {
  // Clean up any resources if needed
}); 