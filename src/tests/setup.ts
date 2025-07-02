import setupTestDatabase from './setup-db';

// Setup the SQLite test database before all tests
beforeAll(() => {
  setupTestDatabase();
});

// Optional: Clean up the database after all tests (e.g., delete the file)
// afterAll(() => {
//   // You might want to keep the database file for inspection after tests,
//   // or delete it if you want a completely clean slate.
//   // For now, we'll let setupTestDatabase handle deletion at the start of each run.
// });