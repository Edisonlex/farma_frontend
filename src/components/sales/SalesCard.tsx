"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Receipt,
  DollarSign,
  TrendingUp,
  Clock,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { useSales } from "@/context/sales-context";


export default function SalesCard() {
  const { getDailySales, getSalesTotal, sales } = useSales();

  // Obtener ventas del día
  const dailySales = getDailySales();
  const dailyTotals = getSalesTotal(dailySales);

  // Calcular estadísticas en tiempo real
  const salesStats = {
    todaySales: dailyTotals.total,
    todayTransactions: dailySales.length,
    averageTicket:
      dailySales.length > 0 ? dailyTotals.total / dailySales.length : 0,
    pendingOrders: sales.filter((sale) => sale.status === "Pendiente").length,
  };

  // Calcular cambios porcentuales (comparando con datos mock del día anterior)
  // En una implementación real, deberías tener datos históricos
  const yesterdayStats = {
    sales: 2178.0, // Datos de ejemplo del día anterior
    transactions: 16, // Datos de ejemplo del día anterior
    averageTicket: 136.12, // Datos de ejemplo del día anterior
    pendingOrders: 5, // Datos de ejemplo del día anterior
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const calculateChangeValue = (current: number, previous: number) => {
    return current - previous;
  };

  const stats = [
    {
      title: "Ventas del Día",
      value: `$${salesStats.todaySales.toLocaleString()}`,
      change: calculateChange(salesStats.todaySales, yesterdayStats.sales),
      changeValue: calculateChangeValue(
        salesStats.todaySales,
        yesterdayStats.sales
      ),
      icon: DollarSign,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      borderColor: "border-chart-5/20",
      trend: salesStats.todaySales >= yesterdayStats.sales ? "up" : "down",
    },
    {
      title: "Transacciones",
      value: salesStats.todayTransactions.toString(),
      change:
        calculateChangeValue(
          salesStats.todayTransactions,
          yesterdayStats.transactions
        ) >= 0
          ? `+${calculateChangeValue(
              salesStats.todayTransactions,
              yesterdayStats.transactions
            )}`
          : `${calculateChangeValue(
              salesStats.todayTransactions,
              yesterdayStats.transactions
            )}`,
      changeValue: calculateChangeValue(
        salesStats.todayTransactions,
        yesterdayStats.transactions
      ),
      icon: Receipt,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      trend:
        salesStats.todayTransactions >= yesterdayStats.transactions
          ? "up"
          : "down",
    },
    {
      title: "Ticket Promedio",
      value: `$${salesStats.averageTicket.toFixed(2)}`,
      change: calculateChange(
        salesStats.averageTicket,
        yesterdayStats.averageTicket
      ),
      changeValue: calculateChangeValue(
        salesStats.averageTicket,
        yesterdayStats.averageTicket
      ),
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      trend:
        salesStats.averageTicket >= yesterdayStats.averageTicket
          ? "up"
          : "down",
    },
    {
      title: "Pedidos Pendientes",
      value: salesStats.pendingOrders.toString(),
      change:
        calculateChangeValue(
          salesStats.pendingOrders,
          yesterdayStats.pendingOrders
        ) >= 0
          ? `+${calculateChangeValue(
              salesStats.pendingOrders,
              yesterdayStats.pendingOrders
            )}`
          : `${calculateChangeValue(
              salesStats.pendingOrders,
              yesterdayStats.pendingOrders
            )}`,
      changeValue: calculateChangeValue(
        salesStats.pendingOrders,
        yesterdayStats.pendingOrders
      ),
      icon: Clock,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      trend:
        salesStats.pendingOrders <= yesterdayStats.pendingOrders
          ? "up"
          : "down",
    },
  ];

  const getTrendIcon = (trend: string, value: number) => {
    if (value > 0) return <TrendingUp className="w-3 h-3" />;
    if (value < 0) return <TrendingDown className="w-3 h-3" />;
    return <TrendingUp className="w-3 h-3 opacity-50" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Métricas de Ventas
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Resumen del desempeño comercial del día
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              const TrendIcon = getTrendIcon(stat.trend, stat.changeValue);

              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card
                    className={`border ${stat.borderColor} bg-background/80 backdrop-blur-sm hover:shadow-md hover:border-primary/30 transition-all h-full`}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <IconComponent className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            stat.changeValue > 0
                              ? "bg-chart-5/20 text-chart-5"
                              : stat.changeValue < 0
                              ? "bg-destructive/20 text-destructive"
                              : "bg-muted/20 text-muted-foreground"
                          }`}
                        >
                          {TrendIcon}
                          <span>{stat.change}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </h3>
                        <div className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          {stat.changeValue > 0
                            ? "↑ Aumentó"
                            : stat.changeValue < 0
                            ? "↓ Disminuyó"
                            : "→ Estable"}{" "}
                          vs ayer
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 pt-4 border-t border-border/50"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Actualizado:{" "}
                {new Date().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>Total día: ${salesStats.todaySales.toLocaleString()}</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
