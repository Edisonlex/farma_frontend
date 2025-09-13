"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface NoResultsProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function NoResults({
  hasActiveFilters,
  onClearFilters,
}: NoResultsProps) {
  return (
    <Card>
      <CardContent className="p-8 md:p-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No se encontraron medicamentos
        </h3>
        <p className="text-muted-foreground mb-4">
          Intenta ajustar los filtros de búsqueda para encontrar los
          medicamentos que buscas.
        </p>
        {hasActiveFilters && (
          <Button onClick={onClearFilters}>Limpiar Filtros</Button>
        )}
      </CardContent>
    </Card>
  );
}
