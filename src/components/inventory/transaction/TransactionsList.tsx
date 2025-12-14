"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Download } from "lucide-react";
import { TransactionCard } from "./TransactionCard";

interface TransactionsListProps {
  transactions: any[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function TransactionsList({
  transactions,
  hasActiveFilters,
  onClearFilters,
}: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto bg-muted rounded-full p-4 w-max mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {hasActiveFilters
              ? "No se encontraron transacciones"
              : "No hay transacciones registradas"}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {hasActiveFilters
              ? "Intenta ajustar los filtros de búsqueda para encontrar las transacciones que buscas."
              : "Realiza movimientos o ajustes de inventario para ver el historial aquí."}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClearFilters}>
              Limpiar filtros
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}

      {transactions.length > 10 && (
        <div className="flex justify-center">
          <Button variant="ghost" className="gap-2">
            <Download className="h-4 w-4" />
            Cargar más transacciones
          </Button>
        </div>
      )}
    </div>
  );
}
