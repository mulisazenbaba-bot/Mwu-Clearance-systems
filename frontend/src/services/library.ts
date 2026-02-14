import api from '@/lib/api';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'lost';
  borrowed_by?: number;
  borrowed_at?: string;
  due_date?: string;
  returned_at?: string;
  borrower?: {
    id: number;
    name: string;
    student_id: string;
  };
}

export interface StudentBooksCheck {
  student: {
    id: number;
    name: string;
    student_id: string;
    email: string;
  };
  borrowed_books: Book[];
  overdue_books: Book[];
  total_borrowed: number;
  total_overdue: number;
  has_issues: boolean;
}

export const libraryService = {
  // Get all books
  async getBooks(params?: {
    status?: string;
    search?: string;
    page?: number;
  }) {
    const response = await api.get('/library/books', { params });
    return response.data;
  },

  // Check books for a specific student
  async checkStudentBooks(studentIdNumber: string): Promise<StudentBooksCheck> {
    const response = await api.get(`/library/students/${studentIdNumber}/books`);
    return response.data.data;
  },

  // Process library verification
  async processVerification(verificationId: number, data: {
    status: 'approved' | 'rejected';
    comments?: string;
  }) {
    const response = await api.post(`/library/verifications/${verificationId}/process`, data);
    return response.data;
  },

  // Add a new book
  async addBook(bookData: {
    title: string;
    author: string;
    isbn?: string;
    category: string;
  }) {
    const response = await api.post('/library/books', bookData);
    return response.data;
  },

  // Update book status (borrow/return)
  async updateBookStatus(bookId: number, data: {
    action: 'borrow' | 'return';
    student_id?: number;
    due_date?: string;
  }) {
    const response = await api.put(`/library/books/${bookId}/status`, data);
    return response.data;
  }
};