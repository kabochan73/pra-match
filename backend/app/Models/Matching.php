<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matching extends Model
{
    // matchesテーブルを使用（matchはPHP予約語のためモデル名をMatchingにしている）
    protected $table = 'matches';

    protected $fillable = [
        'user_id',
        'job_posting_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'match_id');
    }
}
