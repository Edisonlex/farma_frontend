"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdjustmentForm } from "./AdjustmentForm";
import { useInventory } from "@/context/inventory-context";
import { createAdjustStockFormSchema } from "@/lib/schemas";

export default function StockAdjustDialog({ open, onOpenChange, medicationId }: { open: boolean; onOpenChange: (o: boolean) => void; medicationId: string; }) {
  const { medications, adjustStock } = useInventory();
  const [formData, setFormData] = useState({ medicationId, type: "", quantity: "", reason: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const med = medications.find((m) => m.id.toString() === formData.medicationId);
    const available = med ? med.quantity : 0;
    const schema = createAdjustStockFormSchema(available);
    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const e: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0] as string;
      e[path] = issue.message;
    }
    setErrors(e);
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      adjustStock(formData.medicationId, formData.type as "increase" | "decrease", Number(formData.quantity), formData.reason);
      onOpenChange(false);
      setFormData({ medicationId, type: "", quantity: "", reason: "" });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajustar Stock</DialogTitle>
        </DialogHeader>
        <AdjustmentForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          isSubmitting={isSubmitting}
          medications={medications}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}