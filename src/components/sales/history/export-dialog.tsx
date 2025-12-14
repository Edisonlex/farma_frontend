import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import type { Sale } from "@/context/sales-context";
import { exportSalesReport } from "@/lib/excel-export";
import { PdfService } from "@/lib/pdf-service";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sales: Sale[];
  filters: { search?: string; status?: string };
}

export function ExportDialog({ open, onOpenChange, sales, filters }: ExportDialogProps) {
  const exportExcel = () => {
    exportSalesReport(sales, filters);
    onOpenChange(false);
  };

  const exportPdf = () => {
    const ok = PdfService.openSalesReportInNewTab(sales);
    if (!ok) {
      PdfService.downloadSalesReport(sales, "Reporte_Ventas.pdf");
    }
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
            <Button variant="ghost" className="flex flex-col h-16" onClick={exportPdf}>
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">PDF</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-16" onClick={exportExcel}>
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
