"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/form-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage(
          "Thank you! Your message has been sent successfully. We'll get back to you soon."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setSubmitMessage(
        "Sorry, there was an error sending your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Structured data for local business
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Color Tech",
    description:
      "Professional auto body repair, spray painting, and panel beating services in Harare, Zimbabwe",
    url: "https://colortech.co.zw",
    telephone: "+263 78 125 3902",
    email: "colorterch25@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "667 Dias & lsafil complex, Hatfield Harare, workshop 28",
      addressLocality: "Harare",
      addressRegion: "Harare Province",
      postalCode: "00000",
      addressCountry: "ZW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -17.8292,
      longitude: 31.0522,
    },
    openingHours: ["Mo-Fr 08:00-17:00", "Sa 08:00-13:00"],
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "Harare",
    },
    serviceType: [
      "Auto Body Repair",
      "Spray Painting",
      "Panel Beating",
      "Dent Removal",
      "Rust Protection",
    ],
  };

  return (
    <div className="min-h-screen pt-32 md:pt-36 pb-12 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white text-center mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center max-w-2xl mx-auto">
          Get in touch with us for all your vehicle repair and refinishing
          needs. We're here to help transform your vehicle.
        </p>
      </div>

      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-8 text-white shadow-xl border border-white/30 hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="w-6 h-6 mr-4 mt-1 text-white" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p>+263 77 123 4567</p>
                  <p>+263 71 987 6543</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-6 h-6 mr-4 mt-1 text-white" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p>info@color-tech.co.zw</p>
                  <p>support@color-tech.co.zw</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-6 h-6 mr-4 mt-1 text-white" />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p>667 Dias & lsafil complex, Hatfield Harare, workshop 28</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 mr-4 mt-1 text-white" />
                <div>
                  <h3 className="font-semibold mb-1">Business Hours</h3>
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 8:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden">
                <img
                  src="/contact/map.jpg"
                  alt="Location Map"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://source.unsplash.com/random/800x400?map";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/90 dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-white/30 hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-white/40 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-white/40 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-white/40 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200"
                  placeholder="+263 77 123 4567"
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Service Required *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-white/40 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200"
                >
                  <option value="">Select a service</option>
                  <option value="panel-beating">Panel Beating</option>
                  <option value="spray-painting">Spray Painting</option>
                  <option value="dent-removal">Dent Removal</option>
                  <option value="accident-repair">Accident Repair</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-white/40 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200"
                  placeholder="Please describe your requirements..."
                />
              </div>

              {submitMessage && (
                <div
                  className={`p-4 rounded-lg text-center ${
                    submitMessage.includes("Thank you")
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="shadow-xl flex items-center justify-center font-bold text-white bg-gradient-to-r from-primary to-fuchsia-500 hover:opacity-90 transition-opacity duration-300 py-3 px-8 rounded-full disabled:opacity-50"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
