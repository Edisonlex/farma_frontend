import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Table } from "lucide-react";

const formats = [
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "excel", label: "Excel", icon: Table },
];

interface FormatSelectorProps {
  formatType: string;
  setFormatType: (type: string) => void;
}

export function FormatSelector({
  formatType,
  setFormatType,
}: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Formato</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {formats.map((fmt) => {
          const Icon = fmt.icon;
          return (
            <motion.div
              key={fmt.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={formatType === fmt.value ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setFormatType(fmt.value)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {fmt.label}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
