"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import type { Medication } from "@/lib/mock-data";

interface ExportMenuProps {
  filteredMedications: Medication[];
}

export function ExportMenu({ filteredMedications }: ExportMenuProps) {
  // Función para exportar a Excel
  const exportToExcel = () => {
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

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    const colWidths = [
      { wch: 25 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
      { wch: 12 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 18 },
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Medicamentos");
    XLSX.writeFile(workbook, "medicamentos.xlsx");
  };

  // Función para exportar a JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredMedications, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "medicamentos.json");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para exportar a texto plano
  const exportToText = () => {
    const textContent = filteredMedications
      .map(
        (med) => `
Medicamento: ${med.name}
Principio Activo: ${med.activeIngredient}
Lote: ${med.batch}
Categoría: ${med.category}
Cantidad: ${med.quantity}
Stock Mínimo: ${med.minStock}
Proveedor: ${med.supplier}
Precio: $${med.price.toFixed(2)}
Ubicación: ${med.location}
Vencimiento: ${med.expiryDate.toLocaleDateString("es-ES")}
----------------------------------------
      `
      )
      .join("\n");

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "medicamentos.txt");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Exportar a Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar a JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToText}>
          <FileDown className="w-4 h-4 mr-2" />
          Exportar a Texto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
