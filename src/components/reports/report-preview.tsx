"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TableIcon,
  Package,
  AlertTriangle,
  Calendar,
  Users,
  BarChart3,
  Move3D,
} from "lucide-react";
import { format as formatDate } from "date-fns";
import { es } from "date-fns/locale";

interface ReportPreviewProps {
  type: string;
  format: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  supplier?: string;
  batch?: string;
  data?: any;
}

const reportTypeLabels: Record<string, string> = {
  inventory: "Inventario General",
  movements: "Movimientos",
  expiring: "Próximos a Vencer",
  expired: "Vencidos",
  "low-stock": "Stock Bajo",
  analytics: "Análisis Predictivo",
  alerts: "Alertas",
  clients: "Clientes",
};

const reportIcons: Record<string, any> = {
  inventory: Package,
  movements: Move3D,
  expiring: Calendar,
  expired: AlertTriangle,
  "low-stock": AlertTriangle,
  analytics: BarChart3,
  alerts: AlertTriangle,
  clients: Users,
};

export function ReportPreview({
  type,
  format,
  dateFrom,
  dateTo,
  category,
  supplier,
  batch,
  data,
}: ReportPreviewProps) {
  const FormatIcon = format === "pdf" ? FileText : TableIcon;
  const ReportIcon = reportIcons[type] || FileText;

  const getSummaryText = () => {
    if (!data) return null;

    switch (type) {
      case "inventory":
      case "expiring":
      case "expired":
      case "low-stock":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{data.totalItems}</div>
              <div className="text-xs text-muted-foreground">Registros</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                ${data.summary?.totalValue?.toFixed(2) || "0.00"}
              </div>
              <div className="text-xs text-muted-foreground">Valor Total</div>
            </div>
            {data.summary?.lowStockCount !== undefined && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {data.summary.lowStockCount}
                </div>
                <div className="text-xs text-muted-foreground">Stock Bajo</div>
              </div>
            )}
            {data.summary?.expiringCount !== undefined && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {data.summary.expiringCount}
                </div>
                <div className="text-xs text-muted-foreground">Por Vencer</div>
              </div>
            )}
          </div>
        );

      case "movements":
        const entradas =
          data.data?.filter((m: any) => m.type === "entrada").length || 0;
        const salidas =
          data.data?.filter((m: any) => m.type === "salida").length || 0;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{data.totalItems}</div>
              <div className="text-xs text-muted-foreground">Movimientos</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {entradas}
              </div>
              <div className="text-xs text-muted-foreground">Entradas</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{salidas}</div>
              <div className="text-xs text-muted-foreground">Salidas</div>
            </div>
          </div>
        );

      case "alerts":
        const severities = {
          high:
            data.data?.filter((a: any) => a.severity === "high").length || 0,
          medium:
            data.data?.filter((a: any) => a.severity === "medium").length || 0,
          low: data.data?.filter((a: any) => a.severity === "low").length || 0,
        };
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{data.totalItems}</div>
              <div className="text-xs text-muted-foreground">Alertas</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {severities.high}
              </div>
              <div className="text-xs text-muted-foreground">Alto</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {severities.medium}
              </div>
              <div className="text-xs text-muted-foreground">Medio</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {severities.low}
              </div>
              <div className="text-xs text-muted-foreground">Bajo</div>
            </div>
          </div>
        );

      case "clients":
        const types = {
          particular:
            data.data?.filter((c: any) => c.type === "particular").length || 0,
          empresa:
            data.data?.filter((c: any) => c.type === "empresa").length || 0,
          institucion:
            data.data?.filter((c: any) => c.type === "institucion").length || 0,
        };
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{data.totalItems}</div>
              <div className="text-xs text-muted-foreground">Clientes</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{types.particular}</div>
              <div className="text-xs text-muted-foreground">Particulares</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{types.empresa}</div>
              <div className="text-xs text-muted-foreground">Empresas</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{types.institucion}</div>
              <div className="text-xs text-muted-foreground">Instituciones</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center p-4 bg-muted rounded-lg mt-4">
            <div className="text-2xl font-bold">{data.totalItems}</div>
            <div className="text-xs text-muted-foreground">Registros</div>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReportIcon className="h-5 w-5" />
          Vista Previa - {reportTypeLabels[type]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                FORMATO
              </label>
              <Badge variant="secondary" className="ml-0 mt-1">
                <FormatIcon className="mr-1 h-3 w-3" />
                {format.toUpperCase()}
              </Badge>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                REGISTROS
              </label>
              <div className="text-sm font-medium text-right">
                {data?.totalItems || 0}
              </div>
            </div>
          </div>

          {(dateFrom || dateTo) && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                PERÍODO
              </label>
              <p className="text-sm">
                {dateFrom && formatDate(dateFrom, "dd/MM/yyyy", { locale: es })}
                {dateFrom && dateTo && " - "}
                {dateTo && formatDate(dateTo, "dd/MM/yyyy", { locale: es })}
              </p>
            </div>
          )}

          {category && category !== "all" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                CATEGORÍA
              </label>
              <p className="text-sm capitalize">{category}</p>
            </div>
          )}

          {supplier && supplier !== "all" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                PROVEEDOR
              </label>
              <p className="text-sm">{supplier}</p>
            </div>
          )}

          {batch && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                LOTE
              </label>
              <p className="text-sm">{batch}</p>
            </div>
          )}
        </div>

        {getSummaryText()}

        <div className="border rounded-lg p-4 bg-muted/50 mt-4">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">
              Contenido del Reporte
            </div>
            <div className="text-sm text-muted-foreground">
              {data?.totalItems || 0} registros listos para exportar
            </div>
            {data?.summary?.totalValue && (
              <div className="text-sm font-medium mt-2">
                Valor total: ${data.summary.totalValue.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
