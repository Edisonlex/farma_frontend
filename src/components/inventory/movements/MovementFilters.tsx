"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";

interface MovementFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  onShowDialog: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function MovementFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
  onShowDialog,
  onClearFilters,
  hasActiveFilters,
}: MovementFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Movimientos de Inventario
            </h2>
            <p className="text-muted-foreground">
              Registro de entradas y salidas del sistema
            </p>
          </div>
          <Button onClick={onShowDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Movimiento
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar medicamento, lote o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de movimiento" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="entrada">Solo entradas</SelectItem>
              <SelectItem value="salida">Solo salidas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por fecha" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">Más recientes primero</SelectItem>
              <SelectItem value="oldest">Más antiguos primero</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClearFilters} className="gap-2">
              <Filter className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
