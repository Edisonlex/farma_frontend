import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, BarChart3, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sale } from "@/context/sales-context";
import { Button } from "@/components/ui/button";
import { PdfService, type InvoiceData } from "@/lib/pdf-service";

interface SaleDetailDialogProps {
  sale: Sale | null;
  onOpenChange: (open: boolean) => void;
}

export function SaleDetailDialog({
  sale,
  onOpenChange,
}: SaleDetailDialogProps) {
  if (!sale) return null;

  return (
    <Dialog open={!!sale} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalle de Venta {sale.id}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              const invoice: InvoiceData = {
                sale,
                customer: sale.customer,
                invoiceNumber: sale.id,
                businessInfo: {
                  name: "Farmacia Salud Total",
                  address: "Av. Principal #123, Ciudad",
                  ruc: "20100066603",
                  phone: "+51 123 456 789",
                  email: "ventas@farmaciasaludtotal.com",
                },
              };
              const ok = PdfService.openInvoiceInNewTab(invoice);
              if (!ok) {
                PdfService.downloadInvoice(invoice, `Factura-${sale.id}.pdf`);
              }
            }}
          >
            <Printer className="w-4 h-4 mr-2" />
            Ver Comprobante
          </Button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Cliente</p>
              <p className="text-sm text-muted-foreground">
                {sale.customer.name || "Cliente General"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Cajero</p>
              <p className="text-sm text-muted-foreground">{sale.cashier}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Fecha</p>
              <p className="text-sm text-muted-foreground">
                {sale.date.toLocaleString("es-ES")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Método de Pago
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {sale.paymentMethod}
              </p>
            </div>
          </div>

          <Separator className="bg-border/30" />

          <div className="border border-border/30 rounded-lg p-4 bg-muted/10">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Productos y Totales
            </h4>
            <div className="space-y-3">
              {sale.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm p-2 rounded-lg bg-background/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-3 bg-border/30" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="text-foreground">
                  ${sale.subtotal.toFixed(2)}
                </span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-chart-5">
                  <span>Descuento:</span>
                  <span>-${sale.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA (15%):</span>
                <span className="text-foreground">${sale.tax.toFixed(2)}</span>
              </div>
              <Separator className="bg-border/30" />
              <div className="flex justify-between font-bold text-lg text-foreground">
                <span>Total:</span>
                <span>${sale.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
