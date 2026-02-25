import React from 'react'
import { ChartLineMultiple } from '@/components/ui/ChartLineMultiple'
import FarmsList from '@/components/dashboard/FarmsList';

function page() {
  return (
    <div>
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

      {/* farms list + chart */}
      <div className='xl:h-[600px] grid grid-cols-1 xl:grid-cols-2 gap-4'>
        <div className='overflow-auto'>
          <FarmsList />
        </div>
        {/* expenses chart */}
        <div className='h-full bg-white rounded-2xl p-5'>
          <ChartLineMultiple />
        </div>
      </div>
    </div>
  )
}

export default page