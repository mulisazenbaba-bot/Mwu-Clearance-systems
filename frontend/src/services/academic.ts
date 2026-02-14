import api from '@/lib/api';

export interface AcademicRecord {
  id: number;
  student_id: number;
  student_id_number: string;
  department: string;
  program: string;
  year_of_study: number;
  semester: string;
  gpa?: number;
  total_credits: number;
  completed_credits: number;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  graduation_eligible: boolean;
  outstanding_fees: number;
  registration_status: 'registered' | 'not_registered' | 'pending';
  student?: {
    id: number;
    name: string;
    student_id: string;
    email: string;
    department: string;
  };
}

export interface StudentRecordCheck {
  student: {
    id: number;
    name: string;
    student_id: string;
    email: string;
    department: string;
  };
  academic_record: AcademicRecord;
  issues: string[];
  has_issues: boolean;
}

export const academicService = {
  // Get all academic records
  async getRecords(params?: {
    department?: string;
    status?: string;
    graduation_eligible?: boolean;
    search?: string;
    page?: number;
  }) {
    const response = await api.get('/academic/records', { params });
    return response.data;
  },

  // Check academic record for a specific student
  async checkStudentRecord(studentIdNumber: string): Promise<StudentRecordCheck> {
    const response = await api.get(`/academic/students/${studentIdNumber}/record`);
    return response.data.data;
  },

  // Process academic verification
  async processVerification(verificationId: number, data: {
    status: 'approved' | 'rejected';
    comments?: string;
  }) {
    const response = await api.post(`/academic/verifications/${verificationId}/process`, data);
    return response.data;
  },

  // Create or update academic record
  async updateRecord(studentId: number, recordData: {
    student_id_number: string;
    department: string;
    program: string;
    year_of_study: number;
    semester: string;
    gpa?: number;
    total_credits: number;
    completed_credits: number;
    status: 'active' | 'inactive' | 'graduated' | 'suspended';
    graduation_eligible: boolean;
    outstanding_fees: number;
    registration_status: 'registered' | 'not_registered' | 'pending';
  }) {
    const response = await api.put(`/academic/students/${studentId}/record`, recordData);
    return response.data;
  },

  // Create new academic record
  async createRecord(recordData: {
    student_id: number;
    student_id_number: string;
    department: string;
    program: string;
    year_of_study: number;
    semester: string;
    gpa?: number;
    total_credits: number;
    completed_credits: number;
    status: 'active' | 'inactive' | 'graduated' | 'suspended';
    graduation_eligible: boolean;
    outstanding_fees: number;
    registration_status: 'registered' | 'not_registered' | 'pending';
  }) {
    const response = await api.post('/academic/records', recordData);
    return response.data;
  }
};