// recent-movements.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Sparkles, TrendingUp, Download, FileText } from "lucide-react";
import { useSales } from "@/context/sales-context";
import { useInventory } from "@/context/inventory-context"; // Importar el contexto de inventario
import { MovementList } from "./movement/MovementList";
import { MovementFilters } from "./movement/MovementFilters";
import { exportInventoryMovements } from "@/lib/excel-export";
import { generatePDF } from "@/utils/file-exporter";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Filters {
  type: string;
  dateRange: string;
  search: string;
}

export function RecentMovements() {
  const { sales } = useSales();
  const { movements: inventoryMovements } = useInventory(); // Obtener movimientos del inventario
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: "all",
    dateRange: "all",
    search: "",
  });

  // Combinar movimientos de inventario con ventas
  const allMovements = useMemo(() => {
    // Convertir ventas a movimientos
    const salesMovements = sales.map((sale) => ({
      id: sale.id,
      medicationId: "sale-" + sale.id,
      medicationName: sale.items.map((item) => item.name).join(", "),
      type: "venta" as const,
      quantity: -sale.items.reduce((sum, item) => sum + item.quantity, 0),
      date: sale.date,
      reason: `Venta ${sale.id} - ${sale.paymentMethod}`,
      userId: "sale-system",
      userName: sale.cashier,
      total: sale.total,
    }));

    // Combinar y ordenar por fecha (más reciente primero)
    return [...inventoryMovements, ...salesMovements].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }, [sales, inventoryMovements]);

  // El resto del componente permanece igual...
  const filteredMovements = useMemo(() => {
    return allMovements.filter((movement) => {
      // Filtro por tipo
      const matchesType =
        filters.type === "all" || movement.type === filters.type;

      // Filtro por búsqueda
      const matchesSearch =
        !filters.search ||
        movement.medicationName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        movement.reason.toLowerCase().includes(filters.search.toLowerCase()) ||
        movement.userName.toLowerCase().includes(filters.search.toLowerCase());

      // Filtro por rango de fecha
      const matchesDateRange = (() => {
        if (filters.dateRange === "all") return true;

        const now = new Date();
        const movementDate = new Date(movement.date);

        switch (filters.dateRange) {
          case "today":
            return movementDate.toDateString() === now.toDateString();
          case "week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            return movementDate >= weekStart;
          case "month":
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            return movementDate >= monthStart;
          default:
            return true;
        }
      })();

      return matchesType && matchesSearch && matchesDateRange;
    });
  }, [allMovements, filters]);

  const displayedMovements = showAll
    ? filteredMovements
    : filteredMovements.slice(0, 10);

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.dateRange !== "all" ||
    filters.search !== "";

  const clearFilters = () => {
    setFilters({
      type: "all",
      dateRange: "all",
      search: "",
    });
  };

  const handleExportExcel = () => {
    const activeFilters: Record<string, string> = {};

    if (filters.type !== "all") {
      activeFilters.Tipo = filters.type;
    }

    if (filters.dateRange !== "all") {
      activeFilters.Período =
        filters.dateRange === "today"
          ? "Hoy"
          : filters.dateRange === "week"
          ? "Esta semana"
          : "Este mes";
    }

    if (filters.search) {
      activeFilters.Búsqueda = filters.search;
    }

    exportInventoryMovements(filteredMovements, activeFilters);
  };

  const handleExportPDF = () => {
    const reportData = {
      type: "movements",
      dateRange: { from: undefined, to: undefined },
      category: "all",
      supplier: "all",
      batch: "",
      data: filteredMovements,
      generatedAt: new Date(),
      totalItems: filteredMovements.length,
    };
    generatePDF(reportData, "movements");
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
                <TrendingUp className="w-5 h-5 text-primary" />
                Actividad Reciente
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Últimos movimientos de inventario y ventas
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 "
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar" : "Filtros"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 border-border bg-background hover:bg-chart-5 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuItem onClick={handleExportExcel}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filtros */}
        <MovementFilters
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
        />

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="p-3 bg-accent/10 rounded-lg mb-4 border border-accent/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Filtros activos:
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                Limpiar todos
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.type !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                >
                  Tipo: {filters.type}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, type: "all" })}
                  />
                </Badge>
              )}
              {filters.dateRange !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/30"
                >
                  Período:{" "}
                  {filters.dateRange === "today"
                    ? "Hoy"
                    : filters.dateRange === "week"
                    ? "Esta semana"
                    : "Este mes"}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, dateRange: "all" })}
                  />
                </Badge>
              )}
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30"
                >
                  Búsqueda: {filters.search}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, search: "" })}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Lista de movimientos */}
        <MovementList
          movements={displayedMovements}
          filteredMovements={filteredMovements}
          showAll={showAll}
          setShowAll={setShowAll}
          clearFilters={clearFilters}
        />
      </CardContent>
    </Card>
  );
}
