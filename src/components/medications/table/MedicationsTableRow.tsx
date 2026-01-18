// components/medications/medications-table-row.tsx (actualizado)
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { getExpiryStatus, getStockStatus } from "@/utils/statusUtils";
import { useInventory } from "@/context/inventory-context";
import type { Medication } from "@/lib/types";

interface MedicationsTableRowProps {
  medication: Medication;
  index: number;
  onEdit?: (medication: Medication) => void;
  onDelete?: (id: string) => void;
  onViewDetails: (medication: Medication) => void;
}

export function MedicationsTableRow({
  medication,
  index,
  onEdit,
  onDelete,
  onViewDetails,
}: MedicationsTableRowProps) {
  const { getCategoryName, getSupplierName } = useInventory();
  const stockStatus = getStockStatus(medication);
  const expiryStatus = getExpiryStatus(medication.expiryDate);

  // Función para obtener el color del badge según el estado
  const getStockBadgeVariant = () => {
    if (medication.quantity <= 0) return "destructive";
    if (medication.quantity <= medication.minStock) return "destructive";
    if (medication.quantity <= medication.minStock * 1.5) return "default";
    return "secondary";
  };

  const getExpiryBadgeVariant = () => {
    const today = new Date();
    const daysToExpiry = Math.ceil(
      (medication.expiryDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysToExpiry < 0) return "destructive";
    if (daysToExpiry <= 30) return "default";
    return "secondary";
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group hover:bg-muted/20 transition-all duration-200 border-b border-border/40"
    >
      <TableCell className="py-3.5 px-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-9 ring-1 ring-border/40">
            <AvatarImage
              src={
                medication.imageUrl ||
                `https://picsum.photos/seed/${encodeURIComponent(
                  medication.name
                )}/64/64`
              }
              alt={medication.name}
            />
            <AvatarFallback>
              {medication.name?.slice(0, 1) || "M"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium text-foreground/90 group-hover:text-foreground transition-colors">
              {medication.name}
            </div>
            <div className="text-xs text-muted-foreground/80 mt-1">
              {medication.activeIngredient}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-3.5 px-4">
        <Badge
          variant="ghost"
          className="font-mono text-[11px] bg-secondary/30 border border-border/50 text-foreground/80 px-2"
        >
          {medication.batch}
        </Badge>
      </TableCell>

      <TableCell className="py-3.5 px-4">
        <Badge
          variant="secondary"
          className="text-xs bg-primary/10 text-primary hover:bg-primary/15 border-0 px-2"
        >
          {getCategoryName(medication.category)}
        </Badge>
      </TableCell>

      <TableCell className="py-3.5 px-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground/90 text-sm">
              {medication.quantity}
            </span>
            <Badge
              variant={getStockBadgeVariant()}
              className="text-xs px-1.5 py-0.5"
            >
              {stockStatus.text}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/40"></span>
            Mín: {medication.minStock}
          </div>
        </div>
      </TableCell>

      <TableCell className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          {expiryStatus.status === "vencido" && (
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
          )}
          {expiryStatus.status === "por-vencer" && (
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
          )}
          <Badge
            variant={getExpiryBadgeVariant()}
            className="text-xs px-1.5 py-0.5"
          >
            {expiryStatus.text}
          </Badge>
        </div>
      </TableCell>

      <TableCell className="py-3.5 px-4">
        <span className="text-sm text-foreground/85 font-medium">
          {getSupplierName(medication.supplier)}
        </span>
      </TableCell>

      <TableCell className="py-3.5 px-4">
        <div className="text-right">
          <span className="font-semibold text-foreground/90">
            ${medication.price.toFixed(2)}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-3.5 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-background border-border shadow-md rounded-md border"
          >
            <DropdownMenuItem
              onClick={() => onViewDetails(medication)}
              className="cursor-pointer text-sm px-3 py-2 focus:bg-accent/50"
            >
              <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
              Ver Detalles
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(medication)}
                className="cursor-pointer text-sm px-3 py-2 focus:bg-accent/50"
              >
                <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete && onDelete(medication.id)}
                className="cursor-pointer text-destructive text-sm px-3 py-2 focus:bg-destructive/15 focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  );
}
