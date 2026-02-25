"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MyHook } from "@/context/AppProvider";
import { getFarmById, updateFarm, deleteFarm } from "@/services/FarmApi";
import { addCrop, getCrop, updateCrop, deleteCrop } from "@/services/cropApi";
import { Spinner } from "@/components/ui/spinner";
import {
  MapPinIcon,
  SquaresSubtractIcon,
  ArrowLeftIcon,
  Trash2Icon,
  Edit2Icon,
  SproutIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";

function FarmDetailPage() {
  const { id: farmId } = useParams();
  const router = useRouter();
  const { authToken } = MyHook();

  // Farm state
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const editFormRef = useRef(null);
  const [farmErrors, setFarmErrors] = useState({});
  const [cropErrors, setCropErrors] = useState({});

  // Crops state
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(true);
  const [addCropName, setAddCropName] = useState("");
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  const [editingCropName, setEditingCropName] = useState("");
  const [deletingCropId, setDeletingCropId] = useState(null);

  useEffect(() => {
    if (authToken && farmId) {
      setLoading(true);
      getFarmById(authToken, farmId)
        .then((res) => {
          if (res.success) setFarm(res.data);
          else console.error(res.message);
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      setCropsLoading(true);
      getCrop(authToken, farmId)
        .then((res) => {
          if (res.success) setCrops(res.data);
        })
        .catch(console.error)
        .finally(() => setCropsLoading(false));
    }
  }, [authToken, farmId]);

  // Farm handlers
  const validateFarmForm = (data) => {
    const newErrors = {};
    if (!data.get("farmName")) newErrors.farmName = "Farm name is required";
    setFarmErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFarmEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(editFormRef.current);
    if (validateFarmForm(formData)) {
      const updateData = {
        name: formData.get("farmName"),
        location: formData.get("farmLocation") || null,
        size: formData.get("farmSize") || null,
      };
      const response = await updateFarm(authToken, farmId, updateData);
      if (response.success) {
        setFarm(response.data || { ...farm, ...updateData });
        setIsEditFormOpen(false);
        setFarmErrors({});
      }
    }
  };

  const handleDeleteFarm = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteFarm(authToken, farmId);
      if (response.success) router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

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
    }
    setDeletingCropId(null);
  };

  // ── Render ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center py-20">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">
          Farm not found or you don't have access.
        </p>
        <Link
          href="/dashboard"
          className="text-green-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-6">
      {/* Nav Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition mb-2"
      >
        <ArrowLeftIcon className="size-4" /> Back to Dashboard
      </Link>

      {/* Farm Header Card*/}
      <div className="w-full bg-white shadow rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Farm info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{farm.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-500 text-sm">
              {farm.location && (
                <p className="flex gap-1.5 items-center">
                  <MapPinIcon className="size-4 text-gray-400" />
                  {farm.location}
                </p>
              )}
              {farm.size && (
                <p className="flex gap-1.5 items-center">
                  <SquaresSubtractIcon className="size-4 text-gray-400" />
                  {farm.size} Acres
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 relative">
            {/* Edit Button */}
            <div className="relative w-1/2 md:w-auto">
              <button
                onClick={() => setIsEditFormOpen(!isEditFormOpen)}
                className="w-full bg-green-600 text-white hover:bg-green-700 hover:scale-105 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit2Icon className="size-4" /> Edit
              </button>

              {isEditFormOpen && (
                <div className="absolute right-0 top-full mt-3 w-[18rem] md:w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Edit Farm</h3>
                    <button
                      onClick={() => setIsEditFormOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <form
                    ref={editFormRef}
                    onSubmit={handleFarmEditSubmit}
                    className="flex flex-col space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        name="farmName"
                        defaultValue={farm.name}
                        placeholder="Farm name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                      {farmErrors.farmName && (
                        <p className="text-red-500 text-xs mt-1">
                          {farmErrors.farmName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Location (optional)
                      </label>
                      <input
                        type="text"
                        name="farmLocation"
                        defaultValue={farm.location || ""}
                        placeholder="Farm location"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Farm Size (optional)
                      </label>
                      <input
                        type="number"
                        name="farmSize"
                        defaultValue={farm.size || ""}
                        placeholder="Farm Size"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <div className="w-1/2 md:w-auto relative">
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="w-full bg-red-600 text-white hover:bg-red-700 hover:scale-105 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2Icon className="size-4" /> Delete
              </button>

              {deleteModalOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-sm text-gray-800 mb-4">
                    Are you sure you want to delete this farm? This action
                    cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteModalOpen(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteFarm}
                      disabled={isDeleting}
                      className="flex-1 bg-red-600 text-white py-1.5 rounded-lg text-sm hover:bg-red-700 transition disabled:bg-red-400"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="w-full h-24 text-black bg-white shadow rounded-2xl flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500">Expenses</p>
          <p className="text-red-500 text-2xl font-bold mt-1">₹0</p>
        </div>
        <div className="w-full h-24 text-black bg-white shadow rounded-2xl flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500">Income</p>
          <p className="text-green-500 text-2xl font-bold mt-1">₹0</p>
        </div>
        <div className="w-full h-24 text-black bg-white shadow rounded-2xl flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500">Profit</p>
          <p className="text-blue-500 text-2xl font-bold mt-1">₹0</p>
        </div>
      </div>

      {/* Crops Section */}
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

        {/* Crop list */}
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

export default FarmDetailPage;
