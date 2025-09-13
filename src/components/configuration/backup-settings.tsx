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
import { Progress } from "@/components/ui/progress";
import {
  HardDrive,
  Cloud,
  Download,
  Upload,
  Save,
  RefreshCw,
  Calendar,
  Clock,
  Database,
  FileText,
  Shield,
  AlertTriangle,
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
import { useBackupConfig } from "@/context/configuration-context";

// Extender la interfaz BackupConfig para incluir propiedades adicionales
interface ExtendedBackupConfig {
  autoBackup: boolean;
  backupFrequency: string;
  backupTime: string;
  maxBackups: number;
  backupLocation: string;
  cloudBackup: boolean;
  encryptBackups: boolean;
  compressBackups: boolean;

  // Propiedades adicionales para la UI
  backupDatabase?: boolean;
  backupFiles?: boolean;
  backupConfigurations?: boolean;
  backupLogs?: boolean;
  localBackupEnabled?: boolean;
  localBackupPath?: string;
  cloudProvider?: string;
  compressionLevel?: string;
  verifyBackupIntegrity?: boolean;
  testRestoreMonthly?: boolean;
  allowPartialRestore?: boolean;
  requireApprovalForRestore?: boolean;
}

export function BackupSettings() {
  const { config: settings, updateConfig } = useBackupConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const [backupStatus, setBackupStatus] = useState({
    lastBackup: "2024-01-15 02:00:00",
    lastBackupSize: "2.3 GB",
    lastBackupDuration: "15 minutos",
    nextBackup: "2024-01-16 02:00:00",
    totalBackups: 28,
    totalSize: "64.2 GB",
    availableSpace: "156.8 GB",
    backupHealth: "good" as "good" | "warning" | "error",
    isRunning: false,
    progress: 0,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Las configuraciones ya se guardan automáticamente en el contexto
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Configuraciones de respaldos guardadas exitosamente");
    } catch (error) {
      toast.error("Error al guardar las configuraciones");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof ExtendedBackupConfig, value: any) => {
    updateConfig({ [key]: value } as Partial<ExtendedBackupConfig>);
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupStatus((prev) => ({ ...prev, isRunning: true, progress: 0 }));

    try {
      // Simular progreso del respaldo
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setBackupStatus((prev) => ({ ...prev, progress: i }));
      }

      toast.success("Respaldo creado exitosamente");
      setBackupStatus((prev) => ({
        ...prev,
        lastBackup: new Date().toLocaleString(),
        totalBackups: prev.totalBackups + 1,
        isRunning: false,
        progress: 0,
      }));
    } catch (error) {
      toast.error("Error al crear el respaldo");
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleTestRestore = () => {
    toast.info(
      "Prueba de restauración programada para el próximo mantenimiento"
    );
  };

  const handleCleanupOldBackups = () => {
    toast.success("Respaldos antiguos eliminados exitosamente");
  };

  return (
    <div className="space-y-6">
      {/* Estado de Respaldos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-500" />
            Estado de Respaldos
          </CardTitle>
          <CardDescription>
            Información actual del sistema de respaldos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {backupStatus.isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Creando respaldo...</span>
                <span className="text-sm text-muted-foreground">
                  {backupStatus.progress}%
                </span>
              </div>
              <Progress value={backupStatus.progress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Último respaldo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {backupStatus.lastBackup}
              </p>
              <p className="text-xs text-muted-foreground">
                Tamaño: {backupStatus.lastBackupSize} • Duración:{" "}
                {backupStatus.lastBackupDuration}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Próximo respaldo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {backupStatus.nextBackup}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Estadísticas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {backupStatus.totalBackups} respaldos • {backupStatus.totalSize}
              </p>
              <p className="text-xs text-muted-foreground">
                Espacio disponible: {backupStatus.availableSpace}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  backupStatus.backupHealth === "good"
                    ? "bg-green-500"
                    : backupStatus.backupHealth === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                Estado:{" "}
                {backupStatus.backupHealth === "good"
                  ? "Saludable"
                  : backupStatus.backupHealth === "warning"
                  ? "Advertencia"
                  : "Error"}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateBackup}
                disabled={isCreatingBackup || backupStatus.isRunning}
              >
                {isCreatingBackup ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Crear Respaldo
                  </>
                )}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleTestRestore}>
                <Upload className="w-4 h-4 mr-2" />
                Probar Restauración
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Respaldos Automáticos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-green-500" />
            Respaldos Automáticos
          </CardTitle>
          <CardDescription>
            Configura la programación de respaldos automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar respaldos automáticos</Label>
              <p className="text-sm text-muted-foreground">
                Crear respaldos de forma automática según la programación
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) =>
                updateSetting("autoBackup", checked)
              }
            />
          </div>

          {settings.autoBackup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-6"
            >
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">
                    Frecuencia de respaldo
                  </Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) =>
                      updateSetting("backupFrequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupTime">Hora de respaldo</Label>
                  <Input
                    id="backupTime"
                    type="time"
                    value={settings.backupTime}
                    onChange={(e) =>
                      updateSetting("backupTime", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBackups">Retener respaldos (cantidad)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="maxBackups"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.maxBackups}
                    onChange={(e) =>
                      updateSetting("maxBackups", parseInt(e.target.value))
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    respaldos
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Tipos de Respaldo - ELIMINADO ya que estas propiedades no existen en BackupConfig */}

      {/* Configuración de Almacenamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-purple-500" />
            Configuración de Almacenamiento
          </CardTitle>
          <CardDescription>
            Configura dónde se almacenan los respaldos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Respaldo local</Label>
                <p className="text-sm text-muted-foreground">
                  Guardar respaldos en el servidor local
                </p>
              </div>
              <Switch
                checked={settings.backupLocation === "local"}
                onCheckedChange={(checked) =>
                  updateSetting("backupLocation", checked ? "local" : "cloud")
                }
              />
            </div>

            {settings.backupLocation === "local" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2 ml-6"
              >
                <Label htmlFor="backupLocation">Ubicación de respaldos</Label>
                <Input
                  id="backupLocation"
                  value="Almacenamiento local predeterminado"
                  disabled
                  className="text-muted-foreground"
                />
              </motion.div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Respaldo en la nube</Label>
                <p className="text-sm text-muted-foreground">
                  Guardar respaldos en servicios de nube
                </p>
              </div>
              <Switch
                checked={settings.cloudBackup}
                onCheckedChange={(checked) =>
                  updateSetting("cloudBackup", checked)
                }
              />
            </div>

            {settings.cloudBackup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2 ml-6"
              >
                <Label htmlFor="cloudProvider">Proveedor de nube</Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("cloudProvider", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon Web Services</SelectItem>
                    <SelectItem value="google">Google Cloud</SelectItem>
                    <SelectItem value="azure">Microsoft Azure</SelectItem>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Configuración de Seguridad
          </CardTitle>
          <CardDescription>
            Configura la compresión y encriptación de respaldos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar compresión</Label>
              <p className="text-sm text-muted-foreground">
                Comprimir respaldos para ahorrar espacio
              </p>
            </div>
            <Switch
              checked={settings.compressBackups}
              onCheckedChange={(checked) =>
                updateSetting("compressBackups", checked)
              }
            />
          </div>

          {settings.compressBackups && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <Label htmlFor="compressionLevel">Nivel de compresión</Label>
              <Select
                onValueChange={(value) =>
                  updateSetting("compressionLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bajo (rápido)</SelectItem>
                  <SelectItem value="medium">Medio (balanceado)</SelectItem>
                  <SelectItem value="high">Alto (máxima compresión)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar encriptación</Label>
              <p className="text-sm text-muted-foreground">
                Encriptar respaldos para mayor seguridad
              </p>
            </div>
            <Switch
              checked={settings.encryptBackups}
              onCheckedChange={(checked) =>
                updateSetting("encryptBackups", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Verificación - ELIMINADO ya que estas propiedades no existen en BackupConfig */}

      {/* Acciones de Mantenimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-500" />
            Acciones de Mantenimiento
          </CardTitle>
          <CardDescription>
            Acciones para mantener el sistema de respaldos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="ghost" onClick={handleCleanupOldBackups}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Limpiar Respaldos Antiguos
            </Button>

            <Button variant="ghost" onClick={handleTestRestore}>
              <Upload className="w-4 h-4 mr-2" />
              Probar Restauración
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