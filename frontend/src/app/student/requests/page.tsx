'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { clearanceService } from '@/services/clearance';
import { ClearanceRequest, User } from '@/types';

export default function StudentRequests() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadRequests();
  }, [router]);

  const loadRequests = async () => {
    try {
      const data = await clearanceService.getMyClearanceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Clearance Requests</h1>
            <p className="text-gray-600 mt-2">View and manage your clearance requests</p>
          </div>
          <button
            onClick={() => router.push('/student/requests/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            New Request
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clearance requests</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first clearance request.</p>
            <button
              onClick={() => router.push('/student/requests/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Create Request
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {requests.map((request) => (
                <li key={request.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => router.push(`/student/requests/${request.id}`)}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800"
                        >
                          Request #{request.id}
                        </button>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Department:</span> {request.department}
                        </div>
                        <div>
                          <span className="font-medium">Graduation Year:</span> {request.graduation_year}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {new Date(request.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                      {request.reason && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Reason:</span>
                          <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}