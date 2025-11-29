"use client";
import { getMenu } from "@/app/hooks/access";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Globe from "@/public/food.jpeg"
export interface MenuItemsTypes {
  stock_id: string;
  name: string;
  description: string;
  price: number;
  units: string;
  category_id: string;
  category_name: string;
}

const Posregisteritemsection = () => {
  const [menuItems, setMenuItems] = useState<MenuItemsTypes[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await getMenu();

        if (response.status === "SUCCESS" || response.status == 200) {
          setMenuItems(response.menu_items);
        } else {
          toast.error("Error Fetching Menu Items. Please check your internet connection!");
        }
      } catch (e: unknown) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Unique category list
  const uniqueCategories = Array.from(
    new Map(menuItems.map((item) => [item.category_id, item])).values()
  );

  // Filter items for selected category
  const filteredItems = selectedCategory
    ? menuItems.filter((i) => i.category_id === selectedCategory)
    : [];

  return (
    <div className="w-[49%] px-5 py-2 h-[90vh] border border-dotted border-[#c9184a]/50">

      {/* navigation section */}
      <div className="flex items-center gap-4 mb-3">
        <input
          type="text"
          className="w-48 border border-black rounded-md px-2 py-1"
          placeholder="search"
        />
        <Link href={"/sales-register"} className="text-[#099c7f] font-medium text-sm">Items</Link>
        <Link href={"/stock-list"} className="text-[#4B2E26] font-medium text-sm">Item List</Link>
      </div>

      {/* category + items */}
      <div className="flex gap-6">

        {/* Category section */}
        <div className="w-[25%] border min-h-[84vh] rounded-md max-h-[84vh] overflow-y-auto border-black/20 p-2">

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-6 w-6 border-2 border-[#3A5750] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            uniqueCategories.map((cat) => (
              <div
                key={cat.category_id}
                onClick={() => setSelectedCategory(cat.category_id)}
                className={`text-sm py-2 px-3 rounded-md my-2 cursor-pointer transition-all 
                  ${
                    selectedCategory === cat.category_id
                      ? "bg-[#3A5750] text-white"
                      : "bg-[#E6DED2] text-[#3A5750] hover:bg-[#D8CFC2]"
                  }`}
              >
                {cat.category_name}
              </div>
            ))
          )}

        </div>

        {/* Items section */}
        <div className="w-full border border-black/10 rounded-md p-2 min-h-[84vh] overflow-y-auto">

          {selectedCategory === "" ? (
            <p className="text-center text-gray-500 mt-10">Select a category to view items</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No items found in this category</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.stock_id}
                  className="bg-white shadow-md rounded-md p-2 flex flex-col items-center hover:shadow-lg transition"
                >
                  {/* Dummy Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center mb-2">
<Image
  width={80}
  height={80}
  src={Globe}
  alt="item"
  className="w-full h-full object-cover rounded-md"
/>


                  </div>

                  <p className="text-sm font-semibold text-gray-800">{item.description}</p>
                  <p className="text-xs text-gray-500">{item.units}</p>
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
