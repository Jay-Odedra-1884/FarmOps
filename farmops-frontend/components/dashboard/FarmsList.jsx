"use client"

import React, { useEffect, useRef, useState } from 'react'
import { addFarm, getFarms } from '@/services/FarmApi';
import { MyHook } from '@/context/AppProvider';
import { Spinner } from '../ui/spinner';
import { MapPinIcon, SquaresSubtractIcon } from 'lucide-react';
import Link from 'next/link';

function FarmsList() {
    const { authToken } = MyHook();
    const [isAddFarmFormOpen, setIsAddFarmFormOpen] = useState(false);
    const [farms, setFarms] = useState([]);
    const farmFormRef = useRef(null);
    const [errors, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const validateFarmForm = (data) => {
        const newErrors = {};
        if (!data.get('farmName')) {
            newErrors.farmName = "Farm name is required";
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleFarmAddSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(farmFormRef.current)
        if (validateFarmForm(formData)) {
            const response = await addFarm(authToken, formData);
            console.log(response);

            if (response.success) {
                setIsAddFarmFormOpen(false);
                setFarms((prevFarms) => [...prevFarms, response.data]);
                setError({});
            }
        }
    }

    useEffect(() => {
        if (authToken) {
            setLoading(true);
            getFarms(authToken)
                .then((res) => {
                    if (res.success) {
                        setFarms(res.data);
                    }
                })
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        }
    }, [authToken])

    return (
        <div className="w-full h-full bg-white shadow rounded-2xl p-5">
            <div className="flex justify-between items-center relative">

                <h2 className="text-xl font-semibold">Farms</h2>

                {/* Button + Popup Wrapper */}
                <div className="relative">
                    <button
                        onClick={() => setIsAddFarmFormOpen(!isAddFarmFormOpen)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                    >
                        Add new farm
                    </button>

                    {/* Popup Form - farm add */}
                    {isAddFarmFormOpen && (
                        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">

                            <form ref={farmFormRef} onSubmit={handleFarmAddSubmit} className="flex flex-col space-y-3">

                                <div>
                                    <label className="text-sm text-gray-600">Farm name</label>
                                    <input
                                        type="text"
                                        name='farmName'
                                        placeholder="Farm name"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                    {errors.farmName && <p className="text-red-500 text-sm">{errors.farmName}</p>}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">
                                        Farm location (optional)
                                    </label>
                                    <input
                                        type="text"
                                        name='farmLocation'
                                        placeholder="Farm location"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">
                                        Farm Size (optional)
                                    </label>
                                    <input
                                        type="number"
                                        name='farmSize'
                                        placeholder="Farm Size"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Add farm
                                </button>

                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6">
                {loading ? (
                    <div className='w-full flex justify-center'>
                        <Spinner className='size-10' />
                    </div>
                ) : (
                    farms.length === 0 ? (
                        <p>No farms found</p>
                    ) : (
                        <div className="w-full flex flex-col gap-2">
                            {farms.map((farm) => (
                                <Link key={farm.id} href={`/dashboard/farm/${farm.id}`} className="w-full bg-gray-100 rounded-lg p-4 flex justify-between">
                                    <h3 className="text-lg font-semibold">{farm.name}</h3>
                                    <div className='text-center'>
                                        {farm.location && <p className='flex gap-1 items-center'><MapPinIcon className='size-4'/>{farm.location}</p>}
                                        {farm.size && <p className='flex gap-1 items-center'><SquaresSubtractIcon className='size-4'/>{farm.size} Acres</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default FarmsList
