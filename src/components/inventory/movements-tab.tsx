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
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/lib/export";

function ExportMovements({ movements }: { movements: any[] }) {
  const handleExportExcel = () => {
    const data = movements.map((m) => ({
      Medicamento: m.medicationName,
      Tipo: m.type,
      Cantidad: m.quantity,
      Motivo: m.reason,
      Usuario: m.userName,
      Fecha: new Date(m.date).toLocaleString("es-ES"),
    }));

    exportToExcel({
        data,
        fileName: "movimientos",
        sheetName: "Movimientos",
        title: "Reporte de Movimientos de Inventario",
        columnWidths: [25, 12, 10, 30, 18, 20],
    });
  };

  const handleExportPDF = () => {
    const columns = [
      { header: "Medicamento", dataKey: "medicationName" },
      { header: "Tipo", dataKey: "type" },
      { header: "Cantidad", dataKey: "quantity" },
      { header: "Motivo", dataKey: "reason" },
      { header: "Usuario", dataKey: "userName" },
      { header: "Fecha", dataKey: "date" },
    ];

    const data = movements.map((m) => ({
      medicationName: m.medicationName,
      type: m.type,
      quantity: m.quantity,
      reason: m.reason,
      userName: m.userName,
      date: new Date(m.date).toLocaleString("es-ES"),
    }));

    exportToPDF({
        fileName: "movimientos",
        title: "Reporte de Movimientos",
        columns,
        data,
        orientation: "landscape",
    });
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
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleExportPDF}>
            <FileText className="h-4 w-4" />
            Exportar a PDF
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
