"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, ArrowUp, ArrowDown, Filter } from "lucide-react";

interface MovementStatsProps {
  movements: any[];
  filteredCount: number;
}

export function MovementStats({
  movements,
  filteredCount,
}: MovementStatsProps) {
  const stats = {
    total: movements.length,
    entradas: movements.filter((m) => m.type === "entrada").length,
    salidas: movements.filter((m) => m.type === "salida").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Movimientos
              </p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <Package className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50/50 border-green-200/50 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Entradas
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.entradas}
              </p>
            </div>
            <ArrowUp className="h-5 w-5 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-50/50 border-red-200/50 dark:bg-red-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Salidas
              </p>
              <p className="text-2xl font-bold text-red-600">{stats.salidas}</p>
            </div>
            <ArrowDown className="h-5 w-5 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/40 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Filtrados
              </p>
              <p className="text-2xl font-bold">{filteredCount}</p>
            </div>
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
