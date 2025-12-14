import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasPermission } from "@/lib/auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Package,
  Users,
  FileText,
  Bell,
  Activity,
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Tags,
  Truck,
} from "lucide-react";
import { getInventoryAnalytics } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function QuickActions() {
  const { user } = useAuth();
  const analytics = getInventoryAnalytics();
  const role = user?.role;

  const quickActions = [
    {
      title: "Punto de Venta",
      description: "Registrar ventas y facturación",
      icon: ShoppingCart,
      color: "bg-chart-5",
      gradient: "from-chart-5 to-chart-5/80",
      permission: ["manage_sales", "process_sales"],
      roles: ["administrador", "farmaceutico"],
      href: "/ventas",
    },
    {
      title: "Gestionar Medicamentos",
      description: "Agregar, editar y consultar medicamentos",
      icon: Package,
      color: "bg-primary",
      gradient: "from-primary to-primary/80",
      permission: "manage_medications",
      roles: ["administrador", "farmaceutico"],
      href: "/medicamentos",
    },
    // {
    //   title: "Ver Alertas",
    //   description: `${analytics.totalAlerts} alertas pendientes`,
    //   icon: Bell,
    //   color: "bg-destructive",
    //   gradient: "from-destructive to-destructive/80",
    //   permission: "view_alerts",
    //   href: "/alertas",
    // },
    {
      title: "Análisis Predictivo",
      description: "Predicciones de demanda y stock",
      icon: TrendingUp,
      color: "bg-accent",
      gradient: "from-accent to-accent/80",
      permission: "view_analytics",
      roles: ["administrador"],
      href: "/analytics",
    },
    {
      title: "Generar Reportes",
      description: "Reportes en PDF y Excel",
      icon: FileText,
      color: "bg-secondary",
      gradient: "from-secondary to-secondary/80",
      permission: "generate_reports",
      roles: ["administrador"],
      href: "/reportes",
    },
    {
      title: "Gestionar Usuarios",
      description: "Administrar roles y permisos",
      icon: Users,
      color: "bg-chart-3",
      gradient: "from-chart-3 to-chart-3/80",
      permission: "manage_users",
      roles: ["administrador"],
      href: "/usuarios",
    },
    {
      title: "Control de Inventario",
      description: "Movimientos y ajustes de stock",
      icon: Activity,
      color: "bg-chart-2",
      gradient: "from-chart-2 to-chart-2/80",
      permission: "view_inventory",
      roles: ["administrador", "farmaceutico"],
      href: "/inventario",
    },
    {
      title: "Gestionar Categorías",
      description: "Administrar categorías de medicamentos",
      icon: Tags,
      color: "bg-chart-4",
      gradient: "from-chart-4 to-chart-4/80",
      permission: "manage_categories",
      roles: ["administrador"],
      href: "/categorias",
    },
    {
      title: "Gestionar Proveedores",
      description: "Administrar proveedores de medicamentos",
      icon: Truck,
      color: "bg-chart-6",
      gradient: "from-chart-6 to-chart-6/80",
      permission: "manage_suppliers",
      roles: ["administrador"],
      href: "/proveedores",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Acciones Rápidas
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Accede rápidamente a las funciones principales del sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              let canAccess = false;
              if (role) {
                if (action.roles && !action.roles.includes(role)) {
                  canAccess = false;
                } else if (!action.permission) {
                  canAccess = true;
                } else if (Array.isArray(action.permission)) {
                  canAccess = action.permission.some((perm) => hasPermission(role, perm));
                } else {
                  canAccess = hasPermission(role, action.permission);
                }
              }
              if (!canAccess) return null;

              const IconComponent = action.icon;

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.8 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link href={action.href} className="block group">
                    <div className="relative h-full p-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                      <div className="relative h-full p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm group-hover:bg-card/90 group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300">
                        {/* Icono con gradiente */}
                        <div
                          className={`mb-4 p-3 rounded-xl bg-gradient-to-br ${action.gradient} w-fit`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        {/* Contenido */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {action.description}
                          </p>
                        </div>

                        {/* Flecha indicadora */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>

                        {/* Efecto de borde en hover */}
                        <div className="absolute inset-0 rounded-xl border-2 border-primary/0 group-hover:border-primary/10 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer con estadísticas */}
          {quickActions.some((action) => {
            if (!role) return false;
            if (action.roles && !action.roles.includes(role)) return false;
            if (!action.permission) return true;
            return Array.isArray(action.permission)
              ? action.permission.some((perm) => hasPermission(role, perm))
              : hasPermission(role, action.permission);
          }) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-6 pt-4 border-t border-border/50"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {
                    quickActions.filter((action) => {
                      if (!action.permission) return true;
                      if (!user) return false;

                      if (Array.isArray(action.permission)) {
                        return action.permission.some((perm) =>
                          hasPermission(user.role, perm)
                        );
                      } else {
                        return hasPermission(user.role, action.permission);
                      }
                    }).length
                  }{" "}
                  funciones disponibles
                </span>
                <span>
                  Sistema actualizado •{" "}
                  {new Date().toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
