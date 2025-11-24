import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface EmptyStateProps {
  search: string;
  onNewClient: () => void;
}

export function EmptyState({ search, onNewClient }: EmptyStateProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-card-foreground">
          No se encontraron clientes
        </h3>
        <p className="text-muted-foreground">
          {search
            ? `No hay resultados para "${search}". Intenta con otros términos de búsqueda.`
            : "No hay clientes registrados. Comienza agregando tu primer cliente."}
        </p>
        {search ? (
          <Button
            variant="ghost"
            className="mt-4 border-border text-card-foreground hover:bg-secondary"
            onClick={() => window.location.reload()}
          >
            Limpiar búsqueda
          </Button>
        ) : (
          <Button
            onClick={onNewClient}
            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Agregar primer cliente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
