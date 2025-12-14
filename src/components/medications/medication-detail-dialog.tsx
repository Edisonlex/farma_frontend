"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pill,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  Building,
  Hash,
} from "lucide-react";
import type { Medication } from "@/lib/types";

interface MedicationDetailDialogProps {
  medication: Medication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicationDetailDialog({
  medication,
  open,
  onOpenChange,
}: MedicationDetailDialogProps) {
  if (!medication) return null;

  const getStockStatus = () => {
    if (medication.quantity <= 0) {
      return { status: "sin-stock", color: "destructive", text: "Sin Stock" };
    }
    if (medication.quantity <= medication.minStock) {
      return { status: "stock-bajo", color: "destructive", text: "Stock Bajo" };
    }
    if (medication.quantity <= medication.minStock * 1.5) {
      return { status: "stock-medio", color: "default", text: "Stock Medio" };
    }
    return { status: "stock-bueno", color: "default", text: "Stock Bueno" };
  };

  const getExpiryStatus = () => {
    const today = new Date();
    const daysToExpiry = Math.ceil(
      (medication.expiryDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysToExpiry < 0) {
      return {
        status: "vencido",
        color: "destructive",
        text: "Vencido",
        urgent: true,
      };
    }
    if (daysToExpiry <= 30) {
      return {
        status: "por-vencer",
        color: "default",
        text: `Vence en ${daysToExpiry} días`,
        urgent: true,
      };
    }
    return {
      status: "vigente",
      color: "default",
      text: "Vigente",
      urgent: false,
    };
  };

  const stockStatus = getStockStatus();
  const expiryStatus = getExpiryStatus();
  const totalValue = medication.quantity * medication.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            {medication.name}
          </DialogTitle>
          <DialogDescription>
            Información detallada del medicamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Estado del Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {medication.quantity}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mínimo: {medication.minStock}
                    </div>
                  </div>
                  <Badge>{stockStatus.text}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Vencimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">
                      {medication.expiryDate.toLocaleDateString("es-ES")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {expiryStatus.text}
                    </div>
                  </div>
                  {expiryStatus.urgent && (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="w-4 h-4" />
                    Lote
                  </div>
                  <Badge variant="ghost" className="font-mono">
                    {medication.batch}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    Categoría
                  </div>
                  <Badge variant="secondary">{medication.category}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    Proveedor
                  </div>
                  <div className="font-medium">{medication.supplier}</div>
                </div>

                

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    Precio Unitario
                  </div>
                  <div className="font-medium">
                    ${medication.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen Financiero</CardTitle>
              <CardDescription>
                Valor total del stock disponible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${medication.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Precio Unitario
                  </div>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {medication.quantity}
                  </div>
                  <div className="text-sm text-muted-foreground">Unidades</div>
                </div>

                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${totalValue.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor Total
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
