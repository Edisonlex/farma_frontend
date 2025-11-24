"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, XAxis, YAxis, Area, AreaChart } from "recharts";
import { TrendingUp, Calendar, Target, LineChart } from "lucide-react";
import { TrendData } from "@/lib/analytics-data";
import { useTheme } from "next-themes";

interface TrendChartProps {
  data: TrendData[];
}

export function TrendChart({ data }: TrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calcular métricas reales desde los datos
  const calculateMetrics = () => {
    if (!data || data.length === 0) {
      return { accuracy: 0, trend: 0, avgConfidence: 0 };
    }

    let totalError = 0;
    let totalActual = 0;
    let totalConfidence = 0;

    data.forEach((item) => {
      const error = Math.abs(item.actual - item.predicted);
      totalError += error;
      totalActual += item.actual;
      totalConfidence += item.confidence;
    });

    const accuracy = Math.max(0, 100 - (totalError / totalActual) * 100);
    const avgConfidence = totalConfidence / data.length;

    const firstMonth = data[0];
    const lastMonth = data[data.length - 1];
    const trendPercentage =
      ((lastMonth.predicted - firstMonth.predicted) / firstMonth.predicted) *
      100;

    return {
      accuracy: Math.round(accuracy),
      trend: Math.round(trendPercentage),
      avgConfidence: Math.round(avgConfidence),
    };
  };

  const metrics = calculateMetrics();

  const findPeaksAndValleys = () => {
    if (!data || data.length === 0) return { peak: null, valley: null };

    let peak = data[0];
    let valley = data[0];

    data.forEach((item) => {
      if (item.actual > peak.actual) peak = item;
      if (item.actual < valley.actual) valley = item;
    });

    return { peak, valley };
  };

  const { peak, valley } = findPeaksAndValleys();

  // Colores optimizados para modo oscuro
  const chartColors = {
    actual: isDark ? "oklch(0.75 0.12 170)" : "oklch(0.52 0.16 255)", // Azul adaptativo
    predicted: isDark ? "oklch(0.85 0.15 120)" : "oklch(0.85 0.12 170)", // Verde adaptativo
    grid: isDark ? "oklch(0.25 0.02 250 / 0.3)" : "oklch(0.92 0.01 250 / 0.5)",
    text: isDark ? "oklch(0.95 0.01 250)" : "oklch(0.18 0.02 260)",
    mutedText: isDark ? "oklch(0.65 0.02 250)" : "oklch(0.55 0.02 260)",
    background: isDark ? "oklch(0.16 0.02 250)" : "oklch(1 0 0)",
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <div className="p-1 sm:p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-lg sm:text-xl">Análisis de Tendencias</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm sm:text-base">
          Comparación entre consumo real y predicciones del modelo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            actual: {
              label: "Consumo Real",
              color: chartColors.actual,
            },
            predicted: {
              label: "Predicción",
              color: chartColors.predicted,
            },
          }}
          className="h-[220px] sm:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis
                dataKey="period"
                tick={{
                  fontSize: 10,
                  fill: chartColors.mutedText,
                }}
                axisLine={{ stroke: chartColors.grid }}
                tickLine={{ stroke: chartColors.grid }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: chartColors.mutedText,
                }}
                axisLine={{ stroke: chartColors.grid }}
                tickLine={{ stroke: chartColors.grid }}
                width={35}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-2 sm:p-3 shadow-lg max-w-[180px]">
                        <p className="text-sm font-medium text-foreground truncate">
                          {label}
                        </p>
                        {payload.map((entry, index) => (
                          <p
                            key={index}
                            className="text-sm truncate"
                            style={{ color: entry.color }}
                          >
                            {entry.name === "actual"
                              ? "Real: "
                              : "Predicción: "}
                            <strong>{entry.value} unidades</strong>
                          </p>
                        ))}
                        <p className="text-xs text-muted-foreground mt-1">
                          Confianza: {payload[0]?.payload.confidence}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{
                  fill: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={chartColors.actual}
                fill={chartColors.actual}
                fillOpacity={isDark ? 0.2 : 0.1}
                strokeWidth={2}
                activeDot={{
                  r: 4,
                  stroke: chartColors.actual,
                  strokeWidth: 2,
                  fill: isDark ? "oklch(0.16 0.02 250)" : "#ffffff",
                }}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke={chartColors.predicted}
                fill={chartColors.predicted}
                fillOpacity={isDark ? 0.15 : 0.08}
                strokeWidth={2}
                strokeDasharray="4 3"
                activeDot={{
                  r: 4,
                  stroke: chartColors.predicted,
                  strokeWidth: 2,
                  fill: isDark ? "oklch(0.16 0.02 250)" : "#ffffff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Métricas y estadísticas */}
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <LineChart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  Precisión
                </span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-primary">
                {metrics.accuracy}%
              </div>
              <div className="text-xs text-muted-foreground">
                Exactitud del modelo
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-chart-2/5 border border-chart-2/10">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-chart-2" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  Tendencia
                </span>
              </div>
              <div
                className={`text-lg sm:text-2xl font-bold ${
                  metrics.trend > 0 ? "text-chart-2" : "text-destructive"
                }`}
              >
                {metrics.trend > 0 ? "+" : ""}
                {metrics.trend}%
              </div>
              <div className="text-xs text-muted-foreground">
                Variación anual
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 sm:gap-3 p-3 bg-muted/30 rounded-lg">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground text-xs sm:text-sm">
                  Mayor consumo
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {peak?.period}: {peak?.actual} unidades
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-3 bg-muted/30 rounded-lg">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground text-xs sm:text-sm">
                  Confianza
                </div>
                <div className="text-xs text-muted-foreground">
                  Promedio: {metrics.avgConfidence}%
                </div>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-4 sm:gap-6 text-xs pt-1 sm:pt-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: chartColors.actual }}
              ></div>
              <span className="text-muted-foreground">Consumo Real</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: chartColors.predicted }}
              ></div>
              <span className="text-muted-foreground">Predicción</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
