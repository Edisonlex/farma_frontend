"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Search,
  Filter,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateFrom: Date | undefined;
  setDateFrom: (value: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (value: Date | undefined) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  transactions: any[];
}

export function TransactionFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  hasActiveFilters,
  onClearFilters,
  transactions,
}: TransactionFiltersProps) {
  // Función para exportar a TXT
  const exportToTxt = () => {
    if (transactions.length === 0) return;

    const header = "Historial de Transacciones - Sistema de Inventario\n";
    const dateRange = `Fecha de exportación: ${new Date().toLocaleDateString()}\n`;
    const filters = `Filtros aplicados: ${hasActiveFilters ? "Sí" : "No"}\n`;
    const separator = "=".repeat(50) + "\n\n";

    let content = header + dateRange + filters + separator;

    transactions.forEach((transaction, index) => {
      content += `Transacción #${index + 1}\n`;
      content += `Medicamento: ${transaction.medication}\n`;
      content += `Tipo: ${
        transaction.type === "adjustment" ? "Ajuste" : "Movimiento"
      }\n`;
      content += `Operación: ${
        transaction.subtype === "entrada" || transaction.subtype === "increase"
          ? "Entrada"
          : "Salida"
      }\n`;
      content += `Cantidad: ${
        transaction.subtype === "entrada" || transaction.subtype === "increase"
          ? "+"
          : "-"
      }${transaction.quantity}\n`;
      content += `Motivo: ${transaction.reason}\n`;
      content += `Lote: ${transaction.batch}\n`;
      content += `Usuario: ${transaction.user}\n`;
      content += `Fecha: ${transaction.date}\n`;
      content += "-".repeat(30) + "\n\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historial_transacciones_${format(
      new Date(),
      "yyyy-MM-dd_HH-mm"
    )}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Función para exportar a Excel (CSV)
  // Función para exportar a Excel con formato profesional
  const exportToExcel = () => {
    if (transactions.length === 0) return;

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // ===== HOJA 1: DATOS DE TRANSACCIONES =====
    const worksheetData = XLSX.utils.aoa_to_sheet([]);

    // Metadatos del reporte
    const metadata = [
      ["HISTORIAL DE TRANSACCIONES - SISTEMA DE INVENTARIO"],
      [""],
      [
        "Fecha de Exportación:",
        new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      ],
      ["Total de Registros:", transactions.length],
      ["Estado de Filtros:", hasActiveFilters ? "ACTIVOS" : "INACTIVOS"],
      ["Usuario:", "Sistema de Inventario"],
      [""],
      ["RESUMEN ESTADÍSTICO"],
      [
        "Entradas:",
        transactions.filter(
          (t) => t.subtype === "entrada" || t.subtype === "increase"
        ).length,
      ],
      ["Salidas:", transactions.filter((t) => t.subtype === "salida").length],
      ["Ajustes:", transactions.filter((t) => t.type === "adjustment").length],
      [""],
      [""], // Espacio antes de la tabla
    ];

    // Encabezados de la tabla
    const headers = [
      "ID",
      "MEDICAMENTO",
      "TIPO DE TRANSACCIÓN",
      "OPERACIÓN",
      "CANTIDAD",
      "MOTIVO",
      "LOTE",
      "USUARIO",
      "FECHA",
      "HORA",
    ];

    // Datos de las transacciones
    const rows = transactions.map((transaction, index) => {
      const transactionDate = new Date(transaction.date);

      return [
        index + 1,
        transaction.medication,
        transaction.type === "adjustment"
          ? "Ajuste de Inventario"
          : "Movimiento de Stock",
        transaction.subtype === "entrada" || transaction.subtype === "increase"
          ? "Entrada"
          : "Salida",
        {
          v: parseInt(transaction.quantity),
          t: "n",
          z:
            transaction.subtype === "entrada" ||
            transaction.subtype === "increase"
              ? "+#,##0"
              : "-#,##0",
        },
        transaction.reason,
        transaction.batch,
        transaction.user,
        XLSX.SSF.format("dd/mm/yyyy", transactionDate),
        XLSX.SSF.format("hh:mm:ss", transactionDate),
      ];
    });

    // Totales
    const totalEntradas = transactions
      .filter((t) => t.subtype === "entrada" || t.subtype === "increase")
      .reduce((sum, t) => sum + parseInt(t.quantity), 0);

    const totalSalidas = transactions
      .filter((t) => t.subtype === "salida")
      .reduce((sum, t) => sum + parseInt(t.quantity), 0);

    const totals = [
      [""],
      ["TOTALES"],
      ["Total Entradas:", { v: totalEntradas, t: "n", z: "+#,##0" }],
      ["Total Salidas:", { v: totalSalidas, t: "n", z: "-#,##0" }],
      ["Diferencia:", { v: totalEntradas - totalSalidas, t: "n", z: "#,##0" }],
      [""],
      ["© Sistema de Inventario - Reporte generado automáticamente"],
    ];

    // Combinar todos los datos
    const allData = [...metadata, headers, ...rows, ...totals];
    XLSX.utils.sheet_add_aoa(worksheetData, allData);

    // Aplicar estilos y formatos
    // 1. Título principal
    worksheetData["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // Fusionar celdas para el título
    ];

    // 2. Anchura de columnas
    worksheetData["!cols"] = [
      { wch: 5 }, // ID
      { wch: 25 }, // Medicamento
      { wch: 20 }, // Tipo
      { wch: 12 }, // Operación
      { wch: 12 }, // Cantidad
      { wch: 30 }, // Motivo
      { wch: 15 }, // Lote
      { wch: 20 }, // Usuario
      { wch: 12 }, // Fecha
      { wch: 10 }, // Hora
    ];

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheetData, "Transacciones");

    // ===== HOJA 2: RESUMEN ESTADÍSTICO =====
    const worksheetSummary = XLSX.utils.aoa_to_sheet([
      ["RESUMEN ESTADÍSTICO DE TRANSACCIONES"],
      [""],
      ["TIPO", "CANTIDAD", "TOTAL UNIDADES"],
      [
        "Entradas",
        transactions.filter(
          (t) => t.subtype === "entrada" || t.subtype === "increase"
        ).length,
        totalEntradas,
      ],
      [
        "Salidas",
        transactions.filter((t) => t.subtype === "salida").length,
        totalSalidas,
      ],
      [
        "Ajustes",
        transactions.filter((t) => t.type === "adjustment").length,
        transactions
          .filter((t) => t.type === "adjustment")
          .reduce((sum, t) => sum + parseInt(t.quantity), 0),
      ],
      [""],
      ["TOTAL GENERAL", transactions.length, totalEntradas - totalSalidas],
      [""],
      ["PROMEDIOS"],
      [
        "Promedio por transacción",
        "",
        (totalEntradas - totalSalidas) / transactions.length,
      ],
      [
        "Máxima entrada",
        "",
        Math.max(
          ...transactions
            .filter((t) => t.subtype === "entrada" || t.subtype === "increase")
            .map((t) => parseInt(t.quantity)),
          0
        ),
      ],
      [
        "Máxima salida",
        "",
        Math.max(
          ...transactions
            .filter((t) => t.subtype === "salida")
            .map((t) => parseInt(t.quantity)),
          0
        ),
      ],
    ]);

    // Formato de la hoja de resumen
    worksheetSummary["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    worksheetSummary["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(workbook, worksheetSummary, "Resumen");

    // ===== HOJA 3: METADATOS =====
    const worksheetMeta = XLSX.utils.aoa_to_sheet([
      ["INFORMACIÓN DEL REPORTE"],
      [""],
      ["Sistema:", "Sistema de Gestión de Inventario"],
      ["Módulo:", "Historial de Transacciones"],
      ["Fecha de Generación:", new Date().toISOString()],
      ["Usuario del Sistema:", "Usuario Actual"],
      [
        "Rango de Fechas:",
        dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Desde inicio",
        " - ",
        dateTo ? format(dateTo, "dd/MM/yyyy") : "Hasta actual",
      ],
      ["Filtro de Búsqueda:", search || "Ninguno"],
      ["Filtro de Tipo:", typeFilter === "all" ? "Todos" : typeFilter],
      [""],
      ["CONFIGURACIÓN"],
      ["Total de Transacciones en Sistema:", transactions.length],
      ["Tiempo de Generación:", new Date().toLocaleTimeString()],
      ["Versión del Reporte:", "1.0"],
      [""],
      ["NOTAS:"],
      ["- Los valores positivos indican entradas al inventario"],
      ["- Los valores negativos indican salidas del inventario"],
      ["- Los ajustes son modificaciones manuales del stock"],
      ["- Este reporte es de sólo lectura y no debe ser modificado"],
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheetMeta, "Metadatos");

    // Generar el archivo Excel
    const fileName = `Reporte_Transacciones_${format(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.xlsx`;

    XLSX.writeFile(workbook, fileName, {
      compression: true,
      bookType: "xlsx",
      type: "buffer",
    });
  };

  const exportToCSV = () => {
    if (transactions.length === 0) return;
    const headers = [
      "ID",
      "MEDICAMENTO",
      "TIPO",
      "OPERACIÓN",
      "CANTIDAD",
      "MOTIVO",
      "LOTE",
      "USUARIO",
      "FECHA",
      "HORA",
    ];
    const rows = transactions.map((transaction, index) => {
      const d = new Date(transaction.date);
      const op =
        transaction.subtype === "entrada" || transaction.subtype === "increase"
          ? "Entrada"
          : "Salida";
      return [
        index + 1,
        transaction.medication,
        transaction.type === "adjustment" ? "Ajuste" : "Movimiento",
        op,
        transaction.quantity,
        transaction.reason,
        transaction.batch,
        transaction.user,
        XLSX.SSF.format("dd/mm/yyyy", d),
        XLSX.SSF.format("hh:mm:ss", d),
      ];
    });
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historial_transacciones_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (transactions.length === 0) return;
    const doc = new jsPDF("landscape");
    const columns = [
      "ID",
      "Medicamento",
      "Tipo",
      "Operación",
      "Cantidad",
      "Motivo",
      "Lote",
      "Usuario",
      "Fecha",
      "Hora",
    ];
    const rows = transactions.map((transaction, index) => {
      const d = new Date(transaction.date);
      const op =
        transaction.subtype === "entrada" || transaction.subtype === "increase"
          ? "Entrada"
          : "Salida";
      return [
        index + 1,
        transaction.medication,
        transaction.type === "adjustment" ? "Ajuste" : "Movimiento",
        op,
        transaction.quantity,
        transaction.reason,
        transaction.batch,
        transaction.user,
        d.toLocaleDateString("es-ES"),
        d.toLocaleTimeString("es-ES"),
      ];
    });
    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      margin: { top: 14 },
    });
    doc.save(
      `historial_transacciones_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`
    );
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Historial de Transacciones
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-background border-border p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={exportToTxt}
                    disabled={transactions.length === 0}
                  >
                    <FileText className="h-4 w-4" />
                    Exportar a TXT
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={exportToExcel}
                    disabled={transactions.length === 0}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Exportar a Excel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={exportToCSV}
                    disabled={transactions.length === 0}
                  >
                    <FileDown className="h-4 w-4" />
                    Exportar a CSV
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={exportToPDF}
                    disabled={transactions.length === 0}
                  >
                    <FileText className="h-4 w-4" />
                    Exportar a PDF
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar medicamento, motivo o lote..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-border/80"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="border-border/80">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Tipo de transacción" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">Todas las transacciones</SelectItem>
              <SelectItem value="movement">Movimientos</SelectItem>
              <SelectItem value="adjustment">Ajustes</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start text-left font-normal border-border/80",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom
                  ? format(dateFrom, "dd/MM/yyyy", { locale: es })
                  : "Desde"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border-border">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start text-left font-normal border-border/80",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo
                  ? format(dateTo, "dd/MM/yyyy", { locale: es })
                  : "Hasta"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border-border">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
