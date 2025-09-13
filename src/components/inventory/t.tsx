import React, { useState, useEffect } from "react";
import { Package, Activity, TrendingUp, AlertTriangle } from "lucide-react";

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Componente de Tab simulado usando Tailwind
const TabsTrigger = ({
  value,
  isActive,
  onClick,
  children,
  className = "",
}) => (
  <button
    onClick={() => onClick(value)}
    className={`
      px-3 py-2 text-sm font-medium transition-all duration-200
      ${
        isActive
          ? "bg-white text-gray-900 shadow-sm border-b-2 border-blue-500"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }
      ${className}
    `}
  >
    {children}
  </button>
);

const TabsList = ({ children, className = "" }) => (
  <div className={`bg-gray-100 rounded-lg p-1 ${className}`}>{children}</div>
);

export default function ResponsiveInventoryTabs() {
  const [activeTab, setActiveTab] = useState("current");
  const isMobile = useIsMobile();

  const tabs = [
    {
      value: "current",
      icon: Package,
      label: "Estado Actual",
      shortLabel: "Estado",
    },
    {
      value: "movements",
      icon: Activity,
      label: "Movimientos",
      shortLabel: "Mov.",
    },
    {
      value: "adjustments",
      icon: TrendingUp,
      label: "Ajustes",
      shortLabel: "Ajustes",
    },
    {
      value: "history",
      icon: AlertTriangle,
      label: "Historial",
      shortLabel: "Hist.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white">


      {/* Tabs responsivos */}
      <TabsList
        className={`
          ${isMobile ? "grid grid-cols-4 gap-1" : "grid grid-cols-4"}
        `}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              isActive={activeTab === tab.value}
              onClick={setActiveTab}
              className={`
                flex items-center justify-center gap-2
                ${
                  isMobile
                    ? "flex-col py-3 px-1 text-xs min-h-[60px]"
                    : "flex-row py-2 px-3 text-sm"
                }
              `}
            >
              <IconComponent
                className={`${isMobile ? "h-4 w-4" : "h-4 w-4"}`}
              />
              <span
                className={`${
                  isMobile ? "text-xs leading-tight text-center" : ""
                }`}
              >
                {isMobile ? tab.shortLabel : tab.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

    </div>
  );
}
