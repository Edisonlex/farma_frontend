import * as XLSX from "xlsx";

export interface ExcelExportOptions {
  data: any[];
  fileName: string;
  sheetName: string;
  headers: string[];
  columnWidths?: number[];
  title?: string;
  filters?: Record<string, any>;
  companyInfo?: {
    name?: string;
    logo?: string;
  };
}

// Estilos para Excel (simulados ya que xlsx no soporta estilos CSS reales)
const EXCEL_STYLES = {
  TITLE: {
    font: { bold: true, size: 16, color: { rgb: "2C3E50" } },
    fill: { fgColor: { rgb: "ECF0F1" } },
    alignment: { horizontal: "center" as const, vertical: "center" as const },
  },
  HEADER: {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "3498DB" } },
    alignment: { horizontal: "center" as const },
  },
  SUBTITLE: {
    font: { bold: true, color: { rgb: "7F8C8D" } },
    alignment: { horizontal: "left" as const },
  },
  FILTER_HEADER: {
    font: { bold: true, color: { rgb: "2C3E50" } },
    fill: { fgColor: { rgb: "BDC3C7" } },
  },
  SUCCESS: {
    font: { color: { rgb: "27AE60" } },
  },
  WARNING: {
    font: { color: { rgb: "F39C12" } },
  },
  ERROR: {
    font: { color: { rgb: "E74C3C" } },
  },
  BORDER: {
    top: { style: "thin" as const, color: { rgb: "BDC3C7" } },
    bottom: { style: "thin" as const, color: { rgb: "BDC3C7" } },
    left: { style: "thin" as const, color: { rgb: "BDC3C7" } },
    right: { style: "thin" as const, color: { rgb: "BDC3C7" } },
  },
};

export const exportToExcel = (options: ExcelExportOptions) => {
  const {
    data,
    fileName,
    sheetName,
    headers,
    columnWidths = [],
    title = "Reporte del Sistema",
    filters = {},
    companyInfo = {},
  } = options;

  // Crear libro de trabajo
  const wb = XLSX.utils.book_new();

  // Crear datos para el Excel con formato mejorado
  const excelData = [];

  // Encabezado de la empresa
  if (companyInfo.name) {
    excelData.push([companyInfo.name.toUpperCase()]);
    excelData.push([]);
  }

  // Título principal
  excelData.push([title.toUpperCase()]);
  excelData.push([]);

  // Información de metadatos
  excelData.push(["INFORMACIÓN DEL REPORTE"]);
  excelData.push([
    "Fecha de generación",
    new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  ]);
  excelData.push([
    "Hora de generación",
    new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  ]);
  excelData.push(["Total de registros", data.length]);
  excelData.push(["Usuario del sistema", "Sistema de Inventario"]);
  excelData.push([]);

  // Información de filtros aplicados
  if (Object.keys(filters).length > 0) {
    excelData.push(["FILTROS APLICADOS"]);
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        const displayKey =
          key.charAt(0).toUpperCase() +
          key
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .replace(/search/i, "Búsqueda")
            .replace(/type/i, "Tipo")
            .replace(/daterange/i, "Período");

        const displayValue =
          typeof value === "string"
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : value;

        excelData.push([displayKey, displayValue]);
      }
    });
    excelData.push([]);
  }

  // Resumen estadístico (si hay datos)
  if (data.length > 0) {
    excelData.push(["RESUMEN ESTADÍSTICO"]);

    // Calcular estadísticas básicas
    const entradas = data.filter((item: any) => item.tipo === "Entrada").length;
    const salidas = data.filter((item: any) => item.tipo === "Salida").length;
    const ajustes = data.filter((item: any) => item.tipo === "Ajuste").length;

    excelData.push(["Total entradas", entradas]);
    excelData.push(["Total salidas", salidas]);
    excelData.push(["Total ajustes", ajustes]);

    if (data.some((item: any) => item.cantidad)) {
      const totalCantidad = data.reduce(
        (sum: number, item: any) => sum + (Number(item.cantidad) || 0),
        0
      );
      excelData.push(["Cantidad total movida", totalCantidad]);
    }

    excelData.push([]);
  }

  // Separador antes de los datos
  excelData.push(["DETALLE DE MOVIMIENTOS"]);
  excelData.push([]);

  // Encabezados de columnas
  excelData.push(headers);

  // Datos con formato aplicado
  data.forEach((item) => {
    const row = headers.map((header) => {
      // Mapeo mejorado de headers a propiedades
      const keyMap: Record<string, string> = {
        Medicamento: "medicamento",
        Tipo: "tipo",
        Cantidad: "cantidad",
        Motivo: "motivo",
        Usuario: "usuario",
        Fecha: "fecha",
        Hora: "hora",
      };

      const key =
        keyMap[header] ||
        header
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "_");

      return item[key] || item[header] || "";
    });
    excelData.push(row);
  });

  // Pie de página
  excelData.push([]);
  excelData.push([]);
  excelData.push([
    "Este reporte fue generado automáticamente por el Sistema de Gestión de Inventario",
  ]);
  excelData.push([
    `© ${new Date().getFullYear()} - Todos los derechos reservados`,
  ]);

  // Crear hoja de trabajo
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Aplicar anchos de columnas optimizados
  const finalColumnWidths =
    columnWidths.length > 0 ? columnWidths : headers.map(() => 20); // Ancho por defecto

  ws["!cols"] = finalColumnWidths.map((width) => ({ wch: width }));

  // Agregar hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generar archivo con nombre mejorado
  const formattedDate = new Date()
    .toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");

  const formattedTime = new Date()
    .toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/:/g, "-");

  const finalFileName = `${fileName}_${formattedDate}_${formattedTime}.xlsx`;

  XLSX.writeFile(wb, finalFileName);
};

// Función específica para movimientos de inventario con diseño mejorado
export const exportInventoryMovements = (
  movements: any[],
  filters: any = {}
) => {
  const headers = [
    "Medicamento",
    "Tipo",
    "Cantidad",
    "Motivo",
    "Usuario",
    "Fecha",
    "Hora",
  ];
  const columnWidths = [35, 15, 15, 40, 25, 15, 12];

  // Procesar datos con formato mejorado
  const data = movements.map((movement) => {
    const tipo = movement.type.charAt(0).toUpperCase() + movement.type.slice(1);
    const cantidad = movement.quantity;

    return {
      medicamento: movement.medicationName,
      tipo: tipo,
      cantidad: cantidad,
      motivo: movement.reason,
      usuario: movement.userName,
      fecha: movement.date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      hora: movement.date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });

  exportToExcel({
    data,
    fileName: "Reporte_Movimientos_Inventario",
    sheetName: "Movimientos",
    headers,
    columnWidths,
    title: "Reporte Detallado de Movimientos de Inventario",
    filters,
    companyInfo: {
      name: "Sistema de Gestión Farmacéutica",
    },
  });
};

export const exportSalesReport = (sales: any[], filters: any = {}) => {
  const headers = [
    "ID Venta",
    "Cliente",
    "Items",
    "Total",
    "Método",
    "Fecha",
    "Hora",
  ];
  const columnWidths = [15, 30, 10, 15, 15, 15, 12];

  const data = sales.map((sale) => ({
    id_venta: sale.id,
    cliente: sale.customer?.name || "Consumidor Final",
    items: sale.items?.length || 0,
    total: sale.total,
    metodo: sale.paymentMethod,
    fecha: new Date(sale.date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    hora: new Date(sale.date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  exportToExcel({
    data,
    fileName: "Reporte_Ventas",
    sheetName: "Ventas",
    headers,
    columnWidths,
    title: "Reporte de Ventas",
    filters,
    companyInfo: { name: "Sistema de Gestión Farmacéutica" },
  });
};

// Función adicional para reporte ejecutivo resumido
export const exportInventorySummary = (movements: any[]) => {
  const entradas = movements.filter((m) => m.type === "entrada");
  const salidas = movements.filter((m) => m.type === "salida");

  const data = [
    {
      categoria: "ENTRADAS",
      cantidad: entradas.length,
      total_unidades: entradas.reduce((sum, m) => sum + m.quantity, 0),
      valor_promedio: entradas.length
        ? (
            entradas.reduce((sum, m) => sum + m.quantity, 0) / entradas.length
          ).toFixed(2)
        : 0,
    },
    {
      categoria: "SALIDAS",
      cantidad: salidas.length,
      total_unidades: salidas.reduce((sum, m) => sum + m.quantity, 0),
      valor_promedio: salidas.length
        ? (
            salidas.reduce((sum, m) => sum + m.quantity, 0) / salidas.length
          ).toFixed(2)
        : 0,
    },
    {
      categoria: "TOTAL",
      cantidad: movements.length,
      total_unidades: movements.reduce((sum, m) => sum + m.quantity, 0),
      valor_promedio: movements.length
        ? (
            movements.reduce((sum, m) => sum + m.quantity, 0) / movements.length
          ).toFixed(2)
        : 0,
    },
  ];

  exportToExcel({
    data,
    fileName: "Resumen_Ejecutivo_Inventario",
    sheetName: "Resumen",
    headers: [
      "Categoría",
      "Cantidad de Movimientos",
      "Total de Unidades",
      "Promedio por Movimiento",
    ],
    columnWidths: [25, 25, 25, 25],
    title: "Resumen Ejecutivo de Movimientos de Inventario",
    companyInfo: {
      name: "Sistema de Gestión Farmacéutica - Reporte Ejecutivo",
    },
  });
};
