<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        \App\Models\User::create([
            'name' => 'Mulisa Zenbaba',
            'email' => 'mulisazenbaba@gmail.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'department' => 'IT Department',
            'phone' => '0954382579',
        ]);

        // Create Library Officer
        \App\Models\User::create([
            'name' => 'Library Officer',
            'email' => 'library@mwu.edu.et',
            'password' => bcrypt('password123'),
            'role' => 'library_officer',
            'department' => 'Library',
            'phone' => '+251911234568',
        ]);

        // Create Dormitory Officer
        \App\Models\User::create([
            'name' => 'Dormitory Officer',
            'email' => 'dormitory@mwu.edu.et',
            'password' => bcrypt('password123'),
            'role' => 'dormitory_officer',
            'department' => 'Student Affairs',
            'phone' => '+251911234569',
        ]);

        // Create Department Officer
        \App\Models\User::create([
            'name' => 'Department Officer',
            'email' => 'department@mwu.edu.et',
            'password' => bcrypt('password123'),
            'role' => 'department_officer',
            'department' => 'Computer Science',
            'phone' => '+251911234570',
        ]);

        // Create Test Student
        \App\Models\User::create([
            'name' => 'Mulisa Zenbaba Megersa',
            'email' => 'mulisa@student.mwu.edu.et',
            'password' => bcrypt('password123'),
            'role' => 'student',
            'student_id' => 'MWU/CS/2024/001',
            'department' => 'Computer Science',
            'phone' => '+251911234571',
        ]);

        // Create Additional Test Students
        \App\Models\User::create([
            'name' => 'Test Student 2',
            'email' => 'student2@student.mwu.edu.et',
            'password' => bcrypt('password123'),
            'role' => 'student',
            'student_id' => 'MWU/CS/2024/002',
            'department' => 'Computer Science',
            'phone' => '+251911234572',
        ]);
    }
}
