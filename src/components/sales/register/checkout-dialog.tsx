"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Sparkles } from "lucide-react";
import { Customer } from "@/context/sales-context";
import { CustomerSelector } from "../process/customer-selector";
import { PaymentMethodSelector } from "../process/payment-method-selector";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";
import { z } from "zod";

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

  const luhnOk = (num: string) => {
    const s = num.replace(/\s+/g, "");
    let sum = 0;
    let flip = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let d = parseInt(s[i], 10);
      if (flip) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      flip = !flip;
    }
    return sum % 10 === 0;
  };
  const expiryValid = (mmYY: string) => {
    const m = /^(\d{2})\/(\d{2})$/.exec(mmYY);
    if (!m) return false;
    const mm = parseInt(m[1], 10);
    const yy = parseInt(m[2], 10);
    if (mm < 1 || mm > 12) return false;
    const year = 2000 + yy;
    const now = new Date();
    const exp = new Date(year, mm, 0, 23, 59, 59, 999);
    return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const schema = useMemo(() => {
    return z.discriminatedUnion("method", [
      z.object({
        method: z.literal("cash"),
        cashReceived: z.coerce.number().min(total, { message: `Debe ser ≥ ${total.toFixed(2)}` }),
      }),
      z.object({
        method: z.literal("transfer"),
        transferCode: z.string().min(1, { message: "Código requerido" }),
      }),
      z.object({
        method: z.literal("card"),
        cardNumber: z.string().regex(/^\d{12,19}$/, { message: "12-19 dígitos" }).refine((v) => luhnOk(v), { message: "Tarjeta inválida (Luhn)" }),
        cardHolder: z.string().min(1, { message: "Titular requerido" }),
        cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, { message: "Formato MM/AA" }).refine((v) => expiryValid(v), { message: "Tarjeta expirada o inválida" }),
        cardCvv: z.string().regex(/^\d{3,4}$/, { message: "3-4 dígitos" }),
      }),
    ]);
  }, [total]);

  const form = useZodForm(schema, {
    mode: "onChange",
    defaultValues: {
      method: paymentMethod,
      cashReceived: "",
      transferCode: "",
      cardNumber: "",
      cardHolder: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  useEffect(() => {
    form.setValue("method", paymentMethod, { shouldValidate: true });
  }, [paymentMethod]);

  const cash = Number(form.watch("cashReceived") || 0);
  const change = Math.max(0, cash - total);

  const handleConfirm = form.handleSubmit(() => {
    setIsProcessing(true);
    onProcessSale();
    setIsProcessing(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Finalizar Venta
          </DialogTitle>
          <DialogDescription>
            Validación en tiempo real: efectivo ≥ total, transferencia con código generado al enfocar, y tarjeta con número (12–19), titular, expiración MM/AA y CVV 3–4.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <CustomerSelector
            customer={customer}
            setCustomer={setCustomer}
            onAddNewCustomer={onAddNewCustomer}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={(m) => {
              setPaymentMethod(m);
              form.setValue("method", m, { shouldValidate: true });
            }}
          />

          <Form {...form}>
            <form className="space-y-4">
              {Object.keys(form.formState.errors).length > 0 && (
                <div className="p-3 bg-muted rounded-lg text-xs">
                  <p className="font-medium mb-1">Consejos</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Efectivo: ingresa un monto ≥ total</li>
                    <li>Tarjeta: 12–19 dígitos, MM/AA y CVV 3–4</li>
                  </ul>
                </div>
              )}
              {paymentMethod === "cash" && (
                <div className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total a cobrar</span>
                    <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="cashReceived"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto recibido</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="Ingresa el efectivo recibido"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>Debe ser al menos el total</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cambio</span>
                    <span className="text-lg font-semibold">${change.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total a transferir</span>
                    <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="transferCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de pago</FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            value={field.value || `TR-${Date.now().toString().slice(-6)}-${Math.floor(total * 100)}`}
                            onFocus={() => form.setValue("transferCode", `TR-${Date.now().toString().slice(-6)}-${Math.floor(total * 100)}`, { shouldValidate: true })}
                          />
                        </FormControl>
                        <FormDescription>Generado automáticamente al enfocar el campo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="p-4 border border-border rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de tarjeta</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890123456" {...field} />
                          {/* ensure controlled */}
                          {/* above spread already sets value; but enforce string fallback */}
                          </FormControl>
                          <FormDescription>12-19 dígitos sin espacios</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="cardHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del titular</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre como aparece en la tarjeta"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>Debe coincidir con el nombre del plástico</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiración (MM/AA)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MM/AA"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>Mes y año; ejemplo: 07/27</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardCvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="***"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>3-4 dígitos de seguridad</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </Form>

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
            onClick={handleConfirm}
            className="w-full h-12 text-lg font-semibold"
            disabled={isProcessing || !form.formState.isValid}
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
