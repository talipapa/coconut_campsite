<?php

namespace App\Http\Controllers\Api\v1\Desktop;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\SuccessfulBookingResource;
use App\Models\Booking;
use App\Models\Camper;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
            //code...
            // sort by check in date
            $perPage = $request->query('per_page', 10);
            $scannedBooking = Booking::whereIn('status', ['SCANNED', 'PAID', 'CASH_PENDING'])->paginate($perPage);
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

    public function fetchSuccessfulBooking(Request $request){
        try {
            //code...
            // sort by check in date
            $perPage = $request->query('per_page', 10);
            $scannedBooking = Booking::where('status', 'VERIFIED')->paginate($perPage);
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
            $scannedBooking = Booking::paginate($perPage);
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

}
