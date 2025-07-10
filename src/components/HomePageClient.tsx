"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Wrench, Car, Star, Clock,
  CheckCircle, PhoneCall, Users,
  Shield, ArrowRight, Quote,
  Camera, Settings, Hammer, Paintbrush
} from "lucide-react";
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/sonner";

// Define interfaces for fetched data
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
}

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
  content_type: string;
  body: string; // JSON string
  image_url: string;
  is_published: boolean;
  tags: string | null;
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
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
}

export default function HomePageClient({ featuredPosts, testimonials, galleryPreviews, services }: HomePageClientProps) {
  const features = [
    {
      icon: <Wrench className="h-8 w-8 text-primary dark:text-white" />, // always visible
      title: "Expert Panel Beating",
      description: "Professional repair services for all vehicle types"
    },
    {
      icon: <Car className="h-8 w-8 text-primary dark:text-white" />,
      title: "Spray Painting",
      description: "Premium quality paint jobs and color matching"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400 dark:text-yellow-300" />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee on all services"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary dark:text-white" />,
      title: "Quick Turnaround",
      description: "Efficient service with minimal downtime"
    }
  ];

  const stats = [
    { value: "1000+", label: "Satisfied Customers" },
    { value: "15+", label: "Years Experience" },
    { value: "4.9", label: "Average Rating" },
    { value: "100%", label: "Quality Guarantee" }
  ];

  const process = [
    {
      icon: <Camera className="h-12 w-12 text-primary dark:text-white" />,
      title: "Initial Assessment",
      description: "We thoroughly inspect your vehicle and document all damage"
    },
    {
      icon: <Settings className="h-12 w-12 text-primary dark:text-white" />,
      title: "Repair Planning",
      description: "Our experts create a detailed repair plan and timeline"
    },
    {
      icon: <Wrench className="h-12 w-12 text-primary dark:text-white" />,
      title: "Expert Repairs",
      description: "Skilled technicians perform the necessary repairs"
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400" />,
      title: "Quality Check",
      description: "Multiple quality checks ensure perfect results"
    }
  ];

  // Process data for rendering
  const displayedServices = services.slice(0, 3).map((service: Service, index: number) => ({
    icon: service.name.includes('Panel') ? <Wrench className="h-10 w-10 text-primary dark:text-white" /> :
          service.name.includes('Paint') ? <Paintbrush className="h-10 w-10 text-primary dark:text-white" /> :
          <Shield className="h-10 w-10 text-primary dark:text-white" />, // Default or more specific logic
    title: service.name,
    description: service.description,
    link: service.name.toLowerCase().replace(/\s/g, '-') // Generate slug from name
  }));

  const displayedTestimonials = testimonials.slice(0, 3).map((t: Testimonial, index: number) => ({
    name: `${t.user_first_name} ${t.user_last_name}`,
    role: t.user_email, // Or a more appropriate role if available
    image: "/images/default-avatar.png", // Placeholder, ideally fetch from user profile or content
    quote: t.comment,
    rating: t.rating
  }));

  const displayedGalleryPreviews = galleryPreviews.slice(0, 2).map((g: GalleryItem, index: number) => {
    let bodyContent = { original_name: g.title };
    try {
      bodyContent = typeof g.body === 'string' ? JSON.parse(g.body) : g.body;
    } catch (e) {
      console.error("Failed to parse gallery item body:", e);
    }
    return {
      before: g.image_url || "/images/hero/colorful-car.png",
      after: g.image_url || "/images/hero/colorful-car.png",
      title: g.title,
      description: (bodyContent as any).original_name || g.title
    };
  });

  return (
    <>
      <Toaster />
      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.div
          className="relative h-[600px] flex items-center justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-sky-200/60 via-fuchsia-100/60 to-emerald-100/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-2xl backdrop-saturate-200 overflow-hidden">
            <Image
              src="/images/hero/colorful-car.png"
              alt="Colorful car"
              fill
              style={{ objectFit: "contain", objectPosition: "center" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          </div>
          <motion.div
            className="relative z-10 container mx-auto px-4 text-center mt-auto pb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Transform Your Vehicle
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Expert panel beating and spray painting services with guaranteed results
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <Button size="lg" variant="outline" className="bg-white/90 hover:bg-white w-full sm:w-auto shadow-xl text-primary" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-blue" />
                  Get a Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/90 hover:bg-white w-full sm:w-auto shadow-xl text-primary" asChild>
                <Link href="/services">Our Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
              We combine expertise, quality, and customer service to deliver the best auto body repair experience
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
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.07 }}
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Services Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-primary dark:text-white">Our Services</h2>
              <p className="text-lg text-gray-700 dark:text-gray-200">
                Comprehensive auto body repair and painting services
              </p>
            </div>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {displayedServices.map((service, index) => (
                <Link
                  key={index}
                  href={`/services#${service.link}`}
                  className="block" // Make the link a block element to wrap the card
                >
                  <motion.div
                    className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow-xl border border-white/30 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.07 }}
                  >
                    <div className="mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-primary">{service.title}</h3>
                    <p className="text-gray-700 dark:text-gray-200 mb-4 group-hover:text-primary/90">
                      {service.description}
                    </p>
                    <span className="text-primary hover:text-primary/80 flex items-center font-semibold">
                      Learn More <ArrowRight className="ml-2 h-4 w-4 text-primary dark:text-white group-hover:text-primary" />
                    </span>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Process Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Process</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
              We follow a systematic approach to ensure the highest quality repairs
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30 p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full scale-150"></div>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Preview Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Transformation Gallery
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                See the dramatic transformations we achieve through our expert repair and restoration work
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {displayedGalleryPreviews.map((preview, index) => (
                <Link key={index} href="/gallery" className="block">
                  <div className="group relative overflow-hidden rounded-2xl shadow-xl border border-white/20 bg-white/10 hover:scale-[1.02] transition-transform duration-300">
                    <div className="aspect-video relative">
                      <Image
                        src={preview.after}
                        alt={preview.title}
                        width={600}
                        height={338}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 rounded-2xl"
                      />
                      <Image
                        src={preview.before}
                        alt={`Before ${preview.title}`}
                        width={600}
                        height={338}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
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
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10 shadow-lg" asChild>
                <Link href="/gallery">
                  View Full Gallery
                  <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30 p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-primary dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-700 dark:text-gray-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Testimonials Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-primary dark:text-white">What Our Clients Say</h2>
              <p className="text-lg text-gray-700 dark:text-gray-100">
                Don't just take our word for it
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {displayedTestimonials.map((testimonial, index) => (
                <Card key={index} className="p-8 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 relative border-4 border-primary/20 shadow-lg">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        style={{objectFit: "cover"}}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.srcset = '/images/default-avatar.png';
                          target.src = '/images/default-avatar.png';
                        }}
                      />
                    </div>
                    <Quote className="h-8 w-8 text-primary dark:text-white mb-4" />
                    <p className="text-gray-700 dark:text-gray-200 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-white/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-40"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Contact us today for a free consultation and quote. Our expert team is ready to help!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl" asChild>
                  <Link href="/contact" className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-white" />
                    Contact Us
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/90 hover:bg-white w-full sm:w-auto shadow-xl text-primary" asChild>
                  <Link href="/services">View All Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


