"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import type { Medication } from "@/lib/types";
import { exportToExcel, exportToPDF } from "@/lib/export";

interface ExportMenuProps {
  filteredMedications: Medication[];
}

export function ExportMenu({ filteredMedications }: ExportMenuProps) {
  const handleExportExcel = () => {
    const data = filteredMedications.map((med) => ({
      Nombre: med.name,
      "Principio Activo": med.activeIngredient,
      Lote: med.batch,
      Categoría: med.category,
      Cantidad: med.quantity,
      "Stock Mínimo": med.minStock,
      Proveedor: med.supplier,
      Precio: med.price,
      Ubicación: med.location,
      "Fecha de Vencimiento": med.expiryDate.toLocaleDateString("es-ES"),
    }));

    exportToExcel({
      data,
      fileName: "medicamentos",
      sheetName: "Inventario",
      title: "Reporte de Medicamentos",
      columnWidths: [25, 20, 15, 15, 10, 12, 20, 10, 15, 15],
    });
  };

  const handleExportPDF = () => {
    const columns = [
      { header: "Nombre", dataKey: "name" },
      { header: "Principio Activo", dataKey: "activeIngredient" },
      { header: "Lote", dataKey: "batch" },
      { header: "Categoría", dataKey: "category" },
      { header: "Cant.", dataKey: "quantity" },
      { header: "Prov.", dataKey: "supplier" },
      { header: "Precio", dataKey: "price" },
      { header: "Vence", dataKey: "expiry" },
    ];

    const data = filteredMedications.map((med) => ({
      name: med.name,
      activeIngredient: med.activeIngredient,
      batch: med.batch,
      category: med.category,
      quantity: med.quantity,
      supplier: med.supplier,
      price: `$${med.price.toFixed(2)}`,
      expiry: med.expiryDate.toLocaleDateString("es-ES"),
    }));

    exportToPDF({
      fileName: "medicamentos",
      title: "Reporte de Medicamentos",
      columns,
      data,
      orientation: "landscape",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-transparent"
          size="sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden xs:inline">Exportar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border-border" align="end">
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Exportar a Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar a PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
