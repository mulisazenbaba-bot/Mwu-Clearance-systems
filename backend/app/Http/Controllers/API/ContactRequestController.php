<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class ContactRequestController extends Controller
{
    /**
     * Submit a new contact request (public endpoint)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'student_id' => 'nullable|string|max:50',
            'department' => 'nullable|string|max:255',
            'role_type' => 'required|in:student,library_officer,dormitory_officer,department_officer',
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contactRequest = ContactRequest::create($request->all());

        // Send email notification to admin
        try {
            $this->sendAdminNotification($contactRequest);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('Failed to send admin notification email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Contact request submitted successfully. The administrator will contact you soon.',
            'data' => $contactRequest
        ], 201);
    }

    /**
     * Get all contact requests (admin only)
     */
    public function index()
    {
        $user = auth()->user();
        
        if (!$user || !$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $contactRequests = ContactRequest::recent()->paginate(20);

        return response()->json($contactRequests);
    }

    /**
     * Get pending contact requests count (admin only)
     */
    public function pendingCount()
    {
        $user = auth()->user();
        
        if (!$user || !$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $count = ContactRequest::pending()->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Update contact request status (admin only)
     */
    public function updateStatus(Request $request, $id)
    {
        $user = auth()->user();
        
        if (!$user || !$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,contacted,completed,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contactRequest = ContactRequest::findOrFail($id);
        
        $contactRequest->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'contacted_at' => $request->status === 'contacted' ? now() : $contactRequest->contacted_at,
        ]);

        // Send email notification to user when status changes
        try {
            $this->sendUserNotification($contactRequest, $request->status, $request->admin_notes);
        } catch (\Exception $e) {
            \Log::error('Failed to send user notification email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Contact request updated successfully',
            'data' => $contactRequest
        ]);
    }

    /**
     * Delete contact request (admin only)
     */
    public function destroy($id)
    {
        $user = auth()->user();
        
        if (!$user || !$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $contactRequest = ContactRequest::findOrFail($id);
        $contactRequest->delete();

        return response()->json([
            'message' => 'Contact request deleted successfully'
        ]);
    }

    /**
     * Send email notification to admin
     */
    private function sendAdminNotification($contactRequest)
    {
        $adminEmail = 'mulisazenbaba@gmail.com';
        
        $subject = 'New Contact Request - MWU Clearance System';
        
        $message = "New contact request received:\n\n";
        $message .= "Name: {$contactRequest->name}\n";
        $message .= "Email: {$contactRequest->email}\n";
        $message .= "Phone: {$contactRequest->phone}\n";
        $message .= "Student ID: {$contactRequest->student_id}\n";
        $message .= "Department: {$contactRequest->department}\n";
        $message .= "Role Type: {$contactRequest->role_type}\n";
        $message .= "Message: {$contactRequest->message}\n";
        $message .= "\nSubmitted at: {$contactRequest->created_at}\n";
        $message .= "\nPlease login to your dashboard to review this request.";

        // Simple mail sending (you may need to configure mail settings in .env)
        Mail::raw($message, function ($mail) use ($adminEmail, $subject) {
            $mail->to($adminEmail)
                 ->subject($subject);
        });
    }

    /**
     * Send email notification to user about status update
     */
    private function sendUserNotification($contactRequest, $status, $adminNotes)
    {
        $statusMessages = [
            'contacted' => 'Your contact request has been reviewed and we will get back to you soon.',
            'completed' => 'Your contact request has been completed. You should have received further instructions.',
            'rejected' => 'Unfortunately, your contact request could not be processed at this time.',
        ];

        $subject = 'Contact Request Update - MWU Clearance System';
        
        $message = "Dear {$contactRequest->name},\n\n";
        $message .= "Your contact request status has been updated.\n\n";
        $message .= "Status: " . strtoupper($status) . "\n\n";
        
        if (isset($statusMessages[$status])) {
            $message .= $statusMessages[$status] . "\n\n";
        }
        
        if ($adminNotes) {
            $message .= "Admin Notes:\n{$adminNotes}\n\n";
        }
        
        $message .= "Original Request Details:\n";
        $message .= "- Role Type: {$contactRequest->role_type}\n";
        $message .= "- Department: {$contactRequest->department}\n";
        if ($contactRequest->student_id) {
            $message .= "- Student ID: {$contactRequest->student_id}\n";
        }
        $message .= "\nIf you have any questions, please contact:\n";
        $message .= "Email: mulisazenbaba@gmail.com\n";
        $message .= "Phone: 0954382579\n\n";
        $message .= "Thank you,\n";
        $message .= "MWU Clearance System Administration";

        Mail::raw($message, function ($mail) use ($contactRequest, $subject) {
            $mail->to($contactRequest->email)
                 ->subject($subject);
        });
    }
}
