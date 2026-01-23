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
import { hasApi } from "@/lib/api";
import * as AuthService from "@/services/auth";

export async function signIn(email: string, password: string): Promise<User | null> {
  if (hasApi()) return AuthService.signIn(email, password);
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const user = mockUsers.find((u) => u.email === email)
  const override = typeof window !== "undefined" ? localStorage.getItem(`pharmacare_pwd_override:${email}`) : null
  const isValid = override ? password === override : password === "password123"
  if (user && isValid) {
    return { ...user, lastLogin: new Date() }
  }
  return null
}

export async function signOut(): Promise<void> {
  if (hasApi()) return AuthService.signOut();
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function getCurrentUser(): Promise<User | null> {
  if (hasApi()) return AuthService.getCurrentUser();
  const stored = localStorage.getItem("pharmacare_user")
  return stored ? JSON.parse(stored) : null
}

// Password reset (mock) — ready to connect backend
export async function requestPasswordReset(email: string): Promise<{ success: boolean; code?: string }> {
  if (hasApi()) return AuthService.requestPasswordReset(email);
  await new Promise((resolve) => setTimeout(resolve, 800))
  const user = mockUsers.find((u) => u.email === email)
  if (!user) return { success: false }
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  try {
    localStorage.setItem(`pharmacare_reset_code:${email}`, JSON.stringify({ code, expiresAt: Date.now() + 10 * 60 * 1000 }))
  } catch {}
  return { success: true, code }
}

export async function verifyResetCode(email: string, code: string): Promise<boolean> {
  if (hasApi()) return AuthService.verifyResetCode(email, code);
  await new Promise((resolve) => setTimeout(resolve, 300))
  try {
    const raw = localStorage.getItem(`pharmacare_reset_code:${email}`)
    if (!raw) return false
    const { code: stored, expiresAt } = JSON.parse(raw)
    if (Date.now() > Number(expiresAt)) return false
    return String(stored) === String(code)
  } catch {
    return false
  }
}

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  if (hasApi()) return AuthService.resetPassword(email, newPassword);
  await new Promise((resolve) => setTimeout(resolve, 500))
  const user = mockUsers.find((u) => u.email === email)
  if (!user) return false
  try {
    localStorage.setItem(`pharmacare_pwd_override:${email}`, newPassword)
    localStorage.removeItem(`pharmacare_reset_code:${email}`)
  } catch {}
  return true
}
