"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app, you would log this to a service like Sentry or Datadog
    console.error("Caught by global error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-sm shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4 text-red-600">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          An unexpected error occurred
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          We are sorry, but something went wrong. Our systems have logged the issue and we are investigating.
        </p>
        
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="border border-gray-400 hover:bg-gray-50 text-gray-900 font-bold text-sm py-1.5 px-4 rounded-sm transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-[#ec7211] hover:bg-[#eb5f07] text-white font-bold text-sm py-1.5 px-4 rounded-sm transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}