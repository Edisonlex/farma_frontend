// components/management/supplier/SupplierDialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useInventory } from "@/context/inventory-context";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  SupplierCreateSchema,
  SupplierUpdateSchema,
  SupplierSchema,
} from "@/lib/schemas";
import type { Supplier } from "@/lib/types";
import { formatEcPhone } from "@/lib/utils";

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
  const [loading, setLoading] = useState(false);
  const { addSupplier, updateSupplier } = useInventory();
  const isEditing = !!supplier;
  const form = useZodForm<{
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
  }>(isEditing ? SupplierUpdateSchema : SupplierCreateSchema, {
    mode: "onChange",
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
        fechaRegistro: (supplier.fechaRegistro ?? new Date())
          .toISOString()
          .slice(0, 10),
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
      <DialogContent className="w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-border/60 shadow-md">
        <DialogHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <DialogTitle className="text-lg sm:text-xl tracking-tight">
            {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base leading-relaxed">
            Valida RUC (13) para empresa o cédula (10) para persona. Teléfono
            con formato Ecuador. La fecha de registro es requerida.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Corrige los campos marcados:{" "}
                  {Object.values(form.formState.errors)
                    .map((e) => e?.message)
                    .filter(Boolean)
                    .join(" · ")}
                </AlertDescription>
              </Alert>
            )}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="p-3 bg-muted rounded-lg text-xs">
                <p className="font-medium mb-1">Consejos</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>RUC empresa: 13 dígitos · Cédula persona: 10</li>
                  <li>Teléfono Ecuador: +593 9XXXXXXXX / 09XXXXXXXX</li>
                  <li>Fecha: AAAA-MM-DD</li>
                </ul>
              </div>
            )}
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
                  <FormDescription>
                    Nombre legal registrado en el SRI o cédula.
                  </FormDescription>
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
                  <FormDescription>
                    Nombre con el que se identifica el negocio públicamente.
                  </FormDescription>
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
                      <Input
                        inputMode="numeric"
                        placeholder="RUC"
                        maxLength={13}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("tipo") === "empresa"
                        ? "Debe ser un RUC válido de 13 dígitos (solo números)"
                        : "Debe ser una cédula válida de 10 dígitos (solo números)"}
                    </FormDescription>
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
                      <Input
                        inputMode="numeric"
                        placeholder="Cédula"
                        maxLength={10}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Debe ser una cédula válida de 10 dígitos (solo números)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
              ) : (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <div className="text-sm px-3 py-2 rounded-md border bg-muted">
                    Activo (por defecto)
                  </div>
                </FormItem>
              )}

              <FormField
                control={form.control}
                name="fechaRegistro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de registro *</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="AAAA-MM-DD"
                        value={field.value || ""}
                        onChange={(e) => {
                          const s = e.target.value.replace(/\D/g, "");
                          let y = s.slice(0, 4);
                          let m = s.slice(4, 6);
                          let d = s.slice(6, 8);
                          const now = new Date();
                          const nowY = now.getFullYear();
                          if (y.length === 4) {
                            let yi = parseInt(y, 10);
                            if (yi < 1900) yi = 1900;
                            if (yi > nowY) yi = nowY;
                            y = String(yi).padStart(4, "0");
                          }
                          if (m.length === 2) {
                            let mi = parseInt(m, 10);
                            if (mi < 1) mi = 1;
                            if (mi > 12) mi = 12;
                            m = String(mi).padStart(2, "0");
                          }
                          if (d.length === 2) {
                            let di = parseInt(d, 10);
                            if (di < 1) di = 1;
                            if (di > 31) di = 31;
                            if (y.length === 4 && m.length === 2) {
                              const yi = parseInt(y, 10);
                              const mi = parseInt(m, 10);
                              const maxDay = new Date(yi, mi, 0).getDate();
                              if (di > maxDay) di = maxDay;
                              // no futuro
                              const candidate = new Date(yi, mi - 1, di);
                              if (candidate > now) {
                                const today = new Date();
                                y = String(today.getFullYear());
                                m = String(today.getMonth() + 1).padStart(
                                  2,
                                  "0",
                                );
                                di = today.getDate();
                              }
                            }
                            d = String(di).padStart(2, "0");
                          }
                          const masked = [y, m, d].filter(Boolean).join("-");
                          field.onChange(masked);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Formato AAAA-MM-DD</FormDescription>
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
                    <FormDescription>
                      Nombre del representante o vendedor asignado.
                    </FormDescription>
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
                      <Input
                        inputMode="tel"
                        placeholder="+593 9XXXXXXXX"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatEcPhone(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Formato Ecuador: +593 9XXXXXXXX / 09XXXXXXXX / 0AXXXXXXX
                    </FormDescription>
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
                      <Input
                        type="email"
                        placeholder="email@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {supplier ? "Actualizar" : "Crear"} Proveedor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
