import { PrismaClient } from '@prisma/client';
import {
  customers as mockCustomers,
  services as mockServices,
  bookings as mockBookings,
  reviews as mockReviews,
} from '../src/lib/mock-db';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const createdUsers = [];
  for (const customer of mockCustomers) {
    const user = await prisma.user.create({
      data: {
        id: Number(customer.id), // Convert to number
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
    createdUsers.push(user);
    console.log(`Created user with id: ${user.id}`);
  }

  console.log('Seeding admin user...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await hash('password123', 12),
    },
  });
  console.log(`Created admin user with id: ${admin.id}`);

  console.log('Seeding services...');
  const createdServices = [];
  for (const service of mockServices) {
    const newService = await prisma.service.create({
      data: {
        id: Number(service.id), // Convert to number
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        isActive: service.isActive,
      },
    });
    createdServices.push(newService);
    console.log(`Created service with id: ${newService.id}`);
  }

  const sampleServices = await Promise.all([
    prisma.service.upsert({
      where: { name: 'Haircut' },
      update: {},
      create: {
        name: 'Haircut',
        description: 'Professional haircut service',
        price: 30.00,
        duration: 30,
      },
    }),
    prisma.service.upsert({
      where: { name: 'Massage' },
      update: {},
      create: {
        name: 'Massage',
        description: 'Professional massage service',
        price: 60.00,
        duration: 60,
      },
    }),
    prisma.service.upsert({
      where: { name: 'Nail Care' },
      update: {},
      create: {
        name: 'Nail Care',
        description: 'Professional nail care service',
        price: 45.00,
        duration: 45,
      },
    }),
  ]);
  console.log(`Created sample services: ${sampleServices.map((service) => service.name).join(', ')}`);

  console.log('Seeding bookings...');
  const createdBookings = [];
  for (const booking of mockBookings) {
    const newBooking = await prisma.booking.create({
      data: {
        id: Number(booking.id), // Convert to number
        customerId: Number(booking.customerId), // Convert to number
        serviceId: Number(booking.serviceId), // Convert to number
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status as any, // Cast because enum name differs slightly
        notes: booking.notes,
      },
    });
    createdBookings.push(newBooking);
    console.log(`Created booking with id: ${newBooking.id}`);
  }

  console.log('Seeding reviews...');
  for (const review of mockReviews) {
    await prisma.review.create({
      data: {
        id: Number(review.id), // Convert to number
        bookingId: Number(review.bookingId), // Convert to number
        customerId: Number(review.customerId), // Convert to number
        serviceId: Number(review.serviceId), // Convert to number
        rating: review.rating,
        comment: review.comment,
      },
    });
    console.log(`Created review with id: ${review.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
