"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "./Loader";

// Guards /dashboard/* (any authenticated user) and /admin/* (requireRole="admin").
// This is a UX convenience only — Rules #14 is explicit that the real
// authorization boundary is the backend's own 401/403 responses, which every
// service call still has to handle regardless of what this component does.
export default function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader label="Loading..." />
      </div>
    );
  }

  if (requireRole && role !== requireRole) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500">You don&apos;t have permission to view this page.</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return children;
}
