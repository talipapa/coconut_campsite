<?php

use App\Http\Controllers\Api\v1\Desktop\BookingController;
use App\Http\Controllers\Api\v1\Mobile\OwnerAccountController;
use App\Http\Controllers\Api\v1\Mobile\WalletController;
use App\Http\Controllers\Api\v1\TokenBasedAuthController;
use App\Models\Manager;
use Illuminate\Support\Facades\Route;

// Authentication for mobile
Route::post('login', [TokenBasedAuthController::class, 'loginManager']);
Route::middleware(['auth:sanctum'])->group(function (){
    Route::get('/confirmation/bookings', [BookingController::class, 'fetchScannedBooking']);
    Route::get('/bookings', [BookingController::class, 'fetchAllBooking']);
    Route::get('/bookings/verified', [BookingController::class, 'fetchSuccessfulBooking']);
    Route::get('/booking/{booking}', [BookingController::class, 'fetchSingleBooking']);
    

    Route::patch('/booking/action/{booking}', [BookingController::class, 'bookingAction']);

    Route::get('user', [TokenBasedAuthController::class, 'user']);   
    Route::post('logout', [TokenBasedAuthController::class, 'logout']);  
    Route::get('summary', [BookingController::class, 'dashboardSummary']);  
});