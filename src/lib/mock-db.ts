// This file acts as a centralized in-memory database for the application.

export let services = [
  {
    id: 1,
    name: 'Premium Car Wash',
    description: 'A thorough wash and wax for your vehicle.',
    price: 59.99,
    duration: 45, // in minutes
    isActive: true,
  },
  {
    id: 2,
    name: 'Interior Detailing',
    description: 'Complete interior vacuum, shampoo, and conditioning.',
    price: 129.99,
    duration: 90,
    isActive: true,
  },
  {
    id: 3,
    name: 'Paint Correction',
    description: 'Multi-stage paint correction to remove swirls and scratches.',
    price: 499.99,
    duration: 240,
    isActive: false,
  },
];

export let customers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0101',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0102',
  },
];

export let bookings = [
  {
    id: 1,
    customerId: 1,
    serviceId: 2,
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    status: 'confirmed',
    notes: 'Customer has a dog, be mindful of pet hair.',
  },
  {
    id: 2,
    customerId: 2,
    serviceId: 1,
    startTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    status: 'completed',
    notes: '',
  },
];

export let reviews = [
  {
    id: 1,
    bookingId: 2,
    customerId: 2,
    serviceId: 1,
    rating: 5,
    comment: 'Fantastic job! My car looks brand new.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    bookingId: 1,
    customerId: 1,
    serviceId: 2,
    rating: 4,
    comment: 'Very thorough, but took a bit longer than expected.',
    createdAt: new Date().toISOString(),
  }
];

export let settings = {
  general: {
    siteTitle: 'Color-Tech',
    businessName: 'Color-Tech Auto',
    contactEmail: 'contact@color-tech.com',
    contactPhone: '+1 (555) 123-4567',
  },
  profile: {
    fullName: 'Admin User',
    email: 'admin@color-tech.com',
  },
  appearance: {
    themeColor: '#000000',
    logoUrl: null,
    heroImageUrl: null,
    fallbackImageUrl: null,
    carouselImageUrls: [] as string[],
  },
  booking: {
    defaultDuration: 60,
    bookingWindow: 30,
    cancellationPolicy: 'Cancellations must be made at least 24 hours in advance.',
    enableOnlineBooking: true,
  },
  notifications: {
    newBookings: true,
    cancellations: true,
    newReviews: false,
  },
  integrations: {
    googleCalendar: false,
    stripe: true,
    mailchimp: false,
  },
};
