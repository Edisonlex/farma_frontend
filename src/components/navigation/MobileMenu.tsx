import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, LogOut, User, Sliders } from "lucide-react";

interface NavigationItem {
  href: string;
  icon: any;
  label: string;
}

interface User {
  name?: string;
  role?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  navigationItems: NavigationItem[];
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({
  isOpen,
  user,
  navigationItems,
  onClose,
  onLogout,
}: MobileMenuProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t bg-card">
      <div className="container mx-auto px-4 py-4 space-y-2">
        {/* User Info Mobile */}
        <div className="md:hidden border-b pb-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <Badge variant="secondary" className="text-xs capitalize">
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3 h-12"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Configuration Options - Added this section */}
        <div className="border-t pt-3 space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
            Configuración
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/perfil");
              onClose();
            }}
            className="w-full justify-start space-x-3 h-12"
          >
            <User className="w-5 h-5" />
            <span>Perfil de Usuario</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/configuracion");
              onClose();
            }}
            className="w-full justify-start space-x-3 h-12"
          >
            <Sliders className="w-5 h-5" />
            <span>Configuración del Sistema</span>
          </Button>
        </div>

        {/* Mobile Logout */}
        <div className="border-t pt-3 space-y-1">
          <Button
            variant="ghost"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full justify-start space-x-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
