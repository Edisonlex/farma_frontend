// components/management/supplier/SupplierCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Truck, Mail, Phone, User } from "lucide-react";
import type { Supplier } from "@/lib/types";

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SupplierCard({
  supplier,
  onEdit,
  onDelete,
}: SupplierCardProps) {
  return (
    <Card className="border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>

      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Información del Proveedor */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h3 className="font-semibold text-lg text-card-foreground truncate">
                  {supplier.nombreComercial || supplier.name}
                </h3>
                <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  ID: {supplier.id}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-sm truncate">Razón social: {supplier.razonSocial}</span>
                  <span className="text-xs px-2 py-1 rounded bg-muted">{supplier.tipo === "empresa" ? "Empresa" : "Persona"} · {supplier.status}</span>
                </div>
                {(supplier.ruc || supplier.cedula) && (
                  <div className="text-muted-foreground text-sm">
                    {supplier.ruc ? `RUC: ${supplier.ruc}` : `Cédula: ${supplier.cedula}`}
                  </div>
                )}
                {supplier.contact && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{supplier.contact}</span>
                  </div>
                )}

                {supplier.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{supplier.email}</span>
                  </div>
                )}

                {supplier.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{supplier.phone}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground mt-3">
                Registrado el: {new Date(supplier.fechaRegistro).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start sm:pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(supplier)}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Editar proveedor"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(supplier)}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Eliminar proveedor"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
