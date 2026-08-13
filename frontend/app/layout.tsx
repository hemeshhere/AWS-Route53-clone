"use client";

import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  const isLoginPage = pathname === '/login';

  // Basic Route Protection: Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isLoginPage) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router, isLoginPage]);

  return (
    <html lang="en">
      <head>
        <title>Route 53 Clone</title>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#f2f3f3]`}>
        {/* Our new reusable Header */}
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Only show sidebar if we are NOT on the login page */}
          {!isLoginPage && <Sidebar />}

          <main className="flex-1 overflow-y-auto p-6 relative">
             {/* Prevent screen flashing while checking auth status */}
            {isChecking ? (
              <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
            ) : (
              children
            )}
          </main>
        </div>
      </body>
    </html>
  )
}