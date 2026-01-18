"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Edit,
  Calendar,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Medication } from "@/lib/types";
import { cn, getDefaultImageForName } from "@/lib/utils";
import StockAdjustDialog from "@/components/inventory/adjustments/StockAdjustDialog";
import { MedicationDetailDialog } from "@/components/medications/medication-detail-dialog";
import Image from "next/image";

interface MedicationCardProps {
  medication: Medication;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function MedicationCard({
  medication,
  isExpanded,
  onToggleExpand,
}: MedicationCardProps) {
  const [showAdjust, setShowAdjust] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  // Funciones de utilidad integradas directamente
  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0)
      return {
        label: "Sin Stock",
        variant: "destructive" as const,
        icon: AlertTriangle,
        color: "text-destructive",
      };
    if (stock <= minStock)
      return {
        label: "Stock Bajo",
        variant: "secondary" as const,
        icon: AlertTriangle,
        color: "text-amber-600",
      };
    return {
      label: "Stock Normal",
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
    };
  };

  const isExpiringSoon = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const status = getStockStatus(medication.quantity, medication.minStock);
  const StatusIcon = status.icon;
  const expiringSoon = isExpiringSoon(medication.expiryDate);
  const daysUntilExpiry = getDaysUntilExpiry(medication.expiryDate);

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        expiringSoon && "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20",
        medication.quantity === 0 && "border-destructive/20 bg-destructive/5",
        isExpanded && "ring-2 ring-primary/20",
      )}
    >
      <CardContent className="p-4 md:p-6">
        {/* Header - Visible siempre */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0">
              <Image
                src={
                  medication.imageUrl || getDefaultImageForName(medication.name)
                }
                alt={medication.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = getDefaultImageForName(medication.name);
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{medication.name}</h3>
                {expiringSoon && (
                  <Badge
                    variant="ghost"
                    className="text-amber-600 border-amber-300 bg-amber-50"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {daysUntilExpiry}d
                  </Badge>
                )}
                <Badge
                  variant={status.variant}
                  className="gap-1 hidden md:flex"
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {medication.activeIngredient} • Lote: {medication.batch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className={cn("text-xl md:text-2xl font-bold", status.color)}>
                {medication.quantity}
              </p>
              <p className="text-xs text-muted-foreground">unidades</p>
            </div>

            <Badge variant={status.variant} className="gap-1 md:hidden">
              <StatusIcon className="h-3 w-3" />
              {medication.quantity}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpand}
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Información expandida */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Stock Mínimo:
                </span>
                <p className="font-medium">{medication.minStock}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Categoría:</span>
                <p className="font-medium capitalize">{medication.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Proveedor:
                </span>
                <p className="font-medium truncate">{medication.supplier}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Vencimiento:
                </span>
                <p
                  className={cn(
                    "font-medium",
                    expiringSoon ? "text-amber-600" : "",
                  )}
                >
                  {formatDate(medication.expiryDate)}
                  {expiringSoon && (
                    <span className="text-xs ml-1">({daysUntilExpiry}d)</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor Unit.:</span>
                <p className="font-medium">${medication.price}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdjust(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Ajustar Stock
              </Button>
              <Button size="sm" onClick={() => setShowDetail(true)}>
                Ver Detalles
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <StockAdjustDialog
        open={showAdjust}
        onOpenChange={setShowAdjust}
        medicationId={medication.id.toString()}
      />
      <MedicationDetailDialog
        medication={medication}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </Card>
  );
}
