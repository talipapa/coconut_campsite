<?php
namespace App\CustomVendors;

use Exception;
use GlennRaya\Xendivel\XenditApi;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Xemaphore{

    public static $chargeResponse;


    private static function getXemaphoreKey(): string
    {
        return config('xemaphore.secret_key');
    }

    private static function getSenderName(): string
    {
        return config('xemaphore.sender_name');
    }

    public function getResponse()
    {
        return json_decode(self::$chargeResponse);
    }

    public static function sendSms(string $phoneNumber, string $bodyMessage): Response {
        // Check if the secret key is set in .env file.
        if (empty(config('xendivel.secret_key'))) {
            throw new Exception('Your Xendit secret key (XENDIT_SECRET_KEY) is not set in your .env file.');
        }
    
            // Define the base URL.
            $baseUrl = "https://api.semaphore.co/api/v4/messages";

            // Construct the full URL with query parameters.
            $url = $baseUrl . '?' . http_build_query([
                'apikey' => self::getXemaphoreKey(),
                'number' => '0'.$phoneNumber,
                'message' => $bodyMessage,
                // 'sendername' => self::getSenderName()
            ]);
            // Perform the POST request with the URL containing the query parameters.
            $response = Http::post($url);
        // Throw an exception if the request failed.
        if ($response->failed()) {
            throw new Exception("Request failed: " . $response->body());
        }
    
        self::$chargeResponse = $response;
        return $response;
    }
}