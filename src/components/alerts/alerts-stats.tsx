"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar, Package, CheckCircle } from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertsStatsProps {
  alerts: Alert[]
}

export function AlertsStats({ alerts }: AlertsStatsProps) {
  const activeAlerts = alerts.filter((alert) => !alert.resolved)
  const resolvedAlerts = alerts.filter((alert) => alert.resolved)

  const highSeverityAlerts = activeAlerts.filter((alert) => alert.severity === "high")
  const stockAlerts = activeAlerts.filter((alert) => alert.type === "stock_bajo")
  const expiryAlerts = activeAlerts.filter((alert) => alert.type === "vencimiento")
  const expiredAlerts = activeAlerts.filter((alert) => alert.type === "vencido")

  const stats = [
    {
      title: "Alertas Activas",
      value: activeAlerts.length.toString(),
      change: highSeverityAlerts.length > 0 ? `${highSeverityAlerts.length} críticas` : "Bajo control",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Stock Bajo",
      value: stockAlerts.length.toString(),
      change: "Requieren reposición",
      icon: Package,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Por Vencer",
      value: expiryAlerts.length.toString(),
      change: "Próximos 30 días",
      icon: Calendar,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Resueltas Hoy",
      value: resolvedAlerts
        .filter((alert) => {
          const today = new Date()
          const alertDate = new Date(alert.date)
          return alertDate.toDateString() === today.toDateString()
        })
        .length.toString(),
      change: "Eficiencia del equipo",
      icon: CheckCircle,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
