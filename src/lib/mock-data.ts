export interface Medication {
  id: string;
  name: string;
  batch: string;
  expiryDate: Date;
  quantity: number;
  minStock: number;
  supplier: string;
  category: string;
  activeIngredient: string;
  price: number;
  location: string;
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
  contact?: string;
  phone?: string;
  email?: string;
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

export const roleDemoAlerts: {
  administrador: Alert[];
  farmaceutico: Alert[];
  tecnico: Alert[];
} = {
  administrador: [
    {
      id: "demo-admin-ventas-trend",
      type: "tendencia_ventas",
      medicationId: "1",
      medicationName: "Paracetamol 500mg",
      message: "Consumo alto en el último mes: salidas > entradas",
      severity: "low",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-admin-stock-bajo",
      type: "stock_bajo",
      medicationId: "2",
      medicationName: "Ibuprofeno 400mg",
      message: "Stock bajo en sucursal principal (8/30)",
      severity: "medium",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-admin-vencimiento-multiple",
      type: "vencimiento",
      medicationId: "4",
      medicationName: "Omeprazol 20mg",
      message: "Lotes por vencer en menos de 10 días",
      severity: "medium",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-admin-stock-critico",
      type: "stock_bajo",
      medicationId: "5",
      medicationName: "Loratadina 10mg",
      message: "Stock crítico en sucursal norte (0 unidades)",
      severity: "high",
      date: new Date(),
      resolved: false,
    },
  ],
  farmaceutico: [
    {
      id: "demo-farma-stock-bajo",
      type: "stock_bajo",
      medicationId: "5",
      medicationName: "Loratadina 10mg",
      message: "Stock por debajo del mínimo (5/25)",
      severity: "high",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-farma-vencimiento",
      type: "vencimiento",
      medicationId: "3",
      medicationName: "Amoxicilina 250mg",
      message: "Vence en 20 días",
      severity: "medium",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-farma-tendencia-ventas",
      type: "tendencia_ventas",
      medicationId: "1",
      medicationName: "Paracetamol 500mg",
      message: "Alta rotación, considerar reposición",
      severity: "low",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-farma-vencido",
      type: "vencido",
      medicationId: "2",
      medicationName: "Ibuprofeno 400mg",
      message: "Un lote vencido en almacén",
      severity: "high",
      date: new Date(),
      resolved: false,
    },
  ],
  tecnico: [
    {
      id: "demo-tecnico-tarea-1",
      type: "tarea_tecnica",
      medicationId: "5",
      medicationName: "Loratadina 10mg",
      message: "Realizar conteo físico y etiquetado en estantería",
      severity: "medium",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-tecnico-tarea-2",
      type: "tarea_tecnica",
      medicationId: "2",
      medicationName: "Ibuprofeno 400mg",
      message: "Actualizar etiqueta y ubicación en anaquel",
      severity: "low",
      date: new Date(),
      resolved: false,
    },
    {
      id: "demo-tecnico-tarea-3",
      type: "tarea_tecnica",
      medicationId: "3",
      medicationName: "Amoxicilina 250mg",
      message: "Verificar lote y registrar datos faltantes",
      severity: "medium",
      date: new Date(),
      resolved: false,
    },
  ],
};

export const mockSuppliers: Supplier[] = [
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

export const mockCategories: Category[] = [
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

// Mock medications data
export const mockMedications: Medication[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    batch: "PAR001",
    expiryDate: new Date("2025-06-15"),
    quantity: 150,
    minStock: 50,
    supplier: "3",
    category: "1",
    activeIngredient: "Paracetamol",
    price: 2.5,
    location: "A1-B2",
  },
  {
    id: "2",
    name: "Ibuprofeno 400mg",
    batch: "IBU002",
    expiryDate: new Date("2024-12-30"),
    quantity: 8,
    minStock: 30,
    supplier: "1",
    category: "2",
    activeIngredient: "Ibuprofeno",
    price: 3.75,
    location: "A2-C1",
  },
  {
    id: "3",
    name: "Amoxicilina 250mg",
    batch: "AMX003",
    expiryDate: new Date("2024-11-20"),
    quantity: 80,
    minStock: 40,
    supplier: "2",
    category: "3",
    activeIngredient: "Amoxicilina",
    price: 5.2,
    location: "B1-A3",
  },
  {
    id: "4",
    name: "Omeprazol 20mg",
    batch: "OME004",
    expiryDate: new Date("2025-03-10"),
    quantity: 200,
    minStock: 60,
    supplier: "2",
    category: "4",
    activeIngredient: "Omeprazol",
    price: 4.1,
    location: "C1-B1",
  },
  {
    id: "5",
    name: "Loratadina 10mg",
    batch: "LOR005",
    expiryDate: new Date("2024-10-05"),
    quantity: 5,
    minStock: 25,
    supplier: "2",
    category: "5",
    activeIngredient: "Loratadina",
    price: 1.8,
    location: "D1-A2",
  },
  {
    id: "6",
    name: "Cetirizina 10mg",
    batch: "LOR005",
    expiryDate: new Date("2024-10-05"),
    quantity: 15,
    minStock: 25,
    supplier: "2",
    category: "5",
    activeIngredient: "Cetirizina",
    price: 1.8,
    location: "D1-A2",
  },
];

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "stock_bajo",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    message: "Stock por debajo del mínimo (25/30)",
    severity: "high",
    date: new Date(),
    resolved: false,
  },
  {
    id: "2",
    type: "vencimiento",
    medicationId: "5",
    medicationName: "Loratadina 10mg",
    message: "Vence en 15 días",
    severity: "medium",
    date: new Date(),
    resolved: false,
  },
  {
    id: "3",
    type: "stock_bajo",
    medicationId: "5",
    medicationName: "Loratadina 10mg",
    message: "Stock por debajo del mínimo (15/25)",
    severity: "high",
    date: new Date(),
    resolved: false,
  },
];

// Mock inventory movements
export const mockMovements: InventoryMovement[] = [
  {
    id: "1",
    medicationId: "1",
    medicationName: "Paracetamol 500mg",
    type: "entrada",
    quantity: 100,
    date: new Date("2024-01-15"),
    reason: "Compra mensual",
    userId: "1",
    userName: "Dr. María González",
  },
  {
    id: "2",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "salida",
    quantity: 15,
    date: new Date("2024-01-14"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "3",
    medicationId: "3",
    medicationName: "Amoxicilina 250mg",
    type: "ajuste",
    quantity: -5,
    date: new Date("2024-01-13"),
    reason: "Corrección de inventario",
    userId: "3",
    userName: "Ana López",
  },
  {
    id: "1001",
    medicationId: "1",
    medicationName: "Paracetamol 500mg",
    type: "salida",
    quantity: 22,
    date: new Date("2025-08-05"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1002",
    medicationId: "1",
    medicationName: "Paracetamol 500mg",
    type: "salida",
    quantity: 18,
    date: new Date("2025-08-20"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1003",
    medicationId: "1",
    medicationName: "Paracetamol 500mg",
    type: "salida",
    quantity: 25,
    date: new Date("2025-09-12"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1004",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "salida",
    quantity: 12,
    date: new Date("2025-08-10"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1005",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "salida",
    quantity: 10,
    date: new Date("2025-09-18"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1019",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "salida",
    quantity: 18,
    date: new Date("2025-10-12"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1020",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "salida",
    quantity: 22,
    date: new Date("2025-10-29"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1021",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "salida",
    quantity: 26,
    date: new Date("2025-11-11"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1006",
    medicationId: "3",
    medicationName: "Amoxicilina 250mg",
    type: "salida",
    quantity: 8,
    date: new Date("2025-08-22"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1007",
    medicationId: "3",
    medicationName: "Amoxicilina 250mg",
    type: "salida",
    quantity: 11,
    date: new Date("2025-09-06"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1008",
    medicationId: "4",
    medicationName: "Omeprazol 20mg",
    type: "salida",
    quantity: 30,
    date: new Date("2025-08-15"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1009",
    medicationId: "4",
    medicationName: "Omeprazol 20mg",
    type: "salida",
    quantity: 28,
    date: new Date("2025-09-20"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1010",
    medicationId: "5",
    medicationName: "Loratadina 10mg",
    type: "salida",
    quantity: 14,
    date: new Date("2025-09-01"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1011",
    medicationId: "5",
    medicationName: "Loratadina 10mg",
    type: "salida",
    quantity: 18,
    date: new Date("2025-10-05"),
    reason: "Venta por temporada",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1012",
    medicationId: "6",
    medicationName: "Cetirizina 10mg",
    type: "salida",
    quantity: 9,
    date: new Date("2025-08-28"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1013",
    medicationId: "1",
    medicationName: "Paracetamol 500mg",
    type: "entrada",
    quantity: 60,
    date: new Date("2025-10-12"),
    reason: "Reposición",
    userId: "1",
    userName: "Dr. María González",
  },
  {
    id: "1014",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "ajuste",
    quantity: -3,
    date: new Date("2025-10-18"),
    reason: "Vencimiento parcial",
    userId: "1",
    userName: "Dr. María González",
  },
  {
    id: "1015",
    medicationId: "3",
    medicationName: "Amoxicilina 250mg",
    type: "ajuste",
    quantity: 5,
    date: new Date("2025-11-02"),
    reason: "Corrección de conteo",
    userId: "1",
    userName: "Dr. María González",
  },
  {
    id: "1016",
    medicationId: "4",
    medicationName: "Omeprazol 20mg",
    type: "salida",
    quantity: 26,
    date: new Date("2025-11-08"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1017",
    medicationId: "5",
    medicationName: "Loratadina 10mg",
    type: "salida",
    quantity: 20,
    date: new Date("2025-11-10"),
    reason: "Venta temporada alergias",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "1018",
    medicationId: "1",
    medicationName: "Paracetamol 500mg",
    type: "salida",
    quantity: 24,
    date: new Date("2025-11-12"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "2001",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "entrada",
    quantity: 40,
    date: new Date("2025-11-20"),
    reason: "Reposición urgente",
    userId: "1",
    userName: "Dr. María González",
  },
  {
    id: "2002",
    medicationId: "2",
    medicationName: "Ibuprofeno 400mg",
    type: "salida",
    quantity: 16,
    date: new Date("2025-11-21"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "2003",
    medicationId: "5",
    medicationName: "Loratadina 10mg",
    type: "ajuste",
    quantity: -4,
    date: new Date("2025-11-22"),
    reason: "Corrección de conteo",
    userId: "1",
    userName: "Dr. María González",
  },
  {
    id: "2004",
    medicationId: "3",
    medicationName: "Amoxicilina 250mg",
    type: "salida",
    quantity: 13,
    date: new Date("2025-11-23"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
  {
    id: "2005",
    medicationId: "4",
    medicationName: "Omeprazol 20mg",
    type: "entrada",
    quantity: 50,
    date: new Date("2025-11-23"),
    reason: "Compra semanal",
    userId: "1",
    userName: "Dr. María González",
  },
  {
    id: "2006",
    medicationId: "1",
    medicationName: "Paracetamol 500mg",
    type: "salida",
    quantity: 19,
    date: new Date("2025-11-24"),
    reason: "Venta",
    userId: "2",
    userName: "Carlos Rodríguez",
  },
];

// Analytics data
export const getInventoryAnalytics = () => {
  const totalMedications = mockMedications.length;
  const totalValue = mockMedications.reduce(
    (sum, med) => sum + med.quantity * med.price,
    0
  );
  const lowStockCount = mockMedications.filter(
    (med) => med.quantity <= med.minStock
  ).length;
  const expiringCount = mockMedications.filter((med) => {
    const daysToExpiry = Math.ceil(
      (med.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpiry <= 30 && daysToExpiry > 0;
  }).length;
  const expiredCount = mockMedications.filter(
    (med) => med.expiryDate < new Date()
  ).length;

  return {
    totalMedications,
    totalValue,
    lowStockCount,
    expiringCount,
    expiredCount,
    totalAlerts: mockAlerts.filter((alert) => !alert.resolved).length,
  };
};

// Chart data
export const getChartData = () => {
  const categoryData = mockMedications.reduce((acc, med) => {
    acc[med.category] = (acc[med.category] || 0) + med.quantity;
    return acc;
  }, {} as Record<string, number>);

  const monthlyMovements = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleDateString("es-ES", { month: "short" });

    return {
      month,
      entradas: Math.floor(Math.random() * 200) + 100,
      salidas: Math.floor(Math.random() * 150) + 80,
      stock: Math.floor(Math.random() * 300) + 200,
    };
  }).reverse();

  return {
    categoryData: Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
    })),
    monthlyMovements,
  };
};

// Mock clients data
export const mockClients: Client[] = [
  {
    id: "1",
    name: "Juan Carlos Pérez",
    email: "juan.perez@email.com",
    phone: "0981993918",
    document: "0912345678",
    type: "particular",
    address: "Calle 123 #45-67",
    city: "Bogotá",
    state: "Cundinamarca",
    zipCode: "110111",
    birthDate: new Date("1985-03-15"),
    notes: "Cliente frecuente, prefiere medicamentos genéricos",
    isActive: true,
    createdAt: new Date("2023-01-15"),
    lastPurchase: new Date("2024-01-10"),
    totalPurchases: 25,
    totalAmount: 450000,
  },
  {
    id: "2",
    name: "María Elena Rodríguez",
    email: "maria.rodriguez@email.com",
    phone: "0998765432",
    document: "0923456789",
    type: "particular",
    address: "Carrera 50 #30-20",
    city: "Medellín",
    state: "Antioquia",
    zipCode: "050001",
    birthDate: new Date("1978-11-22"),
    notes: "Alérgica a la penicilina",
    isActive: true,
    createdAt: new Date("2023-02-20"),
    lastPurchase: new Date("2024-01-08"),
    totalPurchases: 18,
    totalAmount: 320000,
  },
  {
    id: "3",
    name: "Carlos Andrés López",
    email: "carlos.lopez@empresa.com",
    phone: "022345678",
    document: "1790012345001",
    type: "empresa",
    companyName: "Empresa Salud Total S.A.S",
    taxId: "1790012345001",
    contactPerson: "Carlos Andrés López",
    website: "https://www.saludtotal.com",
    address: "Avenida 68 #45-30",
    city: "Bogotá",
    state: "Cundinamarca",
    zipCode: "110221",
    notes: "Compras corporativas mensuales",
    isActive: true,
    createdAt: new Date("2023-03-10"),
    lastPurchase: new Date("2024-01-05"),
    totalPurchases: 12,
    totalAmount: 2500000,
  },
  {
    id: "4",
    name: "Ana Sofía Martínez",
    email: "ana.martinez@email.com",
    phone: "0961234567",
    document: "0956677881",
    type: "particular",
    address: "Calle 85 #15-25",
    city: "Cali",
    state: "Valle del Cauca",
    zipCode: "760001",
    birthDate: new Date("1992-07-08"),
    notes: "Diabética, requiere insulina regularmente",
    isActive: true,
    createdAt: new Date("2023-04-05"),
    lastPurchase: new Date("2024-01-12"),
    totalPurchases: 35,
    totalAmount: 680000,
  },
  {
    id: "5",
    name: "Dr. Roberto Silva",
    email: "contacto@clinicavida.com",
    phone: "023456789",
    document: "2099887766001",
    type: "institucion",
    companyName: "Clínica Vida y Salud",
    taxId: "2099887766001",
    contactPerson: "Dr. Roberto Silva",
    website: "https://www.clinicavida.com",
    address: "Carrera 15 #80-45",
    city: "Barranquilla",
    state: "Atlántico",
    zipCode: "080001",
    notes: "Institución médica, compras especializadas",
    isActive: true,
    createdAt: new Date("2023-05-12"),
    lastPurchase: new Date("2024-01-15"),
    totalPurchases: 8,
    totalAmount: 1800000,
  },
  {
    id: "6",
    name: "Lucía Fernández",
    email: "lucia.fernandez@email.com",
    phone: "0951234567",
    document: "0933445566",
    type: "particular",
    address: "Calle 72 #11-35",
    city: "Bucaramanga",
    state: "Santander",
    zipCode: "680001",
    birthDate: new Date("1980-12-03"),
    notes: "Cliente VIP, descuentos especiales",
    isActive: true,
    createdAt: new Date("2023-06-18"),
    lastPurchase: new Date("2024-01-14"),
    totalPurchases: 42,
    totalAmount: 890000,
  },
];
