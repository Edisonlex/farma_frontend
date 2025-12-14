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
  Shield,
  Lock,
  Key,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
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
import { useSecurityConfig } from "@/context/configuration-context";

// Extender la interfaz SecurityConfig para incluir propiedades adicionales
interface ExtendedSecurityConfig {
  // Propiedades originales
  minPasswordLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiration: number;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  auditLogging: boolean;
  loginLogging: boolean;
  dataChangeLogging: boolean;
  accessLogging: boolean;
  dataEncryption: boolean;
  backupEncryption: boolean;
  transmissionEncryption: boolean;

  // Propiedades adicionales para la UI
  forceHttps?: boolean;
  ipWhitelist?: boolean;
  allowedIPs?: string;
  actionLogging?: boolean;
  retentionPeriod?: number;
  loginNotifications?: boolean;
  suspiciousActivityAlerts?: boolean;
  failedLoginAlerts?: boolean;
}

export function SecuritySettings() {
  const { config: settings, updateConfig } = useSecurityConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Las configuraciones ya se guardan automáticamente en el contexto
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Configuraciones de seguridad guardadas exitosamente");
    } catch (error) {
      toast.error("Error al guardar las configuraciones");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof ExtendedSecurityConfig, value: any) => {
    updateConfig({ [key]: value } as Partial<ExtendedSecurityConfig>);
  };

  return (
    <div className="space-y-6">
      {/* Políticas de Contraseñas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            Políticas de Contraseñas
          </CardTitle>
          <CardDescription>
            Configura los requisitos de seguridad para las contraseñas de
            usuario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minPasswordLength">Longitud mínima</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="minPasswordLength"
                  type="number"
                  min="6"
                  max="32"
                  value={settings.minPasswordLength}
                  onChange={(e) =>
                    updateSetting("minPasswordLength", parseInt(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  caracteres
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiration">
                Expiración de contraseña
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="passwordExpiration"
                  type="number"
                  min="30"
                  max="365"
                  value={settings.passwordExpiration}
                  onChange={(e) =>
                    updateSetting(
                      "passwordExpiration",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">días</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base font-medium">
              Requisitos de caracteres
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Mayúsculas requeridas</Label>
                <Switch
                  checked={settings.requireUppercase}
                  onCheckedChange={(checked) =>
                    updateSetting("requireUppercase", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Minúsculas requeridas</Label>
                <Switch
                  checked={settings.requireLowercase}
                  onCheckedChange={(checked) =>
                    updateSetting("requireLowercase", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Números requeridos</Label>
                <Switch
                  checked={settings.requireNumbers}
                  onCheckedChange={(checked) =>
                    updateSetting("requireNumbers", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Caracteres especiales</Label>
                <Switch
                  checked={settings.requireSpecialChars}
                  onCheckedChange={(checked) =>
                    updateSetting("requireSpecialChars", checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Autenticación y Sesiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-green-500" />
            Autenticación y Sesiones
          </CardTitle>
          <CardDescription>
            Configura las políticas de autenticación y gestión de sesiones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Autenticación de dos factores</Label>
              <p className="text-sm text-muted-foreground">
                Requiere verificación adicional para el login
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                updateSetting("twoFactorAuth", checked)
              }
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tiempo de sesión</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    updateSetting("sessionTimeout", parseInt(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">minutos</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">
                Intentos máximos de login
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) =>
                    updateSetting("maxLoginAttempts", parseInt(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">intentos</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Duración de bloqueo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="lockoutDuration"
                  type="number"
                  min="5"
                  max="60"
                  value={settings.lockoutDuration}
                  onChange={(e) =>
                    updateSetting("lockoutDuration", parseInt(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">minutos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control de Acceso - ELIMINADO ya que estas propiedades no existen en SecurityConfig */}

      {/* Auditoría y Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            Auditoría y Logs
          </CardTitle>
          <CardDescription>
            Configura el registro de actividades del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Registro de auditoría</Label>
                <p className="text-sm text-muted-foreground">
                  Registrar todas las actividades del sistema
                </p>
              </div>
              <Switch
                checked={settings.auditLogging}
                onCheckedChange={(checked) =>
                  updateSetting("auditLogging", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Registro de logins</Label>
                <p className="text-sm text-muted-foreground">
                  Registrar intentos de inicio de sesión
                </p>
              </div>
              <Switch
                checked={settings.loginLogging}
                onCheckedChange={(checked) =>
                  updateSetting("loginLogging", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Registro de cambios de datos</Label>
                <p className="text-sm text-muted-foreground">
                  Registrar modificaciones a la información
                </p>
              </div>
              <Switch
                checked={settings.dataChangeLogging}
                onCheckedChange={(checked) =>
                  updateSetting("dataChangeLogging", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="retentionPeriod">
              Período de retención de logs
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="retentionPeriod"
                type="number"
                min="30"
                max="2555"
                
                onChange={(e) =>
                  updateSetting("retentionPeriod", parseInt(e.target.value))
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">días</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones de Seguridad - ELIMINADO ya que estas propiedades no existen en SecurityConfig */}

      {/* Estado de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Estado de Seguridad
          </CardTitle>
          <CardDescription>
            Resumen del estado actual de seguridad del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Contraseñas</p>
              <Badge variant="secondary" className="mt-1">
                Seguras
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">Autenticación</p>
              <Badge variant="secondary" className="mt-1">
                {settings.twoFactorAuth ? "2FA Activo" : "2FA Inactivo"}
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Activity className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Auditoría</p>
              <Badge variant="secondary" className="mt-1">
                {settings.auditLogging ? "Activa" : "Inactiva"}
              </Badge>
            </div>
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