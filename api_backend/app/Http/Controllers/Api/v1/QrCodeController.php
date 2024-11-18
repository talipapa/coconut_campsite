<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\QrCodeResource;
use App\Models\Booking;
use App\Models\Qrcode;
use Illuminate\Http\Request;

class QrCodeController extends Controller
{
    public function viewBookingWithQr(Request $request, $qrsecretcode)
    {
        $blacklistedStatus = ['CANCELLED', 'REFUNDED', 'REFUND_PENDING', 'VOIDED', 'REFUNDED', 'VERIFIED', 'FAILED', 'SCANNED', 'PENDING'];
        $Qrcode = Qrcode::where('code', $qrsecretcode)->first();

        if (!$Qrcode) {
            return response()->json(['message' => 'Invalid code'], 404);
        }

        $booking = Booking::find($Qrcode->booking_id);

        if (in_array($booking->status, $blacklistedStatus)) {
            return response()->json(['message' => 'Invalid code'], 404);
        }
        if (!$booking) {
            return response()->json(['message' => 'Invalid code'], 404);
        }

        return response()->json(new QrCodeResource($Qrcode));


        
    }
}
