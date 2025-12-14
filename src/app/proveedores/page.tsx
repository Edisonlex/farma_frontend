// app/proveedores/page.tsx
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SuppliersPage } from "@/components/suppliers/suppliers-page";

export default function ProveedoresPage() {
  return (
    <ProtectedRoute requiredPermission="manage_suppliers">
      <SuppliersPage />
    </ProtectedRoute>
  );
}
