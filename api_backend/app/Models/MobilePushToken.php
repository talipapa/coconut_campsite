<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MobilePushToken extends Model
{
    protected $fillable = ['user_id', 'token', 'device_name'];

    
}
