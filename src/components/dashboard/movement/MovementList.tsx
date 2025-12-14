// components/recent-movements/MovementList.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { MovementCard } from "./MovementCard";

interface MovementListProps {
  movements: any[];
  filteredMovements: any[];
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  clearFilters: () => void;
}

export function MovementList({
  movements,
  filteredMovements,
  showAll,
  setShowAll,
  clearFilters,
}: MovementListProps) {
  return (
    <>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Mostrando {movements.length} de {filteredMovements.length} movimientos
        </span>
        {!showAll && filteredMovements.length > 10 && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowAll(true)}
            className="text-primary hover:text-primary/80"
          >
            Ver todos ({filteredMovements.length})
          </Button>
        )}
      </div>

      {/* Lista de movimientos */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay movimientos que coincidan con los filtros</p>
              <Button
                variant="ghost"
                className="mt-4 border-border hover:bg-accent hover:text-accent-foreground"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {movements.map((movement, index) => (
                <MovementCard
                  key={`${movement.id}:${movement.reason}`}
                  movement={movement}
                  index={index}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
