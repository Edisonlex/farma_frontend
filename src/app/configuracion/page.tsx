"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { SystemConfiguration } from "@/components/configuration/system-configuration"


export default function ConfiguracionPage() {
  return (
    // requiredPermission="manage_system"
    <ProtectedRoute>
      
        <SystemConfiguration />
      
    </ProtectedRoute>
  );
}