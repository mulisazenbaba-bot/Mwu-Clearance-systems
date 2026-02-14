'use client';

import PublicNavigation from '@/components/PublicNavigation';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About MWU Clearance System
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Streamlining the academic clearance process for madda walaabu University
            </p>
          </div>

          <div className="mt-12 prose prose-lg mx-auto">
            <h2>What is the MWU Clearance System?</h2>
            <p>
              The MWU Clearance System is a digital platform built for Madda Walabu University 
              to streamline the academic clearance process. This system eliminates the traditional 
              paper-based approach, providing a faster, more efficient, and transparent way for 
              students to complete their clearance requirements.
            </p>

            <h2>Key Features</h2>
            <ul>
              <li><strong>Digital Clearance Requests:</strong> Students can submit clearance requests online</li>
              <li><strong>Real-time Tracking:</strong> Monitor the status of your clearance in real-time</li>
              <li><strong>Multi-Department Integration:</strong> Seamless coordination between Library, Dormitory, and Academic departments</li>
              <li><strong>Automated Notifications:</strong> Get notified when your clearance status changes</li>
              <li><strong>Digital Certificates:</strong> Download your clearance certificate once approved</li>
              <li><strong>Officer Dashboard:</strong> Department officers can efficiently manage and process clearances</li>
            </ul>

            <h2>How It Works</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white text-sm font-medium">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Submit Request</h3>
                    <p className="text-gray-600">Students log in and submit their clearance request with required information.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white text-sm font-medium">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Department Review</h3>
                    <p className="text-gray-600">Library, Dormitory, and Academic officers review and verify student records.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white text-sm font-medium">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Approval & Certificate</h3>
                    <p className="text-gray-600">Once all departments approve, students can download their clearance certificate.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2>User Roles</h2>
            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">👨‍🎓 Students</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Submit clearance requests</li>
                  <li>• Track request status</li>
                  <li>• Download certificates</li>
                  <li>• View clearance history</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">👮‍♂️ Officers</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Review student records</li>
                  <li>• Approve/reject clearances</li>
                  <li>• Manage department resources</li>
                  <li>• Generate reports</li>
                </ul>
              </div>
            </div>

            <h2>Benefits</h2>
            <ul>
              <li><strong>Efficiency:</strong> Reduce processing time from days to hours</li>
              <li><strong>Transparency:</strong> Real-time status updates for all stakeholders</li>
              <li><strong>Accuracy:</strong> Minimize errors with digital record keeping</li>
              <li><strong>Accessibility:</strong> Access the system from anywhere, anytime</li>
              <li><strong>Environmental:</strong> Paperless process supporting sustainability</li>
            </ul>

            <div className="text-center mt-12">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Get Started Today
              </Link>
            </div>

            {/* Contact Section for New Users */}
            <div className="mt-16 not-prose">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8 border border-indigo-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📧</span>
                  Need an Account?
                </h2>
                <p className="text-gray-700 mb-6">
                  New users must be registered by the system administrator. If you're a student, 
                  officer, or staff member who needs access to the clearance system, please contact 
                  the administration office with your information.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 font-bold">✓</span>
                        <span>Full name</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 font-bold">✓</span>
                        <span>Student ID number (for students)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 font-bold">✓</span>
                        <span>Email address</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 font-bold">✓</span>
                        <span>Department</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 font-bold">✓</span>
                        <span>Role type (Student/Officer)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex items-start">
                        <span className="text-xl mr-3">📧</span>
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <a href="mailto:mulisazenbaba@gmail.com" className="text-indigo-600 hover:text-indigo-800">
                            mulisazenbaba@gmail.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xl mr-3">📞</span>
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <a href="tel:+251954382579" className="text-indigo-600 hover:text-indigo-800">
                            0954382579
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xl mr-3">🏢</span>
                        <div>
                          <p className="font-medium text-gray-900">Office Location</p>
                          <p>Administration Building 12, Room 5</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xl mr-3">🕐</span>
                        <div>
                          <p className="font-medium text-gray-900">Office Hours</p>
                          <p>Monday - Friday</p>
                          <p>2:00 AM - 11:00 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/contact-request"
                        className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md font-medium transition-colors"
                      >
                        Send Contact Request
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 flex items-start">
                    <span className="text-yellow-600 text-xl mr-2">💡</span>
                    <span>
                      <strong>Note:</strong> Account registration typically takes 1-2 business days. 
                      You will receive your login credentials via email once your account is created.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}