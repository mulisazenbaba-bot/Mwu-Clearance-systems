<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AcademicRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'student_id_number',
        'department',
        'program',
        'year_of_study',
        'semester',
        'gpa',
        'total_credits',
        'completed_credits',
        'status',
        'graduation_eligible',
        'outstanding_fees',
        'registration_status',
    ];

    protected $casts = [
        'gpa' => 'decimal:2',
        'outstanding_fees' => 'decimal:2',
        'graduation_eligible' => 'boolean',
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Helper methods
    public function isRegistered()
    {
        return $this->registration_status === 'registered';
    }

    public function hasOutstandingFees()
    {
        return $this->outstanding_fees > 0;
    }

    public function isGraduationEligible()
    {
        return $this->graduation_eligible;
    }

    public function isActive()
    {
        return $this->status === 'active';
    }
}