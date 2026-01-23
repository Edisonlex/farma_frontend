import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Eye, Download } from "lucide-react";
import { ReportTypeSelector } from "./ReportTypeSelector";
import { FormatSelector } from "./FormatSelector";
import { DateRangeFilter } from "./DateRangeFilter";
import { CategoryFilter } from "./CategoryFilter";
import { SupplierFilter } from "./SupplierFilter";
import { BatchFilter } from "./BatchFilter";


interface ReportConfigProps {
  reportType: string;
  setReportType: (type: string) => void;
  formatType: string;
  setFormatType: (type: string) => void;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
  category: string;
  setCategory: (category: string) => void;
  supplierFilter: string;
  setSupplierFilter: (supplier: string) => void;
  batchFilter: string;
  setBatchFilter: (batch: string) => void;
  isGenerating: boolean;
  handleGenerateReport: () => void;
  showPreview: boolean;
  handleDownloadReport: () => void;
  categories: string[];
  suppliers: string[];
}

export function ReportConfig({
  reportType,
  setReportType,
  formatType,
  setFormatType,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  category,
  setCategory,
  supplierFilter,
  setSupplierFilter,
  batchFilter,
  setBatchFilter,
  isGenerating,
  handleGenerateReport,
  showPreview,
  handleDownloadReport,
  categories,
  suppliers,
}: ReportConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Reporte</CardTitle>
        <CardDescription>
          Selecciona el tipo de reporte y configura los filtros
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tipo de Reporte */}
        <ReportTypeSelector
          reportType={reportType}
          setReportType={setReportType}
        />

        {/* Formato */}
        <FormatSelector formatType={formatType} setFormatType={setFormatType} />

        <Separator />

        {/* Filtros */}
        <div className="space-y-4">
          <h3 className="font-medium">Filtros</h3>

          {/* Rango de Fechas - Solo para movimientos y alertas */}
          {(reportType === "movements" || reportType === "alerts") && (
            <DateRangeFilter
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
            />
          )}

          {/* Categoría - Solo para reportes de inventario */}
          {(reportType === "inventory" ||
            reportType === "expiring" ||
            reportType === "expired" ||
            reportType === "low-stock") && (
            <CategoryFilter
              category={category}
              setCategory={setCategory}
              categories={categories}
            />
          )}

          {/* Proveedor - Solo para reportes de inventario */}
          {(reportType === "inventory" ||
            reportType === "expiring" ||
            reportType === "expired" ||
            reportType === "low-stock") && (
            <SupplierFilter
              supplierFilter={supplierFilter}
              setSupplierFilter={setSupplierFilter}
              suppliers={suppliers}
            />
          )}

          {/* Lote específico - Solo para reportes de inventario */}
          {(reportType === "inventory" ||
            reportType === "expiring" ||
            reportType === "expired" ||
            reportType === "low-stock") && (
            <BatchFilter
              batchFilter={batchFilter}
              setBatchFilter={setBatchFilter}
            />
          )}

          {dateFrom && dateTo && dateFrom > dateTo && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              ⚠️ La fecha de inicio debe ser anterior a la fecha de fin
            </div>
          )}
        </div>

        <Separator />

        {/* Acciones */}
        <div className="flex justify-end">
          {showPreview && (
            <Button onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
