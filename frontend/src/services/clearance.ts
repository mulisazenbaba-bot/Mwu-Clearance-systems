import api from '@/lib/api';
import { ClearanceRequest, DashboardStats } from '@/types';

export const clearanceService = {
  // Student endpoints
  async createClearanceRequest(data: {
    student_name: string;
    student_id_number: string;
    department: string;
    graduation_year: string;
    reason?: string;
    documents?: string[];
  }): Promise<ClearanceRequest> {
    const response = await api.post('/clearance-requests', data);
    return response.data.clearance_request;
  },

  async getMyClearanceRequests(): Promise<ClearanceRequest[]> {
    const response = await api.get('/my-clearance-requests');
    return response.data;
  },

  async getClearanceRequest(id: number): Promise<ClearanceRequest> {
    const response = await api.get(`/clearance-requests/${id}`);
    return response.data;
  },

  async updateClearanceRequest(id: number, data: Partial<ClearanceRequest>): Promise<ClearanceRequest> {
    const response = await api.put(`/clearance-requests/${id}`, data);
    return response.data.clearance_request;
  },

  async submitClearanceRequest(id: number): Promise<ClearanceRequest> {
    const response = await api.post(`/clearance-requests/${id}/submit`);
    return response.data.clearance_request;
  },

  async deleteClearanceRequest(id: number): Promise<void> {
    await api.delete(`/clearance-requests/${id}`);
  },

  async getStudentDashboard(): Promise<DashboardStats> {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  // Admin endpoints
  async getAllClearanceRequests(): Promise<{ data: ClearanceRequest[] }> {
    const response = await api.get('/clearance-requests');
    return response.data;
  },
  // Download clearance certificate
  async downloadCertificate(requestId: number) {
    const response = await api.get(`/clearance-requests/${requestId}/certificate/download`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'clearance_certificate.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Preview clearance certificate
  async previewCertificate(requestId: number) {
    const response = await api.get(`/clearance-requests/${requestId}/certificate/preview`, {
      responseType: 'blob'
    });
    
    // Create blob URL and open in new tab
    const url = window.URL.createObjectURL(new Blob([response.data]));
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  },
};