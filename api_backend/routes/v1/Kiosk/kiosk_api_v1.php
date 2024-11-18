<?php

use App\Http\Controllers\Api\v1\Kiosk\KioskController;
use App\Http\Controllers\Api\v1\TokenBasedAuthController;
use Illuminate\Support\Facades\Route;

// Scan QR code route
Route::post('/login', [TokenBasedAuthController::class, 'loginKiosk']);
Route::middleware(['auth:sanctum', 'manager'])->group(function (){
    // Route::post('/scan', [KioskController::class, 'scanQrCode']);
    // Route::get('/logbook/{booking}', [KioskController::class, 'fetchBooking']);
    Route::post('/logbook/{qrCode}', [KioskController::class, 'inputLogBook']);
});