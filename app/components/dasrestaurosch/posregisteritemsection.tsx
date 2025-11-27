"use client";
import Link from "next/link";
import React from "react";

const Posregisteritemsection = () => {

const mealCategory = [
  { id: 0, name: "Beverages" },
  { id: 1, name: "Main Course" },
  { id: 2, name: "Fast Foods" },
  { id: 3, name: "Breakfast" },
  { id: 4, name: "Desserts" },
  { id: 5, name: "Snacks" },
  { id: 6, name: "Soups" },
  { id: 7, name: "Salads" },
  { id: 8, name: "Grill & Barbecue" },
  { id: 9, name: "Seafood" },
  { id: 10, name: "Vegetarian Meals" },
  { id: 11, name: "Rice Dishes" },
  { id: 12, name: "Pasta" },
  { id: 13, name: "Pizza" },
  { id: 14, name: "Bakery" },
  { id: 15, name: "African Dishes" },
  { id: 16, name: "Kids Menu" },
  { id: 17, name: "Alcoholic Drinks" },
  { id: 18, name: "Hot Drinks" },
  { id: 19, name: "Cold Drinks" },
  { id: 20, name: "Breakfast" },
 

];

  return (
    <div className="w-[49%] p-1 h-[90vh] border border-black">

      {/* navigation section */}
      <div className="flex items-center gap-4 mb-3">
        <input
          type="text"
          className="w-48 border border-black rounded-md px-2 py-1"
          placeholder="search"
        />
        <Link href={"/stock-list"}>Items</Link>
        <Link href={"/"}>Item List</Link>
      </div>

      {/* category + items section */}
      <div className="flex gap-6">

        {/* Category section */}
        <div className="w-[25%] border min-h-[84vh] rounded-md  max-h-[84vh] overflow-y-auto border-black/20  p-2">
      {mealCategory.map((val) => (
<div
  key={val.id}
  className="text-sm bg-[#E6DED2] text-[#3A5750] py-2 px-3 rounded-md my-2 
             w-full overflow-hidden text-ellipsis whitespace-nowrap shadow-sm
             hover:bg-[#D8CFC2] cursor-pointer transition-all"
>
  {val.name}
</div>

))}


        </div>

        {/* Items section */}
        <div className="w-full border border-black p-2">
          Items
        </div>

      </div>
    </div>
  );
};

export default Posregisteritemsection;
