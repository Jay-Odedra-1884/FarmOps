
import React from 'react'
import { ChartLineMultiple } from '@/components/ui/ChartLineMultiple'
import FarmsList from '@/components/dashboard/FarmsList';
function page() {


  return (
    <div className='h-screen w-full grid grid-cols-12'>
      <div className='md:hidden block absolute left-2 bg-green-500 p-2 rounded-lg mt-5'>|||</div>
      <div className="col-span-2 hidden md:block">
        <div className="bg-white rounded-2xl p-6 sticky top-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Add Transaction
          </h2>

          <form className="space-y-4">

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter Amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Note
              </label>
              <input
                type="text"
                placeholder="Write a note"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option>Select category</option>
                <option>Seed</option>
                <option>Fertilizer</option>
                <option>Pesticide</option>
                <option>Other</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Type
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option>Expense</option>
                <option>Income</option>
              </select>
            </div>

            {/* Farm */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Farm
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option>Select farm</option>
                <option>Farm 1</option>
                <option>Farm 2</option>
                <option>Farm 3</option>
              </select>
            </div>

            {/* Crop */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Crop
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option>Select Crop</option>
                <option>Crop 1</option>
                <option>Crop 2</option>
                <option>Crop 3</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-sm"
            >
              Add Transaction
            </button>

          </form>
        </div>
      </div>
      <div className='col-span-12 md:col-span-10 bg-gray-100  md:rounded-tl-4xl px-10'>
        {/* top info cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 py-10'>
          <div className='w-full h-28 text-black bg-white shadow-lg border border-white/20 rounded-2xl flex flex-col justify-center items-center'>
            <p className='text-xl font-semibold'>Expenses</p>
            <p className='text-red-500 text-xl font-semibold'>20000</p>
          </div>
          <div className='w-full h-28 text-black bg-white shadow-lg border border-white/20 rounded-2xl flex flex-col justify-center items-center'>
            <p className='text-xl font-semibold'>Income</p>
            <p className='text-green-500 text-xl font-semibold'>20000</p>
          </div>
          <div className='w-full h-28 text-black bg-white shadow-lg border border-white/20 rounded-2xl flex flex-col justify-center items-center'>
            <p className='text-xl font-semibold'>Profit</p>
            <p className='text-blue-500 text-xl font-semibold'>20000</p>
          </div>
        </div>
        {/* seconf line */}
        {/* farms list */}
        <div className='h-1/2 bg-transparent grid grid-cols-1 md:grid-cols-2 gap-2 shadow'>
          <FarmsList />
          {/* expenses */}
          <div className='bg-white rounded-2xl p-5'>
            <ChartLineMultiple />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page