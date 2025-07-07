import setupTestDatabase from './setup-db';

// This file needs to be updated to work with Strapi instead of SQLite
// Setup the test environment before all tests
beforeAll(() => {
  // Call the updated setupTestDatabase function
  setupTestDatabase();
});

// Optional: Clean up the database after all tests (e.g., delete the file)
// afterAll(() => {
//   // You might want to keep the database file for inspection after tests,
//   // or delete it if you want a completely clean slate.
//   // For now, we'll let setupTestDatabase handle deletion at the start of each run.
// });