"use client";

import { ReportsPage } from "@/components/reports/reports-page";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ReportesPage() {
  return (
    <ProtectedRoute requiredPermission="generate_reports">
      <ReportsPage />
    </ProtectedRoute>
  );
}
