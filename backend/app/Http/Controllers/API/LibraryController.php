<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LibraryController extends Controller
{
    // Get all books
    public function getBooks(Request $request)
    {
        $query = Book::with('borrower:id,name,student_id');
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Search by title, author, or ISBN
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%");
            });
        }
        
        $books = $query->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }

    // Check books borrowed by a specific student
    public function checkStudentBooks($studentIdNumber)
    {
        $user = Auth::user();
        
        if (!$user->isLibraryOfficer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Find student by student_id (student ID number) instead of database ID
        $student = User::where('student_id', $studentIdNumber)->first();
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $borrowedBooks = Book::where('borrowed_by', $student->id)
                            ->where('status', 'borrowed')
                            ->get();

        $overdueBooks = $borrowedBooks->filter(function($book) {
            return $book->isOverdue();
        });

        return response()->json([
            'success' => true,
            'data' => [
                'student' => $student->only(['id', 'name', 'student_id', 'email']),
                'borrowed_books' => $borrowedBooks,
                'overdue_books' => $overdueBooks,
                'total_borrowed' => $borrowedBooks->count(),
                'total_overdue' => $overdueBooks->count(),
                'has_issues' => $overdueBooks->count() > 0
            ]
        ]);
    }

    // Process library verification for clearance
    public function processVerification(Request $request, $verificationId)
    {
        $user = Auth::user();
        
        if (!$user->isLibraryOfficer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'comments' => 'nullable|string|max:1000'
        ]);

        $verification = Verification::where('id', $verificationId)
                                  ->where('verification_type', 'library')
                                  ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Verification not found'
            ], 404);
        }

        $clearanceRequest = $verification->clearanceRequest;
        $studentId = $clearanceRequest->student_id;

        // Check student's book status
        $borrowedBooks = Book::where('borrowed_by', $studentId)
                            ->where('status', 'borrowed')
                            ->get();

        $overdueBooks = $borrowedBooks->filter(function($book) {
            return $book->isOverdue();
        });

        // Auto-reject if student has overdue books
        if ($request->status === 'approved' && $overdueBooks->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot approve clearance. Student has overdue books.',
                'data' => [
                    'overdue_books' => $overdueBooks
                ]
            ], 400);
        }

        $verification->update([
            'status' => $request->status,
            'comments' => $request->comments,
            'officer_id' => $user->id,
            'verified_at' => now(),
            'verification_data' => [
                'borrowed_books_count' => $borrowedBooks->count(),
                'overdue_books_count' => $overdueBooks->count(),
                'books_checked_at' => now()
            ]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Library verification processed successfully',
            'data' => $verification->load(['clearanceRequest', 'officer'])
        ]);
    }

    // Add a new book
    public function addBook(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->isLibraryOfficer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'nullable|string|unique:books,isbn',
            'category' => 'required|string|max:100'
        ]);

        $book = Book::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Book added successfully',
            'data' => $book
        ], 201);
    }

    // Update book status (borrow/return)
    public function updateBookStatus(Request $request, $bookId)
    {
        $user = Auth::user();
        
        if (!$user->isLibraryOfficer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'action' => 'required|in:borrow,return',
            'student_id' => 'required_if:action,borrow|exists:users,id',
            'due_date' => 'required_if:action,borrow|date|after:today'
        ]);

        $book = Book::findOrFail($bookId);

        if ($request->action === 'borrow') {
            if (!$book->isAvailable()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book is not available for borrowing'
                ], 400);
            }

            $book->update([
                'status' => 'borrowed',
                'borrowed_by' => $request->student_id,
                'borrowed_at' => now(),
                'due_date' => $request->due_date,
                'returned_at' => null
            ]);

            $message = 'Book borrowed successfully';
        } else {
            $book->update([
                'status' => 'available',
                'borrowed_by' => null,
                'borrowed_at' => null,
                'due_date' => null,
                'returned_at' => now()
            ]);

            $message = 'Book returned successfully';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $book->load('borrower')
        ]);
    }
}