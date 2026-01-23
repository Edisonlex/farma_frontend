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
import { formatEcPhone } from "@/lib/utils";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const form = useZodForm<{ name?: string; document?: string; email?: string; address?: string; phone?: string; birthDate?: string }>(
    CustomerFormSchema,
    {
      mode: "onChange",
      defaultValues: {
        name: customer?.name || "",
        document: customer?.document || "",
        email: customer?.email || "",
        address: customer?.address || "",
        phone: (customer as any)?.phone || "",
        birthDate: (customer as any)?.birthDate || "",
      },
    }
  );

  // Watch fields for real-time validation
  const watchedFields = form.watch();
  const formErrors = form.formState.errors;
  const formatEcDocument = (v: string) => {
    const s = v.replace(/\D/g, "");
    if (s.length <= 10) return s.slice(0, 10);
    return s.slice(0, 13);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Nuevo Cliente
          </DialogTitle>
          <DialogDescription>
            Documento de Ecuador (cédula 10 / RUC 13). Email opcional para comprobantes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              setCustomer({ ...customer, ...values });
              onOpenChange(false);
            })}
            className="space-y-6 py-2"
          >
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Corrige los campos marcados antes de guardar
                </AlertDescription>
              </Alert>
            )}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="p-3 bg-muted rounded-lg text-xs">
                <p className="font-medium mb-1">Recomendaciones</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Cédula: 10 dígitos · RUC: 13 dígitos</li>
                  <li>Email: formato usuario@dominio.com</li>
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium">Información Básica</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nombre legal del cliente" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            // Trigger validation immediately
                            form.trigger("name");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value && field.value.length > 0 && (
                          <span className={formErrors.name ? "text-red-500" : "text-green-600"}>
                            {formErrors.name ? formErrors.name.message : "✓ Nombre válido"}
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula/RUC</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          maxLength={13}
                          placeholder="Cédula 10 dígitos / RUC 13 dígitos"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatEcDocument(e.target.value);
                            field.onChange(formatted);
                            // Trigger validation immediately
                            form.trigger("document");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value && field.value.length > 0 && (
                          <span className={formErrors.document ? "text-red-500" : "text-green-600"}>
                            {formErrors.document ? formErrors.document.message : "✓ Documento válido"}
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Información de Contacto</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="correo@ejemplo.com" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            // Trigger validation immediately
                            form.trigger("email");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value && field.value.length > 0 && (
                          <span className={formErrors.email ? "text-red-500" : "text-green-600"}>
                            {formErrors.email ? formErrors.email.message : "✓ Email válido"}
                          </span>
                        )}
                        {!field.value && "Para comprobantes y notificaciones."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle y número (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="tel"
                          placeholder="+593 9XXXXXXXX / 09XXXXXXXX"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatEcPhone(e.target.value);
                            field.onChange(formatted);
                            // Trigger validation immediately
                            form.trigger("phone");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value && field.value.length > 0 && (
                          <span className={formErrors.phone ? "text-red-500" : "text-green-600"}>
                            {formErrors.phone ? formErrors.phone.message : "✓ Teléfono válido"}
                          </span>
                        )}
                        {!field.value && "Formato Ecuador válido"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value || ""}
                          max={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            // Trigger validation immediately
                            form.trigger("birthDate");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value && field.value.length > 0
                          ? !formErrors.birthDate && (
                              <span className="text-green-600">✓ Fecha válida</span>
                            )
                          : "Formato AAAA-MM-DD · mayor de 18"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              <Button type="submit" disabled={!form.formState.isValid} className="w-full">
                Guardar Datos
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
