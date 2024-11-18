<?php

namespace App\Http\Resources\v1;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QrCodeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $booking = Booking::find($this->booking_id);
        $transaction = $booking->transaction;
        $guestCount = $booking->adultCount + $booking->childCount;
        $cabin = $booking->cabin;
        return [
            'reservation_holder' => [
                'full_name' => $booking->first_name. " ". $booking->last_name,  
            ],
            'population' => [
                'adult_count' => $booking->adultCount,
                'child_count' => $booking->childCount,
                'total_guest_count' => $guestCount,
            ],
            'booking' => [
                'check_in' => $booking->check_in,
                'booking_status' => $booking->status,
                'booking_type' => $booking->booking_type,
                'bonfire_kit_count' => $booking->bonfire_kit_count,
                'tent_pitching_count' => $booking->tent_pitching_count,
                'has_cabin' => $cabin ? true : false,
                'cabin' => [
                    'cabin_name' => $cabin ? $cabin->name : null,
                    'cabin_price' => $cabin ? $cabin->price : null,
                    'cabin_image' => $cabin ? $cabin->image : null,
                ]
            ],
            'campers' => $booking->campers->map(function ($camper) {
                return $camper->full_name;
                }),
            'kiosk_autofillup' => [
                'guest_count' => $guestCount,
                'remaining_log_submissions' => $guestCount - $booking->campers->count(),
                'is_log_submitted' => $guestCount === $booking->campers->count() ? true : false,
            ],
            'transaction' => [
                'transaction_id' => $transaction ? $transaction->id : null,
                'transaction_type' => $transaction ? $transaction->payment_type : null,
                'price' => $transaction ? $transaction->price : null,
                'fee' => $transaction ? $transaction->fee : 0,
                'transaction_status' => $transaction ? $transaction->status : null,
                'xendit_reference' => $transaction ? $transaction->xendit_id : null,

            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
