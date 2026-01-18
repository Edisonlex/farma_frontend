import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

export interface PDFExportOptions {
  fileName: string;
  title?: string;
  columns: { header: string; dataKey: string }[] | string[];
  data: any[];
  orientation?: "portrait" | "landscape";
  companyInfo?: {
    name?: string;
  };
  filters?: Record<string, any>;
}

export const exportToPDF = (options: PDFExportOptions) => {
  const {
    fileName,
    title = "Reporte",
    columns,
    data,
    orientation = "landscape",
    companyInfo = { name: "Sistema Farmacéutico" },
    filters = {},
  } = options;

  const doc = new jsPDF(orientation);

  // Configuración
  const margin = 14;
  let yPos = 20;

  // 1. Encabezado / Título
  doc.setFontSize(18);
  doc.text(title, margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  if (companyInfo.name) {
    doc.text(companyInfo.name, margin, yPos);
    yPos += 6;
  }
  
  const dateStr = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generado: ${dateStr}`, margin, yPos);
  yPos += 10;

  // 2. Filtros (si existen)
  const filterKeys = Object.keys(filters);
  if (filterKeys.length > 0) {
    const hasActive = Object.values(filters).some((v) => v && v !== "all");
    if (hasActive) {
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text("Filtros aplicados:", margin, yPos);
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setTextColor(80);
      filterKeys.forEach((key) => {
        const val = filters[key];
        if (val && val !== "all") {
            const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
            doc.text(`- ${displayKey}: ${val}`, margin + 5, yPos);
            yPos += 5;
        }
      });
      yPos += 5;
    }
  }

  // 3. Tabla
  // Normalizar columnas para autoTable
  let tableHead: string[][] = [];
  let tableBody: any[][] = [];

  if (columns.length > 0 && typeof columns[0] === 'string') {
      // Caso simple: array de strings
      tableHead = [columns as string[]];
      // Asumimos que data es array de arrays o objetos que coinciden en orden
      tableBody = data.map(row => Object.values(row));
  } else {
      // Caso objetos { header, dataKey }
      const cols = columns as { header: string; dataKey: string }[];
      tableHead = [cols.map(c => c.header)];
      tableBody = data.map(row => cols.map(c => row[c.dataKey]));
  }

  autoTable(doc, {
    startY: yPos,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 2 },
    margin: { top: margin, left: margin, right: margin, bottom: margin },
  });

  // Guardar
  const finalName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  doc.save(finalName);
};
