<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Qrcode extends Model
{
    protected $fillable = [
        'booking_id',
        'code',
    ];


    public function booking()
    {
        return $this->hasOne(Booking::class);
    }
}
