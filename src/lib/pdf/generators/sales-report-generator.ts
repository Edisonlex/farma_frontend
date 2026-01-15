import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale } from "@/context/sales-context";

export class SalesReportGenerator {
  static generate(sales: Sale[]): jsPDF {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("REPORTE DE VENTAS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 105, 27, {
      align: "center",
    });

    const total = sales.reduce((s, v) => s + (v.total || 0), 0);
    const cash = sales
      .filter((s) => s.paymentMethod === "cash")
      .reduce((s, v) => s + (v.total || 0), 0);
    const card = sales
      .filter((s) => s.paymentMethod === "card")
      .reduce((s, v) => s + (v.total || 0), 0);
    const transfer = sales
      .filter((s) => s.paymentMethod === "transfer")
      .reduce((s, v) => s + (v.total || 0), 0);

    doc.setFontSize(12);
    doc.text(`Total ventas: $${total.toFixed(2)}`, 20, 40);
    doc.text(`Efectivo: $${cash.toFixed(2)}`, 20, 47);
    doc.text(`Tarjeta: $${card.toFixed(2)}`, 80, 47);
    doc.text(`Transferencia: $${transfer.toFixed(2)}`, 140, 47);

    autoTable(doc, {
      startY: 55,
      head: [["ID", "Cliente", "Items", "Total", "Método", "Fecha"]],
      body: sales.map((s) => [
        s.id,
        s.customer?.name || "Consumidor Final",
        String(s.items?.length || 0),
        `$${(s.total || 0).toFixed(2)}`,
        s.paymentMethod,
        new Date(s.date).toLocaleString("es-ES"),
      ]),
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    });
    return doc;
  }
}
