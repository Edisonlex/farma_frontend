"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSystemConfig } from "./configuration-context";
import { PdfService, InvoiceData } from "@/lib/pdf-service";
import { SaleCreateSchema } from "@/lib/schemas";
import { mockClients, mockMedications } from "@/lib/mock-data";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  discount?: number;
  ephemeral?: { expiresAt: Date };
}

export interface Customer {
  name?: string;
  document?: string;
  email?: string;
  address?: string;
}

export interface Sale {
  id: string;
  date: Date;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: "Completada" | "Anulada" | "Pendiente";
  cashier: string;
}

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, "id" | "date" | "status">) => void;
  cancelSale: (saleId: string) => void;
  getDailySales: () => Sale[];
  getSalesTotal: (sales: Sale[]) => {
    cash: number;
    card: number;
    transfer: number;
    total: number;
  };
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const { config: systemConfig } = useSystemConfig();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);

  // Cargar ventas desde localStorage al inicializar
  useEffect(() => {
    const savedSales = localStorage.getItem("pharmacy-sales");
    if (savedSales) {
      try {
        const parsedSales = JSON.parse(savedSales).map((sale: any) => ({
          ...sale,
          date: new Date(sale.date),
        }));
        setSales(parsedSales);
      } catch (error) {
        console.error("Error loading sales from localStorage:", error);
      }
    } else {
      // Sembrar ventas demo si no hay datos previos
      const demoSales: Sale[] = [];
      const clients = mockClients.slice(0, 4);
      const meds = mockMedications.slice(0, 6);
      for (let i = 0; i < 6; i++) {
        const c = clients[i % clients.length];
        const itemsCount = 2 + (i % 3);
        const items = Array.from({ length: itemsCount }, (_, j) => {
          const m = meds[(i + j) % meds.length];
          const qty = 1 + ((i + j) % 3);
          return {
            id: m.id,
            name: m.name,
            price: m.price,
            quantity: qty,
            stock: m.quantity,
          } as CartItem;
        });
        const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
        const discount = i % 2 === 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
        const tax = Math.round(subtotal * 0.15 * 100) / 100;
        const total = Math.round((subtotal - discount + tax) * 100) / 100;
        const pm = i % 3 === 0 ? "cash" : i % 3 === 1 ? "card" : "transfer";
        demoSales.push({
          id: `V-${String(i + 1).padStart(3, "0")}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          customer: { name: c.name, document: c.document },
          items,
          subtotal,
          discount,
          tax,
          total,
          paymentMethod: pm,
          status: "Completada",
          cashier: "Sistema",
        });
      }
      setSales(demoSales);
      localStorage.setItem("pharmacy-sales", JSON.stringify(demoSales));
    }
  }, []);

  // Guardar ventas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("pharmacy-sales", JSON.stringify(sales));
  }, [sales]);

  // Actualiza la función addSale para generar siempre comprobante
  const addSale = (saleData: Omit<Sale, "id" | "date" | "status">) => {
    const v = SaleCreateSchema.safeParse(saleData);
    if (!v.success) {
      toast({
        title: "Error de validación",
        description: "Datos de venta inválidos",
      });
      return;
    }
    const newSale: Sale = {
      ...v.data,
      id: `V-${String(sales.length + 1).padStart(3, "0")}`,
      date: new Date(),
      status: "Completada",
    };

    setSales((prev) => [...prev, newSale]);

    // Generar comprobante PDF siempre, usando "Consumidor Final" si faltan datos
    const customerInfo: Customer = {
      name: saleData.customer?.name || "Consumidor Final",
      document: saleData.customer?.document || "",
      email: saleData.customer?.email || "",
      address: saleData.customer?.address || "",
    };

    const invoiceData: InvoiceData = {
      sale: newSale,
      customer: customerInfo,
      invoiceNumber: newSale.id,
      businessInfo: {
        name: "Farmacia Salud Total",
        address: "Av. Principal #123, Ciudad",
        ruc: "20100066603",
        phone: "+51 123 456 789",
        email: "ventas@farmaciasaludtotal.com",
      },
    };

    const opened = PdfService.openInvoiceInNewTab(invoiceData);
    if (!opened) {
      PdfService.downloadInvoice(invoiceData, `Comprobante-${newSale.id}.pdf`);
      toast({
        title: "Venta registrada",
        description: `Comprobante ${newSale.id} descargado`,
      });
    } else {
      toast({
        title: "Venta registrada",
        description: `Comprobante ${newSale.id} abierto en pestaña`,
      });
    }

    return newSale.id;
  };

  const cancelSale = (saleId: string) => {
    setSales((prev) =>
      prev.map((sale) =>
        sale.id === saleId ? { ...sale, status: "Anulada" } : sale
      )
    );

    toast({
      title: "Venta anulada",
      description: `La venta ${saleId} ha sido anulada`,
    });
  };

  const getDailySales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);
      return (
        saleDate.getTime() === today.getTime() && sale.status === "Completada"
      );
    });
  };

  const getSalesTotal = (salesList: Sale[]) => {
    return salesList.reduce(
      (acc, sale) => {
        acc.total += sale.total;

        switch (sale.paymentMethod) {
          case "cash":
            acc.cash += sale.total;
            break;
          case "card":
            acc.card += sale.total;
            break;
          case "transfer":
            acc.transfer += sale.total;
            break;
        }

        return acc;
      },
      { cash: 0, card: 0, transfer: 0, total: 0 }
    );
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        addSale,
        cancelSale,
        getDailySales,
        getSalesTotal,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
}
