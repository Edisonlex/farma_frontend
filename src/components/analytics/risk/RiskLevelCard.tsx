"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import type { PredictionData } from "@/lib/analytics-data";

interface RiskLevelCardProps {
  riskLevel: "high" | "medium" | "low";
  medications: PredictionData[];
  totalMedications: number;
  title: string;
}

const riskConfig = {
  high: {
    icon: AlertCircle,
    color: "destructive",
    bgColor: "destructive",
    borderColor: "destructive/20",
  },
  medium: {
    icon: AlertTriangle,
    color: "amber-500",
    bgColor: "amber-500",
    borderColor: "amber-500/20",
  },
  low: {
    icon: CheckCircle,
    color: "chart-5",
    bgColor: "chart-5",
    borderColor: "chart-5/20",
  },
} as const;

export function RiskLevelCard({
  riskLevel,
  medications,
  totalMedications,
  title,
}: RiskLevelCardProps) {
  const config = riskConfig[riskLevel];
  const IconComponent = config.icon;
  const percentage = Math.round((medications.length / totalMedications) * 100);

  return (
    <div
      className={`space-y-4 p-4 rounded-xl bg-${config.bgColor}/5 border border-${config.borderColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg bg-${config.bgColor}/10`}>
            <IconComponent className={`w-5 h-5 text-${config.color}`} />
          </div>
          <h4 className={`font-semibold text-${config.color}`}>
            {title} ({medications.length})
          </h4>
        </div>
        <Badge
          variant={riskLevel === "high" ? "destructive" : "ghost"}
          className="px-3 py-1"
        >
          {percentage}%
        </Badge>
      </div>

      <Progress
        value={percentage}
        className={`h-2 bg-${config.bgColor}/20 [&>div]:bg-${config.bgColor}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {medications.map((med) => (
          <div
            key={med.medicationId}
            className={`flex items-center justify-between p-3 bg-${config.bgColor}/10 rounded-lg border border-${config.borderColor} hover:bg-${config.bgColor}/15 transition-colors`}
          >
            <span className="text-sm font-medium text-foreground">
              {med.medicationName}
            </span>
            <Badge variant="ghost" className="bg-background/80 text-xs">
              Stock: {med.currentStock}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
