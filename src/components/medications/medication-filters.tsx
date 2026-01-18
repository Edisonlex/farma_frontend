"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, SlidersHorizontal, Calendar, TestTube } from "lucide-react";
import type { Medication } from "@/lib/types";
import { useInventory } from "@/context/inventory-context";

interface MedicationFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  medications: Medication[];
}

export function MedicationFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  medications,
}: MedicationFiltersProps) {
  const { getCategoryName } = useInventory();
  const getCategoryCount = (category: string) => {
    if (category === "all") return medications.length;
    return medications.filter((med) => med.category === category).length;
  };

  const clearFilters = () => {
    onCategoryChange("all");
  };

  // Get unique statuses for demonstration (you can adapt this based on your data)
  const statuses = ["Activo", "Inactivo", "Pendiente"];

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Filtros Avanzados
              </CardTitle>
              <CardDescription className="text-sm">
                Filtra medicamentos por categorías y estados
              </CardDescription>
            </div>
          </div>
          {selectedCategory !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">
                Categoría
              </label>
            </div>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="bg-background border-border/70 hover:border-border transition-colors">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border/70">
                <SelectItem value="all" className="focus:bg-accent">
                  <div className="flex justify-between items-center w-full">
                    <span>Todas las categorías</span>
                    <Badge variant="ghost" className="ml-2">
                      {getCategoryCount("all")}
                    </Badge>
                  </div>
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="focus:bg-accent"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="capitalize">{getCategoryName(category)}</span>
                      <Badge variant="ghost" className="ml-2">
                        {getCategoryCount(category)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter (example of additional filter) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TestTube className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">
                Estado
              </label>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="bg-background border-border/70 hover:border-border transition-colors">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border/70">
                <SelectItem value="all" className="focus:bg-accent">
                  Todos los estados
                </SelectItem>
                {statuses.map((status) => (
                  <SelectItem
                    key={status}
                    value={status.toLowerCase()}
                    className="focus:bg-accent"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {selectedCategory !== "all" && (
          <div className="space-y-3 pt-4 border-t border-border/40">
            <label className="text-sm font-medium text-foreground">
              Filtros aplicados
            </label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 py-1.5 px-3 bg-primary/10 text-primary border-primary/20"
              >
                <span className="capitalize">{getCategoryName(selectedCategory)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-primary/20 rounded-full"
                  onClick={() => onCategoryChange("all")}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>

              {/* Example additional filter badge */}
              <Badge
                variant="ghost"
                className="flex items-center gap-1 py-1.5 px-3"
              >
                <span>Activo</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-accent rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Medicamentos visibles</span>
            <span className="font-medium text-foreground">
              {selectedCategory === "all"
                ? medications.length
                : getCategoryCount(selectedCategory)}{" "}
              / {medications.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
