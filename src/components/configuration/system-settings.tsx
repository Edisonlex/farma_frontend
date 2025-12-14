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
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Database,
  Globe,
  Zap,
  Save,
  HardDrive,
  Wifi,
  Monitor,
  Clock,
  AlertCircle,
  Settings2,
  Cpu,
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
import { Textarea } from "@/components/ui/textarea";
import { useSystemConfig } from "@/context/configuration-context";

// Extender la interfaz SystemConfig para incluir propiedades adicionales
interface ExtendedSystemConfig {
  // Propiedades originales
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
  autoBackup: boolean;
  backupFrequency: string;
  maxBackups: number;

  // Propiedades adicionales para la UI
  systemName?: string;
  systemVersion?: string;
  maintenanceMode?: boolean;
  debugMode?: boolean;
  dbConnectionTimeout?: number;
  dbMaxConnections?: number;
  dbBackupEnabled?: boolean;
  dbBackupFrequency?: string;
  dbRetentionDays?: number;
  cacheEnabled?: boolean;
  cacheTimeout?: number;
  maxFileUploadSize?: number;
  sessionCleanupInterval?: number;
  logLevel?: string;
  logRetentionDays?: number;
  enableErrorReporting?: boolean;
  enablePerformanceMonitoring?: boolean;
  apiTimeout?: number;
  maxRequestsPerMinute?: number;
  enableRateLimit?: boolean;
  corsEnabled?: boolean;
  defaultTimezone?: string;
}

export function SystemSettings() {
  const { config: settings, updateConfig } = useSystemConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // MOVIDO ARRIBA del return
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: "online",
    database: "connected",
    lastBackup: "2024-01-15 02:00:00",
  });

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!settings.companyName.trim())
      newErrors.companyName = "El nombre es requerido";
    if (settings.companyEmail && !/\S+@\S+\.\S+/.test(settings.companyEmail))
      newErrors.companyEmail = "Email inválido";
    if (
      settings.companyPhone &&
      !/^\+?[0-9\s-]{7,15}$/.test(settings.companyPhone)
    )
      newErrors.companyPhone = "Teléfono inválido";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Por favor corrige los campos marcados");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Configuraciones del sistema guardadas exitosamente");
    } catch {
      toast.error("Error al guardar las configuraciones");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof ExtendedSystemConfig, value: any) => {
    updateConfig({ [key]: value } as Partial<ExtendedSystemConfig>);
  };

  const handleSystemRestart = () => {
    toast.info("Reinicio del sistema programado para el próximo mantenimiento");
  };

  const handleClearCache = () => {
    toast.success("Caché del sistema limpiado exitosamente");
  };

  return (
    <div className="space-y-6">
      {/* Estado del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-green-500" />
            Estado del Sistema
          </CardTitle>
          <CardDescription>
            Información en tiempo real del estado del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU</span>
                <Badge
                  variant={systemStatus.cpu > 80 ? "destructive" : "secondary"}
                >
                  {systemStatus.cpu}%
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    systemStatus.cpu > 80 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${systemStatus.cpu}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memoria</span>
                <Badge
                  variant={
                    systemStatus.memory > 85 ? "destructive" : "secondary"
                  }
                >
                  {systemStatus.memory}%
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    systemStatus.memory > 85 ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${systemStatus.memory}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disco</span>
                <Badge
                  variant={systemStatus.disk > 90 ? "destructive" : "secondary"}
                >
                  {systemStatus.disk}%
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    systemStatus.disk > 90 ? "bg-red-500" : "bg-purple-500"
                  }`}
                  style={{ width: `${systemStatus.disk}%` }}
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm">Red: {systemStatus.network}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="text-sm">BD: {systemStatus.database}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-500" />
              <span className="text-sm">
                Último backup: {systemStatus.lastBackup}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-500" />
            Configuración General
          </CardTitle>
          <CardDescription>Configuraciones básicas del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la compañía</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => updateSetting("companyName", e.target.value)}
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email de la compañía</Label>
              <Input
                id="companyEmail"
                value={settings.companyEmail}
                onChange={(e) => updateSetting("companyEmail", e.target.value)}
                className={errors.companyEmail ? "border-red-500" : ""}
              />
              {errors.companyEmail && (
                <p className="text-sm text-red-500">{errors.companyEmail}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Respaldos automáticos</Label>
                <p className="text-sm text-muted-foreground">
                  Crear respaldos automáticos del sistema
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) =>
                  updateSetting("autoBackup", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Modo de mantenimiento</Label>
                <p className="text-sm text-muted-foreground">
                  Deshabilitar acceso temporal al sistema
                </p>
              </div>
              <Switch
                onCheckedChange={(checked) =>
                  updateSetting("maintenanceMode", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Localización */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Configuración de Localización
          </CardTitle>
          <CardDescription>
            Configuraciones de zona horaria, formato de fecha y moneda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona horaria</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => updateSetting("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Mexico_City">
                    Ciudad de México (GMT-6)
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    Nueva York (GMT-5)
                  </SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => updateSetting("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                  <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de fecha</Label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => updateSetting("dateFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat">Formato de hora</Label>
              <Select
                value={settings.timeFormat}
                onValueChange={(value) => updateSetting("timeFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-red-500" />
            Acciones del Sistema
          </CardTitle>
          <CardDescription>
            Acciones de mantenimiento y administración del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="ghost" onClick={handleClearCache}>
              <HardDrive className="w-4 h-4 mr-2" />
              Limpiar Caché
            </Button>

            <Button variant="ghost" onClick={handleSystemRestart}>
              <Cpu className="w-4 h-4 mr-2" />
              Programar Reinicio
            </Button>
          </div>
        </CardContent>
      </Card>

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
