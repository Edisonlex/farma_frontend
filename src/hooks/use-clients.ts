"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { mockClients } from "@/lib/mock-data";

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: "particular" | "empresa" | "institucion";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  birthDate?: Date | null;
  notes?: string;
  isActive?: boolean;
  companyName?: string;
  taxId?: string;
  contactPerson?: string;
  website?: string;
  createdAt?: Date;
  lastPurchase?: Date | null;
  totalPurchases?: number;
  totalAmount?: number;
}

const STORAGE_KEY = "pharmacy-clients";

export function useClients() {
  const [clients, setClients] = useState<ClientRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ClientRecord[];
        return parsed.map((c) => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : null,
          birthDate: c.birthDate ? new Date(c.birthDate) : null,
        }));
      }
    } catch {}
    return mockClients as ClientRecord[];
  });

  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            clients.map((c) => ({
              ...c,
              createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
              lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : null,
              birthDate: c.birthDate ? new Date(c.birthDate) : null,
            }))
          )
        );
      } catch {}
    }, 300);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [clients]);

  const addClient = (data: Omit<ClientRecord, "id">) => {
    const newClient: ClientRecord = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      lastPurchase: null,
      totalPurchases: 0,
      totalAmount: 0,
    };
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<ClientRecord>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const stats = useMemo(() => ({
    total: clients.length,
    particulares: clients.filter((c) => c.type === "particular").length,
    empresas: clients.filter((c) => c.type === "empresa").length,
    instituciones: clients.filter((c) => c.type === "institucion").length,
  }), [clients]);

  return { clients, addClient, updateClient, deleteClient, setClients, stats };
}