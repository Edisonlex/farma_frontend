"use client";

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
import { User } from "lucide-react";
import { Customer } from "@/context/sales-context";
import { useZodForm } from "@/hooks/use-zod-form";
import { CustomerFormSchema } from "@/lib/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

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
  const form = useZodForm<{ name?: string; document?: string; email?: string }>(
    CustomerFormSchema,
    {
      defaultValues: {
        name: customer?.name || "",
        document: customer?.document || "",
        email: customer?.email || "",
      },
    }
  );
  const formatEcDocument = (v: string) => {
    const s = v.replace(/\D/g, "");
    if (s.length <= 10) return s.slice(0, 10);
    return s.slice(0, 13);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Datos del Cliente
          </DialogTitle>
          <DialogDescription>
            Los campos son opcionales. Si se ingresa documento, se valida
            (cédula 10 / RUC 13). Email y teléfono se validan automáticamente
            cuando se proporcionan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4 py-4">
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="p-3 bg-muted rounded-lg text-xs">
                <p className="font-medium mb-1">Consejos</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Cédula: 10 dígitos · RUC: 13 dígitos</li>
                  <li>Email: usuario@dominio.com</li>
                </ul>
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUC/DNI (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      maxLength={13}
                      placeholder="Cédula 10 dígitos o RUC 13 dígitos"
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatEcDocument(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Ingresa cédula (10) o RUC (13). Se validará con reglas de
                    Ecuador.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setCustomer({
                name: "Consumidor Final",
                document: "",
                email: "",
                address: "",
              });
              onOpenChange(false);
            }}
            className="w-full"
          >
            Usar Consumidor Final
          </Button>
          <Button
            onClick={() => {
              const values = form.getValues();
              setCustomer({ ...customer, ...values });
              onOpenChange(false);
            }}
            className="w-full"
          >
            Guardar Datos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
