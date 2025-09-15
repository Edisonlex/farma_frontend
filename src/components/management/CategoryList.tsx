// components/management/category/CategoryList.tsx

import { CategoryCard } from "./CategoryCard";


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
    <div className="grid gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
        />
      ))}
    </div>
  );
}
