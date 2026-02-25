"use client";

import React, { useEffect, useState } from "react";
import { MyHook } from "@/context/AppProvider";
import { getFarms } from "@/services/FarmApi";
import { getCrop } from "@/services/cropApi";
import { getExpenseCategories, addExpense } from "@/services/expenseApi";
import { Spinner } from "@/components/ui/spinner";
import { PlusCircleIcon } from "lucide-react";

function AddTransactionForm() {
  const { authToken } = MyHook();

  // ─── Dropdown Data ────────────────────────────────────────────────────────
  // These hold the list of options fetched from the backend for each dropdown
  const [farms, setFarms] = useState([]); // All farms belonging to the user
  const [crops, setCrops] = useState([]); // Crops for the currently selected farm
  const [categories, setCategories] = useState([]); // All expense categories (e.g. Seed, Fertilizer)

  // ─── Loading States ───────────────────────────────────────────────────────
  // Control individual spinners so each dropdown loads independently
  const [farmsLoading, setFarmsLoading] = useState(true);
  const [cropsLoading, setCropsLoading] = useState(false); // Only loads after a farm is selected
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // True while the form is being submitted

  // ─── Form Field State ─────────────────────────────────────────────────────
  const [selectedFarmId, setSelectedFarmId] = useState(""); // ID of the chosen farm
  const [selectedCropId, setSelectedCropId] = useState(""); // ID of the chosen crop
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // ID of the chosen category
  const [type, setType] = useState("expense"); // "expense" or "income" — controlled by toggle buttons
  const [amount, setAmount] = useState(""); // Transaction amount (number)
  const [note, setNote] = useState(""); // Optional note / description
  const [errors, setErrors] = useState({}); // Stores validation error messages per field

  // ─── Fetch Farms & Categories on Mount ───────────────────────────────────
  // This runs once when the component loads (or when authToken becomes available).
  // We fetch farms and categories in parallel so the form is ready quickly.
  useEffect(() => {
    if (!authToken) return;

    // Fetch user's farms for the Farm dropdown
    setFarmsLoading(true);
    getFarms(authToken)
      .then((res) => {
        if (res?.success) setFarms(res.data);
      })
      .finally(() => setFarmsLoading(false));

    // Fetch expense categories (e.g. Seed, Fertilizer, Labour) for the Category dropdown
    setCategoriesLoading(true);
    getExpenseCategories(authToken)
      .then((res) => {
        if (res?.success) setCategories(res.data);
      })
      .finally(() => setCategoriesLoading(false));
  }, [authToken]);

  // ─── Fetch Crops When Farm Changes ───────────────────────────────────────
  // Every time the user picks a different farm, we re-fetch crops for that farm.
  // This makes the Crop dropdown dynamic — it only shows crops that belong to the selected farm.
  useEffect(() => {
    // If no farm is selected, clear the crops list and reset the crop selection
    if (!selectedFarmId) {
      setCrops([]);
      setSelectedCropId("");
      return;
    }

    setCropsLoading(true);
    setSelectedCropId(""); // Reset previously selected crop when farm changes
    getCrop(authToken, selectedFarmId)
      .then((res) => {
        if (res?.success) setCrops(res.data);
      })
      .finally(() => setCropsLoading(false));
  }, [selectedFarmId, authToken]); // Re-runs whenever selectedFarmId changes

  // ─── Form Validation ──────────────────────────────────────────────────────
  // Checks all required fields before submitting.
  // Returns true if the form is valid, false otherwise.
  // Also sets the `errors` state so red messages appear under each invalid field.
  const validate = () => {
    const newErrors = {};

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!selectedFarmId) newErrors.farm_id = "Select a farm";
    if (!selectedCropId) newErrors.crop_id = "Select a crop";
    if (!selectedCategoryId) newErrors.category_id = "Select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  // ─── Form Submit Handler ──────────────────────────────────────────────────
  // Called when the user clicks "Add Expense" or "Add Income".
  // 1. Validates the form — stops if invalid
  // 2. Calls the API to create the expense record
  // 3. Resets the form on success (toast is shown inside addExpense())
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    if (!validate()) return; // Stop if validation fails

    setSubmitting(true);

    const res = await addExpense(authToken, {
      amount: parseFloat(amount), // Send as a number, not string
      note: note.trim() || null, // Send null if note is empty
      type, // "expense" or "income"
      farm_id: parseInt(selectedFarmId),
      crop_id: parseInt(selectedCropId),
      category_id: parseInt(selectedCategoryId),
    });

    if (res?.success) {
      // Clear the entire form after a successful submission
      setAmount("");
      setNote("");
      setType("expense");
      setSelectedFarmId("");
      setSelectedCropId("");
      setSelectedCategoryId("");
      setErrors({});
    }

    setSubmitting(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white h-full rounded-tr-none rounded-2xl p-5 flex flex-col">
      {/* Form title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        Add Transaction
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 flex-1 "
      >
        {/* ── Type Toggle (Expense / Income) ──
                    Two buttons that act as a toggle. Clicking one sets the `type` state.
                    The active button is highlighted in color (red for expense, green for income).
                    The submit button color also changes to match the selected type. */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 text-sm font-medium transition-all border-2 ${
              type === "expense"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 text-sm font-medium transition-all border-2 ${
              type === "income"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Income
          </button>
        </div>

        {/* ── Amount ──
                    Required field. Validated to be a positive number. */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Amount *
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
              type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"
            }`}
          />
          {/* Show error message if validation failed for this field */}
          {errors.amount && (
            <p className="text-red-500 text-xs mt-0.5">{errors.amount}</p>
          )}
        </div>

        {/* ── Note (Optional) ──
                    Free-text field for a short description of the transaction.
                    Sent as null to the backend if left empty. */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Fertilizer purchase"
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
          />
        </div>

        {/* ── Category Dropdown ──
                    Fetched from GET /expenses-categories on mount.
                    Shows a spinner while loading. */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Category *
          </label>
          {categoriesLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-1">
              <Spinner className="size-4" /> Loading...
            </div>
          ) : (
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
          {errors.category_id && (
            <p className="text-red-500 text-xs mt-0.5">{errors.category_id}</p>
          )}
        </div>

        {/* ── Farm Dropdown ──
                    Fetched from GET /farms on mount.
                    Selecting a farm triggers the Crop dropdown to reload with that farm's crops. */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Farm *
          </label>
          {farmsLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-1">
              <Spinner className="size-4" /> Loading...
            </div>
          ) : (
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)} // Triggers crop useEffect
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
            >
              <option value="">Select farm</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          )}
          {errors.farm_id && (
            <p className="text-red-500 text-xs mt-0.5">{errors.farm_id}</p>
          )}
        </div>

        {/* ── Crop Dropdown (Dynamic) ──
                    This is DEPENDENT on the Farm selection above.
                    - Before a farm is selected: disabled, shows "Select a farm first"
                    - After a farm is selected: fetches GET /crops?farm_id={id} and shows results
                    - If the farm changes: crops reset and re-fetch automatically */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Crop *
          </label>
          {cropsLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-1">
              <Spinner className="size-4" /> Loading crops...
            </div>
          ) : (
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              disabled={!selectedFarmId} // Disabled until a farm is picked
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
            >
              <option value="">
                {selectedFarmId ? "Select crop" : "Select a farm first"}
              </option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
          )}
          {errors.crop_id && (
            <p className="text-red-500 text-xs mt-0.5">{errors.crop_id}</p>
          )}
        </div>

        {/* ── Submit Button ──
                    - Color changes based on type: red for Expense, green for Income
                    - Shows "Saving..." while the API call is in progress
                    - Disabled while submitting to prevent duplicate submissions */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 mt-1 ${
            type === "income"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          } disabled:opacity-60`}
        >
          {submitting
            ? "Saving..."
            : `Add ${type === "income" ? "Income" : "Expense"}`}
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
