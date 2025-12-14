"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { MedicationDetailDialog } from "./medication-detail-dialog";
import { OrderDialog } from "./order-dialog";
import { PredictionData } from "@/lib/analytics-data";

interface PredictionsTableDesktopProps {
  predictions: PredictionData[];
  sortBy: "risk" | "confidence" | "demand" | "name";
  sortDirection: "asc" | "desc";
  onSort: (column: "risk" | "confidence" | "demand" | "name") => void;
}

export function PredictionsTableDesktop({
  predictions,
  sortBy,
  sortDirection,
  onSort,
}: PredictionsTableDesktopProps) {
  const [selectedMedication, setSelectedMedication] =
    useState<PredictionData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Funciones helper dentro del componente
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-chart-2" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      case "stable":
        return <Minus className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "high":
        return "Alto";
      case "medium":
        return "Medio";
      case "low":
        return "Bajo";
      default:
        return "Medio";
    }
  };

  const getSeasonalityColor = (seasonality: string) => {
    switch (seasonality) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-accent";
      case "low":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const handleViewDetails = (prediction: PredictionData) => {
    setSelectedMedication(prediction);
    setIsDetailDialogOpen(true);
  };

  const handleCreateOrder = (prediction: PredictionData) => {
    setSelectedMedication(prediction);
    setIsOrderDialogOpen(true);
  };

  const SortHeader = ({
    column,
    children,
  }: {
    column: typeof sortBy;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortBy === column &&
          (sortDirection === "desc" ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          ))}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* Controles desktop */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={sortBy === "risk" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSort("risk")}
            className="flex items-center gap-2"
          >
            Ordenar por Riesgo
            {sortBy === "risk" &&
              (sortDirection === "desc" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              ))}
          </Button>
          <Button
            variant={sortBy === "confidence" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSort("confidence")}
            className="flex items-center gap-2"
          >
            Ordenar por Confianza
            {sortBy === "confidence" &&
              (sortDirection === "desc" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              ))}
          </Button>
          <Button
            variant={sortBy === "demand" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSort("demand")}
            className="flex items-center gap-2"
          >
            Ordenar por Demanda
            {sortBy === "demand" &&
              (sortDirection === "desc" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              ))}
          </Button>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <SortHeader column="name">Medicamento</SortHeader>
              <SortHeader column="demand">Stock Actual</SortHeader>
              <SortHeader column="demand">Demanda Predicha</SortHeader>
              <SortHeader column="demand">Orden Sugerida</SortHeader>
              <SortHeader column="confidence">Confianza</SortHeader>
              <TableHead>Tendencia</TableHead>
              <SortHeader column="risk">Riesgo</SortHeader>
              <TableHead className="w-[120px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction, index) => (
              <motion.tr
                key={prediction.medicationId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-muted/30 transition-colors group"
              >
                <TableCell>
                  <div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      {prediction.medicationName}
                    </div>
                    <div
                      className={`text-xs ${getSeasonalityColor(
                        prediction.seasonality
                      )}`}
                    >
                      Estacionalidad: {prediction.seasonality}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{prediction.currentStock}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {prediction.predictedDemand}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    próximos 30 días
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {prediction.recommendedOrder}
                    </span>
                    {prediction.recommendedOrder > 0 && (
                      <Badge variant="ghost" className="text-xs bg-accent/10">
                        Urgente
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 min-w-[100px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {prediction.confidence}%
                      </span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(prediction.trend)}
                    <span className="text-sm capitalize">
                      {prediction.trend}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getRiskColor(prediction.riskLevel)}
                    className="font-medium px-2 py-1"
                  >
                    {getRiskText(prediction.riskLevel)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewDetails(prediction)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {/* {prediction.recommendedOrder > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleCreateOrder(prediction)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    )} */}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border">
        <div className="text-center p-4 bg-background rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary">
            {predictions.reduce((sum, p) => sum + p.recommendedOrder, 0)}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Unidades Sugeridas
          </div>
        </div>

        <div className="text-center p-4 bg-background rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-chart-2">
            {Math.round(
              predictions.reduce((sum, p) => sum + p.confidence, 0) /
                predictions.length
            )}
            %
          </div>
          <div className="text-sm text-muted-foreground">
            Confianza Promedio
          </div>
        </div>

        <div className="text-center p-4 bg-background rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-destructive">
            {predictions.filter((p) => p.riskLevel === "high").length}
          </div>
          <div className="text-sm text-muted-foreground">
            Medicamentos de Alto Riesgo
          </div>
        </div>
      </div>

      {/* Diálogos */}
      <MedicationDetailDialog
        medication={selectedMedication}
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />

      <OrderDialog
        medication={selectedMedication}
        isOpen={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
      />
    </div>
  );
}
