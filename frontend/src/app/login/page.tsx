'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth';
import PublicNavigation from '@/components/PublicNavigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      
      // Redirect based on user role
      switch (response.user.role) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'library_officer':
        case 'dormitory_officer':
        case 'department_officer':
          router.push('/officer/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        setError(errorMessages.join(', '));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access the MWU Clearance System
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Contact your administrator
                </Link>
              </p>
            </div>
          </form>

          {/* Contact Admin Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">📧</span>
              Need an Account?
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              New users must be registered by the system administrator. Please contact the admin office with the following information:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Your full name</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Student ID number (for students)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Email address</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Department (for students and officers)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Role type (Student, Library Officer, Dormitory Officer, or Department Officer)</span>
              </li>
            </ul>
            <div className="bg-white rounded-md p-4 border border-blue-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Contact Information:</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center">
                  <span className="font-medium mr-2">📧 Email:</span>
                  <a href="mailto:mulisazenbaba@gmail.com" className="text-indigo-600 hover:text-indigo-800">
                    mulisazenbaba@gmail.com
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">📞 Phone:</span>
                  <a href="tel:+251954382579" className="text-indigo-600 hover:text-indigo-800">
                    0954382579
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">🏢 Office:</span>
                  <span>Administration Building 12, Room 5</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">🕐 Hours:</span>
                  <span>Monday - Friday, 2:00 AM - 11:00 PM</span>
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <Link 
                  href="/contact-request"
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Send Contact Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}