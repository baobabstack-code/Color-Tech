// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'; // Set API URL for tests

// Increase timeout for tests
jest.setTimeout(10000);

// Mock the database connection
jest.mock('../lib/db', () => { // Updated path to src/lib/db
  return {
    query: jest.fn(),
    // Add other methods if they are used in API routes and need mocking
  };
});

// Mock the logger to prevent console output during tests
jest.mock('../utils/logger', () => { // Keep this mock as logger is still used
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