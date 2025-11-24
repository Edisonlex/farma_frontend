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
import { getInventoryAnalytics, getChartData } from "@/lib/mock-data";
import { InventoryChart } from "./inventory-chart";
import { AlertsWidget } from "./alerts-widget";
import { RecentMovements } from "./recent-movements";
import QuickActions from "./QuickActions";
import { useRouter } from "next/navigation";
import { Alert } from "@/lib/mock-data";
import { useAlerts } from "@/context/AlertsContext";

export function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const analytics = getInventoryAnalytics();
  const chartData = getChartData();

  const { alerts, unresolvedAlerts, resolveAlert } = useAlerts();

  // Función para navegar a resolver una alerta
  const handleNavigateToResolution = (alert: Alert) => {
    // Marcar como resuelta usando el contexto
    resolveAlert(alert.id);

    // Navegar según el tipo de alerta
    switch (alert.type) {
      case "stock_bajo":
        router.push("/medicamentos?alertas=true");
        break;
      case "vencimiento":
      case "vencido":
        router.push("/medicamentos?vencimientos=true");
        break;
      default:
        router.push("/medicamentos");
        break;
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
