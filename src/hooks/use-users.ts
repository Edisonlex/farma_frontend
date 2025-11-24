"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { mockUsers, type UserRole } from "@/lib/auth";

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

  const addUser = (data: Omit<UserRecord, "id">) => {
    const newUser: UserRecord = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      lastLogin: null,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<UserRecord>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id: string) => {
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