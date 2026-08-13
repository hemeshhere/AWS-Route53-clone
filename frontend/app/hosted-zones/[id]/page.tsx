"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Trash2 } from "lucide-react";

interface HostedZone {
  id: number;
  name: string;
  zone_id: string;
  type: string;
  description: string;
  record_count: number;
}

interface DNSRecord {
  id: number;
  name: string;
  type: string;
  value: string;
  ttl: number;
  routing_policy: string;
}

export default function HostedZoneDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const zoneRes = await fetch(`http://localhost:8000/api/hosted-zones/${params.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (zoneRes.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!zoneRes.ok) throw new Error("Failed to fetch hosted zone details");
      const zoneData = await zoneRes.json();
      setZone(zoneData);

      const recordsRes = await fetch(`http://localhost:8000/api/hosted-zones/${params.id}/records`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!recordsRes.ok) throw new Error("Failed to fetch DNS records");
      const recordsData = await recordsRes.json();
      setRecords(recordsData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id, fetchData]);

  const handleDeleteRecord = async (recordId: number) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/hosted-zones/${params.id}/records/${recordId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to delete record");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  }

  if (error || !zone) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 flex items-center gap-2 text-sm rounded-sm">
          <AlertCircle size={16} />
          {error || "Hosted zone not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-4">
        <Link href="/hosted-zones" className="text-[#0073bb] hover:underline text-sm flex items-center gap-1 w-fit">
          <ArrowLeft size={16} />
          Hosted zones
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-normal text-gray-900">{zone.name}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Hosted zone details</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Domain name</div>
            <div className="text-sm text-gray-900">{zone.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Hosted zone ID</div>
            <div className="text-sm text-gray-900 font-mono">{zone.zone_id}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Type</div>
            <div className="text-sm text-gray-900">{zone.type}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-900">{zone.description || "-"}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900">Records ({records.length})</h2>
          <Link
            href={`/hosted-zones/${zone.id}/create-record`}
            className="bg-[#ec7211] hover:bg-[#eb5f07] text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors"
          >
            Create record
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-3 w-8"></th>
                <th className="p-3">Record name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Routing policy</th>
                <th className="p-3">Value/Route traffic to</th>
                <th className="p-3">TTL (seconds)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-center">
                      <input type="radio" name="record-select" className="w-3.5 h-3.5 text-[#0073bb] focus:ring-[#0073bb]" />
                    </td>
                    <td className="p-3 font-medium text-[#0073bb]">{record.name}</td>
                    <td className="p-3">{record.type}</td>
                    <td className="p-3">{record.routing_policy}</td>
                    <td className="p-3 truncate max-w-xs">{record.value}</td>
                    <td className="p-3">{record.ttl}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
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