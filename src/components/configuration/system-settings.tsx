"use client";

import { useState, useEffect } from "react";
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
  HardDrive,
  Wifi,
  Monitor,
  Clock,
  Settings2,
  Cpu,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSystemConfig } from "@/context/configuration-context";
import { useZodForm } from "@/hooks/use-zod-form";
import { SystemConfigSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function SystemSettings() {
  const { config: settings, updateConfig } = useSystemConfig();
  const [isSaving, setIsSaving] = useState(false);

  const form = useZodForm(SystemConfigSchema, {
    mode: "onChange",
    defaultValues: settings,
  });

  // Sync form with context changes if needed
  useEffect(() => {
    form.reset(settings);
  }, [settings, form]);

  const [systemStatus] = useState({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: "online",
    database: "connected",
    lastBackup: "2024-01-15 02:00:00",
  });

  const onSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateConfig(values);
      toast.success("Configuraciones del sistema guardadas exitosamente");
    } catch {
      toast.error("Error al guardar las configuraciones");
    } finally {
      setIsSaving(false);
    }
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Configuración General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-500" />
                Configuración General
              </CardTitle>
              <CardDescription>
                Configuraciones básicas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la compañía</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Nombre visible en reportes y cabeceras.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de la compañía</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Ubicación física de la farmacia.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="autoBackup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Respaldos automáticos
                        </FormLabel>
                        <FormDescription>
                          Crear respaldos automáticos del sistema
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maintenanceMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Modo de mantenimiento
                        </FormLabel>
                        <FormDescription>
                          Deshabilitar acceso temporal al sistema
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona horaria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar zona horaria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="America/Mexico_City">
                            Ciudad de México (GMT-6)
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            Nueva York (GMT-5)
                          </SelectItem>
                          <SelectItem value="Europe/Madrid">
                            Madrid (GMT+1)
                          </SelectItem>
                          <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar moneda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MXN">
                            Peso Mexicano (MXN)
                          </SelectItem>
                          <SelectItem value="USD">
                            Dólar Americano (USD)
                          </SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formato de fecha</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar formato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formato de hora</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar formato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="24h">24 horas</SelectItem>
                          <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearCache}
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Limpiar Caché
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSystemRestart}
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  Programar Reinicio
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botón de Guardar */}
          <div className="flex justify-end sticky bottom-6 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border/50 shadow-lg">
            <Button type="submit" disabled={isSaving} className="min-w-32">
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
        </form>
      </Form>
    </div>
  );
}
