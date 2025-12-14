import { motion } from "framer-motion";
import { Sale } from "@/context/sales-context";

interface SalesStatsProps {
  sales: Sale[];
}

export function SalesStats({ sales }: SalesStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg border border-border/30"
    >
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">{sales.length}</p>
        <p className="text-sm text-muted-foreground">Total Ventas</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-chart-5">
          {sales.filter((s) => s.status === "Completada").length}
        </p>
        <p className="text-sm text-muted-foreground">Completadas</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-destructive">
          {sales.filter((s) => s.status === "Anulada").length}
        </p>
        <p className="text-sm text-muted-foreground">Anuladas</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-accent">
          {sales.filter((s) => s.status === "Pendiente").length}
        </p>
        <p className="text-sm text-muted-foreground">Pendientes</p>
      </div>
    </motion.div>
  );
}
