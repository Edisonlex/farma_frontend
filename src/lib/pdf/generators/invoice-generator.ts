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

export class InvoiceGenerator {
  static generate(invoiceData: InvoiceData): jsPDF {
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
}
