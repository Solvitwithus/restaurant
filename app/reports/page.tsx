import React from 'react'
import Menu from '../components/dasrestaurosch/posmenu'

function page() {
  return (
     <div className="min-h-screen overflow-y-auto min-w-min bg-[#F7F5EE]">
      <Menu />
      <h2>held orders history</h2>
       <h2>POS transactions</h2>
        <h2>Payments aggregates</h2>

     </div>
  )
}

export default page