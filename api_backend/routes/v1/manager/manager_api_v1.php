<?php

use App\Http\Controllers\Api\v1\BookingController;
use App\Http\Controllers\Api\v1\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'manager'])->group(function () {
    Route::get('/campsite/transaction', [TransactionController::class, 'viewOnlyCampsiteTransaction']);
    Route::get('/campsite/booking', [BookingController::class, 'viewOnyCampsiteBooking']);
});