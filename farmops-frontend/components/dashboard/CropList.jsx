"use client";

import {
  CheckIcon,
  Edit2Icon,
  PlusIcon,
  SproutIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { addCrop, deleteCrop, getCrop, updateCrop } from "@/services/cropApi";
import { MyHook } from "@/context/AppProvider";

function CropList({ farmId, onDataChange }) {
  const { authToken, notifyExpenseChange, notifyFarmChange } = MyHook();
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(true);
  const [addCropName, setAddCropName] = useState("");
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  const [editingCropName, setEditingCropName] = useState("");
  const [deletingCropId, setDeletingCropId] = useState(null);
  const [cropErrors, setCropErrors] = useState({});

  useEffect(() => {
    setCropsLoading(true);
    getCrop(authToken, farmId)
      .then((res) => {
        if (res.success) setCrops(res.data);
      })
      .catch(console.error)
      .finally(() => setCropsLoading(false));
  }, [authToken, farmId]);

  // Crop handlers
  const validateCropForm = () => {
    const newErrors = {};
    if (!addCropName.trim()) newErrors.cropName = "Crop name is required";
    setCropErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    if (validateCropForm()) {
      setIsAddingCrop(true);
      const res = await addCrop(authToken, {
        name: addCropName.trim(),
        farm_id: farmId,
      });
      if (res?.success) {
        setCrops((prev) => [...prev, res.data]);
        setAddCropName("");
        notifyFarmChange(); // new crop → AddTransactionForm crop dropdown re-fetches
      }
    }
    setIsAddingCrop(false);
  };

  const handleStartEditCrop = (crop) => {
    setEditingCropId(crop.id);
    setEditingCropName(crop.name);
  };

  const handleCancelEditCrop = () => {
    setEditingCropId(null);
    setEditingCropName("");
  };

  const handleSaveEditCrop = async (cropId) => {
    if (!editingCropName.trim()) return;
    const res = await updateCrop(
      authToken,
      { name: editingCropName.trim() },
      cropId,
    );
    if (res?.success) {
      setCrops((prev) =>
        prev.map((c) =>
          c.id === cropId ? { ...c, name: editingCropName.trim() } : c,
        ),
      );
    }
    setEditingCropId(null);
    setEditingCropName("");
  };

  const handleDeleteCrop = async (cropId) => {
    setDeletingCropId(cropId);
    const res = await deleteCrop(authToken, cropId);
    if (res?.success) {
      setCrops((prev) => prev.filter((c) => c.id !== cropId));
      notifyExpenseChange(); // cascade deletes expenses → reload ExpenseList & stats
      notifyFarmChange(); // crop removed → AddTransactionForm crop dropdown re-fetches
    }
    setDeletingCropId(null);
  };

  return (
    <div>
      <div className="w-full bg-white shadow rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <SproutIcon className="size-5 text-green-600" /> Crops
          </h2>

          {/* Add crop inline form */}
          <form onSubmit={handleAddCrop} className="flex items-center gap-0">
            <input
              type="text"
              value={addCropName}
              onChange={(e) => setAddCropName(e.target.value)}
              placeholder={
                cropErrors.cropName ? cropErrors.cropName : "New crop name..."
              }
              className={`border border-gray-300 border-r-0 rounded-l-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${cropErrors.cropName ? "border-red-500 text-red-500" : ""}`}
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1.5 border border-green-600 rounded-r-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer flex items-center gap-1"
            >
              <PlusIcon className="size-4" />
              {isAddingCrop ? "Adding..." : "Add"}
            </button>
          </form>
        </div>

        <hr className="border-gray-100 mb-4" />
        {cropsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-8" />
          </div>
        ) : crops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <SproutIcon className="size-10 mb-3 text-gray-300" />
            <p className="text-sm">
              No crops added yet. Add your first crop above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-150 hover:bg-gray-100"
              >
                {/* Crop name / edit input */}
                {editingCropId === crop.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editingCropName}
                    onChange={(e) => setEditingCropName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEditCrop(crop.id);
                      if (e.key === "Escape") handleCancelEditCrop();
                    }}
                    className="flex-1 bg-white border border-green-400 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mr-3"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <SproutIcon className="size-4 text-green-500" />
                    <span className="font-medium text-gray-800">
                      {crop.name}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {editingCropId === crop.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEditCrop(crop.id)}
                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                        title="Save"
                      >
                        <CheckIcon className="size-4" />
                      </button>
                      <button
                        onClick={handleCancelEditCrop}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                        title="Cancel"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEditCrop(crop)}
                        className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition"
                        title="Edit crop"
                      >
                        <Edit2Icon className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCrop(crop.id)}
                        disabled={deletingCropId === crop.id}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition disabled:opacity-40"
                        title="Delete crop"
                      >
                        {deletingCropId === crop.id ? (
                          <Spinner className="size-3.5" />
                        ) : (
                          <Trash2Icon className="size-3.5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CropList;
