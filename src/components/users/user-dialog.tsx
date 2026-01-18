"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/lib/auth";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserFormCreateSchema, UserFormUpdateSchema } from "@/lib/schemas";
import { formatEcPhone } from "@/lib/utils";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onSave: (userData: any) => void;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserDialogProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!user;
  const form = useZodForm<{
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    department?: string;
    isActive: boolean;
  }>(isEditing ? UserFormUpdateSchema : UserFormCreateSchema, {
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      role: "tecnico",
      password: "",
      confirmPassword: "",
      phone: "",
      department: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        confirmPassword: "",
        phone: user.phone || "",
        department: user.department || "",
        isActive: user.isActive !== false,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: "tecnico",
        password: "",
        confirmPassword: "",
        phone: "",
        department: "",
        isActive: true,
      });
    }
  }, [user, form]);

  const onSubmit = (values: any) => {
    const { confirmPassword, ...userData } = values;
    onSave(userData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-border/60 shadow-md">
        <DialogHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b px-4 sm:px-6 py-3">
          <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight">
            {user ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Se validan email y contraseña (mínimo 6). Teléfono con formato de
            Ecuador. El rol seleccionado define permisos y accesos disponibles.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6 px-4 sm:px-6 py-4"
          >
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Corrige los campos marcados:{" "}
                  {Object.values(form.formState.errors)
                    .map((e) => e?.message)
                    .filter(Boolean)
                    .join(" · ")}
                </AlertDescription>
              </Alert>
            )}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="p-3 bg-muted rounded-lg text-xs">
                <p className="font-medium mb-1">Consejos</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Email: usuario@dominio.com</li>
                  <li>
                    Contraseña: 8+ caracteres, Mayúscula, Minúscula, #, Símbolo
                  </li>
                  <li>Teléfono Ecuador: +593 9XXXXXXXX / 09XXXXXXXX</li>
                </ul>
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre completo del usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {user ? "Nueva Contraseña (opcional)" : "Contraseña"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={user ? "********" : "Mínimo 8 caracteres"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("password") && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repetir contraseña"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Debe coincidir con la contraseña ingresada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="tel"
                      placeholder="+593 9XXXXXXXX"
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatEcPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Formato Ecuador: +593 9XXXXXXXX / 09XXXXXXXX / 0AXXXXXXX
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento (opcional)</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-border bg-background">
                      <SelectItem value="none">Sin departamento</SelectItem>
                      <SelectItem value="farmacia">Farmacia</SelectItem>
                      <SelectItem value="almacen">Almacén</SelectItem>
                      <SelectItem value="administracion">
                        Administración
                      </SelectItem>
                      <SelectItem value="ventas">Ventas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Organiza al usuario para reportes y permisos internos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-border bg-background">
                      <SelectItem value="administrador">
                        <div>
                          <div className="font-medium">Administrador</div>
                          <div className="text-xs ">
                            Acceso completo al sistema
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="farmaceutico">
                        <div>
                          <div className="font-medium">Farmacéutico</div>
                          <div className="text-xs ">
                            Gestión de medicamentos y reportes
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="tecnico">
                        <div>
                          <div className="font-medium">Técnico</div>
                          <div className="text-xs">
                            Consulta de inventario y alertas
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El rol define los permisos de acceso a los módulos del
                    sistema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {user ? "Actualizar" : "Crear"} Usuario
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
