<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Cabin extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\CabinFactory> */
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'name',
        'description',
        'price',
        'capacity',
    ];

    protected $appends = ['image'];

    protected $hidden = ['media'];
    
    public function getImageAttribute()
    {
        return $this->getFirstMediaUrl('cabin_images');
    }

}

