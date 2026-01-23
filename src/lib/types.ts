export interface Medication {
  id: string;
  name: string;
  batch: string;
  expiryDate: Date;
  quantity: number;
  minStock: number;
  supplier: string;
  category: string;
  activeIngredient?: string;
  price: number;
  location?: string;
  imageUrl?: string;
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

export interface Alert {
  id: string;
  type: "stock_bajo" | "vencimiento" | "vencido" | "tendencia_ventas" | "tarea_tecnica";
  medicationId: string;
  medicationName: string;
  message: string;
  severity: "low" | "medium" | "high";
  date: Date;
  resolved: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  nombreComercial: string;
  razonSocial: string;
  tipo: "empresa" | "persona";
  ruc?: string;
  cedula?: string;
  status: "Activo" | "Inactivo";
  fechaRegistro: Date;
  contact?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  document: string;
  type: "particular" | "empresa" | "institucion";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  birthDate?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  lastPurchase?: Date | null;
  totalPurchases: number;
  totalAmount: number;
  companyName?: string;
  taxId?: string;
  contactPerson?: string;
  website?: string;
}
