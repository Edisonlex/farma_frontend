"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  TrendingDown,
  Calendar,
  Save,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Archive,
  Truck,
  Calculator,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventoryConfig } from "@/context/configuration-context";

// Extender la interfaz InventoryConfig para incluir propiedades adicionales
interface ExtendedInventoryConfig {
  // Propiedades originales
  defaultMinStock: number;
  defaultMaxStock: number;
  criticalStockLevel: number;
  reorderPoint: number;
  expiryWarningDays: number;
  criticalExpiryDays: number;
  autoRemoveExpired: boolean;
  autoReorder: boolean;
  autoReorderQuantity: number;
  autoAdjustments: boolean;
  autoCategories: boolean;
  defaultCategory: string;
  requireBatch: boolean;
  dailyReports: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  defaultSupplier: string;
  autoSupplierSelection: boolean;

  // Propiedades adicionales para la UI
  valuationMethod?: string;
  includeTaxInCost?: boolean;
  requireCategory?: boolean;
  requireSupplier?: boolean;
  enablePredictiveAnalysis?: boolean;
  analysisUpdateFrequency?: string;
  requireApprovalForAdjustments?: boolean;
  maxAdjustmentWithoutApproval?: number;
  trackMovementReasons?: boolean;
  syncWithPOS?: boolean;
  realTimeUpdates?: boolean;
  autoArchiveInactive?: boolean;
  inactivityPeriod?: number;
}

export function InventorySettings() {
  const { config: settings, updateConfig } = useInventoryConfig();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Las configuraciones ya se guardan automáticamente en el contexto
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Configuraciones de inventario guardadas exitosamente");
    } catch (error) {
      toast.error("Error al guardar las configuraciones");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof ExtendedInventoryConfig, value: any) => {
    updateConfig({ [key]: value } as Partial<ExtendedInventoryConfig>);
  };

  return (
    <div className="space-y-6">
      {/* Umbrales de Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Umbrales de Stock
          </CardTitle>
          <CardDescription>
            Configura los niveles de stock por defecto para nuevos medicamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultMinStock">Stock mínimo por defecto</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="defaultMinStock"
                  type="number"
                  min="1"
                  value={settings.defaultMinStock}
                  onChange={(e) =>
                    updateSetting("defaultMinStock", parseInt(e.target.value))
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">unidades</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultMaxStock">Stock máximo por defecto</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="defaultMaxStock"
                  type="number"
                  min="1"
                  value={settings.defaultMaxStock}
                  onChange={(e) =>
                    updateSetting("defaultMaxStock", parseInt(e.target.value))
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">unidades</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="criticalStockLevel">Nivel de stock crítico</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="criticalStockLevel"
                  type="number"
                  min="1"
                  value={settings.criticalStockLevel}
                  onChange={(e) =>
                    updateSetting(
                      "criticalStockLevel",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">unidades</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Punto de reorden</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="reorderPoint"
                  type="number"
                  min="1"
                  value={settings.reorderPoint}
                  onChange={(e) =>
                    updateSetting("reorderPoint", parseInt(e.target.value))
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">unidades</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Vencimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Gestión de Vencimientos
          </CardTitle>
          <CardDescription>
            Configura cómo el sistema maneja los medicamentos próximos a vencer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="expiryWarningDays">
                Días de advertencia de vencimiento
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="expiryWarningDays"
                  type="number"
                  min="1"
                  max="365"
                  value={settings.expiryWarningDays}
                  onChange={(e) =>
                    updateSetting("expiryWarningDays", parseInt(e.target.value))
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">días</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="criticalExpiryDays">
                Días para vencimiento crítico
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="criticalExpiryDays"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.criticalExpiryDays}
                  onChange={(e) =>
                    updateSetting(
                      "criticalExpiryDays",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">días</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Remover automáticamente productos vencidos</Label>
              <p className="text-sm text-muted-foreground">
                Los productos vencidos se marcarán como no disponibles
                automáticamente
              </p>
            </div>
            <Switch
              checked={settings.autoRemoveExpired}
              onCheckedChange={(checked) =>
                updateSetting("autoRemoveExpired", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Movimientos Automáticos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-green-500" />
            Movimientos Automáticos
          </CardTitle>
          <CardDescription>
            Configura las acciones automáticas del sistema de inventario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Reorden automático</Label>
                <p className="text-sm text-muted-foreground">
                  Generar órdenes de compra automáticamente cuando el stock esté
                  bajo
                </p>
              </div>
              <Switch
                checked={settings.autoReorder}
                onCheckedChange={(checked) =>
                  updateSetting("autoReorder", checked)
                }
              />
            </div>

            {settings.autoReorder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="ml-6 space-y-2"
              >
                <Label htmlFor="autoReorderQuantity">
                  Cantidad de reorden automática
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="autoReorderQuantity"
                    type="number"
                    min="1"
                    value={settings.autoReorderQuantity}
                    onChange={(e) =>
                      updateSetting(
                        "autoReorderQuantity",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    unidades
                  </span>
                </div>
              </motion.div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Ajustes automáticos</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir ajustes automáticos de inventario por discrepancias
                  menores
                </p>
              </div>
              <Switch
                checked={settings.autoAdjustments}
                onCheckedChange={(checked) =>
                  updateSetting("autoAdjustments", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valoración de Inventario - ELIMINADO ya que estas propiedades no existen en InventoryConfig */}

      {/* Campos Requeridos - ELIMINADO ya que estas propiedades no existen en InventoryConfig */}

      {/* Análisis Predictivo - ELIMINADO ya que estas propiedades no existen en InventoryConfig */}

      {/* Aprobaciones - ELIMINADO ya que estas propiedades no existen en InventoryConfig */}

      {/* Integración - ELIMINADO ya que estas propiedades no existen en InventoryConfig */}

      {/* Archivado - ELIMINADO ya que estas propiedades no existen en InventoryConfig */}

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-32">
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
}