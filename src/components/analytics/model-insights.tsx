"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Database,
  Lightbulb,
  CheckCircle,
  Calendar,
  Cpu,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";

interface ModelInsightsProps {
  insights: {
    accuracy: number;
    lastTrained: Date;
    dataPoints: number;
    features: string[];
    recommendations: string[];
  };
}

export function ModelInsights({ insights }: ModelInsightsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* Model Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-card-foreground">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-semibold">
                Rendimiento del Modelo
              </span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Métricas de precisión y información del entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Precisión */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Precisión
                  </span>
                  <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {insights.accuracy}%
                  </span>
                </div>
                <Progress
                  value={insights.accuracy}
                  className="h-2 bg-primary/20 [&>div]:bg-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Excelente rendimiento predictivo
                </p>
              </div>

              {/* Datos de Entrenamiento */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-chart-2/5 to-chart-2/10 border border-chart-2/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-chart-2/10">
                    <Database className="w-4 h-4 text-chart-2" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Datos de Entrenamiento
                  </span>
                </div>
                <div className="text-2xl font-bold text-chart-2 mb-1">
                  {insights.dataPoints.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Puntos de datos históricos
                </p>
              </div>

              {/* Último Entrenamiento */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Último Entrenamiento
                  </span>
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {insights.lastTrained.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-xs"
                >
                  Actualizado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Used */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-card-foreground">
              <div className="p-2.5 rounded-xl bg-chart-5/10 border border-chart-5/20">
                <Cpu className="w-6 h-6 text-chart-5" />
              </div>
              <span className="text-xl font-semibold">
                Variables del Modelo
              </span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Factores considerados para generar las predicciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="p-1.5 rounded-full bg-chart-5/10 group-hover:bg-chart-5/20 transition-colors">
                    <CheckCircle className="w-4 h-4 text-chart-5" />
                  </div>
                  <span className="font-medium text-foreground text-sm">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-card-foreground">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                <Lightbulb className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xl font-semibold">
                Recomendaciones de la IA
              </span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Insights automáticos basados en el análisis de datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors group"
                >
                  <div className="w-7 h-7 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                    <span className="text-sm font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground flex-1">
                    {recommendation}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Model Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-card-foreground">
              <div className="p-2.5 rounded-xl bg-chart-4/10 border border-chart-4/20">
                <Settings className="w-6 h-6 text-chart-4" />
              </div>
              <span className="text-xl font-semibold">
                Configuración del Modelo
              </span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Parámetros técnicos del algoritmo de predicción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    Algoritmo:
                  </span>
                  <Badge
                    variant="ghost"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    Random Forest
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    Ventana de predicción:
                  </span>
                  <Badge
                    variant="ghost"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    30 días
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    Frecuencia de actualización:
                  </span>
                  <Badge
                    variant="ghost"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    Diaria
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    Validación cruzada:
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-chart-2/10 text-chart-2 border-chart-2/20"
                  >
                    5-fold
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    Hiperparámetros:
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-chart-2/10 text-chart-2 border-chart-2/20"
                  >
                    Optimizados
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    Detección de anomalías:
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-chart-2/10 text-chart-2 border-chart-2/20"
                  >
                    Activa
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
