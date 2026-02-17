<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $table = 'listing';

    protected $fillable = [
        'title',
        'description',
        'image',
        'category_id',
        'user_id'
    ];
}
