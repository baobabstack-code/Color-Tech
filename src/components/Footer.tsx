import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Clock
} from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const quickLinks = [
    { title: "Services", path: "/services" },
    { title: "Gallery", path: "/gallery" },
    { title: "About Us", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "Blog", path: "/blog" },
  ];

  const services = [
    { title: "Panel Beating", path: "/services#panel-beating" },
    { title: "Spray Painting", path: "/services#spray-painting" },
    { title: "Rust Protection", path: "/services#rust-protection" },
    { title: "Dent Removal", path: "/services#dent-removal" },
    { title: "Color Matching", path: "/services#color-matching" },
  ];

  const contact = {
    address: "123 Auto Street, Repair City, RC 12345",
    phone: "+1 234 567 8900",
    email: "info@colortech.com",
    hours: "Mon - Fri: 8:00 AM - 6:00 PM"
  };

  const socials = [
    { icon: <Facebook className="h-5 w-5" />, path: "https://facebook.com/colortech" },
    { icon: <Twitter className="h-5 w-5" />, path: "https://twitter.com/colortech" },
    { icon: <Instagram className="h-5 w-5" />, path: "https://instagram.com/colortech" },
    { icon: <Linkedin className="h-5 w-5" />, path: "https://linkedin.com/company/colortech" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo className="h-8 w-auto" />
            </div>
            <p className="text-sm mb-4">
              Your trusted partner for auto body repair and spray painting services. Quality and satisfaction guaranteed.
            </p>
            <div className="flex space-x-4">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.path}>
                  <Link 
                    to={service.path}
                    className="hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span>{contact.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm">
              © {new Date().getFullYear()} Color-Tech Panel & Paint. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-sm hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 