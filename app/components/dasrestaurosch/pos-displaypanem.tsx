"use client"
import React, { useEffect, useState } from 'react'
import { Pause ,SidebarCloseIcon} from 'lucide-react'
import { useRestrauntTables, useSessionCreation } from '@/app/hooks/access'
import { useLoginSession } from '@/app/store/useAuth'
import { toast } from 'sonner'

export interface TableInfo{
  table_id:string;
  table_number:string;
  table_name:string;
  capacity:string;
  occupied_slots:string;
  available_slots:string;
  status:string
}
function Posdisplaypanem() {
const {users} = useLoginSession()
  const [processOrderModalOpen, setProcessOrderModalOpen] = useState(false)
  const [tables, setTables] = useState<null | TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState('');
const [selectedServer, setSelectedServer] = useState('');
const [priority, setPriority] = useState('');
const [numGuests, setNumGuests] = useState(0);
const [remarks, setRemarks] = useState('');
const [sessionType, setSessionType] = useState('');
const [loading, setLoading] = useState(false)

const [sessionId, setsessionId] = useState("")




  useEffect(()=>{
    const fetchTables = async ()=> {
      try{
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const res = await useRestrauntTables()
if(res.status ==="SUCCESS"){
setTables(res.tables)
}
      }
      catch(e:any){
        console.log(e);
        
      }

    }

    fetchTables()
  },[])


  const handleProcessOrder = async () => {
  // if (!selectedTable || !selectedServer || !priority ) {
  //   toast.error("Please fill all required fields!");
  //   return;
  // }

const orderData = {
  tableId: selectedTable,
  serverId: selectedServer,
  priority,
  numGuests: numGuests ,
  remarks: remarks || undefined,
  sessionType: sessionType || undefined,
};

console.log("order:",orderData);

  try {
    setLoading(true)
    // Call your API or hook to create the session
    // eslint-disable-next-line react-hooks/rules-of-hooks
const data = await useSessionCreation(
  selectedTable,
  numGuests,
  orderData.sessionType,
  orderData.remarks
);

if (data.status === "SUCCESS" || data.status_code === 200) {
  toast.success("Order Processed Successfully!");
setsessionId(data.session_id)
  setSessionType("")
  setSelectedTable("")
  setRemarks("")
setSelectedServer("")
setPriority("")
setNumGuests(0)
} else {
  toast.error("Failed to process order!");
  console.log("Session creation error:", JSON.stringify(data, null, 2));
}



   
   



  
  } catch (error) {
    console.error("Error creating session:", error);
    toast.error("An unexpected error occurred!");
  }
  finally{
    setLoading(false)
  }

  console.log("Processing Order:", orderData);
};

  return (
    <div className='flex flex-col w-1/2 gap-1 items-end'>
    <div className='border w-full rounded-lg py-3 h-164 border-black'  >
        {/* Header */}
        <div className='stiSidebarCloseIconcky top-2 z-30 flex flex-col items-end'>
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
      onClick={()=>setProcessOrderModalOpen(true)}
      className="flex-1 bg-[#c9184a] py-2 font-semibold text-white rounded-md 
                 shadow-sm cursor-pointer hover:bg-[#a3153e] active:scale-95 transition-all"
    >
      Place Order
    </button>

 <button
  type="button"
  className="flex-1 flex items-center justify-center gap-2 bg-[#099c7f] py-2 
             font-semibold cursor-pointer text-white rounded-md shadow-sm
             hover:bg-[#077d66] active:scale-95 transition-all"
>
  <Pause height={18} width={18} className="text-white" />
  Hold Order
</button>


    <button
      type="button"
      className="flex-1 bg-[#4B2E26] py-2 font-semibold text-white rounded-md 
                 shadow-sm cursor-pointer hover:bg-[#3a221d] active:scale-95 transition-all"
    >
      Clear Order
    </button>

<span className='text-red-600 font-bold'>{sessionId}</span>
  </div>

 
</div>




      {/* Modal */}
{processOrderModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Background Blur */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setProcessOrderModalOpen(false)}
    />

    {/* Modal Box */}
    <div className="relative z-50 bg-[#F7F5EE] rounded-2xl shadow-2xl p-6 w-[400px] flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-bold text-[#1E3932] text-center">Process Order</h2>

      <div className="flex flex-col gap-3 w-full">
        {/* Table Select */}
        <label className="text-[#4B2E26] font-semibold">Select Table</label>
        <select
          className="w-full border border-[#1E3932]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#099c7f]"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Select Table to Serve</option>
          {tables?.map((val) => (
            <option key={val.table_id} value={val.table_id}>
              {val.table_name} - {val.table_number} - {val.status}
            </option>
          ))}
        </select>

        {/* Server Select */}
        <label className="text-[#4B2E26] font-semibold">Select Server</label>
        <select
          className="w-full border border-[#1E3932]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#099c7f]"
          value={selectedServer}
          onChange={(e) => setSelectedServer(e.target.value)}
        >
          <option value="">Select Server</option>
          {users?.map((val) => (
            <option key={val.id} value={val.id}>
              {val.name}
            </option>
          ))}
        </select>

        {/* Priority */}
        <label className="text-[#4B2E26] font-semibold">Select Priority</label>
        <select
          className="w-full border border-[#1E3932]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#099c7f]"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Select Priority</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
          <option value="vip">VIP / Special</option>
          <option value="takeaway">Takeaway</option>
          <option value="dine-in">Dine-in</option>
          <option value="delivery">Delivery</option>
          <option value="pre-order">Pre-Order</option>
        </select>

        {/* Number of Guests */}
        <label className="text-[#4B2E26] font-semibold">Number of Guests</label>
        <input
          type="number"
          min={0}
          placeholder="Number of guests"
          className="w-full border border-[#1E3932]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#099c7f]"
          value={numGuests}
          onChange={(e) => setNumGuests(Number(e.target.value))}
        />

        {/* Remarks */}
        <label className="text-[#4B2E26] font-semibold">Remarks</label>
        <input
          type="text"
          placeholder="Add remarks"
          className="w-full border border-[#1E3932]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#099c7f]"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {/* Session Type */}
        <label className="text-[#4B2E26] font-semibold">Select Session Type</label>
        <select
          className="w-full border border-[#1E3932]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#099c7f]"
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
        >
          <option value="">Select Session</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="happy_hour">Happy Hour</option>
          <option value="late_night">Late Night</option>
          <option value="special_event">Special Event</option>
          <option value="pre_order">Pre-Order</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 w-full mt-3">
        {/* Process Order */}
        <button
          type="button"
          disabled={loading}
          onClick={handleProcessOrder}
          className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] py-2 font-semibold text-[#1E3932] rounded-md shadow-md hover:bg-[#c9a034] active:scale-95 transition-all"
        >
          {loading? "Processing Order":"Process Order"}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => setProcessOrderModalOpen(false)}
          className="w-full flex items-center justify-center gap-2 bg-[#099c7f] py-2 font-semibold text-white rounded-md shadow-md hover:bg-[#077d66] active:scale-95 transition-all"
        >
          <SidebarCloseIcon height={18} width={18} className="text-white" />
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        </div>
  )
}

export default Posdisplaypanem

