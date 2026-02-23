<?php

namespace App\Http\Controllers;

use App\Models\ExpensesCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class ExpensesCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Expenses Categories Fetched Successfully',
            'data' => ExpensesCategory::all()
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ]);
        }

        $expensesCategory = ExpensesCategory::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Expenses Category Created Successfully',
            'data' => $expensesCategory
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ExpensesCategory $expensesCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExpensesCategory $expensesCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ]);
        }

        $expensesCategory = ExpensesCategory::find($id);
        $expensesCategory->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Expenses Category Updated Successfully',
            'data' => $expensesCategory
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExpensesCategory $expensesCategory)
    {
        $expensesCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expenses Category Deleted Successfully',
            'data' => $expensesCategory
        ]);
    }
}
