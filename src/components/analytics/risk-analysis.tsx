"use client";

import { motion } from "framer-motion";

import type { PredictionData } from "@/lib/analytics-data";
import { RiskOverview } from "./risk/RiskOverview";
import { RiskDistribution } from "./risk/RiskDistribution";
import { RiskRecommendations } from "./risk/RiskRecommendations";

interface RiskAnalysisProps {
  analysis: {
    overallRisk: string;
    criticalMedications: number;
    stockoutProbability: number;
    recommendations: string[];
  };
  predictions: PredictionData[];
}

export function RiskAnalysis({ analysis, predictions }: RiskAnalysisProps) {
  return (
    <div className="space-y-6">
      <RiskOverview analysis={analysis} />
      <RiskDistribution predictions={predictions} />
      <RiskRecommendations recommendations={analysis.recommendations} />
    </div>
  );
}
