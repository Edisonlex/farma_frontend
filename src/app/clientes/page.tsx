"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ClientsPage } from "@/components/clients/clients-page";

export default function ClientesPage() {
  return (
    <ProtectedRoute requiredPermission={["manage_clients", "view_clients"]}>
      <ClientsPage />
    </ProtectedRoute>
  );
}
