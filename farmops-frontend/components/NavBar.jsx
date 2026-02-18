"use client"

import { MyHook } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import React from 'react'

function NavBar() {

    const { authToken, logout } = MyHook();
    const router = useRouter();

    const handleLogout = () => {
        logout();
    }

  return (
    <div className='bg-transparent text-black px-5 w-full flex justify-between items-center'>
      <div className='text-3xl py-4'>FarmOps</div>
      <div className='flex gap-5 items-center font-bold bg-black text-white px-4 py-2 rounded-lg'>
        <div onClick={() => router.push('/')} className='cursor-pointer hover:scale-110'>Home</div>
        <div onClick={() => router.push('/listings')} className='cursor-pointer hover:scale-110'>Read</div>
        <div onClick={() => router.push('/dashboard')} className='cursor-pointer hover:scale-110'>My Space</div>
        {authToken ? (
          <div className='cursor-pointer hover:scale-110' onClick={handleLogout}>Logout</div>
        ) : (
          <div className='cursor-pointer hover:scale-110'>Login</div>
        )}
      </div>
    </div>
  )
}

export default NavBar
