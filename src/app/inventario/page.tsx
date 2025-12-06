"use client";

import { InventoryPage } from "@/components/inventory/inventory-page";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function InventarioPage() {
  return (
    <ProtectedRoute requiredPermission={["manage_inventory", "view_inventory"]}>
      <InventoryPage />
    </ProtectedRoute>
  );
}
