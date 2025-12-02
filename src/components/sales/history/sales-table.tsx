import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Eye, RefreshCw, Search } from "lucide-react";
import { Sale } from "@/context/sales-context";
import { SaleStatusBadge } from "./sale-status-badge";
import { PaymentMethodBadge } from "./payment-method-badge";

interface SalesTableProps {
  sales: Sale[];
  onSelectSale: (sale: Sale) => void;
  onCancelSale: (saleId: string) => void;
}

export function SalesTable({
  sales,
  onSelectSale,
  onCancelSale,
}: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-muted-foreground"
      >
        <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No se encontraron ventas</p>
        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
      </motion.div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="font-semibold text-foreground">
              ID Venta
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Fecha
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Cliente
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Items
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Total
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Pago
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Estado
            </TableHead>
            <TableHead className="font-semibold text-foreground text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow
              key={sale.id}
              className="hover:bg-muted/10 transition-colors"
            >
              <TableCell className="font-medium text-foreground">
                {sale.id}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm text-foreground">
                    {sale.date.toLocaleDateString("es-ES")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sale.date.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                {sale.customer.name || "Cliente General"}
              </TableCell>
              <TableCell>
                <Badge variant="ghost" className="font-medium">
                  {sale.items.length}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                ${sale.total.toFixed(2)}
              </TableCell>
              <TableCell>
                <PaymentMethodBadge method={sale.paymentMethod} />
              </TableCell>
              <TableCell>
                <SaleStatusBadge status={sale.status} />
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectSale(sale)}
                        className="h-8 w-8 p-0 text-foreground hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  {sale.status === "Completada" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelSale(sale.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Anular venta"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}
