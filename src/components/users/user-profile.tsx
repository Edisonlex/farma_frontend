"use client";
import React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Save,
  X,
  Shield,
  Clock,
  Mail,
  User,
  Calendar,
  Key,
  Phone,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { rolePermissions } from "@/lib/auth";
import { usePermissions } from "@/hooks/usePermissions";

const roleLabels = {
  administrador: "Administrador",
  farmaceutico: "Farmacéutico",
  tecnico: "Técnico",
};

const roleColors = {
  administrador:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  farmaceutico:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  tecnico:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
};

export function UserProfile() {
  const { user, updateUser } = useAuth();
  const { updateUser: updateUserInList } = useUsers();
  const { translatePermission } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Efecto para inicializar formData cuando user esté disponible
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]); // Se ejecuta cuando user cambia

  if (!user) return null;

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";
    if (formData.phone && !/^\+?[0-9\s-]{7,15}$/.test(formData.phone))
      newErrors.phone = "Teléfono inválido";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Por favor corrige los campos marcados");
      return;
    }
    if (user) {
      updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      updateUserInList(user.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
    }
    toast.success("Perfil actualizado");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaurar los valores originales del usuario
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userPermissions = rolePermissions[user.role] || [];

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>
          <Button
            variant={isEditing ? "ghost" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Editar Perfil
              </>
            )}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Columna izquierda - Información Personal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Detalles básicos de tu cuenta y información de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <Badge className={`mt-2 ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </Badge>
                    <p className="text-muted-foreground text-sm mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre Completo
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`bg-background ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.name}</span>
                      </div>
                    )}
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Correo Electrónico
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`bg-background ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Teléfono
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className={`bg-background ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                        placeholder="+34 123 456 789"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.phone || "No especificado"}</span>
                      </div>
                    )}
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Fecha de Registro
                    </Label>
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(user.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Último Acceso
                    </Label>
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Nunca"}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Permisos y Rol */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Rol y Permisos
                </CardTitle>
                <CardDescription>
                  Información sobre tu rol actual y permisos asignados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Rol Actual</Label>
                  <div className="mt-2">
                    <Badge
                      className={`${roleColors[user.role]} text-sm py-1 px-3`}
                    >
                      {roleLabels[user.role]}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div>
                  <Label className="text-sm font-medium">
                    Permisos Asignados
                  </Label>
                  <div className="mt-3 space-y-3">
                    {userPermissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{translatePermission(permission)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Seguridad
                </CardTitle>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start">
                  <Key className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
