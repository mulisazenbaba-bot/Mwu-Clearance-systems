<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicRecord;
use App\Models\User;

class AcademicRecordSeeder extends Seeder
{
    public function run(): void
    {
        // Get all students
        $students = User::where('role', 'student')->get();

        foreach ($students as $student) {
            AcademicRecord::create([
                'student_id' => $student->id,
                'student_id_number' => $student->student_id ?? 'MWU' . str_pad($student->id, 4, '0', STR_PAD_LEFT),
                'department' => $student->department ?? 'Computer Science',
                'program' => 'Bachelor of Science',
                'year_of_study' => rand(1, 4),
                'semester' => 'Semester ' . rand(1, 2),
                'gpa' => round(rand(250, 400) / 100, 2), // GPA between 2.50 and 4.00
                'total_credits' => rand(120, 160),
                'completed_credits' => rand(80, 140),
                'status' => 'active',
                'graduation_eligible' => rand(0, 1) == 1,
                'outstanding_fees' => rand(0, 1) == 1 ? rand(0, 5000) : 0,
                'registration_status' => ['registered', 'not_registered', 'pending'][rand(0, 2)]
            ]);
        }
    }
}