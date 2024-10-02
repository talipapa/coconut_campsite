<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => User::factory()->create()->id,
            "price" => $this->faker->randomFloat(2, 0, 1000),
            "check_in" => Carbon::now()->subDays(rand(1, 30)),
            "check_out" => Carbon::now()->subDays((rand(1, 30)))->addDays(rand(1, 100)),
            "booking_type" => $this->faker->randomElement(["overnight", "daytour"]),
        ];
    }
}
