import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-sm shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4 text-[#0073bb]">
          <SearchX size={48} />
        </div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          We could not find the page you are looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link
          href="/"
          className="inline-block bg-[#ec7211] hover:bg-[#eb5f07] text-white font-bold text-sm py-1.5 px-4 rounded-sm transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}