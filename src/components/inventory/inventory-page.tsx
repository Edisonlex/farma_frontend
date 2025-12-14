// inventory-page.tsx
"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Package, RefreshCw } from "lucide-react";
import { AdjustmentsTab } from "./adjustments-tab";
import { CurrentStatusTab } from "./current-status-tab";
import { TransactionHistoryTab } from "./transaction-history-tab";
import { PageHeader } from "@/components/shared/page-header";
import { motion } from "framer-motion";
import { useInventory } from "@/context/inventory-context";
import { Button } from "@/components/ui/button";
import StatsInventory from "./StatsInventory";
import TabsListsCom from "./TabsListsCom";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export function InventoryPage() {
  const { medications, processSupplierReturns } = useInventory();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "current" || t === "adjustments" || t === "history") {
      setActiveTab(t);
    }
  }, [searchParams]);

  // Calcular estadísticas en tiempo real
  const inventoryStats = {
    totalProducts: medications.length,
    lowStock: medications.filter(
      (med) => med.quantity <= med.minStock && med.quantity > 0
    ).length,
    expiringSoon: medications.filter((med) => {
      const today = new Date();
      const diffTime = med.expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 60 && diffDays > 0;
    }).length,
    totalValue: medications.reduce(
      (total, med) => total + med.quantity * med.price,
      0
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Control de Inventario"
        subtitle={`${inventoryStats.totalProducts} productos en inventario`}
        icon={<Package className="h-5 w-5 text-primary" />}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              if (confirm("¿Procesar devoluciones a proveedor para productos ya vencidos?")) {
                processSupplierReturns();
              }
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Gestionar Devoluciones
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 space-y-6">
            <StatsInventory />

            <Tabs value={activeTab} className="space-y-6">
              <TabsListsCom />

              <div className="mt-4">
                <TabsContent value="current">
                  <CurrentStatusTab />
                </TabsContent>

                <TabsContent value="adjustments">
                  <AdjustmentsTab />
                </TabsContent>

                <TabsContent value="history">
                  <TransactionHistoryTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
