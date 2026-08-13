"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-[#232f3e] text-white flex items-center justify-between px-4 py-2 border-b border-[#131a22]">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
          <span className="text-[#ff9900] font-bold text-xl">AWS</span>
          <span className="font-medium text-lg tracking-wide">Route 53</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-1 hover:bg-[#131a22] p-1.5 rounded-sm transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
        
        <div className="flex items-center gap-1 hover:bg-[#131a22] px-2 py-1.5 rounded-sm cursor-pointer transition-colors">
          <User size={16} />
          <span>AWS Admin</span>
        </div>
        <div className="w-px h-5 bg-gray-500 mx-1"></div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 hover:bg-[#131a22] px-2 py-1.5 rounded-sm transition-colors text-gray-300 hover:text-white"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}