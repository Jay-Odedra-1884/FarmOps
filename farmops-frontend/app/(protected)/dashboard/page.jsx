"use client"
import { MyHook } from '@/context/AppProvider'
import React from 'react'

function page() {

  const { logout } = MyHook();
  
  const handleLogout = () => {
    logout();
  }
  return (
    <div>
      dashboard here!!!!!!!!
      <button onClick={handleLogout} className='bg-red-500 text-white px-2 py-1 rounded-sm mx-5 my-2 cursor-pointer'>Logout</button>
    </div>
  )
}

export default page
