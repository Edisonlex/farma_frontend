"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings, Package } from "lucide-react";

interface AdjustmentsStatsProps {
  adjustments: any[];
  medications: any[];
}

export function AdjustmentsStats({
  adjustments,
  medications,
}: AdjustmentsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Ajustes
              </p>
              <p className="text-2xl font-bold text-primary">
                {adjustments.length}
              </p>
            </div>
            <Settings className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/40 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Medicamentos
              </p>
              <p className="text-2xl font-bold">{medications.length}</p>
            </div>
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
