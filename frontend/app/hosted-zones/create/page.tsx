"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function CreateHostedZonePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Public hosted zone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/hosted-zones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          type,
          private_zone: type === "Private hosted zone"
        })
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create hosted zone");
      }

      router.push("/hosted-zones");
    }  catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("An unexpected error occurred");
  }
} finally {
  setLoading(false);
}
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-gray-900 mb-1">Create hosted zone</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 flex items-center gap-2 text-sm rounded-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Hosted zone configuration</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Domain name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="example.com"
                className="w-full max-w-md border border-gray-400 p-2 text-sm focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none rounded-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full max-w-md border border-gray-400 p-2 text-sm focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none rounded-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Type
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="zoneType"
                    value="Public hosted zone"
                    checked={type === "Public hosted zone"}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 w-4 h-4 text-[#0073bb] focus:ring-[#0073bb]"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Public hosted zone</div>
                    <div className="text-sm text-gray-500">Determines how traffic is routed on the internet.</div>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="zoneType"
                    value="Private hosted zone"
                    checked={type === "Private hosted zone"}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 w-4 h-4 text-[#0073bb] focus:ring-[#0073bb]"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Private hosted zone</div>
                    <div className="text-sm text-gray-500">Determines how traffic is routed within Amazon VPCs.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/hosted-zones"
            className="border border-gray-400 hover:bg-gray-50 text-gray-900 font-bold text-sm py-1.5 px-4 rounded-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ec7211] hover:bg-[#eb5f07] text-white font-bold text-sm py-1.5 px-4 rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create hosted zone"}
          </button>
        </div>
      </form>
    </div>
  );
}