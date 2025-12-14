"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
 // Cambiar esta importación
import { hasPermission } from "@/lib/auth";
import {
  Pill,
  ShoppingCart,
  Package,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";

import { Alert } from "@/lib/mock-data";
import { DesktopNavigation } from "./DesktopNavigation";
import { UserControls } from "./UserControls";
import { MobileMenu } from "./MobileMenu";
import { NotificationsDialog } from "./NotificationsDialog";
import { useAlerts } from "@/context/AlertsContext";

export function MainNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const role = user?.role;

  // Usar el contexto de alertas
  const { unresolvedAlerts, resolveAllAlerts } = useAlerts();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleAlertClick = (alert: Alert) => {
    switch (alert.type) {
      case "stock_bajo": {
        const q = new URLSearchParams({ tab: "current", stock: "low", search: alert.medicationName, mid: alert.medicationId });
        router.push(`/inventario?${q.toString()}`);
        break;
      }
      case "vencimiento":
      case "vencido": {
        const q = new URLSearchParams({ search: alert.medicationName, mid: alert.medicationId, alert: alert.type });
        router.push(`/medicamentos?${q.toString()}`);
        break;
      }
      default: {
        const q = new URLSearchParams({ search: alert.medicationName });
        router.push(`/inventario?${q.toString()}`);
        break;
      }
    }
    setIsNotificationsOpen(false);
  };

  const navigationItems = [
    { href: "/ventas", icon: ShoppingCart, label: "Ventas", permission: ["manage_sales", "process_sales"], roles: ["administrador", "farmaceutico"] },
    { href: "/medicamentos", icon: Package, label: "Medicamentos", permission: ["manage_medications", "view_medications"], roles: ["administrador", "farmaceutico"] },
    { href: "/analytics", icon: TrendingUp, label: "Análisis", permission: "view_analytics", roles: ["administrador"] },
    { href: "/reportes", icon: FileText, label: "Reportes", permission: "generate_reports", roles: ["administrador"] },
    { href: "/clientes", icon: Users, label: "Clientes", permission: ["manage_clients", "view_clients"], roles: ["administrador"] },
    ...(user && user.role && hasPermission(user.role, "manage_users")
      ? [{ href: "/usuarios", icon: Users, label: "Usuarios", permission: "manage_users", roles: ["administrador"] }]
      : []),
  ].filter((item) => {
    if (!item.permission) return true;
    if (!role) return false;
    if (item.roles && !item.roles.includes(role)) return false;
    return Array.isArray(item.permission)
      ? item.permission.some((perm) => hasPermission(role, perm))
      : hasPermission(role, item.permission);
  });

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between md:flex-nowrap flex-wrap gap-2">
          {/* Logo y Título */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">PharmaCare</h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Inventario
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">PharmaCare</h1>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <DesktopNavigation navigationItems={navigationItems} />

          {/* Controles de Usuario */}
          <UserControls
            user={user}
            unreadAlerts={unresolvedAlerts}
            onLogout={handleLogout}
            onToggleMobileMenu={toggleMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsNotificationsOpen={setIsNotificationsOpen}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        user={user}
        navigationItems={navigationItems}
        onClose={closeMobileMenu}
        onLogout={handleLogout}
      />

      {/* Notifications Dialog */}
      <NotificationsDialog
        isOpen={isNotificationsOpen}
        setIsOpen={setIsNotificationsOpen}
        alerts={unresolvedAlerts}
        unreadAlerts={unresolvedAlerts}
        onMarkAllAsRead={resolveAllAlerts}
        onAlertClick={handleAlertClick}
      />
    </header>
  );
}
