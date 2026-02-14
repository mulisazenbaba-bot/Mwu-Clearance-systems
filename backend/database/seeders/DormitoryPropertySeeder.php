<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DormitoryProperty;

class DormitoryPropertySeeder extends Seeder
{
    public function run(): void
    {
        $properties = [
            // Room A101 properties
            [
                'property_name' => 'Single Bed',
                'property_code' => 'BED-A101-01',
                'category' => 'bed',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A101'
            ],
            [
                'property_name' => 'Study Table',
                'property_code' => 'TBL-A101-01',
                'category' => 'table',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A101'
            ],
            [
                'property_name' => 'Chair',
                'property_code' => 'CHR-A101-01',
                'category' => 'chair',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A101'
            ],
            [
                'property_name' => 'Mattress',
                'property_code' => 'MAT-A101-01',
                'category' => 'mattress',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A101'
            ],
            [
                'property_name' => 'Wardrobe',
                'property_code' => 'WRD-A101-01',
                'category' => 'wardrobe',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A101'
            ],
            
            // Room A102 properties
            [
                'property_name' => 'Single Bed',
                'property_code' => 'BED-A102-01',
                'category' => 'bed',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A102'
            ],
            [
                'property_name' => 'Study Table',
                'property_code' => 'TBL-A102-01',
                'category' => 'table',
                'condition' => 'fair',
                'status' => 'available',
                'room_number' => 'A102'
            ],
            [
                'property_name' => 'Chair',
                'property_code' => 'CHR-A102-01',
                'category' => 'chair',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A102'
            ],
            [
                'property_name' => 'Mattress',
                'property_code' => 'MAT-A102-01',
                'category' => 'mattress',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A102'
            ],
            [
                'property_name' => 'Wardrobe',
                'property_code' => 'WRD-A102-01',
                'category' => 'wardrobe',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'A102'
            ],
            
            // Room B201 properties
            [
                'property_name' => 'Single Bed',
                'property_code' => 'BED-B201-01',
                'category' => 'bed',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'B201'
            ],
            [
                'property_name' => 'Study Table',
                'property_code' => 'TBL-B201-01',
                'category' => 'table',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'B201'
            ],
            [
                'property_name' => 'Chair',
                'property_code' => 'CHR-B201-01',
                'category' => 'chair',
                'condition' => 'damaged',
                'status' => 'maintenance',
                'damage_notes' => 'Broken leg needs repair'
            ],
            [
                'property_name' => 'Mattress',
                'property_code' => 'MAT-B201-01',
                'category' => 'mattress',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'B201'
            ],
            [
                'property_name' => 'Wardrobe',
                'property_code' => 'WRD-B201-01',
                'category' => 'wardrobe',
                'condition' => 'good',
                'status' => 'available',
                'room_number' => 'B201'
            ]
        ];

        foreach ($properties as $property) {
            DormitoryProperty::create($property);
        }
    }
}