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
  Settings,
  Bell,
  Mail,
  Smartphone,
  Save,
  Package,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

export function AlertsSettings() {
  const [settings, setSettings] = useState({
    stockThreshold: 30,
    expiryDays: 30,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    autoResolve: false,
    dailyDigest: true,
    weeklyReport: true,
  });

  const handleSave = () => {
    // Simulate saving settings
    console.log("Saving settings:", settings);
  };

  return (
    <div className="space-y-6">
      {/* Thresholds Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración de Umbrales
            </CardTitle>
            <CardDescription>
              Define los límites para generar alertas automáticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="stock-threshold"
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Umbral de Stock Bajo (%)
                </Label>
                <Input
                  id="stock-threshold"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.stockThreshold}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      stockThreshold: Number.parseInt(e.target.value) || 30,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Alerta cuando el stock esté por debajo de este porcentaje del
                  mínimo
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="expiry-days"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Días de Aviso de Vencimiento
                </Label>
                <Input
                  id="expiry-days"
                  type="number"
                  min="1"
                  max="365"
                  value={settings.expiryDays}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      expiryDays: Number.parseInt(e.target.value) || 30,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Alerta cuando falten estos días para el vencimiento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Configuración de Notificaciones
            </CardTitle>
            <CardDescription>
              Elige cómo y cuándo recibir notificaciones de alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notification Channels */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Canales de Notificación</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="email-notifications">
                        Notificaciones por Email
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recibe alertas importantes por correo electrónico
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="push-notifications">
                        Notificaciones Push
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recibe notificaciones en tiempo real en el navegador
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        pushNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="sms-notifications">
                        Notificaciones SMS
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recibe alertas críticas por mensaje de texto
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        smsNotifications: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Automation Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">
                Configuración de Automatización
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-resolve">Resolución Automática</Label>
                    <p className="text-xs text-muted-foreground">
                      Resolver automáticamente alertas cuando se corrija el
                      problema
                    </p>
                  </div>
                  <Switch
                    id="auto-resolve"
                    checked={settings.autoResolve}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        autoResolve: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-digest">Resumen Diario</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un resumen diario de todas las alertas
                    </p>
                  </div>
                  <Switch
                    id="daily-digest"
                    checked={settings.dailyDigest}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        dailyDigest: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-report">Reporte Semanal</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un reporte semanal con estadísticas de alertas
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        weeklyReport: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Settings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Configuración Actual</CardTitle>
            <CardDescription>
              Vista rápida de tu configuración de alertas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Umbrales</h4>
                <div className="space-y-1">
                  <Badge variant="ghost">
                    Stock Bajo: {settings.stockThreshold}%
                  </Badge>
                  <Badge variant="ghost">
                    Vencimiento: {settings.expiryDays} días
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Notificaciones Activas</h4>
                <div className="flex flex-wrap gap-1">
                  {settings.emailNotifications && (
                    <Badge variant="secondary">Email</Badge>
                  )}
                  {settings.pushNotifications && (
                    <Badge variant="secondary">Push</Badge>
                  )}
                  {settings.smsNotifications && (
                    <Badge variant="secondary">SMS</Badge>
                  )}
                  {settings.dailyDigest && (
                    <Badge variant="secondary">Resumen Diario</Badge>
                  )}
                  {settings.weeklyReport && (
                    <Badge variant="secondary">Reporte Semanal</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
