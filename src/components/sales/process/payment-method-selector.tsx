"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, CircleDollarSign } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Método de Pago</Label>
      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
        <SelectTrigger className="border-border bg-background">
          <SelectValue placeholder="Seleccionar método" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          <SelectItem value="cash" className="flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4" />
            Efectivo
          </SelectItem>
          <SelectItem value="card" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Tarjeta
          </SelectItem>
          <SelectItem value="transfer" className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Transferencia
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
