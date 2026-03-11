<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ClearanceRequestController;
use App\Http\Controllers\API\VerificationController;
use App\Http\Controllers\API\LibraryController;
use App\Http\Controllers\API\DormitoryController;
use App\Http\Controllers\API\AcademicController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Public contact request route
Route::post('/contact-requests', [\App\Http\Controllers\API\ContactRequestController::class, 'store']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Clearance Request routes
    Route::apiResource('clearance-requests', ClearanceRequestController::class);
    Route::get('/my-clearance-requests', [ClearanceRequestController::class, 'myRequests']);
    Route::post('/clearance-requests/{id}/submit', [ClearanceRequestController::class, 'submit']);
    Route::get('/clearance-requests/{id}/certificate/download', [ClearanceRequestController::class, 'downloadCertificate']);
    Route::get('/clearance-requests/{id}/certificate/preview', [ClearanceRequestController::class, 'previewCertificate']);

    // Verification routes
    Route::get('/pending-verifications', [VerificationController::class, 'pendingVerifications']);
    Route::post('/verifications/{id}/approve', [VerificationController::class, 'approve']);
    Route::post('/verifications/{id}/reject', [VerificationController::class, 'reject']);
    Route::get('/verifications/{clearanceRequestId}', [VerificationController::class, 'getVerifications']);

    // Library routes
    Route::prefix('library')->group(function () {
        Route::get('/books', [LibraryController::class, 'getBooks']);
        Route::get('/students/{studentIdNumber}/books', [LibraryController::class, 'checkStudentBooks']);
        Route::post('/verifications/{verificationId}/process', [LibraryController::class, 'processVerification']);
        Route::post('/books', [LibraryController::class, 'addBook']);
        Route::put('/books/{bookId}/status', [LibraryController::class, 'updateBookStatus']);
    });

    // Dormitory routes
    Route::prefix('dormitory')->group(function () {
        Route::get('/properties', [DormitoryController::class, 'getProperties']);
        Route::get('/students/{studentIdNumber}/properties', [DormitoryController::class, 'checkStudentProperties']);
        Route::post('/verifications/{verificationId}/process', [DormitoryController::class, 'processVerification']);
        Route::post('/properties', [DormitoryController::class, 'addProperty']);
        Route::put('/properties/{propertyId}/status', [DormitoryController::class, 'updatePropertyStatus']);
    });

    // Academic routes
    Route::prefix('academic')->group(function () {
        Route::get('/records', [AcademicController::class, 'getRecords']);
        Route::get('/students/{studentIdNumber}/record', [AcademicController::class, 'checkStudentRecord']);
        Route::post('/verifications/{verificationId}/process', [AcademicController::class, 'processVerification']);
        Route::post('/records', [AcademicController::class, 'updateRecord']);
        Route::put('/students/{studentId}/record', [AcademicController::class, 'updateRecord']);
    });

    // Helper route to list students (for testing)
    Route::get('/students/list', function() {
        $students = \App\Models\User::where('role', 'student')
            ->select('id', 'name', 'student_id', 'email', 'department')
            ->get();
        return response()->json(['students' => $students]);
    });

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AuthController::class, 'adminDashboard']);
        Route::get('/admin/users', [AuthController::class, 'getAllUsers']);
        Route::post('/admin/users', [AuthController::class, 'createUser']);
        Route::put('/admin/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AuthController::class, 'deleteUser']);
        
        // Contact requests management
        Route::get('/admin/contact-requests', [\App\Http\Controllers\API\ContactRequestController::class, 'index']);
        Route::get('/admin/contact-requests/pending-count', [\App\Http\Controllers\API\ContactRequestController::class, 'pendingCount']);
        Route::put('/admin/contact-requests/{id}/status', [\App\Http\Controllers\API\ContactRequestController::class, 'updateStatus']);
        Route::delete('/admin/contact-requests/{id}', [\App\Http\Controllers\API\ContactRequestController::class, 'destroy']);
    });

    // Officer routes
    Route::middleware('role:library_officer,dormitory_officer,department_officer')->group(function () {
        Route::get('/officer/dashboard', [VerificationController::class, 'officerDashboard']);
        Route::get('/pending-verifications', [VerificationController::class, 'pendingVerifications']);
        Route::get('/all-verifications', [VerificationController::class, 'allVerifications']);
    });

    // Student routes
    Route::middleware('role:student')->group(function () {
        Route::get('/student/dashboard', [ClearanceRequestController::class, 'studentDashboard']);
    });
});

// Health check endpoint for Render
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'service' => 'MWU Clearance System API'
    ]);
});