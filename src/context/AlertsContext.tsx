"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert, mockAlerts } from "@/lib/mock-data";
import { useNotificationConfig } from "./configuration-context";

interface AlertsContextType {
  alerts: Alert[];
  unresolvedAlerts: Alert[];
  resolveAlert: (id: string) => void;
  resolveAllAlerts: () => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { config: notificationConfig } = useNotificationConfig();

  // Cargar alertas iniciales
  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  // Auto-resolver alertas si está habilitado
  useEffect(() => {
    if (notificationConfig.autoResolve) {
      const timer = setTimeout(() => {
        setAlerts(prev => prev.map(alert => ({ ...alert, resolved: true })));
      }, 24 * 60 * 60 * 1000); // 24 horas
      return () => clearTimeout(timer);
    }
  }, [notificationConfig.autoResolve]);

  // Obtener alertas no resueltas
  const unresolvedAlerts = alerts.filter((alert) => !alert.resolved);

  // Resolver una alerta específica
  const resolveAlert = (id: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    );
  };

  // Resolver todas las alertas
  const resolveAllAlerts = () => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => ({ ...alert, resolved: true }))
    );
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        unresolvedAlerts,
        resolveAlert,
        resolveAllAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error("useAlerts debe ser usado dentro de un AlertsProvider");
  }
  return context;
}
