<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClearanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'student_name',
        'student_id_number',
        'department',
        'graduation_year',
        'status',
        'reason',
        'documents',
        'submitted_at',
        'completed_at',
    ];

    protected $casts = [
        'documents' => 'array',
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function verifications()
    {
        return $this->hasMany(Verification::class);
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isInProgress()
    {
        return $this->status === 'in_progress';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    public function getLibraryVerification()
    {
        return $this->verifications()->where('verification_type', 'library')->first();
    }

    public function getDormitoryVerification()
    {
        return $this->verifications()->where('verification_type', 'dormitory')->first();
    }

    public function getDepartmentVerification()
    {
        return $this->verifications()->where('verification_type', 'department')->first();
    }

    public function allVerificationsApproved()
    {
        $requiredVerifications = ['library', 'dormitory', 'department'];
        
        foreach ($requiredVerifications as $type) {
            $verification = $this->verifications()->where('verification_type', $type)->first();
            if (!$verification || $verification->status !== 'approved') {
                return false;
            }
        }
        
        return true;
    }
}
