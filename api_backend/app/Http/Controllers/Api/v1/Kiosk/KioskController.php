<?php

namespace App\Http\Controllers\Api\v1\Kiosk;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Camper;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class KioskController extends Controller
{
    
    public function scanQrCode(Request $request) {
        Log::info($request->all());
        $bannedStatus = ['CASH_CANCELLED', 'VOIDED', 'REFUNDED', 'FAILED', 'PENDING'];
        $validated = $request->validate([
            'qr_code' => 'required|string'
        ]);
        $booking = Booking::find($validated['qr_code']);
        if (!$booking) {
            return response()->json([
                'message' => 'QR code not found',
            ], 404);
        }

        if (in_array($booking->status, $bannedStatus)) {
            return response()->json([
                'message' => 'QR code is not valid',
            ], 400);
        }
        if ($booking->status == 'SCANNED') {
            return response()->json([
                'message' => 'QR code already scanned',
            ], 400);
        }

        if ($booking->status == 'VERIFIED') {
            return response()->json([
                'message' => 'QR code already scanned',
            ], 400);
        }

        $booking->status = 'SCANNED';
        $booking->save(); 

        return response()->json([
            'message' => 'QR code scanned successfully',
        ]);
    }

    public function inputLogBook(Request $request, Booking $booking){
        $validated = $request->validate([
            'camper_names' => 'required'
        ]);
        if (!$booking) {
            return response()->json([
                'message' => 'QR code not found',
            ], 404);
        }

        // Extract only the 'name' values
        $insertData = array_map(function($item) use ($booking) {
            return ['full_name' => $item, 'booking_id' => $booking->id];
        }, $validated['camper_names']);

        Camper::insert($insertData);

        return response()->json(['message' => 'Data inserted successfully.']);
    }

    public function fetchBooking(Request $request, Booking $booking){
        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }


        return response()->json([
            'booking' => $booking,
        ]);
    }

}
