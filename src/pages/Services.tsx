import React from 'react';
import { Wrench, Paintbrush, Car, Shield, Hammer, Clock, Settings } from 'lucide-react';
import CostCalculator from '../components/CostCalculator';
import ProgressTracker from '../components/ProgressTracker';
import VirtualTour from '../components/VirtualTour';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Wrench className="h-12 w-12 text-primary" />,
      title: "Panel Beating",
      description: "Expert repair of dents, scratches, and collision damage",
      features: [
        "Dent removal",
        "Panel replacement",
        "Frame straightening",
        "Collision repair"
      ]
    },
    {
      icon: <Paintbrush className="h-12 w-12 text-primary" />,
      title: "Spray Painting",
      description: "Professional automotive painting and color matching",
      features: [
        "Color matching",
        "Full resprays",
        "Partial resprays",
        "Clear coat finish"
      ]
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Rust Protection",
      description: "Comprehensive rust treatment and prevention",
      features: [
        "Rust removal",
        "Anti-rust coating",
        "Cavity protection",
        "Undercoating"
      ]
    }
  ];

  // Define stages for ProgressTracker
  const repairStages = [
    {
      title: "Vehicle Check-in",
      description: "Initial inspection and documentation",
      status: "completed",
      date: "2024-03-10",
      details: "Vehicle received and documented"
    },
    {
      title: "Damage Assessment",
      description: "Detailed evaluation of repairs needed",
      status: "completed",
      date: "2024-03-11",
      details: "Full assessment completed"
    },
    {
      title: "Repair Work",
      description: "Active repair and restoration",
      status: "in-progress",
      date: "2024-03-12",
      details: "Panel beating in progress"
    },
    {
      title: "Quality Check",
      description: "Final inspection and testing",
      status: "pending",
      date: "2024-03-13",
      details: "Awaiting completion"
    },
    {
      title: "Ready for Pickup",
      description: "Vehicle ready for collection",
      status: "pending",
      date: "2024-03-14",
      details: "Not started"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{service.icon}</div>
                <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 text-left w-full mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full">Learn More</Button>
              </div>
            </Card>
          ))}
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
        <ProgressTracker 
          stages={repairStages} 
          currentStage={2} // Index of the current stage (0-based)
        />
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
