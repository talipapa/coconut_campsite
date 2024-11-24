<?php
namespace App\CustomVendors;

use App\Models\Owner;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Http;

class ExpoPushNotification {


    public static function pushNotify(string $title, string $body) {
        $userWithToken = Owner::with('user')->first();

        if (!$userWithToken) {
            return "No user with token found";
        }

        $ownerToken = $userWithToken->user->mobilePushTokens->first()->token;

        if (!$ownerToken) {
            return "No token found";
        }
    
        $baseUrl = "https://exp.host/--/api/v2/push/send";
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post($baseUrl, [
            'to' => $ownerToken,
            'title' => $title,
            'body' => $body,
        ]);
        if ($response->failed()) {
            return "Failed to send push notification";
        }
        return $response;
    }

}