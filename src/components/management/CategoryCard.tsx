// components/management/category/CategoryCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Tag } from "lucide-react";

interface CategoryCardProps {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card className="border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>

      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Información de la Categoría */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                <Tag className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg text-card-foreground truncate">
                  {category.name}
                </h3>
                <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  ID: {category.id}
                </div>
              </div>

              {category.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {category.description}
                </p>
              )}

              <div className="text-xs text-muted-foreground">
                Creada el: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start sm:pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Editar categoría"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category)}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Eliminar categoría"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
