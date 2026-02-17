<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Listing retrieved successfully',
            'data' => Listing::all()
        ]);
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
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|integer|exists:category,id',
        ]);

        try {
            $imagePath = $request->file('image') ? $request->file('image')->store('images', 'public') : null;
            $listing = Listing::create([
                'title' => $request->title,
                'description' => $request->description,
                'image' => $imagePath,
                'category_id' => $request->category_id,
                // 'user_id' => auth()->id(),
                'user_id' => $request->user_id,

            ]);
            return response()->json([
                'success' => true,
                'message' => 'Listing created successfully',
                'data' => $listing
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create listing: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Listing::find($id);
        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Listing not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Listing retrieved successfully',
            'data' => $data
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|integer|exists:category,id',
        ]);

        try {
            $listing = Listing::find($id);
            if (!$listing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Listing not found',
                ], 404);
            }

            if ($request->hasFile('image')) {
                // Store new image
                $imagePath = $request->file('image')->store('images', 'public');

                // Delete old image from storage
                if ($listing->image && Storage::exists('public/' . $listing->image)) {
                    Storage::delete('public/' . $listing->image);
                }
            }

            $listing->update([
                'title' => $request->title,
                'description' => $request->description,
                'image' => $imagePath,
                'category_id' => $request->category_id,
                // 'user_id' => auth()->id(),
                'user_id' => $request->user_id,
            ]);




            return response()->json([
                'success' => true,
                'message' => 'Listing updated successfully',
                'data' => $listing
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update listing: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $listing = Listing::find($id);
            if (!$listing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Listing not found',
                ], 404);
            }

            // Delete image from storage
            if ($listing->image && Storage::exists('public/' . $listing->image)) {
                Storage::delete('public/' . $listing->image);
            }

            $listing->delete();

            return response()->json([
                'success' => true,
                'message' => 'Listing deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete listing: ' . $e->getMessage(),
            ], 500);
        }
    }
}
