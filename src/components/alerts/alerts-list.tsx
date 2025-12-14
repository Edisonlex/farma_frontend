"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Calendar,
  Package,
  CheckCircle,
  RotateCcw,
  Eye,
  Clock,
} from "lucide-react";
import type { Alert } from "@/lib/types";

interface AlertsListProps {
  alerts: Alert[];
  onResolve?: (id: string) => void;
  onUnresolve?: (id: string) => void;
}

export function AlertsList({
  alerts,
  onResolve,
  onUnresolve,
}: AlertsListProps) {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "stock_bajo":
        return Package;
      case "vencimiento":
        return Calendar;
      case "vencido":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (severity: Alert["severity"]) => {
    switch (severity) {
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

  const getSeverityText = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "Media";
    }
  };

  const getTypeText = (type: Alert["type"]) => {
    switch (type) {
      case "stock_bajo":
        return "Stock Bajo";
      case "vencimiento":
        return "Por Vencer";
      case "vencido":
        return "Vencido";
      default:
        return "Alerta";
    }
  };

  const handleSelectAlert = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedAlerts((prev) => [...prev, id]);
    } else {
      setSelectedAlerts((prev) => prev.filter((alertId) => alertId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(alerts.map((alert) => alert.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No hay alertas</h3>
        <p className="text-muted-foreground">
          No se encontraron alertas que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {(onResolve || onUnresolve) && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedAlerts.length === alerts.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedAlerts.length > 0
                ? `${selectedAlerts.length} seleccionadas`
                : "Seleccionar todas"}
            </span>
          </div>

          {selectedAlerts.length > 0 && (
            <div className="flex gap-2">
              {onResolve && (
                <Button
                  size="sm"
                  onClick={() => {
                    selectedAlerts.forEach((id) => onResolve(id));
                    setSelectedAlerts([]);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolver
                </Button>
              )}
              {onUnresolve && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    selectedAlerts.forEach((id) => onUnresolve(id));
                    setSelectedAlerts([]);
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reactivar
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Alerts List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.type);
            const isSelected = selectedAlerts.includes(alert.id);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`hover:shadow-md transition-all ${
                    isSelected ? "ring-2 ring-primary" : ""
                  } ${alert.resolved ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      {(onResolve || onUnresolve) && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectAlert(alert.id, checked as boolean)
                          }
                          className="mt-1"
                        />
                      )}

                      {/* Alert Icon */}
                      <div
                        className={`p-2 rounded-full ${
                          alert.severity === "high"
                            ? "bg-destructive/10"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            alert.severity === "high"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>

                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold truncate">
                            {alert.medicationName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={getAlertColor(alert.severity)}
                              className="text-xs"
                            >
                              {getSeverityText(alert.severity)}
                            </Badge>
                            <Badge variant="ghost" className="text-xs">
                              {getTypeText(alert.type)}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {alert.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.date.toLocaleDateString("es-ES")}
                            </span>
                            {alert.resolved && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resuelta
                              </Badge>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>

                            {!alert.resolved && onResolve && (
                              <Button
                                size="sm"
                                onClick={() => onResolve(alert.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Resolver
                              </Button>
                            )}

                            {alert.resolved && onUnresolve && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onUnresolve(alert.id)}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reactivar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
