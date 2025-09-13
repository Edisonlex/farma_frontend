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

interface MovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovementDialog({ open, onOpenChange }: MovementDialogProps) {
  const { medications, addMovement } = useInventory();
  const [formData, setFormData] = useState({
    type: "",
    medicationId: "",
    quantity: "",
    reason: "",
    batch: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = "Selecciona el tipo de movimiento";
    }

    if (!formData.medicationId) {
      newErrors.medicationId = "Selecciona un medicamento";
    }

    if (!formData.quantity || Number.parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    }

    if (!formData.batch.trim()) {
      newErrors.batch = "El número de lote es requerido";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "El motivo es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simular una pequeña demora para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Registrar el movimiento usando el contexto
      addMovement(
        formData.type as "entrada" | "salida",
        String(formData.medicationId),
        Number(formData.quantity),
        formData.reason,
      );

      onOpenChange(false);
      setFormData({
        type: "",
        medicationId: "",
        quantity: "",
        reason: "",
        batch: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error al registrar movimiento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({
      type: "",
      medicationId: "",
      quantity: "",
      reason: "",
      batch: "",
    });
    setErrors({});
  };

  const selectedMedication = medications.find(
    (med) => med.id.toString() === formData.medicationId
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
            Registra una nueva entrada o salida de medicamentos del inventario
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Movimiento */}
          <div className="space-y-3">
            <Label
              htmlFor="type"
              className="text-sm font-medium flex items-center gap-2"
            >
              <ArrowUp className="h-4 w-4" />
              Tipo de Movimiento
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData({ ...formData, type: value });
                setErrors({ ...errors, type: "" });
              }}
            >
              <SelectTrigger
                className={cn(
                  "h-11",
                  errors.type && "border-destructive focus:ring-destructive"
                )}
              >
                <SelectValue placeholder="Seleccionar tipo de movimiento" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="entrada" className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                  Entrada de Stock
                </SelectItem>
                <SelectItem value="salida" className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-red-600" />
                  Salida de Stock
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type}</p>
            )}
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
            <Select
              value={formData.medicationId}
              onValueChange={(value) => {
                setFormData({ ...formData, medicationId: value });
                setErrors({ ...errors, medicationId: "" });
              }}
            >
              <SelectTrigger
                className={cn(
                  "h-11",
                  errors.medicationId &&
                    "border-destructive focus:ring-destructive"
                )}
              >
                <SelectValue placeholder="Seleccionar medicamento" />
              </SelectTrigger>
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
            {errors.medicationId && (
              <p className="text-sm text-destructive">{errors.medicationId}</p>
            )}
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
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => {
                  setFormData({ ...formData, quantity: e.target.value });
                  setErrors({ ...errors, quantity: "" });
                }}
                placeholder="0"
                className={cn(
                  "h-11",
                  errors.quantity && "border-destructive focus:ring-destructive"
                )}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="batch"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Número de Lote
              </Label>
              <Input
                id="batch"
                value={formData.batch}
                onChange={(e) => {
                  setFormData({ ...formData, batch: e.target.value });
                  setErrors({ ...errors, batch: "" });
                }}
                placeholder="Ej: LOT-2024-001"
                className={cn(
                  "h-11",
                  errors.batch && "border-destructive focus:ring-destructive"
                )}
              />
              {errors.batch && (
                <p className="text-sm text-destructive">{errors.batch}</p>
              )}
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
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => {
                setFormData({ ...formData, reason: e.target.value });
                setErrors({ ...errors, reason: "" });
              }}
              placeholder="Describe el motivo del movimiento (compra, venta, ajuste, etc.)..."
              rows={3}
              className={cn(
                errors.reason && "border-destructive focus:ring-destructive"
              )}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason}</p>
            )}
          </div>

          {/* Resumen del movimiento */}
          {formData.medicationId && formData.quantity && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-medium text-sm mb-2">
                Resumen del movimiento:
              </h4>
              <p className="text-sm text-muted-foreground">
                {formData.type === "entrada" ? "➕ Entrada" : "➖ Salida"} de{" "}
                <span className="font-semibold">
                  {formData.quantity} unidades
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
            <Button type="submit" disabled={isSubmitting} className="min-w-32">
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
      </DialogContent>
    </Dialog>
  );
}
