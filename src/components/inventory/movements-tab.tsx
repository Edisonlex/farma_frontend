"use client";

import { useEffect, useState } from "react";
import { MovementDialog } from "./movement-dialog";
import { useInventory } from "@/context/inventory-context";
import { MovementStats } from "./movements/MovementStats";
import { MovementFilters } from "./movements/MovementFilters";
import { MovementsList } from "./movements/MovementsList";
import { useSearchParams } from "next/navigation";

export function MovementsTab() {
  const { movements } = useInventory();
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const searchParams = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("search");
    const t = searchParams.get("type");
    if (s) setSearchTerm(s);
    if (t === "entrada" || t === "salida" || t === "ajuste") setTypeFilter(t);
  }, [searchParams]);

  // Filtrar movimientos
  const filteredMovements = movements
    .filter((movement) => {
      const matchesSearch =
        movement.medicationName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        movement.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || movement.type === typeFilter;

      return matchesSearch && matchesType;
    })
    .sort((a, b) =>
      dateFilter === "oldest"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setDateFilter("all");
  };

  return (
    <div className="space-y-6">
      <MovementStats
        movements={movements}
        filteredCount={filteredMovements.length}
      />

      <MovementFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onShowDialog={() => setShowDialog(true)}
        onClearFilters={clearFilters}
        hasActiveFilters={searchTerm !== "" || typeFilter !== "all"}
      />

      {/* Export toolbar */}
      <div className="flex justify-end">
        <ExportMovements movements={filteredMovements} />
      </div>

      <MovementsList
        movements={filteredMovements}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        onClearFilters={clearFilters}
      />

      <MovementDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, FileSpreadsheet, FileText, FileDown } from "lucide-react";

function ExportMovements({ movements }: { movements: any[] }) {
  const exportExcel = async () => {
    const headers = [
      "Medicamento",
      "Tipo",
      "Cantidad",
      "Motivo",
      "Usuario",
      "Fecha",
    ];
    const rows = movements.map((m) => [
      m.medicationName,
      m.type,
      m.quantity,
      m.reason,
      m.userName,
      new Date(m.date).toLocaleString("es-ES"),
    ]);
    const XLSX = await import("xlsx");
    const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    sheet["!cols"] = [
      { wch: 25 },
      { wch: 12 },
      { wch: 10 },
      { wch: 30 },
      { wch: 18 },
      { wch: 20 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Movimientos");
    XLSX.writeFile(wb, "movimientos.xlsx");
  };

  const exportCSV = () => {
    const headers = [
      "Medicamento",
      "Tipo",
      "Cantidad",
      "Motivo",
      "Usuario",
      "Fecha",
    ];
    const rows = movements.map((m) => [
      m.medicationName,
      m.type,
      m.quantity,
      m.reason,
      m.userName,
      new Date(m.date).toLocaleString("es-ES"),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "movimientos.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF("landscape");
    const columns = [
      "Medicamento",
      "Tipo",
      "Cantidad",
      "Motivo",
      "Usuario",
      "Fecha",
    ];
    const rows = movements.map((m) => [
      m.medicationName,
      m.type,
      m.quantity,
      m.reason,
      m.userName,
      new Date(m.date).toLocaleString("es-ES"),
    ]);
    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      margin: { top: 14 },
    });
    doc.save("movimientos.pdf");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-background border-border p-2">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={exportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={exportCSV}>
            <FileDown className="h-4 w-4" />
            Exportar a CSV
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={exportPDF}>
            <FileText className="h-4 w-4" />
            Exportar a PDF
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
