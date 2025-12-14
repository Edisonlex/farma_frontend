import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

interface CashRegisterStatusProps {
  isOpen: boolean;
  initialAmount: number;
  currentAmount: number;
  difference: number;
}

export function CashRegisterStatus({
  isOpen,
  initialAmount,
  currentAmount,
  difference,
}: CashRegisterStatusProps) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Estado de Caja
              </CardTitle>
              <CardDescription>
                Control y monitoreo de flujo de efectivo
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={isOpen ? "default" : "secondary"}
            className="px-3 py-1 font-medium"
          >
            {isOpen ? (
              <>
                <Unlock className="w-3 h-3 mr-1" />
                Abierta
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Cerrada
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox
            label="Monto Inicial"
            value={`$${initialAmount.toFixed(2)}`}
          />

          <StatBox
            label="Monto Actual"
            value={`$${currentAmount.toFixed(2)}`}
          />

          <StatBox
            label="Diferencia"
            value={`${difference >= 0 ? "+" : ""}$${difference.toFixed(2)}`}
            isPositive={difference >= 0}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({
  label,
  value,
  isPositive,
}: {
  label: string;
  value: string;
  isPositive?: boolean;
}) {
  return (
    <motion.div
      className="text-center p-4 rounded-lg bg-muted/20 border border-border/30"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p
        className={`text-2xl font-bold ${
          isPositive === undefined
            ? "text-foreground"
            : isPositive
            ? "text-chart-5"
            : "text-destructive"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}
