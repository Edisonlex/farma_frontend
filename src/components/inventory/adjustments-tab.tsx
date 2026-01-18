"use client";

import { useInventory } from "@/context/inventory-context";
import { AdjustmentsStats } from "./adjustments/AdjustmentsStats";
import { AdjustmentForm } from "./adjustments/AdjustmentForm";
import { RecentAdjustments } from "./adjustments/RecentAdjustments";
import { toast } from "sonner";

export function AdjustmentsTab() {
  const { medications, adjustments } = useInventory();

  return (
    <div className="space-y-6">
      <AdjustmentsStats adjustments={adjustments} medications={medications} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdjustmentForm
          onSuccess={() => {
            toast.success("Ajuste aplicado correctamente");
          }}
          onCancel={() => {
            toast.message("Ajuste cancelado");
          }}
        />

        <RecentAdjustments
          adjustments={adjustments}
          medications={medications}
        />
      </div>
    </div>
  );
}
