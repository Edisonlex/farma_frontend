import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

interface SalesHistoryHeaderProps {
  onExport: () => void;
}

export function SalesHistoryHeader({ onExport }: SalesHistoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-xl font-bold text-foreground">
            Historial de Ventas
          </CardTitle>
          <CardDescription>
            Gestiona y revisa el historial completo de transacciones
          </CardDescription>
        </div>
      </div>
      <Button
        variant="ghost"
        className="bg-background/50 border-border/50"
        onClick={onExport}
      >
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>
    </div>
  );
}
