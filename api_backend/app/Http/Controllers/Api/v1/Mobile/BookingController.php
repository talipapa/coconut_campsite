<?php

namespace App\Http\Controllers\Api\v1\Mobile;

use App\CustomVendors\Xendivel as CustomVendorsXendivel;
use App\Http\Controllers\Controller;
use App\Http\Resources\v1\SuccessfulBookingResource;
use App\Models\Booking;
use App\Models\Transaction;
use Carbon\Carbon;
use GlennRaya\Xendivel\Xendivel;
use Hamcrest\Type\IsNumeric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Monolog\Handler\ErrorLogHandler;

class BookingController extends Controller
{
    //
    function showList(Request $request, $page){
        // Identify if account is owner
        if (!$request->user()->owner){
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        // Get all bookings
        $bookings = [];
        
        // Check if $page is number
        

        if (is_numeric($page) && $page > 0) {
            $bookings = Booking::whereHas('transaction', function ($query) {
                $query->whereIn('status', ['CASH_PENDING', 'SUCCEEDED']);
            })->orderBy('check_in', 'asc')->paginate($page);
        } else {
            $bookings = Booking::all()->filter(function ($booking) {
                return $booking->transaction !== null && in_array($booking->transaction->status, ['CASH_PENDING', 'SUCCEEDED']);
            })->sortByAsc('check_in');
        }

        // Return all bookings with successful bookingresource
        return response()->json([
            'bookings' => SuccessfulBookingResource::collection($bookings)
        ], 200);
    }

    function getSummaryWallet(Request $request){
        $summaryData = [
            'wallet' => 0,
            'successfullTotalBookingCount' => 0,
            'pendingCash' => 0,
            'pendingTotalBookingCount' => 0,
        ];
        
        // Identify if account is owner
        if (!$request->user()->owner){
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        // Sum all price of transaction with 'VERIFIED' status
        $response = CustomVendorsXendivel::getBalance()->getResponse();
        $summaryData['wallet'] = json_decode(json_encode($response), true)['balance'];

        
        // Sum all count of transaction with 'SUCCEEDED' status
        $summaryData['successfullTotalBookingCount'] = Booking::where('status', 'PAID')->get()->count();
        
        // Sum all price of transaction with 'CASH_PENDING & PENDING' status using where
        $summaryData['pendingCash'] = Booking::whereIn('status', ['CASH_PENDING', 'PENDING'])->get()->sum(function($booking) {
            if ($booking->transaction === null){
                return 0;
            }
            return $booking->transaction->price;
        });
        

        // Sum all count of transaction with 'CASH_PENDING & PENDING' status
        $summaryData['pendingTotalBookingCount'] = Booking::whereIn('status', ['CASH_PENDING', 'PENDING'])->whereHas('transaction')->count();

        return response()->json([
            'summary' => $summaryData
        ], 200);
    }

    function getBookingSummary(Request $request, Booking $booking){
        // IF booking doesnt exist throw 404 response
        if (!$booking) return response()->json(['message' => 'Booking not found'], 404);
    
        switch ($booking->transaction->payment_type) {
            case 'CASH':
                $details = [
                    "booking_detail" => $booking,
                ];

                $createdAt = Carbon::parse($booking->updated_at)->timezone('Asia/Manila');
                $now = Carbon::now()->timezone('Asia/Manila');
                $cutOffTime = $createdAt->copy()->setTime(23, 50, 0);
                
                if ($createdAt->isSameDay($now) && $createdAt->lte($cutOffTime)) {
                    $details['isVoidEligible'] = true;
                } else{
                    $details['isVoidEligible'] = false;
                }
                
                return response()->json($details, 200);
                break;

            case 'XENDIT':
                $details = [
                    "booking_detail" => $booking,
                    "xendit_details" => [],
                    "isVoidEligible" => null,
                ];

                try {
                    $xenditId = 'ewc_'.$booking->transaction->xendit_product_id;
                    
                    $response = Xendivel::getPayment($xenditId, 'ewallet')
                    ->getResponse();
                    $details['xendit_details'] = $response;

                    $createdAt = Carbon::parse($response->created)->timezone('Asia/Manila');
                    $now = Carbon::now()->timezone('Asia/Manila');
                    $cutOffTime = $createdAt->copy()->setTime(23, 50, 0);
                    
                    if ($createdAt->isSameDay($now) && $createdAt->lte($cutOffTime)) {
                        $details['isVoidEligible'] = true;
                    } else{
                        $details['isVoidEligible'] = false;
                    }
                } catch (\Throwable $th) {
                    Log::error("Unexpected error happened in Mobile/BookingController", [
                        "Error" => $th
                    ]);
                    return response()->json(['message' => "Something went wrong, check backend log"], 500);
                }
                return response()->json($details, 200);
                break;
            
            default:
                # code...
                Log::error("Invalid booking type. Expects CASH, XENDIT string", [
                    "Booking ID" => $booking->id,
                    "Booking type in question" => $booking->transaction->payment_type,
                ]);
                return response()->json(['message' => "Something went wrong"], 500);
                break;
        }

    


    }

    public function refundBooking(Request $request, Booking $booking){
        // Verify if user has a booking
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }
        
        // Check if the user in request owns the booking or is an owner/manager
        // if ($booking->user_id != $request->user()->id){
        //     return response()->json(['message' => "Unauthorized access"], 401);
        // }

        

        $transaction = $booking->transaction;
        // Check if the status of the transaction is SUCCEEDED
        try {
            if ($transaction->status !== 'SUCCEEDED') {
                return response()->json(['message' => 'Transaction is not successful'], 400);
            }
    
            // Fetch the xendit id and append "ewc_" to it
            $xenditId = 'ewc_'.$booking->transaction->xendit_product_id;

            // Call the Xendit API to get the charge info
            // Prepare data conditions
            $response = Xendivel::getPayment($xenditId, 'ewallet')->getResponse();
    
            $createdAt = Carbon::parse($response->created)->timezone('Asia/Manila');
            $now = Carbon::now()->timezone('Asia/Manila');
            // Xendit cutoff time for voiding charge
            $cutOffTime = $createdAt->copy()->setTime(23, 50, 0); 
            
            // Log::info('Date info', ['Xendit created_at' => $createdAt, 'now' => $now]);
            // Log::info('Xendit response:', [$response]);
    
    
            // Void the charge, Check if the created_at is currently in the same day and is before 23:50:00.
            if ($createdAt->isSameDay($now) && $createdAt->lte($cutOffTime)) {
                $response = Xendivel::void($xenditId)->getResponse();
                Log::info('Void response:', [$response]);
            } else{
                $response = Xendivel::getPayment($request->charge_id, 'ewallet')
                    ->refund($transaction->price)
                    ->getResponse();
                Log::info('Refund response:', [$response]);
            }

            $transaction->status = "REFUND_PENDING";
            $transaction->save();

            return response()->json($booking, 201);
        } catch (\Throwable $th) {
            //throw $th;
            Log::info($th);
            return response()->json(['message' => 'Something went wrong'], 400);
        }


    }

    public function cancelBooking(Request $request, Booking $booking){
        $transaction = $booking->transaction;

        // Verify if user has a booking
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // Check if the status of the booking is CANCELLED
        if ($booking->status === 'CANCELLED') {
            return response()->json(['message' => 'Booking is already cancelled'], 400);
        }

        // Update the status of the booking to CANCELLED
        $booking->update([
            'status' => 'CANCELLED',
        ]);
        
        // Update the status of the booking to CASH_CANCELLED
        $transaction->update([
            'status' => 'CASH_CANCELLED',
        ]);

        $booking->save();
        $transaction->save();
        

        return response()->json($booking, 200);
    }

    public function rescheduleBooking(Request $request, Booking $booking){
        // Verify if the booking exists

        $validated = $request->validate([
            'booking_type' => 'required',
            'check_in' => 'required',
        ]);

        $booking->update([
            'booking_type' => $validated['booking_type'],
            'check_in' => Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d'),
            'check_out' => Carbon::parse($validated['check_in'])->addDay(1)->timezone('Asia/Manila')->format('Y-m-d'),
        ]);

        $booking->save();

        return response()->json($booking, 200);
    }


}
