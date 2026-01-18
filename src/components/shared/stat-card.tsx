"use client";

import { Card, CardContent } from "@/components/ui/card";
import type React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  icon: React.ReactNode;
  accentClass: string;
  progressClass?: string;
  iconBgClass?: string;
}

export function StatCard({
  title,
  value,
  percentage,
  icon,
  accentClass,
  progressClass,
  iconBgClass,
}: StatCardProps) {
  const pct =
    typeof percentage === "number" && !Number.isNaN(percentage)
      ? Math.max(0, Math.min(100, percentage))
      : undefined;

  return (
    <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group relative">
      <div className={`absolute top-0 left-0 w-full h-1 ${accentClass}`}></div>
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-card-foreground mt-1">
              {value}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
              iconBgClass ?? "bg-primary/10"
            }`}
          >
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                progressClass ?? accentClass
              }`}
              style={{ width: `${pct ?? 100}%` }}
            ></div>
          </div>
        </div>
        {typeof pct === "number" && (
          <p className="text-xs text-muted-foreground mt-1">
            {pct.toFixed(1)}% del total
          </p>
        )}
      </CardContent>
    </Card>
  );
}

