"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StatsPage() {
  const { user, isRegistered, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Double check authentication on client side
    if (!isLoading && !isRegistered) {
      router.push("/");
    }
  }, [isLoading, isRegistered, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isRegistered || !user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Your Statistics
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">User ID:</span> {user.id}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Fingerprint:</span>{" "}
              {user.fingerprint.slice(0, 20)}...
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Saved Data</h2>
          <p className="text-gray-600">
            This is where your statistics and saved data would appear.
          </p>
          {/* Add your actual stats components here */}
        </div>
      </div>
    </div>
  );
}
