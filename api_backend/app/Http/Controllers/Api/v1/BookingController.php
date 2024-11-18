<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\BookingResource;
use App\Http\Resources\v1\SuccessfulBookingResource;
use App\Http\Resources\v1\TransactionResource;
use App\Models\Booking;
use App\Models\Camper;
use App\Models\Qrcode;
use App\Models\Refund;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use GlennRaya\Xendivel\Xendivel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        ->whereNotIn('status', ['PENDING', 'CANCELLED', 'VOIDED', 'REFUNDED', 'VERIFIED', 'FAILED'])
        ->first();
    

        if (!$booking) {
            return response()->json(['message' => "Booking not found"], 404);
        }

        return response()->json(new SuccessfulBookingResource($booking), 201);
    
    }

    // Cancel booking for cash payment
    public function cancelBooking(Request $request, Booking $booking){
        $transaction = $booking->transaction;

        // Verify if user has a booking
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // Check if the status of the booking is PENDING
        if ($booking->status === 'PENDING') {
            return response()->json(['message' => 'Booking is still pending'], 400);
        }

        // Check if the status of the booking is CANCELLED
        if ($booking->status === 'CANCELLED') {
            return response()->json(['message' => 'Booking is already cancelled'], 400);
        }

        if ($booking->status === 'SCANNED') {
            return response()->json(['message' => 'You are not allowed to cancel at this point'], 400);
        }

        if ($booking->status === 'VERIFIED') {
            return response()->json(['message' => 'You are not allowed to cancel at this point'], 400);
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
        

        return response()->json(['message' => 'Booking cancelled successfully'], 200);
    }


    // Refund booking
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
        if ($transaction->status === "REFUND_PENDING"){
            return response()->json(['message' => "Transaction currently has pending refund"], 422);
        }

        if ($booking->status === "CANCELLED"){
            return response()->json(['message' => "Booking has already been cancelled"], 422);
        }

        if ($booking->status === "SCANNED"){
            return response()->json(['message' => "You are not allowed to cancel at this point"], 422);
        }

        if ($booking->status === "VOIDED"){
            return response()->json(['message' => "Booking has already been voided"], 422);
        }

        if ($booking->status === "VERIFIED"){
            return response()->json(['message' => "You are not allowed to cancel at this point"], 422);
        }



        // Check if the status of the transaction is SUCCEEDED
        try {
            if ($transaction->status !== 'SUCCEEDED') {
                return response()->json(['message' => 'Transaction is not successful'], 400);
            }

            $transaction->status = "REFUND_PENDING";
            $transaction->save();
    
            // Fetch the xendit id and append "ewc_" to it
            $xenditId = 'ewc_'.$booking->transaction->xendit_product_id;

            // Call the Xendit API to get the charge info
            // Prepare data conditions
            $response = Xendivel::getPayment($xenditId, 'ewallet')->getResponse();
    
            $createdAt = Carbon::parse($response->created)->timezone('Asia/Manila');
            $now = Carbon::now()->timezone('Asia/Manila');
            // Xendit cutoff time for voiding charge
            $cutOffTime = $createdAt->copy()->setTime(23, 40, 0); 
            
            // Log::info('Date info', ['Xendit created_at' => $createdAt, 'now' => $now]);
            // Log::info('Xendit response:', [$response]);
    
    
            // Void the charge, Check if the created_at is currently in the same day and is before 23:50:00.
            if ($createdAt->isSameDay($now) && $createdAt->lte($cutOffTime)) {
                $response = Xendivel::void($xenditId)->getResponse();
                Log::info('Void response:', [$response]);
            } else{
                $response = Xendivel::getPayment($xenditId, 'ewallet')
                    ->refund((int) $transaction->price * 0.9)
                    ->getResponse();
                Log::info(`Refund response:` . $transaction->price, [$response]);
            }
            $booking->status = "PENDING";
            $transaction->status = "REFUND_PENDING";
            $transaction->save();
            $booking->save();

            return response()->json(['message' => 'Refund request sent'], 201);
        } catch (\Throwable $th) {
            //throw $th;
            Log::info($th);
            return response()->json(['message' => 'Something went wrong'], 400);
        }


    }

    // Check refund status if the refund is successfully processed or still processsing
    public function checkRefundStatus(Request $request, Booking $booking){
        // Verify if user has a booking
        $refund = Refund::where('booking_id', $booking->id)->first();

        // Check if the status of the transaction is REFUNDED


        // Fetch the xendit id and append "ewc_" to it

        // Call the Xendit API to check the refund status


        // Fetch the Xendit response and return it to frontend

    }

    public function rescheduleBooking(Request $request, Booking $booking){

        $validated = $request->validate([
            'booking_type' => 'required',
            'check_in' => 'required',
        ]);

        if ($booking->transaction->status === "REFUND_PENDING"){
            return response()->json(['message' => "You are not allowed to reschedule at this point"], 422);
        }

        if ($booking->status === "CANCELLED"){
            return response()->json(['message' => "You are not allowed to reschedule at this point"], 422);
        }

        if ($booking->status === "SCANNED"){
            return response()->json(['message' => "You are not allowed to reschedule at this point"], 422);
        }

        if ($booking->status === "VOIDED"){
            return response()->json(['message' => "You are not allowed to reschedule at this point"], 422);
        }

        if ($booking->status === "VERIFIED"){
            return response()->json(['message' => "You are not allowed to reschedule at this point"], 422);
        }

        switch ($validated['booking_type']) {
            case 'daytour':
                $booking->update([
                    'booking_type' => $validated['booking_type'],
                    'check_in' => Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d'),
                    'check_out' => Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d'),
                ]);
                $booking->save();
                return response()->json(['message' => 'Reschedule request sent'], 200);
            break;
            case 'overnight':
                $booking->update([
                    'booking_type' => $validated['booking_type'],
                    'check_in' => Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d'),
                    'check_out' => Carbon::parse($validated['check_in'])->addDay(1)->timezone('Asia/Manila')->format('Y-m-d'),
                ]);
                $booking->save();
                return response()->json(['message' => 'Reschedule request sent'], 200);
                # code...
            break;
            
            default:
                # code...
                return response()->json(['message' => 'Invalid booking type'], 400);
            break;
        }
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $booking = Booking::where('user_id', $request->user()->id)
        ->whereNotIn('status', ['PENDING', 'CANCELLED', 'VOIDED', 'REFUNDED', 'VERIFIED'])
        ->first();

        // Log::info($bookings);

        if ($booking === null) {
        return response()->json(['message' => 'No bookings found'], 404);
        }

        return new SuccessfulBookingResource($booking);   
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
            'telNumber' => 'required|regex:/^9\d{9}$/',
            'adultCount' => 'required|numeric|min:1|max:20',
            'childCount' => 'required|numeric|min:0|max:10',
            'checkInDate' => 'required',
            'bookingType' => 'required',
            'tentPitchingCount' => 'required|numeric|min:0|max:10',
            'bonfireKitCount' => 'required|numeric|min:0|max:10',
            'price' => 'required',
            'cabin_id' => 'nullable|integer'
        ],[
            'telNumber' => 'Invalid number. Example: 9921234567',
        ]);

        $authenticatedUser = User::find(Auth::id());
        $booking = null;
        $bookingJson = null;
        $transaction = null;
        $transactionId = null;
        

        // Check if user has existing booking then update it
        $existingBooking = Booking::where('user_id', $authenticatedUser->id)->where('status', 'PENDING')->first();
        if ($existingBooking){
            DB::beginTransaction();
            try {
                // Check if booking has existing transaction
                $existingTransaction = Transaction::where('booking_id', $existingBooking->id)->first();
                if ($existingTransaction) {
                    $existingTransaction->delete();
                }
                Qrcode::where('booking_id', $existingBooking->id)->delete();
                Camper::where('booking_id', $existingBooking->id)->delete();                
                $existingBooking->update([
                    'user_id' => $authenticatedUser->id,
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'],
                    'tel_number' => $validated['telNumber'],
                    'adultCount' => $validated['adultCount'],
                    'childCount' => $validated['childCount'],
                    'check_in' => Carbon::parse($validated['checkInDate'])->timezone('Asia/Manila')->format('Y-m-d'),
                    'check_out' => $validated['bookingType'] === 'overnight' ? Carbon::parse($validated['checkInDate'])->addDay(1)->timezone('Asia/Manila')->format('Y-m-d') : Carbon::parse($validated['checkInDate'])->timezone('Asia/Manila'),
                    'booking_type' => $validated['bookingType'],
                    'tent_pitching_count' => $validated['tentPitchingCount'],
                    'bonfire_kit_count' => $validated['bonfireKitCount'],
                    'cabin_id' => $validated['cabin_id'] ?? null,
                    'note' => $request->note,
                        'status' => 'PENDING',
                ]);

                $existingBooking->save();
    
                if ($validated['adultCount'] + $validated['childCount'] === 1) {
                    Camper::create([
                        'full_name' => $validated['first_name'] . ' ' . $validated['last_name'],
                        'booking_id' => $existingBooking->id,
                    ]);
                }
    
                $transaction = Transaction::create([
                    'user_id' => $request->user()->id,
                    'booking_id' => $existingBooking->id,
                    'price' => $validated['price'],
                    'fee' => 0,
                ]);  
    
                Qrcode::create([
                    'booking_id' => $existingBooking->id,
                    'code' => fake()->regexify('[A-Za-z0-9]{8}')
                ]);
    
                $transactionId = $transaction->id;
                $bookingJson = new BookingResource($existingBooking);            
                DB::commit();

            } catch (\Throwable $th) {
                Log::info("Error at Api/v1/BookingController", [$th]);
                DB::rollBack();
            }
            
        } else{
            // Create booking if there is no existing booking
            try {
                DB::beginTransaction(); 
                $booking = Booking::create([
                    'user_id' => $authenticatedUser->id,
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'],
                    'tel_number' => $validated['telNumber'],
                    'adultCount' => $validated['adultCount'],
                    'childCount' => $validated['childCount'],
                    'check_in' => Carbon::parse($validated['checkInDate'])->timezone('Asia/Manila')->format('Y-m-d'),
                    'check_out' => $validated['bookingType'] === 'overnight' ? Carbon::parse($validated['checkInDate'])->addDay(1)->timezone('Asia/Manila')->format('Y-m-d') : Carbon::parse($validated['checkInDate'])->timezone('Asia/Manila'),
                    'booking_type' => $validated['bookingType'],
                    'tent_pitching_count' => $validated['tentPitchingCount'],
                    'bonfire_kit_count' => $validated['bonfireKitCount'],
                    'cabin_id' => $validated['cabin_id'] ?? null,
                    'note' => $request->note,
                        'status' => 'PENDING',
                ]);
    
                if ($validated['adultCount'] + $validated['childCount'] === 1) {
                    Camper::create([
                        'full_name' => $validated['first_name'] . ' ' . $validated['last_name'],
                        'booking_id' => $booking->id,
                    ]);
                }
    
                $transaction = Transaction::create([
                    'user_id' => $request->user()->id,
                    'booking_id' => $booking->id,
                    'price' => $validated['price'],
                    'fee' => 0,
                ]);  
    
                Qrcode::create([
                    'booking_id' => $booking->id,
                    'code' => fake()->regexify('[A-Za-z0-9]{8}')
                ]);
    
    
    
                $transactionId = $transaction->id;
                $bookingJson = new BookingResource($booking);            
                DB::commit();
            } catch (\Throwable $th) {
                Log::info("Error at Api/v1/BookingController", [$th]);
                DB::rollBack();
                throw $th;
            }
        }

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

    public function inputLogBook(Request $request, Booking $booking){
        if ($request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $bannedStatus = ['CASH_CANCELLED', 'VOIDED', 'REFUNDED', 'FAILED', 'PENDING', 'REFUND_PENDING', 'CANCELLED'];
        $validated = $request->validate([
            'campers' => 'required'
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
        // Extract only the 'name' values
        $insertData = array_map(function($item) use ($booking) {
            return ['full_name' => $item, 'booking_id' => $booking->id, 'created_at'=>date('Y-m-d H:i:s'), 'updated_at'=> date('Y-m-d H:i:s')];
        }, $validated['campers']);

        Camper::insert($insertData);
        return response()->json(['message' => 'Data inserted successfully.']);
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
