"use client";

import { useState } from "react";

import { useInventory } from "@/context/inventory-context";
import { toast } from "sonner";
import { AdjustmentsStats } from "./adjustments/AdjustmentsStats";
import { AdjustmentForm } from "./adjustments/AdjustmentForm";
import { RecentAdjustments } from "./adjustments/RecentAdjustments";

export function AdjustmentsTab() {
  const { medications, adjustStock, adjustments } = useInventory();
  const [formData, setFormData] = useState({
    medicationId: "",
    type: "",
    quantity: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.medicationId) {
      newErrors.medicationId = "Selecciona un medicamento";
    }

    if (!formData.type) {
      newErrors.type = "Selecciona el tipo de ajuste";
    }

    if (!formData.quantity || Number.parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "El motivo es requerido";
    }

    if (
      formData.type === "decrease" &&
      formData.medicationId &&
      formData.quantity
    ) {
      const medication = medications.find(
        (med) => med.id.toString() === formData.medicationId
      );
      if (
        medication &&
        Number.parseInt(formData.quantity) > medication.quantity
      ) {
        newErrors.quantity = `No hay suficiente stock. Disponible: ${medication.quantity}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          isSubmitting={isSubmitting}
          medications={medications}
          onSubmit={handleSubmit}
        />

        <RecentAdjustments adjustments={adjustments} />
      </div>
    </div>
  );
}
