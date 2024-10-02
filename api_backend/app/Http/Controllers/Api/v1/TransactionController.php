<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Resources\Api\TransactionResource;
use App\Models\CampManager;
use App\Models\Manager;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TransactionController extends Controller
{


    // Admin should be able to view all transactions
    //
    public function transactionListAll()
    {
        Gate::authorize('viewAnyAdmin', Transaction::class);
        return TransactionResource::collection(Transaction::all());
    }

    // Campsite managers should only be able to view transactions related to their campsite
    public function viewOnlyCampsiteTransaction(){
        Gate::authorize('viewAnyCampsiteTransaction', Transaction::class);

        $campsiteId = Manager::where('user_id', Auth::user()->id)->first()->campsite_id;
        $campsiteTransactions = Transaction::where('campsite_id', $campsiteId)->get();
        
        return TransactionResource::collection($campsiteTransactions);
    }

    
    // Users must be only able to see their own transactions
    //
    public function index()
    {
        $authenticatedUser = Auth::user();
        return TransactionResource::collection(Transaction::where('user_id', $authenticatedUser->id)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required',
            'price' => 'required',
            'status' => 'required',
            'payment_type' => 'required',
            'xendit_transaction_id' => 'required',
        ]);

        // Check first if the booking doesn't have a transaction yet
        $transaction = Transaction::where('booking_id', $validated['booking_id'])->first();
        if ($transaction) {
            return response()->json(['message' => 'Transaction already exists for this booking'], 400);
        }

        $transaction = Transaction::create([
            'user_id' => Auth::user()->id,
            'booking_id' => $validated['booking_id'],
            'price' => $validated['price'],
            'status' => $validated['status'],
            'payment_type' => $validated['payment_type'],
            'xendit_transaction_id' => $validated['xendit_transaction_id'],
        ]);
        $transactionJsonObject = new TransactionResource($transaction);
        return response()->json([
            'message' => 'Campsite type tag added successfully',
            'data' => $transactionJsonObject
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        $authenticatedUser = Auth::user();
        if ($transaction->user_id !== $authenticatedUser->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        return new TransactionResource($transaction);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        Gate::authorize('update', $transaction);
        // Validate
        $validated = $request->validate([
            'price' => 'required',
            'status' => 'required',
            'payment_type' => 'required',
            'xendit_transaction_id' => 'required',
        ]);

    
        // Find data
        $transactionData = Transaction::find($transaction->id);
        if (!$transaction) {
            return response()->json(['message' => 'Campsite not found'], 404);
        }

        $oldData = $transactionData;

        // Update data
        $transaction->update([
            'price' => $validated['price'],
            'status' => $validated['status'],
            'payment_type' => $validated['payment_type'],
            'xendit_transaction_id' => $validated['xendit_transaction_id']
        ]);

        $transaction->save();
        // Return response
        $transactionDataJson = new TransactionResource($transaction);
        return response()->json([
            'message' => 'Campsite updated successfully',
            'old_data' => $oldData,
            'new_data' => $transactionDataJson], 200);
           
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        Gate::authorize('delete', $transaction);
        $oldData = $transaction;
        $transaction->delete();
        return response()->json(
            ['message' => 'Campsite tag deleted successfully', 
            'additional-info' => "Campsite tag" . $oldData->name . ' has been deleted',]
            , 200);
    }
}
