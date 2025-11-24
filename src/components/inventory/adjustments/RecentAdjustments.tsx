"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings, Plus, Minus, User } from "lucide-react";

interface RecentAdjustmentsProps {
  adjustments: any[];
}

export function RecentAdjustments({ adjustments }: RecentAdjustmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Ajustes Recientes
        </CardTitle>
        <CardDescription>
          Historial de los últimos ajustes realizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {adjustments.slice(0, 5).map((adjustment) => (
            <Card key={adjustment.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{adjustment.medicationName || adjustment.medication}</h4>
                      <Badge
                        variant={adjustment.quantity >= 0 ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {adjustment.quantity >= 0 ? (
                          <>
                            <Plus className="h-3 w-3" />+{Math.abs(adjustment.quantity)}
                          </>
                        ) : (
                          <>
                            <Minus className="h-3 w-3" />-{Math.abs(adjustment.quantity)}
                          </>
                        )}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {adjustment.reason}
                    </p>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {adjustment.userName || adjustment.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(adjustment.date).toLocaleString("es-ES")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {adjustments.length === 0 && (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No hay ajustes registrados
              </h3>
              <p className="text-muted-foreground">
                Los ajustes que realices aparecerán aquí
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
