import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Activity,
  CalendarClock,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Bell,
  Users,
} from "lucide-react";

const reportTypes = [
  {
    value: "inventory",
    label: "Inventario General",
    description: "Estado actual del inventario",
    icon: Package,
    color: "text-blue-500",
  },
  {
    value: "movements",
    label: "Movimientos",
    description: "Entradas y salidas de medicamentos",
    icon: Activity,
    color: "text-green-500",
  },
  {
    value: "expired",
    label: "Vencidos",
    description: "Medicamentos ya vencidos",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    value: "low-stock",
    label: "Stock Bajo",
    description: "Medicamentos con stock crítico",
    icon: TrendingDown,
    color: "text-yellow-600",
  },
  {
    value: "analytics",
    label: "Análisis Predictivo",
    description: "Predicciones y tendencias",
    icon: BarChart3,
    color: "text-purple-500",
  },
  {
    value: "alerts",
    label: "Alertas",
    description: "Alertas del sistema",
    icon: Bell,
    color: "text-pink-500",
  },
  {
    value: "clients",
    label: "Clientes",
    description: "Información de clientes",
    icon: Users,
    color: "text-indigo-500",
  },
  {
    value: "suppliers",
    label: "Proveedores",
    description: "Directorio de proveedores",
    icon: Users,
    color: "text-cyan-600",
  },
];

interface ReportTypeSelectorProps {
  reportType: string;
  setReportType: (type: string) => void;
}

export function ReportTypeSelector({
  reportType,
  setReportType,
}: ReportTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tipo de Reporte</label>
      <Select value={reportType} onValueChange={setReportType}>
        <SelectTrigger className="h-auto py-3">
          <SelectValue placeholder="Selecciona el tipo de reporte" />
        </SelectTrigger>
        <SelectContent className="border-border bg-background max-h-[300px]">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <SelectItem
                key={type.value}
                value={type.value}
                className="cursor-pointer py-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-md bg-muted ${type.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {type.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
