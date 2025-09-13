"use client";

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
import { User } from "lucide-react";
import { Customer } from "@/context/sales-context";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  setCustomer: (customer: Customer) => void;
}

export function CustomerDialog({
  open,
  onOpenChange,
  customer,
  setCustomer,
}: CustomerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Datos del Cliente
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre (Opcional)</Label>
            <Input
              id="customerName"
              value={customer.name || ""}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              placeholder="Nombre del cliente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerDocument">RUC/DNI (Opcional)</Label>
            <Input
              id="customerDocument"
              value={customer.document || ""}
              onChange={(e) =>
                setCustomer({ ...customer, document: e.target.value })
              }
              placeholder="Número de documento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email (Opcional)</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customer.email || ""}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Guardar Datos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
