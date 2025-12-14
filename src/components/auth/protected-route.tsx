"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { checkPermissions } from "@/lib/auth"
import { LoginForm } from "./login-form"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string | string[]
  mode?: "any" | "all"
}

export function ProtectedRoute({ children, requiredPermission, mode = "any" }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (requiredPermission && user) {
    const ok = checkPermissions(user.role, requiredPermission, mode)
    if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    )
    }
  }

  return <>{children}</>
}
