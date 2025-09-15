// components/management/category/CategorySearch.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface CategorySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  onNewCategory: () => void;
}

export function CategorySearch({
  search,
  onSearchChange,
  onNewCategory,
}: CategorySearchProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categorías (con o sin tildes)..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={onNewCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
