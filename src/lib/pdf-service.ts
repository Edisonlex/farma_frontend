import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale, Customer } from "@/context/sales-context";

export interface InvoiceData {
  sale: Sale;
  customer: Customer;
  invoiceNumber: string;
  businessInfo: {
    name: string;
    address: string;
    ruc: string;
    phone: string;
    email: string;
  };
}

export class PdfService {
  static generateInvoice(invoiceData: InvoiceData): jsPDF {
    const doc = new jsPDF({ compress: true });
    const { sale, customer, invoiceNumber, businessInfo } = invoiceData;

    // Encabezado
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("FACTURA", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`N°: ${invoiceNumber}`, 105, 28, { align: "center" });
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 105, 33, {
      align: "center",
    });

    // Información de la empresa
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(businessInfo.name, 20, 45);
    doc.setFontSize(10);
    doc.text(`RUC: ${businessInfo.ruc}`, 20, 52);
    doc.text(`Dirección: ${businessInfo.address}`, 20, 59);
    doc.text(`Teléfono: ${businessInfo.phone}`, 20, 66);
    doc.text(`Email: ${businessInfo.email}`, 20, 73);

    // Información del cliente
    const clientType = customer.document
      ? customer.document.length > 11
        ? "RUC"
        : "DNI"
      : "Consumidor Final";

    doc.setFontSize(12);
    doc.text("CLIENTE:", 20, 85);
    doc.setFontSize(10);
    doc.text(`Nombre: ${customer.name || "Consumidor Final"}`, 20, 92);
    if (customer.document) {
      doc.text(`Documento: ${customer.document} (${clientType})`, 20, 99);
    }
    if (customer.address) {
      doc.text(`Dirección: ${customer.address}`, 20, 106);
    }

    // Tabla de productos
    autoTable(doc, {
      startY: 115,
      head: [
        ["Cantidad", "Descripción", "P. Unitario", "Descuento", "Valor Total"],
      ],
      body: sale.items.map((item) => [
        item.quantity.toString(),
        item.name,
        `$${item.price.toFixed(2)}`,
        item.discount
          ? `-$${(item.discount * item.quantity).toFixed(2)}`
          : "$0.00",
        `$${(
          item.price * item.quantity -
          (item.discount || 0) * item.quantity
        ).toFixed(2)}`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
      },
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(10);
    doc.text(`Subtotal: $${sale.subtotal.toFixed(2)}`, 150, finalY);
    doc.text(`Descuento: -$${sale.discount.toFixed(2)}`, 150, finalY + 6);
    doc.text(`IVA (15%): $${sale.tax.toFixed(2)}`, 150, finalY + 12);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${sale.total.toFixed(2)}`, 150, finalY + 20);

    // Método de pago
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const paymentMethod =
      sale.paymentMethod === "cash"
        ? "Efectivo"
        : sale.paymentMethod === "card"
        ? "Tarjeta"
        : "Transferencia";
    doc.text(`Método de pago: ${paymentMethod}`, 20, finalY + 25);

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("¡Gracias por su compra!", 105, finalY + 40, { align: "center" });

    return doc;
  }

  static downloadInvoice(invoiceData: InvoiceData, filename: string) {
    const pdf = this.generateInvoice(invoiceData);
    pdf.save(filename);
  }

  static openInvoiceInNewTab(invoiceData: InvoiceData): boolean {
    const pdf = this.generateInvoice(invoiceData);
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const win = window.open(pdfUrl, "_blank");
    return !!win;
  }

  static generateSalesReport(sales: Sale[]): jsPDF {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("REPORTE DE VENTAS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 105, 27, { align: "center" });

    const total = sales.reduce((s, v) => s + (v.total || 0), 0);
    const cash = sales.filter((s) => s.paymentMethod === "cash").reduce((s, v) => s + (v.total || 0), 0);
    const card = sales.filter((s) => s.paymentMethod === "card").reduce((s, v) => s + (v.total || 0), 0);
    const transfer = sales.filter((s) => s.paymentMethod === "transfer").reduce((s, v) => s + (v.total || 0), 0);

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

  static openSalesReportInNewTab(sales: Sale[]): boolean {
    const pdf = this.generateSalesReport(sales);
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const win = window.open(pdfUrl, "_blank");
    return !!win;
  }

  static downloadSalesReport(sales: Sale[], filename: string) {
    const pdf = this.generateSalesReport(sales);
    pdf.save(filename);
  }

  static generateCashReport(params: {
    initialAmount: number;
    currentAmount: number;
    expectedCash: number;
    difference: number;
    dailyStats: { totalSales: number; totalTransactions: number; cashSales: number; cardSales: number; transferSales: number; returns: number };
    sales: Sale[];
  }): jsPDF {
    const { initialAmount, currentAmount, expectedCash, difference, dailyStats, sales } = params;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("REPORTE DE CAJA", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 105, 27, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Monto inicial: $${initialAmount.toFixed(2)}`, 20, 40);
    doc.text(`Monto contado: $${currentAmount.toFixed(2)}`, 20, 47);
    doc.text(`Monto esperado: $${expectedCash.toFixed(2)}`, 20, 54);
    doc.text(`Diferencia: ${difference >= 0 ? "+" : ""}$${difference.toFixed(2)}`, 20, 61);

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
        new Date(s.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      ]),
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    });
    return doc;
  }

  static openCashReportInNewTab(params: { initialAmount: number; currentAmount: number; expectedCash: number; difference: number; dailyStats: { totalSales: number; totalTransactions: number; cashSales: number; cardSales: number; transferSales: number; returns: number }; sales: Sale[] }): boolean {
    const pdf = this.generateCashReport(params);
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const win = window.open(pdfUrl, "_blank");
    return !!win;
  }

  static downloadCashReport(params: { initialAmount: number; currentAmount: number; expectedCash: number; difference: number; dailyStats: { totalSales: number; totalTransactions: number; cashSales: number; cardSales: number; transferSales: number; returns: number }; sales: Sale[] }, filename: string) {
    const pdf = this.generateCashReport(params);
    pdf.save(filename);
  }
}
