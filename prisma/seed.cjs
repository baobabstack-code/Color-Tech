const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mockServices = [
  {
    id: '1',
    name: 'Premium Car Wash',
    description: 'A thorough wash and wax for your vehicle.',
    price: 59.99,
    duration: 45, // in minutes
    isActive: true,
  },
  {
    id: '2',
    name: 'Interior Detailing',
    description: 'Complete interior vacuum, shampoo, and conditioning.',
    price: 129.99,
    duration: 90,
    isActive: true,
  },
  {
    id: '3',
    name: 'Paint Correction',
    description: 'Multi-stage paint correction to remove swirls and scratches.',
    price: 499.99,
    duration: 240,
    isActive: false,
  },
];

const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0101',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0102',
  },
];

const mockBookings = [
  {
    id: '1',
    customerId: '1',
    serviceId: '2',
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    status: 'confirmed',
    notes: 'Customer has a dog, be mindful of pet hair.',
  },
  {
    id: '2',
    customerId: '2',
    serviceId: '1',
    startTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    status: 'completed',
    notes: '',
  },
];

const mockReviews = [
    {
        id: '1',
        bookingId: '2',
        customerId: '2',
        serviceId: '1',
        rating: 5,
        comment: 'Fantastic job! My car looks brand new.',
    },
    {
        id: '2',
        bookingId: '1',
        customerId: '1',
        serviceId: '2',
        rating: 4,
        comment: 'Very thorough, but took a bit longer than expected.',
    }
];

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  for (const customer of mockCustomers) {
    await prisma.user.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  }

  console.log('Seeding services...');
  for (const service of mockServices) {
    await prisma.service.create({
      data: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        isActive: service.isActive,
      },
    });
  }

  console.log('Seeding bookings...');
  for (const booking of mockBookings) {
    await prisma.booking.create({
      data: {
        id: booking.id,
        customerId: booking.customerId,
        serviceId: booking.serviceId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        notes: booking.notes,
      },
    });
  }

  console.log('Seeding reviews...');
  for (const review of mockReviews) {
    await prisma.review.create({
      data: {
        id: review.id,
        bookingId: review.bookingId,
        customerId: review.customerId,
        serviceId: review.serviceId,
        rating: review.rating,
        comment: review.comment,
      },
    });
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
