import * as XLSX from "xlsx";

export interface ExcelExportOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
  headers?: string[];
  columnWidths?: number[];
  title?: string;
  filters?: Record<string, any>;
  companyInfo?: {
    name?: string;
    logo?: string;
  };
}

export const exportToExcel = (options: ExcelExportOptions) => {
  const {
    data,
    fileName,
    sheetName = "Datos",
    headers = [],
    columnWidths = [],
    title = "Reporte del Sistema",
    filters = {},
    companyInfo = { name: "Sistema Farmacéutico" },
  } = options;

  // Crear libro de trabajo
  const wb = XLSX.utils.book_new();

  // Crear datos para el Excel
  const excelData: any[][] = [];

  // 1. Encabezado de la empresa
  if (companyInfo.name) {
    excelData.push([companyInfo.name.toUpperCase()]);
    excelData.push([]);
  }

  // 2. Título principal
  excelData.push([title.toUpperCase()]);
  excelData.push([]);

  // 3. Metadatos del reporte
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
  excelData.push([]);

  // 4. Filtros aplicados (si existen)
  if (Object.keys(filters).length > 0) {
    const hasActiveFilters = Object.values(filters).some(
      (val) => val && val !== "all"
    );
    if (hasActiveFilters) {
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
              : JSON.stringify(value);

          excelData.push([displayKey, displayValue]);
        }
      });
      excelData.push([]);
    }
  }

  // 5. Encabezados de tabla
  // Si no se proporcionan headers, usar las claves del primer objeto
  const tableHeaders =
    headers.length > 0
      ? headers
      : data.length > 0
      ? Object.keys(data[0])
      : [];

  if (tableHeaders.length > 0) {
    excelData.push(tableHeaders);
  }

  // 6. Datos
  // Si se proporcionaron headers, intentamos mapear, si no, volcamos los valores
  if (headers.length > 0) {
    // Aquí asumimos que 'data' ya viene formateado o que el orden de headers coincide con las keys si no es un array de objetos simple
    // Para mayor flexibilidad, si data es array de objetos, intentamos alinear con headers si coinciden nombres, 
    // pero lo más seguro es que quien llame a esta función prepare la 'data' plana o coincidente.
    // Simplemente volcamos data si ya está procesada, o la procesamos si es objeto.
    
    data.forEach((item) => {
      if (Array.isArray(item)) {
        excelData.push(item);
      } else if (typeof item === 'object') {
        // Si es objeto, tratamos de extraer valores en el orden de headers (si headers son las keys)
        // O simplemente extraemos los valores
        excelData.push(Object.values(item));
      } else {
        excelData.push([item]);
      }
    });
  } else {
    // Sin headers explícitos, volcamos todo
    data.forEach((item) => {
        if (Array.isArray(item)) {
            excelData.push(item);
        } else if (typeof item === 'object') {
            excelData.push(Object.values(item));
        }
    });
  }

  // 7. Pie de página
  excelData.push([]);
  excelData.push([
    "Reporte generado automáticamente por el Sistema Farmacéutico",
  ]);

  // Crear hoja
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Anchos de columna
  if (columnWidths.length > 0) {
    ws["!cols"] = columnWidths.map((w) => ({ wch: w }));
  } else {
    // Auto-ajuste básico (muy simple)
    ws["!cols"] = tableHeaders.map(() => ({ wch: 20 }));
  }

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Nombre de archivo con fecha
  const dateStr = new Date().toISOString().split("T")[0];
  const finalFileName = fileName.endsWith(".xlsx")
    ? fileName
    : `${fileName}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, finalFileName);
};
