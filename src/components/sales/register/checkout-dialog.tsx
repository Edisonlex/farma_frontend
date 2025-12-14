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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [cashReceived, setCashReceived] = useState<string>("");
  const [transferCode, setTransferCode] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");

  const numericCash = Number(cashReceived || 0);
  const change = Math.max(0, numericCash - total);

  const canConfirm = (() => {
    if (paymentMethod === "cash") {
      return numericCash >= total;
    }
    if (paymentMethod === "card") {
      return cardNumber.replace(/\s+/g, "").length >= 12 && !!cardHolder && /^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry);
    }
    return true;
  })();

  const handleProcessSale = () => {
    setIsProcessing(true);
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

          {paymentMethod === "cash" && (
            <div className="p-4 border border-border/40 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total a cobrar</span>
                <span className="text-lg font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Label>Monto recibido</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="Ingresa el efectivo recibido"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cambio</span>
                <span className="text-lg font-semibold">${change.toFixed(2)}</span>
              </div>
            </div>
          )}

          {paymentMethod === "transfer" && (
            <div className="p-4 border border-border/40 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total a transferir</span>
                <span className="text-lg font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Label>Código de pago</Label>
                <Input
                  readOnly
                  value={transferCode || `TR-${Date.now().toString().slice(-6)}-${Math.floor(total * 100)}`}
                  onFocus={() => setTransferCode(`TR-${Date.now().toString().slice(-6)}-${Math.floor(total * 100)}`)}
                />
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="p-4 border border-border/40 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label>Número de tarjeta</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div>
                <Label>Nombre del titular</Label>
                <Input
                  placeholder="Nombre como aparece en la tarjeta"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </div>
              <div>
                <Label>Expiración (MM/AA)</Label>
                <Input
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input
                  placeholder="***"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="text-2xl font-bold text-center text-foreground">
              Total: ${total.toFixed(2)}
            </div>
            <p className="text-sm text-center text-muted-foreground mt-1">
              Incluye IVA 15%
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
            disabled={isProcessing || !canConfirm}
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
