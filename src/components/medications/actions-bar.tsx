"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Package,
  ExternalLink,
  Plus,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { ExportMenu } from "./export-menu";
import type { Medication } from "@/lib/types";

interface ActionsBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  canManage: boolean;
  canViewInventory: boolean;
  openAddDialog: () => void;
  filteredMedications: Medication[];
}

export function ActionsBar({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  canManage,
  canViewInventory,
  openAddDialog,
  filteredMedications,
}: ActionsBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-foreground">
          Gestión de Medicamentos
        </h2>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Sistema activo</span>
        </div>
      </div>

      {/* Main actions section */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Buscar medicamentos por nombre o lote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-background border-border/60 focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant={showFilters ? "secondary" : "ghost"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 transition-all duration-200 hover:shadow-sm"
            size="sm"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden xs:inline">Filtros</span>
          </Button>

          <ExportMenu filteredMedications={filteredMedications} />

          {canManage && (
            <>
              {canViewInventory && (
                <Link href="/inventario">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent border-border/60 hover:bg-secondary/50 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden sm:inline">Inventario</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </Button>
                </Link>
              )}

              <Button
                onClick={openAddDialog}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Medicamento</span>
                <span className="sm:hidden">Agregar</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40">
        <div className="flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          <span>{filteredMedications.length} medicamentos encontrados</span>
        </div>

        {filteredMedications.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span>Datos actualizados</span>
          </div>
        )}
      </div>
    </div>
  );
}
