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
import { CheckCircle, Sparkles } from "lucide-react";
import { Customer } from "@/context/sales-context";
import { CustomerSelector } from "../process/customer-selector";
import { PaymentMethodSelector } from "../process/payment-method-selector";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  total: number;
  customer: Customer;
  setCustomer: (customer: Customer) => void;
  onProcessSale: () => void;
  onAddNewCustomer: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  paymentMethod,
  setPaymentMethod,
  total,
  customer,
  setCustomer,
  onProcessSale,
  onAddNewCustomer,
}: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessSale = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
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
          <CustomerSelector
            customer={customer}
            setCustomer={setCustomer}
            onAddNewCustomer={onAddNewCustomer}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

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
