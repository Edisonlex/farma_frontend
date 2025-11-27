"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AnalyticsPage } from "@/components/analytics/analytics-page";

export default function AnalyticsPageRoute() {
  return (
    <ProtectedRoute requiredPermission="view_analytics">
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
