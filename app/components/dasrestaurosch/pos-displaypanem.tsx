"use client"
import React from 'react'
import { Pause } from 'lucide-react'
function Posdisplaypanem() {
  return (
    <div className='flex flex-col w-1/2 gap-4 items-end'>
    <div className='border w-full rounded-lg py-3 h-160 border-black'  >
        {/* Header */}
        <div className='sticky top-2 z-30 flex flex-col items-end'>
            <p className='text-sm text-right text-[#c9184a] font-bold mr-2'>Input code</p>
            <input type='text' className='w-[98%] py-2 bg-[#EDF6F9] placeholder-[#2D2D2D] text-[#2D2D2D] px-2 rounded-md border mx-2 border-black' placeholder='Search by item name or code'/>
        </div>
 </div>
{/* Control Section */}
<div className="w-[80%] bg-[#F6EFE7] border border-[#c9184a]/40 rounded-lg shadow-sm p-4 mt-4">

  {/* Totals */}
  <div className="space-y-3 mb-4">
    <div className="flex justify-between text-[#4B2E26]">
      <h4 className="font-semibold">Total:</h4>
      <span className="font-bold text-[#099c7f]">0.00</span>
    </div>

    <div className="flex justify-between text-[#4B2E26]">
      <h4 className="font-semibold">Discount Issued:</h4>
      <span className="font-bold text-[#c9184a]">0.00</span>
    </div>

    <div className="flex justify-between text-[#4B2E26] border-t border-black/20 pt-2">
      <h4 className="font-semibold">Total Payable:</h4>
      <span className="font-bold text-[#3A5750] text-lg">0.00</span>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex justify-between mt-4 gap-3">

    <button
      type="button"
      className="flex-1 bg-[#c9184a] py-2 font-semibold text-white rounded-md 
                 shadow-sm hover:bg-[#a3153e] active:scale-95 transition-all"
    >
      Place Order
    </button>

 <button
  type="button"
  className="flex-1 flex items-center justify-center gap-2 bg-[#099c7f] py-2 
             font-semibold text-white rounded-md shadow-sm
             hover:bg-[#077d66] active:scale-95 transition-all"
>
  <Pause height={18} width={18} className="text-white" />
  Hold Order
</button>


    <button
      type="button"
      className="flex-1 bg-[#4B2E26] py-2 font-semibold text-white rounded-md 
                 shadow-sm hover:bg-[#3a221d] active:scale-95 transition-all"
    >
      Clear Order
    </button>

  </div>
</div>

        </div>
  )
}

export default Posdisplaypanem