"use client";

import {
  Download,
  FileText,
  FileSpreadsheet,
  Search,
  Filter,
  X,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { exportToExcel, exportToPDF } from "@/lib/export";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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
  
  // Función para exportar a Excel
  const handleExportExcel = () => {
    if (transactions.length === 0) return;

    const data = transactions.map((transaction, index) => {
      let dateObj = new Date();
      try {
        dateObj = new Date(transaction.date);
        if (isNaN(dateObj.getTime())) {
             dateObj = new Date(); // Fallback to now if invalid
        }
      } catch (e) {
        dateObj = new Date();
      }

      return {
        ID: index + 1,
        Medicamento: transaction.medication,
        Tipo: transaction.type === "adjustment" ? "Ajuste de Inventario" : "Movimiento de Stock",
        Operación: transaction.subtype === "entrada" || transaction.subtype === "increase" ? "Entrada" : "Salida",
        Cantidad: parseInt(transaction.quantity),
        Motivo: transaction.reason,
        Lote: transaction.batch,
        Usuario: transaction.user,
        Fecha: format(dateObj, "dd/MM/yyyy"),
        Hora: format(dateObj, "HH:mm:ss"),
      };
    });

    exportToExcel({
      data,
      fileName: `historial_transacciones_${format(new Date(), "yyyyMMdd_HHmmss")}`,
      title: "Historial de Transacciones",
      columnWidths: [5, 25, 20, 12, 12, 30, 15, 20, 12, 10],
      filters: {
        search,
        tipo: typeFilter,
        desde: dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Inicio",
        hasta: dateTo ? format(dateTo, "dd/MM/yyyy") : "Actualidad",
      }
    });
  };

  const handleExportPDF = () => {
    if (transactions.length === 0) return;

    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Medicamento", dataKey: "medication" },
      { header: "Tipo", dataKey: "type" },
      { header: "Operación", dataKey: "operation" },
      { header: "Cant.", dataKey: "quantity" },
      { header: "Motivo", dataKey: "reason" },
      { header: "Lote", dataKey: "batch" },
      { header: "Usuario", dataKey: "user" },
      { header: "Fecha", dataKey: "date" },
    ];

    const data = transactions.map((transaction, index) => {
      let dateObj = new Date();
      try {
        dateObj = new Date(transaction.date);
        if (isNaN(dateObj.getTime())) {
             dateObj = new Date(); // Fallback to now if invalid
        }
      } catch (e) {
        dateObj = new Date();
      }

      return {
        id: index + 1,
        medication: transaction.medication,
        type: transaction.type === "adjustment" ? "Ajuste" : "Movimiento",
        operation: transaction.subtype === "entrada" || transaction.subtype === "increase" ? "Entrada" : "Salida",
        quantity: transaction.quantity,
        reason: transaction.reason,
        batch: transaction.batch,
        user: transaction.user,
        date: format(dateObj, "dd/MM/yyyy HH:mm"),
      };
    });

    exportToPDF({
      fileName: `historial_transacciones_${format(new Date(), "yyyyMMdd_HHmmss")}`,
      title: "Historial de Transacciones",
      columns,
      data,
      orientation: "landscape",
      filters: {
        search,
        tipo: typeFilter,
      }
    });
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
                    onClick={handleExportExcel}
                    disabled={transactions.length === 0}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Exportar a Excel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={handleExportPDF}
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
