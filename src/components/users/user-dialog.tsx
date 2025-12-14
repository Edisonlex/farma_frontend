"use client";

import type React from "react";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { UserFormCreateSchema, UserFormUpdateSchema } from "@/lib/schemas";

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
  const isEditing = !!user;
  const form = useForm<{
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    department?: string;
    isActive: boolean;
  }>({
    resolver: zodResolver(isEditing ? UserFormUpdateSchema : UserFormCreateSchema),
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo del usuario" {...field} />
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
                    <Input type="email" placeholder="email@ejemplo.com" {...field} />
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
                  <FormLabel>{user ? "Nueva Contraseña (opcional)" : "Contraseña"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                  </FormControl>
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
                      <Input type="password" placeholder="Repetir contraseña" {...field} />
                    </FormControl>
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
                    <Input inputMode="tel" placeholder="+593 9XXXXXXXX" {...field} onChange={(e) => field.onChange(formatEcPhone(e.target.value))} />
                  </FormControl>
                  <FormDescription>Formato Ecuador: +593 9XXXXXXXX / 09XXXXXXXX / 0AXXXXXXX</FormDescription>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-background">
                      <SelectItem value="none">Sin departamento</SelectItem>
                      <SelectItem value="farmacia">Farmacia</SelectItem>
                      <SelectItem value="almacen">Almacén</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                      <SelectItem value="ventas">Ventas</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-background">
                      <SelectItem value="administrador">
                        <div>
                          <div className="font-medium">Administrador</div>
                          <div className="text-xs ">Acceso completo al sistema</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="farmaceutico">
                        <div>
                          <div className="font-medium">Farmacéutico</div>
                          <div className="text-xs ">Gestión de medicamentos y reportes</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="tecnico">
                        <div>
                          <div className="font-medium">Técnico</div>
                          <div className="text-xs">Consulta de inventario y alertas</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{user ? "Actualizar" : "Crear"} Usuario</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
  const formatEcPhone = (v: string) => {
    const s = v.replace(/[^0-9+]/g, "");
    if (s.startsWith("+593")) return "+593 " + s.slice(4).replace(/\s+/g, "");
    return s;
  };
