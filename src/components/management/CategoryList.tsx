// components/management/category/CategoryList.tsx

import { CategoryCard } from "./CategoryCard";
import { useEffect, useMemo, useState } from "react";
import { Pager } from "@/components/shared/Pager";


interface CategoryListProps {
  categories: any[];
  onEditCategory: (category: any) => void;
  onDeleteCategory: (category: any) => void;
}

export function CategoryList({
  categories,
  onEditCategory,
  onDeleteCategory,
}: CategoryListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  useEffect(() => {
    setPage(1);
  }, [categories]);
  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return categories.slice(start, start + pageSize);
  }, [categories, page]);
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          No se encontraron categorías
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {currentItems.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
          />
        ))}
      </div>
      <Pager total={categories.length} page={page} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}
