<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\BookingResource;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
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
        $booking = Booking::where('user_id', $request->user()->id)->first();
        if (!$booking) {
            return response()->json(['message' => false], 201);
        }
        return response()->json(
            ['message' => true, 
             'data' => new BookingResource($booking)
            ]
            , 201);
    }



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::all();
        if ($bookings->isEmpty()) {
        return response()->json(['message' => 'No bookings found'], 404);
        }
        return BookingResource::collection($bookings);   

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if user has existing booking
        $existingBooking = Booking::where('user_id', $request->user()->id)->first();
        if ($existingBooking) {
            return response()->json(['message' => 'User already has an existing booking'], 400);
        }
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

        $authenticatedUser = User::find($request->user()->id);
        $booking = null;
        $bookingJson = null;
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
            $bookingJson = new BookingResource($booking);
        } catch (\Throwable $th) {
            $booking->delete();
            throw $th;
        }

        
        
        Log::info($booking);
        return [
            "Status" => "Booking Success",
            "data" => $bookingJson
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
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
