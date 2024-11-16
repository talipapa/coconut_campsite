<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Cabin;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CabinController extends Controller
{
    public function index()
    {
        $cabins = Cabin::all();
        return response()->json($cabins);
    }

    public function show(Request $request, Cabin $cabin)
    {
        return response()->json($cabin);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'image' => 'required|mimes:jpeg,jpg,png',
            'price' => 'required|integer',
            'capacity' => 'required|integer',
        ]);
        $cabin = Cabin::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'capacity' => $validated['capacity'],
        ]);
        
        $newFileName = Str::random(20) .'.'.$request->file('image')->extension();
        $cabin->addMedia($request->file('image'))->usingFileName($newFileName)->toMediaCollection('cabin_images');
        return response()->json($cabin, 201);
    }

    public function update(Request $request, Cabin $cabin)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|integer',
            'capacity' => 'required|integer',
        ]);

        $cabin->update($validated);
        $cabin->save();
        return response()->json($cabin, 200);
    }

    public function updateImage(Request $request, Cabin $cabin){
        $validated = $request->validate([
            'image' => 'required|mimes:jpeg,jpg,png',
        ]);
        $newFileName = Str::random(20) .'.'.$request->file('image')->extension();
        $cabin->addMedia($request->file('image'))->usingFileName($newFileName)->toMediaCollection('cabin_images');
        return response()->json($cabin, 200);
    }

    public function destroy(Request $request, Cabin $cabin)
    {
        $cabin->delete();
        return response()->json(null, 204);
    }
}


