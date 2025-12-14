import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, Brain, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResponsiveTabsList() {
  const isMobile = useIsMobile();

  const tabs = [
    {
      value: "predictions",
      icon: Target,
      label: "Predicciones",
      shortLabel: "Pred.",
    },
    {
      value: "trends",
      icon: TrendingUp,
      label: "Tendencias",
      shortLabel: "Tend.",
    },
    {
      value: "insights",
      icon: Brain,
      label: "Insights del Modelo",
      shortLabel: "Insights",
    },
    {
      value: "risk",
      icon: AlertTriangle,
      label: "Análisis de Riesgo",
      shortLabel: "Riesgo",
    },
  ];

  return (
    <TabsList className={`grid w-full grid-cols-2 sm:grid-cols-4 ${isMobile ? "gap-1" : ""}`}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`
              flex items-center gap-2
              ${
                isMobile
                  ? "flex-col py-3 px-1 text-xs min-h-[60px]"
                  : "flex-row py-2 px-3 text-sm"
              }
            `}
          >
            <IconComponent className="h-4 w-4" />
            <span
              className={isMobile ? "text-xs leading-tight text-center" : ""}
            >
              {isMobile ? tab.shortLabel : tab.label}
            </span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
