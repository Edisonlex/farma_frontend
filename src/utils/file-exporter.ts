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

function getFieldLegend(type: string): string[] {
  switch (type) {
    case "inventory":
      return [
        "Medicamento: nombre comercial del producto",
        "Lote: número de lote del fabricante",
        "Cantidad: unidades disponibles en inventario",
        "Stock Mín.: nivel mínimo recomendado",
        "Proveedor: empresa proveedora",
        "Categoría: clasificación del medicamento",
        "Vencimiento: fecha de expiración",
        "Precio: costo unitario",
        "Valor Total: precio x cantidad",
      ];
    case "movements":
      return [
        "Medicamento: producto afectado",
        "Tipo: entrada/salida/ajuste",
        "Cantidad: unidades movidas",
        "Fecha: momento del movimiento",
        "Razón: motivo del movimiento",
        "Usuario: quién registró",
      ];
    case "alerts":
      return [
        "Tipo: categoría de la alerta",
        "Medicamento: producto asociado",
        "Mensaje: detalle del evento",
        "Severidad: nivel de importancia",
        "Fecha: momento de generación",
      ];
    case "clients":
      return [
        "Nombre: nombre del cliente",
        "Tipo: particular/empresa/institución",
        "Email: correo de contacto",
        "Teléfono: número de contacto",
        "Compras: total de transacciones",
        "Valor Total: monto acumulado",
        "Última Compra: fecha más reciente",
      ];
    case "suppliers":
      return [
        "Nombre: nombre del proveedor",
        "Razón Social: nombre legal registrado",
        "RUC/ID: documento tributario o cédula",
        "Teléfono: contacto telefónico",
        "Email: correo de contacto",
      ];
    case "analytics":
      return [
        "Inventario: número de medicamentos",
        "Valor total: suma del valor del inventario",
        "Movimientos: total de entradas/salidas registradas",
        "Alertas: total de alertas activas/registradas",
        "Clientes: número total de clientes",
      ];
    default:
      return [];
  }
}

function getHeadersForType(type: string): string[] {
  switch (type) {
    case "inventory":
      return [
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
    case "movements":
      return ["Medicamento", "Tipo", "Cantidad", "Fecha", "Razón", "Usuario"];
    case "alerts":
      return ["Tipo", "Medicamento", "Mensaje", "Severidad", "Fecha"];
    case "clients":
      return [
        "Nombre",
        "Tipo",
        "Email",
        "Teléfono",
        "Compras Totales",
        "Valor Total",
        "Última Compra",
      ];
    case "suppliers":
      return ["Nombre", "Razón Social", "RUC/ID", "Teléfono", "Email"];
    default:
      return [];
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
  const doc = new jsPDF(
    landscapeTypes.includes(type) ? "landscape" : "portrait",
  );

  // Configuración inicial
  const margin = 20;
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - 2 * margin;
  const headerColor = { r: 30, g: 64, b: 175 }; // Azul primario del sistema

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
          data.dateRange.to,
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

  // Se omite la leyenda en PDF según solicitud del usuario

  // Encabezado de tabla se renderizará justo antes de filas

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
      const nameVal = mov?.medicationName ?? mov?.name ?? "";
      const typeVal = mov?.type ?? "";
      const qtyVal = String(mov?.quantity ?? "");
      const dateVal = formatDateSafe(mov?.date);
      const reasonVal = mov?.reason ?? "";
      const userVal = mov?.userName ?? "";
      rows.push([nameVal, typeVal, qtyVal, dateVal, reasonVal, userVal]);
    });
  } else if (type === "alerts") {
    headers = ["Tipo", "Medicamento", "Mensaje", "Severidad", "Fecha"];

    data.data.forEach((alert: any) => {
      const typeVal = alert?.type ?? "";
      const medVal = alert?.medicationName ?? "";
      const msgVal = alert?.message ?? "";
      const sevVal = alert?.severity ?? "";
      const dateVal = formatDateSafe(alert?.date);
      rows.push([typeVal, medVal, msgVal, sevVal, dateVal]);
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
      const nameVal = client?.name ?? "";
      const typeVal = client?.type ?? "";
      const emailVal = client?.email ?? "";
      const phoneVal = client?.phone ?? "";
      const purchasesVal = client?.totalPurchases ?? 0;
      const amountVal = client?.totalAmount ?? 0;
      const lastVal = formatDateSafe(client?.lastPurchase);
      rows.push([
        nameVal,
        typeVal,
        emailVal,
        phoneVal,
        String(purchasesVal),
        `$${Number(amountVal).toFixed(2)}`,
        lastVal,
      ]);
    });
  } else if (type === "suppliers") {
    headers = ["Nombre", "Razón Social", "RUC/ID", "Teléfono", "Email"];

    data.data.forEach((supplier: any) => {
      rows.push([
        supplier.name,
        supplier.razonSocial,
        supplier.ruc || supplier.cedula || "N/A",
        supplier.phone || "N/A",
        supplier.email || "N/A",
      ]);
    });
  } else if (type === "analytics") {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, yPosition, contentWidth, 10, "F");
    doc.text("Métrica", margin + 2, yPosition + 7);
    const rightHeader = "Valor";
    const rightW = contentWidth * 0.4;
    const rightX = margin + contentWidth - rightW;
    const tW = doc.getTextWidth(rightHeader);
    doc.text(rightHeader, rightX + Math.max(2, rightW - tW - 2), yPosition + 7);

    yPosition += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const metrics: Array<[string, string]> = [];
    if (data.data && data.data.length > 0) {
      const a: any = data.data[0] || {};
      metrics.push(["Inventario", String(a.inventory ?? 0)]);
      metrics.push(["Valor Total", `$${Number(a.totalValue ?? 0).toFixed(2)}`]);
      metrics.push(["Movimientos", String(a.movements ?? 0)]);
      metrics.push(["Alertas", String(a.alerts ?? 0)]);
      metrics.push(["Clientes", String(a.clients ?? 0)]);
    }

    metrics.forEach((row, idx) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
        doc.setTextColor(255, 255, 255);
        doc.rect(margin, yPosition, contentWidth, 10, "F");
        doc.text("Métrica", margin + 2, yPosition + 7);
        const tW2 = doc.getTextWidth(rightHeader);
        doc.text(rightHeader, rightX + Math.max(2, rightW - tW2 - 2), yPosition + 7);
        yPosition += 10;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }

      if (idx % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPosition, contentWidth, 10, "F");
      }

      const label = row[0];
      const value = row[1];
      doc.text(label, margin + 2, yPosition + 7);
      const vW = doc.getTextWidth(value);
      doc.text(value, margin + contentWidth - 2 - vW, yPosition + 7);
      yPosition += 10;
    });
  }

  // Generar tabla manualmente si hay datos
  if (rows.length > 0) {
    // Agregar nueva página si es necesario antes de la tabla
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Calcular anchos de columnas
    // Ajustar columnas: Primera columna (Nombre) más ancha
    const colCount = headers.length;
    let colWidths: number[] = [];

    // Definir anchos relativos
    if (
      type === "inventory" ||
      type === "expiring" ||
      type === "expired" ||
      type === "low-stock"
    ) {
      // Ajuste para evitar cortes: más espacio a Precio y Valor Total
      // Medicamento (26%), Lote (10%), Cant (9%), StockMin (8%), Prov (10%), Cat (9%), Venc (10%), Precio (8%), Total (10%)
      const unit = contentWidth / 100;
      colWidths = [26, 10, 9, 8, 10, 9, 10, 8, 10].map((p) => p * unit);
    } else if (type === "movements") {
      // Ajuste: reducir Medicamento y ampliar Usuario para mayor legibilidad
      // Medicamento (30%), Tipo (10%), Cant (10%), Fecha (15%), Razón (20%), Usuario (15%)
      const unit = contentWidth / 100;
      colWidths = [30, 10, 10, 15, 20, 15].map((p) => p * unit);
    } else if (type === "alerts") {
      // Tipo (15%), Medicamento (25%), Mensaje (35%), Severidad (10%), Fecha (15%)
      const unit = contentWidth / 100;
      colWidths = [15, 25, 35, 10, 15].map((p) => p * unit);
    } else if (type === "clients") {
      // Nombre (30%), Tipo (10%), Email (20%), Teléfono (10%), Compras (8%), Total (10%), Última (12%)
      const unit = contentWidth / 100;
      colWidths = [30, 10, 20, 10, 8, 10, 12].map((p) => p * unit);
    } else if (type === "suppliers") {
      // Nombre (25%), Razón Social (25%), RUC/ID (15%), Teléfono (15%), Email (20%)
      const unit = contentWidth / 100;
      colWidths = [25, 25, 15, 15, 20].map((p) => p * unit);
    } else {
      // Distribución equitativa por defecto
      const colWidth = contentWidth / colCount;
      colWidths = new Array(colCount).fill(colWidth);
    }

    // Dibujar encabezado continuo de tabla y títulos por columna
    doc.setFont("helvetica", "bold");
    doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
    doc.setTextColor(255, 255, 255);

    // Banda continua
    doc.rect(margin, yPosition, contentWidth, 10, "F");

    // Títulos por columna
    let headerX = margin;
    headers.forEach((header, i) => {
      const width = colWidths[i];
      const label = header || "—";
      const textWidth = doc.getTextWidth(label);
      const textX =
        i === 0 ? headerX + 2 : headerX + Math.max(2, (width - textWidth) / 2);
      doc.text(label, textX, yPosition + 7);
      headerX += width;
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

        // Redibujar encabezado continuo en la nueva página
        doc.setFont("helvetica", "bold");
        doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
        doc.setTextColor(255, 255, 255);

        doc.rect(margin, yPosition, contentWidth, 10, "F");
        let hX = margin;
        headers.forEach((header, i) => {
          const width = colWidths[i];
          const label = header || "—";
          const textWidth = doc.getTextWidth(label);
          const textX =
            i === 0 ? hX + 2 : hX + Math.max(2, (width - textWidth) / 2);
          doc.text(label, textX, yPosition + 7);
          hX += width;
        });

        yPosition += 10;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }

      // Alternar colores de fila
      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        let rX = margin;
        headers.forEach((_, i) => {
          const width = colWidths[i];
          doc.rect(rX, yPosition, width, 10, "F");
          rX += width;
        });
      }

      // Dibujar datos de la fila
      let cX = margin;
      row.forEach((cell: string, i: number) => {
        const width = colWidths[i];
        const cellValue =
          cell !== undefined && cell !== null ? String(cell) : "";
        const maxCellWidth = width - 4; // Margen interno

        // Ajuste de fuente y encaje: negrita para primera columna y shrink-to-fit
        let fontSize = 10;
        if (i === 0) {
          doc.setFont("helvetica", "bold");
          fontSize = cellValue.length > 25 ? 9 : 10;
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.setFontSize(fontSize);

        let displayText = cellValue;
        let textWidth = doc.getTextWidth(displayText);
        while (textWidth > maxCellWidth && fontSize > 8) {
          fontSize -= 1;
          doc.setFontSize(fontSize);
          textWidth = doc.getTextWidth(displayText);
        }
        if (textWidth > maxCellWidth) {
          const avgCharWidth = textWidth / Math.max(1, displayText.length);
          const maxChars = Math.max(
            0,
            Math.floor(maxCellWidth / avgCharWidth) - 3,
          );
          displayText = displayText.substring(0, maxChars) + "...";
          textWidth = doc.getTextWidth(displayText);
        }

        // Alinear texto: izquierda para primera, derecha para numéricas, centro para otros
        const rightAlignHeaders = new Set([
          "Cantidad",
          "Stock Mín.",
          "Precio",
          "Valor Total",
          "Compras",
        ]);
        let textX;
        if (i === 0) {
          textX = cX + 2;
        } else if (rightAlignHeaders.has(headers[i])) {
          textX = cX + width - 2 - textWidth;
        } else {
          textX = cX + Math.max(2, (width - textWidth) / 2);
        }

        doc.text(displayText, textX, yPosition + 7);
        cX += width;
      });

      // Restaurar fuente base para siguiente fila
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

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
    suppliers: "Proveedores",
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
        data.dateRange.to,
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

  // 3.5 Leyenda de campos
  const excelLegend = getFieldLegend(type);
  if (excelLegend.length > 0) {
    excelData.push(["LEYENDA DE CAMPOS"]);
    excelLegend.forEach((line) => {
      excelData.push(["•", line]);
    });
    excelData.push([]);
  }

  // Encabezados en Excel se muestran como primera fila de la tabla (ya implementado)

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
        alert.medicationName || "N/A",
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
  } else if (type === "suppliers") {
    headers = ["Nombre", "Razón Social", "RUC/ID", "Teléfono", "Email"];

    excelData.push(headers);

    data.data.forEach((supplier: any) => {
      excelData.push([
        supplier.name,
        supplier.razonSocial,
        supplier.ruc || supplier.cedula || "N/A",
        supplier.phone || "N/A",
        supplier.email || "N/A",
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
      let cellValue: any = row[colIndex];
      if (cellValue && typeof cellValue === "object" && "v" in cellValue) {
        cellValue = cellValue.v;
      }
      const cellLength =
        cellValue !== undefined && cellValue !== null
          ? String(cellValue).length
          : 0;
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
    `reporte-${type}-${format(new Date(), "yyyy-MM-dd")}.xlsx`,
  );
}
