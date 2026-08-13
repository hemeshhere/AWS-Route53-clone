"use client"; // This tells Next.js this component uses browser features like localStorage

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  // When the header loads, check if we have user data saved in localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserName(JSON.parse(user).name);
    }
  }, []);

  const handleLogout = () => {
    // Clear our saved session data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <header className="bg-[#232f3e] text-white h-12 flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative">
      <div className="font-bold text-sm tracking-wide flex items-center gap-2">
        <span className="text-[#ff9900] text-lg">AWS</span>
        <span className="text-gray-100">Route 53</span>
      </div>
      
      {userName && (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-300">
            <User size={16} />
            <span>{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors border-l border-gray-600 pl-4"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}