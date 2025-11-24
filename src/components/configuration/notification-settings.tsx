"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Save, 
  Package, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useNotificationConfig } from "@/context/configuration-context"

export function NotificationSettings() {
  const { config: settings, updateConfig } = useNotificationConfig()
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSave = async () => {
    const newErrors: Record<string, string> = {}
    if (settings.stockThreshold < 0) newErrors.stockThreshold = "Debe ser mayor o igual a 0"
    if (settings.criticalStockThreshold < 0) newErrors.criticalStockThreshold = "Debe ser mayor o igual a 0"
    if (settings.expiryDays < 0) newErrors.expiryDays = "Debe ser mayor o igual a 0"
    if (settings.criticalExpiryDays < 0) newErrors.criticalExpiryDays = "Debe ser mayor o igual a 0"
    if (settings.emailNotifications && settings.emailAddress && !/\S+@\S+\.\S+/.test(settings.emailAddress)) newErrors.emailAddress = "Email inválido"
    if (settings.quietHoursEnabled && (!settings.quietHoursStart || !settings.quietHoursEnd)) newErrors.quietHours = "Debes definir inicio y fin"
    setErrors(newErrors)
    if (Object.keys(newErrors).length) {
      toast.error("Por favor corrige los campos marcados")
      return
    }
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success("Configuraciones guardadas exitosamente")
    } catch {
      toast.error("Error al guardar las configuraciones")
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    updateConfig({ [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Umbrales de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Umbrales de Alertas
          </CardTitle>
          <CardDescription>
            Configura los límites que activarán las alertas automáticas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stockThreshold">Umbral de Stock Bajo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="stockThreshold"
                  type="number"
                  value={settings.stockThreshold}
                  onChange={(e) => updateSetting('stockThreshold', parseInt(e.target.value))}
                  className="w-24"
                />
                {errors.stockThreshold && (<p className="text-sm text-red-500">{errors.stockThreshold}</p>)}
                <span className="text-sm text-muted-foreground">unidades</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="criticalStockThreshold">Umbral de Stock Crítico</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="criticalStockThreshold"
                  type="number"
                  value={settings.criticalStockThreshold}
                  onChange={(e) => updateSetting('criticalStockThreshold', parseInt(e.target.value))}
                  className="w-24"
                />
                {errors.criticalStockThreshold && (<p className="text-sm text-red-500">{errors.criticalStockThreshold}</p>)}
                <span className="text-sm text-muted-foreground">unidades</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDays">Días antes de vencimiento</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="expiryDays"
                  type="number"
                  value={settings.expiryDays}
                  onChange={(e) => updateSetting('expiryDays', parseInt(e.target.value))}
                  className="w-24"
                />
                {errors.expiryDays && (<p className="text-sm text-red-500">{errors.expiryDays}</p>)}
                <span className="text-sm text-muted-foreground">días</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="criticalExpiryDays">Días para vencimiento crítico</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="criticalExpiryDays"
                  type="number"
                  value={settings.criticalExpiryDays}
                  onChange={(e) => updateSetting('criticalExpiryDays', parseInt(e.target.value))}
                  className="w-24"
                />
                {errors.criticalExpiryDays && (<p className="text-sm text-red-500">{errors.criticalExpiryDays}</p>)}
                <span className="text-sm text-muted-foreground">días</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canales de Notificación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Canales de Notificación
          </CardTitle>
          <CardDescription>
            Selecciona cómo quieres recibir las notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">Recibe alertas en tu correo electrónico</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">Notificaciones del navegador</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>Notificaciones SMS</Label>
                <p className="text-sm text-muted-foreground">Mensajes de texto para alertas críticas</p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>Notificaciones en la App</Label>
                <p className="text-sm text-muted-foreground">Mostrar alertas dentro de la aplicación</p>
              </div>
            </div>
            <Switch
              checked={settings.inAppNotifications}
              onCheckedChange={(checked) => updateSetting('inAppNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Horarios de Silencio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Horarios de Silencio
          </CardTitle>
          <CardDescription>
            Configura horarios en los que no se enviarán notificaciones no críticas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Activar horarios de silencio</Label>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={(checked) => updateSetting('quietHoursEnabled', checked)}
            />
          </div>
          
          {settings.quietHoursEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="quietStart">Hora de inicio</Label>
                <Input
                  id="quietStart"
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quietEnd">Hora de fin</Label>
                <Input
                  id="quietEnd"
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                />
              </div>
              {errors.quietHours && (<p className="text-sm text-red-500 col-span-2">{errors.quietHours}</p>)}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Tipos de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" />
            Tipos de Alertas
          </CardTitle>
          <CardDescription>
            Activa o desactiva tipos específicos de alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'lowStockAlerts', label: 'Alertas de Stock Bajo', description: 'Cuando el inventario esté por debajo del umbral' },
            { key: 'expiryAlerts', label: 'Alertas de Vencimiento', description: 'Medicamentos próximos a vencer' },
            { key: 'salesAlerts', label: 'Alertas de Ventas', description: 'Notificaciones sobre actividad de ventas' },
            { key: 'systemAlerts', label: 'Alertas del Sistema', description: 'Notificaciones sobre el estado del sistema' },
            { key: 'securityAlerts', label: 'Alertas de Seguridad', description: 'Notificaciones sobre eventos de seguridad' }
          ].map((alert, index) => (
            <div key={alert.key}>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{alert.label}</Label>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
                <Switch
                  checked={settings[alert.key as keyof typeof settings] as boolean}
                  onCheckedChange={(checked) => updateSetting(alert.key, checked)}
                />
              </div>
              {index < 4 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reportes Automáticos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Reportes Automáticos
          </CardTitle>
          <CardDescription>
            Configura la frecuencia de los reportes automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Resumen Diario</Label>
              <p className="text-sm text-muted-foreground">Recibe un resumen diario de actividades</p>
            </div>
            <Switch
              checked={settings.dailyDigest}
              onCheckedChange={(checked) => updateSetting('dailyDigest', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Reporte Semanal</Label>
              <p className="text-sm text-muted-foreground">Reporte semanal de inventario y ventas</p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(checked) => updateSetting('weeklyReport', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Reporte Mensual</Label>
              <p className="text-sm text-muted-foreground">Análisis mensual completo</p>
            </div>
            <Switch
              checked={settings.monthlyReport}
              onCheckedChange={(checked) => updateSetting('monthlyReport', checked)}
            />
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
  )
}