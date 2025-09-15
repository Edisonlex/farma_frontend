// contexts/inventory-context.tsx
"use client";

import { Category, Supplier } from "@/components/medications";
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
  categories: Category[];
  suppliers: Supplier[];
  addMedication: (medication: Omit<Medication, "id">) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
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
  // Funciones para categorías
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // Funciones para proveedores
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  // Funciones auxiliares
  getCategoryName: (id: string) => string;
  getSupplierName: (id: string) => string;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

// Datos iniciales para categorías y proveedores
const initialCategories: Category[] = [
  { id: "1", name: "Analgésicos", description: "Medicamentos para el dolor" },
  {
    id: "2",
    name: "Antiinflamatorios",
    description: "Medicamentos antiinflamatorios",
  },
  {
    id: "3",
    name: "Antibióticos",
    description: "Medicamentos antibacterianos",
  },
  { id: "4", name: "Gastroprotectores", description: "Protectores gástricos" },
  { id: "5", name: "Antihistamínicos", description: "Para alergias" },
];

const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Laboratorios ABC",
    contact: "Juan Pérez",
    phone: "123-456-7890",
    email: "juan@abc.com",
  },
  {
    id: "2",
    name: "Farmacéutica XYZ",
    contact: "María García",
    phone: "098-765-4321",
    email: "maria@xyz.com",
  },
  {
    id: "3",
    name: "Laboratorios DEF",
    contact: "Carlos López",
    phone: "555-123-4567",
    email: "carlos@def.com",
  },
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  const adjustments = movements.filter(
    (movement) =>
      movement.type === "ajuste" ||
      ((movement.type === "entrada" || movement.type === "salida") &&
        movement.reason.includes("ajuste"))
  );

  // Funciones para medicamentos (existentes)
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

    setMedications((prev) => [...prev, newMedication]);
    setMovements((prev) => [newMovement, ...prev]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) => {
      const originalMedication = prev.find((med) => med.id === id);
      if (!originalMedication) return prev;

      const updatedMedications = prev.map((med) =>
        med.id === id ? { ...med, ...updates, lastUpdated: new Date() } : med
      );

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

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
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

    setMedications((prev) =>
      prev.map((med) =>
        med.id === id
          ? { ...med, quantity: newQuantity, lastUpdated: new Date() }
          : med
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

    setMedications((prev) =>
      prev.map((med) =>
        med.id === medicationId
          ? { ...med, quantity: newQuantity, lastUpdated: new Date() }
          : med
      )
    );
    setMovements((prev) => [newMovement, ...prev]);
  };

  // Funciones para categorías
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    // Verificar si la categoría está en uso
    const isInUse = medications.some((med) => med.category === id);
    if (isInUse) {
      alert(
        "No se puede eliminar la categoría porque está en uso por algunos medicamentos."
      );
      return;
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // Funciones para proveedores
  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
    };
    setSuppliers((prev) => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((sup) => (sup.id === id ? { ...sup, ...updates } : sup))
    );
  };

  const deleteSupplier = (id: string) => {
    // Verificar si el proveedor está en uso
    const isInUse = medications.some((med) => med.supplier === id);
    if (isInUse) {
      alert(
        "No se puede eliminar el proveedor porque está en uso por algunos medicamentos."
      );
      return;
    }
    setSuppliers((prev) => prev.filter((sup) => sup.id !== id));
  };

  // Funciones auxiliares
  const getCategoryName = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Categoría no encontrada";
  };

  const getSupplierName = (id: string) => {
    const supplier = suppliers.find((sup) => sup.id === id);
    return supplier ? supplier.name : "Proveedor no encontrado";
  };

  return (
    <InventoryContext.Provider
      value={{
        medications,
        movements,
        adjustments,
        categories,
        suppliers,
        addMedication,
        updateMedication,
        deleteMedication,
        adjustStock,
        addMovement,
        addCategory,
        updateCategory,
        deleteCategory,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        getCategoryName,
        getSupplierName,
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
