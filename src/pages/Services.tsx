import React from 'react';
import { Wrench, Paintbrush, Car, Shield, Hammer, Clock, Settings } from 'lucide-react';
import CostCalculator from '../components/CostCalculator';
import ProgressTracker from '../components/ProgressTracker';
import VirtualTour from '../components/VirtualTour';

const Services = () => {
  const services = [
    {
      icon: <Wrench className="w-12 h-12 text-secondary" />,
      title: "Panel Beating",
      description: "Expert repair and restoration of damaged vehicle panels, ensuring perfect alignment and structural integrity."
    },
    {
      icon: <Paintbrush className="w-12 h-12 text-secondary" />,
      title: "Spray Painting",
      description: "Professional automotive painting with premium finishes, color matching, and long-lasting protection."
    },
    {
      icon: <Car className="w-12 h-12 text-secondary" />,
      title: "Dent Removal",
      description: "Specialized dent removal services using advanced techniques to restore your vehicle's appearance."
    },
    {
      icon: <Shield className="w-12 h-12 text-secondary" />,
      title: "Quality Guarantee",
      description: "Our work is backed by our commitment to excellence and customer satisfaction guarantee."
    },
    {
      icon: <Hammer className="w-12 h-12 text-secondary" />,
      title: "Accident Repairs",
      description: "Comprehensive accident repair services to restore your vehicle to its pre-accident condition."
    },
    {
      icon: <Clock className="w-12 h-12 text-secondary" />,
      title: "Quick Turnaround",
      description: "Efficient service delivery with quick turnaround times without compromising on quality."
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary text-center mb-6">
          Our Services
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
          We offer a comprehensive range of automotive repair and refinishing services, 
          delivered by our team of experienced professionals using state-of-the-art equipment.
        </p>
      </div>

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Calculator */}
          <div className="lg:col-span-1">
            <CostCalculator />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto mt-16 text-center">
        <div className="bg-primary text-white rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Vehicle?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for a consultation and quote. Our team is ready to help restore 
            your vehicle to its former glory.
          </p>
          <a
            href="/contact"
            className="inline-block bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md transition-colors duration-200"
          >
            Get a Quote
          </a>
        </div>
      </div>

      {/* Progress Tracking Section */}
      <div className="container mx-auto mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Track Your Repair Progress</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about your vehicle's repair status with our real-time progress tracking system.
          </p>
        </div>
        <ProgressTracker />
      </div>

      {/* Virtual Tour Section */}
      <div className="container mx-auto mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Explore Our Workshop</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a virtual tour of our state-of-the-art facility and discover where the magic happens.
          </p>
        </div>
        <VirtualTour />
      </div>
    </div>
  );
};

export default Services;
