"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert, roleDemoAlerts } from "@/lib/mock-data";
import { useInventory } from "@/context/inventory-context";
import { useNotificationConfig } from "./configuration-context";
import { useAuth } from "@/hooks/use-auth";

interface AlertsContextType {
  alerts: Alert[];
  unresolvedAlerts: Alert[];
  resolveAlert: (id: string) => void;
  resolveAllAlerts: () => void;
  unresolveAlert: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { config: notificationConfig } = useNotificationConfig();
  const { medications, movements } = useInventory();
  const { user } = useAuth();
  const [ackSet, setAckSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const key = user?.id ? `alerts_ack_${user.id}` : undefined;
    if (key) {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (raw) {
        try {
          const arr = JSON.parse(raw) as string[];
          setAckSet(new Set(arr));
        } catch {}
      } else {
        setAckSet(new Set());
      }
    } else {
      setAckSet(new Set());
    }
  }, [user?.id]);

  const persistAck = (next: Set<string>) => {
    const key = user?.id ? `alerts_ack_${user.id}` : undefined;
    if (key && typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(Array.from(next)));
    }
  };

  // Generar alertas inteligentes basadas en inventario y movimientos
  useEffect(() => {
    const now = new Date();
    const expiryDays = notificationConfig.expiryDays ?? 30;
    const criticalExpiryDays = notificationConfig.criticalExpiryDays ?? 7;
    const windowDays = 30; // ventana para tendencia de ventas

    const sinceDate = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);

    const generated: Alert[] = medications.flatMap((med) => {
      const medAlerts: Alert[] = [];

      // Stock crítico y bajo (mutuamente excluyentes)
      const effectiveMinStock =
        med.minStock && med.minStock > 0
          ? med.minStock
          : notificationConfig.stockThreshold ?? med.minStock;
      if (med.quantity === 0) {
        medAlerts.push({
          id: `${med.id}-stock-critico`,
          type: "stock_bajo",
          medicationId: med.id,
          medicationName: med.name,
          message: "Stock crítico: 0 unidades",
          severity: "high",
          date: now,
          resolved: false,
        });
      } else if (
        effectiveMinStock &&
        med.quantity > 0 &&
        med.quantity <= effectiveMinStock
      ) {
        const criticalThreshold =
          notificationConfig.criticalStockThreshold ??
          Math.ceil((effectiveMinStock || 2) / 2);
        const severity = med.quantity <= criticalThreshold ? "high" : "medium";
        medAlerts.push({
          id: `${med.id}-stock-bajo`,
          type: "stock_bajo",
          medicationId: med.id,
          medicationName: med.name,
          message: `Stock por debajo del mínimo (${med.quantity}/${effectiveMinStock})`,
          severity,
          date: now,
          resolved: false,
        });
      }

      // Tendencia de ventas (salidas > entradas) en ventana
      const medMovements = movements.filter(
        (m) => m.medicationId === med.id && m.date >= sinceDate
      );
      const entradas = medMovements
        .filter((m) => m.type === "entrada")
        .reduce((sum, m) => sum + Math.max(0, m.quantity), 0);
      const salidas = medMovements
        .filter((m) => m.type === "salida")
        .reduce((sum, m) => sum + Math.abs(Math.min(0, m.quantity)), 0);

      if (salidas > entradas) {
        medAlerts.push({
          id: `${med.id}-tendencia-ventas`,
          type: "tendencia_ventas",
          medicationId: med.id,
          medicationName: med.name,
          message: `Tendencia de consumo alta: salidas ${salidas} > entradas ${entradas} en ${windowDays} días`,
          severity: med.quantity <= med.minStock ? "medium" : "low",
          date: now,
          resolved: false,
        });
      }

      // Vencido o por vencer con umbrales configurables
      const daysToExpiry = Math.ceil(
        (med.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (med.expiryDate < now) {
        medAlerts.push({
          id: `${med.id}-vencido`,
          type: "vencido",
          medicationId: med.id,
          medicationName: med.name,
          message: "Medicamento vencido",
          severity: "high",
          date: now,
          resolved: false,
        });
      } else if (daysToExpiry <= expiryDays) {
        let severity: Alert["severity"] =
          daysToExpiry <= criticalExpiryDays ? "high" : "medium";
        // Escalar si también hay stock bajo
        const isLowStock =
          effectiveMinStock &&
          med.quantity > 0 &&
          med.quantity <= effectiveMinStock;
        if (isLowStock) {
          severity = "high";
        }
        medAlerts.push({
          id: `${med.id}-por-vencer`,
          type: "vencimiento",
          medicationId: med.id,
          medicationName: med.name,
          message: isLowStock
            ? `Vence en ${daysToExpiry} días y stock bajo (${med.quantity}/${effectiveMinStock})`
            : `Vence en ${daysToExpiry} días`,
          severity,
          date: now,
          resolved: false,
        });
      }

      return medAlerts;
    });

    // Añadir demos por rol
    if (user?.role) {
      const demos = roleDemoAlerts[user.role] || [];
      generated.push(...demos);
    }

    // Filtrar por tipos permitidos según rol ANTES de setAlerts
    const role = user?.role;
    const allowedByRole: Record<string, Array<Alert["type"]>> = {
      administrador: ["stock_bajo", "vencimiento", "vencido", "tendencia_ventas"],
      farmaceutico: ["stock_bajo", "vencimiento", "vencido"],
      tecnico: ["tarea_tecnica"],
    };
    const allowed = role ? allowedByRole[role] ?? [] : undefined;
    let finalAlerts = typeof allowed === "undefined"
      ? generated
      : generated.filter((a) => allowed.includes(a.type));

    // Generar tareas técnicas inteligentes para el rol técnico
    if (role === "tecnico") {
      const windowDays = 30;
      const sinceDate = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);

      const noRecentMovements = medications.filter((med) => {
        const medMov = movements.filter((m) => m.medicationId === med.id && m.date >= sinceDate);
        return medMov.length === 0;
      }).slice(0, 3);

      const expiringSoon = medications
        .filter((med) => {
          const days = Math.ceil((med.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return days > 0 && days <= (notificationConfig.expiryDays ?? 30);
        })
        .slice(0, 2);

      const tasks: Alert[] = [
        ...noRecentMovements.map((med) => ({
          id: `${med.id}-tarea-conteo`,
          type: "tarea_tecnica" as const,
          medicationId: med.id,
          medicationName: med.name,
          message: "Realizar conteo físico y validar etiquetado",
          severity: "low" as const,
          date: now,
          resolved: false,
        })),
        ...expiringSoon.map((med) => ({
          id: `${med.id}-tarea-etiqueta-vencimiento`,
          type: "tarea_tecnica" as const,
          medicationId: med.id,
          medicationName: med.name,
          message: "Colocar etiqueta de 'próximo a vencer'",
          severity: "medium" as const,
          date: now,
          resolved: false,
        })),
      ];

      finalAlerts = [...tasks, ...finalAlerts];
    }

    finalAlerts.sort((a, b) => b.date.getTime() - a.date.getTime());
    setAlerts(finalAlerts);
  }, [medications, movements, notificationConfig.expiryDays, notificationConfig.criticalExpiryDays, user?.role]);

  // Eliminar auto-resolución por tiempo: la resolución depende del estado real

  // Revalidación periódica de alertas
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => prev.map((a) => ({ ...a })));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filterByRole = (a: Alert): boolean => {
    const role = user?.role;
    if (!role) return true;
    if (role === "administrador") return true;
    if (role === "farmaceutico") return a.type === "stock_bajo" || a.type === "vencimiento" || a.type === "vencido";
    if (role === "tecnico") return a.type === "tarea_tecnica";
    return true;
  };

  const isInQuietRange = (now: Date, start: string, end: string) => {
    const [sh, sm] = start.split(":").map((v) => parseInt(v, 10));
    const [eh, em] = end.split(":").map((v) => parseInt(v, 10));
    const s = new Date(now);
    s.setHours(sh || 0, sm || 0, 0, 0);
    const e = new Date(now);
    e.setHours(eh || 0, em || 0, 0, 0);
    if (e <= s) {
      if (now >= s) return true;
      return now <= e;
    }
    return now >= s && now <= e;
  };

  const typeEnabled = (a: Alert): boolean => {
    const nc = notificationConfig;
    if (a.type === "stock_bajo") return nc.lowStockAlerts !== false;
    if (a.type === "vencimiento" || a.type === "vencido") return nc.expiryAlerts !== false;
    if (a.type === "tendencia_ventas") return nc.salesAlerts !== false;
    return true;
  };

  const quiet = notificationConfig.quietHoursEnabled && isInQuietRange(new Date(), notificationConfig.quietHoursStart, notificationConfig.quietHoursEnd);

  const unresolvedAlerts = alerts
    .filter(filterByRole)
    .filter(typeEnabled)
    .filter((a) => !(quiet && a.severity !== "high"))
    .filter((a) => !ackSet.has(a.id));

  // Reconocer una alerta para el usuario actual (no global)
  const resolveAlert = (id: string) => {
    setAckSet((prev) => {
      const next = new Set(prev);
      next.add(id);
      persistAck(next);
      return next;
    });
  };

  const unresolveAlert = (id: string) => {
    setAckSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      persistAck(next);
      return next;
    });
  };

  // Reconocer todas para el usuario actual
  const resolveAllAlerts = () => {
    setAckSet((prev) => {
      const next = new Set(prev);
      alerts.filter(filterByRole).forEach((a) => next.add(a.id));
      persistAck(next);
      return next;
    });
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        unresolvedAlerts,
        resolveAlert,
        resolveAllAlerts,
        unresolveAlert,
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
