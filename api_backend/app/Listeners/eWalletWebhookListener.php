<?php

namespace App\Listeners;

use App\Events\eWalletEvents;
use App\Models\Booking;
use App\Models\Refund;
use App\Models\Transaction;
use App\Models\User;
use GlennRaya\Xendivel\Xendivel;
use Illuminate\Support\Facades\Log;

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
        // You can inspect the returned data from the webhoook in your logs file
        // storage/logs/laravel.log



        // logger('Webhook data received: ', $event->webhook_data);

        
        // Event type
        // Log::info($event->webhook_data['event']);
        
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
        }
        
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
        
        if ($event->webhook_data['event'] === 'ewallet.capture'){
            // Xendit product ID
            logger('Xendit ID', [$id]); 
            // Xendit order ID
            logger('Status', [$data['status']]); 
            // Charged amount
            logger('Charge amount', [$data['charge_amount']]); 
            // Transaction status
            logger('Status', [$data['status']]); 
        }
        
        if($event->webhook_data['event'] === 'ewallet.void'){
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
        }
        
        
        
        



    }
}
