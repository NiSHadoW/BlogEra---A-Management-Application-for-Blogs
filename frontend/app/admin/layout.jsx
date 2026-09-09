"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardShell from "@/components/DashboardShell";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requireRole="admin">
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
