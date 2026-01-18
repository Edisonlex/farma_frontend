"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useDashboardData, type DashboardData } from "@/hooks/use-dashboard-data";

interface InventoryChartProps {
  data: DashboardData;
}

const CATEGORY_COLOR_VARS: Record<string, string> = {
  Analgésicos: "var(--chart-1)",
  Antibióticos: "var(--chart-2)",
  Antihistamínicos: "var(--chart-3)",
  Antiinflamatorios: "var(--chart-4)",
  Gastroprotectores: "var(--chart-5)",
};

const CATEGORY_ORDER = [
  "Analgésicos",
  "Antibióticos",
  "Antihistamínicos",
  "Antiinflamatorios",
  "Gastroprotectores",
];

export function InventoryChartContainer() {
  const { data, loading, error, refreshData } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-destructive">
          <p>{error}</p>
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <InventoryChart data={data} />;
}

export function InventoryChart({ data }: InventoryChartProps) {
  const sortedCategoryData = [...data.categoryData].sort((a, b) => {
    return CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name);
  });

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm" style={{ color: "var(--chart-1)" }}>
            Entradas: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm" style={{ color: "var(--chart-2)" }}>
            Salidas: <span className="font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="flex flex-col gap-2 ml-4">
        {payload.map((entry: any, index: number) => {
          const name = entry?.payload?.name ?? entry?.value;
          const item = sortedCategoryData.find((i) => i.name === name);
          const colorVar =
            CATEGORY_COLOR_VARS[name as keyof typeof CATEGORY_COLOR_VARS];

          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: colorVar }}
              />
              <span className="text-sm text-foreground">
                {name} {item?.percentage}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Category Distribution */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">
            Distribución por Categorías
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Cantidad de medicamentos por categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedCategoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ value }) => `${value}`}
                >
                  {sortedCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLOR_VARS[entry.name]}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as any;
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-md text-sm">
                          <div className="font-medium">{d.name}</div>
                          <div>Cantidad: {d.value}</div>
                          <div>Porcentaje: {d.percentage}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  content={renderCustomizedLegend}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Movements */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">
            Movimientos Mensuales
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Entradas y salidas de inventario por mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.monthlyMovements || []}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                barSize={32}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => Number(v).toLocaleString()}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="entradas"
                  fill={"var(--chart-1)"}
                  radius={[6, 6, 0, 0]}
                  name="Entradas"
                >
                  <LabelList
                    dataKey="entradas"
                    position="top"
                    className="fill-foreground"
                    formatter={(v: any) =>
                      v ? Number(v).toLocaleString() : ""
                    }
                  />
                </Bar>
                <Bar
                  dataKey="salidas"
                  fill={"var(--chart-2)"}
                  radius={[6, 6, 0, 0]}
                  name="Salidas"
                >
                  <LabelList
                    dataKey="salidas"
                    position="top"
                    className="fill-foreground"
                    formatter={(v: any) => (v ? Number(v).toLocaleString() : "")}
                  />
                </Bar>
                <Legend
                  content={() => (
                    <div className="flex gap-4 justify-center pt-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: "var(--chart-1)" }}
                        />
                        <span className="text-sm text-foreground">
                          Entradas
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: "var(--chart-2)" }}
                        />
                        <span className="text-sm text-foreground">Salidas</span>
                      </div>
                    </div>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
