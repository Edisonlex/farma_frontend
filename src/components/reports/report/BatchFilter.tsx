import { Input } from "@/components/ui/input";

interface BatchFilterProps {
  batchFilter: string;
  setBatchFilter: (batch: string) => void;
}

export function BatchFilter({ batchFilter, setBatchFilter }: BatchFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Lote Específico</label>
      <Input
        value={batchFilter}
        onChange={(e) => setBatchFilter(e.target.value)}
        placeholder="Número de lote (opcional)"
      />
    </div>
  );
}
