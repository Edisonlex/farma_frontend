import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Medication } from "@/lib/types";
import { useInventory } from "@/context/inventory-context";
import { getExpiryStatus, getStockStatus } from "@/utils/statusUtils";

interface MedicationsMobileViewProps {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
  onDelete?: (id: string) => void;
  onViewDetails: (medication: Medication) => void;
}

export function MedicationsMobileView({
  medications,
  onEdit,
  onDelete,
  onViewDetails,
}: MedicationsMobileViewProps) {
  const { getCategoryName, getSupplierName } = useInventory();
  return (
    <div className="space-y-4">
      {medications.map((medication, index) => {
        const stockStatus = getStockStatus(medication);
        const expiryStatus = getExpiryStatus(medication.expiryDate);

        return (
          <motion.div
            key={medication.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-lg border border-border/60 p-4 bg-card shadow-sm hover:bg-muted/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  {medication.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getCategoryName(medication.category)} • Lote {medication.batch}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-background border-border border shadow-md rounded-md" // Añadidas clases aquí
                >
                  <DropdownMenuItem
                    onClick={() => onViewDetails(medication)}
                    className="cursor-pointer text-sm px-3 py-2 focus:bg-accent/50" // Añadidas clases aquí
                  >
                    <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
                    Ver Detalles
                  </DropdownMenuItem>
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={() => onEdit(medication)}
                      className="cursor-pointer text-sm px-3 py-2 focus:bg-accent/50" // Añadidas clases aquí
                    >
                      <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
                      Editar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(medication.id)}
                      className="text-destructive cursor-pointer text-sm px-3 py-2 focus:bg-destructive/15 focus:text-destructive" // Añadidas clases aquí
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Lote:</span>
                <Badge variant="ghost" className="ml-2 font-mono text-xs">
                  {medication.batch}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Categoría:</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {getCategoryName(medication.category)}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Stock:</span>
                <span className="font-medium ml-2 text-foreground">
                  {medication.quantity}
                </span>
                <Badge
                  variant={stockStatus.color as "default" | "destructive"}
                  className="ml-2 text-xs"
                >
                  {stockStatus.text}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Mín:</span>
                <span className="ml-2 text-foreground">
                  {medication.minStock}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-muted-foreground">Vencimiento:</span>
                <div className="flex items-center mt-1">
                  {expiryStatus.icon && (
                    <expiryStatus.icon className="w-4 h-4 text-destructive mr-2" />
                  )}
                  <Badge
                    variant={
                      expiryStatus.status === "vencido"
                        ? "destructive"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {expiryStatus.text}
                  </Badge>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-muted-foreground">Proveedor:</span>
                <p className="truncate text-foreground break-words">
                  {getSupplierName(medication.supplier)}
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-muted-foreground">Precio:</span>
                <p className="font-medium text-foreground">
                  ${medication.price.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
