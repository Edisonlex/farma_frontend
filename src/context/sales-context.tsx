"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSystemConfig } from "./configuration-context";
import { PdfService, InvoiceData } from "@/lib/pdf-service";
import { SaleCreateSchema } from "@/lib/schemas";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  discount?: number;
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
    }
  }, []);

  // Guardar ventas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("pharmacy-sales", JSON.stringify(sales));
  }, [sales]);

  // Actualiza la función addSale para generar el PDF
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

    // Generar PDF de la factura
    const invoiceData: InvoiceData = {
      sale: newSale,
      customer: saleData.customer,
      invoiceNumber: newSale.id,
      businessInfo: {
        name: "Farmacia Salud Total",
        address: "Av. Principal #123, Ciudad",
        ruc: "20100066603",
        phone: "+51 123 456 789",
        email: "ventas@farmaciasaludtotal.com",
      },
    };

    PdfService.downloadInvoice(invoiceData, `Factura-${newSale.id}.pdf`);

    toast({
      title: "Venta registrada",
      description: `Venta ${newSale.id} procesada exitosamente`,
    });

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
