"use client";

import React, { useState } from 'react';
import { 
  Star, Users, Award, Clock, Wrench, Heart, Quote, 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Phone, Mail, Award as Certification
} from 'lucide-react';
import Link from "next/link"; // Import Link from next/link

const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    {
      name: "John Smith",
      role: "BMW Owner",
      content: "The quality of work at Color-tech is exceptional. They restored my BMW to better than new condition after an accident.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Mercedes Owner",
      content: "Professional service from start to finish. Their attention to detail in paint matching is remarkable.",
      rating: 5
    },
    {
      name: "Michael Brown",
      role: "Toyota Owner",
      content: "Fast, efficient, and highly professional. The team kept me updated throughout the repair process.",
      rating: 5
    }
  ];

  const teamMembers = [
    {
      name: "David Wilson",
      role: "Master Panel Beater",
      image: "/team/david.jpg",
      certifications: ["Certified Master Technician", "BMW Certified"],
      specializations: ["Structural Repairs", "Classic Car Restoration"],
      experience: "15+ years",
      contact: {
        email: "david@color-tech.co.zw",
        phone: "+263 77 123 4567"
      }
    },
    {
      name: "James Thompson",
      role: "Head Spray Painter",
      image: "/team/james.jpg",
      certifications: ["PPG Certified Painter", "Color Match Specialist"],
      specializations: ["Custom Paint Work", "Color Matching"],
      experience: "12+ years",
      contact: {
        email: "james@color-tech.co.zw",
        phone: "+263 77 123 4568"
      }
    },
    {
      name: "Robert Chen",
      role: "Quality Control Manager",
      image: "/team/robert.jpg",
      certifications: ["Quality Management Certified", "Vehicle Safety Inspector"],
      specializations: ["Final Inspection", "Customer Relations"],
      experience: "10+ years",
      contact: {
        email: "robert@color-tech.co.zw",
        phone: "+263 77 123 4569"
      }
    }
  ];

  const faqs = [
    {
      question: "What types of vehicles do you service?",
      answer: "We service all types of vehicles including cars, SUVs, trucks, and luxury vehicles. Our team is certified to work on both domestic and imported vehicles, with special expertise in European luxury brands."
    },
    {
      question: "How long does a typical repair take?",
      answer: "Repair time varies depending on the extent of damage and required work. Minor repairs might take 2-3 days, while major repairs could take 1-2 weeks. We provide detailed timelines during initial assessment."
    },
    {
      question: "Do you provide warranty on your work?",
      answer: "Yes, we offer a comprehensive warranty on all our work. Paint jobs are warranted for 3 years, and structural repairs come with a lifetime warranty against defects in workmanship."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including cash, credit cards, bank transfers, and mobile money. We also work directly with all major insurance companies."
    },
    {
      question: "Do you provide free estimates?",
      answer: "Yes, we provide free detailed estimates for all repair work. Our experts will thoroughly assess the damage and provide you with a comprehensive quote before beginning any work."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const values = [
    {
      icon: <Star className="w-8 h-8 text-secondary" />,
      title: "Excellence",
      description: "We strive for excellence in every repair and service we provide."
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: "Customer Focus",
      description: "Our customers' satisfaction is at the heart of everything we do."
    },
    {
      icon: <Award className="w-8 h-8 text-secondary" />,
      title: "Quality",
      description: "We use only the highest quality materials and latest techniques."
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "Efficiency",
      description: "Quick turnaround without compromising on quality."
    },
    {
      icon: <Wrench className="w-8 h-8 text-secondary" />,
      title: "Expertise",
      description: "Our team brings years of experience and technical knowledge."
    },
    {
      icon: <Heart className="w-8 h-8 text-secondary" />,
      title: "Passion",
      description: "We're passionate about restoring vehicles to their former glory."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary text-center mb-6">
          About Color-tech
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Your trusted partner in vehicle restoration and repair, delivering excellence 
          through expertise and dedication.
        </p>
      </div>

      {/* Story Section */}
      <div className="container mx-auto mb-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src="/images/about/workshop.jpg"
                alt="Our Workshop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/800x600/F97316/ffffff?text=Workshop';
                }}
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded with a passion for automotive excellence, Color-tech has been serving 
                the community for over a decade. What started as a small workshop has grown 
                into a full-service automotive repair and refinishing center.
              </p>
              <p className="text-gray-600">
                Our commitment to quality workmanship and customer satisfaction has earned us 
                a reputation as one of the most trusted names in the industry. We continue to 
                invest in the latest technology and training to provide the best possible service 
                to our clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto mb-16">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Team Section */}
      <div className="container mx-auto mb-16">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Expert Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://source.unsplash.com/random/400x300?mechanic';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2">{member.name}</h3>
                <p className="text-secondary font-medium mb-4">{member.role}</p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Certification className="w-5 h-5 text-secondary mt-1" />
                    <div>
                      <p className="font-medium">Certifications:</p>
                      <ul className="text-sm text-gray-600">
                        {member.certifications.map((cert, i) => (
                          <li key={i}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Wrench className="w-5 h-5 text-secondary mt-1" />
                    <div>
                      <p className="font-medium">Specializations:</p>
                      <ul className="text-sm text-gray-600">
                        {member.specializations.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${member.contact.email}`} className="hover:text-secondary">
                        {member.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${member.contact.phone}`} className="hover:text-secondary">
                        {member.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto mb-16">
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-12 text-center">Client Testimonials</h2>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <button 
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-center px-16">
                <Quote className="w-12 h-12 mx-auto mb-6 opacity-50" />
                <p className="text-lg md:text-xl mb-6">
                  {testimonials[currentTestimonial].content}
                </p>
                <div className="flex justify-center mb-2">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-semibold text-lg">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-sm opacity-75">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>

              <button 
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  aria-expanded="false"
                  data-state={openFaq === index ? 'expanded' : 'collapsed'}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-primary">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-secondary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary" />
                  )}
                </button>
                
                <div 
                  id={`faq-answer-${index}`}
                  className={`p-4 bg-white transition-all duration-200 ${
                    openFaq === index ? 'block' : 'hidden'
                  }`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto text-center">
        <div className="bg-white rounded-lg p-8 md:p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Experience the Color-tech Difference
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let us show you why we're the preferred choice for vehicle repair and refinishing. 
            Contact us today to discuss your needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
