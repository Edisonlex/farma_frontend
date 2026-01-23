import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory } from "@/context/inventory-context";

interface CategoryFilterProps {
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
}

export function CategoryFilter({
  category,
  setCategory,
  categories,
}: CategoryFilterProps) {
  const { getCategoryName } = useInventory();
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Categoría</label>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent className="border-border bg-background">
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat.toLowerCase()}>
              {getCategoryName(cat)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
