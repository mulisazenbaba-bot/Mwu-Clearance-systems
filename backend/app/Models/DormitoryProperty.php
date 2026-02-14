<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DormitoryProperty extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_name',
        'property_code',
        'category',
        'condition',
        'status',
        'assigned_to',
        'room_number',
        'assigned_at',
        'returned_at',
        'damage_notes',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    // Relationships
    public function assignedStudent()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Helper methods
    public function isAvailable()
    {
        return $this->status === 'available';
    }

    public function isAssigned()
    {
        return $this->status === 'assigned';
    }

    public function isDamaged()
    {
        return $this->condition === 'damaged';
    }

    public function assignedToStudent($studentId)
    {
        return $this->assigned_to == $studentId;
    }
}