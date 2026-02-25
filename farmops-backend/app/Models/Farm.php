<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Crop;

class Farm extends Model
{
    protected $fillable = [
        'name',
        'location',
        'size',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function crop() {
        return $this->hasMany(Crop::class);
    }

    public function expense() {
        return $this->hasMany(Expense::class);
    }
}
