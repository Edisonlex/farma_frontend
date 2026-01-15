import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale } from "@/context/sales-context";

export interface CashReportParams {
  initialAmount: number;
  currentAmount: number;
  expectedCash: number;
  difference: number;
  dailyStats: {
    totalSales: number;
    totalTransactions: number;
    cashSales: number;
    cardSales: number;
    transferSales: number;
    returns: number;
  };
  sales: Sale[];
}

export class CashReportGenerator {
  static generate(params: CashReportParams): jsPDF {
    const {
      initialAmount,
      currentAmount,
      expectedCash,
      difference,
      dailyStats,
      sales,
    } = params;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("REPORTE DE CAJA", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 105, 27, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text(`Monto inicial: $${initialAmount.toFixed(2)}`, 20, 40);
    doc.text(`Monto contado: $${currentAmount.toFixed(2)}`, 20, 47);
    doc.text(`Monto esperado: $${expectedCash.toFixed(2)}`, 20, 54);
    doc.text(
      `Diferencia: ${difference >= 0 ? "+" : ""}$${difference.toFixed(2)}`,
      20,
      61
    );

    doc.text(`Ventas del día: $${dailyStats.totalSales.toFixed(2)}`, 120, 40);
    doc.text(`Transacciones: ${dailyStats.totalTransactions}`, 120, 47);
    doc.text(`Efectivo: $${dailyStats.cashSales.toFixed(2)}`, 120, 54);
    doc.text(`Tarjeta: $${dailyStats.cardSales.toFixed(2)}`, 120, 61);
    doc.text(`Transferencia: $${dailyStats.transferSales.toFixed(2)}`, 120, 68);
    doc.text(`Anuladas: $${dailyStats.returns.toFixed(2)}`, 120, 75);

    autoTable(doc, {
      startY: 85,
      head: [["ID", "Cliente", "Total", "Método", "Hora"]],
      body: sales.map((s) => [
        s.id,
        s.customer?.name || "Consumidor Final",
        `$${(s.total || 0).toFixed(2)}`,
        s.paymentMethod,
        new Date(s.date).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      ]),
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    });
    return doc;
  }
}
