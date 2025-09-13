"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Table,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportHistoryItem {
  id: number;
  name: string;
  type: string;
  format: string;
  status: "completed" | "generating";
  createdAt: Date;
  size: string | null;
  data?: any;
}

interface ReportHistoryProps {
  reports: ReportHistoryItem[];
  onDownload: (reportId: number) => void;
  onRegenerate: (reportId: number) => void;
}

const reportTypeLabels: Record<string, string> = {
  inventory: "Inventario",
  movements: "Movimientos",
  expiring: "Próximos a Vencer",
  expired: "Vencidos",
  "low-stock": "Stock Bajo",
  analytics: "Análisis",
  alerts: "Alertas",
  clients: "Clientes",
};

export function ReportHistory({
  reports,
  onDownload,
  onRegenerate,
}: ReportHistoryProps) {
  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">
              No hay reportes generados aún
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Reportes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => {
            const Icon = report.format === "pdf" ? FileText : Table;

            return (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{report.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="ghost" className="text-xs">
                        {reportTypeLabels[report.type] || report.type}
                      </Badge>
                      <Badge variant="ghost" className="text-xs">
                        {report.format.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={
                          report.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {report.status === "completed" ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            <span className="hidden sm:inline">Completado</span>
                            <span className="sm:hidden">Listo</span>
                          </>
                        ) : (
                          <>
                            <Clock className="mr-1 h-3 w-3" />
                            <span className="hidden sm:inline">Generando</span>
                            <span className="sm:hidden">Pendiente</span>
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {format(report.createdAt, "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })}
                      </span>
                      {report.size && (
                        <span className="text-xs text-muted-foreground">
                          {report.size}
                        </span>
                      )}
                    </div>
                    {report.data && (
                      <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-2">
                        <span>Registros: {report.data.totalItems}</span>
                        {report.data.summary?.totalValue && (
                          <span>
                            Valor: ${report.data.summary.totalValue.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-auto">
                  {report.status === "completed" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(report.id)}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:block ml-1">Descargar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRegenerate(report.id)}
                        title="Reutilizar configuración"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:block ml-1">Reusar</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
