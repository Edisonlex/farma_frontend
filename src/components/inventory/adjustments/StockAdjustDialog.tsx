"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdjustmentForm } from "./AdjustmentForm";

export default function StockAdjustDialog({
  open,
  onOpenChange,
  medicationId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  medicationId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajustar Stock</DialogTitle>
        </DialogHeader>
        <AdjustmentForm
          initialMedicationId={medicationId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}