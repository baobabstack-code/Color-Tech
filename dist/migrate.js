"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
// Create a connection pool
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'color_tech_db',
});
// Migrations directory
const migrationsDir = path_1.default.join(__dirname, 'migrations');
// Ensure migrations directory exists
if (!fs_1.default.existsSync(migrationsDir)) {
    fs_1.default.mkdirSync(migrationsDir, { recursive: true });
    console.log(`Created migrations directory at ${migrationsDir}`);
}
async function runMigrations() {
    const client = await pool.connect();
    try {
        // Begin transaction
        await client.query('BEGIN');
        // Create migrations table if it doesn't exist
        await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Get list of applied migrations
        const { rows: appliedMigrations } = await client.query('SELECT name FROM migrations');
        const appliedMigrationNames = appliedMigrations.map(row => row.name);
        // Get list of migration files
        const migrationFiles = fs_1.default.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Sort to ensure migrations are applied in order
        // Apply migrations that haven't been applied yet
        for (const migrationFile of migrationFiles) {
            if (!appliedMigrationNames.includes(migrationFile)) {
                console.log(`Applying migration: ${migrationFile}`);
                // Read migration file
                const migrationPath = path_1.default.join(migrationsDir, migrationFile);
                const migrationSql = fs_1.default.readFileSync(migrationPath, 'utf8');
                // Apply migration
                await client.query(migrationSql);
                // Record migration as applied
                await client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
                console.log(`Migration applied: ${migrationFile}`);
            }
            else {
                console.log(`Migration already applied: ${migrationFile}`);
            }
        }
        // Commit transaction
        await client.query('COMMIT');
        console.log('Migrations completed successfully');
    }
    catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Error running migrations:', error);
        throw error;
    }
    finally {
        // Release client back to pool
        client.release();
        await pool.end();
    }
}
// Create a new migration file
function createMigration(name) {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    const fileName = `${timestamp}_${name}.sql`;
    const filePath = path_1.default.join(migrationsDir, fileName);
    const template = `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- Write your migration SQL here

-- Example:
-- ALTER TABLE users ADD COLUMN new_column VARCHAR(255);

`;
    fs_1.default.writeFileSync(filePath, template);
    console.log(`Created new migration: ${fileName}`);
}
// Main function
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    if (command === 'create' && args[1]) {
        // Create a new migration
        createMigration(args[1]);
    }
    else if (command === 'run' || !command) {
        // Run migrations
        await runMigrations();
    }
    else {
        console.log(`
Usage:
  ts-node database/migrate.ts create <migration-name>  - Create a new migration
  ts-node database/migrate.ts run                      - Run pending migrations
  ts-node database/migrate.ts                          - Run pending migrations
`);
    }
}
// Run the main function
main()
    .then(() => {
    process.exit(0);
})
    .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
});
