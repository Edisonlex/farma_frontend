"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function HomePage() {
  return (
    <ProtectedRoute requiredPermission="view_dashboard">
      <Dashboard />
    </ProtectedRoute>
  );
}
