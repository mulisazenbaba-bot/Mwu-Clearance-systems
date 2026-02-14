<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:student,library_officer,dormitory_officer,department_officer,admin',
            'student_id' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'student_id' => $request->student_id,
            'department' => $request->department,
            'phone' => $request->phone,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me()
    {
        return response()->json([
            'user' => auth()->user()
        ]);
    }

    /**
     * Logout user
     */
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Refresh token
     */
    public function refresh()
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());

        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    /**
     * Admin dashboard data
     */
    public function adminDashboard()
    {
        $totalUsers = User::count();
        $totalStudents = User::where('role', 'student')->count();
        $totalOfficers = User::whereIn('role', ['library_officer', 'dormitory_officer', 'department_officer'])->count();
        
        return response()->json([
            'total_users' => $totalUsers,
            'total_students' => $totalStudents,
            'total_officers' => $totalOfficers,
            'recent_users' => User::latest()->take(5)->get()
        ]);
    }

    /**
     * Get all users (Admin only)
     */
    public function getAllUsers()
    {
        $users = User::paginate(10);
        return response()->json($users);
    }

    /**
     * Create user (Admin only)
     */
    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:student,library_officer,dormitory_officer,department_officer,admin',
            'student_id' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Store the plain password before hashing
        $plainPassword = $request->password;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'student_id' => $request->student_id,
            'department' => $request->department,
            'phone' => $request->phone,
        ]);

        // Send welcome email with credentials
        try {
            $this->sendWelcomeEmail($user, $plainPassword);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'User created successfully. Welcome email sent to ' . $user->email,
            'user' => $user
        ], 201);
    }

    /**
     * Send welcome email with login credentials
     */
    private function sendWelcomeEmail($user, $plainPassword)
    {
        $loginUrl = env('FRONTEND_URL', 'http://localhost:3000') . '/login';
        
        $roleNames = [
            'student' => 'Student',
            'library_officer' => 'Library Officer',
            'dormitory_officer' => 'Dormitory Officer',
            'department_officer' => 'Department Officer',
            'admin' => 'Administrator'
        ];
        
        $roleName = $roleNames[$user->role] ?? $user->role;
        
        $subject = 'Welcome to MWU Clearance System - Your Account Details';
        
        $message = "Dear {$user->name},\n\n";
        $message .= "Welcome to the MWU Clearance System!\n\n";
        $message .= "Your account has been successfully created. Below are your login credentials:\n\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $message .= "LOGIN CREDENTIALS\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $message .= "Login URL: {$loginUrl}\n";
        $message .= "Email: {$user->email}\n";
        $message .= "Password: {$plainPassword}\n";
        $message .= "Role: {$roleName}\n";
        
        if ($user->student_id) {
            $message .= "Student ID: {$user->student_id}\n";
        }
        if ($user->department) {
            $message .= "Department: {$user->department}\n";
        }
        
        $message .= "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $message .= "IMPORTANT SECURITY NOTICE:\n";
        $message .= "• Please change your password after your first login\n";
        $message .= "• Keep your credentials secure and confidential\n";
        $message .= "• Do not share your password with anyone\n\n";
        
        $message .= "GETTING STARTED:\n";
        $message .= "1. Visit the login URL above\n";
        $message .= "2. Enter your email and password\n";
        $message .= "3. Click 'Sign In'\n";
        $message .= "4. You will be redirected to your dashboard\n\n";
        
        if ($user->role === 'student') {
            $message .= "As a student, you can:\n";
            $message .= "• Submit clearance requests\n";
            $message .= "• Track your request status\n";
            $message .= "• Download clearance certificates\n";
            $message .= "• View your clearance history\n\n";
        } elseif (in_array($user->role, ['library_officer', 'dormitory_officer', 'department_officer'])) {
            $message .= "As an officer, you can:\n";
            $message .= "• Review student clearance requests\n";
            $message .= "• Check student records\n";
            $message .= "• Approve or reject verifications\n";
            $message .= "• View statistics and reports\n\n";
        } elseif ($user->role === 'admin') {
            $message .= "As an administrator, you can:\n";
            $message .= "• Manage all users\n";
            $message .= "• Oversee clearance requests\n";
            $message .= "• View system statistics\n";
            $message .= "• Handle contact requests\n\n";
        }
        
        $message .= "If you have any questions or need assistance, please contact:\n";
        $message .= "Email: mulisazenbaba@gmail.com\n";
        $message .= "Phone: 0954382579\n\n";
        $message .= "Best regards,\n";
        $message .= "MWU Clearance System Administration\n";

        \Mail::raw($message, function ($mail) use ($user, $subject) {
            $mail->to($user->email)
                 ->subject($subject);
        });
    }

    /**
     * Update user (Admin only)
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:6',
            'role' => 'sometimes|required|in:student,library_officer,dormitory_officer,department_officer,admin',
            'student_id' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = $request->only(['name', 'email', 'role', 'student_id', 'department', 'phone']);
        
        if ($request->has('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete user (Admin only)
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
