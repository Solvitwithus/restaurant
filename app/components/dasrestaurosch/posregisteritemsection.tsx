"use client";

/**
 * =============================================================================
 * Item Inventory Overview (Stock List Page)
 * =============================================================================
 *
 * @file components/dasrestaurosch/ItemInventory.tsx (or similar)
 * @author John Kamiru Mwangi
 * @created 2025-12-03
 * @lastUpdated 2025-12-03
 *
 * @description
 *   Full-screen inventory/stock list view used in the POS module under
 *   "Stock List" navigation item. Displays every menu item available in the
 *   system with real-time search, sort, and manual refresh capabilities.
 *
 *   This component is primarily read-only and serves cashiers, managers,
 *   and kitchen staff who need quick reference to item names, prices,
 *   categories, units, and stock codes.
 *
 * @features
 *   • Live search by item description (case-insensitive)
 *   • Sort by name (alphabetical) or price (low → high)
 *   • Manual refresh button with loading skeletons
 *   • Responsive table layout (mobile → desktop)
 *   • Loading state with animated pulse placeholders
 *   • Empty state handling
 *   • Toast notifications on fetch errors
 *
 * @dataSource
 *   getMenu() → /app/hooks/access.ts
 *   Fetches the complete menu via tp=get_menu from the legacy backend.
 *
 * @keyHooks & Dependencies
 *   - React useState     → local UI state (search, sort, loading)
 *   - React useEffect    → initial data fetch on mount
 *   - React useMemo      → performant filtering + sorting
 *   - sonner toast       → user feedback
 *   - lucide-react icons → modern, lightweight UI icons
 *
 * @stylingNotes
 *   • Brand-consistent colors:
 *        – Primary accent:  #099c7f
 *        – Text / headings: #4B2E26
 *        – Backgrounds:     #F7F5EE / white
 *   • Hover states and subtle transitions for better UX
 *   • Mobile-first table with horizontal scroll on small screens
 *
 * @futureImprovements / TODOs
 *   • Add pagination or virtualized scrolling for 500+ items
 *   • Export to CSV / PDF button
 *   • Show item image thumbnails (when available)
 *   • Low-stock highlighting (if quantity field is added to backend)
 *   • Column visibility toggle
 *   • Click row → quick add to cart (for fast re-ordering)
 *   • Debounced search input
 *   • Cache menu with TanStack Query for offline resilience
 *
 * @notes
 *   - Prices are displayed in KSH (Kenyan Shillings)
 *   - This page is intentionally lightweight – no heavy dependencies
 *   - Menu data is shared with the POS cart search – keep MenuItemsTypes in sync
 *
 * =============================================================================
 */
import { getMenu } from "@/app/hooks/access";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Globe from "@/public/food.jpeg";
import { useSelectedData } from "@/app/store/useAuth";
import { MenuItemsTypes } from "./pos-displaypanem";
import { Query } from "pg";


const Posregisteritemsection = () => {
  const { setSelectedItems, selectedItems } = useSelectedData();
  const [menuItems, setMenuItems] = useState<MenuItemsTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
const [query, setQuery] = useState<string>("")
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await getMenu();
        if (response.status === "SUCCESS" || response.status === 200) {
          setMenuItems(response.menu_items || []);
        } else {
          toast.error("Failed to load menu");
        }
      } catch (e) {
        toast.error("Network error");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const uniqueCategories = Array.from(
    new Map(menuItems.map((item) => [item.category_id, item])).values()
  );

  const filteredItems = selectedCategory
    ? menuItems.filter((i) => i.category_id === selectedCategory)
    : menuItems;

  const addItem = (item: MenuItemsTypes) => {
    setSelectedItems([...selectedItems, item]);
    toast.success(`${item.description} from category ${item.category_name} added`);
  };

  const findCategoryforItem = menuItems.filter((val) =>
  val.description.toLowerCase().includes(query.toLowerCase())
);


  return (
    <div className="w-[49%] px-5 py-2 h-[90vh] border border-dotted border-[#c9184a]/50 overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={query}
          className="w-64 border rounded-md px-3 py-2"
          onChange={(e)=>setQuery(e.target.value)}
          // You can add search here too if you want
        />

       
       
        <Link href="/sales-register" className="text-[#099c7f] font-medium">
          Items
        </Link>
        <Link href="/stock-list" className="text-[#4B2E26] font-medium">
          Stock List
        </Link>
        
      </div>

      <div className="flex gap-6 max-h-[82vh] min-h-[82vh]">
        {/* Categories */}
        <div className="w-[25%] border rounded-lg p-3 overflow-y-auto max-h-[82vh]">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-[#099c7f] border-t-transparent rounded-full"></div>
            </div>
          ) : (
          
            
            uniqueCategories.map((cat) => (
              <div
                key={cat.category_id}
                onClick={() => setSelectedCategory(cat.category_id)}
                className={`p-3 rounded-lg cursor-pointer text-sm font-medium mb-2 transition
                  ${selectedCategory === cat.category_id
                    ? "bg-[#3A5750] text-white"
                    : "bg-[#E6DED2] hover:bg-[#D8CFC2]"
                  }`}
              >
                {cat.category_name}
              </div>
            ))
          )}
        </div>

        {/* Items Grid */}
        <div className="flex-1 border rounded-lg p-4 overflow-y-auto">


         {/* Search Results */}
{query && findCategoryforItem.length > 0 && (
  <ul className="mb-4">
    {findCategoryforItem.map((item) => (
      <li key={item.stock_id}>
        item <span className="font-semibold">{item.description}</span> — falls in category: <span className="font-semibold">{item.category_name}</span>
      </li>
    ))}
  </ul>
)}

{/* No matches */}
{query && findCategoryforItem.length === 0 && (
  <p className="text-gray-500 mt-2">No items found</p>
)}

          {!selectedCategory ? (
            <>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="bg-[#F7F5EE]/30 rounded-xl shadow-md p-4 flex flex-col items-center animate-pulse hover:scale-105 transition-transform"
      >
        <div className="w-20 h-20 rounded-full bg-gray-300/40 mb-3"></div>
        <div className="h-3 w-24 bg-gray-300/50 rounded mb-2"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>



  <div className="text-center mt-4 text-black font-medium">
    Select category to proceed
  </div>
</>

) 
 : filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">No items in this category</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.stock_id}
                  onClick={() => addItem(item)}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer p-3 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded overflow-hidden">
                    <Image
                      src={Globe}
                      alt={item.description}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="font-semibold text-sm line-clamp-2">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">KES: {item.price} /=</p>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posregisteritemsection;