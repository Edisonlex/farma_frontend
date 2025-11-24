import React, { useState } from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { Package, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";

export default function TabsListsCom() {
  const [activeTab, setActiveTab] = useState("current");
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const baseTabs = [
    {
      value: "current",
      icon: Package,
      label: "Estado Actual",
      shortLabel: "Estado",
    },
    {
      value: "history",
      icon: AlertTriangle,
      label: "Historial",
      shortLabel: "Hist.",
    },
  ];

  const canAdjust = user ? hasPermission(user.role, "adjust_inventory") : false;
  const tabs = canAdjust
    ? [
        ...baseTabs,
        {
          value: "adjustments",
          icon: TrendingUp,
          label: "Ajustes",
          shortLabel: "Ajustes",
        },
      ]
    : baseTabs;

  return (
    <TabsList className={`grid w-full ${isMobile ? "gap-1" : ""} ${
      tabs.length === 3 ? "grid-cols-3" : "grid-cols-2"
    }`}>
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
