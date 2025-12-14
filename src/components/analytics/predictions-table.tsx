"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { PredictionData } from "@/lib/analytics-data";

type TableViewProps = {
  predictions: PredictionData[];
  sortBy: "risk" | "confidence" | "demand" | "name";
  sortDirection: "asc" | "desc";
  onSort: (column: "risk" | "confidence" | "demand" | "name") => void;
};

const PredictionsTableMobile = dynamic<TableViewProps>(
  () => import("./table/predictions-table-mobile").then((m) => m.PredictionsTableMobile),
  { ssr: false }
);

const PredictionsTableDesktop = dynamic<TableViewProps>(
  () => import("./table/predictions-table-desktop").then((m) => m.PredictionsTableDesktop),
  { ssr: false }
);

interface PredictionsTableProps {
  predictions: PredictionData[];
}

export function PredictionsTable({ predictions }: PredictionsTableProps) {
  const [sortBy, setSortBy] = useState<
    "risk" | "confidence" | "demand" | "name"
  >("risk");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isMobileView, setIsMobileView] = useState(false);

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
