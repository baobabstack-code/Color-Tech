'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-fuchsia-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-700 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
                <p className="mb-4">
                  By accessing and using the services of Color-Tech Panel & Paint, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Services</h2>
                <p className="mb-4">
                  Color-Tech Panel & Paint provides automotive body repair and spray painting services including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Panel beating and dent repair</li>
                  <li>Spray painting and color matching</li>
                  <li>Bumper repair and replacement</li>
                  <li>Insurance claim assistance</li>
                  <li>Quality inspections and warranties</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Booking and Payment</h2>
                <h3 className="text-xl font-semibold mb-2">Quotes</h3>
                <p className="mb-4">
                  All quotes are valid for 30 days from the date of issue unless otherwise specified.
                </p>
                
                <h3 className="text-xl font-semibold mb-2">Payment Terms</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Payment is due upon completion of work unless other arrangements have been made</li>
                  <li>We accept cash, EFT, and approved insurance payments</li>
                  <li>Additional charges may apply for work beyond the original scope</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Warranties</h2>
                <p className="mb-4">
                  We provide warranties on our workmanship:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>6 months warranty on all panel beating work</li>
                  <li>12 months warranty on spray painting work</li>
                  <li>Warranties are void if vehicle is involved in subsequent accidents</li>
                  <li>Normal wear and tear is not covered under warranty</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Customer Responsibilities</h2>
                <p className="mb-4">
                  Customers are responsible for:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Providing accurate information about vehicle damage</li>
                  <li>Removing personal items from vehicles</li>
                  <li>Ensuring vehicle has sufficient fuel for test drives</li>
                  <li>Collecting vehicles within 7 days of completion</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="mb-4">
                  Color-Tech Panel & Paint's liability is limited to the cost of the services provided. We are not responsible for:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Pre-existing damage not identified during initial assessment</li>
                  <li>Personal items left in vehicles</li>
                  <li>Damage caused by acts of nature or third parties</li>
                  <li>Consequential or indirect damages</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <p><strong>Color-Tech Panel & Paint</strong></p>
                  <p>687 Dias & Isafit complex, Hatfield Harare, workshop 28</p>
                  <p>Phone: +263 77 123 4567</p>
                  <p>Email: info@colortech.co.zw</p>
                  <p>Hours: Monday-Friday 8:00 AM - 5:00 PM, Saturday 8:00 AM - 1:00 PM</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}