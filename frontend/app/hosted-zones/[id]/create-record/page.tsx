"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function CreateRecordPage() {
  const router = useRouter();
  const params = useParams();
  
  const [zoneName, setZoneName] = useState("");
  const [recordName, setRecordName] = useState("");
  const [type, setType] = useState("A");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState(300);
  const [routingPolicy, setRoutingPolicy] = useState("Simple");
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchZone = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hosted-zones/${params.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch zone details");
        
        const data = await response.json();
        setZoneName(data.name);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    if (params.id) fetchZone();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const fullRecordName = recordName ? `${recordName}.${zoneName}` : zoneName;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hosted-zones/${params.id}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: fullRecordName,
          type,
          value,
          ttl: Number(ttl),
          routing_policy: routingPolicy
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create record");
      }

      router.push(`/hosted-zones/${params.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="p-8 text-center text-gray-500">Loading form...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-gray-900 mb-1">Create record</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 flex items-center gap-2 text-sm rounded-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Record details</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Record name
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={recordName}
                    onChange={(e) => setRecordName(e.target.value)}
                    placeholder="www"
                    className="w-full max-w-[200px] border border-gray-400 p-2 text-sm focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none rounded-l-sm"
                  />
                  <div className="bg-gray-100 border border-l-0 border-gray-400 p-2 text-sm text-gray-600 rounded-r-sm truncate max-w-[200px]">
                    .{zoneName}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave blank to create a record at the zone apex.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Record type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-400 p-2 text-sm focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none rounded-sm bg-white"
                >
                  <option value="A">A - Routes traffic to an IPv4 address and some AWS resources</option>
                  <option value="AAAA">AAAA - Routes traffic to an IPv6 address and some AWS resources</option>
                  <option value="CNAME">CNAME - Routes traffic to another domain name and to some AWS resources</option>
                  <option value="TXT">TXT - Routes traffic to text records</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Value <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={3}
                  placeholder="Enter IP address or target domain"
                  className="w-full border border-gray-400 p-2 text-sm focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none rounded-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  TTL (seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  value={ttl}
                  onChange={(e) => setTtl(Number(e.target.value))}
                  className="w-32 border border-gray-400 p-2 text-sm focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none rounded-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Routing policy
                </label>
                <select
                  value={routingPolicy}
                  onChange={(e) => setRoutingPolicy(e.target.value)}
                  className="w-full border border-gray-400 p-2 text-sm focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none rounded-sm bg-white"
                >
                  <option value="Simple">Simple routing</option>
                  <option value="Weighted">Weighted routing</option>
                  <option value="Geolocation">Geolocation routing</option>
                  <option value="Latency">Latency routing</option>
                  <option value="Failover">Failover routing</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/hosted-zones/${params.id}`}
            className="border border-gray-400 hover:bg-gray-50 text-gray-900 font-bold text-sm py-1.5 px-4 rounded-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ec7211] hover:bg-[#eb5f07] text-white font-bold text-sm py-1.5 px-4 rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create records"}
          </button>
        </div>
      </form>
    </div>
  );
}