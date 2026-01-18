"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Reset page when transactions change (e.g. filters applied)
  if (currentPage > Math.ceil(transactions.length / itemsPerPage) && transactions.length > 0) {
     setCurrentPage(1);
  }

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
      {currentTransactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}

      {/* Pagination Controls */}
      {transactions.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, transactions.length)} de {transactions.length} transacciones
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="text-sm font-medium mx-2">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
