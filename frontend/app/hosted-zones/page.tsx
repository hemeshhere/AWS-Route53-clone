"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface HostedZone {
  id: number;
  name: string;
  zone_id: string;
  type: string;
  description: string;
  record_count: number;
}

export default function HostedZonesPage() {
  const router = useRouter();
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchZones = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hosted-zones?search=${searchQuery}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch hosted zones");
      }

      const data = await response.json();
      setZones(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-gray-900 mb-1">Hosted zones</h1>
        <p className="text-sm text-gray-500">
          Hosted zones define how Route 53 responds to DNS queries for a domain.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
        
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-900">Hosted zones ({zones.length})</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={fetchZones}
              className="p-1.5 border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <Link 
              href="/hosted-zones/create"
              className="bg-[#ec7211] hover:bg-[#eb5f07] text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors"
            >
              Create hosted zone
            </Link>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Find hosted zones by domain name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 border border-gray-400 rounded-sm text-sm focus:ring-[#0073bb] focus:border-[#0073bb] outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 border-b border-gray-200 bg-red-50 text-red-700 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-3 w-8"></th>
                <th className="p-3">Domain name</th>
                <th className="p-3">Hosted zone ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Record count</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Loading hosted zones...
                  </td>
                </tr>
              ) : filteredZones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    {zones.length === 0 ? "No hosted zones found." : "No zones match your search."}
                  </td>
                </tr>
              ) : (
                filteredZones.map((zone) => (
                  <tr key={zone.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-center">
                      <input type="radio" name="zone-select" className="w-3.5 h-3.5 text-[#0073bb] focus:ring-[#0073bb]" />
                    </td>
                    <td className="p-3">
                      <Link href={`/hosted-zones/${zone.id}`} className="text-[#0073bb] hover:underline font-medium">
                        {zone.name}
                      </Link>
                    </td>
                    <td className="p-3 font-mono text-xs">{zone.zone_id}</td>
                    <td className="p-3">{zone.type}</td>
                    <td className="p-3">{zone.record_count}</td>
                    <td className="p-3 text-gray-500 truncate max-w-xs">{zone.description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}