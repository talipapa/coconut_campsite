<?php

namespace App\Http\Controllers\Api\v1\Desktop;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\SuccessfulBookingResource;
use App\Mail\StaffActionRefundNotifier;
use App\Mail\StaffActionRescheduleNotifier;
use App\Models\Booking;
use App\Models\Camper;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;
use GlennRaya\Xendivel\Xendivel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function dashboardSummary(Request $request){
        try {
            // total earnings of current year
            $totalYearEarnings = Transaction::whereYear('updated_at', Carbon::now()->year)
            ->where('status', 'VERIFIED')
            ->sum('price');

            // total earnings this month
            $totalMonthEarnings = Transaction::whereYear('updated_at', Carbon::now()->year)
            ->whereMonth('updated_at', Carbon::now()->month)
            ->where('status', 'VERIFIED')
            ->sum('price');

            // total earnings from previous month
            $startOfPreviousMonth = Carbon::now()->startOfMonth()->subMonth();
            $endOfPreviousMonth = Carbon::now()->subMonth()->endOfMonth();

            $totalPreviousMonthEarnings = Transaction::whereBetween('updated_at', [$startOfPreviousMonth, $endOfPreviousMonth])->where('status', 'VERIFIED')->sum('price');

            

            // cash revenue this month
            $cashRevenueThisMonth = Transaction::whereYear('updated_at', Carbon::now()->year)
            ->whereMonth('updated_at', Carbon::now()->month)
            ->where('status', 'VERIFIED')
            ->where('payment_type', 'CASH')
            ->sum('price');

            // e-payment revenue this month
            $ePaymentRevenueThisMonth = Transaction::whereYear('updated_at', Carbon::now()->year)
            ->whereMonth('updated_at', Carbon::now()->month)
            ->whereIn('status', ['VERIFIED'])
            ->where('payment_type', 'XENDIT')
            ->sum('price');

            // success booking this month
            $successBookingThisMonth = Transaction::whereYear('updated_at', Carbon::now()->year)
            ->whereMonth('updated_at', Carbon::now()->month)
            ->where('status', 'VERIFIED')
            ->count();

            // cancelled booking this month
            $cancelledBookingThisMonth = Transaction::whereYear('updated_at', Carbon::now()->year)
            ->whereMonth('updated_at', Carbon::now()->month)
            ->whereIn('status', ['CANCELLED', 'VOIDED', 'REFUNDED', 'FAILED'])
            ->count();
    
            return response()->json([
                'totalYearEarnings' => $totalYearEarnings,
                'totalMonthEarnings' => $totalMonthEarnings,
                'totalPreviousMonthEarnings' => $totalPreviousMonthEarnings,
                'cashRevenueThisMonth' => $cashRevenueThisMonth,
                'ePaymentRevenueThisMonth' => $ePaymentRevenueThisMonth,
                'successBookingThisMonth' => $successBookingThisMonth,
                'cancelledBookingThisMonth' => $cancelledBookingThisMonth
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
        }
    }

    public function fetchScannedBooking(Request $request){
        try {
            // Scanned button: Confirm & Reschedule
            $perPage = $request->query('per_page', 10);
            $scannedBooking = Booking::whereIn('status', ['SCANNED'])->orderBy('updated_at', 'asc')->paginate($perPage);
            return response()->json($scannedBooking);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
        }
    }

    public function bookingAction(Request $request, Booking $booking){
        try {
            //code...
            if (!$booking) {
                return response()->json(['message' => 'Booking not found'], 404);
            }
            switch ($request->action) {
                case 'confirm':
                    # code...
                    $booking->status = 'VERIFIED';
                    $booking->transaction->status = 'VERIFIED';
                    break;

                case 'cancel':
                    # code...
                    $booking->status = 'FAILED';
                    break;
                default:
                    return response()->json(['message' => 'Something went wrong', 'error', 'Action not acceptable'], 500);
                    break;
                }
            $booking->transaction->save();
            $booking->save();
            return response()->json(['message' => 'Booking status updated']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
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


    public function fetchUpcomingBooking(Request $request){
        try {
            //code...
            // sort by check in date
            $perPage = $request->query('per_page', 10);
            $scannedBooking = Booking::whereIn('status', ['PAID', 'CASH_PENDING'])->orderBy('updated_at', 'desc')->paginate($perPage);
            return response()->json($scannedBooking);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
        }
    }

    public function fetchNoShowBooking(Request $request){
        try {
            //code...
            
            $perPage = $request->query('per_page', 10);
            // Only fethc if the check in date is less than today
            $scannedBooking = Booking::where('check_in', '<', Carbon::now()->timezone('Asia/Manila')->format('Y-m-d'))->whereNotIn('status', ['VERIFIED', 'SCANNED', 'CANCELLED'])->orderBy('updated_at', 'desc')->paginate($perPage);
            // $scannedBooking = Booking::where('status', 'NO_SHOW')->orderBy('updated_at', 'desc')->paginate($perPage);
            return response()->json($scannedBooking);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
        }
    }

    public function fetchSuccessfulBooking(Request $request){
        try {
            //code...
            // sort by check in date
            $perPage = $request->query('per_page', 10);
            $scannedBooking = Booking::where('status', 'VERIFIED')->orderBy('updated_at', 'desc')->paginate($perPage);
            return response()->json($scannedBooking);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
        }
    }

    public function fetchAllBooking(Request $request){
        try {
            //code...
            // sort by check in date
            $perPage = $request->query('per_page', 10);
            $scannedBooking = Booking::whereNotIn('status', ['PENDING'])->orderBy('updated_at', 'desc')->paginate($perPage);
            return response()->json($scannedBooking);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
        }
    }

    public function fetchSingleBooking(Request $request, Booking $booking){
        try {
            //code...
            if (!$booking) {
                return response()->json(['message' => 'Booking not found'], 404);
            }
            return response()->json([
                'booking' => $booking,
                'transaction' => $booking->transaction,
                'campers' => $booking->campers
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th], 500);
        }
    }


    public function submitWalkIn(Request $request){
        $validated = $request->validate([
            'adultCount' => 'required',
            'bonfire_kit_count' => 'required',
            'campers' => 'required',
            'childCount' => 'required',
            'is_cabin' => 'required',
            'price' => 'required',
            'tel_number' => 'required',
            'tent_pitching_count' => 'required',
            'booking_type' => 'required'
        ]);

    
        try {
            DB::beginTransaction(); 
            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'first_name' => $request->user()->first_name,
                'last_name' => $request->user()->last_name,
                'email' => $request->user()->email,
                'tel_number' => $validated['tel_number'],
                'adultCount' => $validated['adultCount'],
                'childCount' => $validated['childCount'],
                'check_in' => Carbon::now()->timezone('Asia/Manila')->format('Y-m-d'),
                'check_out' => $validated['booking_type'] === 'overnight' ? Carbon::now()->addDay(1)->timezone('Asia/Manila')->format('Y-m-d') : Carbon::now()->timezone('Asia/Manila'),
                'booking_type' => $validated['booking_type'],
                'tent_pitching_count' => $validated['tent_pitching_count'],
                'bonfire_kit_count' => $validated['bonfire_kit_count'],
                'is_cabin' => $validated['is_cabin'],
                'note' => "Walk-in booking, approved by: {$request->user()->first_name} {$request->user()->last_name} | {$request->user()->email}",
                'status' => 'VERIFIED',
            ]);
    
            Transaction::create([
                'booking_id' => $booking->id,
                'user_id' => $request->user()->id,
                'payment_type' => 'CASH',
                'price' => $validated['price'],
                'fee' => 0,
                'status' => 'VERIFIED',
            ]); 
    
            
            $insertData = array_map(function($item) use ($booking) {
                return ['full_name' => $item, 'booking_id' => $booking->id, 'created_at'=>date('Y-m-d H:i:s'), 'updated_at'=> date('Y-m-d H:i:s')];
            }, $validated['campers']);
            
            Camper::insert($insertData);

            DB::commit();
            return response()->json(['message' => 'Walk in data has been successfully submitted.', 'booking_id' => $booking->id], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function rescheduleBooking(Request $request, Booking $booking){
        // Verify if the booking exists

        $validated = $request->validate([
            'booking_type' => 'required',
            'check_in' => 'required',
        ]);

        switch ($validated['booking_type']) {
            case 'daytour':
                // Send email to user
                Mail::to($booking->email)->send(new StaffActionRescheduleNotifier($booking, $booking->transaction, $booking->check_in, Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d')));

                $booking->update([
                    'booking_type' => $validated['booking_type'],
                    'check_in' => Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d'),
                    'check_out' => Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d'),
                ]);
                $booking->save();        
                return response()->json($booking, 200);
                break;
            case 'overnight':
                // Send email to user
                Mail::to($booking->email)->send(new StaffActionRescheduleNotifier($booking, $booking->transaction, $booking->check_in, Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d')));


                $booking->update([
                    'booking_type' => $validated['booking_type'],
                    'check_in' => Carbon::parse($validated['check_in'])->timezone('Asia/Manila')->format('Y-m-d'),
                    'check_out' => Carbon::parse($validated['check_in'])->addDay(1)->timezone('Asia/Manila')->format('Y-m-d'),
                ]);
        
                $booking->save();
        
                return response()->json($booking, 200);

                break;
            default:
                return response()->json(['message' => 'Invalid booking type'], 400);
                break;
        }

    }

    public function refundBooking(Request $request, Booking $booking){
        // Verify if user has a booking
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        $refundPercentage = 0.5;
        
        // Check if the user in request owns the booking or is an owner/manager
        // if ($booking->user_id != $request->user()->id){
        //     return response()->json(['message' => "Unauthorized access"], 401);
        // }

    
        $transaction = $booking->transaction;
        // Check if the status of the transaction is SUCCEEDED
        try {
            if (!in_array($transaction->status, ['SUCCEEDED', 'VERIFIED', 'SCANNED'])) {
                return response()->json(['message' => 'Transaction is not permitted to refund'], 400);
            }
    
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
                    ->refund((int) $transaction->price * $refundPercentage)
                    ->getResponse();
                Log::info(`Refund response:` . $transaction->price, [$response]);
            }
            $booking->status = "CANCELLED";
            $transaction->status = "REFUND_PENDING";
            $transaction->save();
            $booking->save();

            // Send email to user
            Mail::to($booking->email)->send(new StaffActionRefundNotifier($booking, $transaction, (int) $transaction->price * $refundPercentage));

            return response()->json($booking, 201);
        } catch (\Throwable $th) {
            //throw $th;
            Log::info($th);
            return response()->json(['message' => 'Something went wrong'], 400);
        }


    }

}
