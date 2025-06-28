import { Client } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
// Load environment variables
dotenv.config();
// Database connection config
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'color_tech_db'
};
async function seedDatabase() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log('Connected to database');
        // Start transaction
        await client.query('BEGIN');
        // Seed users
        console.log('Seeding users...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        // Create admin user
        await client.query(`
      INSERT INTO users (email, password, first_name, last_name, role, phone, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, ['admin@colortech.com', hashedPassword, 'Admin', 'User', 'admin', '1234567890', true]);
        // Create staff user
        await client.query(`
      INSERT INTO users (email, password, first_name, last_name, role, phone, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, ['staff@colortech.com', hashedPassword, 'Staff', 'User', 'staff', '1234567891', true]);
        // Create client users
        for (let i = 0; i < 10; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email({ firstName, lastName }).toLowerCase();
            const phone = faker.string.numeric(10); // Generate a 10-digit phone number
            await client.query(`
        INSERT INTO users (email, password, first_name, last_name, role, phone, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
      `, [email, hashedPassword, firstName, lastName, 'client', phone, true]);
        }
        // Seed service categories
        console.log('Seeding service categories...');
        const categories = [
            { name: 'Exterior Detailing', description: 'Services focused on the exterior of your vehicle' },
            { name: 'Interior Detailing', description: 'Services focused on the interior of your vehicle' },
            { name: 'Paint Correction', description: 'Services to restore and protect your vehicle\'s paint' },
            { name: 'Protection Services', description: 'Long-term protection for your vehicle' },
            { name: 'Specialty Services', description: 'Specialized services for specific needs' }
        ];
        for (const category of categories) {
            await client.query(`
        INSERT INTO service_categories (name, description, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT (name) DO NOTHING
      `, [category.name, category.description]);
        }
        // Get category IDs
        const categoryResult = await client.query('SELECT id, name FROM service_categories');
        const categoryMap = new Map();
        categoryResult.rows.forEach(row => {
            categoryMap.set(row.name, row.id);
        });
        // Seed services
        console.log('Seeding services...');
        const services = [
            {
                name: 'Basic Wash',
                description: 'Exterior hand wash and dry',
                price: 29.99,
                duration_minutes: 30,
                category: 'Exterior Detailing'
            },
            {
                name: 'Premium Wash',
                description: 'Exterior hand wash, dry, and tire shine',
                price: 49.99,
                duration_minutes: 45,
                category: 'Exterior Detailing'
            },
            {
                name: 'Interior Vacuum',
                description: 'Thorough interior vacuum and dusting',
                price: 39.99,
                duration_minutes: 30,
                category: 'Interior Detailing'
            },
            {
                name: 'Full Interior Detail',
                description: 'Complete interior cleaning including seats, carpets, and surfaces',
                price: 149.99,
                duration_minutes: 120,
                category: 'Interior Detailing'
            },
            {
                name: 'Paint Correction - One Step',
                description: 'Single stage paint correction to remove light scratches',
                price: 199.99,
                duration_minutes: 180,
                category: 'Paint Correction'
            },
            {
                name: 'Paint Correction - Two Step',
                description: 'Two stage paint correction for moderate to severe scratches',
                price: 349.99,
                duration_minutes: 300,
                category: 'Paint Correction'
            },
            {
                name: 'Ceramic Coating',
                description: 'Professional ceramic coating application',
                price: 699.99,
                duration_minutes: 480,
                category: 'Protection Services'
            },
            {
                name: 'Paint Protection Film',
                description: 'Clear bra installation on high-impact areas',
                price: 899.99,
                duration_minutes: 360,
                category: 'Protection Services'
            },
            {
                name: 'Headlight Restoration',
                description: 'Restore cloudy or yellowed headlights',
                price: 79.99,
                duration_minutes: 60,
                category: 'Specialty Services'
            },
            {
                name: 'Odor Removal',
                description: 'Professional odor elimination treatment',
                price: 129.99,
                duration_minutes: 90,
                category: 'Specialty Services'
            }
        ];
        for (const service of services) {
            const categoryId = categoryMap.get(service.category);
            if (categoryId) {
                await client.query(`
          INSERT INTO services (name, description, price, duration_minutes, category_id, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          ON CONFLICT (name) DO NOTHING
        `, [service.name, service.description, service.price, service.duration_minutes, categoryId, true]);
            }
        }
        // Get client users for vehicles and bookings
        const clientsResult = await client.query(`SELECT id FROM users WHERE role = 'client'`);
        const clientIds = clientsResult.rows.map(row => row.id);
        // Seed vehicles
        console.log('Seeding vehicles...');
        const carBrands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Nissan', 'Hyundai'];
        const carColors = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown'];
        for (const clientId of clientIds) {
            const numVehicles = Math.floor(Math.random() * 3) + 1; // 1-3 vehicles per client
            for (let i = 0; i < numVehicles; i++) {
                const make = carBrands[Math.floor(Math.random() * carBrands.length)];
                const model = faker.vehicle.model();
                const year = faker.number.int({ min: 2010, max: 2023 });
                const color = carColors[Math.floor(Math.random() * carColors.length)];
                const licensePlate = faker.vehicle.vrm();
                const vin = faker.vehicle.vin();
                await client.query(`
          INSERT INTO vehicles (user_id, make, model, year, color, license_plate, vin, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `, [clientId, make, model, year, color, licensePlate, vin]);
            }
        }
        // Seed bookings
        console.log('Seeding bookings...');
        // Get services
        const servicesResult = await client.query('SELECT id, price FROM services');
        const services_list = servicesResult.rows;
        // Get vehicles
        const vehiclesResult = await client.query('SELECT id, user_id FROM vehicles');
        const vehicles = vehiclesResult.rows;
        // Booking statuses
        const statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
        // Create bookings
        for (let i = 0; i < 20; i++) {
            const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
            const userId = vehicle.user_id;
            const vehicleId = vehicle.id;
            // Random date in the past 30 days or next 30 days
            const daysOffset = Math.floor(Math.random() * 60) - 30;
            const bookingDate = new Date();
            bookingDate.setDate(bookingDate.getDate() + daysOffset);
            // Random time between 9 AM and 5 PM
            const hour = Math.floor(Math.random() * 8) + 9;
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`;
            // Random status based on date
            let status;
            if (daysOffset < -1) {
                // Past bookings
                status = statuses[Math.floor(Math.random() * 3) + 2]; // in_progress, completed, or cancelled
            }
            else if (daysOffset === -1 || daysOffset === 0) {
                // Today or yesterday
                status = statuses[Math.floor(Math.random() * 3) + 1]; // confirmed, in_progress, or completed
            }
            else {
                // Future bookings
                status = statuses[Math.floor(Math.random() * 2)]; // pending or confirmed
            }
            // Random services (1-3)
            const numServices = Math.floor(Math.random() * 3) + 1;
            const selectedServices = [];
            let totalPrice = 0;
            for (let j = 0; j < numServices; j++) {
                const service = services_list[Math.floor(Math.random() * services_list.length)];
                if (!selectedServices.some(s => s.id === service.id)) {
                    selectedServices.push(service);
                    totalPrice += parseFloat(service.price);
                }
            }
            // Insert booking
            const bookingResult = await client.query(`
        INSERT INTO bookings (user_id, vehicle_id, booking_date, start_time, end_time, status, total_price, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id
      `, [userId, vehicleId, bookingDate.toISOString().split('T')[0], startTime, endTime, status, totalPrice]);
            const bookingId = bookingResult.rows[0].id;
            // Insert booking items
            for (const service of selectedServices) {
                await client.query(`
          INSERT INTO booking_items (booking_id, service_id, price, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
        `, [bookingId, service.id, service.price]);
            }
        }
        // Commit transaction
        await client.query('COMMIT');
        console.log('Database seeded successfully');
        return true;
    }
    catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error('Error seeding database:', error);
        return false;
    }
    finally {
        await client.end();
    }
}
// Run the function if this script is executed directly
if (require.main === module) {
    seedDatabase()
        .then(success => {
        if (success) {
            console.log('Database seeding completed successfully');
            process.exit(0);
        }
        else {
            console.error('Database seeding failed');
            process.exit(1);
        }
    })
        .catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
export default seedDatabase;
