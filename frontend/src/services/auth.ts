import api from '@/lib/api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/login', credentials);
      const data = response.data;
      
      // Store token and user data (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/register', userData);
    const data = response.data;
    
    // Store token and user data (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token and user data (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/me');
    return response.data.user;
  },

  async refreshToken(): Promise<string> {
    const response = await api.post('/refresh');
    const token = response.data.token;
    
    // Store token (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    
    return token;
  },

  getStoredUser(): User | null {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return null;
    }
    
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken(): string | null {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return null;
    }
    
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};