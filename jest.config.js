/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // Test patterns
  testMatch: [
    '**/tests/**/*.test.ts', 
    '**/tests/**/*.test.tsx',
    '**/__tests__/**/*.{ts,tsx}',
    '**/src/**/*.{test,spec}.{ts,tsx}'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/setup.ts', 
    '<rootDir>/src/tests/jest.setup.ts'
  ],
  
  // Module mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/db$': '<rootDir>/src/lib/__mocks__/db.ts',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      useESM: false,
    }],
  },
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/tests/**/*',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/node_modules/**',
  ],
  
  coverageReporters: ['text', 'lcov', 'html', 'clover', 'json'],
  coverageDirectory: 'coverage',
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output for CI
  verbose: process.env.CI === 'true',
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
  ],
};

export default config;
