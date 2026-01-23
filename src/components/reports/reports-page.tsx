"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/components/ui/use-toast";
import { ReportData, ReportHistoryItem } from "./report/types";
import { generateReportData } from "@/utils/report-generator";
import { generateExcel, generatePDF } from "@/utils/file-exporter";
import { ReportConfig } from "./report/ReportConfig";
import { ReportPreview } from "./report-preview";
import { ReportHistory } from "./report-history";
import { useInventory } from "@/context/inventory-context";
import { useAlerts } from "@/context/AlertsContext";

export function ReportsPage() {
  const { medications, movements } = useInventory();
  const { alerts, unresolvedAlerts } = useAlerts();
  const [reportType, setReportType] = useState("inventory");
  const [formatType, setFormatType] = useState("pdf");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [category, setCategory] = useState("all");
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("");
  const [currentReportData, setCurrentReportData] = useState<ReportData | null>(
    null
  );
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const { toast } = useToast();

  // Cargar historial desde localStorage al inicializar
  useEffect(() => {
    const savedHistory = localStorage.getItem("reportHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convertir las fechas de string a objetos Date
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          data: item.data
            ? {
                ...item.data,
                generatedAt: new Date(item.data.generatedAt),
                dateRange: {
                  from: item.data.dateRange.from
                    ? new Date(item.data.dateRange.from)
                    : undefined,
                  to: item.data.dateRange.to
                    ? new Date(item.data.dateRange.to)
                    : undefined,
                },
                data: item.data.data.map((item: any) => ({
                  ...item,
                  expiryDate: item.expiryDate
                    ? new Date(item.expiryDate)
                    : undefined,
                  lastMovement: item.lastMovement
                    ? new Date(item.lastMovement)
                    : undefined,
                  date: item.date ? new Date(item.date) : undefined,
                  createdAt: item.createdAt
                    ? new Date(item.createdAt)
                    : undefined,
                  birthDate: item.birthDate
                    ? new Date(item.birthDate)
                    : undefined,
                  lastPurchase: item.lastPurchase
                    ? new Date(item.lastPurchase)
                    : undefined,
                })),
              }
            : undefined,
        }));
        setReportHistory(historyWithDates);
      } catch (error) {
        console.error("Error loading report history:", error);
      }
    }
  }, []);

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (reportHistory.length > 0) {
      localStorage.setItem("reportHistory", JSON.stringify(reportHistory));
    }
  }, [reportHistory]);

  const handleGenerateReport = async () => {
    if (!reportType || !formatType) {
      toast({
        title: "Faltan parámetros",
        description: "Selecciona un tipo y formato de reporte",
        variant: "destructive",
      });
      return;
    }

    if (dateFrom && dateTo && dateFrom > dateTo) {
      toast({
        title: "Error en fechas",
        description: "La fecha de inicio debe ser anterior a la fecha de fin",
        variant: "destructive",
      });
      return;
    }

    const reportData = generateReportData(
      reportType,
      dateFrom,
      dateTo,
      category,
      supplierFilter,
      batchFilter,
      { medications, movements, alerts: unresolvedAlerts }
    );

    setCurrentReportData(reportData);
    setShowPreview(true);

    // Agregar al historial
    const newReport: ReportHistoryItem = {
      id: Date.now(),
      name: `${reportTypeLabels[reportType]} - ${new Date().toLocaleDateString(
        "es-ES",
        {
          month: "long",
          year: "numeric",
        }
      )}`,
      type: reportType,
      format: formatType,
      status: "completed",
      createdAt: new Date(),
      size: formatType === "pdf" ? "2.3 MB" : "1.8 MB",
      data: reportData,
    };

    setReportHistory((prev) => [newReport, ...prev]);

    toast({
      title: "Reporte generado",
      description: "El reporte se ha generado correctamente",
    });
  };

  const handleDownloadReport = () => {
    // Regenerar siempre con parámetros actuales para evitar desalineos de tipo/datos
    const freshData = generateReportData(
      reportType,
      dateFrom,
      dateTo,
      category,
      supplierFilter,
      batchFilter,
      { medications, movements, alerts: unresolvedAlerts }
    );

    if (formatType === "pdf") {
      generatePDF(freshData, reportType);
    } else {
      generateExcel(freshData, reportType);
    }

    toast({
      title: "Descarga iniciada",
      description: "El reporte se está descargando",
    });
  };

  // Actualizar vista previa automáticamente cuando cambian las opciones o los datos fuente
  useEffect(() => {
    const data = generateReportData(
      reportType,
      dateFrom,
      dateTo,
      category,
      supplierFilter,
      batchFilter,
      { medications, movements, alerts: unresolvedAlerts },
    );
    setCurrentReportData(data);
    setShowPreview(true);
  }, [
    reportType,
    formatType,
    dateFrom,
    dateTo,
    category,
    supplierFilter,
    batchFilter,
    medications,
    movements,
    unresolvedAlerts,
  ]);

  const handleDownloadHistoryItem = (reportId: number) => {
    const report = reportHistory.find((item) => item.id === reportId);
    if (!report || !report.data) return;

    if (report.format === "pdf") {
      generatePDF(report.data, report.type);
    } else {
      generateExcel(report.data, report.type);
    }

    toast({
      title: "Descargando reporte histórico",
      description: `Descargando ${report.name}`,
    });
  };

  const handleRegenerateReport = (reportId: number) => {
    const report = reportHistory.find((item) => item.id === reportId);
    if (!report) return;

    // Establecer los parámetros del reporte seleccionado
    setReportType(report.type);
    setFormatType(report.format);

    if (report.data) {
      setDateFrom(report.data.dateRange.from);
      setDateTo(report.data.dateRange.to);
      setCategory(report.data.category);
      setSupplierFilter(report.data.supplier);
      setBatchFilter(report.data.batch);

      setCurrentReportData(report.data);
      setShowPreview(true);
    }

    toast({
      title: "Parámetros cargados",
      description: "Configuración del reporte histórico cargada",
    });
  };

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

  // Obtener categorías únicas de los medicamentos
  const categories = Array.from(
    new Set(medications.map((med) => med.category))
  );
  // Obtener proveedores únicos de los medicamentos
  const suppliers = Array.from(new Set(medications.map((med) => med.supplier)));

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Generación de Reportes"
        subtitle="Genera reportes personalizados en PDF o Excel"
        icon={<BarChart3 className="h-5 w-5 text-primary" />}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          

          <div className="p-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Configuración del Reporte */}
              <div className="lg:col-span-2">
                <ReportConfig
                  reportType={reportType}
                  setReportType={setReportType}
                  formatType={formatType}
                  setFormatType={setFormatType}
                  dateFrom={dateFrom}
                  setDateFrom={setDateFrom}
                  dateTo={dateTo}
                  setDateTo={setDateTo}
                  category={category}
                  setCategory={setCategory}
                  supplierFilter={supplierFilter}
                  setSupplierFilter={setSupplierFilter}
                  batchFilter={batchFilter}
                  setBatchFilter={setBatchFilter}
                  isGenerating={isGenerating}
                  handleGenerateReport={handleGenerateReport}
                  showPreview={showPreview}
                  handleDownloadReport={handleDownloadReport}
                  categories={categories}
                  suppliers={suppliers}
                />
              </div>

              {/* Vista Previa */}
              <div>
                {showPreview && currentReportData ? (
                  <ReportPreview
                    type={reportType}
                    format={formatType}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    category={category}
                    supplier={supplierFilter}
                    batch={batchFilter}
                    data={currentReportData}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center text-muted-foreground">
                        Vista Previa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Configura y genera un reporte para ver la vista previa
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Historial de Reportes */}
            <ReportHistory
              reports={reportHistory}
              onDownload={handleDownloadHistoryItem}
              onRegenerate={handleRegenerateReport}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
