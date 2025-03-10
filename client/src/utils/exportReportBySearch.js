import { parseDate } from "./datesUtils";
import * as XLSX from 'xlsx';  // Importa la librería xlsx

// Función para mapear estado
const mapEstado = (estado) => {
    if (estado === 1) return "Registrado";
    if (estado === 0) return "No Registrado";
    return "Desconocido";
};

const mapDisposicion = (estado) => {
    if (estado === 1) return "Activo";
    if (estado === 0) return "de Baja";
    return "Desconocido";
};

export const exportarItems = (results1, estado, nombreHoja, nombreArchivo, searchTerm1, fechaFormateada) => {
    // Filtra los resultados según el estado proporcionado
    const filteredResults = estado !== undefined
        ? results1.filter(item => item.ESTADO === estado)  // Si hay estado, filtra por ese estado
        : results1;  // Si no se pasa estado, toma todos los items

    // Mapea los resultados filtrados
    const mappedResults = filteredResults.map(item => ({
        CODIGO_PATRIMONIAL: item.CODIGO_PATRIMONIAL,
        DESCRIPCION: item.DESCRIPCION,
        TRABAJADOR: item.TRABAJADOR,
        DEPENDENCIA: item.DEPENDENCIA,
        FECHA_COMPRA: item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra',
        FECHA_ALTA: item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra',
        FECHA_REGISTRO: parseDate(item.FECHA_REGISTRO),
        ESTADO: mapEstado(item.ESTADO),
        DISPOSICION: mapDisposicion(item.DISPOSICION),
        EST_CONSERVACION: item.EST_CONSERVACION,
        OBSERVACION: item.OBSERVACION || 'Sin observación'
    }));

    // Crea y exporta el archivo Excel
    const ws = XLSX.utils.json_to_sheet(mappedResults);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
    XLSX.writeFile(wb, `${nombreArchivo}_${searchTerm1.toUpperCase()}_${fechaFormateada}.xlsx`);
};
