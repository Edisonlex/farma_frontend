import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Settings, LogOut, Menu, X, User, Sliders, Shield, Bell } from "lucide-react";
import { hasPermission } from "@/lib/auth";
import { Alert } from "@/lib/mock-data";
import { ThemeToggle } from "../ThemeToggle";

interface User {
  name?: string;
  role?: string;
}

interface UserControlsProps {
  user: User | null;
  unreadAlerts: Alert[];
  onLogout: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
}

export function UserControls({
  user,
  unreadAlerts,
  onLogout,
  onToggleMobileMenu,
  isMobileMenuOpen,
  setIsNotificationsOpen,
}: UserControlsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-2">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Notifications Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsNotificationsOpen(true)}
      >
        <Bell className="w-4 h-4" />
        {unreadAlerts.length > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
            {unreadAlerts.length}
          </Badge>
        )}
      </Button>

      {/* User Info */}
      <div className="hidden xl:block text-right">
        <p className="font-medium text-sm">{user?.name}</p>
        <Badge variant="secondary" className="text-xs capitalize">
          {user?.role}
        </Badge>
      </div>

      {/* Settings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-background shadow-lg border"
        >
          <DropdownMenuLabel>Configuración</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/perfil")}>
            <User className="w-4 h-4 mr-2" />
            Perfil de Usuario
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/configuracion")}>
            <Sliders className="w-4 h-4 mr-2" />
            Configuración del Sistema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="hidden sm:flex"
      >
        <LogOut className="w-4 h-4" />
      </Button>

      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleMobileMenu}
        className="lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
