<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title' => 'Introduction to Computer Science',
                'author' => 'John Smith',
                'isbn' => '978-0123456789',
                'category' => 'Computer Science',
                'status' => 'available'
            ],
            [
                'title' => 'Database Management Systems',
                'author' => 'Jane Doe',
                'isbn' => '978-0987654321',
                'category' => 'Computer Science',
                'status' => 'available'
            ],
            [
                'title' => 'Software Engineering Principles',
                'author' => 'Bob Johnson',
                'isbn' => '978-0456789123',
                'category' => 'Engineering',
                'status' => 'available'
            ],
            [
                'title' => 'Mathematics for Engineers',
                'author' => 'Alice Brown',
                'isbn' => '978-0789123456',
                'category' => 'Mathematics',
                'status' => 'available'
            ],
            [
                'title' => 'Physics Fundamentals',
                'author' => 'Charlie Wilson',
                'isbn' => '978-0321654987',
                'category' => 'Physics',
                'status' => 'available'
            ],
            [
                'title' => 'Chemistry Basics',
                'author' => 'Diana Davis',
                'isbn' => '978-0654987321',
                'category' => 'Chemistry',
                'status' => 'available'
            ],
            [
                'title' => 'Biology Concepts',
                'author' => 'Edward Miller',
                'isbn' => '978-0147258369',
                'category' => 'Biology',
                'status' => 'available'
            ],
            [
                'title' => 'History of Ethiopia',
                'author' => 'Fiona Taylor',
                'isbn' => '978-0258369147',
                'category' => 'History',
                'status' => 'available'
            ],
            [
                'title' => 'English Literature',
                'author' => 'George Anderson',
                'isbn' => '978-0369147258',
                'category' => 'Literature',
                'status' => 'available'
            ],
            [
                'title' => 'Business Management',
                'author' => 'Helen White',
                'isbn' => '978-0741852963',
                'category' => 'Business',
                'status' => 'available'
            ]
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}