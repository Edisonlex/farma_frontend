"use client"

import { InventoryPage } from "@/components/inventory/inventory-page"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { InventoryProvider } from "@/context/inventory-context"

export default function InventarioPage() {
  return (
    <ProtectedRoute requiredPermission="manage_inventory">
      <InventoryProvider>
        <InventoryPage />
      </InventoryProvider>
    </ProtectedRoute>
  )
}
