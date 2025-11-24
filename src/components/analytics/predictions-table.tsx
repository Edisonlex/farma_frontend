"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PredictionsTableMobile } from "./table/predictions-table-mobile";
import { PredictionsTableDesktop } from "./table/predictions-table-desktop";

export interface PredictionData {
  medicationId: string;
  medicationName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  confidence: number;
  trend: "increasing" | "decreasing" | "stable";
  seasonality: "high" | "medium" | "low";
  riskLevel: "low" | "medium" | "high";
  category: string;
  unit: string;
}

interface PredictionsTableProps {
  predictions: PredictionData[];
}

export function PredictionsTable({ predictions }: PredictionsTableProps) {
  const [sortBy, setSortBy] = useState<
    "risk" | "confidence" | "demand" | "name"
  >("risk");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isMobileView, setIsMobileView] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSort = (column: typeof sortBy) => {
    if (column === sortBy) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "risk":
        const riskOrder = { high: 3, medium: 2, low: 1 };
        comparison = riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        break;
      case "confidence":
        comparison = b.confidence - a.confidence;
        break;
      case "demand":
        comparison = b.predictedDemand - a.predictedDemand;
        break;
      case "name":
        comparison = a.medicationName.localeCompare(b.medicationName);
        break;
      default:
        return 0;
    }

    return sortDirection === "desc" ? comparison : -comparison;
  });

  if (isMobileView) {
    return (
      <PredictionsTableMobile
        predictions={sortedPredictions}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    );
  }

  return (
    <PredictionsTableDesktop
      predictions={sortedPredictions}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
}
