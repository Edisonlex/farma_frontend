import { AlertTriangle, Calendar } from "lucide-react";
import type { Medication } from "@/lib/types";

export const getStockStatus = (medication: Medication) => {
  if (medication.quantity <= 0) {
    return { status: "sin-stock", color: "destructive", text: "Sin Stock" };
  }
  if (medication.quantity <= medication.minStock) {
    return { status: "stock-bajo", color: "destructive", text: "Stock Bajo" };
  }
  if (medication.quantity <= medication.minStock * 1.5) {
    return { status: "stock-medio", color: "default", text: "Stock Medio" };
  }
  return { status: "stock-bueno", color: "default", text: "Stock Bueno" };
};

export const getExpiryStatus = (expiryDate: Date) => {
  const today = new Date();
  const daysToExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysToExpiry < 0) {
    return {
      status: "vencido",
      color: "destructive",
      text: "Vencido",
      icon: AlertTriangle,
    };
  }
  if (daysToExpiry <= 30) {
    return {
      status: "por-vencer",
      color: "default",
      text: `${daysToExpiry}d`,
      icon: Calendar,
    };
  }
  return {
    status: "vigente",
    color: "default",
    text: expiryDate.toLocaleDateString("es-ES"),
    icon: null,
  };
};
