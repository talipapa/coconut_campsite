<?php

use App\Http\Controllers\Api\v1\Mobile\BookingController;
use App\Http\Controllers\Api\v1\TokenBasedAuthController;
use App\Models\Manager;
use Illuminate\Support\Facades\Route;

// Authentication for mobile
Route::post('login', [TokenBasedAuthController::class, 'login']);
Route::middleware(['auth:sanctum'])->group(function (){
    Route::get('user', [TokenBasedAuthController::class, 'user']);   
    Route::post('logout', [TokenBasedAuthController::class, 'logout']);  
    // Booking controller for mobile
    Route::get('bookings/{page}', [BookingController::class, 'showList']);
    Route::get('wallet-summary', [BookingController::class, 'getSummaryWallet']);
    Route::get('booking/{booking}', [BookingController::class, 'getBookingSummary']);

    // If xendit
    Route::post('/refund/{booking}', [BookingController::class, 'refundBooking']);
    // If cash
    Route::post('/cancel/{booking}', [BookingController::class, 'cancelBooking']);

    Route::patch('/reschedule/{booking}', [BookingController::class, 'rescheduleBooking']);
});