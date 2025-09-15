// components/management/supplier/SupplierList.tsx

import { SupplierCard } from "./SupplierCard";


interface SupplierListProps {
  suppliers: any[];
  onEditSupplier: (supplier: any) => void;
  onDeleteSupplier: (supplier: any) => void;
}

export function SupplierList({
  suppliers,
  onEditSupplier,
  onDeleteSupplier,
}: SupplierListProps) {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          No se encontraron proveedores
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {suppliers.map((supplier) => (
        <SupplierCard
          key={supplier.id}
          supplier={supplier}
          onEdit={onEditSupplier}
          onDelete={onDeleteSupplier}
        />
      ))}
    </div>
  );
}
