import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Package,
  AlertTriangle,
  Activity,
  TrendingUp,
  Pill,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useInventory } from "@/context/inventory-context";
import { cn } from "@/lib/utils";

export default function StatsInventory() {
  const { medications } = useInventory();

  const inventoryStats = {
    totalProducts: medications.length,
    lowStock: medications.filter(
      (med) => med.quantity <= med.minStock && med.quantity > 0
    ).length,
    expiringSoon: medications.filter((med) => {
      const today = new Date();
      const diffTime = med.expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length,
    totalValue: medications.reduce(
      (total, med) => total + med.quantity * med.price,
      0
    ),
  };

  // Función para determinar la severidad del stock bajo
  const getLowStockSeverity = (count: number) => {
    if (count === 0) return "none";
    if (count <= 5) return "low";
    if (count <= 10) return "medium";
    return "high";
  };

  const lowStockSeverity = getLowStockSeverity(inventoryStats.lowStock);

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Productos */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50">
        <div className="absolute top-0 right-0 w-20 h-20 -mr-4 -mt-4 bg-primary/10 rounded-full"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">
            Total de Productos
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {inventoryStats.totalProducts}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            medicamentos registrados
          </p>
          <div className="h-1 w-full bg-secondary mt-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (inventoryStats.totalProducts / 200) * 100
                )}%`,
              }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Bajo */}
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50",
          lowStockSeverity === "high" &&
            "border-amber-200/50 bg-amber-50/30 dark:bg-amber-950/20",
          lowStockSeverity === "medium" &&
            "border-amber-100/50 bg-amber-50/10 dark:bg-amber-950/10"
        )}
      >
        <div
          className={cn(
            "absolute top-0 right-0 w-20 h-20 -mr-4 -mt-4 rounded-full",
            lowStockSeverity === "high"
              ? "bg-amber-500/20"
              : lowStockSeverity === "medium"
              ? "bg-amber-400/15"
              : "bg-secondary-foreground/10"
          )}
        ></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">
            Stock Bajo
          </CardTitle>
          <div
            className={cn(
              "p-2 rounded-lg",
              lowStockSeverity === "high"
                ? "bg-amber-500/20"
                : lowStockSeverity === "medium"
                ? "bg-amber-400/15"
                : "bg-secondary-foreground/10"
            )}
          >
            <AlertTriangle
              className={cn(
                "h-4 w-4",
                lowStockSeverity === "high"
                  ? "text-amber-600"
                  : lowStockSeverity === "medium"
                  ? "text-amber-500"
                  : "text-muted-foreground"
              )}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-bold",
              lowStockSeverity === "high"
                ? "text-amber-600"
                : lowStockSeverity === "medium"
                ? "text-amber-500"
                : "text-foreground"
            )}
          >
            {inventoryStats.lowStock}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            requieren reposición
          </p>
          {inventoryStats.lowStock > 0 && (
            <div className="flex items-center mt-2">
              <AlertCircle
                className={cn(
                  "h-3 w-3 mr-1",
                  lowStockSeverity === "high"
                    ? "text-amber-600"
                    : lowStockSeverity === "medium"
                    ? "text-amber-500"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  lowStockSeverity === "high"
                    ? "text-amber-600 font-medium"
                    : lowStockSeverity === "medium"
                    ? "text-amber-500"
                    : "text-muted-foreground"
                )}
              >
                {lowStockSeverity === "high"
                  ? "Alerta crítica"
                  : lowStockSeverity === "medium"
                  ? "Atención necesaria"
                  : "Sin problemas"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Por Vencer */}
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50",
          inventoryStats.expiringSoon > 0 &&
            "border-red-200/50 bg-red-50/30 dark:bg-red-950/20"
        )}
      >
        <div
          className={cn(
            "absolute top-0 right-0 w-20 h-20 -mr-4 -mt-4 rounded-full",
            inventoryStats.expiringSoon > 0
              ? "bg-red-400/20"
              : "bg-secondary-foreground/10"
          )}
        ></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">
            Por Vencer
          </CardTitle>
          <div
            className={cn(
              "p-2 rounded-lg",
              inventoryStats.expiringSoon > 0
                ? "bg-red-400/20"
                : "bg-secondary-foreground/10"
            )}
          >
            <Activity
              className={cn(
                "h-4 w-4",
                inventoryStats.expiringSoon > 0
                  ? "text-red-500"
                  : "text-muted-foreground"
              )}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-bold",
              inventoryStats.expiringSoon > 0
                ? "text-red-500"
                : "text-foreground"
            )}
          >
            {inventoryStats.expiringSoon}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            próximos a vencer
          </p>
          {inventoryStats.expiringSoon > 0 && (
            <div className="flex items-center mt-2">
              <Calendar className="h-3 w-3 mr-1 text-red-500" />
              <span className="text-xs text-red-500">Revisar próximamente</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Valor Total */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50">
        <div className="absolute top-0 right-0 w-20 h-20 -mr-4 -mt-4 bg-green-400/10 rounded-full"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">
            Valor Total
          </CardTitle>
          <div className="p-2 rounded-lg bg-green-400/10">
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${inventoryStats.totalValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            valor del inventario
          </p>
          <div className="flex items-center mt-2">
            <DollarSign className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-xs text-green-500">
              Valor promedio: $
              {(
                inventoryStats.totalValue /
                Math.max(1, inventoryStats.totalProducts)
              ).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
