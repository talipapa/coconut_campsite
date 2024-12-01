<?php

namespace App\Http\Controllers\Api\v1;

use App\Models\Price;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\v1\PriceResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PriceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PriceResource::collection(Price::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Price $price)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Price $price)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Price $price)
    {
        
    }

    public function batchUpdate(Request $request)
    { 
        $validated = $request->validate([
            'adult' => 'required',
            'child' => 'required',
            'tent_pitch' => 'required',
            'bonfire' => 'required',
        ]);
        DB::beginTransaction();
        try {
            Price::where('name', 'adult')->update(['price' => $validated['adult']]);
            Price::where('name', 'child')->update(['price' => $validated['child']]);
            Price::where('name', 'tent_pitch')->update(['price' => $validated['tent_pitch']]);
            Price::where('name', 'bonfire')->update(['price' => $validated['bonfire']]);
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'Prices update failed'], 304);
        }
        return response()->json(['message' => 'Prices updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Price $price)
    {
        //
    }
}
