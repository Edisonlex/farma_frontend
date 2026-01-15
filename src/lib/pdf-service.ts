import jsPDF from "jspdf";
import { Sale, Customer } from "@/context/sales-context";
import { InvoiceGenerator, InvoiceData } from "./pdf/generators/invoice-generator";
import { SalesReportGenerator } from "./pdf/generators/sales-report-generator";
import { CashReportGenerator, CashReportParams } from "./pdf/generators/cash-report-generator";

export type { InvoiceData } from "./pdf/generators/invoice-generator";
export type { CashReportParams } from "./pdf/generators/cash-report-generator";

export class PdfService {
  // Invoice Methods
  static generateInvoice(invoiceData: InvoiceData): jsPDF {
    return InvoiceGenerator.generate(invoiceData);
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

  // Sales Report Methods
  static generateSalesReport(sales: Sale[]): jsPDF {
    return SalesReportGenerator.generate(sales);
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

  // Cash Report Methods
  static generateCashReport(params: CashReportParams): jsPDF {
    return CashReportGenerator.generate(params);
  }

  static openCashReportInNewTab(params: CashReportParams): boolean {
    const pdf = this.generateCashReport(params);
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const win = window.open(pdfUrl, "_blank");
    return !!win;
  }

  static downloadCashReport(params: CashReportParams, filename: string) {
    const pdf = this.generateCashReport(params);
    pdf.save(filename);
  }
}

