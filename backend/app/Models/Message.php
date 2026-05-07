<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'match_id',
        'sender_type',
        'sender_id',
        'body',
    ];

    public function matching()
    {
        return $this->belongsTo(Matching::class, 'match_id');
    }
}
