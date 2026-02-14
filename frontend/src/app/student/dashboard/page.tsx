'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { clearanceService } from '@/services/clearance';
import { ClearanceRequest, DashboardStats, User } from '@/types';

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [requests, setRequests] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, myRequests] = await Promise.all([
        clearanceService.getStudentDashboard(),
        clearanceService.getMyClearanceRequests()
      ]);
      setStats(dashboardStats);
      setRequests(myRequests);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (requestId: number) => {
    try {
      setDownloadingCertificate(requestId);
      await clearanceService.downloadCertificate(requestId);
    } catch (error: any) {
      console.error('Error downloading certificate:', error);
      
      let errorMessage = 'Failed to download certificate. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show more detailed error
      alert(`Certificate Download Error:\n\n${errorMessage}\n\nIf this problem persists, please contact the administrator.`);
    } finally {
      setDownloadingCertificate(null);
    }
  };

  const handlePreviewCertificate = async (requestId: number) => {
    try {
      await clearanceService.previewCertificate(requestId);
    } catch (error) {
      console.error('Error previewing certificate:', error);
      alert('Failed to preview certificate. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
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
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your clearance requests and track their progress</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total_requests || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pending_requests || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">I</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.in_progress_requests || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.completed_requests || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Request Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Create New Clearance Request
          </button>
        </div>

        {/* Clearance Requests Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">My Clearance Requests</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Track your clearance request status</p>
          </div>
          <ul className="divide-y divide-gray-200">
            {requests.length === 0 ? (
              <li className="px-4 py-4 text-center text-gray-500">
                No clearance requests found. Create your first request above.
              </li>
            ) : (
              requests.map((request) => (
                <li key={request.id} className="px-4 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => router.push(`/student/requests/${request.id}`)}
                          className="text-sm font-medium text-indigo-600 truncate hover:text-indigo-800"
                        >
                          Request #{request.id} - {request.graduation_year}
                        </button>
                        <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {request.status === 'completed' && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handlePreviewCertificate(request.id)}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                                title="Preview Certificate"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => handleDownloadCertificate(request.id)}
                                disabled={downloadingCertificate === request.id}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50"
                                title="Download Certificate"
                              >
                                {downloadingCertificate === request.id ? 'Downloading...' : 'Download'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Department: {request.department}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {request.reason && (
                        <p className="mt-2 text-sm text-gray-600">{request.reason}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>

      {/* Create Request Modal */}
      {showCreateForm && (
        <CreateRequestModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadDashboardData();
          }}
          user={user}
        />
      )}
    </div>
  );
}

// Create Request Modal Component
function CreateRequestModal({ onClose, onSuccess, user }: {
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}) {
  const [formData, setFormData] = useState({
    student_name: user?.name || '',
    student_id_number: user?.student_id || '',
    department: user?.department || '',
    graduation_year: '2024',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await clearanceService.createClearanceRequest(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create Clearance Request</h3>
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.student_id_number}
                onChange={(e) => setFormData({ ...formData, student_id_number: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}