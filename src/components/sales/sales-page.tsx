"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SalesRegister } from "./sales-register";
import { SalesHistory } from "./sales-history";
import { CashRegister } from "./cash-register";
import { ShoppingCart, History, Calculator } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";
import SalesCard from "./SalesCard";
import { useSearchParams } from "next/navigation";
// Importar el Provider

export function SalesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("register");
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "register" || t === "history" || t === "cash") setActiveTab(t);
  }, [searchParams]);

  

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Punto de Venta"
        subtitle="Transacciones y registro de ventas"
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
