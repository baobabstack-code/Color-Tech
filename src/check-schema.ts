import { Client } from 'pg';
import { config } from './config';

async function checkDatabaseSchema() {
  const client = new Client({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    database: config.db.database
  });

  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Successfully connected to PostgreSQL database!');

    // Get list of tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    const tablesResult = await client.query(tablesQuery);
    console.log('\nDatabase Tables:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    // For each table, get its columns
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `;
      
      const columnsResult = await client.query(columnsQuery, [tableName]);
      console.log(`\nTable: ${tableName}`);
      console.log('Columns:');
      columnsResult.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });
    }

    console.log('\nSchema check completed successfully!');
  } catch (error) {
    console.error('Error checking database schema:', error);
  } finally {
    await client.end();
  }
}

// Run the check
checkDatabaseSchema(); 