import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reportTypes = [
  {
    value: "inventory",
    label: "Inventario General",
    description: "Estado actual del inventario",
  },
  {
    value: "movements",
    label: "Movimientos",
    description: "Entradas y salidas de medicamentos",
  },
  {
    value: "expiring",
    label: "Próximos a Vencer",
    description: "Medicamentos cerca del vencimiento",
  },
  {
    value: "expired",
    label: "Vencidos",
    description: "Medicamentos ya vencidos",
  },
  {
    value: "low-stock",
    label: "Stock Bajo",
    description: "Medicamentos con stock crítico",
  },
  {
    value: "analytics",
    label: "Análisis Predictivo",
    description: "Predicciones y tendencias",
  },
  {
    value: "alerts",
    label: "Alertas",
    description: "Alertas del sistema",
  },
  {
    value: "clients",
    label: "Clientes",
    description: "Información de clientes",
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
        <SelectTrigger>
          <SelectValue placeholder="Selecciona el tipo de reporte" />
        </SelectTrigger>
        <SelectContent className="border-border bg-background">
          {reportTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div>
                <div className="font-medium">{type.label}</div>
                <div className="text-xs ">
                  {type.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
