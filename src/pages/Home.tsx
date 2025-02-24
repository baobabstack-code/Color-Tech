import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Wrench, Car, Star, Clock, 
  CheckCircle, PhoneCall, Users,
  Shield, ArrowRight, Quote,
  Camera, Settings, Tool, Paintbrush
} from "lucide-react";

export default function Home() {
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

  const services = [
    {
      icon: <Wrench className="h-10 w-10 text-primary" />,
      title: "Panel Beating",
      description: "Expert repair and restoration of damaged vehicle panels",
      link: "panel-beating"
    },
    {
      icon: <Car className="h-10 w-10 text-primary" />,
      title: "Spray Painting",
      description: "Professional automotive painting with premium finishes",
      link: "spray-painting"
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Quality Assurance",
      description: "Comprehensive quality checks and guarantees",
      link: "quality-assurance"
    }
  ];

  const testimonials = [
    {
      name: "John Smith",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      quote: "The quality of work is outstanding. My fleet vehicles have never looked better!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Customer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      quote: "Professional service from start to finish. They transformed my car completely.",
      rating: 5
    },
    {
      name: "Mike Williams",
      role: "Car Enthusiast",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      quote: "Their attention to detail is remarkable. Best panel beaters in town!",
      rating: 5
    }
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

  const galleryPreviews = [
    {
      before: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12",
      after: "https://images.unsplash.com/photo-1596883040737-6d38c9e905b0",
      title: "Complete Body Restoration",
      description: "Full restoration including panel beating and respraying"
    },
    {
      before: "https://images.unsplash.com/photo-1591167866410-c15e4545a887",
      after: "https://images.unsplash.com/photo-1611566026373-c6c8da0ea861",
      title: "Custom Paint Job",
      description: "Premium metallic paint finish with clear coat"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/lovable-uploads/830e13d0-5772-46d2-b986-7f8e3a6961b8.png')",
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
              <Link to="/contact" className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Get a Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white hover:bg-white/90" asChild>
              <Link to="/services">Our Services</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
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
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <Link 
                  to={`/services#${service.link}`}
                  className="text-primary hover:text-primary/80 flex items-center"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section - Add after Services section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Process</h2>
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

      {/* Gallery Preview Section - Add before Stats section */}
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
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="aspect-video relative">
                  <img
                    src={preview.after}
                    alt={preview.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <img
                    src={preview.before}
                    alt={`Before ${preview.title}`}
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
              <Link to="/gallery">
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
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/testimonials/default-avatar.jpg';
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
                <Link to="/contact" className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white hover:bg-white/90" asChild>
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 