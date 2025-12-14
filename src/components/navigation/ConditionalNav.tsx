"use client";

import type React from "react";
import { useAuth } from "@/hooks/use-auth";
import { MainNav } from "./MainNav";

export function ConditionalNav() {
  const { isAuthenticated, isLoading } = useAuth();

  // No mostrar el navbar si:
  // 1. Está cargando la autenticación
  // 2. El usuario no está autenticado (página de login)
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <MainNav />;
}
