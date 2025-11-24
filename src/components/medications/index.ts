// types/index.ts
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
}

export interface Medication {
  id: string;
  name: string;
  batch: string;
  expiryDate: Date;
  quantity: number;
  minStock: number;
  supplier: string; // Ahora será el ID del proveedor
  category: string; // Ahora será el ID de la categoría
  activeIngredient: string;
  price: number;
  location: string;
  lastUpdated?: Date;
}

export interface InventoryMovement {
  id: string;
  medicationId: string;
  medicationName: string;
  type: "entrada" | "salida" | "ajuste";
  quantity: number;
  date: Date;
  reason: string;
  userId: string;
  userName: string;
}
