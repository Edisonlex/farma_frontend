"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface RiskOverviewProps {
  analysis: {
    overallRisk: string;
    criticalMedications: number;
    stockoutProbability: number;
  };
}

const getRiskIcon = (risk: string) => {
  switch (risk) {
    case "high":
      return <AlertCircle className="w-5 h-5 text-destructive" />;
    case "medium":
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case "low":
      return <CheckCircle className="w-5 h-5 text-chart-5" />;
    default:
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  }
};

const getRiskText = (risk: string) => {
  switch (risk) {
    case "high":
      return "Alto";
    case "medium":
      return "Medio";
    case "low":
      return "Bajo";
    default:
      return "Medio";
  }
};

export function RiskOverview({ analysis }: RiskOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <span className="text-xl font-semibold">
              Evaluación General de Riesgo
            </span>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Análisis integral del riesgo de desabastecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-gradient-to-br from-destructive/5 to-destructive/10 border border-destructive/20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-full mb-3">
                {getRiskIcon(analysis.overallRisk)}
              </div>
              <Badge
                variant="destructive"
                className="mb-3 text-base px-4 py-2 font-semibold"
              >
                Riesgo {getRiskText(analysis.overallRisk)}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Estado General del Inventario
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-3">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">
                {analysis.criticalMedications}
              </div>
              <p className="text-sm text-muted-foreground">
                Medicamentos Críticos
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 rounded-full mb-3">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-amber-500 mb-2">
                {analysis.stockoutProbability}%
              </div>
              <p className="text-sm text-muted-foreground">
                Probabilidad de Desabasto
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
