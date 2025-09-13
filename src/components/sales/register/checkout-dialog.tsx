"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Sparkles } from "lucide-react";
import { Customer } from "@/context/sales-context";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  total: number;
  customer: Customer;
  onProcessSale: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  paymentMethod,
  setPaymentMethod,
  total,
  customer,
  onProcessSale,
}: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessSale = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simular procesamiento
    onProcessSale();
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Finalizar Venta
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Método de Pago</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-5"></div>
                  Efectivo
                </SelectItem>
                <SelectItem value="card" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                  Tarjeta
                </SelectItem>
                <SelectItem
                  value="transfer"
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-chart-3"></div>
                  Transferencia
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="text-2xl font-bold text-center text-foreground">
              Total: ${total.toFixed(2)}
            </div>
            <p className="text-sm text-center text-muted-foreground mt-1">
              Incluye IGV 18%
            </p>
          </div>

          {customer.name && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm font-medium text-foreground">
                Cliente: {customer.name}
              </p>
              {customer.document && (
                <p className="text-xs text-muted-foreground">
                  Documento: {customer.document}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleProcessSale}
            className="w-full h-12 text-lg font-semibold"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmar Venta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
