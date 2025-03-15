import { Client } from 'pg';
import { config } from './config';

async function testDatabaseConnection() {
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

    // Test query to get user count
    const userResult = await client.query('SELECT COUNT(*) FROM users');
    console.log(`Total users in database: ${userResult.rows[0].count}`);

    // Test query to get service categories
    const categoryResult = await client.query('SELECT * FROM service_categories');
    console.log('Service categories:');
    categoryResult.rows.forEach(category => {
      console.log(`- ${category.name}: ${category.description}`);
    });

    // Test query to get services
    const serviceResult = await client.query('SELECT * FROM services LIMIT 5');
    console.log('Services (first 5):');
    serviceResult.rows.forEach(service => {
      console.log(`- ${service.name}: $${service.price} (${service.duration_minutes} minutes)`);
    });

    // Test query to get bookings
    const bookingResult = await client.query('SELECT COUNT(*) FROM bookings');
    console.log(`Total bookings in database: ${bookingResult.rows[0].count}`);

    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await client.end();
  }
}

// Run the test
testDatabaseConnection(); 