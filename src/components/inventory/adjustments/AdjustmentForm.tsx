"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Settings,
  Plus,
  Minus,
  Package,
  AlertTriangle,
  Hash,
  FileText,
  TrendingUp,
  TrendingDown,
  Calculator,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdjustmentFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  isSubmitting: boolean;
  medications: any[];
  onSubmit: (e: React.FormEvent) => void;
}

export function AdjustmentForm({
  formData,
  setFormData,
  errors,
  setErrors,
  isSubmitting,
  medications,
  onSubmit,
}: AdjustmentFormProps) {
  const selectedMedication = medications.find(
    (med) => med.id.toString() === formData.medicationId
  );

  const calculateNewStock = () => {
    if (!selectedMedication || !formData.quantity) return null;

    const currentStock = selectedMedication.quantity;
    const adjustment = parseInt(formData.quantity);

    if (formData.type === "increase") {
      return currentStock + adjustment;
    } else if (formData.type === "decrease") {
      return Math.max(0, currentStock - adjustment);
    }
    return null;
  };

  const newStock = calculateNewStock();

  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Ajuste de Stock
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Realiza ajustes manuales al inventario de medicamentos
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Campos del formulario */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Medicamento */}
            <div className="space-y-3">
              <Label
                htmlFor="medication"
                className="text-sm font-medium flex items-center gap-2 text-foreground"
              >
                <Package className="h-4 w-4 text-primary" />
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
                    "h-12 border-border bg-background shadow-sm rounded-md",
                    errors.medicationId &&
                      "border-destructive ring-destructive/20"
                  )}
                >
                  <SelectValue placeholder="Seleccionar medicamento" />
                </SelectTrigger>
                <SelectContent
                  className="bg-background border-border border shadow-md rounded-md"
                  align="start"
                >
                  {medications.map((med) => (
                    <SelectItem
                      key={med.id}
                      value={med.id.toString()}
                      className="cursor-pointer text-sm px-3 py-2 focus:bg-accent/50"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {med.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Stock actual: {med.quantity} • Mínimo: {med.minStock}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.medicationId && (
                <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.medicationId}
                </p>
              )}
            </div>

            {/* Tipo de Ajuste */}
            <div className="space-y-3">
              <Label
                htmlFor="type"
                className="text-sm font-medium flex items-center gap-2 text-foreground"
              >
                <Settings className="h-4 w-4 text-primary" />
                Tipo de Ajuste
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
                    "h-12 border-border/80 bg-background",
                    errors.type && "border-destructive ring-destructive/20"
                  )}
                >
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem
                    value="increase"
                    className="py-3 focus:bg-green-50 dark:focus:bg-green-950/30 focus:text-green-700 dark:focus:text-green-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                        <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Aumentar Stock</span>
                        <span className="text-xs text-muted-foreground">
                          Agregar unidades al inventario
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="decrease"
                    className="py-3 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-700 dark:focus:text-red-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
                        <Minus className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Disminuir Stock</span>
                        <span className="text-xs text-muted-foreground">
                          Reducir unidades del inventario
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.type}
                </p>
              )}
            </div>
          </div>

          {/* Cantidad */}
          <div className="space-y-3">
            <Label
              htmlFor="quantity"
              className="text-sm font-medium flex items-center gap-2 text-foreground"
            >
              <Hash className="h-4 w-4 text-primary" />
              Cantidad
            </Label>
            <div className="relative">
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
                  "h-12 border-border/80 bg-background pl-10",
                  errors.quantity && "border-destructive ring-destructive/20"
                )}
              />
              <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.quantity && (
              <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.quantity}
              </p>
            )}
          </div>

          {/* Motivo */}
          <div className="space-y-3">
            <Label
              htmlFor="reason"
              className="text-sm font-medium flex items-center gap-2 text-foreground"
            >
              <FileText className="h-4 w-4 text-primary" />
              Motivo del Ajuste
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => {
                setFormData({ ...formData, reason: e.target.value });
                setErrors({ ...errors, reason: "" });
              }}
              placeholder="Describe el motivo del ajuste (vencimiento, daño, corrección, etc.)..."
              rows={3}
              className={cn(
                "border-border/80 bg-background resize-none",
                errors.reason && "border-destructive ring-destructive/20"
              )}
            />
            {errors.reason && (
              <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Resumen del ajuste */}
          {formData.medicationId &&
            formData.quantity &&
            formData.type &&
            selectedMedication && (
              <div className="p-5 bg-muted/30 rounded-xl border border-border/50">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Resumen del Ajuste
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Medicamento:
                      </span>
                      <span className="font-medium text-foreground">
                        {selectedMedication.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Stock actual:
                      </span>
                      <span className="font-medium text-foreground">
                        {selectedMedication.quantity} unidades
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tipo:
                      </span>
                      <span
                        className={cn(
                          "font-medium flex items-center gap-1",
                          formData.type === "increase"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {formData.type === "increase" ? (
                          <>
                            <Plus className="h-4 w-4" />
                            Aumento
                          </>
                        ) : (
                          <>
                            <Minus className="h-4 w-4" />
                            Disminución
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Cantidad:
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          formData.type === "increase"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {formData.type === "increase" ? "+" : "-"}
                        {formData.quantity} unidades
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">
                      Nuevo stock:
                    </span>
                    <span
                      className={cn(
                        "text-lg font-bold flex items-center gap-2",
                        newStock !== null &&
                          newStock <= selectedMedication.minStock
                          ? "text-amber-600"
                          : "text-foreground"
                      )}
                    >
                      {newStock !== null ? (
                        <>
                          {newStock} unidades
                          {newStock <= selectedMedication.minStock && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  {newStock !== null &&
                    newStock <= selectedMedication.minStock && (
                      <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        El stock quedará por debajo del mínimo recomendado
                      </p>
                    )}
                </div>
              </div>
            )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Procesando ajuste...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Aplicar Ajuste
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
