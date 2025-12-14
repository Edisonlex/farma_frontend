"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AlertsPage } from "@/components/alerts/alerts-page"

export default function AlertasPage() {
  return (
    <ProtectedRoute requiredPermission="view_alerts">
      <AlertsPage />
    </ProtectedRoute>
  )
}
