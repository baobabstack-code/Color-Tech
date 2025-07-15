import React from 'react';
import { PhoneCall } from 'lucide-react';
import { Stage } from '@/components/ProgressTracker';
import { Wrench, Paintbrush, Car, Shield, Hammer, Clock, Settings, CheckCircle, ArrowRight } from 'lucide-react';
import CostCalculator from '@/components/CostCalculator';
import ProgressTracker from '@/components/ProgressTracker';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllServices as getServices } from '@/services/serviceService';
import { headers } from 'next/headers';

// Define interfaces for fetched data
interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Use the service file to fetch services
async function getAllServices() {
  try {
    // Use the imported service function
    return await getServices();
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

const ServicesPage = async () => {
  const services = await getAllServices();
  // Categories are derived from services, so we don't need a separate fetch
  const categories = [...new Set(services.map(s => s.category))];

  // Define stages for ProgressTracker (can be fetched from API if dynamic)
  const repairStages: Stage[] = [
    {
      id: 1,
      title: "Vehicle Check-in",
      description: "Initial inspection and documentation",
      status: "completed",
      date: "2024-03-10",
      details: "Vehicle received and documented"
    },
    {
      id: 2,
      title: "Damage Assessment",
      description: "Detailed evaluation of repairs needed",
      status: "completed",
      date: "2024-03-11",
      details: "Full assessment completed"
    },
    {
      id: 3,
      title: "Repair Work",
      description: "Active repair and restoration",
      status: "in-progress",
      date: "2024-03-12",
      details: "Panel beating in progress"
    },
    {
      id: 4,
      title: "Quality Check",
      description: "Final inspection and testing",
      status: "pending",
      date: "2024-03-13",
      details: "Awaiting completion"
    },
    {
      id: 5,
      title: "Ready for Pickup",
      description: "Vehicle ready for collection",
      status: "pending",
      date: "2024-03-14",
      details: "Not started"
    }
  ];

  // Map fetched services to the display format
  const displayedServices = services.map(service => ({
    id: service.id,
    icon: service.name.includes('Panel') ? <Wrench className="h-12 w-12 text-white" /> :
          service.name.includes('Paint') ? <Paintbrush className="h-12 w-12 text-white" /> :
          service.name.includes('Rust') ? <Shield className="h-12 w-12 text-white" /> :
          <Car className="h-12 w-12 text-white" />, // Default icon
    title: service.name,
    description: service.description,
    features: [
      // Example features, ideally these would come from the service data itself
      "Expert technicians",
      "State-of-the-art equipment",
      "Quality materials",
      "Guaranteed results"
    ]
  }));

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white text-center mb-6">
          Our Services
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center max-w-2xl mx-auto">
          We offer a comprehensive range of automotive repair and refinishing services,
          delivered by our team of experienced professionals using state-of-the-art equipment.
        </p>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service, index) => (
            <Link key={index} href={`/services/${service.id}`} className="block">
              <Card className="p-6 bg-white/90 dark:bg-slate-800 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-white group-hover:text-slate-200">{service.title}</h2>
                <p className="text-slate-300 mb-6 group-hover:text-slate-400">{service.description}</p>
                <ul className="space-y-2 text-left w-full mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" asChild>
                  <span className="text-white hover:text-slate-200 flex items-center font-semibold">
                    Learn More <ArrowRight className="ml-2 h-4 w-4 text-white group-hover:text-slate-200" />
                  </span>
                </Button>
              </Card>
            </Link>
          ))}
        </div>
      </div>

       {/* Map Section */}
      <div className="container mx-auto mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">Find Our Workshop</h2>
          <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
            Visit us at our state-of-the-art facility. Use the map below to get directions.
          </p>
        </div>
        <div className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/30">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_PLATFORM_API_KEY}&q=123+Industrial+Road,Harare,Zimbabwe`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto mt-16 text-center">
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-white/30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-40"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Vehicle?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Contact us today for a consultation and quote. Our team is ready to help restore
              your vehicle to its former glory.
            </p>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-white" />
                Get a Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Tracking Section */}
      {/*
      <div className="container mx-auto mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">Track Your Repair Progress</h2>
          <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
            Stay informed about your vehicle's repair status with our real-time progress tracking system.
          </p>
        </div>
        <ProgressTracker 
          stages={repairStages} 
          currentStage={2} // Index of the current stage (0-based)
        />
      </div>
      */}
    </div>
  );
};

export default ServicesPage;
