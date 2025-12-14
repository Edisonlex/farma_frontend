"use client";

import { useState, useEffect } from "react";
import { Alert, mockAlerts } from "@/lib/mock-data";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Cargar alertas iniciales
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a la API
    setAlerts(mockAlerts);
  }, []);

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

  return {
    alerts, // Todas las alertas
    unresolvedAlerts, // Solo alertas no resueltas
    resolveAlert,
    resolveAllAlerts,
  };
}
