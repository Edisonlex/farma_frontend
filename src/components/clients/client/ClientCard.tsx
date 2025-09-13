import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  MapPin,
  Calendar,
  FileText,
  Mail,
  Edit,
  Trash2,
  Building,
  User,
  School,
} from "lucide-react";

// Definir tipo para los tipos de cliente
type ClientType = "particular" | "empresa" | "institucion";

const clientTypeColors: Record<ClientType, string> = {
  particular:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  empresa:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  institucion:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

const clientTypeIcons: Record<ClientType, React.ReactNode> = {
  particular: <User className="h-3 w-3" />,
  empresa: <Building className="h-3 w-3" />,
  institucion: <School className="h-3 w-3" />,
};

const clientTypeLabels: Record<ClientType, string> = {
  particular: "Particular",
  empresa: "Empresa",
  institucion: "Institución",
};

// Función para validar el tipo de cliente
const getClientType = (type: string): ClientType => {
  return type === "particular" || type === "empresa" || type === "institucion"
    ? type
    : "particular"; // valor por defecto si no es válido
};

interface ClientCardProps {
  client: any;
  onEdit: () => void;
  onDelete: () => void; // Cambiado para que no reciba parámetros
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const clientType = getClientType(client.type);

  return (
    <Card className="border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>

      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar Section */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                <div
                  className={`rounded-full p-1 ${clientTypeColors[clientType]}`}
                >
                  {clientTypeIcons[clientType]}
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg text-card-foreground truncate">
                  {client.name}
                </h3>
                <Badge
                  className={`${clientTypeColors[clientType]} px-2 py-1 text-xs w-fit`}
                >
                  {clientTypeLabels[clientType]}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{client.document}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{client.email}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{client.phone}</span>
                </div>

                {client.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="text-sm line-clamp-2">
                      {client.address}
                    </span>
                  </div>
                )}
              </div>

              {client.lastPurchase && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Última compra: {client.lastPurchase.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start sm:pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Editar cliente"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete} // Cambiado para usar directamente onDelete
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Eliminar cliente"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
