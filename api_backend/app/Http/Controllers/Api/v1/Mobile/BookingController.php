<?php

namespace App\Http\Controllers\Api\v1\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\SuccessfulBookingResource;
use App\Models\Booking;
use Hamcrest\Type\IsNumeric;
use Illuminate\Http\Request;

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
        
        if (is_numeric($page) && $page > 0){
            $bookings = Booking::whereHas('transaction') 
            ->paginate($page);
        } else {
            $bookings = Booking::all()->filter(function($booking){
                return $booking->transaction !== null;
            });
    
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

        // Sum all price of transaction with 'SUCCEEDED' status
        $summaryData['wallet'] = Booking::where('status', 'SUCCEEDED')->get()->sum(function($booking){
            return $booking->transaction->price;
        });
        
        // Sum all count of transaction with 'SUCCEEDED' status
        $summaryData['successfullTotalBookingCount'] = Booking::where('status', 'SUCCEEDED')->get()->count();
        
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
}
