<?php

use App\Http\Controllers\Api\v1\BookingController;
use App\Http\Controllers\Api\v1\ManagerController;
use App\Http\Controllers\Api\v1\TransactionController;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\PriceController;
use Illuminate\Support\Facades\Route;



Route::apiResource('/user', UserController::class)->except(['store', 'update', 'destroy']);
Route::apiResource('/manager', ManagerController::class)->except(['update', 'destroy']);
// Route::apiResource('/campsite/settings/picture', CampsitePictureController::class)->except(['store', 'destroy']);
Route::apiResource('/price', PriceController::class)->only(['index', 'show']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::apiResource('/booking', BookingController::class)->except(['bookingListAll', 'viewOnyCampsiteBooking', 'destroy']);
    Route::get('/booking-check', [BookingController::class, 'showSelfBooking']);
    Route::get('/xendit/{xendit_id}', [TransactionController::class, 'findXenditTransaction']);
    Route::apiResource('/transaction', TransactionController::class)->except(['transactionListAll', 'viewOnlyCampsiteTransaction', 'update', 'destroy']);
});

