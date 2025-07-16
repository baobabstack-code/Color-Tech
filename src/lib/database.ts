import prisma from './prisma';
import { Prisma } from '@prisma/client';

// Database service class for centralized database operations
export class DatabaseService {
  // User operations
  static async getUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
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
        vehicles: true,
      },
    });
  }

  static async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }

  static async updateUser(id: number, data: Prisma.UserUpdateInput) {
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

  // Service operations
  static async getServices() {
    return await prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async getActiveServices() {
    return await prisma.service.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
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

  static async createService(data: Prisma.ServiceCreateInput) {
    return await prisma.service.create({
      data,
    });
  }

  static async updateService(id: number, data: Prisma.ServiceUpdateInput) {
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

  // Booking operations
  static async getBookings() {
    return await prisma.booking.findMany({
      include: {
        customer: true,
        service: true,
      },
      orderBy: { createdAt: 'desc' },
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

  static async createBooking(data: Prisma.BookingCreateInput) {
    return await prisma.booking.create({
      data,
      include: {
        customer: true,
        service: true,
      },
    });
  }

  static async updateBooking(id: number, data: Prisma.BookingUpdateInput) {
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

  // Review operations
  static async getReviews() {
    return await prisma.review.findMany({
      include: {
        user: true,
        service: true,
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPublishedReviews() {
    return await prisma.review.findMany({
      where: { status: 'published' },
      include: {
        user: true,
        service: true,
      },
      orderBy: { createdAt: 'desc' },
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

  static async createReview(data: Prisma.ReviewCreateInput) {
    return await prisma.review.create({
      data,
      include: {
        user: true,
        service: true,
      },
    });
  }

  static async updateReview(id: number, data: Prisma.ReviewUpdateInput) {
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

  // Blog post operations
  static async getPosts() {
    return await prisma.post.findMany({
      include: {
        creator: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPublishedPosts() {
    return await prisma.post.findMany({
      where: { isPublished: true },
      include: {
        creator: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPostById(id: number) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        creator: true,
      },
    });
  }

  static async getPostBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        creator: true,
      },
    });
  }

  static async createPost(data: Prisma.PostCreateInput) {
    return await prisma.post.create({
      data,
      include: {
        creator: true,
      },
    });
  }

  static async updatePost(id: number, data: Prisma.PostUpdateInput) {
    return await prisma.post.update({
      where: { id },
      data,
      include: {
        creator: true,
      },
    });
  }

  static async deletePost(id: number) {
    return await prisma.post.delete({
      where: { id },
    });
  }

  // Testimonial operations
  static async getTestimonials() {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getApprovedTestimonials() {
    return await prisma.testimonial.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createTestimonial(data: Prisma.TestimonialCreateInput) {
    return await prisma.testimonial.create({
      data,
    });
  }

  static async updateTestimonial(id: number, data: Prisma.TestimonialUpdateInput) {
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

  // FAQ operations
  static async getFAQs() {
    return await prisma.fAQ.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPublishedFAQs() {
    return await prisma.fAQ.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createFAQ(data: Prisma.FAQCreateInput) {
    return await prisma.fAQ.create({
      data,
    });
  }

  static async updateFAQ(id: number, data: Prisma.FAQUpdateInput) {
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

  // Form submission operations
  static async getFormSubmissions() {
    return await prisma.formSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createFormSubmission(data: Prisma.FormSubmissionCreateInput) {
    return await prisma.formSubmission.create({
      data,
    });
  }

  static async updateFormSubmission(id: number, data: Prisma.FormSubmissionUpdateInput) {
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

  // Gallery operations
  static async getGalleryItems() {
    return await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPublishedGalleryItems() {
    return await prisma.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createGalleryItem(data: Prisma.GalleryItemCreateInput) {
    return await prisma.galleryItem.create({
      data,
    });
  }

  static async updateGalleryItem(id: number, data: Prisma.GalleryItemUpdateInput) {
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

  // Dashboard statistics
  static async getDashboardStats() {
    const [
      totalUsers,
      totalServices,
      totalBookings,
      totalReviews,
      pendingBookings,
      completedBookings,
      averageRating,
      recentBookings,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.service.count({ where: { status: 'active' } }),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'completed' } }),
      prisma.review.aggregate({
        _avg: { rating: true },
      }),
      prisma.booking.findMany({
        take: 10,
        include: {
          customer: true,
          service: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      totalUsers,
      totalServices,
      totalBookings,
      totalReviews,
      pendingBookings,
      completedBookings,
      averageRating: averageRating._avg.rating || 0,
      recentBookings,
    };
  }
}

export default DatabaseService;