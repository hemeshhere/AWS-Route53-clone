"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Server, Activity } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [zoneCount, setZoneCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:8000/api/hosted-zones", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setZoneCount(data.length);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-gray-900 mb-1">Route 53 Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your domain name system (DNS) and routing traffic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-[#0073bb] rounded-md">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Hosted Zones</h3>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "-" : zoneCount}
            </div>
            <Link href="/hosted-zones" className="text-[#0073bb] hover:underline text-sm mt-2 inline-block">
              View hosted zones
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-md">
            <Server size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">DNS Queries</h3>
            <div className="text-2xl font-bold text-gray-900 mt-1">100%</div>
            <span className="text-gray-500 text-sm mt-2 inline-block">
              System operational
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex items-start gap-4">
          <div className="p-3 bg-orange-50 text-[#ec7211] rounded-md">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Health Checks</h3>
            <div className="text-2xl font-bold text-gray-900 mt-1">0</div>
            <span className="text-gray-500 text-sm mt-2 inline-block">
              No active alarms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}