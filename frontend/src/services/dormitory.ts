import api from '@/lib/api';

export interface DormitoryProperty {
  id: number;
  property_name: string;
  property_code: string;
  category: string;
  condition: 'good' | 'fair' | 'damaged' | 'needs_repair';
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  assigned_to?: number;
  room_number?: string;
  assigned_at?: string;
  returned_at?: string;
  damage_notes?: string;
  assignedStudent?: {
    id: number;
    name: string;
    student_id: string;
  };
}

export interface StudentPropertiesCheck {
  student: {
    id: number;
    name: string;
    student_id: string;
    email: string;
  };
  assigned_properties: DormitoryProperty[];
  damaged_properties: DormitoryProperty[];
  total_assigned: number;
  total_damaged: number;
  has_issues: boolean;
}

export const dormitoryService = {
  // Get all dormitory properties
  async getProperties(params?: {
    status?: string;
    condition?: string;
    room?: string;
    search?: string;
    page?: number;
  }) {
    const response = await api.get('/dormitory/properties', { params });
    return response.data;
  },

  // Check properties for a specific student
  async checkStudentProperties(studentIdNumber: string): Promise<StudentPropertiesCheck> {
    const response = await api.get(`/dormitory/students/${studentIdNumber}/properties`);
    return response.data.data;
  },

  // Process dormitory verification
  async processVerification(verificationId: number, data: {
    status: 'approved' | 'rejected';
    comments?: string;
  }) {
    const response = await api.post(`/dormitory/verifications/${verificationId}/process`, data);
    return response.data;
  },

  // Add a new property
  async addProperty(propertyData: {
    property_name: string;
    property_code: string;
    category: string;
    room_number?: string;
  }) {
    const response = await api.post('/dormitory/properties', propertyData);
    return response.data;
  },

  // Update property status (assign/return)
  async updatePropertyStatus(propertyId: number, data: {
    action: 'assign' | 'return';
    student_id?: number;
    condition?: 'good' | 'fair' | 'damaged' | 'needs_repair';
    damage_notes?: string;
  }) {
    const response = await api.put(`/dormitory/properties/${propertyId}/status`, data);
    return response.data;
  }
};