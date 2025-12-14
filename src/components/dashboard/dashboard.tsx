"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  Pill,
  AlertTriangle,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { useInventory } from "@/context/inventory-context";
import { InventoryChart } from "./inventory-chart";
import { AlertsWidget } from "./alerts-widget";
import { RecentMovements } from "./recent-movements";
import QuickActions from "./QuickActions";
import { useRouter } from "next/navigation";
import { Alert } from "@/lib/mock-data";
import { useAlerts } from "@/context/AlertsContext";

export function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { medications, movements, categories } = useInventory();

  const analytics = {
    totalMedications: medications.length,
    totalValue: medications.reduce((sum, m) => sum + m.quantity * m.price, 0),
    lowStockCount: medications.filter((m) => m.quantity <= m.minStock).length,
    expiringCount: medications.filter((m) => {
      const days = Math.ceil((m.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days > 0;
    }).length,
    expiredCount: medications.filter((m) => m.expiryDate < new Date()).length,
  };

  const chartData = (() => {
    const byCat: Record<string, number> = {};
    medications.forEach((m) => {
      const catName = categories.find((c) => c.id === m.category)?.name || m.category;
      byCat[catName] = (byCat[catName] || 0) + m.quantity;
    });
    const totalQty = Object.values(byCat).reduce((s, v) => s + v, 0) || 1;
    const categoryData = Object.entries(byCat).map(([name, value]) => ({
      name,
      value,
      percentage: `${Math.round((value / totalQty) * 100)}%`,
    }));

    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    const monthlyMovements = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const idx = d.getMonth();
      const entradas = movements.filter((mv) => mv.type === "entrada" && new Date(mv.date).getMonth() === idx)
        .reduce((s, mv) => s + Math.abs(mv.quantity), 0);
      const salidas = movements.filter((mv) => mv.type === "salida" && new Date(mv.date).getMonth() === idx)
        .reduce((s, mv) => s + Math.abs(mv.quantity), 0);
      return { month: months[idx], entradas, salidas, stock: Math.max(0, entradas - salidas) };
    });

    return { categoryData, monthlyMovements };
  })();

  const { unresolvedAlerts, resolveAlert } = useAlerts();

  const handleNavigateToResolution = (alert: Alert) => {
    switch (alert.type) {
      case "stock_bajo": {
        const q = new URLSearchParams({ tab: "current", stock: "low", search: alert.medicationName, mid: alert.medicationId });
        router.push(`/inventario?${q.toString()}`);
        break;
      }
      case "vencimiento":
      case "vencido": {
        const q = new URLSearchParams({ search: alert.medicationName, mid: alert.medicationId, alert: alert.type });
        router.push(`/medicamentos?${q.toString()}`);
        break;
      }
      default: {
        const q = new URLSearchParams({ search: alert.medicationName });
        router.push(`/inventario?${q.toString()}`);
        break;
      }
    }
  };

  const stats = [
    {
      title: "Total Medicamentos",
      value: analytics.totalMedications.toString(),
      change: "+12%",
      icon: Pill,
      color: "text-primary",
      description: "Productos únicos",
    },
    {
      title: "Valor Inventario",
      value: `$${analytics.totalValue.toLocaleString()}`,
      change: "+8%",
      icon: DollarSign,
      color: "text-chart-5",
      description: "Valor total del stock",
    },
    {
      title: "Stock Bajo",
      value: analytics.lowStockCount.toString(),
      change: analytics.lowStockCount > 0 ? "+2" : "0",
      icon: AlertTriangle,
      color: "text-destructive",
      description: "Requieren reposición",
    },
    {
      title: "Próximos a Vencer",
      value: analytics.expiringCount.toString(),
      change: "+1",
      icon: Calendar,
      color: "text-accent",
      description: "En los próximos 30 días",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Bienvenido, {user?.name?.split(" ")[0]}
            </h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Última actualización: {new Date().toLocaleString("es-ES")}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                      <span
                        className={`text-xs font-medium ${
                          stat.change.startsWith("+")
                            ? "text-chart-5"
                            : "text-destructive"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <InventoryChart data={chartData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AlertsWidget
                alerts={unresolvedAlerts}
                onResolveAlert={resolveAlert}
                onNavigateToResolution={handleNavigateToResolution}
              />
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <RecentMovements />
          </motion.div>

          {/* Quick Actions Grid */}
          <QuickActions />
        </motion.div>
      </main>
    </div>
  );
}
