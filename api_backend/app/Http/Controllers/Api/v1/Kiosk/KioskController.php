<?php

namespace App\Http\Controllers\Api\v1\Kiosk;

use App\CustomVendors\ExpoPushNotification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Camper;
use App\Models\Qrcode;
use App\Models\Transaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class KioskController extends Controller
{
    
    public function scanQrCode(Request $request) {
        Log::info($request->all());
        $bannedStatus = ['CASH_CANCELLED', 'VOIDED', 'REFUNDED', 'FAILED', 'PENDING', 'REFUND_PENDING', 'CANCELLED'];
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


        return response()->json([
            'message' => 'QR code has been verified!',
        ]);
    }

    public function inputLogBook(Request $request, $qrCode){

        $qrCode = Qrcode::where('code', $qrCode)->first();
        $booking = Booking::find($qrCode->booking_id);

        $bannedStatus = ['CASH_CANCELLED', 'VOIDED', 'REFUNDED', 'FAILED', 'PENDING', 'REFUND_PENDING', 'CANCELLED'];
        $validated = $request->validate([
            'camper_names' => 'required'
        ]);
        if (!$booking) {
            return response()->json([
                'message' => 'QR code not found',
            ], 404);
        }

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

        // Find all campers with the same booking id and delete batch
        DB::beginTransaction();
        try {
            //code...
            Camper::where('booking_id', $booking->id)->delete();
            
            // Extract only the 'name' values
            $insertData = array_map(function($item) use ($booking) {
                return ['full_name' => $item, 'booking_id' => $booking->id, 'created_at'=>date('Y-m-d H:i:s'), 'updated_at'=> date('Y-m-d H:i:s')];
            }, $validated['camper_names']);
    
            Camper::insert($insertData);
            $booking->status = 'SCANNED';
            $booking->save(); 
            DB::commit();


            ExpoPushNotification::pushNotify(
                "{$booking->user->full_name} has scanned their QR code.", 
                "Please attend to them immediately.",
            );
            return response()->json(['message' => 'Data inserted successfully.']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'Something went wrong', 500]);
        }
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
