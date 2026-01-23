"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { mockClients } from "@/lib/mock-data";
import { ClientCreateSchema, ClientUpdateSchema } from "@/lib/schemas";
import { normalizeString } from "@/lib/utils";
import { listClients, createClient, updateClientServer, deleteClientServer } from "@/services/clients";
import { hasApi } from "@/lib/api";

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

  useEffect(() => {
    (async () => {
      try {
        const remote = await listClients();
        if (remote && remote.length) setClients(remote);
      } catch {}
    })();
  }, []);

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

  const addClient = async (data: Omit<ClientRecord, "id">) => {
    const v = ClientCreateSchema.safeParse({
      ...data,
      // adapt birthDate to string if Date provided
      birthDate: typeof (data as any).birthDate === "string" ? (data as any).birthDate : ((data as any).birthDate ? (data as any).birthDate.toISOString().slice(0, 10) : undefined),
    });
    if (!v.success) return;
    const nameNorm = normalizeString((v.data.name || "").trim());
    const docNorm = (v.data.document || "").replace(/\D/g, "");
    const exists = clients.some((c) => normalizeString((c.name || "").trim()) === nameNorm || ((c.document || "").replace(/\D/g, "") === docNorm && docNorm.length > 0));
    if (exists) return;
    if (hasApi()) {
      try {
        const created = await createClient(v.data as any);
        setClients((prev) => [...prev, created]);
        return;
      } catch {}
    }
    const newClient: ClientRecord = { id: Date.now().toString(), ...v.data, createdAt: new Date(), lastPurchase: null, totalPurchases: 0, totalAmount: 0 } as any;
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = async (id: string, updates: Partial<ClientRecord>) => {
    const v = ClientUpdateSchema.safeParse({
      ...updates,
      birthDate: typeof updates.birthDate === "string" ? updates.birthDate : (updates.birthDate ? (updates.birthDate as Date).toISOString().slice(0, 10) : undefined),
    });
    if (!v.success) return;
    if (v.data.name !== undefined || v.data.document !== undefined) {
      const nameNorm = v.data.name !== undefined ? normalizeString(String(v.data.name).trim()) : undefined;
      const docNorm = v.data.document !== undefined ? String(v.data.document).replace(/\D/g, "") : undefined;
      const exists = clients.some(
        (c) =>
          c.id !== id &&
          ((nameNorm && normalizeString((c.name || "").trim()) === nameNorm) ||
            (docNorm && (c.document || "").replace(/\D/g, "") === docNorm)),
      );
      if (exists) return;
    }
    const merged: Partial<ClientRecord> = { ...v.data } as any;
    if (merged.birthDate !== undefined) {
      merged.birthDate = merged.birthDate ? new Date(String(merged.birthDate)) : null;
    }
    if (hasApi()) {
      try {
        const updated = await updateClientServer(id, merged as any);
        if (updated)
          setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
        else
          setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...merged } : c)));
        return;
      } catch {}
    }
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...merged } : c)));
  };

  const deleteClient = async (id: string) => {
    if (hasApi()) {
      try { await deleteClientServer(id); } catch {}
    }
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