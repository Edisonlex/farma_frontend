"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PredictionData } from "@/lib/analytics-data";
import { Eye } from "lucide-react";

interface MedicationDetailDialogProps {
  medication: PredictionData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicationDetailDialog({
  medication,
  isOpen,
  onOpenChange,
}: MedicationDetailDialogProps) {
  if (!medication) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            Detalles de {medication.medicationName}
          </DialogTitle>
          <DialogDescription>
            Información completa del análisis predictivo para este medicamento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stock Actual</Label>
              <div className="text-lg font-semibold p-3 bg-muted rounded-lg">
                {medication.currentStock} unidades
              </div>
            </div>
            <div className="space-y-2">
              <Label>Demanda Predicha (30 días)</Label>
              <div className="text-lg font-semibold p-3 bg-muted rounded-lg">
                {medication.predictedDemand} unidades
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nivel de Confianza del Modelo</Label>
            <div className="flex items-center gap-3">
              <Progress value={medication.confidence} className="h-2 flex-1" />
              <span className="font-medium text-lg">
                {medication.confidence}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tendencia</Label>
              <div className="p-3 bg-muted rounded-lg capitalize">
                {medication.trend}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estacionalidad</Label>
              <div className="p-3 bg-muted rounded-lg capitalize">
                {medication.seasonality}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recomendación del Sistema</Label>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm">
                Se recomienda ordenar{" "}
                <strong>{medication.recommendedOrder} unidades</strong> para
                mantener un stock óptimo durante los próximos 30 días y prevenir
                desabastecimiento.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
