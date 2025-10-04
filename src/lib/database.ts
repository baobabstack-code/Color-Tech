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

  static async getUserById(id: string) {
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

  static async updateUser(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: string) {
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

    const totalRevenue = 0; // Revenue tracking removed

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
        },
      })),
    };
  }

  // Content Management Methods

  // Posts/Blog
  static async getPosts() {
    return await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        body: true,
        imageUrl: true,
        videoUrl: true,
        isPublished: true,
        tags: true,
        author: true,
        slug: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async getBlogPosts() {
    return await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        body: true,
        imageUrl: true,
        videoUrl: true,
        isPublished: true,
        tags: true,
        author: true,
        slug: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async getPostById(id: number) {
    return await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        imageUrl: true,
        videoUrl: true,
        isPublished: true,
        tags: true,
        author: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  static async createPost(data: {
    title: string;
    body: string;
    imageUrl?: string;
    videoUrl?: string;
    isPublished?: boolean;
    tags?: string;
    author: string;
    slug: string;
    createdBy: number;
    updatedBy: number;
  }) {
    return await prisma.post.create({
      data: {
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        isPublished: data.isPublished ?? false,
        tags: data.tags,
        author: data.author,
        slug: data.slug,
        createdBy: String(data.createdBy),
        updatedBy: String(data.updatedBy)
      },
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
      select: {
        id: true,
        title: true,
        body: true,
        imageUrl: true,
        beforeImageUrl: true,
        afterImageUrl: true,
        videoUrl: true,
        type: true,
        isPublished: true,
        tags: true,
        author: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async getAllGalleryItems() {
    return await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        body: true,
        imageUrl: true,
        beforeImageUrl: true,
        afterImageUrl: true,
        videoUrl: true,
        type: true,
        isPublished: true,
        tags: true,
        author: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async getGalleryItemById(id: number) {
    return await prisma.galleryItem.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        imageUrl: true,
        beforeImageUrl: true,
        afterImageUrl: true,
        videoUrl: true,
        type: true,
        isPublished: true,
        tags: true,
        author: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async createGalleryItem(data: {
    title: string;
    body?: string;
    imageUrl: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    videoUrl?: string;
    type?: string;
    isPublished?: boolean;
    tags?: string;
    author: string;
    createdBy: string;
    updatedBy: string;
  }) {
    return await prisma.galleryItem.create({
      data: {
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl,
        beforeImageUrl: data.beforeImageUrl,
        afterImageUrl: data.afterImageUrl,
        videoUrl: data.videoUrl,
        type: data.type || 'single_image',
        isPublished: data.isPublished ?? false,
        tags: data.tags,
        author: data.author,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy
      },
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

  // Videos
  static async getVideos() {
    return await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        videoUrl: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async createVideo(data: {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    videoUrl: string;
    isPublished?: boolean;
  }) {
    return await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        videoUrl: data.videoUrl,
        isPublished: data.isPublished ?? true
      }
    });
  }

  static async deleteVideo(id: number) {
    return await prisma.video.delete({ where: { id } });
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

  // Homepage Sections
  static async getHomepageSections() {
    try {
      return await prisma.homepageSection.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error('Homepage sections table may not exist yet:', error);
      return [];
    }
  }

  static async getAllHomepageSections() {
    try {
      return await prisma.homepageSection.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error('Homepage sections table may not exist yet:', error);
      return [];
    }
  }

  static async getHomepageSectionByKey(sectionKey: string) {
    try {
      return await prisma.homepageSection.findUnique({
        where: { sectionKey },
      });
    } catch (error) {
      console.error('Homepage sections table may not exist yet:', error);
      return null;
    }
  }

  static async createHomepageSection(data: {
    sectionKey: string;
    title: string;
    subtitle?: string;
    description?: string;
    isActive?: boolean;
  }) {
    return await prisma.homepageSection.create({
      data: {
        sectionKey: data.sectionKey,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateHomepageSection(id: number, data: any) {
    return await prisma.homepageSection.update({
      where: { id },
      data,
    });
  }

  static async deleteHomepageSection(id: number) {
    return await prisma.homepageSection.delete({
      where: { id },
    });
  }
}

export default prisma;
