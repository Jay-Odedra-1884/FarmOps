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

        if ($request->filled('farm_id')) {
            $query->where('farm_id', $request->farm_id);
        }

        if ($request->filled('crop_id')) {
            $query->where('crop_id', $request->crop_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        $expenses = $query
            ->where('user_id', auth()->user()->id)
            ->with(['farm:id,name', 'crop:id,name', 'category:id,name'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'expenses fetched successfully',
            'data' => $expenses
        ]);
    }

    public function getAllExpenses(Request $request)
    {
        $query = Expense::where('user_id', auth()->user()->id);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        $expenses = $query
            ->with(['farm:id,name', 'crop:id,name', 'category:id,name'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'expenses fetched successfully',
            'data' => $expenses
        ]);
    }


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
            'success' => true,
            'message' => "expense created successfully",
            'data' => $expense
        ]);
    }


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
            'success' => true,
            'message' => "expense updated successfully",
            'data' => $expense
        ]);
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return response()->json([
            'success' => true,
            'message' => "expense deleted successfully",
            "data" => $expense
        ]);
    }
}
