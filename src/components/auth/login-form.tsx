"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Pill } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useZodForm } from "@/hooks/use-zod-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "@/lib/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { mockUsers } from "@/lib/auth";

export function LoginForm() {
  const [error, setError] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const { login, isLoading, sendResetCode, verifyResetCode, applyNewPassword } =
    useAuth();
  const { toast } = useToast();
  const form = useZodForm<{ email: string; password: string }>(
    LoginFormSchema,
    {
      mode: "onChange",
      defaultValues: { email: "", password: "" },
    }
  );

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError("");
    const success = await login(values.email, values.password);
    if (!success) {
      setError("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center"
            >
              <Pill className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">PharmaCare</CardTitle>
              <CardDescription>
                Sistema de Gestión de Inventario de Medicamentos
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
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
                      <li>Correo: ejemplo válido usuario@dominio.com</li>
                      <li>Contraseña: mínimo 6 caracteres</li>
                    </ul>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="usuario@pharmacare.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingresa un correo válido
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Mínimo 6 caracteres</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      setResetOpen(true);
                      setResetStep(1);
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p className="mb-2">Usuarios de prueba:</p>
              <div className="space-y-1 text-xs">
                <p>
                  <strong>Admin:</strong> admin@pharmacare.com
                </p>
                <p>
                  <strong>Farmacéutico:</strong> farmaceutico@pharmacare.com
                </p>
                <p>
                  <strong>Técnico:</strong> tecnico@pharmacare.com
                </p>
                <p className="mt-2">
                  <strong>Contraseña:</strong> password123
                </p>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">
                  Acceso rápido
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      form.setValue("email", "admin@pharmacare.com", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("password", "password123", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setTimeout(() => form.handleSubmit(handleSubmit)(), 0);
                    }}
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      form.setValue("email", "farmaceutico@pharmacare.com", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("password", "password123", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setTimeout(() => form.handleSubmit(handleSubmit)(), 0);
                    }}
                  >
                    Farmacéutico
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      form.setValue("email", "tecnico@pharmacare.com", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("password", "password123", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setTimeout(() => form.handleSubmit(handleSubmit)(), 0);
                    }}
                  >
                    Técnico
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Recuperar contraseña</DialogTitle>
            </DialogHeader>
            {resetStep === 1 && (
              <ResetEmailStep
                email={resetEmail}
                setEmail={(e) => setResetEmail(e)}
                onSubmit={async (email) => {
                  const code = await sendResetCode(email);
                  if (code) {
                    setResetCode(code);
                    toast({
                      title: "Código enviado",
                      description: "Usa el código mostrado para continuar",
                    });
                    setResetOpen(true);
                    setResetStep(2);
                  } else {
                    toast({
                      title: "Correo no encontrado",
                      description: "Verifica el correo ingresado",
                      variant: "destructive",
                    });
                  }
                }}
              />
            )}
            {resetStep === 2 && (
              <ResetCodeStep
                email={resetEmail}
                codePreview={resetCode}
                onBack={() => setResetStep(1)}
                onSubmit={async (code) => {
                  const ok = await verifyResetCode(resetEmail, code);
                  if (ok) {
                    setResetStep(3);
                  } else {
                    toast({
                      title: "Código inválido",
                      description: "Ingresa el código correcto",
                      variant: "destructive",
                    });
                  }
                }}
              />
            )}
            {resetStep === 3 && (
              <ResetPasswordStep
                onSubmit={async (password) => {
                  const ok = await applyNewPassword(resetEmail, password);
                  if (ok) {
                    toast({
                      title: "Contraseña actualizada",
                      description:
                        "Ya puedes iniciar sesión con tu nueva contraseña",
                    });
                    setResetOpen(false);
                  } else {
                    toast({
                      title: "No se pudo actualizar",
                      description: "Intenta nuevamente",
                      variant: "destructive",
                    });
                  }
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

const ResetEmailSchema = z.object({ email: z.string().email() });
function ResetEmailStep({
  email,
  setEmail,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (email: string) => void;
}) {
  const form = useForm<{ email: string }>({
    resolver: zodResolver(ResetEmailSchema),
    defaultValues: { email },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const currentEmail = form.watch("email") || "";
  const isValidFormat = ResetEmailSchema.safeParse({
    email: currentEmail,
  }).success;
  const isRegistered =
    isValidFormat &&
    mockUsers.some((u) => u.email.toLowerCase() === currentEmail.toLowerCase());
  const desc =
    currentEmail.length === 0
      ? "Te enviaremos un código de verificación"
      : !isValidFormat
      ? "Formato de correo inválido"
      : isRegistered
      ? "Correo reconocido. Presiona Enviar código."
      : "Este correo no está registrado";
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ email }) => onSubmit(email))}
        className="space-y-4"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@pharmacare.com"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setEmail(e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>{desc}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={!isValidFormat || !isRegistered}>
            Enviar código
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const ResetCodeSchema = z.object({ code: z.string().regex(/^\d{6}$/) });
function ResetCodeStep({
  email,
  codePreview,
  onBack,
  onSubmit,
}: {
  email: string;
  codePreview?: string;
  onBack: () => void;
  onSubmit: (code: string) => void;
}) {
  const form = useForm<{ code: string }>({
    resolver: zodResolver(ResetCodeSchema),
    defaultValues: { code: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ code }) => onSubmit(code))}
        className="space-y-4"
      >
        <p className="text-sm text-muted-foreground">
          Enviamos un código de 6 dígitos a{" "}
          <span className="font-medium">{email}</span>.
        </p>
        {codePreview && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            Código simulado:{" "}
            <span className="font-mono font-medium">{codePreview}</span>
          </div>
        )}
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de verificación</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  {...field}
                />
              </FormControl>
              <FormDescription>Ingresa los 6 dígitos</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="justify-between">
          <Button type="button" variant="ghost" onClick={onBack}>
            Atrás
          </Button>
          <Button type="submit">Verificar código</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener una mayúscula")
      .regex(/[a-z]/, "Debe tener una minúscula")
      .regex(/[0-9]/, "Debe tener un número")
      .regex(/[^A-Za-z0-9]/, "Debe tener un carácter especial"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas deben coincidir",
    path: ["confirm"],
  });
function ResetPasswordStep({
  onSubmit,
}: {
  onSubmit: (password: string) => void;
}) {
  const form = useForm<{ password: string; confirm: string }>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ password }) => onSubmit(password))}
        className="space-y-4"
      >
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Mínimo 8 caracteres, mayúscula, especial..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mínimo 8 caracteres, mayúscula, minúscula, número y especial
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirm"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Repite la contraseña"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Debe coincidir con la nueva contraseña
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Guardar nueva contraseña</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
