import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory } from "@/context/inventory-context";

interface SupplierFilterProps {
  supplierFilter: string;
  setSupplierFilter: (supplier: string) => void;
  suppliers: string[];
}

export function SupplierFilter({
  supplierFilter,
  setSupplierFilter,
  suppliers,
}: SupplierFilterProps) {
  const { getSupplierName } = useInventory();
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Proveedor</label>
      <Select value={supplierFilter} onValueChange={setSupplierFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Todos los proveedores" />
        </SelectTrigger>
        <SelectContent className="border-border bg-background">
          <SelectItem value="all">Todos los proveedores</SelectItem>
          {suppliers.map((sup) => (
            <SelectItem key={sup} value={sup}>
              {getSupplierName(sup)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
