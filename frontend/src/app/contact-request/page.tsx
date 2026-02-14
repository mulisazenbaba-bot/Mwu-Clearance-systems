'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicNavigation from '@/components/PublicNavigation';
import api from '@/lib/api';

export default function ContactRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    student_id: '',
    department: '',
    role_type: 'student',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/contact-requests', formData);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Contact request error:', err);
      
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        setError(errorMessages.join(', '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit contact request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavigation />
        
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Request Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your contact request. The administrator will review your information and contact you soon via email or phone.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>What's next?</strong><br />
                  The admin will review your request within 1-2 business days and contact you with your account credentials.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Request Account Access
            </h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to request access to the MWU Clearance System
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0912345678"
                  />
                </div>

                <div>
                  <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID <span className="text-gray-500">(for students only)</span>
                  </label>
                  <input
                    type="text"
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="MWU001"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label htmlFor="role_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Role Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role_type"
                    name="role_type"
                    required
                    value={formData.role_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="student">Student</option>
                    <option value="library_officer">Library Officer</option>
                    <option value="dormitory_officer">Dormitory Officer</option>
                    <option value="department_officer">Department Officer</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message / Additional Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please provide any additional information about why you need access to the system..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>📧 What happens next?</strong><br />
                  After submitting this form, the administrator will receive your request via email and in their dashboard. 
                  They will review your information and contact you within 1-2 business days with your account credentials.
                </p>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← Back to Login
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="text-xl mr-3">📧</span>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:mulisazenbaba@gmail.com" className="text-indigo-600 hover:text-indigo-800">
                    mulisazenbaba@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">📞</span>
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+251954382579" className="text-indigo-600 hover:text-indigo-800">
                    0954382579
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
