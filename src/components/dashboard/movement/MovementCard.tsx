// components/recent-movements/MovementCard.tsx
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, RotateCcw, Receipt } from "lucide-react";

interface MovementCardProps {
  movement: {
    id: string;
    type: string;
    medicationName: string;
    quantity: number;
    date: Date;
    reason: string;
    userName: string;
    total?: number;
    status?: string;
  };
  index: number;
}

const getMovementIcon = (type: string) => {
  switch (type) {
    case "entrada":
      return ArrowUp;
    case "salida":
      return ArrowDown;
    case "ajuste":
      return RotateCcw;
    case "venta":
      return Receipt;
    default:
      return ArrowUp;
  }
};

const getMovementColor = (type: string) => {
  switch (type) {
    case "entrada":
      return "text-chart-5";
    case "salida":
    case "venta":
      return "text-destructive";
    case "ajuste":
      return "text-chart-3";
    default:
      return "text-muted-foreground";
  }
};

const getMovementBadgeColor = (type: string, status?: string) => {
  if (type === "venta") {
    switch (status) {
      case "Completada":
        return "bg-chart-5/20 text-chart-5 border-chart-5/30 hover:bg-chart-5/30";
      case "Anulada":
        return "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30";
      case "Pendiente":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30 hover:bg-chart-3/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  }

  switch (type) {
    case "entrada":
      return "bg-chart-5/20 text-chart-5 border-chart-5/30 hover:bg-chart-5/30";
    case "salida":
      return "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30";
    case "ajuste":
      return "bg-chart-3/20 text-chart-3 border-chart-3/30 hover:bg-chart-3/30";
    default:
      return "";
  }
};

const getMovementBackground = (type: string) => {
  switch (type) {
    case "entrada":
      return "bg-chart-5/10";
    case "salida":
    case "venta":
      return "bg-destructive/10";
    case "ajuste":
      return "bg-chart-3/10";
    default:
      return "bg-muted";
  }
};

export function MovementCard({ movement, index }: MovementCardProps) {
  const Icon = getMovementIcon(movement.type);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-start space-x-3 p-3 rounded-xl border border-border/50 bg-card hover:shadow-md hover:border-primary/30 transition-all group sm:items-center sm:space-x-4 sm:p-4 cursor-pointer"
      onClick={() => {
        if (movement.type === "venta") {
          const q = new URLSearchParams({ tab: "history", search: String(movement.id) });
          router.push(`/ventas?${q.toString()}`);
        } else {
          const q = new URLSearchParams({ tab: "history", search: movement.medicationName });
          router.push(`/inventario?${q.toString()}`);
        }
      }}
    >
      {/* Icono - Más pequeño en móvil */}
      <div
        className={`p-2 rounded-xl ${getMovementBackground(
          movement.type
        )} group-hover:scale-110 transition-transform sm:p-3`}
      >
        <Icon
          className={`w-4 h-4 ${getMovementColor(movement.type)} sm:w-5 sm:h-5`}
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
        {/* Primera línea: Nombre del medicamento y badge */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors sm:text-base">
            {movement.medicationName}
          </h4>
          <div className="flex items-center gap-2">
            {movement.total && movement.total > 0 && (
              <span className="text-xs font-medium text-foreground sm:text-sm">
                ${movement.total.toFixed(2)}
              </span>
            )}
            <Badge
              className={`text-xs capitalize border ${getMovementBadgeColor(
                movement.type,
                movement.status
              )} whitespace-nowrap`}
            >
              {movement.type === "venta"
                ? `Venta: ${movement.status}`
                : movement.type}
            </Badge>
          </div>
        </div>

        {/* Segunda línea: Cantidad y fecha */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span
            className={`text-xs font-medium ${getMovementColor(
              movement.type
            )} sm:text-sm`}
          >
            {movement.type === "entrada"
              ? "+"
              : movement.type === "salida" || movement.type === "venta"
              ? "-"
              : movement.quantity > 0
              ? "+"
              : ""}
            {Math.abs(movement.quantity)} unidades
          </span>
          <span className="text-xs text-muted-foreground sm:text-sm">
            {movement.date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Tercera línea: Razón y usuario */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground line-clamp-1 sm:text-sm">
            {movement.reason}
          </span>
          <span className="text-xs text-muted-foreground sm:text-sm">
            • {movement.userName}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
