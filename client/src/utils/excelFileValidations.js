/* FUNCTION to validate file format (xlsx) */
export const validateFile = (file, setProgress) => {
    if (!file) {
        alert('Por favor seleccionar un archivo.');
        document.querySelector('input[type="file"]').value = '';
        setProgress(0);
        return false;
    }

    // Validación por extensión y tipo MIME
    const validExtensions = ['.xlsx', '.xls'];
    // MIME Types oficiales de archivos Excel
    const validMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

    // Si la extensión y el MIME no coinciden, se rechaza el archivo
    if (
        !validExtensions.some(ext => file.name.endsWith(ext)) ||  // Verifica la extensión
        !validMimeTypes.includes(file.type)                       // Verifica el MIME
    ) {
        alert('Por favor, carga un archivo de formato Excel válido.');
        document.querySelector('input[type="file"]').value = '';
        setProgress(0);
        return false;
    }

    return true;
};

/* FUNCTION to read an excel file, converting data to binary and accepting dates in cell */
export const readWorkbook = (file, XLSX, onLoadCallback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary', cellDates: true });
        onLoadCallback(workbook);
    };
    reader.readAsArrayBuffer(file);
};

/* FUNCTION to validate if the file contains empty cells */
export const validateEmptyCells = (sheetData, expectedColumns, setErrorMessage, setShowModalButton) => {
    const invalidRows = sheetData.filter((row) =>
        expectedColumns.some((header) => !row[header] || row[header].toString().trim() === '')
    );

    if (invalidRows.length > 0) {
        setErrorMessage(`
            <strong>Existen celdas vacías en el archivo.</strong>
            <br>
            Por favor, completa todos los campos antes de enviarlo.`
        );
        setShowModalButton(true);
        return false;
    }

    setErrorMessage('');
    setShowModalButton(false);
    return true;
}

/* FUNCTION to validate headers according to the template */
export const validateHeaderColumns = (sheetData, expectedColumns, setErrorMessage, setShowModalButton) => {
    // const uploadedColumns = sheetData; // Headers
    const uploadedColumns = sheetData[0]; // Headers
    const missingColumns = expectedColumns.filter((col) => !uploadedColumns.includes(col));
    const extraColumns = uploadedColumns.filter((col) => !expectedColumns.includes(col));

    if (missingColumns.length > 0 || extraColumns.length > 0) {
        let error = 'El archivo no sigue el formato de campos requerido.<br>';
        if (missingColumns.length > 0) {
            error += `En su archivo faltan las columnas: <b>${missingColumns.join(', ')}</b>.<br>`;
        }
        if (extraColumns.length > 0) {
            error += `Su archivo contiene las columnas: <b>${extraColumns.join(', ')}</b>.`;
        }

        setErrorMessage(error);
        setShowModalButton(true);
        return false;
    }

    setErrorMessage('');
    setShowModalButton(false);
    return true;
}


/* FUNCTION to validate PATRIMONIAL_CODES (numeric and only 12 characters) */
export const validatePatrimonialCodes = (sheetData, setErrorMessage, setShowModalButton) => {
    const headers = sheetData[0]; // Primera fila como encabezados
    const patrimonialIndex = headers.indexOf('CODIGO_PATRIMONIAL'); // Index - "CODIGO_PATRIMONIAL"

    if (patrimonialIndex === -1) return true; // No hay columna, pasa la validación.

    const invalidRows = sheetData.slice(1).filter((row) => {
        const value = row[patrimonialIndex];
        return (!/^\d{12}$/.test(value)); // Solo números y solo de 12 dígitos
    });

    if (invalidRows.length > 0) {
        setErrorMessage(`
        La columna <strong>CODIGO_PATRIMONIAL</strong> contiene errores:
        <ul>
        ${invalidRows
                .map(
                    (row, idx) =>
                        `<li>Fila ${idx + 2}: Código inválido (<strong>${row[patrimonialIndex] || 'vacío'
                        }</strong>)</li>`
                )
                .join('')}
        </ul>
        Asegúrate de que los códigos sean numéricos y sean de 12 dígitos.
        `);
        setShowModalButton(true);
        return false;
    }
    return true;
}

/* FUNCTION to validate the date values and typo */
export const validateDateColumns = (sheetData, setErrorMessage, setShowModalButton) => {
    const headers = sheetData[0]; // Get headers
    const dateColumns = ['FECHA_COMPRA', 'FECHA_ALTA']; // Columns to check
    const invalidRows = [];

    // Define regex patterns (expresiones regulares)
    const datePattern1 = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // dd/mm/yyyy
    const datePattern2 = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // yyyy-mm-dd
    const dateTimePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} \d{2}:\d{2}:\d{2}$/; // dd/mm/yyyy hh:mm:ss

    dateColumns.forEach((col) => {
        const dateIndex = headers.indexOf(col);
        if (dateIndex === -1) return; // If column doesn't exist, skip

        sheetData.slice(1).forEach((row, rowIndex) => {
            let value = row[dateIndex];

            // 🛠 Convert Excel date objects to dd/mm/yyyy format
            if (value instanceof Date) {
                const day = String(value.getDate()).padStart(2, '0');
                const month = String(value.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
                const year = value.getFullYear();
                value = `${day}/${month}/${year}`;
            } else {
                value = String(value || '').trim();
            }

            if (
                value && // Not empty
                !datePattern1.test(value) &&
                !datePattern2.test(value) &&
                !dateTimePattern.test(value)
            ) {
                invalidRows.push({
                    rowNumber: rowIndex + 2, // Adjust for header row
                    column: col,
                    value: value || 'empty',
                });
            }
        });
    });

    if (invalidRows.length > 0) {
        setErrorMessage(`
        <strong>Invalid dates found:</strong>
        <ul>
            ${invalidRows
                .map(
                    ({ rowNumber, column, value }) =>
                        `<li>Row ${rowNumber}, Column <strong>${column}</strong>: Invalid value (<strong>${value}</strong>)</li>`
                )
                .join('')}
        </ul>
        Please use valid formats: <strong>dd/mm/yyyy</strong>, <strong>yyyy-mm-dd</strong> or <strong>dd/mm/yyyy hh:mm:ss</strong>.
        `);
        setShowModalButton(true);
        return false;
    }
    return true;
};
