"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SalesRegister } from "./sales-register";
import { SalesHistory } from "./sales-history";
import { CashRegister } from "./cash-register";
import {
  ShoppingCart,
  Receipt,
  History,
  Calculator,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";
import SalesCard from "./SalesCard";
// Importar el Provider

export function SalesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("register");

  // Mock sales stats
  const salesStats = {
    todaySales: 2450.75,
    todayTransactions: 18,
    averageTicket: 136.15,
    pendingOrders: 3,
  };

  const stats = [
    {
      title: "Ventas del Día",
      value: `$${salesStats.todaySales.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-chart-5",
    },
    {
      title: "Transacciones",
      value: salesStats.todayTransactions.toString(),
      change: "+8",
      icon: Receipt,
      color: "text-primary",
    },
    {
      title: "Ticket Promedio",
      value: `$${salesStats.averageTicket.toFixed(2)}`,
      change: "+5.2%",
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "Pedidos Pendientes",
      value: salesStats.pendingOrders.toString(),
      change: "-2",
      icon: Clock,
      color: "text-destructive",
    },
  ];

  const quickActions = [
    {
      title: "Control Inventario",
      icon: ShoppingCart,
      href: "/inventario",
    },
    {
      title: "Gestionar Medicamentos",
      icon: Users,
      href: "/medicamentos",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Punto de Venta"
        subtitle={`${salesStats.todayTransactions} transacciones hoy`}
        icon={<ShoppingCart className="h-6 w-6 text-white" />}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Envolver el contenido con SalesProvider */}
          
            {/* Stats Grid */}
            <SalesCard />

            {/* Main Content Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
                <TabsTrigger
                  value="register"
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Registrar Venta
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  Historial
                </TabsTrigger>
                {user && hasPermission(user.role, "manage_cash_register") && (
                  <TabsTrigger value="cash" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Caja
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="register">
                <SalesRegister />
              </TabsContent>

              <TabsContent value="history">
                <SalesHistory />
              </TabsContent>

              {user && hasPermission(user.role, "manage_cash_register") && (
                <TabsContent value="cash">
                  <CashRegister />
                </TabsContent>
              )}
            </Tabs>
          
        </motion.div>
      </main>
    </div>
  );
}
