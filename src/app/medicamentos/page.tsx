"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MedicationsPage } from "@/components/medications/medications-page";

export default function MedicamentosPage() {
  return (
    <ProtectedRoute requiredPermission={["manage_medications", "view_medications"]}>
      <MedicationsPage />
    </ProtectedRoute>
  );
}
