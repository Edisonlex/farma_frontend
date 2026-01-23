"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { mockUsers, type UserRole } from "@/lib/auth";
import { UserCreateSchema, UserUpdateSchema } from "@/lib/schemas";
import { normalizeString } from "@/lib/utils";
import { listUsers, createUser, updateUserServer, deleteUserServer } from "@/services/users";
import { hasApi } from "@/lib/api";

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

export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>(() => {
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
    return mockUsers as UserRecord[];
  });

  useEffect(() => {
    (async () => {
      try {
        const remote = await listUsers();
        if (remote && remote.length) setUsers(remote);
      } catch {}
    })();
  }, []);

  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
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
    }, 300);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [users]);

  const addUser = async (data: Omit<UserRecord, "id">) => {
    const v = UserCreateSchema.safeParse({
      ...data,
    });
    if (!v.success) return;
    const emailLower = v.data.email.toLowerCase();
    const nameKey = normalizeString(v.data.name.trim());
    const exists = users.some((u) => u.email.toLowerCase() === emailLower || normalizeString((u.name || "").trim()) === nameKey);
    if (exists) return;
    if (hasApi()) {
      try {
        const created = await createUser(v.data as any);
        setUsers((prev) => [...prev, created]);
        return;
      } catch {}
    }
    const newUser: UserRecord = { id: Date.now().toString(), ...v.data, createdAt: new Date(), lastLogin: null } as any;
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = async (id: string, updates: Partial<UserRecord>) => {
    const v = UserUpdateSchema.safeParse({ ...updates });
    if (!v.success) return;
    if (v.data.email !== undefined || v.data.name !== undefined) {
      const emailLower = v.data.email !== undefined ? String(v.data.email).toLowerCase() : undefined;
      const nameKey = v.data.name !== undefined ? normalizeString(String(v.data.name).trim()) : undefined;
      const exists = users.some(
        (u) =>
          u.id !== id &&
          ((emailLower && u.email.toLowerCase() === emailLower) ||
            (nameKey && normalizeString((u.name || "").trim()) === nameKey)),
      );
      if (exists) return;
    }
    if (hasApi()) {
      try {
        const updated = await updateUserServer(id, v.data as any);
        if (updated)
          setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
        else
          setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...v.data } : u)));
        return;
      } catch {}
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...v.data } : u)));
  };

  const deleteUser = async (id: string) => {
    if (hasApi()) {
      try { await deleteUserServer(id); } catch {}
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const stats = useMemo(() => ({
    total: users.length,
    administradores: users.filter((u) => u.role === "administrador").length,
    farmaceuticos: users.filter((u) => u.role === "farmaceutico").length,
    tecnicos: users.filter((u) => u.role === "tecnico").length,
  }), [users]);

  return { users, addUser, updateUser, deleteUser, setUsers, stats };
}