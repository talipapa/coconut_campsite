<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    use HasFactory, HasUlids;

    
    protected $fillable = [
        'user_id',
        'full_name',
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
        'cabin_id',
        'note',
        'status',
        'payment_type'
    ];

    protected $appends = ['full_name', 'payment_type', 'total_campers', 'transaction_status', 'cabin_name', 'cabin_price', 'cabin_image'];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getCabinImageAttribute()
    {
        return $this->cabin_id ? $this->cabin->getFirstMediaUrl('cabin_images'): null;
    }

    public function getPaymentTypeAttribute()
    {
        return $this->transaction ? $this->transaction->payment_type : null;
    }

    public function getTotalCampersAttribute()
    {
        return $this->adultCount + $this->childCount;
    }

    public function getTransactionStatusAttribute()
    {
        return $this->transaction ? $this->transaction->status : null;
    }

    public function getCabinNameAttribute()
    {
        return $this->cabin_id ? $this->cabin->name : null;
    }

    public function getCabinPriceAttribute()
    {
        return $this->cabin_id ? $this->cabin->price : null;
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transaction(){
        return $this->hasOne(Transaction::class);
    }

    public function campers(): HasMany
    {
        return $this->hasMany(Camper::class);
    }

    public function cabin()
    {
        return $this->belongsTo(Cabin::class);
    }

    public function qrcode()
    {
        return $this->belongsTo(Qrcode::class);
    }

    
}
