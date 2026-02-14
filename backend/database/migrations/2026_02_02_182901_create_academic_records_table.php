<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('academic_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->string('student_id_number');
            $table->string('department');
            $table->string('program');
            $table->integer('year_of_study');
            $table->string('semester');
            $table->decimal('gpa', 3, 2)->nullable();
            $table->integer('total_credits')->default(0);
            $table->integer('completed_credits')->default(0);
            $table->enum('status', ['active', 'inactive', 'graduated', 'suspended'])->default('active');
            $table->boolean('graduation_eligible')->default(false);
            $table->decimal('outstanding_fees', 10, 2)->default(0);
            $table->enum('registration_status', ['registered', 'not_registered', 'pending'])->default('not_registered');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_records');
    }
};
