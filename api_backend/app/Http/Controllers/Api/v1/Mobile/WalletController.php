<?php

namespace App\Http\Controllers\Api\v1\Mobile;

use App\CustomVendors\Xendivel;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payout;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WalletController extends Controller
{
    public function displayWallet(Request $request) {
        $wallet = [
            'XENDIT' => '',
            'VERIFIED_CASH' => '', 
        ];

        $response = Xendivel::getBalance()->getResponse();
        $decodedResponse = json_decode(json_encode($response), true);
        $wallet['XENDIT'] = $decodedResponse['balance'];

        $fetchVerifiedCash = Transaction::where('status', 'VERIFIED')->get()->sum(function($transaction){
            return $transaction->price;
        });

        Log::alert($fetchVerifiedCash);
        $wallet['VERIFIED_CASH'] = $fetchVerifiedCash;

        return $wallet;
    }

    public function createPayout(Request $request){
        $validated = $request->validate([
            'account_holder_name' => 'required|max:20',
            'account_number' => 'required|max:11',
            'amount' => 'required',
        ]);

        $payout = Payout::create([
            "account_name" => $validated['account_holder_name'],
            "account_number" => $validated['account_number'],
            "amount" => $validated['amount'],
        ]);

        $payout->save();

        


        return response()->json([
            'message' => "Success"
        ], 200);

    }
}

// curl https://api.xendit.co/balance -X GET \
// -u xnd_development_O46JfOtygef9kMNsK+ZPGT+ZZ9b3ooF4w3Dn+R1k+2fT/7GlCAN3jg==: