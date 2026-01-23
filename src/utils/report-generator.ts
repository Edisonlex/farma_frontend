import { ReportData } from "@/components/reports/report/types";
import {
  mockMedications,
  mockMovements,
  mockAlerts,
  mockClients,
  mockSuppliers,
  Medication,
  InventoryMovement,
  Alert,
  Client,
  Supplier,
} from "@/lib/mock-data";
import { addDays } from "date-fns";

export function generateReportData(
  type: string,
  from?: Date,
  to?: Date,
  cat?: string,
  supplier?: string,
  batch?: string,
  sources?: {
    medications?: Medication[];
    movements?: InventoryMovement[];
    alerts?: Alert[];
    clients?: Client[];
  },
): ReportData {
  let filteredData: any[] = [];
  let summary: any = {};

  // Filtrar datos según el tipo de reporte
  const meds = sources?.medications ?? mockMedications;
  const movs = sources?.movements ?? mockMovements;
  const alrts = sources?.alerts ?? mockAlerts;
  const cls = sources?.clients ?? mockClients;
  const sups = (sources as any)?.suppliers ?? mockSuppliers;

  switch (type) {
    case "inventory":
      filteredData = [...meds];
      summary = {
        totalValue: (filteredData as Medication[]).reduce(
          (sum, med) => sum + med.quantity * med.price,
          0,
        ),
        lowStockCount: (filteredData as Medication[]).filter(
          (med) => med.quantity <= med.minStock,
        ).length,
        expiringCount: (filteredData as Medication[]).filter((med) => {
          const daysToExpiry = Math.ceil(
            (med.expiryDate.getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return daysToExpiry <= 30 && daysToExpiry > 0;
        }).length,
        expiredCount: (filteredData as Medication[]).filter(
          (med) => med.expiryDate < new Date(),
        ).length,
      };
      break;

    case "movements":
      filteredData = [...movs];
      if (from && to) {
        filteredData = filteredData.filter(
          (movement) => movement.date >= from && movement.date <= to,
        );
      }
      break;

    case "expiring":
      // Medicamentos que expiran en los próximos 30 días
      const thirtyDaysFromNow = addDays(new Date(), 30);
      filteredData = meds.filter(
        (med) =>
          med.expiryDate > new Date() && med.expiryDate <= thirtyDaysFromNow,
      );
      break;

    case "expired":
      // Medicamentos ya vencidos
      filteredData = meds.filter((med) => med.expiryDate < new Date());
      break;

    case "low-stock":
      // Medicamentos con stock bajo
      filteredData = meds.filter((med) => med.quantity <= med.minStock);
      break;

    case "alerts":
      filteredData = [...alrts];
      if (from && to) {
        filteredData = filteredData.filter(
          (alert) => alert.date >= from && alert.date <= to,
        );
      }
      // Filtrar por medicamentos/lote si aplica
      if (batch) {
        filteredData = filteredData.filter((alert) =>
          alert.message.includes(batch),
        );
      }
      break;

    case "clients":
      filteredData = [...cls];
      break;

    case "suppliers":
      // Usar fuente real de proveedores
      filteredData = [...sups];
      // Permitir filtrar por texto simple (batch como término en razón social o nombre comercial)
      if (batch) {
        const t = batch.toLowerCase();
        filteredData = filteredData.filter(
          (s: Supplier) =>
            s.name.toLowerCase().includes(t) ||
            (s.razonSocial?.toLowerCase().includes(t) ?? false) ||
            (s.nombreComercial?.toLowerCase().includes(t) ?? false),
        );
      }
      break;

    case "analytics":
      // Para análisis, usar datos resumidos
      const analyticsData = {
        inventory: meds.length,
        totalValue: meds.reduce(
          (sum, med) => sum + med.quantity * med.price,
          0,
        ),
        movements: movs.length,
        alerts: alrts.length,
        clients: cls.length,
      };
      filteredData = [analyticsData];
      break;
  }

  // Aplicar filtros adicionales para reportes de inventario y relacionados
  if (
    type === "inventory" ||
    type === "expiring" ||
    type === "expired" ||
    type === "low-stock"
  ) {
    if (cat && cat !== "all") {
      filteredData = filteredData.filter(
        (med) => med.category.toLowerCase() === cat.toLowerCase(),
      );
    }

    if (supplier && supplier !== "all") {
      filteredData = filteredData.filter((med) => med.supplier === supplier);
    }

    if (batch) {
      filteredData = filteredData.filter((med) => med.batch.includes(batch));
    }
  }

  if (filteredData.length === 0) {
    const now = new Date();
    const past = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 90);
    switch (type) {
      case "expired":
        filteredData = [
          {
            name: "Amoxicilina 500mg",
            batch: "AMX901",
            quantity: 20,
            minStock: 40,
            supplier: "1",
            category: "3",
            expiryDate: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
            price: 6.2,
          },
          {
            name: "Omeprazol 40mg",
            batch: "OME440",
            quantity: 15,
            minStock: 25,
            supplier: "2",
            category: "4",
            expiryDate: new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()),
            price: 7.9,
          },
        ];
        break;
      case "low-stock":
        filteredData = [
          {
            name: "Loratadina 10mg",
            batch: "LOR010",
            quantity: 5,
            minStock: 25,
            supplier: "2",
            category: "5",
            expiryDate: new Date(now.getFullYear(), now.getMonth() + 6, now.getDate()),
            price: 1.8,
          },
          {
            name: "Ibuprofeno 200mg",
            batch: "IBU200",
            quantity: 12,
            minStock: 30,
            supplier: "1",
            category: "2",
            expiryDate: new Date(now.getFullYear(), now.getMonth() + 8, now.getDate()),
            price: 2.9,
          },
        ];
        break;
      case "movements":
        filteredData = [
          {
            medicationName: "Paracetamol 500mg",
            type: "entrada",
            quantity: 100,
            date: past,
            reason: "Compra mensual",
            userName: "Dr. María González",
          },
          {
            medicationName: "Ibuprofeno 400mg",
            type: "salida",
            quantity: 15,
            date: new Date(past.getTime() + 1000 * 60 * 60 * 24),
            reason: "Venta",
            userName: "Carlos Rodríguez",
          },
        ];
        break;
      case "alerts":
        filteredData = [
          {
            type: "stock_bajo",
            medicationName: "Cetirizina 10mg",
            message: "Stock por debajo del mínimo (10/25)",
            severity: "high",
            date: now,
          },
          {
            type: "vencido",
            medicationName: "Omeprazol 40mg",
            message: "Lote vencido detectado",
            severity: "medium",
            date: past,
          },
        ];
        break;
      case "clients":
        filteredData = [
          {
            name: "Juan Carlos Pérez",
            type: "particular",
            email: "juan.perez@email.com",
            phone: "0981993918",
            totalPurchases: 25,
            totalAmount: 450000,
            lastPurchase: past,
          },
          {
            name: "Farmacia El Buen Vivir",
            type: "empresa",
            email: "compras@elbuenvivir.com",
            phone: "022344556",
            totalPurchases: 15,
            totalAmount: 3100000,
            lastPurchase: now,
          },
        ];
        break;
      case "suppliers":
        filteredData = [
          {
            name: "Laboratorios ABC",
            razonSocial: "Laboratorios ABC S.A.",
            ruc: "1790012345001",
            phone: "+593987654321",
            email: "juan@abc.com",
          },
          {
            name: "Farmacéutica XYZ",
            razonSocial: "Farmacéutica XYZ Cía. Ltda.",
            ruc: "0998765432001",
            phone: "0987654321",
            email: "maria@xyz.com",
          },
        ];
        break;
      case "inventory":
        filteredData = [
          {
            name: "Paracetamol 500mg",
            batch: "PAR001",
            quantity: 150,
            minStock: 50,
            supplier: "3",
            category: "1",
            expiryDate: new Date(now.getFullYear(), now.getMonth() + 12, now.getDate()),
            price: 2.5,
          },
          {
            name: "Ibuprofeno 400mg",
            batch: "IBU002",
            quantity: 8,
            minStock: 30,
            supplier: "1",
            category: "2",
            expiryDate: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
            price: 3.75,
          },
        ];
        break;
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
