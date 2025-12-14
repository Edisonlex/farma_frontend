"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Calendar,
  Package,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  BellOff,
  X,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Alert } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

interface AlertsWidgetProps {
  alerts: Alert[];
  onResolveAlert?: (id: string) => void;
  onNavigateToResolution?: (alert: Alert) => void;
}

type AlertFilter = "all" | "unresolved" | "resolved";
type AlertTypeFilter = "all" | "stock_bajo" | "vencimiento" | "vencido";
type SeverityFilter = "all" | "high" | "medium" | "low";

export function AlertsWidget({
  alerts,
  onResolveAlert,
  onNavigateToResolution,
}: AlertsWidgetProps) {
  const { user } = useAuth();
  const canResolve = Boolean(
    user && (hasPermission(user.role, "manage_inventory") || hasPermission(user.role, "manage_medications"))
  );
  const [filter, setFilter] = useState<AlertFilter>("unresolved");
  const [typeFilter, setTypeFilter] = useState<AlertTypeFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "stock_bajo":
        return Package;
      case "vencimiento":
        return Calendar;
      case "vencido":
        return AlertTriangle;
      case "tarea_tecnica":
        return Eye;
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
        return "Próximo a Vencer";
      case "vencido":
        return "Vencido";
      default:
        return "Alerta";
    }
  };

  const getTypeColor = (type: Alert["type"]) => {
    switch (type) {
      case "stock_bajo":
        return "bg-chart-5/20 text-chart-5 border-chart-5/30";
      case "vencimiento":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      case "vencido":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getTypeBackground = (type: Alert["type"]) => {
    switch (type) {
      case "stock_bajo":
        return "bg-chart-5/10";
      case "vencimiento":
        return "bg-chart-3/10";
      case "vencido":
        return "bg-destructive/10";
      default:
        return "bg-muted";
    }
  };

  const getResolutionPath = (type: Alert["type"]) => {
    switch (type) {
      case "stock_bajo":
        return "/inventario";
      case "vencimiento":
      case "vencido":
        return "/vencimientos";
      default:
        return "/alertas";
    }
  };

  // Filtrar alertas según los criterios seleccionados
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "unresolved" && alert.resolved) return false;
    if (filter === "resolved" && !alert.resolved) return false;
    if (typeFilter !== "all" && alert.type !== typeFilter) return false;
    if (severityFilter !== "all" && alert.severity !== severityFilter)
      return false;
    if (
      searchQuery &&
      !alert.medicationName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Configuración de paginación
  const alertsPerPage = 6;
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);

  // Calcular alertas para la página actual
  const startIndex = (currentPage - 1) * alertsPerPage;
  const endIndex = startIndex + alertsPerPage;
  const displayedAlerts = filteredAlerts.slice(startIndex, endIndex);

  const unresolvedCount = alerts.filter((alert) => !alert.resolved).length;
  const resolvedCount = alerts.filter((alert) => alert.resolved).length;
  const highSeverityCount = alerts.filter(
    (alert) => alert.severity === "high" && !alert.resolved
  ).length;

  const resolveAlert = (id: string) => {
    if (onResolveAlert) {
      onResolveAlert(id);
    } else {
      console.log(`Resolviendo alerta ${id}`);
    }
  };

  const navigateToResolution = (alert: Alert) => {
    if (onNavigateToResolution) {
      onNavigateToResolution(alert);
    } else {
      console.log(`Navegando a resolver: ${alert.medicationName}`);
      const path = getResolutionPath(alert.type);
      console.log(`Redirigiendo a: ${path}`);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedAlert(expandedAlert === id ? null : id);
  };

  const clearFilters = () => {
    setFilter("all");
    setTypeFilter("all");
    setSeverityFilter("all");
    setSearchQuery("");
    setShowFilters(false);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedAlert(null);
  };

  const hasActiveFilters =
    typeFilter !== "all" || severityFilter !== "all" || searchQuery !== "";

  return (
    <Card className="w-full border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
                <div className="relative flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  {unresolvedCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
                      {unresolvedCount}
                    </span>
                  )}
                </div>
                Alertas del Sistema
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {unresolvedCount > 0
                  ? `${unresolvedCount} alertas requieren atención${
                      highSeverityCount > 0
                        ? `, ${highSeverityCount} de alta prioridad`
                        : ""
                    }`
                  : "No hay alertas pendientes"}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar" : "Filtros"}
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={clearFilters}
            >
              <Eye className="w-4 h-4" />
              Ver Todas
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filtros y búsqueda */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 mb-4"
            >
              {/* Barra de búsqueda */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar medicamento..."
                  className="pl-8 border-border bg-background"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Selectores debajo de la barra de búsqueda */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  value={typeFilter}
                  onValueChange={(value: AlertTypeFilter) => {
                    setTypeFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="border-border bg-background">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="stock_bajo">Stock Bajo</SelectItem>
                    <SelectItem value="vencimiento">
                      Próximo a Vencer
                    </SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={severityFilter}
                  onValueChange={(value: SeverityFilter) => {
                    setSeverityFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="border-border bg-background">
                    <SelectValue placeholder="Todas las severidades" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Todas las severidades</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="p-3 bg-accent/10 rounded-lg mb-4 border border-accent/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Filtros activos:
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                Limpiar todos
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {typeFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                >
                  Tipo: {getTypeText(typeFilter)}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => {
                      setTypeFilter("all");
                      setCurrentPage(1);
                    }}
                  />
                </Badge>
              )}
              {severityFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/30"
                >
                  Severidad: {getSeverityText(severityFilter)}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => {
                      setSeverityFilter("all");
                      setCurrentPage(1);
                    }}
                  />
                </Badge>
              )}
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30"
                >
                  Búsqueda: {searchQuery}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Filtros de estado */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            className={filter === "all" ? "bg-primary hover:bg-primary/90" : ""}
          >
            Todas ({alerts.length})
          </Button>
          <Button
            variant={filter === "unresolved" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setFilter("unresolved");
              setCurrentPage(1);
            }}
            className={
              filter === "unresolved" ? "bg-primary hover:bg-primary/90" : ""
            }
          >
            Pendientes ({unresolvedCount})
          </Button>
          <Button
            variant={filter === "resolved" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setFilter("resolved");
              setCurrentPage(1);
            }}
            className={
              filter === "resolved" ? "bg-primary hover:bg-primary/90" : ""
            }
          >
            Resueltas ({resolvedCount})
          </Button>
        </div>

        {/* Información de paginación */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Mostrando {displayedAlerts.length} de {filteredAlerts.length}{" "}
            alertas
            {totalPages > 1 && ` - Página ${currentPage} de ${totalPages}`}
          </span>
        </div>

        {/* Lista de alertas */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BellOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay alertas que coincidan con los filtros</p>
              <Button
                variant="ghost"
                className="mt-4 border-border hover:bg-accent hover:text-accent-foreground"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {displayedAlerts.map((alert, index) => {
                const Icon = getAlertIcon(alert.type);
                const isExpanded = expandedAlert === alert.id;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`rounded-xl border border-border/50 bg-card transition-all overflow-hidden ${
                      isExpanded
                        ? "ring-2 ring-primary shadow-md"
                        : "hover:shadow-md hover:border-primary/30"
                    } ${alert.resolved ? "opacity-70" : ""}`}
                  >
                    <div
                      className="flex items-start space-x-3 p-4 cursor-pointer group"
                      onClick={() => toggleExpand(alert.id)}
                    >
                      <div
                        className={`p-3 rounded-xl ${getTypeBackground(
                          alert.type
                        )} group-hover:scale-110 transition-transform flex-shrink-0`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            alert.resolved
                              ? "text-muted-foreground"
                              : getTypeColor(alert.type).split(" ")[1]
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {alert.medicationName}
                          </h4>
                          <div className="flex gap-2 flex-shrink-0">
                            <Badge
                              variant={getAlertColor(alert.severity)}
                              className="text-xs"
                            >
                              {getSeverityText(alert.severity)}
                            </Badge>
                            {alert.resolved && (
                              <Badge
                                variant="ghost"
                                className="text-xs bg-muted/20"
                              >
                                Resuelta
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-xs mb-1 ${
                            getTypeColor(alert.type).split(" ")[1]
                          }`}
                        >
                          {getTypeText(alert.type)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.date.toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>

                    {/* Detalles expandidos */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-border/50"
                        >
                          <div className="p-4">
                            <p className="text-sm mb-3 text-foreground">
                              {alert.message}
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                              <div className="text-xs text-muted-foreground">
                                <p>ID: {alert.id}</p>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {!alert.resolved && (
                                  <>
                                    {canResolve && (
                                      <Button
                                        size="sm"
                                        className="gap-2 bg-chart-5 hover:bg-chart-5/90"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          resolveAlert(alert.id);
                                        }}
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Marcar como resuelta
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToResolution(alert);
                                      }}
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      {canResolve ? "Resolver" : "Ver detalle"}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
