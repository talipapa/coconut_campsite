<?php

namespace App\Listeners;

use App\CustomVendors\ExpoPushNotification;
use App\CustomVendors\Xemaphore;
use App\Events\eWalletEvents;
use App\Mail\EpaymentConfirmation;
use App\Mail\StaffActionRefundNotifier;
use App\Models\Booking;
use App\Models\Payout;
use App\Models\Refund;
use App\Models\Transaction;
use App\Models\User;
use GlennRaya\Xendivel\Xendivel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class eWalletWebhookListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handles the incoming webhook from Xendit API.
     *
     * This method processes webhook notifications sent by Xendit API. The data received from the webhook
     * is expected to be an array, containing relevant information from the API response. This method
     * serves as a central point to implement various related tasks such as:
     *
     * - Saving transactional data or updates to the database.
     * - Triggering additional processes based on the webhook data (e.g., email notifications).
     * - Interacting with other internal or external APIs based on the received data.
     * - Performing validations and logging for audit or debugging purposes.
     *
     * It's crucial to ensure that this method handles the data securely and efficiently, maintaining
     * the integrity and performance of the application.
     */
    public function handle(eWalletEvents $event)
    {
        // Inspect the returned data from the webhoook in your logs file
        // storage/logs/laravel.log

        // logger('Webhook data received: ', $event->webhook_data);

        // Event type

        // Check if webhook_data array contains the 'event' key
        // If webhook_data array does not contain the 'event' key, the transaction is probably a disbursements or a payout
        if (!array_key_exists('event', $event->webhook_data)){
            // Log::alert('Webhook debug', [
            //     'webhook_data' => json_encode($event->webhook_data[])
            // ]);
            $payout = Payout::find($event->webhook_data['reference']);
            $payout->status = $event->webhook_data['status'];
            $payout->save();   
            Log::alert('Payout succeeded', [
                'payout_id' => $payout->id,
                'status' => $payout->status
            ]);

            return response()->json('Webhook event not found', 200);
        } 

        // Handle the event based on the event type (most likely a void, refund, or transaction event)
        switch ($event->webhook_data['event']) {
            case 'ewallet.capture':
                // Handle the capture event
                if($event->webhook_data['data']['status'] === 'SUCCEEDED'){
                    // Get the transaction
                    $transaction = Transaction::find($event->webhook_data['data']['reference_id']);
                    $data = $event->webhook_data['data'];
                    $id = $transaction->xendit_product_id;
                    
                    // Set the transaction status to success
                    $transaction->status = $event->webhook_data['data']['status'];
                    
                    // Get the booking
                    $booking = Booking::find($transaction->booking_id);
        
                    $email_invoice = new Xendivel();
                    
                    // Set the booking status to PAID
                    $booking->status = 'PAID';
                    $transaction->price = $data['charge_amount'];
                    
                    $booking->save();
                    $transaction->save();
        
                    logger('Online payment succeeded!!', [
                        'email' => $booking->user->email,
                        'transaction_id' => $transaction->id,
                    ]);

                    try {
                        Log::error("Invoice succeeded?", ['Invoice' => ""]);
                    } catch (\Throwable $th) {
                        Log::error("Invoicing email error", ['Error' => $th->getMessage()]);
                    }

                    $formattedCheckInOld = Carbon::parse($booking->check_in)->timezone('Asia/Manila')->toFormattedDateString();
                    // Send notification to owner
                    ExpoPushNotification::pushNotify(
                    "{$booking->full_name} has made a booking using E-Payment! +P{$transaction->price}", 
                    "Total: P{$transaction->price}, {$booking->full_name} made a reservation at {$formattedCheckInOld} | {$booking->booking_type}. for {$booking->total_campers} campers.",
                    );

                    // Send email receipt below
                    
                    Mail::to($booking->email)->send(new EpaymentConfirmation($booking, $transaction));
                    Xemaphore::sendSms($booking->tel_number, "You have successfully purchased P{$booking->transaction->price} at Coconut Campsite, Your booking is now confirmed at {$formattedCheckInOld}. We can't wait to see you at the campsite!. Please check your email inbox or spam for more info receipt.");
                }
                break;
            case 'ewallet.void':
                // Get the transaction
                $transaction = Transaction::find($event->webhook_data['data']['reference_id']);
                $booking = Booking::find($transaction->booking_id);
                $booking->status = 'CANCELLED';
                $booking->save();
                
                // Set the transaction status to void
                $transaction->status = $event->webhook_data['data']['status'];
                $transaction->save();
    
                // Create refund data in refund table
                // $refund = Refund::create([
                //     'booking_id' => $transaction->booking_id,
                //     'transaction_id' => $transaction->id,
                //     'xendit_refund_id' => $event->webhook_data['data']['id']
                // ]);
                // $refund->save();
    
                logger('Transaction status updated to void', [
                    'user email' => User::find($transaction->user_id)->email,
                    'transaction_id' => $transaction->id,
                    'status' => $transaction->status
                ]);
    
                if($event->webhook_data['data']['status'] === 'FAILED'){
                    // Get the transaction
                    $transaction = Transaction::find($event->webhook_data['data']['reference_id']);
                    
                    // Set the transaction status to failed
                    $transaction->status = $event->webhook_data['data']['status'];
                    $transaction->save();
                    logger('Transaction status updated to failed', [
                        'user email' => User::find($transaction->user_id)->email,
                        'transaction_id' => $transaction->id,
                        'status' => $transaction->status
                    ]);
                }
                $formattedCheckInOld = Carbon::parse($booking->check_in)->timezone('Asia/Manila')->toFormattedDateString();
                ExpoPushNotification::pushNotify(
                    "-P{$transaction->price} from {$booking->full_name}", 
                    "{$booking->full_name} has voided P{$transaction->price}. Booking cancelled at {$formattedCheckInOld} | {$booking->booking_type}.",
                );
                Xemaphore::sendSms($booking->tel_number, "Your refund has been approved and is being processed! Your money will return after a few hours or days");
                break;
            case 'ewallet.refund':
                // Get the transaction
                $response = Xendivel::getPayment($event->webhook_data['data']['charge_id'], 'ewallet')->getResponse();
            
                $transaction = Transaction::find($response->reference_id);
                $booking = Booking::find($transaction->booking_id);
                $booking->status = 'CANCELLED';
                $booking->save();
                
                // Set the transaction status to void
                $transaction->status = "REFUNDED";
                $transaction->save();
    
                // Create refund data in refund table
                // $refund = Refund::create([
                //     'booking_id' => $transaction->booking_id,
                //     'transaction_id' => $transaction->id,
                //     'xendit_refund_id' => $event->webhook_data['data']['id']
                // ]);
                // $refund->save();
    
                logger('Transaction status updated to refund', [
                    'user email' => User::find($transaction->user_id)->email,
                    'transaction_id' => $transaction->id,
                    'status' => $transaction->status
                ]);
    
                if($event->webhook_data['data']['status'] === 'FAILED'){
                    // Get the transaction
                    $transaction = Transaction::find($event->webhook_data['data']['reference_id']);
                    
                    // Set the transaction status to failed
                    $transaction->status = $event->webhook_data['data']['status'];
                    $transaction->save();
                    logger('Transaction status updated to failed', [
                        'user email' => User::find($transaction->user_id)->email,
                        'transaction_id' => $transaction->id,
                        'status' => $transaction->status
                    ]);
                }
                $formattedCheckInOld = Carbon::parse($booking->check_in)->timezone('Asia/Manila')->toFormattedDateString();
                ExpoPushNotification::pushNotify(
                    "-P{$transaction->price} from {$booking->full_name}", 
                    "{$booking->full_name} has refunded P{$transaction->price}. Booking cancelled at {$formattedCheckInOld} | {$booking->booking_type}.",
                );

                Xemaphore::sendSms($booking->tel_number, "Your refund has been approved and is being processed! Your money will return after a few hours or days");
                Mail::to($booking->email)->send(new StaffActionRefundNotifier($booking, $transaction, (int) $transaction->price));

                break;
            
            default:
                Log::info('Webhook event not recognized', [
                    'event' => $event->webhook_data
                ]);
                break;
        }

        return response()->json('Webhook received', 200);
    }
}
