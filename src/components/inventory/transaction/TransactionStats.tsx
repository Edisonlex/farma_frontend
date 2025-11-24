"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Settings } from "lucide-react";

interface TransactionStatsProps {
  transactions: any[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const stats = {
    total: transactions.length,
    entradas: transactions.filter((t) => t.subtype === "entrada").length,
    salidas: transactions.filter((t) => t.subtype === "salida").length,
    ajustes: transactions.filter((t) => t.type === "adjustment").length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
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
            <TrendingUp className="h-5 w-5 text-green-600" />
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
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ajustes
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.ajustes}
              </p>
            </div>
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
