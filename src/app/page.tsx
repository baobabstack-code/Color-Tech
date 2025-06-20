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

async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch('/api/content/blog/featured', { next: { revalidate: 3600 } }); // Revalidate every hour
  if (!res.ok) {
    console.error('Failed to fetch featured blog posts:', res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.featuredPosts || [];
}

async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch('/api/reviews?status=approved&limit=3', { next: { revalidate: 3600 } }); // Revalidate every hour
  if (!res.ok) {
    console.error('Failed to fetch testimonials:', res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.reviews || [];
}

async function getGalleryPreviews(): Promise<GalleryItem[]> {
  const res = await fetch('/api/content?content_type=gallery&is_published=true&limit=2', { next: { revalidate: 3600 } }); // Revalidate every hour
  if (!res.ok) {
    console.error('Failed to fetch gallery previews:', res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.content || [];
}

async function getServices(): Promise<Service[]> {
  const res = await fetch('/api/services?limit=3', { next: { revalidate: 3600 } }); // Revalidate every hour
  if (!res.ok) {
    console.error('Failed to fetch services:', res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.services || [];
}

export default async function HomePage() {
  const [featuredPosts, testimonials, galleryPreviews, services] = await Promise.all([
    getFeaturedBlogPosts(),
    getTestimonials(),
    getGalleryPreviews(),
    getServices()
  ]);

  const features = [
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Expert Panel Beating",
      description: "Professional repair services for all vehicle types"
    },
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Spray Painting",
      description: "Premium quality paint jobs and color matching"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee on all services"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
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
      icon: <Camera className="h-12 w-12 text-primary" />,
      title: "Initial Assessment",
      description: "We thoroughly inspect your vehicle and document all damage"
    },
    {
      icon: <Settings className="h-12 w-12 text-primary" />,
      title: "Repair Planning",
      description: "Our experts create a detailed repair plan and timeline"
    },
    {
      icon: <Wrench className="h-12 w-12 text-primary" />,
      title: "Expert Repairs",
      description: "Skilled technicians perform the necessary repairs"
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Quality Check",
      description: "Multiple quality checks ensure perfect results"
    }
  ];

  // Process data for rendering
  const displayedServices = services.slice(0, 3).map(service => ({
    icon: service.name.includes('Panel') ? <Wrench className="h-10 w-10 text-primary" /> :
          service.name.includes('Paint') ? <Paintbrush className="h-10 w-10 text-primary" /> :
          <Shield className="h-10 w-10 text-primary" />, // Default or more specific logic
    title: service.name,
    description: service.description,
    link: service.name.toLowerCase().replace(/\s/g, '-') // Generate slug from name
  }));

  const displayedTestimonials = testimonials.slice(0, 3).map(t => ({
    name: `${t.user_first_name} ${t.user_last_name}`,
    role: t.user_email, // Or a more appropriate role if available
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a", // Placeholder, ideally fetch from user profile or content
    quote: t.comment,
    rating: t.rating
  }));

  const displayedGalleryPreviews = galleryPreviews.slice(0, 2).map(g => {
    let bodyContent = { original_name: g.title };
    try {
      bodyContent = JSON.parse(g.body);
    } catch (e) {
      console.error("Failed to parse gallery item body:", e);
    }
    return {
      before: g.image_url || "https://via.placeholder.com/600x338?text=Before",
      after: g.image_url || "https://via.placeholder.com/600x338?text=After", // Assuming 'after' is the same as 'before' for now, or needs a separate field
      title: g.title,
      description: bodyContent.original_name || g.title
    };
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/Color-Tech/images/hero/colorful-car.png')`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#0f172a"
          }}
        >
          {/* Lighter overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>

        {/* Content - Move to bottom for better visibility of the car */}
        <div className="relative z-10 container mx-auto px-4 text-center mt-auto pb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up drop-shadow-lg">
            Transform Your Vehicle
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-up drop-shadow-md" style={{ animationDelay: "0.2s" }}>
            Expert panel beating and spray painting services with guaranteed results
          </p>
          <div className="flex justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Get a Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white hover:bg-white/90" asChild>
              <Link href="/services">Our Services</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine expertise, quality, and customer service to deliver the best auto body repair experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">
              Comprehensive auto body repair and painting services
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {displayedServices.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <Link
                  href={`/services#${service.link}`}
                  className="text-primary hover:text-primary/80 flex items-center"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Process</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We follow a systematic approach to ensure the highest quality repairs
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {process.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-150"></div>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < process.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Preview Section */}
      <div className="bg-gray-900 py-16">
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
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="aspect-video relative">
                  <Image
                    src={preview.after}
                    alt={preview.title}
                    width={600}
                    height={338}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <Image
                    src={preview.before}
                    alt={`Before ${preview.title}`}
                    width={600}
                    height={338}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {preview.title}
                  </h3>
                  <p className="text-gray-200 mb-4">
                    {preview.description}
                  </p>
                  <div className="flex items-center text-sm text-white/80">
                    <span>Hover to see before</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/gallery">
                View Full Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {displayedTestimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 relative">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      style={{objectFit: "cover"}}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Attempt to set a known placeholder or simply hide on error if no placeholder is available/verified
                        // For now, let's assume a placeholder might be available at /images/default-avatar.png
                        // If not, this might still cause an error if the fallback also fails.
                        // A more robust solution would be a CSS background or a dedicated placeholder component.
                        target.srcset = '/images/default-avatar.png';
                        target.src = '/images/default-avatar.png';
                      }}
                    />
                  </div>
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-primary rounded-lg p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. Our expert team is ready to help!
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white hover:bg-white/90" asChild>
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
