"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Load environment variables
dotenv.config();
async function createDatabase() {
    const dbName = process.env.DB_NAME || 'color_tech_db';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = parseInt(process.env.DB_PORT || '5432');
    // Connect to PostgreSQL server (without specifying a database)
    const client = new pg_1.Client({
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        database: 'postgres' // Connect to default postgres database
    });
    try {
        await client.connect();
        console.log('Connected to PostgreSQL server');
        // Check if database exists
        const checkDbResult = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (checkDbResult.rows.length === 0) {
            // Create database if it doesn't exist
            console.log(`Creating database: ${dbName}`);
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database ${dbName} created successfully`);
        }
        else {
            console.log(`Database ${dbName} already exists`);
        }
        // Close connection to postgres database
        await client.end();
        // Connect to the newly created database
        const dbClient = new pg_1.Client({
            user: dbUser,
            password: dbPassword,
            host: dbHost,
            port: dbPort,
            database: dbName
        });
        await dbClient.connect();
        console.log(`Connected to database: ${dbName}`);
        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Execute schema
        console.log('Creating tables...');
        await dbClient.query(schema);
        console.log('Tables created successfully');
        await dbClient.end();
        console.log('Database setup completed');
        return true;
    }
    catch (error) {
        console.error('Error setting up database:', error);
        return false;
    }
}
// Run the function if this script is executed directly
if (require.main === module) {
    createDatabase()
        .then(success => {
        if (success) {
            console.log('Database initialization completed successfully');
            process.exit(0);
        }
        else {
            console.error('Database initialization failed');
            process.exit(1);
        }
    })
        .catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
exports.default = createDatabase;
