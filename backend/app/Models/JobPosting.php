<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'salary',
        'employment_type',
        'prefecture',
        'is_active',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function matches()
    {
        return $this->hasMany(Matching::class);
    }
}
