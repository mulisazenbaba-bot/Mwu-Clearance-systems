<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'clearance_request_id',
        'officer_id',
        'verification_type',
        'status',
        'comments',
        'verification_data',
        'verified_at',
    ];

    protected $casts = [
        'verification_data' => 'array',
        'verified_at' => 'datetime',
    ];

    // Relationships
    public function clearanceRequest()
    {
        return $this->belongsTo(ClearanceRequest::class);
    }

    public function officer()
    {
        return $this->belongsTo(User::class, 'officer_id');
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    public function isLibraryVerification()
    {
        return $this->verification_type === 'library';
    }

    public function isDormitoryVerification()
    {
        return $this->verification_type === 'dormitory';
    }

    public function isDepartmentVerification()
    {
        return $this->verification_type === 'department';
    }
}
