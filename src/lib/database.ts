import { PrismaClient } from "@prisma/client";

// Global Prisma instance to prevent multiple connections in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Database service class with common operations
export class DatabaseService {
  // Users
  static async getUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            service: true,
          },
        },
        reviews: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  static async createUser(data: any) {
    return await prisma.user.create({
      data,
    });
  }

  static async updateUser(id: number, data: any) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // Services
  static async getServices() {
    return await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getServicesWithStats() {
    const services = await prisma.service.findMany({
      include: {
        bookings: true,
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return services.map((service) => ({
      ...service,
      price: service.basePrice,
      duration: service.duration,
      isActive: service.status === "active",
      bookingCount: service.bookings.length,
      averageRating:
        service.reviews.length > 0
          ? service.reviews.reduce((sum, review) => sum + review.rating, 0) /
            service.reviews.length
          : 0,
    }));
  }

  static async getServiceById(id: number) {
    return await prisma.service.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            customer: true,
          },
        },
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  static async createService(data: any) {
    return await prisma.service.create({
      data,
    });
  }

  static async updateService(id: number, data: any) {
    return await prisma.service.update({
      where: { id },
      data,
    });
  }

  static async deleteService(id: number) {
    return await prisma.service.delete({
      where: { id },
    });
  }

  // Bookings
  static async getBookings() {
    return await prisma.booking.findMany({
      include: {
        customer: true,
        service: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getBookingById(id: number) {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        reviews: true,
      },
    });
  }

  static async createBooking(data: any) {
    return await prisma.booking.create({
      data,
      include: {
        customer: true,
        service: true,
      },
    });
  }

  static async updateBooking(id: number, data: any) {
    return await prisma.booking.update({
      where: { id },
      data,
      include: {
        customer: true,
        service: true,
      },
    });
  }

  static async deleteBooking(id: number) {
    return await prisma.booking.delete({
      where: { id },
    });
  }

  // Reviews
  static async getReviews() {
    return await prisma.review.findMany({
      include: {
        user: true,
        service: true,
        booking: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getReviewById(id: number) {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        service: true,
        booking: true,
      },
    });
  }

  static async createReview(data: any) {
    return await prisma.review.create({
      data,
      include: {
        user: true,
        service: true,
      },
    });
  }

  static async updateReview(id: number, data: any) {
    return await prisma.review.update({
      where: { id },
      data,
      include: {
        user: true,
        service: true,
      },
    });
  }

  static async deleteReview(id: number) {
    return await prisma.review.delete({
      where: { id },
    });
  }

  // Form Submissions
  static async getFormSubmissions() {
    return await prisma.formSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getFormSubmissionById(id: number) {
    return await prisma.formSubmission.findUnique({
      where: { id },
    });
  }

  static async createFormSubmission(data: any) {
    return await prisma.formSubmission.create({
      data,
    });
  }

  static async updateFormSubmission(id: number, data: any) {
    return await prisma.formSubmission.update({
      where: { id },
      data,
    });
  }

  static async deleteFormSubmission(id: number) {
    return await prisma.formSubmission.delete({
      where: { id },
    });
  }

  // Dashboard Stats
  static async getDashboardStats() {
    const [
      totalUsers,
      totalServices,
      totalBookings,
      totalReviews,
      completedBookings,
      recentBookings,
    ] = await Promise.all([
      0, // No longer tracking customers
      prisma.service.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.booking.findMany({
        where: { status: "completed" },
        include: { service: true },
      }),
      prisma.booking.findMany({
        take: 5,
        include: {
          customer: true,
          service: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalRevenue = completedBookings.reduce(
      (sum, booking) => sum + booking.service.basePrice,
      0
    );

    return {
      stats: {
        totalRevenue,
        totalBookings,
        totalUsers,
      },
      recentBookings: recentBookings.map((booking) => ({
        ...booking,
        startTime: booking.scheduledAt,
        customer: {
          id: booking.customer.id,
          name: booking.customer.name,
          email: booking.customer.email,
        },
        service: {
          id: booking.service.id,
          name: booking.service.name,
          basePrice: booking.service.basePrice,
        },
      })),
    };
  }

  // Content Management Methods

  // Posts/Blog
  static async getPosts() {
    return await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getBlogPosts() {
    return await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getPostById(id: number) {
    return await prisma.post.findUnique({
      where: { id },
    });
  }

  static async createPost(data: any) {
    return await prisma.post.create({
      data,
    });
  }

  static async updatePost(id: number, data: any) {
    return await prisma.post.update({
      where: { id },
      data,
    });
  }

  static async deletePost(id: number) {
    return await prisma.post.delete({
      where: { id },
    });
  }

  // Gallery
  static async getGalleryItems() {
    return await prisma.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllGalleryItems() {
    return await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getGalleryItemById(id: number) {
    return await prisma.galleryItem.findUnique({
      where: { id },
    });
  }

  static async createGalleryItem(data: any) {
    return await prisma.galleryItem.create({
      data,
    });
  }

  static async updateGalleryItem(id: number, data: any) {
    return await prisma.galleryItem.update({
      where: { id },
      data,
    });
  }

  static async deleteGalleryItem(id: number) {
    return await prisma.galleryItem.delete({
      where: { id },
    });
  }

  // FAQs
  static async getFAQs() {
    return await prisma.fAQ.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllFAQs() {
    return await prisma.fAQ.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getFAQById(id: number) {
    return await prisma.fAQ.findUnique({
      where: { id },
    });
  }

  static async createFAQ(data: any) {
    return await prisma.fAQ.create({
      data,
    });
  }

  static async updateFAQ(id: number, data: any) {
    return await prisma.fAQ.update({
      where: { id },
      data,
    });
  }

  static async deleteFAQ(id: number) {
    return await prisma.fAQ.delete({
      where: { id },
    });
  }

  // Testimonials
  static async getTestimonials() {
    return await prisma.testimonial.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllTestimonials() {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTestimonialById(id: number) {
    return await prisma.testimonial.findUnique({
      where: { id },
    });
  }

  static async createTestimonial(data: any) {
    return await prisma.testimonial.create({
      data,
    });
  }

  static async updateTestimonial(id: number, data: any) {
    return await prisma.testimonial.update({
      where: { id },
      data,
    });
  }

  static async deleteTestimonial(id: number) {
    return await prisma.testimonial.delete({
      where: { id },
    });
  }
}

export default prisma;
