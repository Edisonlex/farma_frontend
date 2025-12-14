import { useMemo } from "react";

// Diccionario de traducción de permisos
const permissionTranslations: Record<string, string> = {
  view_dashboard: "Ver Panel de Control",
  manage_medications: "Gestionar Medicamentos",
  manage_inventory: "Gestionar Inventario",
  manage_alerts: "Gestionar Alertas",
  view_alerts: "Ver Alertas",
  view_analytics: "Ver Analíticas",
  generate_reports: "Generar Reportes",
  manage_users: "Gestionar Usuarios",
  manage_sales: "Gestionar Ventas",
  view_sales_reports: "Ver Reportes de Ventas",
  manage_cash_register: "Gestionar Caja",
  view_medications: "Ver Medicamentos",
  view_inventory: "Ver Inventario",
  process_sales: "Procesar Ventas",
};

export function usePermissions() {
  const translatePermission = (permission: string): string => {
    return permissionTranslations[permission] || permission;
  };

  // También puedes agregar funciones adicionales si las necesitas
  const getTranslatedPermissions = (permissions: string[]): string[] => {
    return permissions.map(translatePermission);
  };

  return {
    translatePermission,
    getTranslatedPermissions,
  };
}
