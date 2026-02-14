'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { clearanceService } from '@/services/clearance';
import { ClearanceRequest, DashboardStats, User } from '@/types';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [clearanceRequests, setClearanceRequests] = useState<ClearanceRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'users' | 'contact-requests'>('overview');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [pendingContactCount, setPendingContactCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, requestsData, usersData, contactRequestsData, pendingCount] = await Promise.all([
        api.get('/admin/dashboard').then(res => res.data),
        clearanceService.getAllClearanceRequests(),
        api.get('/admin/users').then(res => res.data),
        api.get('/admin/contact-requests').then(res => res.data),
        api.get('/admin/contact-requests/pending-count').then(res => res.data.count)
      ]);
      setStats(dashboardStats);
      setClearanceRequests(requestsData.data);
      setUsers(usersData.data);
      setContactRequests(contactRequestsData.data);
      setPendingContactCount(pendingCount);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'library_officer': return 'bg-green-100 text-green-800';
      case 'dormitory_officer': return 'bg-yellow-100 text-yellow-800';
      case 'department_officer': return 'bg-indigo-100 text-indigo-800';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clearance Requests
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('contact-requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
                activeTab === 'contact-requests'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contact Requests
              {pendingContactCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingContactCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">U</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total_users || 0}</dd>
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
                        <span className="text-white font-bold">S</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Students</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total_students || 0}</dd>
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
                        <span className="text-white font-bold">O</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Officers</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total_officers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Users</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {stats.recent_users?.slice(0, 5).map((recentUser) => (
                  <li key={recentUser.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{recentUser.name}</p>
                        <p className="text-sm text-gray-500">{recentUser.email}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(recentUser.role)}`}>
                        {recentUser.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Clearance Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">All Clearance Requests</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Monitor all student clearance requests</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {clearanceRequests.length === 0 ? (
                <li className="px-4 py-4 text-center text-gray-500">
                  No clearance requests found.
                </li>
              ) : (
                clearanceRequests.map((request) => (
                  <li key={request.id} className="px-4 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {request.student_name} - {request.student_id_number}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Department: {request.department}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Year: {request.graduation_year}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Create New User
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage all system users</p>
              </div>
              <ul className="divide-y divide-gray-200">
                {users.map((userData) => (
                  <li key={userData.id} className="px-4 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(userData.role)}`}>
                              {userData.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Email: {userData.email}
                            </p>
                            {userData.department && (
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Department: {userData.department}
                              </p>
                            )}
                            {userData.student_id && (
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Student ID: {userData.student_id}
                              </p>
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
        )}

        {/* Contact Requests Tab */}
        {activeTab === 'contact-requests' && (
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Requests</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  New user registration requests - {pendingContactCount} pending
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {contactRequests.length === 0 ? (
                  <li className="px-4 py-4 text-center text-gray-500">
                    No contact requests found.
                  </li>
                ) : (
                  contactRequests.map((request) => (
                    <li key={request.id} className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.name}</p>
                              <p className="text-sm text-gray-500">{request.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              request.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            {request.phone && (
                              <p>📞 {request.phone}</p>
                            )}
                            {request.student_id && (
                              <p>🎓 {request.student_id}</p>
                            )}
                            {request.department && (
                              <p>🏢 {request.department}</p>
                            )}
                            <p>👤 {request.role_type.replace('_', ' ')}</p>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {request.message}
                          </p>
                          {request.admin_notes && (
                            <p className="text-sm text-indigo-700 bg-indigo-50 p-2 rounded mt-2">
                              <strong>Admin Notes:</strong> {request.admin_notes}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Submitted: {new Date(request.created_at).toLocaleString()}
                          </p>
                          {request.status === 'pending' && (
                            <div className="mt-3 flex space-x-2">
                              <button
                                onClick={async () => {
                                  try {
                                    await api.put(`/admin/contact-requests/${request.id}/status`, {
                                      status: 'contacted',
                                      admin_notes: 'Contacted via email/phone'
                                    });
                                    loadDashboardData();
                                  } catch (error) {
                                    console.error('Error updating status:', error);
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Mark as Contacted
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await api.put(`/admin/contact-requests/${request.id}/status`, {
                                      status: 'completed',
                                      admin_notes: 'Account created and credentials sent'
                                    });
                                    loadDashboardData();
                                  } catch (error) {
                                    console.error('Error updating status:', error);
                                  }
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Mark as Completed
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this request?')) {
                                    try {
                                      await api.delete(`/admin/contact-requests/${request.id}`);
                                      loadDashboardData();
                                    } catch (error) {
                                      console.error('Error deleting request:', error);
                                    }
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onSuccess={() => {
            setShowCreateUserModal(false);
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
}

// Create User Modal Component
function CreateUserModal({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    student_id: '',
    department: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset student_id when role changes to non-student
  const handleRoleChange = (newRole: string) => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      student_id: newRole === 'student' ? prev.student_id : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      const currentToken = authService.getStoredToken();
      console.log('Current token exists:', !!currentToken);
      console.log('Token preview:', currentToken?.substring(0, 50) + '...');
      
      // Prepare form data - don't send student_id for non-student roles
      const submitData: any = { ...formData };
      if (formData.role !== 'student') {
        delete submitData.student_id;
      }
      
      console.log('Submitting user data:', submitData);
      const response = await api.post('/admin/users', submitData);
      console.log('User creation response:', response.data);
      
      // Show success message with email notification info
      alert(`User created successfully!\n\nWelcome email with login credentials has been sent to:\n${formData.email}\n\nThe user will receive:\n- Login URL\n- Email address\n- Password\n- Role information\n- Getting started instructions`);
      
      onSuccess();
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error status text:', err.response?.statusText);
      
      let errorMessage = 'Failed to create user';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Insufficient permissions.';
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        errorMessage = errorMessages.join(', ');
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="library_officer">Library Officer</option>
                <option value="dormitory_officer">Dormitory Officer</option>
                <option value="department_officer">Department Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formData.role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}