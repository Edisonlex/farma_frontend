"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovementCardProps {
  movement: any;
}

export function MovementCard({ movement }: MovementCardProps) {
  return (
    <Card
      key={movement.id}
      className="overflow-hidden transition-all hover:shadow-md"
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={cn(
                "p-3 rounded-lg flex-shrink-0",
                movement.type === "entrada"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {movement.type === "entrada" ? (
                <ArrowUp className="h-5 w-5" />
              ) : (
                <ArrowDown className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">
                {movement.medicationName}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {movement.reason}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {movement.userName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(movement.date).toLocaleString("es-ES")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0 sm:pl-4">
            <div
              className={cn(
                "text-xl font-bold",
                movement.type === "entrada" ? "text-green-600" : "text-red-600"
              )}
            >
              {movement.type === "entrada" ? "+" : "-"}
              {Math.abs(movement.quantity)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                unidades
              </span>
            </div>

            <Badge
              variant={movement.type === "entrada" ? "default" : "secondary"}
              className="self-end"
            >
              {movement.type === "entrada" ? "Entrada" : "Salida"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
