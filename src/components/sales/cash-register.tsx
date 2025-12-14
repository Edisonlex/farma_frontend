"use client";

import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(true);
  const [initialAmount, setInitialAmount] = useState(500.0);
  const [currentAmount, setCurrentAmount] = useState(1250.75);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

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

  const expectedCash =
    initialAmount + dailyStats.cashSales - dailyStats.returns;
  const difference = currentAmount - expectedCash;

  const closeCashRegister = () => {
    toast({
      title: "✅ Caja cerrada",
      description: "El cierre de caja se ha registrado exitosamente",
    });
    setIsOpen(false);
    setShowCloseDialog(false);
  };

  const openCashRegister = () => {
    setIsOpen(true);
    setInitialAmount(500.0);
    setCurrentAmount(500.0);
    toast({
      title: "🔓 Caja abierta",
      description: "Nueva jornada iniciada correctamente",
    });
  };

  const generateReport = () => {
    const ok = PdfService.openCashReportInNewTab({
      initialAmount,
      currentAmount,
      expectedCash,
      difference,
      dailyStats,
      sales: dailySales,
    });
    if (!ok) {
      PdfService.downloadCashReport({
        initialAmount,
        currentAmount,
        expectedCash,
        difference,
        dailyStats,
        sales: dailySales,
      }, "Reporte_Caja.pdf");
    }
    toast({ title: "📊 Reporte generado", description: "Reporte de caja listo" });
  };

  return (
    <div className="space-y-6">
      <CashRegisterStatus
        isOpen={isOpen}
        initialAmount={initialAmount}
        currentAmount={currentAmount}
        difference={difference}
      />

      <DailyStatsCards dailyStats={dailyStats} />

      <PaymentMethodsBreakdown dailyStats={dailyStats} />

      <CashRegisterActions
        isOpen={isOpen}
        initialAmount={initialAmount}
        currentAmount={currentAmount}
        setCurrentAmount={setCurrentAmount}
        expectedCash={expectedCash}
        difference={difference}
        showCloseDialog={showCloseDialog}
        setShowCloseDialog={setShowCloseDialog}
        onCloseCashRegister={closeCashRegister}
        onOpenCashRegister={openCashRegister}
        onGenerateReport={generateReport}
      />
    </div>
  );
}
