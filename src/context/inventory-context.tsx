// contexts/inventory-context.tsx
"use client";

import {
  mockMedications,
  type Medication,
  type InventoryMovement,
} from "@/lib/mock-data";
import React, { createContext, useContext, useState, useEffect } from "react";

interface InventoryContextType {
  medications: Medication[];
  movements: InventoryMovement[];
  adjustments: InventoryMovement[];
  addMedication: (medication: Omit<Medication, "id">) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  adjustStock: (
    id: string,
    type: "increase" | "decrease",
    quantity: number,
    reason: string
  ) => void;
  addMovement: (
    type: "entrada" | "salida" | "ajuste",
    medicationId: string,
    quantity: number,
    reason: string
  ) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const adjustments = movements.filter(
    (movement) =>
      movement.type === "ajuste" ||
      ((movement.type === "entrada" || movement.type === "salida") &&
        movement.reason.includes("ajuste"))
  );


  const addMedication = (medication: Omit<Medication, "id">) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
    };

    const newMovement: InventoryMovement = {
      id: Date.now().toString() + "-movement",
      medicationId: newMedication.id,
      medicationName: newMedication.name,
      type: "entrada",
      quantity: newMedication.quantity,
      date: new Date(),
      reason: "Nuevo medicamento agregado al inventario",
      userId: "current-user",
      userName: "Usuario Actual",
    };

    // Actualizar ambos estados de forma atómica
    setMedications((prev) => [...prev, newMedication]);
    setMovements((prev) => [newMovement, ...prev]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) => {
      const originalMedication = prev.find((med) => med.id === id);
      if (!originalMedication) return prev;

      const updatedMedications = prev.map((med) =>
        med.id === id ? { ...med, ...updates } : med
      );

      // Si la cantidad cambió, crear movimiento de ajuste
      if (
        updates.quantity !== undefined &&
        updates.quantity !== originalMedication.quantity
      ) {
        const quantityDifference =
          updates.quantity - originalMedication.quantity;

        const adjustmentMovement: InventoryMovement = {
          id: Date.now().toString(),
          medicationId: id,
          medicationName: originalMedication.name,
          type: "ajuste",
          quantity: quantityDifference,
          date: new Date(),
          reason: "Actualización de stock",
          userId: "current-user",
          userName: "Usuario Actual",
        };

        setMovements((prevMovements) => [adjustmentMovement, ...prevMovements]);
      }

      return updatedMedications;
    });
  };

  const adjustStock = (
    id: string,
    type: "increase" | "decrease",
    quantity: number,
    reason: string
  ) => {
    const medication = medications.find((m) => m.id === id);
    if (!medication) return;

    const newQuantity =
      type === "increase"
        ? medication.quantity + quantity
        : Math.max(0, medication.quantity - quantity);

    const movementType = type === "increase" ? "entrada" : "salida";

    const newMovement: InventoryMovement = {
      id: Date.now().toString() + "-adjust",
      medicationId: id,
      medicationName: medication.name,
      type: movementType,
      quantity: type === "increase" ? quantity : -quantity,
      date: new Date(),
      reason: reason,
      userId: "current-user",
      userName: "Usuario Actual",
    };

    // Actualizar ambos estados
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, quantity: newQuantity } : med
      )
    );
    setMovements((prev) => [newMovement, ...prev]);
  };

  const addMovement = (
    type: "entrada" | "salida" | "ajuste",
    medicationId: string,
    quantity: number,
    reason: string
  ) => {
    const medication = medications.find((m) => m.id === medicationId);
    if (!medication) return;

    const newQuantity =
      type === "entrada"
        ? medication.quantity + quantity
        : Math.max(0, medication.quantity - quantity);

    const movementQuantity = type === "salida" ? -quantity : quantity;

    const newMovement: InventoryMovement = {
      id: Date.now().toString(),
      medicationId: medicationId,
      medicationName: medication.name,
      type: type,
      quantity: movementQuantity,
      date: new Date(),
      reason: reason,
      userId: "current-user",
      userName: "Usuario Actual",
    };

    // Actualizar ambos estados
    setMedications((prev) =>
      prev.map((med) =>
        med.id === medicationId ? { ...med, quantity: newQuantity } : med
      )
    );
    setMovements((prev) => [newMovement, ...prev]);
  };

  return (
    <InventoryContext.Provider
      value={{
        medications,
        movements,
        adjustments,
        addMedication,
        updateMedication,
        adjustStock,
        addMovement,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error(
      "useInventory debe ser usado dentro de un InventoryProvider"
    );
  }
  return context;
}

export type { Medication };
