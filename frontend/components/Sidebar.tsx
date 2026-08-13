"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Hosted zones", href: "/hosted-zones" },
    { name: "Traffic policies", href: "/traffic-policies" },
    { name: "Health checks", href: "/health-checks" },
    { name: "Resolver", href: "/profiles" },
    { name: "Profiles", href: "/profiles" },
  ];

  return (
    // Replaced h-full with h-[calc(100vh-57px)] below
    <aside className="w-64 bg-white dark:bg-[#162739] border-r border-gray-200 dark:border-[#131a22] flex flex-col h-[calc(100vh-57px)] transition-colors">
      <div className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Route 53
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-sm text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-[#1f3144] text-[#0073bb] dark:text-[#ff9900] font-bold border-l-4 border-[#0073bb] dark:border-[#ff9900]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1f3144]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}