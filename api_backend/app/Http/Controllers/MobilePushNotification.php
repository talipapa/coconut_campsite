<?php

namespace App\Http\Controllers;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

class MobilePushNotification extends Controller
{
    public function sendPushNotification()
    {
        $firebase = (new Factory())->withServiceAccount(__DIR__.'/../../../config/firebase_credentials.json');

        $messaging = $firebase->createMessaging();

        $message = CloudMessage::fromArray([
            'notification' => [
                'title' => 'Hello from Firebase!',
                'body' => 'This is a test notification.'
            ],
            'topic' => 'global'
        ]);

        $messaging->send($message);

        return response()->json(['message' => 'Push notification sent successfully']);
    }
}
