import * as XLSX from 'xlsx';

const expectedColumns = ['CODIGO_PATRIMONIAL', 'DESCRIPCION', 'TRABAJADOR', 'DEPENDENCIA', 'UBICACION', 'FECHA_COMPRA', 'FECHA_ALTA'];

export const formatDateForDB = (value) => {
  if (value instanceof Date) {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return value;
};

export const processSheets = (workbook, validateHeaderColumns, validatePatrimonialCodes, validateDateColumns, setErrorMessage, setShowModalButton) => {
  const sheets = {};
  let isValid = true;

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (
      !validateHeaderColumns(sheetData, expectedColumns, setErrorMessage, setShowModalButton) ||
      !validatePatrimonialCodes(sheetData, setErrorMessage, setShowModalButton) ||
      !validateDateColumns(sheetData, setErrorMessage, setShowModalButton)
    ) {
      isValid = false;
      return;
    }

    sheets[sheetName] = sheetData;
  });

  return { sheets, isValid };
};


export const updateStateAndProgress = (sheets, workbook, setSheetsData, setCurrentSheet, setProgress, setFileLoaded, setLoading) => {
  setSheetsData(sheets);
  setCurrentSheet(workbook.SheetNames[0]);
  setProgress(100);
  setFileLoaded(true);
  setTimeout(() => {
    setFileLoaded(false);
    setLoading(false);
  }, 1100);
};

export const updateCellValue = (setSheetsData, sheetName, rowIndex, colIndex, newValue) => {
  setSheetsData((prevData) => {
    if (!prevData[sheetName]) return prevData; // Ensure sheet exists

    return {
      ...prevData,
      [sheetName]: prevData[sheetName].map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) => (cIdx === colIndex ? newValue : cell))
          : row
      ),
    };
  });
};
