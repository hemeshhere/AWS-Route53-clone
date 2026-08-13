import Link from "next/link";
import { Activity, Plus } from "lucide-react";

export default function HealthChecksPage() {
  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal text-gray-900 mb-1">Health checks</h1>
          <p className="text-sm text-gray-500">
            Monitor the health and performance of your web applications, web servers, and other resources.
          </p>
        </div>
        <button className="bg-[#ec7211] hover:bg-[#eb5f07] text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors">
          Create health check
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-orange-50 text-[#ec7211] p-4 rounded-full mb-4">
          <Activity size={32} />
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">No health checks found</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          You have not created any health checks yet. Create a health check to monitor your endpoints and route traffic automatically based on health status.
        </p>
        <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-50 text-gray-900 font-bold text-sm py-1.5 px-4 rounded-sm transition-colors">
          <Plus size={16} />
          Create health check
        </button>
      </div>
    </div>
  );
}