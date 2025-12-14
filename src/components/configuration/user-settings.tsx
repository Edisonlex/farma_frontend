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
  Users,
  UserPlus,
  Shield,
  Clock,
  Save,
  Eye,
  Lock,
  Mail,
  Bell,
  Activity,
  Settings,
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
import { useUserConfig } from "@/context/configuration-context";

// Extender la interfaz UserConfig para incluir propiedades adicionales
interface ExtendedUserConfig {
  // Propiedades originales
  defaultRole: string;
  autoActivation: boolean;
  passwordReset: boolean;
  profilePictures: boolean;
  userRegistration: boolean;
  emailVerification: boolean;

  // Propiedades adicionales para la UI
  allowSelfRegistration?: boolean;
  requireEmailVerification?: boolean;
  requireManagerApproval?: boolean;
  sessionTimeout?: number;
  maxConcurrentSessions?: number;
  rememberMeDuration?: number;
  forceLogoutOnPasswordChange?: boolean;
  allowProfileEditing?: boolean;
  requirePhotoUpload?: boolean;
  allowUsernameChange?: boolean;
  requirePhoneNumber?: boolean;
  enableEmailNotifications?: boolean;
  enablePushNotifications?: boolean;
  notifyOnLogin?: boolean;
  notifyOnPasswordChange?: boolean;
  notifyOnRoleChange?: boolean;
  trackUserActivity?: boolean;
  logLoginAttempts?: boolean;
  retainActivityLogs?: number;
  enableDetailedAudit?: boolean;
  allowRoleAssignment?: boolean;
  requireJustificationForRoleChange?: boolean;
  enableCustomRoles?: boolean;
  enableIPRestrictions?: boolean;
  allowedIPs?: string;
  enableTimeRestrictions?: boolean;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  allowThemeSelection?: boolean;
  defaultTheme?: string;
  allowLanguageSelection?: boolean;
  defaultLanguage?: string;
  showUserList?: boolean;
  showLastLogin?: boolean;
  allowUserSearch?: boolean;
}

export function UserSettings() {
  const { config: settings, updateConfig } = useUserConfig();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Las configuraciones ya se guardan automáticamente en el contexto
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Configuraciones de usuarios guardadas exitosamente");
    } catch (error) {
      toast.error("Error al guardar las configuraciones");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof ExtendedUserConfig, value: any) => {
    updateConfig({ [key]: value } as Partial<ExtendedUserConfig>);
  };

  return (
    <div className="space-y-6">
      {/* Registro de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            Registro de Usuarios
          </CardTitle>
          <CardDescription>
            Configura cómo se registran nuevos usuarios en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir auto-registro</Label>
                <p className="text-sm text-muted-foreground">
                  Los usuarios pueden registrarse sin invitación
                </p>
              </div>
              <Switch
                checked={settings.userRegistration}
                onCheckedChange={(checked) =>
                  updateSetting("userRegistration", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Requerir verificación de email</Label>
                <p className="text-sm text-muted-foreground">
                  Los usuarios deben verificar su email antes de acceder
                </p>
              </div>
              <Switch
                checked={settings.emailVerification}
                onCheckedChange={(checked) =>
                  updateSetting("emailVerification", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="defaultRole">Rol por defecto</Label>
              <Select
                value={settings.defaultRole}
                onValueChange={(value) => updateSetting("defaultRole", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Empleado">Empleado</SelectItem>
                  <SelectItem value="Farmacéutico">Farmacéutico</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Invitado">Invitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Activación automática</Label>
                <p className="text-sm text-muted-foreground">
                  Nuevos usuarios se activan automáticamente
                </p>
              </div>
              <Switch
                checked={settings.autoActivation}
                onCheckedChange={(checked) =>
                  updateSetting("autoActivation", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Sesiones - ELIMINADO ya que estas propiedades no existen en UserConfig */}

      {/* Configuración de Perfiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Configuración de Perfiles
          </CardTitle>
          <CardDescription>
            Configura qué pueden editar los usuarios en sus perfiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir edición de perfil</Label>
              <p className="text-sm text-muted-foreground">
                Los usuarios pueden editar su información personal
              </p>
            </div>
            <Switch
              
              onCheckedChange={(checked) =>
                updateSetting("allowProfileEditing", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Requerir foto de perfil</Label>
              <p className="text-sm text-muted-foreground">
                Obligar a los usuarios a subir una foto
              </p>
            </div>
            <Switch
              checked={settings.profilePictures}
              onCheckedChange={(checked) =>
                updateSetting("profilePictures", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir cambio de contraseña</Label>
              <p className="text-sm text-muted-foreground">
                Los usuarios pueden cambiar su contraseña
              </p>
            </div>
            <Switch
              checked={settings.passwordReset}
              onCheckedChange={(checked) =>
                updateSetting("passwordReset", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones de Usuario - ELIMINADO ya que estas propiedades no existen en UserConfig */}

      {/* Actividad y Auditoría - ELIMINADO ya que estas propiedades no existen en UserConfig */}

      {/* Configuración de Roles - ELIMINADO ya que estas propiedades no existen en UserConfig */}

      {/* Restricciones de Acceso - ELIMINADO ya que estas propiedades no existen en UserConfig */}

      {/* Configuración de Interfaz - ELIMINADO ya que estas propiedades no existen en UserConfig */}

      {/* Configuración de Privacidad - ELIMINADO ya que estas propiedades no existen en UserConfig */}

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