"use client"
import React from 'react'

function Posdisplaypanem() {
  return (
    <div className='w-1/2 border rounded-lg py-3 h-160 border-black'  >
        {/* Header */}
        <div className='sticky top-2 z-30 flex flex-col items-end'>
            <p className='text-sm text-right text-[#c9184a] font-bold mr-2'>Input code</p>
            <input type='text' className='w-[98%] py-2 bg-[#EDF6F9] placeholder-[#2D2D2D] text-[#2D2D2D] px-2 rounded-md border mx-2 border-black' placeholder='Search by item name or code'/>
        </div>
    </div>
  )
}

export default Posdisplaypanem