// app/categorias/page.tsx
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { CategoriesPage } from "@/components/management/categories-page";

export default function CategoriasPage() {
  return (
    <ProtectedRoute requiredPermission="manage_categories">
      <CategoriesPage />
    </ProtectedRoute>
  );
}
