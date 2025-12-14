"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Filter,
  Eye,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MedicationDetailDialog } from "./medication-detail-dialog";
import { OrderDialog } from "./order-dialog";
import { PredictionData } from "@/lib/analytics-data";

interface PredictionsTableMobileProps {
  predictions: PredictionData[];
  sortBy: "risk" | "confidence" | "demand" | "name";
  sortDirection: "asc" | "desc";
  onSort: (column: "risk" | "confidence" | "demand" | "name") => void;
}

export function PredictionsTableMobile({
  predictions,
  sortBy,
  sortDirection,
  onSort,
}: PredictionsTableMobileProps) {
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

  return (
    <div className="space-y-4">
      {/* Controles móviles */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="border-border bg-background"
            >
              <DropdownMenuItem onClick={() => onSort("risk")}>
                Por Riesgo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("confidence")}>
                Por Confianza
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("demand")}>
                Por Demanda
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("name")}>
                Por Nombre
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tarjetas para móvil */}
      <div className="grid gap-3">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.medicationId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  {prediction.medicationName}
                </h3>
                <span
                  className={`text-xs ${getSeasonalityColor(
                    prediction.seasonality
                  )}`}
                >
                  Estacionalidad: {prediction.seasonality}
                </span>
              </div>
              <Badge variant={getRiskColor(prediction.riskLevel)}>
                {getRiskText(prediction.riskLevel)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm text-muted-foreground">
                  Stock Actual
                </div>
                <div className="font-medium">{prediction.currentStock}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Demanda Pred.
                </div>
                <div className="font-medium">{prediction.predictedDemand}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Orden Sugerida
                </div>
                <div className="font-medium">{prediction.recommendedOrder}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tendencia</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(prediction.trend)}
                  <span className="text-sm capitalize">{prediction.trend}</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Confianza</span>
                <span className="text-sm font-medium">
                  {prediction.confidence}%
                </span>
              </div>
              <Progress value={prediction.confidence} className="h-2" />
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                {prediction.recommendedOrder > 0
                  ? "Necesita reabastecimiento"
                  : "Stock suficiente"}
              </div>
              <div className="flex gap-1">
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
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumen móvil */}
      <div className="grid grid-cols-1 gap-3 p-4 bg-muted/50 rounded-xl">
        <div className="text-center p-3 bg-background rounded-lg">
          <div className="text-xl font-bold text-primary">
            {predictions.reduce((sum, p) => sum + p.recommendedOrder, 0)}
          </div>
          <div className="text-xs text-muted-foreground">
            Total Unidades Sugeridas
          </div>
        </div>

        <div className="text-center p-3 bg-background rounded-lg">
          <div className="text-xl font-bold text-chart-2">
            {Math.round(
              predictions.reduce((sum, p) => sum + p.confidence, 0) /
                predictions.length
            )}
            %
          </div>
          <div className="text-xs text-muted-foreground">
            Confianza Promedio
          </div>
        </div>

        <div className="text-center p-3 bg-background rounded-lg">
          <div className="text-xl font-bold text-destructive">
            {predictions.filter((p) => p.riskLevel === "high").length}
          </div>
          <div className="text-xs text-muted-foreground">
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
