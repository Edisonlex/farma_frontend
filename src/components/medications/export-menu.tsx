"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import type { Medication } from "@/lib/types";

interface ExportMenuProps {
  filteredMedications: Medication[];
}

export function ExportMenu({ filteredMedications }: ExportMenuProps) {
  const exportToExcel = async () => {
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
    const XLSX = await import("xlsx");
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

  const exportToCSV = () => {
    const headers = [
      "Nombre",
      "Principio Activo",
      "Lote",
      "Categoría",
      "Cantidad",
      "Stock Mínimo",
      "Proveedor",
      "Precio",
      "Ubicación",
      "Fecha de Vencimiento",
    ];
    const rows = filteredMedications.map((med) => [
      med.name,
      med.activeIngredient,
      med.batch,
      med.category,
      med.quantity,
      med.minStock,
      med.supplier,
      med.price,
      med.location,
      med.expiryDate.toLocaleDateString("es-ES"),
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "medicamentos.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF("landscape");
    const columns = [
      { header: "Nombre", dataKey: "name" },
      { header: "Principio Activo", dataKey: "activeIngredient" },
      { header: "Lote", dataKey: "batch" },
      { header: "Categoría", dataKey: "category" },
      { header: "Cantidad", dataKey: "quantity" },
      { header: "Mínimo", dataKey: "minStock" },
      { header: "Proveedor", dataKey: "supplier" },
      { header: "Precio", dataKey: "price" },
      { header: "Ubicación", dataKey: "location" },
      { header: "Vencimiento", dataKey: "expiry" },
    ];
    const rows = filteredMedications.map((med) => ({
      name: med.name,
      activeIngredient: med.activeIngredient,
      batch: med.batch,
      category: med.category,
      quantity: med.quantity,
      minStock: med.minStock,
      supplier: med.supplier,
      price: med.price,
      location: med.location,
      expiry: med.expiryDate.toLocaleDateString("es-ES"),
    }));
    autoTable(doc, {
      head: [columns.map((c) => c.header)],
      body: rows.map((r) => columns.map((c) => (r as any)[c.dataKey])),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      margin: { top: 14 },
    });
    doc.save("medicamentos.pdf");
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
          <DropdownMenuItem onClick={exportToCSV}>
            <FileDown className="w-4 h-4 mr-2" />
            Exportar a CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Exportar a PDF
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
