"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  RefreshCw,
  ChartBar,
  Target,
  TrendingUp,
  Brain,
  AlertTriangle,
} from "lucide-react";
import { PredictionsTable } from "./predictions-table";
import { TrendChart } from "./trend-chart";
import { SeasonalityChart } from "./seasonality-chart";
import { ModelInsights } from "./model-insights";
import { RiskAnalysis } from "./risk-analysis";
import { AnalyticsStats } from "./analytics-stats";
import {
  generatePredictionsFromInventory,
  getModelInsightsFromInventory,
  getRiskAnalysis,
  generateTrendDataFromMovements,
  generateSeasonalityDataFromMovements,
} from "@/lib/analytics-data";
import { PageHeader } from "../shared/page-header";
import ResponsiveTabsList from "./ResponsiveTabsList";
import { useInventory } from "@/context/inventory-context";

export interface AnalyticsData {
  predictions: any[];
  modelInsights: any;
  riskAnalysis: any;
  trendData: any[];
  seasonalityData: any[];
}

export function AnalyticsPage() {
  const { user, logout } = useAuth();
  const { medications, movements } = useInventory();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar todos los datos
  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const predictions = generatePredictionsFromInventory(medications as any, movements as any);
      const modelInsights = getModelInsightsFromInventory(predictions);
      const riskAnalysis = getRiskAnalysis(predictions);
      
      // Generar tendencia global de todos los movimientos
      const trendData = generateTrendDataFromMovements(null, movements as any);
      
      const seasonalityData = generateSeasonalityDataFromMovements(movements as any);

      setAnalyticsData({
        predictions,
        modelInsights,
        riskAnalysis,
        trendData,
        seasonalityData,
      });
    } catch (err) {
      setError("Error al cargar los datos analíticos");
      console.error("Error loading analytics data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const refreshPredictions = async () => {
    setIsRefreshing(true);
    await loadAnalyticsData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Cargando análisis predictivo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadAnalyticsData}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Análisis Predictivo"
        subtitle="Predicciones inteligentes basadas en IA"
        icon={<ChartBar className="h-6 w-6 text-white" />}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-end mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshPredictions}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>

          {/* Analytics Stats */}
          <div className="mb-8">
            <AnalyticsStats
              predictions={analyticsData.predictions}
              modelAccuracy={analyticsData.modelInsights.accuracy}
              riskLevel={analyticsData.riskAnalysis.overallRisk}
            />
          </div>

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="predictions" className="space-y-6">
            <ResponsiveTabsList />

            <TabsContent className="mt-4" value="predictions">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Predicciones de Demanda
                    </CardTitle>
                    <CardDescription>
                      Predicciones de consumo y recomendaciones de compra
                      basadas en IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PredictionsTable predictions={analyticsData.predictions} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent className="mt-4" value="trends">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrendChart data={analyticsData.trendData} />
                  <SeasonalityChart data={analyticsData.seasonalityData} />
                </div>
              </div>
            </TabsContent>

            <TabsContent className="mt-4" value="insights">
              <ModelInsights insights={analyticsData.modelInsights} />
            </TabsContent>

            <TabsContent className="mt-4" value="risk">
              <RiskAnalysis
                analysis={analyticsData.riskAnalysis}
                predictions={analyticsData.predictions}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
