<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AcademicRecord;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AcademicController extends Controller
{
    // Get all academic records
    public function getRecords(Request $request)
    {
        $query = AcademicRecord::with('student:id,name,student_id,email');
        
        // Filter by department
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by graduation eligibility
        if ($request->has('graduation_eligible')) {
            $query->where('graduation_eligible', $request->boolean('graduation_eligible'));
        }
        
        // Search by student ID or name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('student_id_number', 'like', "%{$search}%")
                  ->orWhereHas('student', function($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $records = $query->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $records
        ]);
    }

    // Check academic record for a specific student
    public function checkStudentRecord($studentIdNumber)
    {
        $user = Auth::user();
        
        if (!$user->isDepartmentOfficer() && !$user->isAdmin()) {
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

        $academicRecord = AcademicRecord::where('student_id', $student->id)->first();

        if (!$academicRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Academic record not found for this student'
            ], 404);
        }

        $issues = [];
        
        // Check for issues
        if (!$academicRecord->isRegistered()) {
            $issues[] = 'Student is not registered for current semester';
        }
        
        if ($academicRecord->hasOutstandingFees()) {
            $issues[] = "Outstanding fees: $" . number_format($academicRecord->outstanding_fees, 2);
        }
        
        if (!$academicRecord->isGraduationEligible()) {
            $issues[] = 'Student is not eligible for graduation';
        }
        
        if (!$academicRecord->isActive()) {
            $issues[] = 'Student status is not active';
        }

        return response()->json([
            'success' => true,
            'data' => [
                'student' => $student->only(['id', 'name', 'student_id', 'email', 'department']),
                'academic_record' => $academicRecord,
                'issues' => $issues,
                'has_issues' => count($issues) > 0
            ]
        ]);
    }

    // Process academic verification for clearance
    public function processVerification(Request $request, $verificationId)
    {
        $user = Auth::user();
        
        if (!$user->isDepartmentOfficer() && !$user->isAdmin()) {
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
                                  ->where('verification_type', 'department')
                                  ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Verification not found'
            ], 404);
        }

        $clearanceRequest = $verification->clearanceRequest;
        $studentId = $clearanceRequest->student_id;

        // Check student's academic record
        $academicRecord = AcademicRecord::where('student_id', $studentId)->first();

        if (!$academicRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Academic record not found for this student'
            ], 404);
        }

        $issues = [];
        
        // Check for issues that would prevent approval
        if ($request->status === 'approved') {
            if (!$academicRecord->isRegistered()) {
                $issues[] = 'Student is not registered for current semester';
            }
            
            if ($academicRecord->hasOutstandingFees()) {
                $issues[] = "Outstanding fees: $" . number_format($academicRecord->outstanding_fees, 2);
            }
            
            if (!$academicRecord->isGraduationEligible()) {
                $issues[] = 'Student is not eligible for graduation';
            }
            
            if (!$academicRecord->isActive()) {
                $issues[] = 'Student status is not active';
            }

            if (count($issues) > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot approve clearance due to academic issues.',
                    'data' => [
                        'issues' => $issues
                    ]
                ], 400);
            }
        }

        $verification->update([
            'status' => $request->status,
            'comments' => $request->comments,
            'officer_id' => $user->id,
            'verified_at' => now(),
            'verification_data' => [
                'gpa' => $academicRecord->gpa,
                'completed_credits' => $academicRecord->completed_credits,
                'outstanding_fees' => $academicRecord->outstanding_fees,
                'registration_status' => $academicRecord->registration_status,
                'graduation_eligible' => $academicRecord->graduation_eligible,
                'record_checked_at' => now()
            ]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Academic verification processed successfully',
            'data' => $verification->load(['clearanceRequest', 'officer'])
        ]);
    }

    // Create or update academic record
    public function updateRecord(Request $request, $studentId = null)
    {
        $user = Auth::user();
        
        if (!$user->isDepartmentOfficer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'student_id' => 'required_without:' . $studentId . '|exists:users,id',
            'student_id_number' => 'required|string',
            'department' => 'required|string',
            'program' => 'required|string',
            'year_of_study' => 'required|integer|min:1|max:7',
            'semester' => 'required|string',
            'gpa' => 'nullable|numeric|min:0|max:4',
            'total_credits' => 'required|integer|min:0',
            'completed_credits' => 'required|integer|min:0',
            'status' => 'required|in:active,inactive,graduated,suspended',
            'graduation_eligible' => 'boolean',
            'outstanding_fees' => 'numeric|min:0',
            'registration_status' => 'required|in:registered,not_registered,pending'
        ]);

        $targetStudentId = $studentId ?? $request->student_id;
        
        $academicRecord = AcademicRecord::updateOrCreate(
            ['student_id' => $targetStudentId],
            $request->except(['student_id']) + ['student_id' => $targetStudentId]
        );

        return response()->json([
            'success' => true,
            'message' => 'Academic record updated successfully',
            'data' => $academicRecord->load('student')
        ]);
    }
}