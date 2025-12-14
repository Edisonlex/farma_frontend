"use client";

import type React from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { ClientCreateSchema, ClientUpdateSchema } from "@/lib/schemas";

type ClientType = "particular" | "empresa" | "institucion";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: any;
  onSave: (clientData: any) => void;
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
  onSave,
}: ClientDialogProps) {
  const isEditing = !!client;
  const form = useForm<{
    name: string;
    email?: string;
    phone?: string;
    document: string;
    type: ClientType;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    birthDate?: string;
    notes?: string;
    isActive: boolean;
    companyName?: string;
    taxId?: string;
    contactPerson?: string;
    website?: string;
  }>({
    resolver: zodResolver(isEditing ? ClientUpdateSchema : ClientCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document: "",
      type: "particular",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      birthDate: "",
      notes: "",
      isActive: true,
      companyName: "",
      taxId: "",
      contactPerson: "",
      website: "",
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        document: client.document || "",
        type: client.type || "particular",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        birthDate: client.birthDate ? client.birthDate.toISOString().split("T")[0] : "",
        notes: client.notes || "",
        isActive: client.isActive !== false,
        companyName: client.companyName || "",
        taxId: client.taxId || "",
        contactPerson: client.contactPerson || "",
        website: client.website || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        document: "",
        type: "particular",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        birthDate: "",
        notes: "",
        isActive: true,
        companyName: "",
        taxId: "",
        contactPerson: "",
        website: "",
      });
    }
  }, [client, form]);

  const onSubmit = (values: any) => {
    const clientData = {
      ...values,
      birthDate: values.birthDate ? new Date(values.birthDate) : null,
    };
    onSave(clientData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Información Básica */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cliente</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-background">
                        <SelectItem value="particular">Particular</SelectItem>
                        <SelectItem value="empresa">Empresa</SelectItem>
                        <SelectItem value="institucion">Institución</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(form.watch("type") === "empresa" ||
              form.watch("type") === "institucion") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("type") === "empresa"
                          ? "Nombre de la Empresa"
                          : "Nombre de la Institución"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUC/NIT</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("type") === "particular" ? "Cédula/DNI" : "Documento"}
                    </FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" maxLength={13} placeholder={form.watch("type") === "particular" ? "Cédula 10 dígitos" : "RUC 13 dígitos"} {...field} onChange={(e) => field.onChange(formatEcDocument(e.target.value))} />
                    </FormControl>
                    <FormDescription>Ingresa cédula de 10 dígitos o RUC de 13 dígitos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("type") === "particular" && (
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(form.watch("type") === "empresa" ||
                form.watch("type") === "institucion") && (
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona de Contacto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium">
              Información de Contacto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input inputMode="tel" placeholder="+593 9XXXXXXXX" {...field} onChange={(e) => field.onChange(formatEcPhone(e.target.value))} />
                    </FormControl>
                    <FormDescription>Formato Ecuador: +593 9XXXXXXXX / 09XXXXXXXX / 0AXXXXXXX</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(form.watch("type") === "empresa" || form.watch("type") === "institucion") && (
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sitio Web</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium">Dirección</h3>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado/Provincia</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notas y Estado */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Información adicional sobre el cliente..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente Activo</FormLabel>
                    <FormControl>
                      <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="isActive">Cliente Activo</Label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {client ? "Actualizar" : "Crear"} Cliente
            </Button>
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

  const formatEcDocument = (v: string) => {
    const s = v.replace(/\D/g, "");
    if (s.length <= 10) return s.slice(0, 10);
    return s.slice(0, 13);
  };
