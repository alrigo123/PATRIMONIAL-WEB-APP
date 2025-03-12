export const validatePatrimonialCodes = (sheetData, setErrorMessage, setShowModalButton) => {
    const headers = sheetData[0]; // Primera fila como encabezados
    const patrimonialIndex = headers.indexOf('CODIGO_PATRIMONIAL');

    if (patrimonialIndex === -1) return true; // No hay columna, pasa la validación.

    const invalidRows = sheetData.slice(1).filter((row) => {
        const value = row[patrimonialIndex];
        return (
            !/^\d{1,12}$/.test(value) // Solo números y máximo 12 dígitos
        );
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
        Asegúrate de que los códigos sean numéricos y tengan máximo 12 dígitos.
      `);
        setShowModalButton(true);
        return false;
    }

    return true;
}

//function to get an user by user 
export const validateDateColumns = (sheetData, setErrorMessage, setShowModalButton) => {
    const headers = sheetData[0]; // Primera fila como encabezados
    const dateColumns = ['FECHA_COMPRA', 'FECHA_ALTA']; // Columnas a validar

    const invalidRows = [];

    dateColumns.forEach((col) => {
        const dateIndex = headers.indexOf(col);

        if (dateIndex === -1) return; // Si no existe la columna, continuar con la siguiente.

        // Validar las filas
        sheetData.slice(1).forEach((row, rowIndex) => {
            const value = row[dateIndex];
            if (
                value && // Verificar que no esté vacío
                !/^(?:\d{4}[-/]\d{2}[-/]\d{2}(?: \d{2}:\d{2}:\d{2})?|\d{2}[-/]\d{2}[-/]\d{4}(?: \d{2}:\d{2}:\d{2})?)$/.test(value) // Formatos permitidos
            ) {
                invalidRows.push({
                    rowNumber: rowIndex + 2, // Ajuste para contar desde 2 por los encabezados
                    column: col,
                    value: value || 'vacío',
                });
            }
        });
    });

    if (invalidRows.length > 0) {
        setErrorMessage(`
        <strong>Errores encontrados en las columnas de fechas:</strong>
        <ul>
          ${invalidRows
                .map(
                    ({ rowNumber, column, value }) =>
                        `<li>Fila ${rowNumber}, Columna <strong>${column}</strong>: Valor inválido (<strong>${value}</strong>)</li>`
                )
                .join('')}
        </ul>
        Asegúrate de usar formatos válidos como <strong>dd/mm/aaaa</strong>, <strong>yyyy-mm-dd</strong> o <strong>dd/mm/aaaa hh:mm:ss</strong>.
      `);
        setShowModalButton(true);
        return false;
    }

    return true;
}

export const validateHeaderColumns = (sheetData, expectedColumns, setErrorMessage, setShowModalButton) => {
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

export const validateEmptyCells = (data, expectedColumns, setErrorMessage, setShowModalButton) => {
    const invalidRows = data.filter((row) =>
        expectedColumns.some((header) => !row[header] || row[header].toString().trim() === '')
    );

    if (invalidRows.length > 0) {
        setErrorMessage(`<strong>Existen celdas vacías en el archivo.</strong> <br>
          Por favor, completa todos los campos antes de enviarlo.`);
        setShowModalButton(true);
        return false;
    }

    setErrorMessage('');
    setShowModalButton(false);
    return true;
}

/// HANDLER FILE VALIDATIONS

export const validateFile = (file, setProgress) => {
    if (!file) {
        alert('Por favor seleccionar un archivo.');
        document.querySelector('input[type="file"]').value = '';
        setProgress(0);
        return false;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('Por favor, carga un archivo de formato Excel.');
        document.querySelector('input[type="file"]').value = '';
        setProgress(0);
        return false;
    }
    return true;
};

export const readWorkbook = (file, XLSX, onLoadCallback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        onLoadCallback(workbook);
    };
    reader.readAsArrayBuffer(file);
};