import React from 'react';
import * as XLSX from 'xlsx';

function downloadTemplate() {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
        ['CODIGO_PATRIMONIAL', 'DESCRIPCION', 'TRABAJADOR',
            'DEPENDENCIA', 'UBICACION', 'FECHA_COMPRA', 'FECHA_ALTA'],
        ['011110101012', 'ARADOS EN GENERAL', 'ROBERTO QUIROGA MUÑOZ',
            'SEDE ACOMAYO', 'OFICINA DE ALMACEN', '14/03/2012',
            '11/03/2011 00:00:00'],
        ['023342023430', 'SILLA GIRATORIA', 'ROBERTO QUIROGA MUÑOZ',
            'SEDE ACOMAYO', 'OFICINA ADMINISTRACION', '14/03/2012',
            '11/03/2011 00:00:00'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Crear hoja a partir del array
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla'); // Nombre que se le dará a la hoja dentro del libro.
    XLSX.writeFile(workbook, 'Plantilla_Ejemplo.xlsx'); // Guardar como archivo
}

const TemplateExcelComp = () => {
    return (
        <div>
            {/* Texto de descarga */}
            <p className='fw-bold text-dark' style={{ color: 'black' }}>
                Si no tiene la plantilla, puede descargar ejemplo de formato Excel haciendo click en{' '}
                <span
                    onClick={downloadTemplate}
                    style={{
                        color: '#007bff',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }} >
                    descargar aquí
                </span> o en <button className="btn btn-success btn-sm" onClick={downloadTemplate} >
                    Descargar plantilla Excel
                </button>
            </p>
        </div>
    )
}

export default TemplateExcelComp
