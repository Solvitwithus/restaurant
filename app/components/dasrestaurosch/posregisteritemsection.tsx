"use client";
import { getMenu } from "@/app/hooks/access";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Globe from "@/public/food.jpeg";
import { useSelectedData } from "@/app/store/useAuth";
import { MenuItemsTypes } from "./pos-displaypanem";

const Posregisteritemsection = () => {
  const { setSelectedItems, selectedItems } = useSelectedData();
  const [menuItems, setMenuItems] = useState<MenuItemsTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  return (
    <div className="w-[49%] px-5 py-2 h-[90vh] border border-dotted border-[#c9184a]/50 overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search items..."
          className="w-64 border rounded-md px-3 py-2"
          // You can add search here too if you want
        />
        <Link href="/sales-register" className="text-[#099c7f] font-medium">
          Items
        </Link>
        <Link href="/stock-list" className="text-[#4B2E26] font-medium">
          Stock List
        </Link>
      </div>

      <div className="flex gap-6 h-full">
        {/* Categories */}
        <div className="w-[25%] border rounded-lg p-3 overflow-y-auto max-h-[78vh]">
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
          {!selectedCategory ? (
            <p className="text-center text-gray-500 mt-20">Select a category</p>
          ) : filteredItems.length === 0 ? (
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
                  <p className="text-xs text-gray-500 mt-1">KSHs: {item.price}</p>
                  <p className="text-xs text-gray-400">{item.units}</p>
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