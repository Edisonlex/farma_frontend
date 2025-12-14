"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertsFiltersProps {
  selectedType: string
  onTypeChange: (type: string) => void
  selectedSeverity: string
  onSeverityChange: (severity: string) => void
  showResolved: boolean
  onShowResolvedChange: (show: boolean) => void
  alerts: Alert[]
}

export function AlertsFilters({
  selectedType,
  onTypeChange,
  selectedSeverity,
  onSeverityChange,
  showResolved,
  onShowResolvedChange,
  alerts,
}: AlertsFiltersProps) {
  const getTypeCount = (type: string) => {
    if (type === "all") return alerts.length
    return alerts.filter((alert) => alert.type === type).length
  }

  const getSeverityCount = (severity: string) => {
    if (severity === "all") return alerts.length
    return alerts.filter((alert) => alert.severity === severity).length
  }

  const clearFilters = () => {
    onTypeChange("all")
    onSeverityChange("all")
    onShowResolvedChange(false)
  }

  const hasActiveFilters = selectedType !== "all" || selectedSeverity !== "all" || showResolved

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Alertas
            </CardTitle>
            <CardDescription>
              Filtra las alertas por tipo, severidad y estado
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Alerta</Label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">
                  Todos los tipos ({getTypeCount("all")})
                </SelectItem>
                <SelectItem value="stock_bajo">
                  Stock Bajo ({getTypeCount("stock_bajo")})
                </SelectItem>
                <SelectItem value="vencimiento">
                  Por Vencer ({getTypeCount("vencimiento")})
                </SelectItem>
                <SelectItem value="vencido">
                  Vencido ({getTypeCount("vencido")})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Severidad</Label>
            <Select value={selectedSeverity} onValueChange={onSeverityChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  Todas las severidades ({getSeverityCount("all")})
                </SelectItem>
                <SelectItem value="high">
                  Alta ({getSeverityCount("high")})
                </SelectItem>
                <SelectItem value="medium">
                  Media ({getSeverityCount("medium")})
                </SelectItem>
                <SelectItem value="low">
                  Baja ({getSeverityCount("low")})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Resolved Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estado</Label>
            <div className="flex items-center space-x-2 p-3 border rounded-md">
              <Switch
                id="show-resolved"
                checked={showResolved}
                onCheckedChange={onShowResolvedChange}
              />
              <Label htmlFor="show-resolved" className="text-sm">
                Mostrar resueltas
              </Label>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-6 space-y-2">
            <Label className="text-sm font-medium">Filtros Activos</Label>
            <div className="flex flex-wrap gap-2">
              {selectedType !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Tipo:{" "}
                  {selectedType === "stock_bajo"
                    ? "Stock Bajo"
                    : selectedType === "vencimiento"
                    ? "Por Vencer"
                    : "Vencido"}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => onTypeChange("all")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              {selectedSeverity !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Severidad:{" "}
                  {selectedSeverity === "high"
                    ? "Alta"
                    : selectedSeverity === "medium"
                    ? "Media"
                    : "Baja"}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => onSeverityChange("all")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              {showResolved && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Mostrar resueltas
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => onShowResolvedChange(false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
