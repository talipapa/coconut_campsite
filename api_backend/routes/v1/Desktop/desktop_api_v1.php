<?php

use App\Http\Controllers\Api\v1\Desktop\BookingController;
use App\Http\Controllers\Api\v1\TokenBasedAuthController;
use Illuminate\Support\Facades\Route;

// Authentication for mobile
Route::post('login', [TokenBasedAuthController::class, 'loginManager']);
Route::middleware(['auth:sanctum', 'manager'])->group(function (){
    Route::get('/scanned/bookings', [BookingController::class, 'fetchScannedBooking']);
    Route::get('/upcoming/bookings', [BookingController::class, 'fetchUpcomingBooking']);
    Route::get('/nowshow/bookings', [BookingController::class, 'fetchNoShowBooking']);

    Route::patch('/booking/reschedule/{booking}', [BookingController::class, 'rescheduleBooking']);
    Route::patch('/booking/refund/{booking}', [BookingController::class, 'refundBooking']);

    Route::get('/bookings', [BookingController::class, 'fetchAllBooking']);
    Route::get('/bookings/verified', [BookingController::class, 'fetchSuccessfulBooking']);
    Route::get('/booking/{booking}', [BookingController::class, 'fetchSingleBooking']);
    Route::patch('/booking/cancel/{booking}', [BookingController::class, 'cancelBooking']);
    Route::patch('/booking/confirm/{booking}', [BookingController::class, 'bookingAction']);
    Route::get('user', [TokenBasedAuthController::class, 'user']);   
    Route::post('logout', [TokenBasedAuthController::class, 'logout']);  
    Route::get('summary', [BookingController::class, 'dashboardSummary']);  
    Route::post('/walkin', [BookingController::class, 'submitWalkIn']);

});