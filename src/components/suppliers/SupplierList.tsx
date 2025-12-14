// components/management/supplier/SupplierList.tsx

import { SupplierCard } from "./SupplierCard";
import { useEffect, useMemo, useState } from "react";
import { Pager } from "@/components/shared/Pager";
import type { Supplier } from "@/lib/types";


interface SupplierListProps {
  suppliers: Supplier[];
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
}

export function SupplierList({
  suppliers,
  onEditSupplier,
  onDeleteSupplier,
}: SupplierListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  useEffect(() => {
    setPage(1);
  }, [suppliers]);
  const totalPages = Math.max(1, Math.ceil(suppliers.length / pageSize));
  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return suppliers.slice(start, start + pageSize);
  }, [suppliers, page]);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, suppliers.length);
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    const showLeftEllipsis = page > 4;
    const showRightEllipsis = page < totalPages - 3;
    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);
    if (showLeftEllipsis) pages.push("ellipsis");
    for (let p = startPage; p <= endPage; p++) pages.push(p);
    if (showRightEllipsis) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };
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
    <div className="space-y-4">
      <div className="grid gap-4">
        {currentItems.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            onEdit={onEditSupplier}
            onDelete={onDeleteSupplier}
          />
        ))}
      </div>
      <Pager total={suppliers.length} page={page} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}
