"use client";

import React from "react";
import { ConfigurationProvider } from "./configuration-context";
import { AlertsProvider } from "./AlertsContext";
import { InventoryProvider } from "./inventory-context";
import { SalesProvider } from "./sales-context";
import { RealtimeProvider } from "./realtime-context";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Proveedor principal que envuelve toda la aplicación con todos los contextos necesarios.
 * Esto asegura que todos los componentes tengan acceso a los contextos de configuración,
 * alertas, inventario y ventas de manera integrada.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigurationProvider>
      <RealtimeProvider>
        <InventoryProvider>
          <SalesProvider>
            <AlertsProvider>
              {children}
            </AlertsProvider>
          </SalesProvider>
        </InventoryProvider>
      </RealtimeProvider>
    </ConfigurationProvider>
  );
}

/**
 * Hook para verificar que todos los contextos estén disponibles
 */
export function useAppContext() {
  // Este hook puede ser usado para verificar que todos los contextos estén disponibles
  // y proporcionar funciones de utilidad que combinen múltiples contextos
  return {
    isReady: true // Placeholder para futuras verificaciones
  };
}