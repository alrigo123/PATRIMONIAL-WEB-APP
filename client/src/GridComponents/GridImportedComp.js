// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import Spreadsheet from 'react-spreadsheet';
// import axios from 'axios';
// import Swal from "sweetalert2"; // Importa SweetAlert2

// // Import components
// import ModalComp from './ModalComp';
// import ErrorModalComp from './ErrorModalComp';
// import TemplateExcelComp from './TemplateExcelComp';

// import {
//   validateDateColumns, validateEmptyCells,
//   validateHeaderColumns, validatePatrimonialCodes, validateFile,
//   readWorkbook
// } from '../utils/excelFileValidations.js'

// const URI_ITEMS = process.env.REACT_APP_API_URL_ITEMS

// const GridImportedComp = () => {
//   const [sheetsData, setSheetsData] = useState({});
//   const [currentSheet, setCurrentSheet] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showModalButton, setShowModalButton] = useState(false);
//   const [progress, setProgress] = useState(0); // Nueva barra de progreso
//   const [fileLoaded, setFileLoaded] = useState(false); // Estado para controlar el mensaje
//   const [loading, setLoading] = useState(false); // Estado para controlar la visibilidad de la barra y mensaje

//   const expectedColumns = ['CODIGO_PATRIMONIAL', 'DESCRIPCION', 'TRABAJADOR', 'DEPENDENCIA', 'UBICACION', 'FECHA_COMPRA', 'FECHA_ALTA'];

//   // Procesar y validar las hojas del archivo
//   const processSheets = (
//     workbook,
//     validateHeaderColumns,
//     validatePatrimonialCodes,
//     validateDateColumns,
//     setErrorMessage,
//     setShowModalButton
//   ) => {
//     const sheets = {};
//     let isValid = true;

//     workbook.SheetNames.forEach((sheetName) => {
//       const sheet = workbook.Sheets[sheetName];
//       const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//       if (
//         !validateHeaderColumns(sheetData, expectedColumns, setErrorMessage, setShowModalButton) ||
//         !validatePatrimonialCodes(sheetData, setErrorMessage, setShowModalButton) ||
//         !validateDateColumns(sheetData, setErrorMessage, setShowModalButton)
//       ) {
//         isValid = false;
//         return;
//       }

//       sheets[sheetName] = sheetData;
//     });

//     return { sheets, isValid };
//   };

//   // Actualizar el estado y manejar la barra de progreso
//   const updateStateAndProgress = (sheets, workbook, setSheetsData, setCurrentSheet, setProgress, setFileLoaded, setLoading) => {
//     setSheetsData(sheets);
//     setCurrentSheet(workbook.SheetNames[0]); // Por defecto, seleccionar la primera hoja
//     setProgress(100);

//     setFileLoaded(true);
//     setTimeout(() => {
//       setFileLoaded(false);
//       setLoading(false);
//     }, 2000); // Ocultar mensaje después de 2 segundos
//   };

//   // Función principal que maneja la carga del archivo
//   const handleFileUpload = (e) => {
//     setProgress(10); // Progreso inicial
//     setLoading(true); // Inicia la carga
//     const file = e.target.files[0];

//     // Validar el archivo seleccionado
//     if (!validateFile(file, setProgress)) {
//       setLoading(false);
//       return;
//     }

//     setProgress(30); // Avanzar el progreso tras la validación

//     // Leer el contenido del archivo
//     readWorkbook(file, XLSX, (workbook) => {
//       setProgress(50); // Actualización del progreso

//       // Procesar las hojas del archivo
//       const { sheets, isValid } = processSheets(
//         workbook,
//         validateHeaderColumns,
//         validatePatrimonialCodes,
//         validateDateColumns,
//         setErrorMessage,
//         setShowModalButton
//       );

//       if (!isValid) {
//         document.querySelector('input[type="file"]').value = ''; // Limpiar archivo cargado
//         setProgress(0);
//         setLoading(false);
//         return;
//       }

//       // Actualizar estado y progreso final
//       updateStateAndProgress(sheets, workbook, setSheetsData, setCurrentSheet, setProgress, setFileLoaded, setLoading);
//     });
//   };

//   // Validar durante edición directa en la grilla
//   const updateCellValue = (sheetName, rowIndex, colIndex, newValue) => {
//     setSheetsData((prevData) => {
//       const updatedData = { ...prevData }; // Crear una copia del estado actual
//       const sheet = updatedData[sheetName].map((row, rIndex) => {
//         if (rIndex === rowIndex) {
//           return row.map((cell, cIndex) => {
//             const columnName = updatedData[sheetName][0][cIndex]; // Nombre de la columna

//             // Validar CODIGO_PATRIMONIAL
//             if (columnName === 'CODIGO_PATRIMONIAL' && !/^\d{1,12}$/.test(newValue)) {
//               Swal.fire({
//                 title: 'Código inválido',
//                 text: 'El código debe contener solo números y tener máximo 12 dígitos.',
//                 icon: 'warning',
//                 confirmButtonText: 'Aceptar',
//               });
//               return cell; // No actualizar si es inválido
//             }

//             // Validar FECHA_COMPRA y FECHA_ALTA con formato más estricto
//             if (
//               (columnName === 'FECHA_COMPRA' || columnName === 'FECHA_ALTA') &&
//               !/^(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})$/.test(newValue) // Formatos permitidos: YYYY-MM-DD o DD/MM/YYYY
//             ) {
//               Swal.fire({
//                 title: 'Fecha inválida',
//                 text: 'La fecha debe tener un formato similar a YYYY-MM-DD o DD/MM/YYYY.',
//                 icon: 'warning',
//                 confirmButtonText: 'Aceptar',
//               });
//               return cell; // No actualizar si es inválido
//             }

//             return cIndex === colIndex ? newValue : cell; // Actualizar solo la celda específica
//           });
//         }
//         return row; // Devolver la fila intacta si no coincide
//       });
//       updatedData[sheetName] = sheet; // Actualizar la hoja específica
//       return updatedData; // Devolver los datos actualizados
//     });
//   };

//   const sendDataToDatabase = async () => {
//     const allData = Object.values(sheetsData).flatMap((sheetData) => {
//       const headers = sheetData[0]; // First row as headers
//       if (!headers) return []; // Skip if no headers
//       return sheetData
//         .slice(1) // Skip the header row
//         .filter((row) => row.some((cell) => cell && cell.toString().trim() !== '')) // Exclude empty rows
//         .map((row) =>
//           row.reduce((acc, cell, index) => {
//             acc[headers[index]] = cell || ''; // Map headers to cell values
//             return acc;
//           }, {})
//         );
//     });

//     // Validar celdas vacías
//     if (!validateEmptyCells(allData, expectedColumns, setErrorMessage, setShowModalButton)) {
//       return; // No proceder si hay celdas vacías
//     }

//     try {
//       // throw Error
//       console.log("DATA RESPONSE:", allData)

//       // Enviando los datos al backend via Axios
//       const response = await axios.post(`${URI_ITEMS}/imported`, { data: allData });

//       // Handling response from the backend
//       if (response.status === 200) {
//         Swal.fire({
//           title: '¡Datos Enviados!',
//           text: 'Los datos se enviaron correctamente a la base de datos.',
//           icon: 'success',
//           confirmButtonText: 'Aceptar'
//         })
//       } else {
//         alert('Error: ' + response.data.message);
//       }

//       console.log('Datos enviados:', JSON.stringify(allData));
//       setSheetsData({}); // Reset data after sending
//       document.querySelector('input[type="file"]').value = ''; // Clear the file input

//     } catch (error) {
//       Swal.fire({
//         title: 'Error al enviar los datos.',
//         text: 'Uno o más CODIGOS_PATRIMONIALES YA EXISTE en la base de datos',
//         icon: 'error',
//         confirmButtonText: 'Aceptar'
//       });
//       // alert(`Hubo un problema al . \nUno o más CODIGOS_PATRIMONIALES ya existen registrados en la base de datos.`);
//       // console.error("DATASHEET ERROR:", error.message);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <ModalComp />
//       <div className="mb-4">
//         <h3 className="text-primary fw-bold">Cargar Archivo Excel</h3>
//         <div className="text-secondary fw-bold">
//           Asegúrese de que el archivo coincida con el formato requerido.
//           <TemplateExcelComp />
//         </div>
//       </div>

//       <div className="d-flex justify-content-center mb-3">
//         <input
//           type="file"
//           onChange={handleFileUpload}
//           className="form-control"
//           style={{ maxWidth: '300px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}
//         />
//       </div>

//       {/* Barra de Progreso */}
//       {loading && progress > 0 && (
//         <div className="progress mb-3" style={{ height: '20px' }}>
//           <div
//             className="progress-bar progress-bar-striped bg-success"
//             role="progressbar"
//             style={{ width: `${progress}%` }}
//             aria-valuenow={progress}
//             aria-valuemin="0"
//             aria-valuemax="100"
//           >
//             {progress}%
//           </div>
//         </div>
//       )}

//       {/* Mensaje de archivo cargado */}
//       {fileLoaded && (
//         <div className="alert alert-success text-center" role="alert">
//           <strong>Archivo cargado con éxito!</strong>
//         </div>
//       )}

//       {errorMessage && (
//         <div
//           className="alert alert-danger text-center"
//           dangerouslySetInnerHTML={{ __html: errorMessage }}
//         ></div>
//       )}

//       {showModalButton && (
//         <div className="text-center mt-2">
//           <ErrorModalComp />
//         </div>
//       )}

//       {Object.keys(sheetsData).length > 0 && (
//         <div>
//           <ul className="nav nav-tabs">
//             {Object.keys(sheetsData).map((sheetName) => (
//               <li key={sheetName} className="nav-item">
//                 <button
//                   className={`nav-link ${currentSheet === sheetName ? 'active' : ''}`}
//                   onClick={() => setCurrentSheet(sheetName)}
//                 >
//                   {sheetName}
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <div className="mt-4">
//             <Spreadsheet
//               data={sheetsData[currentSheet]?.map((row, rowIndex) =>
//                 row.map((cell, colIndex) => ({
//                   value: cell || '',
//                   onChange: (e) => updateCellValue(currentSheet, rowIndex, colIndex, e.target.value),
//                 }))
//               ) || []}
//             />
//           </div>

//           <div className="text-center mt-1 mb-3">
//             <button
//               onClick={sendDataToDatabase}
//               className="btn btn-primary fw-bold"
//               style={{ maxWidth: '200px' }}
//             >
//               Guardar Datos
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GridImportedComp;

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Spreadsheet from 'react-spreadsheet';
import ModalComp from './ModalComp';
import ErrorModalComp from './ErrorModalComp';
import TemplateExcelComp from './TemplateExcelComp';

const GridImportedComp = () => {
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [showModalButton, setShowModalButton] = useState(false);

  // Definimos las columnas esperadas
  const expectedColumns = ['CODIGO_PATRIMONIAL', 'DESCRIPCION', 'TRABAJADOR', 'DEPENDENCIA', 'UBICACION', 'FECHA_COMPRA', 'FECHA_ALTA'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) { alert("Por favor seleccionar un archivo."); return; }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert("Por favor, carga un archivo de formato Excel.");
      return;
    } else {
      // alert("Se cargó archivo Excel. FAVOR DE COINCIDIR CAMPOS CORRECTOS DE LOS DATOS");
      console.log("SE CARGO EL ARCHIVO")
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Leer en formato matriz

      // Validar las columnas
      const uploadedColumns = sheetData[0]; // Primera fila = cabeceras
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
        setErrorMessage(error); // Se almacena el mensaje con formato HTML
        setShowModalButton(true);  // Mostrar el botón
        return;
      }

      // Si pasa la validación, mostramos los datos en la grilla
      const formattedData = sheetData.map((row) => row.map((cell) => ({ value: cell || '' })));
      setData(formattedData);
      setErrorMessage('');
      setShowModalButton(false);  // Ocultar el botón si las columnas son correctas

    };

    reader.readAsArrayBuffer(file);
  };

  const sendDataToDatabase = async () => {
    try {
      const jsonData = data.map((row) => row.map((cell) => cell.value)); // Convertir a JSON
      console.log("Datos enviados:", JSON.stringify(jsonData));
      // Código para enviar a la base de datos (simulación)
      // const response = await fetch('https://tuservidorapi.com/api/guardar-datos', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(jsonData),
      // });

      // if (!response.ok) {
      //   throw new Error('Error al enviar los datos');
      // }
      alert('Datos enviados correctamente');

      // Limpiar la grilla y el input
      setData([]); // Vaciar la grilla
      document.querySelector('input[type="file"]').value = ''; // Limpiar el input de archivo
    } catch (error) {
      alert('Hubo un problema al enviar los datos');
      console.error(error);
    }
  };

  return (
    <div className='container mt-4'>

      {/* Llamar componente Modal */}
      <ModalComp />



      {/* Contenido principal */}
      <div className="mb-4">
        <h3 className="text-primary fw-bold">Cargar Archivo Excel</h3>
        <div className="text-secondary fw-bold">
          Asegúrese de que el archivo coincida con el formato requerido.
          {/* Llamar componente para descargar plantilla excel */}
          <TemplateExcelComp />
        </div>
      </div>

      <div className="d-flex justify-content-center mb-3">
        <input
          type="file"
          onChange={handleFileUpload}
          className="form-control"
          style={{ maxWidth: '300px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}
        />
      </div>

      {/* Alerta de errores si no coincide el las columnas */}
      {errorMessage && (
        <div
          className="alert alert-danger text-center"
          dangerouslySetInnerHTML={{ __html: errorMessage }}
        >
        </div>
      )}

      {showModalButton && (
        <div className="text-center mt-2">
          <ErrorModalComp />
        </div>
      )}



      {/* Pintar datos de excel en grilla */}
      {data.length > 0 && (
        <div>
          <div className="mt-4">
            <Spreadsheet
              data={data}
              onChange={setData}
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                border: '1px solid #ddd',
              }}
            />
          </div>

          <div className="text-center mt-1 mb-3">
            <button
              onClick={sendDataToDatabase}
              className="btn btn-primary fw-bold"
              style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '5px' }}
            >
              Enviar archivo
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default GridImportedComp;
