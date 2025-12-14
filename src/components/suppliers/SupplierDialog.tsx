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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { SupplierCreateSchema, SupplierUpdateSchema, SupplierSchema } from "@/lib/schemas";
import type { Supplier } from "@/lib/types";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier;
  onSave: (supplierData: {
    nombreComercial: string;
    razonSocial: string;
    ruc?: string;
    cedula?: string;
    status: "Activo" | "Inactivo";
    fechaRegistro: Date;
    contact?: string;
    phone?: string;
    email?: string;
  }) => void;
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
    nombreComercial: string;
    razonSocial: string;
    tipo: "empresa" | "persona";
    ruc?: string;
    cedula?: string;
    status: "Activo" | "Inactivo";
    fechaRegistro: string;
    contact?: string;
    phone?: string;
    email?: string;
  }>({
    resolver: zodResolver(isEditing ? SupplierUpdateSchema : SupplierCreateSchema),
    defaultValues: {
      nombreComercial: "",
      razonSocial: "",
      tipo: "empresa",
      ruc: "",
      cedula: "",
      status: "Activo",
      fechaRegistro: new Date().toISOString().slice(0, 10),
      contact: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (supplier) {
      form.reset({
        nombreComercial: supplier.nombreComercial || supplier.name || "",
        razonSocial: supplier.razonSocial || "",
        tipo: supplier.tipo,
        ruc: supplier.ruc || "",
        cedula: supplier.cedula || "",
        status: supplier.status,
        fechaRegistro: (supplier.fechaRegistro ?? new Date()).toISOString().slice(0, 10),
        contact: supplier.contact || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
      });
    } else {
      form.reset({
        nombreComercial: "",
        razonSocial: "",
        tipo: "empresa",
        ruc: "",
        cedula: "",
        status: "Activo",
        fechaRegistro: new Date().toISOString().slice(0, 10),
        contact: "",
        phone: "",
        email: "",
      });
    }
  }, [supplier, open, form]);

  const onSubmit = (values: any) => {
    const payload = {
      ...values,
      ruc: values.tipo === "empresa" ? values.ruc : undefined,
      cedula: values.tipo === "persona" ? values.cedula : undefined,
      fechaRegistro: new Date(values.fechaRegistro),
    };
    if (supplier) {
      updateSupplier(supplier.id, payload);
    } else {
      addSupplier(payload);
    }
    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full border-border bg-background">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-background">
                        <SelectItem value="empresa">Empresa</SelectItem>
                        <SelectItem value="persona">Persona natural</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="razonSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón social *</FormLabel>
                  <FormControl>
                    <Input placeholder="Razón social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombreComercial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre comercial *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre comercial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("tipo") === "empresa" ? (
              <FormField
                control={form.control}
                name="ruc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUC *</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder="RUC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula *</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder="Cédula" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full border-border bg-background">
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-background">
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaRegistro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de registro *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormDescription className="text-xs">Formato Ecuador: +593 9XXXXXXXX / 09XXXXXXXX / 0AXXXXXXX</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
