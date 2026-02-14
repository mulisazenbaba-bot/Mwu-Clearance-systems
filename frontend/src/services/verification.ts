import api from '@/lib/api';
import { Verification, DashboardStats } from '@/types';

export const verificationService = {
  // Officer endpoints
  async getPendingVerifications(): Promise<{ data: Verification[] }> {
    const response = await api.get('/pending-verifications');
    return response.data;
  },

  async getAllVerifications(): Promise<{ data: Verification[] }> {
    const response = await api.get('/all-verifications');
    return response.data;
  },

  async approveVerification(id: number, data: {
    comments?: string;
    verification_data?: any;
  }): Promise<Verification> {
    const response = await api.post(`/verifications/${id}/approve`, data);
    return response.data.verification;
  },

  async rejectVerification(id: number, data: {
    comments: string;
    verification_data?: any;
  }): Promise<Verification> {
    const response = await api.post(`/verifications/${id}/reject`, data);
    return response.data.verification;
  },

  async getVerifications(clearanceRequestId: number): Promise<Verification[]> {
    const response = await api.get(`/verifications/${clearanceRequestId}`);
    return response.data;
  },

  async getOfficerDashboard(): Promise<DashboardStats> {
    const response = await api.get('/officer/dashboard');
    return response.data;
  },
};