import Link from "next/link";
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
    <footer className="backdrop-blur-2xl bg-white/30 dark:bg-slate-900/70 border-t border-white/20 shadow-2xl ring-1 ring-white/30 ring-inset text-gray-800 dark:text-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo className="h-10 w-auto drop-shadow-lg" />
            </div>
            <p className="text-sm mb-4 opacity-80">
              Your trusted partner for auto body repair and spray painting services. Quality and satisfaction guaranteed.
            </p>
            <div className="flex space-x-4">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fuchsia-500 transition-colors bg-white/40 dark:bg-slate-800/40 rounded-full p-2 shadow-md border border-white/20"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className="hover:text-fuchsia-500 transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 tracking-wide">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.path}>
                  <Link 
                    href={service.path}
                    className="hover:text-fuchsia-500 transition-colors font-medium"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 tracking-wide">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-fuchsia-500 shrink-0" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-fuchsia-500" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-fuchsia-500" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-fuchsia-500" />
                <span>{contact.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-white/20 dark:bg-slate-900/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs md:text-sm opacity-80">
              © {new Date().getFullYear()} Color-Tech Panel & Paint. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-xs md:text-sm hover:text-fuchsia-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs md:text-sm hover:text-fuchsia-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-xs md:text-sm hover:text-fuchsia-500 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}