<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\v1\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function index()
    {
        return User::all();
    }


    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed'
        ]);
        $validate = User::create($validate);

    }


    public function show(User $user)
    {
        return $user;
    }


    public function update(Request $request, User $user)
    {
        $validate = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed'
        ]);
        
        $oldUserData = new ($user);
        $user->update($validate);
        $newUserData = new UserResource($user); 
        return response()->json([
            'message' => 'User details updated successfully',
            'old_data' => $oldUserData,
            'new_data' => $newUserData], 
            200
        );
    }


    public function destroy(User $user)
    {
        $oldData = $user;
        $user->delete();
        return response()->json(
            ['message' => 'User account deleted successfully', 
            'additional-info' => "User" . $oldData->name . ' has been deleted'], 
            200
        );
    }
}
