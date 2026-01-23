import { apiGet, apiPost, apiPut, apiDelete, hasApi } from "@/lib/api";
import type { UserRole } from "@/lib/auth";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
  createdAt?: Date;
  lastLogin?: Date | null;
}

const STORAGE_KEY = "pharmacy-users";

function readLocal(): UserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserRecord[];
      return parsed.map((u) => ({
        ...u,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
      }));
    }
  } catch {}
  return [];
}

function writeLocal(users: UserRecord[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        users.map((u) => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
          lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
        }))
      )
    );
  } catch {}
}

export async function listUsers(): Promise<UserRecord[]> {
  if (hasApi()) {
    const data = await apiGet("/users");
    return (data as any[]).map((u) => ({
      ...u,
      createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
      lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
    }));
  }
  return readLocal();
}

export async function createUser(data: Omit<UserRecord, "id">): Promise<UserRecord> {
  if (hasApi()) {
    const created = await apiPost("/users", data);
    return created as UserRecord;
  }
  const users = readLocal();
  const newUser: UserRecord = { id: Date.now().toString(), ...data, createdAt: new Date(), lastLogin: null } as any;
  const next = [...users, newUser];
  writeLocal(next);
  return newUser;
}

export async function updateUserServer(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  if (hasApi()) {
    const updated = await apiPut(`/users/${id}`, updates);
    return updated as UserRecord;
  }
  const users = readLocal();
  const next = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
  writeLocal(next);
  return next.find((u) => u.id === id) || null;
}

export async function deleteUserServer(id: string): Promise<boolean> {
  if (hasApi()) {
    await apiDelete(`/users/${id}`);
    return true;
  }
  const users = readLocal();
  const next = users.filter((u) => u.id !== id);
  writeLocal(next);
  return true;
}