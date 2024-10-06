<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\BookingResource;
use App\Http\Resources\v1\SuccessfulBookingResource;
use App\Http\Resources\v1\TransactionResource;
use App\Models\Booking;
use App\Models\Refund;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use GlennRaya\Xendivel\Xendivel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    // Admin should be able to view all transactions
    //
    public function bookingListAll()
    {
        Gate::authorize('viewAnyAdmin', Booking::class);
        return BookingResource::collection(Booking::all());
    }

    // Campsite managers should only be able to view transactions related to their campsite
    //
    public function viewOnyCampsiteBooking(){
        Gate::authorize('viewAnyCampsiteTransaction', Booking::class);
        $bookings = Booking::all();
        return BookingResource::collection($bookings);
    }

    public function showSelfBooking(Request $request){
        // Check if user has existing booking
        $booking = Booking::where('user_id', $request->user()->id)
        ->whereNotIn('status', ['PENDING', 'VOIDED', 'REFUNDED'])
        ->first();

        Log::info($booking);
        
        if (!$booking) {
            return response()->json(['message' => "Booking not found"], 404);
        }
   

        return response()->json(new BookingResource($booking), 201);
    
    }


    // Refund booking
    public function refundBooking(Request $request, Booking $booking){
        // Verify if user has a booking
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        

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
                Log::info('Refund not possible');
            }
            // If not,
            
    
    
            // Update the booking status to REFUNDED
            
            // Create a new refund record to refund_table and store the refund status
        } catch (\Throwable $th) {
            //throw $th;
            Log::info($th);
        }


        return response()->json(['message' => 'Refund request sent'], 201);
    }



    //TODO LIST: 1


    // Check refund status if the refund is successfully processed or still processsing
    public function checkRefundStatus(Request $request, Booking $booking){
        // Verify if user has a booking
        $refund = Refund::where('booking_id', $booking->id)->first();

        // Check if the status of the transaction is REFUNDED


        // Fetch the xendit id and append "ewc_" to it

        // Call the Xendit API to check the refund status


        // Fetch the Xendit response and return it to frontend

    }

    // TODO LIST: 2
    // Reschedule booking & change booking type
    public function rescheduleBooking(Request $request, Booking $booking){
        // Verify if the booking exists


        // Change value of date & booking type

        // Create a new refund record to refund_table and store the refund status


        // Save the changes
        

        return response()->json(['message' => 'Reschedule request sent'], 201);
    }



    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)->first();
        // Log::info($bookings);

        if ($bookings === null) {
        return response()->json(['message' => 'No bookings found'], 404);
        }

        if ($bookings->transaction && $bookings->transaction->status === 'VOIDED'){
            return response()->json(['message' => false], 201);
        }

        return new SuccessfulBookingResource($bookings);   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required',
            'telNumber' => 'required',
            'adultCount' => 'required',
            'childCount' => 'required',
            'checkInDate' => 'required',
            'bookingType' => 'required',
            'tentPitchingCount' => 'required',
            'bonfireKitCount' => 'required',
            'isCabin' => 'required',
            'price' => 'required',
        ]);

        $authenticatedUser = User::find($request->user()->id);
        $booking = null;
        $bookingJson = null;
        $transaction = null;
        $transactionId = null;
        
        try {
            $booking = Booking::create([
                'user_id' => $authenticatedUser->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'tel_number' => $validated['telNumber'],
                'adultCount' => $validated['adultCount'],
                'childCount' => $validated['childCount'],
                'check_in' => Carbon::parse($validated['checkInDate'])->timezone('Asia/Manila')->format('Y-m-d'),
                'check_out' => Carbon::parse($validated['checkInDate'])->addDay(1)->timezone('Asia/Manila')->format('Y-m-d'),
                'booking_type' => $validated['bookingType'],
                'tent_pitching_count' => $validated['tentPitchingCount'],
                'bonfire_kit_count' => $validated['bonfireKitCount'],
                'is_cabin' => $validated['isCabin'],
                'note' => $request->note,
                'status' => 'PENDING',
            ]);

            $transaction = Transaction::create([
                'user_id' => $request->user()->id,
                'booking_id' => $booking->id,
                'price' => $validated['price'],
            ]);  

            $transactionId = $transaction->id;
            $bookingJson = new BookingResource($booking);
        } catch (\Throwable $th) {
            $transaction->delete();
            Log::info("Error", [$th]);
            throw $th;
        }

        
        
        // Log::info($booking);
        return [
            "Status" => "Booking Success",
            "booking" => $bookingJson,
            "transaction_id" => $transactionId
        ];
    }

    /**
     * Display the specified resource.
     * Only use for booking and checkout page
     */
    public function show(Booking $booking)
    {
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        

        return new BookingResource($booking);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        // Validate
        $validated = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required',
            'telNumber' => 'required',
            'adultCount' => 'required',
            'childCount' => 'required',
            'checkInDate' => 'required',
            'bookingType' => 'required',
            'tentPitchingCount' => 'required',
            'bonfireKitCount' => 'required',
            'isCabin' => 'required',
        ]);

        $userOwner = User::find($booking->user_id);
        
        if ($userOwner->id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // Find data
        $booking = Booking::find($booking->id);
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        $oldData = $booking;

        // Update data
        $booking->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'tel_number' => $validated['telNumber'],
            'adultCount' => $validated['adultCount'],
            'childCount' => $validated['childCount'],
            'check_in' => Carbon::parse($validated['checkInDate'])->timezone('Asia/Manila')->format('Y-m-d'),
            'booking_type' => $validated['bookingType'],
            'tent_pitching_count' => $validated['tentPitchingCount'],
            'bonfire_kit_count' => $validated['bonfireKitCount'],
            'is_cabin' => $validated['isCabin'],
            'note' => $request->note,
        ]);

        // Return response
        $bookingDataJson = new BookingResource($booking);
        
        return response()->json([
            'message' => 'Booking updated successfully', 
            'old_data' => $oldData,
            'new_data' => $bookingDataJson,
            'transaction_id' => $booking->transaction->id
        ], 200);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();
        return response()->json(['message' => 'Booking deleted successfully'], 200);
    }
}
