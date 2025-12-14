export type UserRole = "administrador" | "tecnico" | "farmaceutico"

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  phone?: string; // Agregar esta línea
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock users for development
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@pharmacare.com",
    name: "Dr. María González",
    role: "administrador",
    phone: "0981993918",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    email: "farmaceutico@pharmacare.com",
    name: "Carlos Rodríguez",
    role: "farmaceutico",
    phone: "0981993918",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    email: "tecnico@pharmacare.com",
    name: "Ana López",
    role: "tecnico",
    phone: "0981993918",
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date(),
  },
];

// Role permissions
export const rolePermissions = {
  administrador: [
    "view_dashboard",
    "manage_medications",
    "manage_inventory",
    "adjust_inventory",
    "manage_alerts",
    "view_alerts",
    "view_analytics",
    "generate_reports",
    "manage_users",
    "manage_sales",
    "view_sales_reports",
    "manage_cash_register",
    "process_sales",
    "view_inventory",
    "view_transaction_history",
    "manage_categories",
    "manage_suppliers",
    "manage_clients",
    "view_clients",
  ],
  farmaceutico: [
    "view_dashboard",
    "view_medications",
    "view_inventory",
    "adjust_inventory",
    "view_alerts",
    "process_sales",
    "view_sales_reports",
    "view_transaction_history",
  ],
  tecnico: [
    "view_dashboard",
    "view_alerts",
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) || false
}

export function checkPermissions(
  role: UserRole,
  required: string | string[],
  mode: "any" | "all" = "any"
): boolean {
  const list = Array.isArray(required) ? required : [required]
  if (mode === "all") {
    return list.every((perm) => hasPermission(role, perm))
  }
  return list.some((perm) => hasPermission(role, perm))
}

// Mock authentication functions
export async function signIn(email: string, password: string): Promise<User | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password123") {
    return { ...user, lastLogin: new Date() }
  }
  return null
}

export async function signOut(): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function getCurrentUser(): Promise<User | null> {
  // Simulate checking stored session
  const stored = localStorage.getItem("pharmacare_user")
  return stored ? JSON.parse(stored) : null
}
