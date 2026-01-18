import { useState, useEffect } from "react";

export interface CategoryData {
  name: string;
  value: number;
  percentage: string;
}

export interface MonthlyMovement {
  month: string;
  entradas: number;
  salidas: number;
  stock: number;
}

export interface DashboardData {
  categoryData: CategoryData[];
  monthlyMovements: MonthlyMovement[];
}

// Simulated API calls
async function fetchCategoryData(): Promise<CategoryData[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return [
    { name: "Analgésicos", value: 150, percentage: "32%" },
    { name: "Antibióticos", value: 80, percentage: "17%" },
    { name: "Antihistamínicos", value: 200, percentage: "43%" },
    { name: "Antiinflamatorios", value: 25, percentage: "5%" },
    { name: "Gastroprotectores", value: 15, percentage: "3%" },
  ];
}

async function fetchMonthlyMovements(): Promise<MonthlyMovement[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    { month: "abr", entradas: 180, salidas: 120, stock: 500 },
    { month: "may", entradas: 220, salidas: 150, stock: 570 },
    { month: "jun", entradas: 150, salidas: 180, stock: 540 },
    { month: "jul", entradas: 250, salidas: 200, stock: 590 },
    { month: "ago", entradas: 200, salidas: 170, stock: 620 },
    { month: "sept", entradas: 280, salidas: 220, stock: 680 },
  ];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    categoryData: [],
    monthlyMovements: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      setError(null);
      const [categoryData, monthlyMovements] = await Promise.all([
        fetchCategoryData(),
        fetchMonthlyMovements(),
      ]);
      setData({ categoryData, monthlyMovements });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("No se pudieron cargar los datos del tablero.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return { data, loading, error, refreshData };
}
