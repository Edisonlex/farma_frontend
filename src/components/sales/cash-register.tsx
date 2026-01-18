"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSales } from "@/context/sales-context";
import { PdfService } from "@/lib/pdf-service";
import { CashRegisterStatus } from "./cash/cash-register-status";
import { DailyStatsCards } from "./cash/daily-stats-cards";
import { PaymentMethodsBreakdown } from "./cash/payment-methods-breakdown";
import { CashRegisterActions } from "./cash/cash-register-actions";


export function CashRegister() {
  const { toast } = useToast();
  const { getDailySales, getSalesTotal } = useSales();
  
  // Estado inicial con carga perezosa para localStorage
  const [isOpen, setIsOpen] = useState(false);
  const [initialAmount, setInitialAmount] = useState(0);
  const [countedAmount, setCountedAmount] = useState(0);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar estado al montar
  useEffect(() => {
    const storedIsOpen = localStorage.getItem("cash-register-is-open") === "true";
    const storedInitial = parseFloat(localStorage.getItem("cash-register-initial-amount") || "0");
    setIsOpen(storedIsOpen);
    setInitialAmount(storedInitial);
    setIsInitialized(true);
  }, []);

  // Persistir cambios
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cash-register-is-open", String(isOpen));
      localStorage.setItem("cash-register-initial-amount", String(initialAmount));
    }
  }, [isOpen, initialAmount, isInitialized]);

  // Obtener ventas del día y calcular totales
  const dailySales = getDailySales();
  const dailyTotals = getSalesTotal(dailySales);

  const dailyStats = {
    totalSales: dailyTotals.total,
    totalTransactions: dailySales.length,
    cashSales: dailyTotals.cash,
    cardSales: dailyTotals.card,
    transferSales: dailyTotals.transfer,
    returns: dailySales
      .filter((s) => s.status === "Anulada")
      .reduce((sum, sale) => sum + sale.total, 0),
  };

  // El dinero esperado en caja es: Inicial + Ventas Efectivo - Devoluciones (asumiendo devoluciones en efectivo)
  // Nota: Las devoluciones podrían ser de ventas con tarjeta, pero simplificamos asumiendo impacto en caja si se devuelve efectivo.
  // Ajuste: Si la venta anulada fue en efectivo, se resta. Si fue tarjeta, no afecta caja física.
  // Por simplicidad en este mock, restamos returns global, pero idealmente filtraríamos returns por método de pago original.
  const expectedCash = initialAmount + dailyStats.cashSales; 
  
  // Si estamos en el diálogo de cierre, la diferencia es (Contado - Esperado).
  // En el dashboard normal, mostramos la diferencia como 0 o proyección.
  // Para la vista principal, "Current Amount" será el Esperado por el sistema.
  const displayAmount = isOpen ? expectedCash : 0;
  
  // Diferencia dinámica basada en el input del usuario en el diálogo de cierre
  const closingDifference = countedAmount - expectedCash;

  const closeCashRegister = () => {
    toast({
      title: "✅ Caja cerrada",
      description: `Cierre registrado. Diferencia: $${closingDifference.toFixed(2)}`,
    });
    setIsOpen(false);
    setInitialAmount(0);
    setCountedAmount(0);
    setShowCloseDialog(false);
  };

  const openCashRegister = (amount: number) => {
    setIsOpen(true);
    setInitialAmount(amount); // Valor ingresado por el usuario
    setCountedAmount(0);
    toast({
      title: "🔓 Caja abierta",
      description: `Nueva jornada iniciada con base de $${amount.toFixed(2)}`,
    });
  };

  const generateReport = () => {
    const ok = PdfService.openCashReportInNewTab({
      initialAmount,
      currentAmount: isOpen ? expectedCash : countedAmount, // Si está abierta, reporte parcial con lo esperado
      expectedCash,
      difference: isOpen ? 0 : closingDifference,
      dailyStats,
      sales: dailySales,
    });
    if (!ok) {
      PdfService.downloadCashReport({
        initialAmount,
        currentAmount: isOpen ? expectedCash : countedAmount,
        expectedCash,
        difference: isOpen ? 0 : closingDifference,
        dailyStats,
        sales: dailySales,
      }, "Reporte_Caja.pdf");
    }
    toast({ title: "📊 Reporte generado", description: "Reporte de caja listo" });
  };

  if (!isInitialized) return null;

  return (
    <div className="space-y-6">
      <CashRegisterStatus
        isOpen={isOpen}
        initialAmount={initialAmount}
        currentAmount={displayAmount}
        difference={0} // En tiempo real no hay diferencia hasta el arqueo
      />

      <DailyStatsCards dailyStats={dailyStats} />

      <PaymentMethodsBreakdown dailyStats={dailyStats} />

      <CashRegisterActions
        isOpen={isOpen}
        initialAmount={initialAmount}
        currentAmount={countedAmount} // Para el input del diálogo
        setCurrentAmount={setCountedAmount} // Para actualizar el input
        expectedCash={expectedCash}
        difference={closingDifference}
        showCloseDialog={showCloseDialog}
        setShowCloseDialog={setShowCloseDialog}
        onCloseCashRegister={closeCashRegister}
        onOpenCashRegister={openCashRegister}
        onGenerateReport={generateReport}
      />
    </div>
  );
}
