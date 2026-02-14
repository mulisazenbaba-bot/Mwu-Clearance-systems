import api from '@/lib/api';
import { User, DashboardStats } from '@/types';

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getAllUsers(): Promise<{ data: User[] }> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    student_id?: string;
    department?: string;
    phone?: string;
  }): Promise<User> {
    const response = await api.post('/admin/users', userData);
    return response.data.user;
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.user;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};