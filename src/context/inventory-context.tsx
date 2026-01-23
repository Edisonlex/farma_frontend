// contexts/inventory-context.tsx
"use client";

import type {
  Category,
  Supplier,
  Medication,
  InventoryMovement,
} from "@/lib/types";
import {
  mockMedications,
  mockMovements,
  mockSuppliers,
  mockCategories,
} from "@/lib/mock-data";
import React, { createContext, useContext, useState, useEffect } from "react";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { getDefaultImageForName, normalizeString } from "@/lib/utils";
import {
  MedicationCreateSchema,
  MedicationUpdateSchema,
  InventoryMovementSchema,
  createAdjustStockFormSchema,
  CategoryCreateSchema,
  CategorySchema,
  SupplierCreateSchema,
  SupplierSchema,
  SupplierUpdateSchema,
} from "@/lib/schemas";
import { useRealtime } from "@/context/realtime-context";

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
  processSupplierReturns: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

// Datos iniciales centralizados desde mock-data
const initialCategories: Category[] = mockCategories;
const initialSuppliers: Supplier[] = mockSuppliers;

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [movements, setMovements] =
    useState<InventoryMovement[]>(mockMovements);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const { user } = useAuth();
  const { clientId, publish, subscribe } = useRealtime();

  const genId = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now().toString()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
    }
  };

  const normalizeImageUrlValue = (
    img: string | File | null | undefined,
    name: string,
  ): string => {
    if (!img) return getDefaultImageForName(name);
    if (typeof img === "string") return img || getDefaultImageForName(name);
    try {
      return URL.createObjectURL(img);
    } catch {
      return getDefaultImageForName(name);
    }
  };

  const adjustments = movements.filter(
    (movement) =>
      movement.type === "ajuste" ||
      ((movement.type === "entrada" || movement.type === "salida") &&
        movement.reason.includes("ajuste"))
  );

  // Persistencia en localStorage
  useEffect(() => {
    try {
      const medsJson = localStorage.getItem("pharmacy-inventory-medications");
      const catsJson = localStorage.getItem("pharmacy-inventory-categories");
      const supsJson = localStorage.getItem("pharmacy-inventory-suppliers");
      if (medsJson) {
        const parsed = JSON.parse(medsJson).map((m: any) => {
          // Force update local images if name matches
          const localImage = getDefaultImageForName(m.name);
          const isLocal = localImage.startsWith("/");
          
          return {
            ...m,
            expiryDate: new Date(m.expiryDate),
            lastUpdated: m.lastUpdated ? new Date(m.lastUpdated) : undefined,
            // Prioritize local image if available, otherwise keep existing or use default
            imageUrl: isLocal ? localImage : (m.imageUrl || localImage),
          };
        });
        setMedications(parsed);
      }
      if (catsJson) {
        setCategories(JSON.parse(catsJson));
      }
      if (supsJson) {
        setSuppliers(JSON.parse(supsJson));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "pharmacy-inventory-medications",
        JSON.stringify(medications)
      );
    } catch {}
  }, [medications]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "pharmacy-inventory-categories",
        JSON.stringify(categories)
      );
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "pharmacy-inventory-suppliers",
        JSON.stringify(suppliers)
      );
    } catch {}
  }, [suppliers]);

  // Funciones para medicamentos (existentes)
  const addMedication = (medication: Omit<Medication, "id">) => {
    const v = MedicationCreateSchema.safeParse(medication);
    if (!v.success) {
      toast.error("Datos de medicamento inválidos");
      return;
    }
    const nameNorm = normalizeString(v.data.name.trim());
    const exists = medications.some(
      (m) => normalizeString(m.name.trim()) === nameNorm,
    );
    if (exists) {
      toast.error("El medicamento ya existe");
      return;
    }
    const newMedication: Medication = {
      ...v.data,
      id: Date.now().toString(),
      imageUrl: normalizeImageUrlValue(v.data.imageUrl as any, v.data.name),
    };

    const newMovement: InventoryMovement = {
      id: genId(),
      medicationId: newMedication.id,
      medicationName: newMedication.name,
      type: "entrada",
      quantity: newMedication.quantity,
      date: new Date(),
      reason: "Nuevo medicamento agregado al inventario",
      userId: user?.id || "current-user",
      userName: user?.name || "Usuario Actual",
    };

    const mv = InventoryMovementSchema.safeParse(newMovement);
    if (!mv.success) {
      toast.error("Movimiento inválido");
      return;
    }
    setMedications((prev) => [...prev, newMedication]);
    setMovements((prev) => [mv.data, ...prev]);
    publish("inventory.medication.add", newMedication);
    publish("inventory.movement.add", mv.data);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    const v = MedicationUpdateSchema.safeParse(updates);
    if (!v.success) {
      toast.error("Actualización de medicamento inválida");
      return;
    }
    if (v.data.name !== undefined && v.data.name.trim()) {
      const nameNorm = normalizeString(v.data.name.trim());
      const exists = medications.some(
        (m) => m.id !== id && normalizeString(m.name.trim()) === nameNorm,
      );
      if (exists) {
        toast.error("Ya existe un medicamento con ese nombre");
        return;
      }
    }
    setMedications((prev) => {
      const originalMedication = prev.find((med) => med.id === id);
      if (!originalMedication) return prev;

      const nextImageUrl =
        (v.data as any).imageUrl !== undefined
          ? normalizeImageUrlValue(
              (v.data as any).imageUrl,
              originalMedication.name,
            )
          : undefined;

      const { imageUrl: _omitImage, ...restUpdates } = v.data as any;

      const updatedMedications = prev.map((med) =>
        med.id === id
          ? {
              ...med,
              ...restUpdates,
              ...(nextImageUrl !== undefined ? { imageUrl: nextImageUrl } : {}),
              lastUpdated: new Date(),
            }
          : med,
      );

      if (
        updates.quantity !== undefined &&
        updates.quantity !== originalMedication.quantity
      ) {
        const quantityDifference =
          updates.quantity - originalMedication.quantity;

        const adjustmentMovement: InventoryMovement = {
          id: genId(),
          medicationId: id,
          medicationName: originalMedication.name,
          type: "ajuste",
          quantity: quantityDifference,
          date: new Date(),
          reason: "Actualización de stock",
          userId: user?.id || "current-user",
          userName: user?.name || "Usuario Actual",
        };
        const mv = InventoryMovementSchema.safeParse(adjustmentMovement);
        if (!mv.success) {
          toast.error("Movimiento de ajuste inválido");
        } else {
          setMovements((prevMovements) => [mv.data, ...prevMovements]);
          publish("inventory.movement.add", mv.data);
        }
      }

      return updatedMedications;
    });
    publish("inventory.medication.update", { id, updates: v.data });
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
    publish("inventory.medication.delete", { id });
  };

  const adjustStock = (
    id: string,
    type: "increase" | "decrease",
    quantity: number,
    reason: string
  ) => {
    const medication = medications.find((m) => m.id === id);
    if (!medication) {
      toast.error("Medicamento no encontrado");
      return;
    }

    const schema = createAdjustStockFormSchema(medication.quantity);
    const inputValidation = schema.safeParse({
      medicationId: id,
      type: type === "increase" ? "increase" : "decrease",
      quantity,
      reason,
    });
    if (!inputValidation.success) {
      toast.error(
        inputValidation.error.issues[0]?.message || "Ajuste inválido"
      );
      return;
    }

    const newQuantity =
      type === "increase"
        ? medication.quantity + quantity
        : Math.max(0, medication.quantity - quantity);

    const movementType = "ajuste";

    const newMovement: InventoryMovement = {
      id: Date.now().toString() + "-adjust",
      medicationId: id,
      medicationName: medication.name,
      type: movementType,
      quantity: type === "increase" ? quantity : -quantity,
      date: new Date(),
      reason: reason,
      userId: user?.id || "current-user",
      userName: user?.name || "Usuario Actual",
    };
    const mv = InventoryMovementSchema.safeParse(newMovement);
    if (!mv.success) {
      toast.error("Movimiento de ajuste inválido");
      return;
    }
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id
          ? { ...med, quantity: newQuantity, lastUpdated: new Date() }
          : med
      )
    );
    setMovements((prev) => [mv.data, ...prev]);
  };

  const addMovement = (
    type: "entrada" | "salida" | "ajuste",
    medicationId: string,
    quantity: number,
    reason: string
  ) => {
    const inputSchema = z.object({
      type: z.enum(["entrada", "salida", "ajuste"]),
      medicationId: z.string().min(1),
      quantity: z.number().int().min(1),
      reason: z.string().min(1),
    });
    const iv = inputSchema.safeParse({ type, medicationId, quantity, reason });
    if (!iv.success) {
      toast.error("Movimiento inválido");
      return;
    }

    const medication = medications.find((m) => m.id === medicationId);
    if (!medication) {
      toast.error("Medicamento no encontrado");
      return;
    }

    if (type === "salida" && quantity > medication.quantity) {
      toast.error("Stock insuficiente");
      return;
    }

    const newQuantity =
      type === "entrada"
        ? medication.quantity + quantity
        : Math.max(0, medication.quantity - quantity);

    const movementQuantity = type === "salida" ? -quantity : quantity;

    const newMovement: InventoryMovement = {
      id: genId(),
      medicationId: medicationId,
      medicationName: medication.name,
      type: type,
      quantity: movementQuantity,
      date: new Date(),
      reason: reason,
      userId: user?.id || "current-user",
      userName: user?.name || "Usuario Actual",
    };
    const mv = InventoryMovementSchema.safeParse(newMovement);
    if (!mv.success) {
      toast.error("Movimiento inválido");
      return;
    }
    setMedications((prev) =>
      prev.map((med) =>
        med.id === medicationId
          ? { ...med, quantity: newQuantity, lastUpdated: new Date() }
          : med
      )
    );
    setMovements((prev) => [mv.data, ...prev]);
    publish("inventory.movement.add", mv.data);
  };

  const generateBatch = (name: string) => {
    const prefix =
      (name || "")
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase() || "LOT";
    const suffix = Date.now().toString().slice(-5);
    return `${prefix}${suffix}`;
  };

  const processSupplierReturns = () => {
    const today = new Date();
    medications.forEach((med) => {
      const diffDays = Math.ceil(
        (med.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 0 && med.quantity > 0) {
        addMovement(
          "salida",
          med.id,
          med.quantity,
          "Devolución a proveedor (vencido)"
        );
        const newExpiry = new Date(today);
        newExpiry.setMonth(newExpiry.getMonth() + 12);
        const newBatch = generateBatch(med.name);
        updateMedication(med.id, { expiryDate: newExpiry, batch: newBatch });
        addMovement(
          "entrada",
          med.id,
          med.quantity,
          "Reposición por proveedor (nuevo lote)"
        );
      }
    });
    toast.success("Devoluciones de productos vencidos procesadas");
  };

  // Ejecución automática diaria para productos vencidos
  useEffect(() => {
    try {
      const key = "pharmacy-returns-last-run";
      const last = localStorage.getItem(key);
      const todayStr = new Date().toDateString();
      if (last !== todayStr) {
        processSupplierReturns();
        localStorage.setItem(key, todayStr);
      }
      const interval = setInterval(() => {
        const nowStr = new Date().toDateString();
        const lr = localStorage.getItem(key);
        if (lr !== nowStr) {
          processSupplierReturns();
          localStorage.setItem(key, nowStr);
        }
      }, 6 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    } catch {}
  }, []);

  // Funciones para categorías
  const addCategory = (category: Omit<Category, "id">) => {
    const v = CategoryCreateSchema.safeParse(category);
    if (!v.success) {
      toast.error("Categoría inválida");
      return;
    }
    const nameNorm = normalizeString(v.data.name.trim());
    const exists = categories.some(
      (c) => normalizeString(c.name.trim()) === nameNorm,
    );
    if (exists) {
      toast.error("La categoría ya existe");
      return;
    }
    const newCategory: Category = {
      ...v.data,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    publish("inventory.category.add", newCategory);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const v = CategorySchema.partial().safeParse(updates);
    if (!v.success) {
      toast.error("Actualización de categoría inválida");
      return;
    }
    if (v.data.name !== undefined) {
      const nameNorm = normalizeString(String(v.data.name).trim());
      const exists = categories.some(
        (c) => c.id !== id && normalizeString(c.name.trim()) === nameNorm,
      );
      if (exists) {
        toast.error("Ya existe una categoría con ese nombre");
        return;
      }
    }
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...v.data } : cat))
    );
    publish("inventory.category.update", { id, updates: v.data });
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
    publish("inventory.category.delete", { id });
  };

  // Funciones para proveedores
  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const v = SupplierCreateSchema.safeParse(supplier);
    if (!v.success) {
      toast.error("Proveedor inválido");
      return;
    }
    const nameKey = normalizeString((v.data.nombreComercial || v.data.razonSocial || "").trim());
    const exists = suppliers.some((s) => normalizeString((s.nombreComercial || s.razonSocial || s.name || "").trim()) === nameKey);
    if (exists) {
      toast.error("El proveedor ya existe");
      return;
    }
    const rucNum = (v.data.ruc || "").replace(/\D/g, "");
    if (rucNum) {
      const rucExists = suppliers.some((s) => (s.ruc || "").replace(/\D/g, "") === rucNum);
      if (rucExists) {
        toast.error("RUC ya registrado");
        return;
      }
    }
    const cedNum = (v.data.cedula || "").replace(/\D/g, "");
    if (cedNum) {
      const cedExists = suppliers.some((s) => (s.cedula || "").replace(/\D/g, "") === cedNum);
      if (cedExists) {
        toast.error("Cédula ya registrada");
        return;
      }
    }
    const newSupplier: Supplier = {
      ...v.data,
      name: v.data.nombreComercial || v.data.razonSocial,
      id: Date.now().toString(),
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    publish("inventory.supplier.add", newSupplier);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    const v = SupplierUpdateSchema.safeParse(updates);
    if (!v.success) {
      toast.error("Actualización de proveedor inválida");
      return;
    }
    const candidateName = v.data.nombreComercial ?? v.data.razonSocial;
    if (candidateName !== undefined) {
      const nameKey = normalizeString(String(candidateName).trim());
      const exists = suppliers.some((s) => s.id !== id && normalizeString((s.nombreComercial || s.razonSocial || s.name || "").trim()) === nameKey);
      if (exists) {
        toast.error("Ya existe un proveedor con ese nombre");
        return;
      }
    }
    if (v.data.ruc !== undefined) {
      const rucNum = String(v.data.ruc || "").replace(/\D/g, "");
      if (rucNum) {
        const rucExists = suppliers.some((s) => s.id !== id && (s.ruc || "").replace(/\D/g, "") === rucNum);
        if (rucExists) {
          toast.error("RUC ya registrado");
          return;
        }
      }
    }
    if (v.data.cedula !== undefined) {
      const cedNum = String(v.data.cedula || "").replace(/\D/g, "");
      if (cedNum) {
        const cedExists = suppliers.some((s) => s.id !== id && (s.cedula || "").replace(/\D/g, "") === cedNum);
        if (cedExists) {
          toast.error("Cédula ya registrada");
          return;
        }
      }
    }
    setSuppliers((prev) =>
      prev.map((sup) =>
        sup.id === id
          ? {
              ...sup,
              ...v.data,
              name:
                v.data.nombreComercial !== undefined
                  ? v.data.nombreComercial
                  : sup.name,
            }
          : sup
      )
    );
    publish("inventory.supplier.update", { id, updates: v.data });
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
    publish("inventory.supplier.delete", { id });
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

  useEffect(() => {
    const unsub1 = subscribe("inventory.medication.add", (med: Medication, source) => {
      if (source === clientId) return;
      setMedications((prev) => [...prev, med]);
    });
    const unsub2 = subscribe("inventory.medication.update", (data: { id: string; updates: Partial<Medication> }, source) => {
      if (source === clientId) return;
      setMedications((prev) => prev.map((m) => (m.id === data.id ? { ...m, ...data.updates, lastUpdated: new Date() } : m)));
    });
    const unsub3 = subscribe("inventory.medication.delete", (data: { id: string }, source) => {
      if (source === clientId) return;
      setMedications((prev) => prev.filter((m) => m.id !== data.id));
    });
    const unsub4 = subscribe("inventory.movement.add", (mv: InventoryMovement, source) => {
      if (source === clientId) return;
      setMovements((prev) => [mv, ...prev]);
    });
    const unsub5 = subscribe("inventory.category.add", (cat: Category, source) => {
      if (source === clientId) return;
      setCategories((prev) => [...prev, cat]);
    });
    const unsub6 = subscribe("inventory.category.update", (data: { id: string; updates: Partial<Category> }, source) => {
      if (source === clientId) return;
      setCategories((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data.updates } : c)));
    });
    const unsub7 = subscribe("inventory.category.delete", (data: { id: string }, source) => {
      if (source === clientId) return;
      setCategories((prev) => prev.filter((c) => c.id !== data.id));
    });
    const unsub8 = subscribe("inventory.supplier.add", (sup: Supplier, source) => {
      if (source === clientId) return;
      setSuppliers((prev) => [...prev, sup]);
    });
    const unsub9 = subscribe("inventory.supplier.update", (data: { id: string; updates: Partial<Supplier> }, source) => {
      if (source === clientId) return;
      setSuppliers((prev) => prev.map((s) => (s.id === data.id ? { ...s, ...data.updates } : s)));
    });
    const unsub10 = subscribe("inventory.supplier.delete", (data: { id: string }, source) => {
      if (source === clientId) return;
      setSuppliers((prev) => prev.filter((s) => s.id !== data.id));
    });
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
      unsub7();
      unsub8();
      unsub9();
      unsub10();
    };
  }, [clientId, subscribe]);

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
        processSupplierReturns,
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
