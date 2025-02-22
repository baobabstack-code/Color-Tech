
import { Car, Paintbrush, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <HeroCarousel />
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up drop-shadow-lg">
              Transform Your Vehicle
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto animate-fade-up drop-shadow-md" style={{ animationDelay: "0.2s" }}>
              Expert panel beating and spray painting services for a flawless finish every time.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md transition-colors duration-200 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-background-alt hover:shadow-lg transition-shadow duration-200">
              <Car className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Panel Beating</h3>
              <p className="text-gray-600">Expert repair and restoration of damaged vehicle panels.</p>
            </div>
            <div className="p-6 rounded-lg bg-background-alt hover:shadow-lg transition-shadow duration-200">
              <Paintbrush className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Spray Painting</h3>
              <p className="text-gray-600">Professional automotive painting with premium finishes.</p>
            </div>
            <div className="p-6 rounded-lg bg-background-alt hover:shadow-lg transition-shadow duration-200">
              <ShieldCheck className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Our work is backed by our commitment to excellence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Vehicle?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for a consultation and quote. We're here to help restore your vehicle to its former glory.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
