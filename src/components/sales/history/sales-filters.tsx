import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface SalesFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

export function SalesFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: SalesFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID de venta o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-border/50 focus:border-primary/50"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-48 border-border/50">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="completada">Completadas</SelectItem>
          <SelectItem value="anulada">Anuladas</SelectItem>
          <SelectItem value="pendiente">Pendientes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
