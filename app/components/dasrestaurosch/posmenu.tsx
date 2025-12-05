"use client"
// components/dasrestaurosch/posmenu.tsx
// das restaurosch is actually german to mean the hotel, das is one of the killer articles of german. now read the comment to understand the basic map function that your lazy lecture never bothered to explain!!!!!


/**
 * =============================================================================
 * POS Top Navigation Menu Bar
 * =============================================================================
 *
 * @file components/dasrestaurosch/posmenu.tsx
 * @author John Kamiru Mwangi
 *@date Dec3 2025
 * @description
 *   Sticky top navigation bar used across the DigiSales POS application.
 *   Provides quick access to core modules and system actions (Logout / Exit).
 *
 *   This component appears on every authenticated POS page and serves as the
 *   primary navigation hub for cashiers, managers, and kitchen staff.
 *
 * @features
 *   • Horizontal scrolling menu (mobile-friendly)
 *   • Active route highlighting with distinct color (#099c7f)
 *   • SVG icon + label for each module
 *   • Clean logout with full session cleanup
 *   • Graceful "Exit" action redirecting to external landing/homepage
 *   • Sticky positioning with subtle bottom shadow and scroll indicator
 *
 * @navigationItems
 *   - Sales Register     → /sales-register      (Main POS interface)
 *   - Stock List         → /stock-list          (Inventory overview)
 *   - Kitchen Display    → /kitchen-display     (KDS for cooks)
 *   - Reports            → /reports             (Sales, shifts, analytics)
 *
 * @keyHooks
 *   - usePathname()      → Detects current route for active styling
 *   - useRouter()        → Programmatic navigation (used in Exit)
 *   - useLoginSession()  → Access to clearToken() & clearUsers() for secure logout
 *
 * @securityNotes
 *   • Logout: clears Zustand store + removes localStorage "login-session"
 *   • Exit:   redirects to external URL defined in .env (NEXT_PUBLIC_EXIT_URL)
 *             useful for kiosk mode or embedded systems
 *
 * @stylingHighlights
 *   • Fully responsive: works on tablets and narrow screens via overflow-x-auto
 *   • Color scheme follows brand:
 *        - Primary accent:   #c9184a  (error/red)
 *        - Success/active:   #099c7f
 *        - Neutral text:     #4B2E26
 *        - Background:       #F6EFE7 (warm off-white)
 *
 * @futureImprovements / TODOs
 *   • Add user avatar + dropdown (profile, switch user, settings)
 *   • Role-based menu filtering (e.g., hide Reports for cashiers)
 *   • Notifications bell with badge (new orders, low stock alerts)
 *   • Shift status indicator (e.g., "Shift Active – John Doe")
 *   • Dark mode toggle
 *   • Keyboard navigation support (arrow keys + Enter)
 *   • Animate active indicator underline
 *
 * @environmentVariables
 *   NEXT_PUBLIC_EXIT_URL → Full URL to redirect on "Exit" (e.g., company homepage or kiosk lobby)
 *
 * =============================================================================
 */

import React from 'react';

import Kitchen from "@/public/kitchen.svg"
import Report from "@/public/report.svg"
import HomeIcon from "@/public/homeIcon.svg";
import Image from 'next/image';
import Link from 'next/link';

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
    { name: "Menu List", path: "/stock-list", icon: Kitchen },
   
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