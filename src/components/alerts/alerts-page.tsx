"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";
import {
  AlertTriangle,
  Search,
  Filter,
  Settings,
  Bell,
  LogOut,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { AlertsList } from "./alerts-list";
import { AlertsFilters } from "./alerts-filters";
import { AlertsSettings } from "./alerts-settings";
import { AlertsStats } from "./alerts-stats";
import type { Alert } from "@/lib/types";
import { useAlerts } from "@/context/AlertsContext";

export function AlertsPage() {
  const { user, logout } = useAuth();
  const { alerts, unresolvedAlerts, resolveAlert, resolveAllAlerts, unresolveAlert } = useAlerts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [showResolved, setShowResolved] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const canManage = user && hasPermission(user.role, "manage_alerts");

  

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || alert.type === selectedType;
    const matchesSeverity =
      selectedSeverity === "all" || alert.severity === selectedSeverity;
    const matchesResolved = showResolved || !alert.resolved;

    return matchesSearch && matchesType && matchesSeverity && matchesResolved;
  });

  const handleResolveAlert = (id: string) => {
    resolveAlert(id);
  };

  const handleUnresolveAlert = (id: string) => {
    unresolveAlert(id);
  };

  const handleBulkResolve = () => {
    resolveAllAlerts();
  };

  const activeAlerts = unresolvedAlerts;
  const resolvedAlerts = alerts.filter((alert) => alert.resolved);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sistema de Alertas</h1>
                <p className="text-sm text-muted-foreground">
                  {activeAlerts.length} alertas activas de {alerts.length} total
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {activeAlerts.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {activeAlerts.length}
                  </Badge>
                )}
              </Button>

              <div className="text-right">
                <p className="font-medium">{user?.name}</p>
                <Badge variant="secondary" className="text-xs capitalize">
                  {user?.role}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stats Overview */}
          <div className="mb-8">
            <AlertsStats alerts={alerts} />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar alertas por medicamento o mensaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>

              {canManage && activeAlerts.length > 0 && (
                <Button
                  onClick={() => handleBulkResolve()}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolver Todas
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <AlertsFilters
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedSeverity={selectedSeverity}
                onSeverityChange={setSelectedSeverity}
                showResolved={showResolved}
                onShowResolvedChange={setShowResolved}
                alerts={alerts}
              />
            </motion.div>
          )}

          {/* Alerts Tabs */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Activas ({activeAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resueltas ({resolvedAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Alertas Activas
                  </CardTitle>
                  <CardDescription>
                    Alertas que requieren atención inmediata
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsList
                    alerts={filteredAlerts.filter((alert) => !alert.resolved)}
                    onResolve={canManage ? handleResolveAlert : undefined}
                    onUnresolve={canManage ? handleUnresolveAlert : undefined}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resolved">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-chart-5" />
                    Alertas Resueltas
                  </CardTitle>
                  <CardDescription>
                    Historial de alertas que han sido atendidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsList
                    alerts={filteredAlerts.filter((alert) => alert.resolved)}
                    onResolve={canManage ? handleResolveAlert : undefined}
                    onUnresolve={canManage ? handleUnresolveAlert : undefined}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <AlertsSettings />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
