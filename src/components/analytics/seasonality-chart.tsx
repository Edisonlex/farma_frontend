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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Calendar } from "lucide-react";
import { useTheme } from "next-themes";

interface SeasonalityChartProps {
  data: any[];
}

export function SeasonalityChart({ data }: SeasonalityChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Colores optimizados para modo oscuro - consistentes con TrendChart
  const chartColors = {
    bar: isDark ? "oklch(0.75 0.12 170)" : "oklch(0.52 0.16 255)", // Azul adaptativo
    grid: isDark ? "oklch(0.25 0.02 250 / 0.3)" : "oklch(0.92 0.01 250 / 0.5)",
    text: isDark ? "oklch(0.95 0.01 250)" : "oklch(0.18 0.02 260)",
    mutedText: isDark ? "oklch(0.65 0.02 250)" : "oklch(0.55 0.02 260)",
    background: isDark ? "oklch(0.16 0.02 250)" : "oklch(1 0 0)",
  };

  // Calcular estadísticas basadas en los datos reales
  const calculateStats = () => {
    if (!data || data.length === 0) {
      return {
        peakMonth: "N/A",
        peakValue: 0,
        lowMonth: "N/A",
        lowValue: 0,
        seasonalVariation: 0,
      };
    }

    // Encontrar el mes con mayor demanda
    const peakData = data.reduce(
      (max, current) => (current.demand > max.demand ? current : max),
      data[0]
    );

    // Encontrar el mes con menor demanda
    const lowData = data.reduce(
      (min, current) => (current.demand < min.demand ? current : min),
      data[0]
    );

    // Calcular la variación estacional (diferencia porcentual entre pico y valle)
    const seasonalVariation =
      ((peakData.demand - lowData.demand) / lowData.demand) * 100;

    return {
      peakMonth: peakData.month,
      peakValue: peakData.demand,
      lowMonth: lowData.month,
      lowValue: lowData.demand,
      seasonalVariation: seasonalVariation,
    };
  };

  const stats = calculateStats();

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <div className="p-1 sm:p-2 rounded-lg bg-primary/10">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-lg sm:text-xl">Patrones Estacionales</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm sm:text-base">
          Variaciones de demanda a lo largo del año
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            demand: {
              label: "Demanda",
              color: chartColors.bar,
            },
          }}
          className="h-[220px] sm:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 15, right: 5, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="month"
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
                      <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-2 sm:p-3 shadow-lg max-w-[160px]">
                        <p className="text-sm font-medium text-foreground truncate">
                          {label}
                        </p>
                        <p
                          className="text-sm truncate"
                          style={{ color: chartColors.bar }}
                        >
                          Demanda: <strong>{payload[0]?.value} unidades</strong>
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
              <Bar
                dataKey="demand"
                fill={chartColors.bar}
                fillOpacity={isDark ? 0.8 : 0.7}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Métricas y estadísticas */}
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  Pico de demanda
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-primary truncate">
                {stats.peakMonth}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +{Math.round((stats.peakValue / stats.lowValue - 1) * 100)}%
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-chart-2/5 border border-chart-2/10">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-chart-2" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  Menor demanda
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-chart-2 truncate">
                {stats.lowMonth}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                -{Math.round((1 - stats.lowValue / stats.peakValue) * 100)}%
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-3 sm:p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm sm:text-base">
                  Variación estacional
                </div>
                <div className="text-xs text-muted-foreground">
                  Diferencia entre pico y valle
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground whitespace-nowrap">
                {Math.round(stats.seasonalVariation)}%
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center pt-1 sm:pt-2">
            <div className="flex items-center gap-1 sm:gap-2 text-xs">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: chartColors.bar }}
              ></div>
              <span className="text-muted-foreground">Demanda mensual</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
