"use client";

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
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInventory } from "@/context/inventory-context";
import { useMemo } from "react";

interface FiltersSectionProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  stockFilter: string;
  setStockFilter: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

export function FiltersSection({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
  onClearFilters,
}: FiltersSectionProps) {
  const { medications, getCategoryName } = useInventory();

  const categories = useMemo(() => {
    const uniqueCategories = new Set(medications.map((med) => med.category));
    return Array.from(uniqueCategories).sort();
  }, [medications]);

  const formatCategoryName = (categoryId: string) => {
    return getCategoryName(categoryId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Filtros de Búsqueda</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "grid gap-4",
            showFilters ? "grid-cols-1" : "hidden md:grid md:grid-cols-4"
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar medicamento, principio activo o proveedor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todas las categorías" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {formatCategoryName(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estado de stock" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="normal">Stock Normal</SelectItem>
              <SelectItem value="low">Stock Bajo</SelectItem>
              <SelectItem value="out">Sin Stock</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredCount} de {totalCount} medicamentos
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
