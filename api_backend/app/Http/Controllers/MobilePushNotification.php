<?php

namespace App\Http\Controllers;

use App\CustomVendors\ExpoPushNotification;
use App\Models\Owner;
use App\Models\User;
use Illuminate\Http\Request;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

class MobilePushNotification extends Controller
{
    public function sendPushNotification(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'body' => 'required|string'
        ]);

        try {
            ExpoPushNotification::pushNotify($validated['title'], $validated['body']);            


            return response()->json(['message' => 'Push notification sent'], 200);

        } catch (\Throwable $th) {

            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
