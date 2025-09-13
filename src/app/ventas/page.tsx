import { ProtectedRoute } from "@/components/auth/protected-route"
import { SalesPage } from "@/components/sales/sales-page"

export default function VentasPage() {
  return (
    <ProtectedRoute requiredPermission="manage_sales">
      <SalesPage />
    </ProtectedRoute>
  )
}
