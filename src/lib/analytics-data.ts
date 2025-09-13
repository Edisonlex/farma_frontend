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

export interface TrendData {
  period: string;
  actual: number;
  predicted: number;
  confidence: number;
}

export interface SeasonalityData {
  month: string;
  factor: number;
  demand: number;
}

// Datos más realistas y variados
export const generatePredictions = (): PredictionData[] => {
  const medications = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      currentStock: 150,
      category: "Analgésico",
      unit: "tabletas",
    },
    {
      id: "2",
      name: "Ibuprofeno 400mg",
      currentStock: 25,
      category: "Antiinflamatorio",
      unit: "tabletas",
    },
    {
      id: "3",
      name: "Amoxicilina 250mg",
      currentStock: 80,
      category: "Antibiótico",
      unit: "cápsulas",
    },
    {
      id: "4",
      name: "Omeprazol 20mg",
      currentStock: 200,
      category: "Gastrointestinal",
      unit: "cápsulas",
    },
    {
      id: "5",
      name: "Loratadina 10mg",
      currentStock: 15,
      category: "Antihistamínico",
      unit: "tabletas",
    },
    {
      id: "6",
      name: "Atorvastatina 20mg",
      currentStock: 120,
      category: "Cardiovascular",
      unit: "tabletas",
    },
    {
      id: "7",
      name: "Metformina 500mg",
      currentStock: 95,
      category: "Antidiabético",
      unit: "tabletas",
    },
    {
      id: "8",
      name: "Salbutamol inhalador",
      currentStock: 18,
      category: "Respiratorio",
      unit: "unidades",
    },
    {
      id: "9",
      name: "Aspirina 100mg",
      currentStock: 220,
      category: "Analgésico",
      unit: "tabletas",
    },
    {
      id: "10",
      name: "Diazepam 5mg",
      currentStock: 45,
      category: "Neurológico",
      unit: "tabletas",
    },
    {
      id: "11",
      name: "Losartán 50mg",
      currentStock: 75,
      category: "Cardiovascular",
      unit: "tabletas",
    },
    {
      id: "12",
      name: "Ambroxol jarabe",
      currentStock: 30,
      category: "Respiratorio",
      unit: "frascos",
    },
  ];

  // Patrones estacionales por categoría
  const seasonalPatterns: Record<string, number> = {
    Antihistamínico: 1.8, // Mayor demanda en primavera/verano
    Respiratorio: 1.6, // Mayor demanda en invierno
    Analgésico: 1.1,
    Antiinflamatorio: 1.2,
    Antibiótico: 1.3,
    Gastrointestinal: 1.0,
    Cardiovascular: 0.9,
    Antidiabético: 0.95,
    Neurológico: 0.85,
  };

  // Tendencias por categoría
  const categoryTrends: Record<string, number> = {
    Antihistamínico: 1.4,
    Respiratorio: 1.3,
    Analgésico: 1.1,
    Antiinflamatorio: 1.0,
    Antibiótico: 0.9, // Disminuye por uso responsable
    Gastrointestinal: 1.2,
    Cardiovascular: 1.15,
    Antidiabético: 1.25,
    Neurológico: 1.05,
  };

  const currentMonth = new Date().getMonth();

  return medications.map((med) => {
    // Demanda base según categoría
    const baseDemand = Math.floor(Math.random() * 80) + 30;

    // Ajuste estacional (simulando meses)
    const seasonalAdjustment =
      currentMonth >= 2 && currentMonth <= 5
        ? seasonalPatterns[med.category]
        : 1.0;

    // Tendencia de la categoría
    const trendValue = categoryTrends[med.category];
    const trend: "increasing" | "decreasing" | "stable" =
      trendValue > 1.2
        ? "increasing"
        : trendValue < 0.9
        ? "decreasing"
        : "stable";

    const predictedDemand = Math.floor(
      baseDemand * seasonalAdjustment * trendValue
    );

    // Cálculo de orden recomendada con buffer de seguridad
    const safetyStock = Math.floor(predictedDemand * 0.3);
    const recommendedOrder = Math.max(
      0,
      predictedDemand + safetyStock - med.currentStock
    );

    // Estacionalidad basada en categoría
    let seasonality: "high" | "medium" | "low";
    if (["Antihistamínico", "Respiratorio"].includes(med.category)) {
      seasonality = "high";
    } else if (
      ["Analgésico", "Antiinflamatorio", "Antibiótico"].includes(med.category)
    ) {
      seasonality = "medium";
    } else {
      seasonality = "low";
    }

    // Nivel de riesgo basado en múltiples factores
    const stockCoverage = med.currentStock / predictedDemand;
    let riskLevel: "low" | "medium" | "high";

    if (stockCoverage < 0.7) {
      riskLevel = "high";
    } else if (stockCoverage < 1.2) {
      riskLevel = "medium";
    } else {
      riskLevel = "low";
    }

    // Confianza basada en variabilidad histórica de la categoría
    let confidence = 75;
    if (["Cardiovascular", "Antidiabético"].includes(med.category)) {
      confidence = 85 + Math.floor(Math.random() * 10); // Alta confianza
    } else if (["Analgésico", "Antiinflamatorio"].includes(med.category)) {
      confidence = 80 + Math.floor(Math.random() * 15);
    } else {
      confidence = 70 + Math.floor(Math.random() * 20);
    }

    return {
      medicationId: med.id,
      medicationName: med.name,
      currentStock: med.currentStock,
      predictedDemand,
      recommendedOrder,
      confidence,
      trend,
      seasonality,
      riskLevel,
      category: med.category,
      unit: med.unit,
    };
  });
};

// Generate trend data for charts
export const generateTrendData = (medicationName: string): TrendData[] => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const currentMonth = new Date().getMonth();

  // Encontrar el medicamento para obtener su categoría
  const medications = generatePredictions();
  const medication = medications.find(
    (m) => m.medicationName === medicationName
  );

  let baseValue = 50;
  let variability = 15;

  if (medication) {
    // Ajustar según categoría
    switch (medication.category) {
      case "Antihistamínico":
        baseValue = 65;
        variability = 25;
        break;
      case "Respiratorio":
        baseValue = 70;
        variability = 30;
        break;
      case "Cardiovascular":
        baseValue = 45;
        variability = 10;
        break;
      case "Antidiabético":
        baseValue = 40;
        variability = 8;
        break;
    }
  }

  return months.map((month, index) => {
    // Patrón estacional
    let seasonalMultiplier = 1.0;
    if (index >= 2 && index <= 5) {
      // Primavera
      seasonalMultiplier =
        medication?.category === "Antihistamínico" ? 1.8 : 1.1;
    } else if (index >= 9 || index <= 1) {
      // Invierno
      seasonalMultiplier = medication?.category === "Respiratorio" ? 1.7 : 1.05;
    }

    const baseVal = baseValue * seasonalMultiplier;
    const noise = (Math.random() - 0.5) * variability;
    const actual = Math.max(10, Math.floor(baseVal + noise));

    // Predicción con menos variabilidad
    const predicted = Math.max(
      10,
      Math.floor(baseVal + (Math.random() - 0.5) * (variability * 0.7))
    );

    return {
      period: month,
      actual,
      predicted,
      confidence: Math.floor(Math.random() * 15) + 80, // 80-95%
    };
  });
};

// Generate seasonality data
export const generateSeasonalityData = (): SeasonalityData[] => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return months.map((month, index) => {
    // Patrones estacionales más marcados
    let seasonalFactor = 1.0;

    // Invierno (diciembre-febrero) - más enfermedades respiratorias
    if (index === 11 || index <= 1) {
      seasonalFactor = 1.4 + Math.random() * 0.4;
    }
    // Primavera (marzo-mayo) - alergias
    else if (index >= 2 && index <= 4) {
      seasonalFactor = 1.6 + Math.random() * 0.3;
    }
    // Verano (junio-agosto) - traumatismos, quemaduras
    else if (index >= 5 && index <= 7) {
      seasonalFactor = 1.2 + Math.random() * 0.2;
    }
    // Otoño (septiembre-noviembre) - resfriados, gripe
    else {
      seasonalFactor = 1.3 + Math.random() * 0.3;
    }

    const baseDemand = 100;
    return {
      month,
      factor: Math.round(seasonalFactor * 100) / 100,
      demand: Math.floor(baseDemand * seasonalFactor),
    };
  });
};

// ML Model insights mejorados
export const getModelInsights = () => {
  const predictions = generatePredictions();
  const categories = [...new Set(predictions.map((p) => p.category))];

  // Calcular precisión real basada en datos
  const avgConfidence = Math.round(
    predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
  );
  const accuracy = Math.min(95, avgConfidence + 5); // La precisión es ligeramente mayor que la confianza promedio

  return {
    accuracy,
    lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Hace 7 días
    dataPoints: 4236,
    features: [
      "Consumo histórico (3 años)",
      "Tendencias estacionales",
      "Días de la semana",
      "Eventos especiales y festivos",
      "Correlaciones entre medicamentos",
      "Factores meteorológicos",
      "Indicadores epidemiológicos",
      "Patrones de prescripción médica",
    ],
    recommendations: [
      "Aumentar stock de antihistamínicos: se espera pico de alergias estacionales",
      "Optimizar inventario de antibióticos: reducir en 15% por campaña de uso responsable",
      "Reforzar existencias de medicamentos respiratorios: pronóstico de frente frío en 2 semanas",
      "Implementar promociones en gastrointestinales: baja rotación en último trimestre",
      "Establecer contrato con segundo proveedor para cardiovasculares: alto riesgo de desabasto",
    ],
    modelVersion: "v2.3.1",
    trainingDuration: "4.2 horas",
    algorithm: "XGBoost con optimización Bayesian",
  };
};

// Risk analysis mejorado
export const getRiskAnalysis = (predictions: PredictionData[]) => {
  const highRiskCount = predictions.filter(
    (p) => p.riskLevel === "high"
  ).length;
  const mediumRiskCount = predictions.filter(
    (p) => p.riskLevel === "medium"
  ).length;
  const lowRiskCount = predictions.filter((p) => p.riskLevel === "low").length;

  const totalValue = predictions.reduce(
    (sum, p) => sum + p.recommendedOrder,
    0
  );
  const criticalCategories = [
    ...new Set(
      predictions.filter((p) => p.riskLevel === "high").map((p) => p.category)
    ),
  ];

  // Calcular riesgo general ponderado
  let overallRisk: "low" | "medium" | "high";
  const riskScore =
    (highRiskCount * 3 + mediumRiskCount * 2 + lowRiskCount * 1) /
    predictions.length;

  if (riskScore > 2.2) overallRisk = "high";
  else if (riskScore > 1.5) overallRisk = "medium";
  else overallRisk = "low";

  return {
    overallRisk,
    criticalMedications: highRiskCount,
    mediumRiskMedications: mediumRiskCount,
    lowRiskMedications: lowRiskCount,
    stockoutProbability: Math.min(highRiskCount * 8 + mediumRiskCount * 3, 95),
    totalRecommendedOrderValue: totalValue,
    criticalCategories,
    recommendations: [
      highRiskCount > 0
        ? `Reabastecimiento urgente de ${highRiskCount} medicamentos en riesgo alto`
        : "No se detectan medicamentos en riesgo crítico",
      mediumRiskCount > 0
        ? `Monitoreo estrecho de ${mediumRiskCount} medicamentos en riesgo medio`
        : "Inventario estable en categorías de riesgo medio",
      criticalCategories.length > 0
        ? `Atención prioritaria a categorías: ${criticalCategories.join(", ")}`
        : "Distribución de riesgo equilibrada entre categorías",
      "Revisar contratos con proveedores críticos",
      "Implementar sistema de alertas tempranas para stock mínimo",
    ],
    lastUpdated: new Date().toISOString(),
  };
};
