import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Calendar,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  Settings,
} from "lucide-react";

// Definir tipo para los roles de usuario
type UserRole = "administrador" | "farmaceutico" | "tecnico";

const roleColors: Record<UserRole, string> = {
  administrador: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  farmaceutico:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  tecnico:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  administrador: <Shield className="h-3 w-3" />,
  farmaceutico: <UserCheck className="h-3 w-3" />,
  tecnico: <Settings className="h-3 w-3" />,
};

const roleLabels: Record<UserRole, string> = {
  administrador: "Administrador",
  farmaceutico: "Farmacéutico",
  tecnico: "Técnico",
};

// Función para validar el rol de usuario
const getUserRole = (role: string): UserRole => {
  return role === "administrador" ||
    role === "farmaceutico" ||
    role === "tecnico"
    ? role
    : "tecnico"; // valor por defecto si no es válido
};

interface UserCardProps {
  user: any;
  currentUser: any;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

export function UserCard({
  user,
  currentUser,
  onEdit,
  onDelete,
}: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userRole = getUserRole(user.role);

  return (
    <Card className="border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>

      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar Section */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                <div className={`rounded-full p-1 ${roleColors[userRole]}`}>
                  {roleIcons[userRole]}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg text-card-foreground truncate">
                  {user.name}
                </h3>
                <Badge
                  className={`${roleColors[userRole]} px-2 py-1 text-xs w-fit`}
                >
                  <div className="flex items-center gap-1">
                    {roleIcons[userRole]}
                    {roleLabels[userRole]}
                  </div>
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">📱 {user.phone}</span>
                  </div>
                )}

                {user.department && user.department !== "none" && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">🏢 {user.department}</span>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">
                      📅 Registrado: {user.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {user.lastLogin && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Último acceso: {user.lastLogin.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {currentUser?.role === "administrador" && (
            <div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start sm:pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(user)}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Editar usuario"
              >
                <Edit className="h-4 w-4" />
              </Button>

              {user.id !== currentUser.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(user)}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Eliminar usuario"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
