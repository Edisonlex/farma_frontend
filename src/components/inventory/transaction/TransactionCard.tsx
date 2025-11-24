"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Settings, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionCardProps {
  transaction: any;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const getTransactionStyles = () => {
    if (transaction.type === "adjustment") {
      return {
        icon: Settings,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        badgeVariant: "ghost" as const,
        badgeText: "Ajuste",
      };
    }

    return transaction.subtype === "entrada"
      ? {
          icon: ArrowUp,
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          badgeVariant: "default" as const,
          badgeText: "Entrada",
        }
      : {
          icon: ArrowDown,
          color: "text-red-600",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          badgeVariant: "secondary" as const,
          badgeText: "Salida",
        };
  };

  const styles = getTransactionStyles();
  const Icon = styles.icon;

  return (
    <Card className="border-border/50 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={cn("p-3 rounded-lg", styles.bgColor)}>
              <Icon className={cn("h-5 w-5", styles.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">
                  {transaction.medication}
                </h3>
                <Badge variant={styles.badgeVariant} className="text-xs">
                  {styles.badgeText}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {transaction.reason}
                {transaction.batch !== "N/A" && ` • Lote: ${transaction.batch}`}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {transaction.user}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {transaction.date}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
            <div className={cn("text-xl font-bold", styles.color)}>
              {transaction.subtype === "entrada" ||
              transaction.subtype === "increase"
                ? "+"
                : "-"}
              {transaction.quantity}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                unid
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-right">
              {transaction.type === "adjustment" ? "Ajuste" : "Movimiento"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
