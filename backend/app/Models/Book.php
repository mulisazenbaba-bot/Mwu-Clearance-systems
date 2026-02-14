<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'category',
        'status',
        'borrowed_by',
        'borrowed_at',
        'due_date',
        'returned_at',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'due_date' => 'datetime',
        'returned_at' => 'datetime',
    ];

    // Relationships
    public function borrower()
    {
        return $this->belongsTo(User::class, 'borrowed_by');
    }

    // Helper methods
    public function isAvailable()
    {
        return $this->status === 'available';
    }

    public function isBorrowed()
    {
        return $this->status === 'borrowed';
    }

    public function isOverdue()
    {
        return $this->isBorrowed() && $this->due_date && $this->due_date->isPast();
    }

    public function borrowedByStudent($studentId)
    {
        return $this->borrowed_by == $studentId;
    }
}