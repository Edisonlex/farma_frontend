import { Medication, InventoryMovement, Alert, Client } from "@/lib/mock-data";

export interface ReportData {
  type: string;
  dateRange: { from?: Date; to?: Date };
  category: string;
  supplier: string;
  batch: string;
  data: any[];
  generatedAt: Date;
  totalItems: number;
  summary?: {
    totalValue?: number;
    lowStockCount?: number;
    expiringCount?: number;
    expiredCount?: number;
  };
}

export interface ReportHistoryItem {
  id: number;
  name: string;
  type: string;
  format: string;
  status: "completed" | "generating";
  createdAt: Date;
  size: string | null;
  data?: ReportData;
}
