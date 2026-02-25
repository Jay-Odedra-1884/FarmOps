<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Validator;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'farm_id' => 'nullable|exists:farms,id|required_without_all:crop_id',
            'crop_id' => 'nullable|exists:crops,id|required_without_all:farm_id',
        ]);
        $query = Expense::query();

        if ($request->has('farm_id')) {
            $query->where('farm_id', $request->farm_id);
        }

        if ($request->has('crop_id')) {
            $query->where('crop_id', $request->crop_id);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        $expenses = $query->where('user_id', auth()->user()->id)->get();

        return response()->json([
            'success' => true,
            'message' => 'expenses fetched successfully',
            'data' => $expenses
        ]);
    }

    public function getAllExpenses() {
        return response()->json([
            'success' => true,
            'message' => 'expenses fetched successfully',
            'data' => Expense::where('user_id', auth()->user()->id)->get()
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'note' => 'nullable|string|max:50',
            'amount' => 'required|numeric|max:1000000000',
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:expenses_categories,id',
            'crop_id' => 'required|exists:crops,id',
            'farm_id' => 'required|exists:farms,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'succeess' => false,
                'message' => "validation failed",
                'errors' => $validator->errors()
            ]);
        }

        $data = $validator->validate();
        $expense = Expense::create([
            'note' => $data['note'] ?? null,
            'amount' => $data['amount'],
            'type' => $data['type'],
            'category_id' => $data['category_id'],
            'crop_id' => $data['crop_id'],
            'farm_id' => $data['farm_id'],
            'user_id' => auth()->user()->id,
        ]);

        return response()->json([
            'success'=> true,
            'message'=> "expense created successfully",
            'data'=> $expense
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'note' => 'nullable|string|max:50',
            'amount' => 'nullable|numeric|max:1000000000',
            'type' => 'nullable|in:income,expense',
            'category_id' => 'nullable|exists:expenses_categories,id',
            'crop_id' => 'nullable|exists:crops,id',
            'farm_id' => 'nullable|exists:farms,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'succeess' => false,
                'message' => "validation failed",
                'errors' => $validator->errors()
            ]);
        }
        $data = $request->all();
        $data = $validator->validate();
        $data['user_id'] = auth()->user()->id;
        $expense = Expense::findOrFail($id);
        $expense->update($data);
       

        return response()->json([
            'success'=> true,
            'message'=> "expense updated successfully",
            'data'=> $expense
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return response()->json([
            'success' => true,
            'message' => "expense deleted successfully",
            "data"=> $expense
        ]);
    }
}
