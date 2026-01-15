"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PredictionData } from "@/lib/analytics-data";
import { useZodForm } from "@/hooks/use-zod-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrderDialogProps {
  medication: PredictionData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const providers = [
  { id: "provider1", name: "Farmacéutica Principal S.A." },
  { id: "provider2", name: "MediSupply Internacional" },
  { id: "provider3", name: "HealthCorp Distribución" },
  { id: "provider4", name: "BioFarma Suministros" },
];

export function OrderDialog({
  medication,
  isOpen,
  onOpenChange,
}: OrderDialogProps) {
  const { toast } = useToast();

  const schema = z.object({
    quantity: z.coerce.number().int().min(1),
    provider: z.string().min(1),
    notes: z.string().max(500).optional(),
  });

  const form = useZodForm<{ quantity: number; provider: string; notes?: string }>(schema, {
    defaultValues: { quantity: 0, provider: "", notes: "" },
  });

  if (!medication) return null;

  const handleConfirmOrder = form.handleSubmit((values) => {
    toast({
      title: "Orden creada",
      description: `Orden de ${values.quantity} unidades de ${medication.medicationName} creada exitosamente.`,
    });
    onOpenChange(false);
  });

  const selectedProviderName = providers.find((p) => p.id === form.getValues("provider"))?.name || "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-accent" />
            </div>
            Crear Orden de Compra
          </DialogTitle>
          <DialogDescription>
            Complete los detalles para la orden de {medication.medicationName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
        <form className="grid gap-4 py-4" onSubmit={handleConfirmOrder}>
          {Object.keys(form.formState.errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Corrige los campos marcados: {Object.values(form.formState.errors).map((e) => e?.message).filter(Boolean).join(" · ")}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label>Medicamento</Label>
            <div className="p-3 bg-muted rounded-lg font-medium">
              {medication.medicationName}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad a Ordenar</FormLabel>
                    <FormControl>
                      <Input id="quantity" type="number" {...field} min={1} max={1000} className="text-lg" />
                    </FormControl>
                    <FormDescription>Entero mayor o igual a 1</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Cantidad Recomendada</Label>
              <div className="p-3 bg-muted rounded-lg text-lg font-semibold">
                {medication.recommendedOrder}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Proveedor requerido para la orden</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales</FormLabel>
                  <FormControl>
                    <Textarea id="notes" {...field} placeholder="Agregue notas adicionales para esta orden..." rows={3} />
                  </FormControl>
                  <FormDescription>Máximo 500 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Resumen de la orden:</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Medicamento:</strong> {medication.medicationName}
              </p>
              <p>
                <strong>Cantidad:</strong> {form.watch("quantity")} unidades
              </p>
              <p>
                <strong>Proveedor:</strong> {selectedProviderName}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge variant="ghost">Pendiente</Badge>
              </p>
            </div>
          </div>
        </form>
        </Form>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleConfirmOrder}>Confirmar Orden</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
