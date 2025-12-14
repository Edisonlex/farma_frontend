"use client";

import { useState } from "react";

import { useInventory } from "@/context/inventory-context";
import { toast } from "sonner";
import { AdjustmentsStats } from "./adjustments/AdjustmentsStats";
import { AdjustmentForm } from "./adjustments/AdjustmentForm";
import { RecentAdjustments } from "./adjustments/RecentAdjustments";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";
import { createAdjustStockFormSchema } from "@/lib/schemas";

export function AdjustmentsTab() {
  const { medications, adjustStock, adjustments } = useInventory();
  const { user } = useAuth();
  const canAdjust = user ? hasPermission(user.role, "adjust_inventory") : false;
  const [formData, setFormData] = useState({
    medicationId: "",
    type: "",
    quantity: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const medication = medications.find(
      (med) => med.id.toString() === formData.medicationId
    );
    const available = medication ? medication.quantity : 0;
    const schema = createAdjustStockFormSchema(available);
    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0] as string;
      newErrors[path] = issue.message;
    }
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdjust) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Aplicar el ajuste usando el contexto
      adjustStock(
        formData.medicationId,
        formData.type as "increase" | "decrease",
        Number(formData.quantity),
        formData.reason
      );

      toast.success("Ajuste aplicado correctamente", {
        description: `${formData.type === "increase" ? "+" : "-"}${
          formData.quantity
        } unidades`,
      });

      setFormData({
        medicationId: "",
        type: "",
        quantity: "",
        reason: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Error al aplicar el ajuste");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdjustmentsStats adjustments={adjustments} medications={medications} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdjustmentForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          isSubmitting={isSubmitting || !canAdjust}
          medications={medications}
          onSubmit={handleSubmit}
        />

        <RecentAdjustments adjustments={adjustments} />
      </div>
    </div>
  );
}
