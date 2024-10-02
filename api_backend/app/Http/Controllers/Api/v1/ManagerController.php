<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\v1\ManagerResource;
use App\Models\Manager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $campManagers = Manager::all();
        return ManagerResource::collection($campManagers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Authorize
        Gate::authorize('create', [Manager::class]);
        // Validate request body
        $validated = $request->validate([
            'user_id' => 'required',
            'service_facebook' => 'required',
            'service_email' => 'required',
            'service_dialnumber' => 'required',
        ]);
        // Check if the user is already a manager
        $fetchIsAlreadyManager = DB::table('camp_managers')->where('user_id', $validated['user_id'])->first();
        if ($fetchIsAlreadyManager !== null) {
            return response()->json(['message' => 'User has existing manager account'], 409);
        }

        $campManager = Manager::create($validated);
        $campManagerObject = new ManagerResource($campManager);
        return response()->json([
            'message' => 'Camp Manager created successfully',
            'data' => $campManagerObject
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Manager $manager)
    {
        return new ManagerResource($manager);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Manager $manager)
    {
        Gate::authorize('update', $manager);        
        // Validate
        $validated = $request->validate([
            'user_id' => 'required',
            'service_facebook' => 'required',
            'service_email' => 'required',
            'service_dialnumber' => 'required',
        ]);
        // Check if the user is an admin
        $intentionId = Auth::user()->id;
        $fetchAdmin = DB::table('admins')->where('user_id', Auth::user()->id)->first();
        if ($request->user_id === null || $fetchAdmin !== null) {
            if (Auth::user()->id !== $fetchAdmin->user_id) {
                $intentionId = Auth::user()->id;
            } else{
                $intentionId = $validated['user_id'];
            }
    
        }


        
        // Find data
        $campManagerData = Manager::find($manager->id);
        if (!$manager) {
            return response()->json(['message' => 'Manager account not found'], 404);
        }

        $oldData = $campManagerData;

        // Check if the user is already a manager
        $fetchIsAlreadyManager = DB::table('camp_managers')->where('user_id', $intentionId)->first();
        if ($fetchIsAlreadyManager !== null) {
            return response()->json(['message' => 'Manager account already exists'], 409);
        }


        // Update data
        $manager->update([
            'user_id' => $intentionId,
            'service_facebook' => $validated['service_facebook'],
            'service_email' => $validated['service_email'],
            'service_dialnumber' => $validated['service_dialnumber'],
        ]);

        $manager->save();
        // Return response
        $campManagersDataJson = new ManagerResource($manager);
        return response()->json([
            'message' => 'Manager account updated successfully',
            'old_data' => $oldData,
            'new_data' => $campManagersDataJson], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Manager $manager)
    {
        Gate::authorize('delete', [$manager]);
        $oldData = $manager;
        $manager->delete();
        return response()->json(
            ['message' => 'Camp Manager deleted successfully', 
            'additional-info' => "Manager " . $oldData->user->name . ' has been deleted',]
            , 200);
    }
}
