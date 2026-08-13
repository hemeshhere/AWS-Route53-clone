"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname(); // Tells us what page we are currently on

  // List of all our Route53 navigation links
  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Hosted zones", href: "/hosted-zones" },
    { name: "Traffic policies", href: "/traffic-policies" },
    { name: "Health checks", href: "/health-checks" },
    { name: "Resolver", href: "/resolver" },
    { name: "Profiles", href: "/profiles" },
  ];

  return (
    <aside className="w-56 bg-white border-r border-gray-200 hidden md:block shrink-0 overflow-y-auto">
      <nav className="p-4 space-y-1">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
          Route 53
        </div>
        
        {navItems.map((item) => {
          // Check if this link is the currently active page
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-2 py-1.5 text-sm rounded-sm ${
                isActive
                  ? "text-[#0073bb] font-bold border-l-2 border-[#0073bb] bg-[#f2f8fd] -ml-[2px]" 
                  : "text-gray-700 hover:text-[#0073bb] hover:bg-gray-50"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}