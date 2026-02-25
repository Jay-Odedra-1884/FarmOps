<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Farm;

class Crop extends Model
{
    protected $fillable = [
        'name',
        'farm_id'
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function expense() {
        return $this->hasMany(Expense::class);
    }
}
