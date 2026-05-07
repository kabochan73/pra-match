<?php

// マッチングテーブル：求職者と求人のマッチング状態を管理する（pending→matched→interview など）

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->enum('status', [
                'pending',
                'expired',
                'matched',
                'casual_interview',
                'rejected',
                'interview',
            ])->default('pending');
            $table->timestamps();

            $table->unique(['user_id', 'job_posting_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
