"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Pause, PlayIcon, Search, SidebarCloseIcon, X } from 'lucide-react';
import { useRestrauntTables, useSessionCreation } from '@/app/hooks/access';
import { useLoginSession, useSelectedData } from '@/app/store/useAuth';
import { getMenu } from '@/app/hooks/access';
import { toast } from 'sonner';
import Image from 'next/image';
import Globe from '@/public/food.jpeg';

export interface TableInfo {
  table_id: string;
  table_number: string;
  table_name: string;
  capacity: string;
  occupied_slots: string;
  available_slots: string;
  status: string;
}

export interface MenuItemsTypes {
  stock_id: string;
  name: string;
  description: string;
  price: number;
  units: string;
  category_id: string;
  category_name: string;
}

export interface ServerInfo {
  status: string;  
  token: string;  
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
    store: string;
  };
  timestamp: string;
}


function Posdisplaypanem() {
  const { clearSelectedItems, selectedItems, setSelectedItems } = useSelectedData();
  const { users }= useLoginSession();

  const [processOrderModalOpen, setProcessOrderModalOpen] = useState(false);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemsTypes[]>([]);
  const [selectedServer, setSelectedServer] = useState('');
const [priority, setPriority] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [numGuests, setNumGuests] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [loading, setLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Fetch tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const res = await useRestrauntTables();
        if (res.status === "SUCCESS") {
          setTables(res.tables || []);
        }
      } catch (e) {
        console.error("Failed to fetch tables", e);
      }
    };
    fetchTables();
  }, []);

  // Fetch menu items for search
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getMenu();
        if (res.status === "SUCCESS" || res.status === 200) {
          setMenuItems(res.menu_items || []);
        }
      } catch (e) {
        console.error("Failed to load menu", e);
      }
    };
    fetchMenu();
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return menuItems
      .filter(
        (item) =>
          item.description.toLowerCase().includes(q) ||
          item.stock_id.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, menuItems]);

  const addItem = (item: MenuItemsTypes) => {
    setSelectedItems([...selectedItems, item]);
    toast.success(`${item.description} added`);
    setSearchQuery('');
    setShowResults(false);
  };

  // Item counts
  const itemCounts = useMemo(() => {
    const counts: Record<string, { item: MenuItemsTypes; count: number }> = {};
    selectedItems.forEach((it) => {
      if (counts[it.stock_id]) {
        counts[it.stock_id].count += 1;
      } else {
        counts[it.stock_id] = { item: it, count: 1 };
      }
    });
    return counts;
  }, [selectedItems]);

  const total = selectedItems.reduce((sum, i) => sum + i.price, 0).toFixed(2);

  const handleProcessOrder = async () => {
    if (!selectedTable || numGuests <= 0 || selectedItems.length === 0) {
      toast.error("Please select table, guests, and add items!");
      return;
    }

    try {
      setLoading(true);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const data = await useSessionCreation(selectedTable, numGuests, sessionType || undefined, remarks || undefined);

      if (data.status === "SUCCESS" || data.status_code === 200) {
        toast.success("Order Processed Successfully!");
        setProcessOrderModalOpen(false);
        // clearSelectedItems(); // Uncomment if you want to clear after order
      } else {
        toast.error("Failed to process order");
      }
    } catch (error) {
      toast.error("Error processing order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-1/2 gap-4 items-end">
      {/* Main Cart Panel */}
        <div className='border w-full rounded-lg py-3 h-164 border-black' >
        {/* Header + Search */}
        <div className="sticky top-0 bg-white border-b border-gray-300 p-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={clearSelectedItems}
              className="text-sm font-bold text-green-600 hover:underline"
            >
              Take New Order
            </button>
            <span className="text-sm font-bold text-red-600">Input code</span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search by name or code..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchQuery && (
              <X
                className="absolute right-3 top-3 h-4 w-4 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
              />
            )}

            {/* Dropdown Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.stock_id}
                    onClick={() => addItem(item)}
                    className="flex items-center gap-3 p-3 hover:bg-green-50 cursor-pointer border-b last:border-0"
                  >
                    <Image src={Globe} width={40} height={40} alt="" className="rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.description}</p>
                      <p className="text-xs text-gray-500">
                        {item.stock_id} • {item.units}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-green-600">Add</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Items List */}
        <div className="p-4 max-h-128 overflow-y-auto">
          <h3 className="font-bold text-lg mb-3">Selected Items ({selectedItems.length})</h3>
          {selectedItems.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No items added yet</p>
          ) : (
            <div className="space-y-3">
              {Object.values(itemCounts).map(({ item, count }) => (
                <div key={item.stock_id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Image src={Globe} width={48} height={48} alt="" className="rounded" />
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-600">
                        {count} × KSHs: {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const idx = selectedItems.findIndex(i => i.stock_id === item.stock_id);
                      if (idx > -1) {
                        setSelectedItems(selectedItems.filter((_, i) => i !== idx));
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Totals & Action Buttons */}
      <div className="w-[85%] bg-[#F6EFE7] border border-red-600/30 rounded-xl p-5 shadow">
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-green-600">KSHs: {total}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t">
            <span>Payable:</span>
            <span className="text-[#3A5750]">KSHs: {total}</span>
          </div>
        </div>

        <div className="flex gap-5 justify-between mt-4">
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
  className="flex-1 flex items-center justify-center gap-2 bg-[#086d59] py-2 
             font-semibold cursor-pointer text-white rounded-md shadow-sm
             hover:bg-[#077d66] active:scale-95 transition-all"
>
  <PlayIcon height={18} width={18} className="text-white" />
  Held Orders
</button>

    <button
      type="button"
      className="flex-1 bg-[#4B2E26] py-2 font-semibold text-white rounded-md 
                 shadow-sm cursor-pointer hover:bg-[#3a221d] active:scale-95 transition-all"
    >
      Clear Order
    </button>
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
          {users?.map((val:ServerInfo) => (
            <option key={val?.user?.id} value={val?.user?.id}>
              {val?.user?.name}
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
  );
}

export default Posdisplaypanem;