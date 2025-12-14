import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface UserSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  onNewUser: () => void;
  userRole?: string;
}

// Función para normalizar texto (eliminar tildes y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export function UserSearch({
  search,
  onSearchChange,
  onNewUser,
  userRole,
}: UserSearchProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios (con o sin tildes)..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {userRole === "administrador" && (
            <Button onClick={onNewUser}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Y necesitas actualizar tu filtrado en el componente principal:
export function useUserSearch(users: any[], search: string) {
  const normalizedSearch = normalizeText(search);

  return users.filter((user) => {
    const normalizedName = normalizeText(user.name || "");
    const normalizedEmail = normalizeText(user.email || "");

    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedEmail.includes(normalizedSearch)
    );
  });
}
