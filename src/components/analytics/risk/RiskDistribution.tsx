"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import type { PredictionData } from "@/lib/analytics-data";
import { RiskLevelCard } from "./RiskLevelCard";

interface RiskDistributionProps {
  predictions: PredictionData[];
}

export function RiskDistribution({ predictions }: RiskDistributionProps) {
  const highRiskMedications = predictions.filter((p) => p.riskLevel === "high");
  const mediumRiskMedications = predictions.filter(
    (p) => p.riskLevel === "medium"
  );
  const lowRiskMedications = predictions.filter((p) => p.riskLevel === "low");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-semibold">
              Distribución de Riesgo
            </span>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Clasificación de medicamentos según nivel de riesgo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <RiskLevelCard
              riskLevel="high"
              medications={highRiskMedications}
              totalMedications={predictions.length}
              title="Alto Riesgo"
            />
            <RiskLevelCard
              riskLevel="medium"
              medications={mediumRiskMedications}
              totalMedications={predictions.length}
              title="Riesgo Medio"
            />
            <RiskLevelCard
              riskLevel="low"
              medications={lowRiskMedications}
              totalMedications={predictions.length}
              title="Bajo Riesgo"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
