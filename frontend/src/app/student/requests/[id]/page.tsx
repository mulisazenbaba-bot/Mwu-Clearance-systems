'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authService } from '@/services/auth';
import { clearanceService } from '@/services/clearance';
import { verificationService } from '@/services/verification';
import { ClearanceRequest, Verification, User } from '@/types';

export default function RequestDetailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [request, setRequest] = useState<ClearanceRequest | null>(null);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadRequestDetails();
  }, [router, requestId]);

  const loadRequestDetails = async () => {
    try {
      const [requestData, verificationsData] = await Promise.all([
        clearanceService.getClearanceRequest(parseInt(requestId)),
        verificationService.getVerifications(parseInt(requestId))
      ]);
      setRequest(requestData);
      setVerifications(verificationsData);
    } catch (error) {
      console.error('Error loading request details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!request) return;
    
    try {
      await clearanceService.submitClearanceRequest(request.id);
      loadRequestDetails(); // Reload to get updated status
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationTypeLabel = (type: string) => {
    switch (type) {
      case 'library': return 'Library Clearance';
      case 'dormitory': return 'Dormitory Clearance';
      case 'department': return 'Department Clearance';
      default: return type;
    }
  };

  const getVerificationTypeIcon = (type: string) => {
    switch (type) {
      case 'library': return '📚';
      case 'dormitory': return '🏠';
      case 'department': return '🎓';
      default: return '📋';
    }
  };

  const getVerificationTypeColor = (type: string) => {
    switch (type) {
      case 'library': return 'bg-blue-50 border-blue-200';
      case 'dormitory': return 'bg-green-50 border-green-200';
      case 'department': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getVerificationTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'library': return 'bg-blue-100 text-blue-800';
      case 'dormitory': return 'bg-green-100 text-green-800';
      case 'department': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Request Not Found</h2>
          <p className="mt-2 text-gray-600">The clearance request you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="text-indigo-600 hover:text-indigo-800 mb-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Clearance Request Details</h1>
              <p className="text-gray-600">Request #{request.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status.replace('_', ' ').toUpperCase()}
              </span>
              {request.status === 'pending' && (
                <button
                  onClick={handleSubmitRequest}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                >
                  Submit Request
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Request Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic details about your clearance request</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.student_name}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.student_id_number}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.department}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Graduation Year</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.graduation_year}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Submitted At</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(request.submitted_at).toLocaleString()}
                  </dd>
                </div>
                {request.completed_at && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Completed At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(request.completed_at).toLocaleString()}
                    </dd>
                  </div>
                )}
                {request.reason && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Reason</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.reason}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Verification Status</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Track the progress of your clearance verifications</p>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {verifications.map((verification) => (
                  <li key={verification.id} className={`px-4 py-4 border-l-4 ${getVerificationTypeColor(verification.verification_type)}`}>
                    <div className="flex items-start space-x-3">
                      {/* Type Icon */}
                      <div className="flex-shrink-0">
                        <span className="text-3xl">{getVerificationTypeIcon(verification.verification_type)}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <p className="text-base font-semibold text-gray-900">
                              {getVerificationTypeLabel(verification.verification_type)}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationTypeBadgeColor(verification.verification_type)}`}>
                              {verification.verification_type.toUpperCase()}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(verification.status)}`}>
                            {verification.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {verification.officer && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Officer:</span> {verification.officer.name}
                          </p>
                        )}
                        
                        {verification.verified_at && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Verified:</span> {new Date(verification.verified_at).toLocaleString()}
                          </p>
                        )}
                        
                        {verification.comments && (
                          <div className="mt-2 p-3 bg-white border border-gray-200 rounded-md">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Comments:</span> {verification.comments}
                            </p>
                          </div>
                        )}
                        
                        {verification.status === 'pending' && (
                          <div className="mt-2 flex items-center text-sm text-yellow-700">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Waiting for {verification.verification_type} officer approval
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Clearance Progress</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Visual timeline of your clearance process</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5">
            <div className="flow-root">
              <ul className="-mb-8">
                {verifications.map((verification, index) => (
                  <li key={verification.id}>
                    <div className="relative pb-8">
                      {index !== verifications.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            verification.status === 'approved' ? 'bg-green-500' :
                            verification.status === 'rejected' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`}>
                            {verification.status === 'approved' && (
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {verification.status === 'rejected' && (
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                            {verification.status === 'pending' && (
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xl">{getVerificationTypeIcon(verification.verification_type)}</span>
                              <p className="text-sm font-medium text-gray-900">
                                {getVerificationTypeLabel(verification.verification_type)}
                              </p>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getVerificationTypeBadgeColor(verification.verification_type)}`}>
                                {verification.verification_type}
                              </span>
                            </div>
                            <p className={`text-sm font-semibold ${
                              verification.status === 'approved' ? 'text-green-600' :
                              verification.status === 'rejected' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>
                              {verification.status.toUpperCase()}
                            </p>
                            {verification.officer && (
                              <p className="text-xs text-gray-500 mt-1">by {verification.officer.name}</p>
                            )}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {verification.verified_at ? (
                              <time dateTime={verification.verified_at}>
                                {new Date(verification.verified_at).toLocaleDateString()}
                              </time>
                            ) : (
                              'Pending'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}