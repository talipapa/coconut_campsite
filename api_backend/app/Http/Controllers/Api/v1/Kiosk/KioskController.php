<?php

namespace App\Http\Controllers\Api\v1\Kiosk;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class KioskController extends Controller
{

    
    
    public function scanQrCode(Request $request)
    {
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
}
