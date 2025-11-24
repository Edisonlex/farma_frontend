"use client";

import { useState } from "react";

import { Medication } from "@/context/inventory-context";
import { MedicationCard } from "./MedicationCard";

interface MedicationsListProps {
  medications: Medication[];
}

export function MedicationsList({ medications }: MedicationsListProps) {
  const [expandedMedications, setExpandedMedications] = useState<Set<string>>(
    new Set()
  );

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedMedications);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedMedications(newSet);
  };

  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          isExpanded={expandedMedications.has(medication.id.toString())}
          onToggleExpand={() => toggleExpanded(medication.id.toString())}
        />
      ))}
    </div>
  );
}
