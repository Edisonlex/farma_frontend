import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import type { Sale } from "@/context/sales-context";
import { exportToExcel, exportToPDF } from "@/lib/export";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sales: Sale[];
  filters: { search?: string; status?: string };
}

export function ExportDialog({ open, onOpenChange, sales, filters }: ExportDialogProps) {
  const handleExportExcel = () => {
    const data = sales.map((sale) => ({
      ID: sale.id,
      Cliente: sale.customer?.name || "Consumidor Final",
      Items: sale.items?.length || 0,
      Total: sale.total,
      Método: sale.paymentMethod,
      Fecha: new Date(sale.date).toLocaleDateString("es-ES"),
      Hora: new Date(sale.date).toLocaleTimeString("es-ES"),
    }));

    exportToExcel({
      data,
      fileName: "Reporte_Ventas",
      sheetName: "Ventas",
      title: "Reporte de Ventas",
      columnWidths: [15, 30, 10, 15, 15, 15, 12],
      filters: filters,
    });
    onOpenChange(false);
  };

  const handleExportPdf = () => {
    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Cliente", dataKey: "customer" },
      { header: "Items", dataKey: "items" },
      { header: "Total", dataKey: "total" },
      { header: "Método", dataKey: "method" },
      { header: "Fecha", dataKey: "date" },
    ];

    const data = sales.map((sale) => ({
      id: sale.id,
      customer: sale.customer?.name || "Consumidor Final",
      items: sale.items?.length || 0,
      total: `$${sale.total.toFixed(2)}`,
      method: sale.paymentMethod,
      date: new Date(sale.date).toLocaleDateString("es-ES"),
    }));

    exportToPDF({
      fileName: "Reporte_Ventas",
      title: "Reporte de Ventas",
      columns,
      data,
      orientation: "portrait",
      filters: filters,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Ventas
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Selecciona el formato para exportar las ventas filtradas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="ghost" className="flex flex-col h-16" onClick={handleExportPdf}>
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">PDF</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-16" onClick={handleExportExcel}>
              <FileSpreadsheet className="w-5 h-5 mb-1" />
              <span className="text-xs">Excel</span>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
