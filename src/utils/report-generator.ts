import { ReportData } from "@/components/reports/report/types";
import {
  mockMedications,
  mockMovements,
  mockAlerts,
  mockClients,
  Medication,
  InventoryMovement,
  Alert,
  Client,
} from "@/lib/mock-data";
import { addDays } from "date-fns";


export function generateReportData(
  type: string,
  from?: Date,
  to?: Date,
  cat?: string,
  supplier?: string,
  batch?: string
): ReportData {
  let filteredData: any[] = [];
  let summary: any = {};

  // Filtrar datos según el tipo de reporte
  switch (type) {
    case "inventory":
      filteredData = [...mockMedications];
      summary = {
        totalValue: filteredData.reduce(
          (sum, med) => sum + med.quantity * med.price,
          0
        ),
        lowStockCount: filteredData.filter(
          (med) => med.quantity <= med.minStock
        ).length,
        expiringCount: filteredData.filter((med) => {
          const daysToExpiry = Math.ceil(
            (med.expiryDate.getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return daysToExpiry <= 30 && daysToExpiry > 0;
        }).length,
        expiredCount: filteredData.filter((med) => med.expiryDate < new Date())
          .length,
      };
      break;

    case "movements":
      filteredData = [...mockMovements];
      if (from && to) {
        filteredData = filteredData.filter(
          (movement) => movement.date >= from && movement.date <= to
        );
      }
      break;

    case "expiring":
      // Medicamentos que expiran en los próximos 30 días
      const thirtyDaysFromNow = addDays(new Date(), 30);
      filteredData = mockMedications.filter(
        (med) =>
          med.expiryDate > new Date() && med.expiryDate <= thirtyDaysFromNow
      );
      break;

    case "expired":
      // Medicamentos ya vencidos
      filteredData = mockMedications.filter(
        (med) => med.expiryDate < new Date()
      );
      break;

    case "low-stock":
      // Medicamentos con stock bajo
      filteredData = mockMedications.filter(
        (med) => med.quantity <= med.minStock
      );
      break;

    case "alerts":
      filteredData = [...mockAlerts];
      if (from && to) {
        filteredData = filteredData.filter(
          (alert) => alert.date >= from && alert.date <= to
        );
      }
      break;

    case "clients":
      filteredData = [...mockClients];
      break;

    case "analytics":
      // Para análisis, usar datos resumidos
      const analyticsData = {
        inventory: mockMedications.length,
        totalValue: mockMedications.reduce(
          (sum, med) => sum + med.quantity * med.price,
          0
        ),
        movements: mockMovements.length,
        alerts: mockAlerts.length,
        clients: mockClients.length,
      };
      filteredData = [analyticsData];
      break;
  }

  // Aplicar filtros adicionales para reportes de inventario
  if (
    type === "inventory" ||
    type === "expiring" ||
    type === "expired" ||
    type === "low-stock"
  ) {
    if (cat && cat !== "all") {
      filteredData = filteredData.filter(
        (med) => med.category.toLowerCase() === cat
      );
    }

    if (supplier && supplier !== "all") {
      filteredData = filteredData.filter((med) => med.supplier === supplier);
    }

    if (batch) {
      filteredData = filteredData.filter((med) => med.batch.includes(batch));
    }
  }

  return {
    type,
    dateRange: { from, to },
    category: cat || "all",
    supplier: supplier || "all",
    batch: batch || "",
    data: filteredData,
    generatedAt: new Date(),
    totalItems: filteredData.length,
    summary: Object.keys(summary).length > 0 ? summary : undefined,
  };
}
