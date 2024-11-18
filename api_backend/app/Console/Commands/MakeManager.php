<?php

namespace App\Console\Commands;

use App\Models\Manager;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MakeManager extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:make-manager {email?} {password?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create manager account, returns admin details if successful, otherwise returns an error message.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $optionalArgPassword = $this->argument('password');
        $generatedPassword = "";
        
        if (!$optionalArgPassword) {
            $this->info("No password provided, Creating user account with randomized password....");
            $generatedPassword = substr(md5(rand()), 0, 8);
        } else {
            $this->info("Password is provided, Creating user account....");
            $generatedPassword = $optionalArgPassword;
        }

        try {
            DB::beginTransaction();
            $generatedUser = User::factory()->create([
                "first_name" => "Admin." . rand(),
                "last_name" => "Admin." . rand(),
                "email" => $this->argument('email') ? $this->argument('email') : "admin." . rand() . "@lakbaycampsite.com",
                "password" => bcrypt($generatedPassword),
            ]);
            Manager::factory()->create([
                "user_id" => $generatedUser->id
            ]);
    
            $this->info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            $this->info("User: {$generatedUser->first_name} {$generatedUser->last_name}");
            $this->info("Email: $generatedUser->email");
            $this->info("Password: $generatedPassword");
            $this->info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            $this->info("Caretaker account created successfully!, Please save the details below");
            DB::commit();
        } catch (\Throwable $th) {
            $this->error("Account already exists with the email provided");
            sleep(1);
            $this->info("Disregarding provided password....");
            sleep(1);
            $this->info("Skipping user creation...");
            sleep(1);
            DB::rollBack();
            $generatedUser = User::where("email", $this->argument('email'))->first();
            Manager::factory()->create([
                "user_id" => $generatedUser->id
            ]);
            $this->info('');
            $this->info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            $this->info("User: {$generatedUser->first_name} {$generatedUser->last_name}");
            $this->info("Email: $generatedUser->email");
            $this->info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            $this->info('');
            $this->info("User has been promoted to caretaker!");
        }
    }
}
