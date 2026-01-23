"use client";

import type React from "react";

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
import { ecuador } from "@/lib/citys";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useZodForm } from "@/hooks/use-zod-form";
import { useToast } from "@/hooks/use-toast";
import { formatEcPhone, formatEcDocument } from "@/lib/utils";
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!client;
  const cantonOptions = ecuador.flatMap((p) => p.cantones.map((c) => ({ canton: c, provincia: p.provincia })));
  const form = useZodForm<{
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
  }>(isEditing ? ClientUpdateSchema : ClientCreateSchema, {
    mode: "onChange",
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
        birthDate: client.birthDate
          ? client.birthDate.toISOString().split("T")[0]
          : "",
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

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const clientData = {
        ...values,
        birthDate: values.birthDate ? new Date(values.birthDate) : null,
      };
      onSave(clientData);
      toast({ title: "Cliente creado", description: "Se agregó el cliente" });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errors: any) => {
    const firstKey = Object.keys(errors)[0];
    const msg = errors[firstKey]?.message || "Revisa los campos requeridos";
    toast({ title: "Formulario inválido", description: msg, variant: "destructive" });
    try {
      // Enfocar y desplazar al primer campo con error
      if (firstKey) {
        form.setFocus(firstKey as any);
        const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-border/60 shadow-md">
        <DialogHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b px-4 sm:px-6 py-3">
          <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight">
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Documento de Ecuador (cédula 10 / RUC 13). Empresas/Instituciones
            requieren nombre y RUC/NIT. Teléfono en formato Ecuador y URL válida
            si se ingresa.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-5 sm:space-y-6 px-4 sm:px-6 py-4"
          >
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Corrige {Object.keys(form.formState.errors).length} campos antes de guardar
                  <div className="mt-2 space-y-1 text-xs">
                    {Object.entries(form.formState.errors).map(([k, v]) => (
                      <div key={k}>{k}: {(v as any)?.message || "Campo inválido"}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {/* Información Básica */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-medium">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Cliente</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-border bg-background">
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="empresa">Empresa</SelectItem>
                          <SelectItem value="institucion">
                            Institución
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Determina campos requeridos y validaciones aplicadas
                      </FormDescription>
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
                      <FormDescription>
                        Nombre legal del cliente
                      </FormDescription>
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
                        <FormDescription>
                          Requerido para empresas o instituciones
                        </FormDescription>
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
                        <FormDescription>
                          Identificación tributaria, validación automática
                        </FormDescription>
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
                        {form.watch("type") === "particular"
                          ? "Cédula/DNI"
                          : "Documento"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          maxLength={
                            form.watch("type") === "particular" ? 10 : 13
                          }
                          placeholder={
                            form.watch("type") === "particular"
                              ? "Cédula 10 dígitos"
                              : "RUC 13 dígitos"
                          }
                          {...field}
                          onChange={(e) => {
                            // Restrict to numbers only
                            const val = e.target.value.replace(/\D/g, "");
                            field.onChange(formatEcDocument(val));
                            form.trigger("document");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                          {form.watch("type") === "particular"
                          ? "Cédula: 10 dígitos numéricos"
                          : "RUC: 13 dígitos numéricos"}
                      </FormDescription>
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
                          <Input
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="AAAA-MM-DD"
                            value={field.value || ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              let y = raw.slice(0, 4);
                              let m = raw.slice(4, 6);
                              let d = raw.slice(6, 8);

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

                                  // Clamp to today if candidate is in the future
                                  const candidate = new Date(yi, mi - 1, di);
                                  if (candidate > now) {
                                    const ty = now.getFullYear();
                                    const tm = now.getMonth() + 1;
                                    const td = now.getDate();
                                    y = String(ty).padStart(4, "0");
                                    m = String(tm).padStart(2, "0");
                                    di = td;
                                  }
                                }
                                d = String(di).padStart(2, "0");
                              }

                              const masked = [y, m, d].filter(Boolean).join("-");
                              field.onChange(masked);
                              // Trigger Zod validation immediately
                              form.trigger("birthDate");
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value && field.value.length > 0
                            ? !form.formState.errors.birthDate && (
                                <span className="text-green-600">✓ Fecha válida</span>
                              )
                            : "Formato AAAA-MM-DD · mayor de 18"}
                        </FormDescription>
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
                        <FormDescription>
                          Nombre del responsable en la empresa/institución
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-medium">
                Información de Contacto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Opcional, para notificaciones y comprobantes
                        electrónicos
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
                      <FormLabel>Teléfono</FormLabel>
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
                      <FormDescription>
                        Formato Ecuador: +593 9XXXXXXXX / 09XXXXXXXX / 0AXXXXXXX
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {(form.watch("type") === "empresa" ||
                form.watch("type") === "institucion") && (
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL completa con protocolo
                      </FormDescription>
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
                    <FormDescription>
                      Calle y número, referencias si aplica
                    </FormDescription>
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
                      <FormLabel>Cantón</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe el cantón"
                          value={field.value || ""}
                          list="canton-list"
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v);
                            const nv = v
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "");
                            if (nv.length >= 2) {
                              const match =
                                cantonOptions.find((o) =>
                                  o.canton
                                    .toLowerCase()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .startsWith(nv)
                                ) ||
                                cantonOptions.find((o) =>
                                  o.canton
                                    .toLowerCase()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .includes(nv)
                                );
                              if (match) {
                                form.setValue("city", match.canton, { shouldValidate: true, shouldDirty: true });
                                form.setValue("state", match.provincia, { shouldValidate: true, shouldDirty: true });
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <datalist id="canton-list">
                        {cantonOptions.map((o) => (
                          <option key={`${o.provincia}-${o.canton}`} value={o.canton} />
                        ))}
                      </datalist>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
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
                      <Textarea
                        placeholder="Información adicional sobre el cliente..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Observaciones internas, máximo 500 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente Activo</FormLabel>
                        <FormControl>
                          <Switch
                            id="isActive"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Desactiva para evitar operaciones sin eliminar datos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Label htmlFor="isActive">Cliente Activo</Label>
                </div>
              ) : (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <div className="text-sm px-3 py-2 rounded-md border bg-muted">
                    Activo (por defecto)
                  </div>
                </FormItem>
              )}
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
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={loading}
                onClick={() => form.handleSubmit(onSubmit, onInvalid)()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>{client ? "Actualizar" : "Crear"} Cliente</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
