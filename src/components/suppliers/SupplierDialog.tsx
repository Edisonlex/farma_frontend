// components/management/supplier/SupplierDialog.tsx
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventory } from "@/context/inventory-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { SupplierCreateSchema, SupplierSchema } from "@/lib/schemas";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: any;
  onSave: (supplierData: any) => void;
}

export function SupplierDialog({
  open,
  onOpenChange,
  supplier,
  onSave,
}: SupplierDialogProps) {
  const { addSupplier, updateSupplier } = useInventory();
  const isEditing = !!supplier;
  const form = useForm<{
    name: string;
    contact?: string;
    phone?: string;
    email?: string;
  }>({
    resolver: zodResolver(isEditing ? SupplierSchema.partial() : SupplierCreateSchema),
    defaultValues: {
      name: "",
      contact: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name,
        contact: supplier.contact || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
      });
    } else {
      form.reset({
        name: "",
        contact: "",
        phone: "",
        email: "",
      });
    }
  }, [supplier, open, form]);

  const onSubmit = (values: any) => {
    if (supplier) {
      updateSupplier(supplier.id, values);
    } else {
      addSupplier(values);
    }
    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona de Contacto (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del contacto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input inputMode="tel" placeholder="+593 9XXXXXXXX" {...field} onChange={(e) => field.onChange(formatEcPhone(e.target.value))} />
                  </FormControl>
                  <FormDescription>Formato Ecuador: +593 9XXXXXXXX / 09XXXXXXXX / 0AXXXXXXX</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{supplier ? "Actualizar" : "Crear"} Proveedor</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
  const formatEcPhone = (v: string) => {
    const s = v.replace(/[^0-9+]/g, "");
    if (s.startsWith("+593")) return "+593 " + s.slice(4).replace(/\s+/g, "");
    return s;
  };
