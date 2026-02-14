'use client';

import Link from 'next/link';
import PublicNavigation from '@/components/PublicNavigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">MWU Clearance</span>{' '}
                  <span className="block text-indigo-600 xl:inline">System</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Streamline your academic clearance process with our digital platform. 
                  Students can submit clearance requests, track their progress, and download 
                  certificates once approved by all departments.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/about"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-indigo-500 to-purple-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold">Digital Clearance</h3>
              <p className="text-lg opacity-90">Fast • Secure • Efficient</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for clearance management
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Student Features */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  👨‍🎓
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">For Students</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Submit clearance requests, track progress, and download certificates once approved.
                </p>
              </div>

              {/* Officer Features */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  👮‍♂️
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">For Officers</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Review student records, manage department resources, and approve clearances.
                </p>
              </div>

              {/* Admin Features */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  ⚙️
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">For Admins</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Manage users, oversee the entire clearance process, and generate reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Administration</h3>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  <a href="mailto:mulisazenbaba@gmail.com" className="hover:text-white transition-colors">
                    mulisazenbaba@gmail.com
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📞</span>
                  <a href="tel:+251954382579" className="hover:text-white transition-colors">
                    0954382579
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🏢</span>
                  <span>Administration Building 12, Room 5</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🕐</span>
                  <span>Monday - Friday, 2:00 AM - 11:00 PM</span>
                </p>
              </div>
            </div>

            {/* New Users */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Need an Account?</h3>
              <p className="text-gray-400 mb-3">
                New users must be registered by the system administrator. Contact the admin office to get started.
              </p>
              <div className="space-y-2">
                <Link
                  href="/contact-request"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Send contact request →
                </Link>
                <br />
                <Link
                  href="/about"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Learn more about registration →
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
             
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
