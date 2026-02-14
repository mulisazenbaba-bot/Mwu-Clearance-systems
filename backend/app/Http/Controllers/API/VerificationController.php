<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use App\Models\ClearanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VerificationController extends Controller
{
    /**
     * Get all verifications for the current officer (not just pending)
     */
    public function allVerifications()
    {
        $user = auth()->user();

        // Determine verification type based on user role
        $verificationType = null;
        if ($user->isLibraryOfficer()) {
            $verificationType = 'library';
        } elseif ($user->isDormitoryOfficer()) {
            $verificationType = 'dormitory';
        } elseif ($user->isDepartmentOfficer()) {
            $verificationType = 'department';
        } else {
            return response()->json(['error' => 'User is not an officer'], 403);
        }

        $verifications = Verification::where('verification_type', $verificationType)
            ->with(['clearanceRequest.student'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($verifications);
    }

    /**
     * Get pending verifications for the current officer
     */
    public function pendingVerifications()
    {
        $user = auth()->user();

        // Determine verification type based on user role
        $verificationType = null;
        if ($user->isLibraryOfficer()) {
            $verificationType = 'library';
        } elseif ($user->isDormitoryOfficer()) {
            $verificationType = 'dormitory';
        } elseif ($user->isDepartmentOfficer()) {
            $verificationType = 'department';
        } else {
            return response()->json(['error' => 'User is not an officer'], 403);
        }

        $verifications = Verification::where('verification_type', $verificationType)
            ->where('status', 'pending')
            ->with(['clearanceRequest.student'])
            ->paginate(10);

        return response()->json($verifications);
    }

    /**
     * Approve a verification
     */
    public function approve(Request $request, $id)
    {
        $user = auth()->user();
        $verification = Verification::findOrFail($id);

        // Check if user can approve this verification type
        if (!$this->canHandleVerification($user, $verification)) {
            return response()->json(['error' => 'Unauthorized to handle this verification'], 403);
        }

        $validator = Validator::make($request->all(), [
            'comments' => 'nullable|string',
            'verification_data' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $verification->update([
            'officer_id' => $user->id,
            'status' => 'approved',
            'comments' => $request->comments,
            'verification_data' => $request->verification_data,
            'verified_at' => now(),
        ]);

        // Update clearance request status
        $clearanceRequest = $verification->clearanceRequest;
        
        // If this is the first verification being processed, change status to in_progress
        if ($clearanceRequest->status === 'pending') {
            $clearanceRequest->update(['status' => 'in_progress']);
        }
        
        // Check if all verifications are approved
        if ($clearanceRequest->allVerificationsApproved()) {
            $clearanceRequest->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Verification approved successfully',
            'verification' => $verification->load(['clearanceRequest.student', 'officer'])
        ]);
    }

    /**
     * Reject a verification
     */
    public function reject(Request $request, $id)
    {
        $user = auth()->user();
        $verification = Verification::findOrFail($id);

        // Check if user can reject this verification type
        if (!$this->canHandleVerification($user, $verification)) {
            return response()->json(['error' => 'Unauthorized to handle this verification'], 403);
        }

        $validator = Validator::make($request->all(), [
            'comments' => 'required|string',
            'verification_data' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $verification->update([
            'officer_id' => $user->id,
            'status' => 'rejected',
            'comments' => $request->comments,
            'verification_data' => $request->verification_data,
            'verified_at' => now(),
        ]);

        // Update clearance request status to rejected immediately
        $verification->clearanceRequest->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Verification rejected successfully',
            'verification' => $verification->load(['clearanceRequest.student', 'officer'])
        ]);
    }

    /**
     * Get verifications for a specific clearance request
     */
    public function getVerifications($clearanceRequestId)
    {
        $user = auth()->user();
        $clearanceRequest = ClearanceRequest::findOrFail($clearanceRequestId);

        // Check if user can view these verifications
        if (!$user->isAdmin() && $clearanceRequest->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $verifications = Verification::where('clearance_request_id', $clearanceRequestId)
            ->with('officer')
            ->get();

        return response()->json($verifications);
    }

    /**
     * Officer dashboard data
     */
    public function officerDashboard()
    {
        $user = auth()->user();

        // Determine verification type based on user role
        $verificationType = null;
        if ($user->isLibraryOfficer()) {
            $verificationType = 'library';
        } elseif ($user->isDormitoryOfficer()) {
            $verificationType = 'dormitory';
        } elseif ($user->isDepartmentOfficer()) {
            $verificationType = 'department';
        } else {
            return response()->json(['error' => 'User is not an officer'], 403);
        }

        $totalVerifications = Verification::where('verification_type', $verificationType)->count();
        $pendingVerifications = Verification::where('verification_type', $verificationType)
            ->where('status', 'pending')->count();
        $approvedVerifications = Verification::where('verification_type', $verificationType)
            ->where('status', 'approved')->count();
        $rejectedVerifications = Verification::where('verification_type', $verificationType)
            ->where('status', 'rejected')->count();

        $recentVerifications = Verification::where('verification_type', $verificationType)
            ->with(['clearanceRequest.student'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'verification_type' => $verificationType,
            'total_verifications' => $totalVerifications,
            'pending_verifications' => $pendingVerifications,
            'approved_verifications' => $approvedVerifications,
            'rejected_verifications' => $rejectedVerifications,
            'recent_verifications' => $recentVerifications
        ]);
    }

    /**
     * Check if user can handle a specific verification
     */
    private function canHandleVerification($user, $verification)
    {
        if ($user->isAdmin()) {
            return true;
        }

        switch ($verification->verification_type) {
            case 'library':
                return $user->isLibraryOfficer();
            case 'dormitory':
                return $user->isDormitoryOfficer();
            case 'department':
                return $user->isDepartmentOfficer();
            default:
                return false;
        }
    }
}
