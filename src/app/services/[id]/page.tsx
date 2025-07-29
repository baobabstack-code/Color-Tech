import React from "react";
import {
  getServiceById,
  getServiceStaticPaths,
  Service,
} from "@/services/serviceService";
import { notFound } from "next/navigation";
import { Clock, Tag, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Make this page dynamic instead of static
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const ServiceDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;

  // Use database service directly for server-side rendering
  let service;
  try {
    const { DatabaseService } = await import("@/lib/database");
    service = await DatabaseService.getServiceById(parseInt(id));
  } catch (error) {
    console.error("Failed to fetch service:", error);
    notFound();
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 md:pt-36 pb-12 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white/90 dark:bg-slate-800 rounded-2xl shadow-xl border border-white/30 p-8 md:p-12">
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center text-primary dark:text-gray-200 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            {service.name}
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-100 mb-8">
            {service.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">
                Price
              </h3>
              <p className="text-2xl font-bold text-primary dark:text-gray-200">
                ${service.basePrice}
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">
                Duration
              </h3>
              <p className="text-2xl font-bold text-primary dark:text-gray-200">
                {service.duration} min
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
              <Tag className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">
                Category
              </h3>
              <p className="text-2xl font-bold text-primary dark:text-gray-200">
                {service.category}
              </p>
            </div>
          </div>

          <div className="max-w-none">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
              Service Details
            </h2>
            <p className="text-gray-700 dark:text-gray-100 mb-4">
              Our {service.name} service is a comprehensive solution designed to
              address your vehicle's needs with precision and care. We use only
              the highest quality parts and fluids to ensure optimal performance
              and longevity. Our expert technicians are trained to handle a wide
              range of vehicles, providing a service you can trust.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-100">
              <li>Certified Technicians</li>
              <li>State-of-the-Art Equipment</li>
              <li>Genuine OEM or Equivalent Parts</li>
              <li>Comprehensive Quality Check</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white hover:from-indigo-700 hover:to-purple-700 shadow-xl"
              asChild
            >
              <Link href="/contact">Book This Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
