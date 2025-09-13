export interface Medication {
  id: string
  name: string
  batch: string
  expiryDate: Date
  quantity: number
  minStock: number
  supplier: string
  category: string
  activeIngredient: string
  price: number
  location: string
}

export interface InventoryMovement {
  id: string
  medicationId: string
  medicationName: string
  type: "entrada" | "salida" | "ajuste"
  quantity: number
  date: Date
  reason: string
  userId: string
  userName: string
}

export interface Alert {
  id: string
  type: "stock_bajo" | "vencimiento" | "vencido"
  medicationId: string
  medicationName: string
  message: string
  severity: "low" | "medium" | "high"
  date: Date
  resolved: boolean
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  document: string
  type: "particular" | "empresa" | "institucion"
  address?: string
  city?: string
  state?: string
  zipCode?: string
  birthDate?: Date
  notes?: string
  isActive: boolean
  createdAt: Date
  lastPurchase?: Date
  totalPurchases: number
  totalAmount: number
  // Campos específicos para empresas/instituciones
  companyName?: string
  taxId?: string
  contactPerson?: string
  website?: string
}

// Mock medications data
export const mockMedications: Medication[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    batch: "PAR001",
    expiryDate: new Date("2025-06-15"),
    quantity: 150,
    minStock: 50,
    supplier: "Laboratorios ABC",
    category: "Analgésicos",
    activeIngredient: "Paracetamol",
    price: 2.5,
    location: "A1-B2",
  },
  {
    id: "2",
    name: "Ibuprofeno 400mg",
    batch: "IBU002",
    expiryDate: new Date("2024-12-30"),
    quantity: 25,
    minStock: 30,
    supplier: "Farmacéutica XYZ",
    category: "Antiinflamatorios",
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
    supplier: "Laboratorios DEF",
    category: "Antibióticos",
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
    supplier: "Laboratorios ABC",
    category: "Gastroprotectores",
    activeIngredient: "Omeprazol",
    price: 4.1,
    location: "C1-B1",
  },
  {
    id: "5",
    name: "Loratadina 10mg",
    batch: "LOR005",
    expiryDate: new Date("2024-10-05"),
    quantity: 15,
    minStock: 25,
    supplier: "Farmacéutica GHI",
    category: "Antihistamínicos",
    activeIngredient: "Loratadina",
    price: 1.8,
    location: "D1-A2",
  },
  {
    id: "6",
    name: "Loratadina 10mgg",
    batch: "LOR005",
    expiryDate: new Date("2024-10-05"),
    quantity: 15,
    minStock: 25,
    supplier: "Farmacéutica GHI",
    category: "Antihistamínicos",
    activeIngredient: "Loratadina",
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
]

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
]

// Analytics data
export const getInventoryAnalytics = () => {
  const totalMedications = mockMedications.length
  const totalValue = mockMedications.reduce((sum, med) => sum + med.quantity * med.price, 0)
  const lowStockCount = mockMedications.filter((med) => med.quantity <= med.minStock).length
  const expiringCount = mockMedications.filter((med) => {
    const daysToExpiry = Math.ceil((med.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysToExpiry <= 30 && daysToExpiry > 0
  }).length
  const expiredCount = mockMedications.filter((med) => med.expiryDate < new Date()).length

  return {
    totalMedications,
    totalValue,
    lowStockCount,
    expiringCount,
    expiredCount,
    totalAlerts: mockAlerts.filter((alert) => !alert.resolved).length,
  }
}

// Chart data
export const getChartData = () => {
  const categoryData = mockMedications.reduce(
    (acc, med) => {
      acc[med.category] = (acc[med.category] || 0) + med.quantity
      return acc
    },
    {} as Record<string, number>,
  )

  const monthlyMovements = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleDateString("es-ES", { month: "short" })

    return {
      month,
      entradas: Math.floor(Math.random() * 200) + 100,
      salidas: Math.floor(Math.random() * 150) + 80,
      stock: Math.floor(Math.random() * 300) + 200,
    }
  }).reverse()

  return {
    categoryData: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
    monthlyMovements,
  }
}

// Mock clients data
export const mockClients: Client[] = [
  {
    id: "1",
    name: "Juan Carlos Pérezzzzz",
    email: "juan.perez@email.com",
    phone: "+57 300 123 4567",
    document: "12345678",
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
    phone: "+57 310 987 6543",
    document: "87654321",
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
    phone: "+57 320 555 1234",
    document: "11223344",
    type: "empresa",
    companyName: "Empresa Salud Total S.A.S",
    taxId: "900123456-1",
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
    phone: "+57 315 444 7890",
    document: "55667788",
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
    phone: "+57 301 222 3333",
    document: "99887766",
    type: "institucion",
    companyName: "Clínica Vida y Salud",
    taxId: "800987654-2",
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
    phone: "+57 318 666 9999",
    document: "33445566",
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
]
