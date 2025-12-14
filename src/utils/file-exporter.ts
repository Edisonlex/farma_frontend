import { jsPDF } from "jspdf";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ReportData } from "@/components/reports/report/types";

function formatDateSafe(value: any, pattern = "dd/MM/yyyy"): string {
  try {
    if (!value) return "N/A";
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "N/A";
    return format(d, pattern, { locale: es });
  } catch {
    return "N/A";
  }
}

export function generatePDF(data: ReportData, type: string) {
  // Crear instancia de jsPDF
  const landscapeTypes = [
    "inventory",
    "movements",
    "expiring",
    "expired",
    "low-stock",
    "alerts",
    "clients",
  ];
  const doc = new jsPDF(landscapeTypes.includes(type) ? "landscape" : "portrait");

  // Configuración inicial
  const margin = 20;
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - 2 * margin;

  // Agregar título
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Reporte de ${getReportTypeLabel(type)}`, margin, yPosition);
  yPosition += 10;

  // Información del reporte
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const infoLines = [
    `Generado el: ${formatDateSafe(data.generatedAt, "dd/MM/yyyy HH:mm")}`,
    data.dateRange.from && data.dateRange.to
      ? `Período: ${formatDateSafe(data.dateRange.from)} - ${formatDateSafe(
          data.dateRange.to
        )}`
      : null,
    data.category !== "all" ? `Categoría: ${data.category}` : null,
    data.supplier !== "all" ? `Proveedor: ${data.supplier}` : null,
    data.batch ? `Lote: ${data.batch}` : null,
    `Total de registros: ${data.totalItems}`,
  ].filter(Boolean) as string[];

  infoLines.forEach((line) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, margin, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Resumen para reportes de inventario
  if (data.summary) {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 7;

    const summaryLines = [
      data.summary.totalValue
        ? `Valor total del inventario: $${data.summary.totalValue.toFixed(2)}`
        : null,
      data.summary.lowStockCount !== undefined
        ? `Medicamentos con stock bajo: ${data.summary.lowStockCount}`
        : null,
      data.summary.expiringCount !== undefined
        ? `Medicamentos próximos a vencer: ${data.summary.expiringCount}`
        : null,
      data.summary.expiredCount !== undefined
        ? `Medicamentos vencidos: ${data.summary.expiredCount}`
        : null,
    ].filter(Boolean) as string[];

    summaryLines.forEach((line) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Preparar datos para la tabla
  let headers: string[] = [];
  let rows: any[] = [];

  if (
    type === "inventory" ||
    type === "expiring" ||
    type === "expired" ||
    type === "low-stock"
  ) {
    headers = [
      "Medicamento",
      "Lote",
      "Cantidad",
      "Stock Mín.",
      "Proveedor",
      "Categoría",
      "Vencimiento",
      "Precio",
      "Valor Total",
    ];

    data.data.forEach((med: any) => {
      const totalValue = med.quantity * med.price;
      rows.push([
        med.name,
        med.batch,
        String(med.quantity ?? ""),
        String(med.minStock ?? ""),
        med.supplier,
        med.category,
        formatDateSafe(med.expiryDate),
        `$${med.price.toFixed(2)}`,
        `$${totalValue.toFixed(2)}`,
      ]);
    });
  } else if (type === "movements") {
    headers = ["Medicamento", "Tipo", "Cantidad", "Fecha", "Razón", "Usuario"];

    data.data.forEach((mov: any) => {
      rows.push([
        mov.medicationName,
        mov.type,
        String(mov.quantity ?? ""),
        formatDateSafe(mov.date),
        mov.reason,
        mov.userName,
      ]);
    });
  } else if (type === "alerts") {
    headers = ["Tipo", "Medicamento", "Mensaje", "Severidad", "Fecha"];

    data.data.forEach((alert: any) => {
      rows.push([
        alert.type,
        alert.medicationName,
        alert.message,
        alert.severity,
        formatDateSafe(alert.date),
      ]);
    });
  } else if (type === "clients") {
    headers = [
      "Nombre",
      "Tipo",
      "Email",
      "Teléfono",
      "Compras",
      "Valor Total",
      "Última Compra",
    ];

    data.data.forEach((client: any) => {
      rows.push([
        client.name,
        client.type,
        client.email,
        client.phone,
        client.totalPurchases.toString(),
        `$${client.totalAmount.toFixed(2)}`,
        formatDateSafe(client.lastPurchase),
      ]);
    });
  } else if (type === "analytics") {
    // Para analytics, mostramos los datos como texto en lugar de tabla
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text("DATOS ANALÍTICOS:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 10;

    if (data.data && data.data.length > 0) {
      const analytics = data.data[0];
      Object.entries(analytics).forEach(([key, value]) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }

        const displayValue =
          typeof value === "number" && key.toLowerCase().includes("value")
            ? `$${value.toFixed(2)}`
            : value?.toString() || "";

        doc.text(`${key}: ${displayValue}`, margin, yPosition);
        yPosition += 7;
      });
    }

    // Guardar PDF para analytics (sin tabla)
    doc.save(`reporte-${type}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    return;
  }

  // Generar tabla manualmente si hay datos
  if (rows.length > 0) {
    // Agregar nueva página si es necesario antes de la tabla
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Calcular anchos de columnas
    const colCount = headers.length;
    const colWidth = contentWidth / colCount;

    // Dibujar encabezados de tabla
    doc.setFont("helvetica", "bold");
    doc.setFillColor(66, 139, 202); // Azul para encabezados
    doc.setTextColor(255, 255, 255);

    headers.forEach((header, i) => {
      doc.rect(margin + i * colWidth, yPosition, colWidth, 10, "F");
      const textWidth = doc.getTextWidth(header);
      const textX = margin + i * colWidth + (colWidth - textWidth) / 2;
      doc.text(header, textX, yPosition + 7);
    });

    yPosition += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    // Dibujar filas de datos
    rows.forEach((row, rowIndex) => {
      // Verificar si necesitamos una nueva página
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;

        // Redibujar encabezados en la nueva página
        doc.setFont("helvetica", "bold");
        doc.setFillColor(66, 139, 202);
        doc.setTextColor(255, 255, 255);

        headers.forEach((header, i) => {
          doc.rect(margin + i * colWidth, yPosition, colWidth, 10, "F");
          const textWidth = doc.getTextWidth(header);
          const textX = margin + i * colWidth + (colWidth - textWidth) / 2;
          doc.text(header, textX, yPosition + 7);
        });

        yPosition += 10;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }

      // Alternar colores de fila
      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        headers.forEach((_, i) => {
          doc.rect(margin + i * colWidth, yPosition, colWidth, 10, "F");
        });
      }

      // Dibujar datos de la fila
      row.forEach((cell: string, i: number) => {
        const textWidth = doc.getTextWidth(cell);
        const maxCellWidth = colWidth - 4; // Margen interno
        let displayText = cell;

        // Truncar texto si es demasiado largo
        if (textWidth > maxCellWidth) {
          const avgCharWidth = textWidth / cell.length;
          const maxChars = Math.floor(maxCellWidth / avgCharWidth) - 3;
          displayText = cell.substring(0, maxChars) + "...";
        }

        const textX = margin + i * colWidth + 2;
        doc.text(displayText, textX, yPosition + 7);
      });

      yPosition += 10;
    });
  }

  // Guardar y descargar el PDF
  doc.save(`reporte-${type}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}

function getReportTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    inventory: "Inventario General",
    movements: "Movimientos",
    expiring: "Próximos a Vencer",
    expired: "Vencidos",
    "low-stock": "Stock Bajo",
    analytics: "Análisis Predictivo",
    alerts: "Alertas",
    clients: "Clientes",
  };
  return labels[type] || type;
}

export function generateExcel(data: ReportData, type: string) {
  // Crear un nuevo libro de trabajo
  const workbook = utils.book_new();

  // Array para almacenar todas las filas del Excel
  const excelData: any[] = [];

  // 1. Título del reporte
  excelData.push([`Reporte de ${getReportTypeLabel(type)}`]);
  excelData.push([]); // Línea vacía

  // 2. Información del reporte
  excelData.push(["Información del Reporte"]);
  excelData.push([
    "Generado el:",
    formatDateSafe(data.generatedAt, "dd/MM/yyyy HH:mm"),
  ]);

  if (data.dateRange.from && data.dateRange.to) {
    excelData.push([
      "Período:",
      `${formatDateSafe(data.dateRange.from)} - ${formatDateSafe(
        data.dateRange.to
      )}`,
    ]);
  }

  if (data.category !== "all") {
    excelData.push(["Categoría:", data.category]);
  }

  if (data.supplier !== "all") {
    excelData.push(["Proveedor:", data.supplier]);
  }

  if (data.batch) {
    excelData.push(["Lote:", data.batch]);
  }

  excelData.push(["Total de registros:", data.totalItems]);
  excelData.push([]); // Línea vacía

  // 3. Resumen (solo para reportes de inventario)
  if (data.summary) {
    excelData.push(["RESUMEN"]);

    if (data.summary.totalValue) {
      excelData.push([
        "Valor total del inventario:",
        {
          v: data.summary.totalValue,
          t: "n",
          z: '"$"#,##0.00',
        },
      ]);
    }

    if (data.summary.lowStockCount !== undefined) {
      excelData.push([
        "Medicamentos con stock bajo:",
        data.summary.lowStockCount,
      ]);
    }

    if (data.summary.expiringCount !== undefined) {
      excelData.push([
        "Medicamentos próximos a vencer:",
        data.summary.expiringCount,
      ]);
    }

    if (data.summary.expiredCount !== undefined) {
      excelData.push(["Medicamentos vencidos:", data.summary.expiredCount]);
    }

    excelData.push([]); // Línea vacía
  }

  // 4. Encabezados de la tabla según el tipo de reporte
  let headers: string[] = [];

  if (
    type === "inventory" ||
    type === "expiring" ||
    type === "expired" ||
    type === "low-stock"
  ) {
    headers = [
      "Medicamento",
      "Lote",
      "Cantidad",
      "Stock Mínimo",
      "Proveedor",
      "Categoría",
      "Fecha Vencimiento",
      "Precio",
      "Valor Total",
    ];

    excelData.push(headers);

    // Datos de la tabla
    data.data.forEach((med: any) => {
      const totalValue = med.quantity * med.price;
      excelData.push([
        med.name,
        med.batch,
        med.quantity,
        med.minStock ?? "",
        med.supplier,
        med.category,
        formatDateSafe(med.expiryDate),
        {
          v: med.price,
          t: "n",
          z: '"$"#,##0.00',
        },
        {
          v: totalValue,
          t: "n",
          z: '"$"#,##0.00',
        },
      ]);
    });
  } else if (type === "movements") {
    headers = ["Medicamento", "Tipo", "Cantidad", "Fecha", "Razón", "Usuario"];

    excelData.push(headers);

    data.data.forEach((mov: any) => {
      excelData.push([
        mov.medicationName,
        mov.type,
        mov.quantity,
        formatDateSafe(mov.date),
        mov.reason,
        mov.userName,
      ]);
    });
  } else if (type === "alerts") {
    headers = ["Tipo", "Medicamento", "Mensaje", "Severidad", "Fecha"];

    excelData.push(headers);

    data.data.forEach((alert: any) => {
      excelData.push([
        alert.type,
        alert.medicationName,
        alert.message,
        alert.severity,
        formatDateSafe(alert.date),
      ]);
    });
  } else if (type === "clients") {
    headers = [
      "Nombre",
      "Tipo",
      "Email",
      "Teléfono",
      "Compras Totales",
      "Valor Total",
      "Última Compra",
    ];

    excelData.push(headers);

    data.data.forEach((client: any) => {
      excelData.push([
        client.name,
        client.type,
        client.email,
        client.phone,
        client.totalPurchases,
        {
          v: client.totalAmount,
          t: "n",
          z: '"$"#,##0.00',
        },
        formatDateSafe(client.lastPurchase),
      ]);
    });
  } else if (type === "analytics") {
    headers = ["Métrica", "Valor"];

    excelData.push(headers);

    if (data.data && data.data.length > 0) {
      Object.entries(data.data[0]).forEach(([key, value]) => {
        // Formatear valores monetarios
        const cellValue =
          typeof value === "number" && key.toLowerCase().includes("value")
            ? {
                v: value,
                t: "n",
                z: '"$"#,##0.00',
              }
            : value;

        excelData.push([key, cellValue]);
      });
    }
  }

  // Convertir el array de datos a una hoja de trabajo
  const worksheet = utils.aoa_to_sheet(excelData);

  // Ajustar el ancho de las columnas
  const colWidths = headers.map((_, colIndex) => {
    const maxWidth = excelData.reduce((max, row) => {
      const cellValue = row[colIndex];
      const cellLength = cellValue ? cellValue.toString().length : 0;
      return Math.max(max, cellLength);
    }, headers[colIndex].length);

    return { width: Math.min(maxWidth + 2, 50) }; // Ancho máximo de 50 caracteres
  });

  worksheet["!cols"] = colWidths;

  // Añadir la hoja al libro
  utils.book_append_sheet(workbook, worksheet, "Reporte");

  // Generar y descargar el archivo Excel
  writeFile(
    workbook,
    `reporte-${type}-${format(new Date(), "yyyy-MM-dd")}.xlsx`
  );
}


