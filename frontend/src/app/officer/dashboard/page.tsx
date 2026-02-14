'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { verificationService } from '@/services/verification';
import { libraryService } from '@/services/library';
import { dormitoryService } from '@/services/dormitory';
import { academicService } from '@/services/academic';
import { Verification, DashboardStats, User } from '@/types';
import api from '@/lib/api';

export default function OfficerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [pendingVerifications, setPendingVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [activeTab, setActiveTab] = useState('verifications');
  const [studentSearchId, setStudentSearchId] = useState('');
  const [studentCheckResult, setStudentCheckResult] = useState<any>(null);
  const [checkingStudent, setCheckingStudent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    if (!currentUser || !['library_officer', 'dormitory_officer', 'department_officer'].includes(currentUser.role)) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, allVerifications] = await Promise.all([
        verificationService.getOfficerDashboard(),
        verificationService.getAllVerifications()
      ]);
      setStats(dashboardStats);
      setPendingVerifications(allVerifications.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (verification: Verification, action: 'approve' | 'reject') => {
    setSelectedVerification(verification);
    setActionType(action);
    setShowActionModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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

  const getVerificationTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'library': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'dormitory': return 'bg-green-100 text-green-800 border-green-300';
      case 'department': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCheckStudent = async () => {
    if (!studentSearchId.trim()) {
      alert('Please enter a Student ID');
      return;
    }
    
    setCheckingStudent(true);
    setStudentCheckResult(null);
    
    try {
      let result;
      if (user?.role === 'library_officer') {
        result = await libraryService.checkStudentBooks(studentSearchId.trim());
      } else if (user?.role === 'dormitory_officer') {
        result = await dormitoryService.checkStudentProperties(studentSearchId.trim());
      } else if (user?.role === 'department_officer') {
        result = await academicService.checkStudentRecord(studentSearchId.trim());
      }
      setStudentCheckResult(result);
    } catch (error: any) {
      console.error('Error checking student:', error);
      alert(error.response?.data?.message || 'Error checking student. Please make sure the Student ID is correct.');
    } finally {
      setCheckingStudent(false);
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'library_officer': return 'Library Officer';
      case 'dormitory_officer': return 'Dormitory Officer';
      case 'department_officer': return 'Department Officer';
      default: return 'Officer';
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
          <h1 className="text-3xl font-bold text-gray-900">{getRoleTitle(user?.role || '')}</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('verifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'verifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Verifications
            </button>
            <button
              onClick={() => setActiveTab('check-student')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'check-student'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Check Student
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Verifications</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Review and process clearance requests</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {pendingVerifications.length === 0 ? (
                <li className="px-4 py-4 text-center text-gray-500">
                  No verifications found.
                </li>
              ) : (
                pendingVerifications.map((verification) => (
                  <li key={verification.id} className="px-4 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getVerificationTypeIcon(verification.verification_type)}</span>
                            <p className="text-sm font-medium text-indigo-600">
                              {verification.clearanceRequest?.student_name} - {verification.clearanceRequest?.student_id_number}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationTypeBadgeColor(verification.verification_type)}`}>
                              {verification.verification_type}
                            </span>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(verification.status)}`}>
                            {verification.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {getVerificationTypeLabel(verification.verification_type)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {verification.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAction(verification, 'approve')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(verification, 'reject')}
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
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

        {/* Check Student Tab */}
        {activeTab === 'check-student' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Check Student Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Enter a student ID to check their {user?.role === 'library_officer' ? 'books' : user?.role === 'dormitory_officer' ? 'properties' : 'academic record'}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={studentSearchId}
                  onChange={(e) => setStudentSearchId(e.target.value)}
                  placeholder="Enter Student ID (e.g., MWU001)"
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2"
                />
                <button
                  onClick={handleCheckStudent}
                  disabled={checkingStudent}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                >
                  {checkingStudent ? 'Checking...' : 'Check Student'}
                </button>
              </div>

              {studentCheckResult && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Results:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(studentCheckResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-2xl">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Verifications</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total_verifications || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-2xl">⏳</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.pending_verifications || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-2xl">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.approved_verifications || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedVerification && (
        <ActionModal
          verification={selectedVerification}
          actionType={actionType}
          onClose={() => {
            setShowActionModal(false);
            setSelectedVerification(null);
          }}
          onSuccess={() => {
            setShowActionModal(false);
            setSelectedVerification(null);
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
}

// Action Modal Component
function ActionModal({ verification, actionType, onClose, onSuccess }: {
  verification: Verification;
  actionType: 'approve' | 'reject';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (actionType === 'approve') {
        await verificationService.approveVerification(verification.id, { comments });
      } else {
        await verificationService.rejectVerification(verification.id, { comments });
      }
      onSuccess();
    } catch (error) {
      console.error('Error processing verification:', error);
      alert('Error processing verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {actionType === 'approve' ? 'Approve' : 'Reject'} Verification
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Comments {actionType === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required={actionType === 'reject'}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter your comments..."
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
                className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
