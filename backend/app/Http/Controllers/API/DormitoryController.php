<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DormitoryProperty;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DormitoryController extends Controller
{
    // Get all dormitory properties
    public function getProperties(Request $request)
    {
        $query = DormitoryProperty::with('assignedStudent:id,name,student_id');
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by condition
        if ($request->has('condition')) {
            $query->where('condition', $request->condition);
        }
        
        // Filter by room
        if ($request->has('room')) {
            $query->where('room_number', $request->room);
        }
        
        // Search by property name or code
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('property_name', 'like', "%{$search}%")
                  ->orWhere('property_code', 'like', "%{$search}%");
            });
        }
        
        $properties = $query->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $properties
        ]);
    }

    // Check properties assigned to a specific student
    public function checkStudentProperties($studentIdNumber)
    {
        $user = Auth::user();
        
        if (!$user->isDormitoryOfficer() && !$user->isAdmin()) {
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

        $assignedProperties = DormitoryProperty::where('assigned_to', $student->id)
                                             ->where('status', 'assigned')
                                             ->get();

        $damagedProperties = $assignedProperties->filter(function($property) {
            return $property->isDamaged();
        });

        return response()->json([
            'success' => true,
            'data' => [
                'student' => $student->only(['id', 'name', 'student_id', 'email']),
                'assigned_properties' => $assignedProperties,
                'damaged_properties' => $damagedProperties,
                'total_assigned' => $assignedProperties->count(),
                'total_damaged' => $damagedProperties->count(),
                'has_issues' => $damagedProperties->count() > 0
            ]
        ]);
    }

    // Process dormitory verification for clearance
    public function processVerification(Request $request, $verificationId)
    {
        $user = Auth::user();
        
        if (!$user->isDormitoryOfficer() && !$user->isAdmin()) {
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
                                  ->where('verification_type', 'dormitory')
                                  ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Verification not found'
            ], 404);
        }

        $clearanceRequest = $verification->clearanceRequest;
        $studentId = $clearanceRequest->student_id;

        // Check student's property status
        $assignedProperties = DormitoryProperty::where('assigned_to', $studentId)
                                             ->where('status', 'assigned')
                                             ->get();

        $damagedProperties = $assignedProperties->filter(function($property) {
            return $property->isDamaged();
        });

        // Auto-reject if student has damaged properties
        if ($request->status === 'approved' && $damagedProperties->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot approve clearance. Student has damaged dormitory properties.',
                'data' => [
                    'damaged_properties' => $damagedProperties
                ]
            ], 400);
        }

        $verification->update([
            'status' => $request->status,
            'comments' => $request->comments,
            'officer_id' => $user->id,
            'verified_at' => now(),
            'verification_data' => [
                'assigned_properties_count' => $assignedProperties->count(),
                'damaged_properties_count' => $damagedProperties->count(),
                'properties_checked_at' => now()
            ]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Dormitory verification processed successfully',
            'data' => $verification->load(['clearanceRequest', 'officer'])
        ]);
    }

    // Add a new property
    public function addProperty(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->isDormitoryOfficer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'property_name' => 'required|string|max:255',
            'property_code' => 'required|string|unique:dormitory_properties,property_code',
            'category' => 'required|string|max:100',
            'room_number' => 'nullable|string|max:50'
        ]);

        $property = DormitoryProperty::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Property added successfully',
            'data' => $property
        ], 201);
    }

    // Update property status (assign/return)
    public function updatePropertyStatus(Request $request, $propertyId)
    {
        $user = Auth::user();
        
        if (!$user->isDormitoryOfficer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'action' => 'required|in:assign,return',
            'student_id' => 'required_if:action,assign|exists:users,id',
            'condition' => 'required_if:action,return|in:good,fair,damaged,needs_repair',
            'damage_notes' => 'nullable|string|max:1000'
        ]);

        $property = DormitoryProperty::findOrFail($propertyId);

        if ($request->action === 'assign') {
            if (!$property->isAvailable()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Property is not available for assignment'
                ], 400);
            }

            $property->update([
                'status' => 'assigned',
                'assigned_to' => $request->student_id,
                'assigned_at' => now(),
                'returned_at' => null
            ]);

            $message = 'Property assigned successfully';
        } else {
            $property->update([
                'status' => 'available',
                'assigned_to' => null,
                'assigned_at' => null,
                'returned_at' => now(),
                'condition' => $request->condition,
                'damage_notes' => $request->damage_notes
            ]);

            $message = 'Property returned successfully';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $property->load('assignedStudent')
        ]);
    }
}