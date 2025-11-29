"use client"
// components/dasrestaurosch/posmenu.tsx
import React from 'react';

import Kitchen from "@/public/kitchen.svg"
import Report from "@/public/report.svg"
import HomeIcon from "@/public/homeIcon.svg";
import Image from 'next/image';
import Link from 'next/link';
import Inventory from "@/public/inventory.svg"
import { usePathname,useRouter } from 'next/navigation';
import { useLoginSession } from '@/app/store/useAuth';
interface LandingPage {
  name: string;
  path: string;
  icon: string;
}


function Menu() {

  const {clearToken,clearUsers}= useLoginSession()
  const currentPath = usePathname()
  const router = useRouter()
  const displayPanel: LandingPage[] = [
    { name: "Sales Register", path: "/sales-register", icon: HomeIcon },
    { name: "Stock List", path: "/stock-list", icon: Inventory },
    { name: "Kitchen Display", path: "/kitchen-display", icon: Kitchen },
    { name: "Reports", path: "/reports", icon: Report },
  ];

  return (
    <div className="min-w-min bg-[#F6EFE7] border-b shadow-sm sticky top-0 z-50">
      <div className="overflow-x-auto whitespace-nowrap py-1 px-6">

       
        <div className="flex items-center justify-between min-w-max gap-8">
          {/* Left: Menu Items */}
           <div>
        <h5 className="text-[#c9184a] font-black text-2xl">Digisales Pos</h5>
        <p className='text-gray-900 text-sm'>Sand-Box</p>
      </div>
          <div className="flex items-center gap-8">
            {displayPanel.map((val) => (
            <Link
  href={val.path}
  key={val.name}
  className={`flex items-center gap-3 hover:text-[#c9184a] transition-colors whitespace-nowrap
    ${currentPath === val.path ? "text-[#099c7f] font-semibold" : "text-[#4B2E26]"}`}
>
                <Image
                  src={val.icon}
                  height={30}
                  width={30}
                  alt={val.name}
                  className="shrink-0"
                />
                <span className="text-sm font-medium">{val.name}</span>
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6 shrink-0 ml-12">
           <div className="flex items-center gap-6 shrink-0 ml-12">
  <Link
    href="/"
    onClick={() => {
      clearToken();
      clearUsers();
      localStorage.removeItem("login-session");
    }}
    className="text-red-600 hover:underline text-sm font-medium"
  >
    Log Out
  </Link>

  <Link
    
    onClick={() => {
      router.push("/")
      clearToken();
      clearUsers();
      localStorage.removeItem("login-session");
    }}
    
    href={process.env.NEXT_PUBLIC_EXIT_URL as string}
    className="text-gray-600 hover:underline text-sm font-medium"
  >
    Exit
  </Link>
</div>

          </div>
        </div>
      </div>

      {/* Optional: subtle scroll indicator */}
      <div className="h-1 bg-linear-to-r from-transparent via-gray-300 to-transparent opacity-30" />
    </div>
  );
}

export default Menu;