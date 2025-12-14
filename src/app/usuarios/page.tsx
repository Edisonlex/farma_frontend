"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { UsersPage } from "@/components/users/users-page";

export default function UsuariosPage() {
  return (
    <ProtectedRoute requiredPermission="manage_users">
      <UsersPage />
    </ProtectedRoute>
  );
}
