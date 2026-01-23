import { apiGet, apiPost, apiPut, apiDelete, hasApi } from "@/lib/api";

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

function readLocal(): ClientRecord[] {
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
  return [];
}

function writeLocal(clients: ClientRecord[]) {
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
}

export async function listClients(): Promise<ClientRecord[]> {
  if (hasApi()) {
    const data = await apiGet("/clients");
    return (data as any[]).map((c) => ({
      ...c,
      createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
      lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : null,
      birthDate: c.birthDate ? new Date(c.birthDate) : null,
    }));
  }
  return readLocal();
}

export async function createClient(data: Omit<ClientRecord, "id">): Promise<ClientRecord> {
  if (hasApi()) {
    const created = await apiPost("/clients", data);
    return created as ClientRecord;
  }
  const clients = readLocal();
  const newClient: ClientRecord = { id: Date.now().toString(), ...data, createdAt: new Date(), lastPurchase: null, totalPurchases: 0, totalAmount: 0 } as any;
  const next = [...clients, newClient];
  writeLocal(next);
  return newClient;
}

export async function updateClientServer(id: string, updates: Partial<ClientRecord>): Promise<ClientRecord | null> {
  if (hasApi()) {
    const updated = await apiPut(`/clients/${id}`, updates);
    return updated as ClientRecord;
  }
  const clients = readLocal();
  const next = clients.map((c) => (c.id === id ? { ...c, ...updates } : c));
  writeLocal(next);
  return next.find((c) => c.id === id) || null;
}

export async function deleteClientServer(id: string): Promise<boolean> {
  if (hasApi()) {
    await apiDelete(`/clients/${id}`);
    return true;
  }
  const clients = readLocal();
  const next = clients.filter((c) => c.id !== id);
  writeLocal(next);
  return true;
}