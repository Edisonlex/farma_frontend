"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useInventory } from "@/context/inventory-context";
import {
  ArrowUp,
  ArrowDown,
  Package,
  Hash,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useZodForm } from "@/hooks/use-zod-form";
import { InventoryMovementFormSchema } from "@/lib/schemas";
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

interface MovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovementDialog({ open, onOpenChange }: MovementDialogProps) {
  const { medications, addMovement } = useInventory();
  const form = useZodForm<{
    type: "entrada" | "salida";
    medicationId: string;
    quantity: number;
    reason: string;
    batch: string;
  }>(InventoryMovementFormSchema, {
    defaultValues: {
      type: undefined as any,
      medicationId: "",
      quantity: 0,
      reason: "",
      batch: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    try {
      // Simular una pequeña demora para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Registrar el movimiento usando el contexto
      addMovement(
        values.type,
        String(values.medicationId),
        Number(values.quantity),
        values.reason
      );

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error al registrar movimiento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  const selectedMedication = medications.find(
    (med) => med.id.toString() === form.watch("medicationId")
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Nuevo Movimiento de Inventario
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Entrada suma stock y salida lo disminuye. Cantidad entera mayor a 0
            y número de lote obligatorio para trazabilidad.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
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
                  <li>Cantidad: entero mayor a 0</li>
                  <li>Número de lote: requerido para trazabilidad</li>
                </ul>
              </div>
            )}
            {/* Tipo de Movimiento */}
            <div className="space-y-3">
              <Label
                htmlFor="type"
                className="text-sm font-medium flex items-center gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                Tipo de Movimiento
              </Label>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={cn("h-11")}>
                          <SelectValue placeholder="Seleccionar tipo de movimiento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        <SelectItem
                          value="entrada"
                          className="flex items-center gap-2"
                        >
                          <ArrowUp className="h-4 w-4 text-green-600" />
                          Entrada de Stock
                        </SelectItem>
                        <SelectItem
                          value="salida"
                          className="flex items-center gap-2"
                        >
                          <ArrowDown className="h-4 w-4 text-red-600" />
                          Salida de Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Entrada suma stock, salida lo disminuye
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medicamento */}
            <div className="space-y-3">
              <Label
                htmlFor="medication"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Medicamento
              </Label>
              <FormField
                control={form.control}
                name="medicationId"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={cn("h-11")}>
                          <SelectValue placeholder="Seleccionar medicamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        {medications.map((med) => (
                          <SelectItem key={med.id} value={med.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{med.name}</span>
                              <span className="text-xs ">
                                Stock actual: {med.quantity} unidades
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona el medicamento a mover
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cantidad y Lote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label
                  htmlFor="quantity"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Hash className="h-4 w-4" />
                  Cantidad
                </Label>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="0"
                          className={cn("h-11")}
                        />
                      </FormControl>
                      <FormDescription>
                        Debe ser un entero mayor a 0
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="batch"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Número de Lote
                </Label>
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Número de Lote</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: LOT-2024-001"
                          {...field}
                          className={cn("h-11")}
                        />
                      </FormControl>
                      <FormDescription>
                        Obligatorio para trazabilidad
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-3">
              <Label
                htmlFor="reason"
                className="text-sm font-medium flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Motivo del Movimiento
              </Label>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">
                      Motivo del Movimiento
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el motivo del movimiento (compra, venta, ajuste, etc.)..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detalla la razón del movimiento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Resumen del movimiento */}
            {form.watch("medicationId") && form.watch("quantity") && (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium text-sm mb-2">
                  Resumen del movimiento:
                </h4>
                <p className="text-sm text-muted-foreground">
                  {form.watch("type") === "entrada"
                    ? "➕ Entrada"
                    : "➖ Salida"}{" "}
                  de{" "}
                  <span className="font-semibold">
                    {form.watch("quantity")} unidades
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold">
                    {selectedMedication?.name}
                  </span>
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </>
                ) : (
                  "Registrar Movimiento"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
