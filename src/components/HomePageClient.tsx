"use client";

import Link from "next/link";
import Image from "next/image";
import { EnhancedImage } from "@/components/ui/enhanced-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Wrench,
  Car,
  Star,
  Clock,
  CheckCircle,
  PhoneCall,
  Users,
  Shield,
  ArrowRight,
  Quote,
  Camera,
  Settings,
  Hammer,
  Paintbrush,
} from "lucide-react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import CTA from "@/components/CTA";
import VideoShowcase from "@/components/VideoShowcase";
import { Service } from "@/services/serviceService";

// Define interfaces for fetched data

interface Testimonial {
  id: number;
  user_id: number;
  service_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  service_name: string;
}

interface GalleryItem {
  id: number;
  title: string;
  body: string | null;
  imageUrl: string;
  isPublished: boolean;
  tags: string | null;
  author: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: number;
  title: string;
  content_type: string;
  body: string;
  image_url: string | null;
  is_published: boolean;
  tags: string | null;
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

interface HomePageClientProps {
  featuredPosts: BlogPost[];
  testimonials: Testimonial[];
  galleryPreviews: GalleryItem[];
  services: Service[];
  homepageSections: Record<string, {
    title: string;
    subtitle?: string;
    description?: string;
  }>;
}

export default function HomePageClient({
  featuredPosts,
  testimonials,
  galleryPreviews,
  services,
  homepageSections,
}: HomePageClientProps) {

  const features = [
    {
      icon: <Wrench className="h-8 w-8 text-primary dark:text-sky-400" />,
      title: "Expert Panel Beating",
      description: "Professional repair services for all vehicle types",
    },
    {
      icon: <Car className="h-8 w-8 text-primary dark:text-sky-400" />,
      title: "Spray Painting",
      description: "Premium quality paint jobs and color matching",
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400 dark:text-yellow-400" />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee on all services",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary dark:text-sky-400" />,
      title: "Quick Turnaround",
      description: "Efficient service with minimal downtime",
    },
  ];

  const stats = [
    { value: "1000+", label: "Satisfied Customers" },
    { value: "15+", label: "Years Experience" },
    { value: "4.9", label: "Average Rating" },
    { value: "100%", label: "Quality Guarantee" },
  ];

  const process = [
    {
      icon: <Camera className="h-12 w-12 text-primary dark:text-sky-400" />,
      title: "Initial Assessment",
      description: "We thoroughly inspect your vehicle and document all damage",
    },
    {
      icon: <Settings className="h-12 w-12 text-primary dark:text-sky-400" />,
      title: "Repair Planning",
      description: "Our experts create a detailed repair plan and timeline",
    },
    {
      icon: <Wrench className="h-12 w-12 text-primary dark:text-sky-400" />,
      title: "Expert Repairs",
      description: "Skilled technicians perform the necessary repairs",
    },
    {
      icon: (
        <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400" />
      ),
      title: "Quality Check",
      description: "Multiple quality checks ensure perfect results",
    },
  ];

  // Process data for rendering
  const displayedServices = services
    .slice(0, 3)
    .map((service: Service, index: number) => ({
      id: service.id,
      icon: service.name.includes("Panel") ? (
        <Wrench className="h-10 w-10 text-primary dark:text-sky-400" />
      ) : service.name.includes("Paint") ? (
        <Paintbrush className="h-10 w-10 text-primary dark:text-sky-400" />
      ) : service.name.includes("Rust") ? (
        <Shield className="h-10 w-10 text-primary dark:text-sky-400" />
      ) : service.name.includes("Bumper") ? (
        <Car className="h-10 w-10 text-primary dark:text-sky-400" />
      ) : (
        <Wrench className="h-10 w-10 text-primary dark:text-sky-400" />
      ), // Default
      title: service.name,
      description: service.description,
      link: service.name.toLowerCase().replace(/\s/g, "-"), // Generate slug from name
    }));



  const displayedTestimonials = testimonials
    .slice(0, 3)
    .map((t: any, index: number) => ({
      name:
        t.name || `${t.user_first_name || ""} ${t.user_last_name || ""}`.trim(),
      role: t.role || t.user_email || "Customer",
      image: t.image || "/images/fallbacks/avatar-fallback.jpg",
      quote: t.quote || t.comment || "Great service!",
      rating: t.rating || 5,
    }));

  const displayedGalleryPreviews = galleryPreviews
    .slice(0, 2)
    .map((g: GalleryItem, index: number) => {
      return {
        image: g.imageUrl || "/colortech/4.jpg", // Use actual image from database
        title: g.title,
        description: g.body || "Professional automotive repair and restoration work",
      };
    });

  return (
    <>
      <Toaster />
      <div className="min-h-screen">


        {/* Hero Section */}
        <div className="mx-auto px-4 sm:px-8 md:px-16 lg:px-24 mt-32 md:mt-36">
          <motion.div
            className="relative h-[75vh] flex items-center justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 z-0 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-2xl backdrop-saturate-200 overflow-hidden"
              style={{
                backgroundImage: `url('/images/hero/colorful-car.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-br from-sky-200/20 via-fuchsia-100/20 to-emerald-100/20 dark:from-slate-900/60 dark:via-slate-950/60 dark:to-slate-900/60" />
            </div>
            {/* Content */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                Transform Your Vehicle
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Expert panel beating and spray painting services with guaranteed
                results
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/90 hover:bg-white w-full sm:w-auto shadow-xl text-primary"
                  asChild
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-blue" />
                    Get a Quote
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/90 hover:bg-white w-full sm:w-auto shadow-xl text-primary"
                  asChild
                >
                  <Link href="/services">Our Services</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
              {homepageSections.why_choose_us?.title || "Why Choose Us"}
            </h2>
            {homepageSections.why_choose_us?.subtitle && (
              <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {homepageSections.why_choose_us.subtitle}
              </h3>
            )}
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {homepageSections.why_choose_us?.description ||
                "We combine expertise, quality, and customer service to deliver the best auto body repair experience"}
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white/90 dark:bg-slate-800/80 rounded-2xl shadow-xl border dark:border-slate-700 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.07 }}
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Services Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-primary dark:text-white">
                {homepageSections.our_services?.title || "Our Services"}
              </h2>
              {homepageSections.our_services?.subtitle && (
                <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                  {homepageSections.our_services.subtitle}
                </h3>
              )}
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {homepageSections.our_services?.description ||
                  "Comprehensive auto body repair and painting services"}
              </p>
            </div>



            <div className="grid md:grid-cols-3 gap-8">
              {displayedServices && displayedServices.length > 0 ? (
                displayedServices.map((service, index) => (
                  <div
                    key={service.id || index}
                    className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border dark:border-slate-700"
                  >
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {service.description}
                    </p>
                    <Link
                      href={`/services/${service.id}`}
                      className="text-primary dark:text-sky-400 font-semibold hover:underline"
                    >
                      Learn More →
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No services available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary dark:text-white">
                Our Process
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                A streamlined and transparent process from start to finish,
                ensuring your peace of mind.
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-slate-700" />
              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                {process.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mt-6 mb-2 text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <h3 className="text-4xl font-bold text-primary dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Preview Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                {homepageSections.transformation_gallery?.title || "Transformation Gallery"}
              </h2>
              {homepageSections.transformation_gallery?.subtitle && (
                <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                  {homepageSections.transformation_gallery.subtitle}
                </h3>
              )}
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                {homepageSections.transformation_gallery?.description ||
                  "See the dramatic transformations we achieve through our expert repair and restoration work"}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {displayedGalleryPreviews.map((preview, index) => (
                <Link key={index} href="/gallery" className="block">
                  <div className="group relative overflow-hidden rounded-2xl shadow-xl border dark:border-slate-700 bg-white/10 dark:bg-slate-800/80 hover:scale-[1.02] transition-transform duration-300">
                    <div className="aspect-video relative">
                      <Image
                        src={preview.image}
                        alt={`${preview.title} - Professional automotive repair work`}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                        quality={80}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 rounded-2xl">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-300">
                        {preview.title}
                      </h3>
                      <p className="text-gray-200 mb-4 group-hover:text-gray-50">
                        {preview.description}
                      </p>
                      <div className="flex items-center text-sm text-white/80">
                        <span>Click to view gallery</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Real stories from satisfied clients who trust us with their vehicles.
              </p>
            </div>



            <div className="grid md:grid-cols-3 gap-8">
              {displayedTestimonials && displayedTestimonials.length > 0 ? (
                displayedTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border dark:border-slate-700"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-primary dark:text-sky-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300 dark:text-slate-600"}`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 dark:text-gray-300 italic">
                      <Quote className="h-5 w-5 text-gray-300 dark:text-slate-600 mr-2 inline-block" />
                      {testimonial.quote}
                    </blockquote>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No testimonials available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Showcase Section (dynamic) */}
        <VideoShowcase videos={[]} />

        {/* Blog Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                From Our Blog
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Stay updated with the latest news, tips, and insights from our
                experts.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden rounded-2xl shadow-xl border dark:border-slate-700 bg-white/10 dark:bg-slate-800/80 h-full flex flex-col hover:scale-[1.02] transition-transform duration-300">
                    {post.image_url && (
                      <div className="relative h-48">
                        <EnhancedImage
                          src={post.image_url}
                          alt={`Blog post featured image: ${post.title}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="group-hover:scale-105 transition-transform duration-300"
                          contentType="blog"
                          imageOptions={{
                            width: 400,
                            height: 192,
                            quality: 75,
                            format: 'auto',
                            crop: 'fill'
                          }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          longDescription={`Featured image for the blog post titled "${post.title}". This image provides visual context for the article content.`}
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-sky-400">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                        {post.body.substring(0, 100)}...
                      </p>
                      <div className="mt-auto flex items-center text-sm text-primary dark:text-sky-400 font-semibold">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <CTA />
      </div>
    </>
  );
}
