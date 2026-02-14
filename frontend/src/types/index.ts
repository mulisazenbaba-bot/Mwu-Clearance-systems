export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'library_officer' | 'dormitory_officer' | 'department_officer' | 'admin';
  student_id?: string;
  department?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface ClearanceRequest {
  id: number;
  student_id: number;
  student_name: string;
  student_id_number: string;
  department: string;
  graduation_year: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  reason?: string;
  documents?: string[];
  submitted_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  student?: User;
  verifications?: Verification[];
}

export interface Verification {
  id: number;
  clearance_request_id: number;
  officer_id?: number;
  verification_type: 'library' | 'dormitory' | 'department';
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  verification_data?: any;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  officer?: User;
  clearanceRequest?: ClearanceRequest;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  student_id?: string;
  department?: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  total_requests?: number;
  pending_requests?: number;
  in_progress_requests?: number;
  completed_requests?: number;
  total_users?: number;
  total_students?: number;
  total_officers?: number;
  total_verifications?: number;
  pending_verifications?: number;
  approved_verifications?: number;
  rejected_verifications?: number;
  verification_type?: string;
  recent_requests?: ClearanceRequest[];
  recent_verifications?: Verification[];
  recent_users?: User[];
}