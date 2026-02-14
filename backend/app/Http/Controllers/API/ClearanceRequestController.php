<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ClearanceRequest;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class ClearanceRequestController extends Controller
{
    /**
     * Display a listing of clearance requests
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $requests = ClearanceRequest::with(['student', 'verifications.officer'])->paginate(10);
        } else {
            $requests = ClearanceRequest::where('student_id', $user->id)
                ->with(['verifications.officer'])
                ->paginate(10);
        }

        return response()->json($requests);
    }

    /**
     * Store a newly created clearance request
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->isStudent()) {
            return response()->json(['error' => 'Only students can create clearance requests'], 403);
        }

        $validator = Validator::make($request->all(), [
            'student_name' => 'required|string|max:255',
            'student_id_number' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'graduation_year' => 'required|string|max:4',
            'reason' => 'nullable|string',
            'documents' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $clearanceRequest = ClearanceRequest::create([
            'student_id' => $user->id,
            'student_name' => $request->student_name,
            'student_id_number' => $request->student_id_number,
            'department' => $request->department,
            'graduation_year' => $request->graduation_year,
            'reason' => $request->reason,
            'documents' => $request->documents,
            'status' => 'pending',
        ]);

        // Create verification records for each department
        $verificationTypes = ['library', 'dormitory', 'department'];
        
        foreach ($verificationTypes as $type) {
            Verification::create([
                'clearance_request_id' => $clearanceRequest->id,
                'officer_id' => null, // Will be assigned when officer takes action
                'verification_type' => $type,
                'status' => 'pending',
            ]);
        }

        return response()->json([
            'message' => 'Clearance request created successfully',
            'clearance_request' => $clearanceRequest->load('verifications')
        ], 201);
    }

    /**
     * Display the specified clearance request
     */
    public function show($id)
    {
        $user = auth()->user();
        $clearanceRequest = ClearanceRequest::with(['student', 'verifications.officer'])->findOrFail($id);

        // Check if user can view this request
        if (!$user->isAdmin() && $clearanceRequest->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($clearanceRequest);
    }

    /**
     * Update the specified clearance request
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $clearanceRequest = ClearanceRequest::findOrFail($id);

        // Check if user can update this request
        if (!$user->isAdmin() && $clearanceRequest->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Students can only update pending requests
        if ($user->isStudent() && $clearanceRequest->status !== 'pending') {
            return response()->json(['error' => 'Cannot update request that is already in progress'], 403);
        }

        $validator = Validator::make($request->all(), [
            'student_name' => 'sometimes|required|string|max:255',
            'student_id_number' => 'sometimes|required|string|max:255',
            'department' => 'sometimes|required|string|max:255',
            'graduation_year' => 'sometimes|required|string|max:4',
            'reason' => 'nullable|string',
            'documents' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $clearanceRequest->update($request->only([
            'student_name', 'student_id_number', 'department', 
            'graduation_year', 'reason', 'documents'
        ]));

        return response()->json([
            'message' => 'Clearance request updated successfully',
            'clearance_request' => $clearanceRequest->load('verifications')
        ]);
    }

    /**
     * Remove the specified clearance request
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $clearanceRequest = ClearanceRequest::findOrFail($id);

        // Only admin or the student who created it can delete
        if (!$user->isAdmin() && $clearanceRequest->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Students can only delete pending requests
        if ($user->isStudent() && $clearanceRequest->status !== 'pending') {
            return response()->json(['error' => 'Cannot delete request that is already in progress'], 403);
        }

        $clearanceRequest->delete();

        return response()->json([
            'message' => 'Clearance request deleted successfully'
        ]);
    }

    /**
     * Get current user's clearance requests
     */
    public function myRequests()
    {
        $user = auth()->user();

        if (!$user->isStudent()) {
            return response()->json(['error' => 'Only students can view their requests'], 403);
        }

        $requests = ClearanceRequest::where('student_id', $user->id)
            ->with(['verifications.officer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    /**
     * Submit clearance request (change status to in_progress)
     */
    public function submit($id)
    {
        $user = auth()->user();
        $clearanceRequest = ClearanceRequest::findOrFail($id);

        if (!$user->isStudent() || $clearanceRequest->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($clearanceRequest->status !== 'pending') {
            return response()->json(['error' => 'Request has already been submitted'], 400);
        }

        $clearanceRequest->update(['status' => 'in_progress']);

        return response()->json([
            'message' => 'Clearance request submitted successfully',
            'clearance_request' => $clearanceRequest->load('verifications')
        ]);
    }

    /**
     * Student dashboard data
     */
    public function studentDashboard()
    {
        $user = auth()->user();

        if (!$user->isStudent()) {
            return response()->json(['error' => 'Only students can access student dashboard'], 403);
        }

        $totalRequests = ClearanceRequest::where('student_id', $user->id)->count();
        $pendingRequests = ClearanceRequest::where('student_id', $user->id)
            ->where('status', 'pending')->count();
        $inProgressRequests = ClearanceRequest::where('student_id', $user->id)
            ->where('status', 'in_progress')->count();
        $completedRequests = ClearanceRequest::where('student_id', $user->id)
            ->where('status', 'completed')->count();

        $recentRequests = ClearanceRequest::where('student_id', $user->id)
            ->with(['verifications.officer'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_requests' => $totalRequests,
            'pending_requests' => $pendingRequests,
            'in_progress_requests' => $inProgressRequests,
            'completed_requests' => $completedRequests,
            'recent_requests' => $recentRequests
        ]);
    }

    /**
     * Download clearance certificate
     */
    public function downloadCertificate($id)
    {
        $user = auth()->user();
        $clearanceRequest = ClearanceRequest::with(['student', 'verifications.officer'])->findOrFail($id);

        // Check if user can download this certificate
        if (!$user->isAdmin() && $clearanceRequest->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if clearance is completed
        if ($clearanceRequest->status !== 'completed') {
            return response()->json(['error' => 'Clearance certificate is only available for completed requests'], 400);
        }

        // Check if all verifications are approved
        if (!$clearanceRequest->allVerificationsApproved()) {
            return response()->json(['error' => 'All verifications must be approved to download certificate'], 400);
        }

        // Verify student relationship exists
        if (!$clearanceRequest->student) {
            \Log::error('Certificate download failed: Student not found', [
                'clearance_request_id' => $id,
                'student_id' => $clearanceRequest->student_id
            ]);
            return response()->json(['error' => 'Student information not found'], 500);
        }

        // Verify verifications exist
        if ($clearanceRequest->verifications->count() < 3) {
            \Log::error('Certificate download failed: Missing verifications', [
                'clearance_request_id' => $id,
                'verifications_count' => $clearanceRequest->verifications->count()
            ]);
            return response()->json(['error' => 'Incomplete verification data'], 500);
        }

        try {
            // Generate PDF certificate
            $data = [
                'clearance_request' => $clearanceRequest,
                'student' => $clearanceRequest->student,
                'verifications' => $clearanceRequest->verifications,
                'generated_at' => now()->format('F j, Y \a\t g:i A'),
                'certificate_number' => 'MWU-CLR-' . str_pad($clearanceRequest->id, 6, '0', STR_PAD_LEFT)
            ];

            $pdf = Pdf::loadView('certificates.clearance', $data);
            $pdf->setPaper('A4', 'portrait');

            // Sanitize filename - remove any invalid characters for file systems
            $studentId = preg_replace('/[^A-Za-z0-9_-]/', '_', $clearanceRequest->student_id_number);
            $date = date('Ymd'); // Use format without slashes: 20260206
            $filename = 'clearance_certificate_' . $studentId . '_' . $date . '.pdf';

            return $pdf->download($filename);

        } catch (\Exception $e) {
            \Log::error('Certificate generation failed', [
                'clearance_request_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to generate certificate',
                'message' => $e->getMessage(),
                'details' => 'Please contact administrator if this persists'
            ], 500);
        }
    }

    /**
     * Preview clearance certificate
     */
    public function previewCertificate($id)
    {
        $user = auth()->user();
        $clearanceRequest = ClearanceRequest::with(['student', 'verifications.officer'])->findOrFail($id);

        // Check if user can preview this certificate
        if (!$user->isAdmin() && $clearanceRequest->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if clearance is completed
        if ($clearanceRequest->status !== 'completed') {
            return response()->json(['error' => 'Certificate preview is only available for completed requests'], 400);
        }

        try {
            // Generate PDF certificate for preview
            $data = [
                'clearance_request' => $clearanceRequest,
                'student' => $clearanceRequest->student,
                'verifications' => $clearanceRequest->verifications,
                'generated_at' => now()->format('F j, Y \a\t g:i A'),
                'certificate_number' => 'MWU-CLR-' . str_pad($clearanceRequest->id, 6, '0', STR_PAD_LEFT),
                'is_preview' => true
            ];

            $pdf = Pdf::loadView('certificates.clearance', $data);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->stream('clearance_certificate_preview.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate certificate preview',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
