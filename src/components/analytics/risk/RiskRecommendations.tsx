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
import { Shield } from "lucide-react";

interface RiskRecommendationsProps {
  recommendations: string[];
}

export function RiskRecommendations({
  recommendations,
}: RiskRecommendationsProps) {
  const getPriority = (index: number) => {
    if (index === 0) return "Urgente";
    if (index === 1) return "Importante";
    return "Sugerido";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-card-foreground">
            <div className="p-2.5 rounded-xl bg-chart-5/10 border border-chart-5/20">
              <Shield className="w-6 h-6 text-chart-5" />
            </div>
            <span className="text-xl font-semibold">
              Recomendaciones de Mitigación
            </span>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Acciones sugeridas para reducir el riesgo de desabastecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors group"
              >
                <div className="w-7 h-7 bg-chart-5/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-chart-5/20 transition-colors">
                  <span className="text-sm font-bold text-chart-5">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-foreground">
                    {recommendation}
                  </p>
                </div>
                <Badge
                  variant="ghost"
                  className="text-xs bg-background/80 border-border"
                >
                  {getPriority(index)}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
