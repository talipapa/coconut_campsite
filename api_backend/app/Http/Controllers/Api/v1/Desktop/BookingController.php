<?php

namespace App\Http\Controllers\Api\v1\Desktop;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Transaction;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function dashboardSummary(Request $request){
        // Return unathorize if user is not a manager
        if (!$request->user()->manager()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        try {
            //code...
            // data that i need [dashboard]
            // total earnings of current year
            $totalYearEarnings = Transaction::whereYear('created_at', date('Y'))->where('status', 'VERIFIED')->sum('price');
            // total earnings this month
            $totalMonthEarnings = Transaction::whereYear('created_at', date('Y'))->where('status', 'VERIFIED')->whereMonth('created_at', date('m'))->sum('price');
            // total earnings from previous month
            $totalPreviousMonthEarnings = Transaction::whereYear('created_at', date('Y'))->where('status', 'VERIFIED')->whereMonth('created_at', date('m', strtotime('-1 month')))->sum('price');
    
            // cash revenue this month
            $cashRevenueThisMonth = Transaction::whereYear('created_at', date('Y'))->where('status', 'VERIFIED')->whereMonth('created_at', date('m'))->where('payment_type', 'CASH')->sum('price');
            // e-payment revenue this month
            $ePaymentRevenueThisMonth = Transaction::whereYear('created_at', date('Y'))->where('status', 'VERIFIED')->whereMonth('created_at', date('m'))->where('payment_type', 'XENDIT')->sum('price');
            // success booking this month
            $successBookingThisMonth = Transaction::whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'))->where('status', 'VERIFIED')->count();
            // cancelled booking this month
            $cancelledBookingThisMonth = Transaction::whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'))->whereIn('status', ['CANCELLED', 'VOIDED', 'REFUNDED'])->count();
    
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
}
