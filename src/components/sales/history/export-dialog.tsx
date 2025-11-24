import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const exportSalesData = () => {
    // Lógica de exportación aquí
    console.log("Exportando datos...");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Datos
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Selecciona el formato para exportar los datos de ventas filtrados.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="ghost" className="flex flex-col h-16">
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">CSV</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-16">
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">Excel</span>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={exportSalesData}>Exportar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
