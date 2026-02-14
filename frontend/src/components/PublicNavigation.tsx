'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">MWU Clearance System</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:text-white hover:bg-blue-500'
              }`}
            >
              Home
            </Link>
            <Link
              href="/login"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/login'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:text-white hover:bg-blue-500'
              }`}
            >
              Login
            </Link>
            <Link
              href="/contact-request"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/contact-request'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:text-white hover:bg-blue-500'
              }`}
            >
              Sign Up
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/about'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:text-white hover:bg-blue-500'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}