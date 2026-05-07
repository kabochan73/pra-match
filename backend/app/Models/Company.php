<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Company extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'industry',
        'prefecture',
        'description',
    ];

    protected $hidden = [
        'password',
    ];

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }
}
