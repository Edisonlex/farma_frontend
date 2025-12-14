"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { MovementCard } from "./MovementCard";

interface MovementsListProps {
  movements: any[];
  searchTerm: string;
  typeFilter: string;
  onClearFilters: () => void;
}

export function MovementsList({
  movements,
  searchTerm,
  typeFilter,
  onClearFilters,
}: MovementsListProps) {
  if (movements.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto bg-muted rounded-full p-4 w-max mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm || typeFilter !== "all"
              ? "No se encontraron movimientos"
              : "No hay movimientos registrados"}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {searchTerm || typeFilter !== "all"
              ? "Intenta ajustar los filtros de búsqueda para encontrar los movimientos que buscas."
              : "Crea tu primer movimiento de inventario haciendo clic en 'Nuevo Movimiento'."}
          </p>
          {(searchTerm || typeFilter !== "all") && (
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
      {movements.slice(0, 10).map((movement) => (
        <MovementCard key={movement.id} movement={movement} />
      ))}

      {movements.length > 10 && (
        <div className="flex justify-center">
          <Button variant="ghost">Cargar más movimientos</Button>
        </div>
      )}
    </div>
  );
}
