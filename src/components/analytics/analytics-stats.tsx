"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, AlertTriangle, Brain } from "lucide-react"
import type { PredictionData } from "@/lib/analytics-data"

interface AnalyticsStatsProps {
  predictions: PredictionData[]
  modelAccuracy: number
  riskLevel: string
}

export function AnalyticsStats({ predictions, modelAccuracy, riskLevel }: AnalyticsStatsProps) {
  const highRiskCount = predictions.filter((p) => p.riskLevel === "high").length
  const avgConfidence = Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)
  const totalRecommendedOrders = predictions.reduce((sum, p) => sum + p.recommendedOrder, 0)

  const stats = [
    {
      title: "Precisión del Modelo",
      value: `${modelAccuracy}%`,
      change: "Excelente rendimiento",
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Confianza Promedio",
      value: `${avgConfidence}%`,
      change: "Predicciones confiables",
      icon: Target,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      title: "Medicamentos en Riesgo",
      value: highRiskCount.toString(),
      change: "Requieren atención",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Órdenes Sugeridas",
      value: totalRecommendedOrders.toString(),
      change: "Unidades totales",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "high":
        return "Alto"
      case "medium":
        return "Medio"
      case "low":
        return "Bajo"
      default:
        return "Medio"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
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

      {/* Risk Level Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Estado General del Inventario
              </span>
              <Badge variant={getRiskColor(riskLevel)} className="text-sm">
                Riesgo {getRiskText(riskLevel)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-chart-5/10 rounded-lg">
                <div className="text-2xl font-bold text-chart-5">
                  {predictions.filter((p) => p.riskLevel === "low").length}
                </div>
                <div className="text-sm text-muted-foreground">Riesgo Bajo</div>
              </div>

              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {predictions.filter((p) => p.riskLevel === "medium").length}
                </div>
                <div className="text-sm text-muted-foreground">Riesgo Medio</div>
              </div>

              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">
                  {predictions.filter((p) => p.riskLevel === "high").length}
                </div>
                <div className="text-sm text-muted-foreground">Riesgo Alto</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
