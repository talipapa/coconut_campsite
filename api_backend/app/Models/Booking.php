<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUlids;
    
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'tel_number',
        'adultCount',
        'childCount',
        'check_in',
        'check_out',
        'booking_type',
        'tent_pitching_count',
        'bonfire_kit_count',
        'is_cabin',
        'note',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transaction(){
        return $this->hasOne(Transaction::class);
    }
}
