import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";

interface ClientSearchProps {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
  clientsCount: number;
  onNewClient: () => void;
}

export function ClientSearch({
  search,
  setSearch,
  clearSearch,
  clientsCount,
  onNewClient,
}: ClientSearchProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:max-w-sm relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes por nombre, email, teléfono o documento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 bg-input border-border"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {search && (
              <p className="text-xs text-muted-foreground mt-2">
                Mostrando {clientsCount} clientes
              </p>
            )}
          </div>

          <Button
            onClick={onNewClient}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
