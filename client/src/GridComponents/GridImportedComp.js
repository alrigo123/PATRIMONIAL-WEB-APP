// /** VERSIONNNN TO USE (EDIT AND SEND DATA TO DB -- MISSING VALIDATIONS & ALERTS [COMPARE WITH THE CODE BELOW]) */

// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import Spreadsheet from 'react-spreadsheet';
// import ModalComp from '../GridComponents/ModalComp';
// import ErrorModalComp from '../GridComponents/ErrorModalComp';
// import TemplateExcelComp from '../GridComponents/TemplateExcelComp';
// import axios from 'axios';
// import Swal from "sweetalert2"; // Importa SweetAlert2

// // Import functions to for component
// import {
//   validateDateColumns, validateEmptyCells,
//   validateHeaderColumns, validatePatrimonialCodes, validateFile,
//   readWorkbook
// } from '../utils/excelFileValidations.js'

// import { formatDateForDB, processSheets, updateStateAndProgress } from '../utils/gridComponentUtils.js';


// const URI_ITEMS = process.env.REACT_APP_API_URL_ITEMS


// const GridImportedComp = () => {
//   const [data, setData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showModalButton, setShowModalButton] = useState(false);

//   const [progress, setProgress] = useState(0); // Nueva barra de progreso
//   const [fileLoaded, setFileLoaded] = useState(false); // Estado para controlar el mensaje
//   const [loading, setLoading] = useState(false); // Estado para controlar la visibilidad de la barra y mensaje


//   // Definimos las columnas esperadas
//   const expectedColumns = ['CODIGO_PATRIMONIAL', 'DESCRIPCION', 'DEPENDENCIA', 'FECHA_ALTA', 'TRABAJADOR', 'UBICACION', 'FECHA_COMPRA'];

//   const handleFileUpload = (e) => {
//     setProgress(10);
//     setLoading(true);
//     const file = e.target.files[0];

//     if (!validateFile(file, setProgress)) {
//       setLoading(false);
//       return;
//     }

//     setProgress(30);

//     readWorkbook(file, XLSX, (workbook) => {
//       console.log("📂 Archivo leído:", workbook);
//       setProgress(50);

//       const result = processSheets(
//         workbook,
//         validateHeaderColumns,
//         validatePatrimonialCodes,
//         validateDateColumns,
//         setErrorMessage,
//         setShowModalButton
//       );

//       if (!result || !result.sheets) {
//         console.error("❌ Error: processSheets() no devolvió sheets correctamente.");
//         setProgress(0);
//         setLoading(false);
//         return;
//       }

//       const { sheets, isValid } = result;

//       console.log("📑 Hojas encontradas:", Object.keys(sheets)); // Ver todas las hojas

//       if (!isValid) {
//         console.warn("❌ Archivo inválido. Se limpiará el input.");
//         document.querySelector('input[type="file"]').value = ''; // Limpiar archivo cargado
//         setProgress(0);
//         setLoading(false);
//         return;
//       }

//       // 📌 Crear estructura para múltiples hojas
//       const formattedSheets = Object.keys(sheets).map(sheetName => ({
//         name: sheetName,
//         data: Array.isArray(sheets[sheetName])
//           ? sheets[sheetName].map(row =>
//             Array.isArray(row)
//               ? row.map(cell => ({ value: cell }))
//               : []
//           )
//           : []
//       }));


//       console.log("📊 Formato final antes de Spreadsheet:", JSON.stringify(formattedSheets, null, 2));
//       setData(formattedSheets);
//     });
//   };


//   // const sendDataToDatabase = async () => {
//   //   try {
//   //     const jsonData = data.map((row) => row.map((cell) => cell.value)); // Convertir a JSON
//   //     console.log("Datos enviados:", JSON.stringify(jsonData));

//   //     const dataDB = JSON.stringify(jsonData)

//   //     const response = await axios.post(`${URI_ITEMS}/imported`, { data: dataDB });
//   //     // const response = await axios.post(`${URI_ITEMS}/imported`, { data: allData });

//   //     // Handling response from the backend
//   //     if (response.status === 200) {
//   //       Swal.fire({
//   //         title: '¡Datos Enviados!',
//   //         text: 'Los datos se enviaron correctamente a la base de datos.',
//   //         icon: 'success',
//   //         confirmButtonText: 'Aceptar'
//   //       })
//   //     } else {
//   //       alert('Error: ' + response.data.message);
//   //     }
//   //     // Código para enviar a la base de datos (simulación)
//   //     // const response = await fetch('https://tuservidorapi.com/api/guardar-datos', {
//   //     //   method: 'POST',
//   //     //   headers: {
//   //     //     'Content-Type': 'application/json',
//   //     //   },
//   //     //   body: JSON.stringify(jsonData),
//   //     // });

//   //     // if (!response.ok) {
//   //     //   throw new Error('Error al enviar los datos');
//   //     // }
//   //     alert('Datos enviados correctamente');

//   //     // Limpiar la grilla y el input
//   //     setData([]); // Vaciar la grilla
//   //     document.querySelector('input[type="file"]').value = ''; // Limpiar el input de archivo
//   //   } catch (error) {
//   //     alert('Hubo un problema al enviar los datos');
//   //     console.error(error);
//   //   }
//   // };

//   const sendDataToDatabase = async () => {
//     try {
//       // Ensure data is an array of objects, not an array of arrays
//       const formattedData = data.map(row => ({
//         CODIGO_PATRIMONIAL: row[0]?.value || null,  // Adjust based on column index
//         DESCRIPCION: row[1]?.value || null,
//         TRABAJADOR: row[2]?.value || null,
//         DEPENDENCIA: row[3]?.value || null,
//         UBICACION: row[4]?.value || null,
//         FECHA_COMPRA: row[5]?.value || null,
//         FECHA_ALTA: row[6]?.value || null
//       }));

//       console.log("Datos enviados:", formattedData); // Debugging
// throw Error
//       const response = await axios.post(`${URI_ITEMS}/imported`, { data: formattedData });

//       if (response.status === 200) {
//         Swal.fire({
//           title: '¡Datos Enviados!',
//           text: 'Los datos se enviaron correctamente a la base de datos.',
//           icon: 'success',
//           confirmButtonText: 'Aceptar'
//         });
//       } else {
//         alert('Error: ' + response.data.message);
//       }

//       // Clear grid and input
//       setData([]);
//       document.querySelector('input[type="file"]').value = '';

//     } catch (error) {
//       alert('Hubo un problema al enviar los datos');
//       console.error(error);
//     }
//   };




//   return (
//     <div className='container mt-4'>

//       {/* Llamar componente Modal */}
//       <ModalComp />



//       {/* Contenido principal */}
//       <div className="mb-4">
//         <h3 className="text-primary fw-bold">Cargar Archivo Excel</h3>
//         <div className="text-secondary fw-bold">
//           Asegúrese de que el archivo coincida con el formato requerido.
//           {/* Llamar componente para descargar plantilla excel */}
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

//       {/* Alerta de errores si no coincide el las columnas */}
//       {errorMessage && (
//         <div
//           className="alert alert-danger text-center"
//           dangerouslySetInnerHTML={{ __html: errorMessage }}
//         >
//         </div>
//       )}

//       {showModalButton && (
//         <div className="text-center mt-2">
//           <ErrorModalComp />
//         </div>
//       )}



//       {/* Pintar datos de excel en grilla */}
//       {/* {data.length > 0 && (
//         <div>
//           <div className="mt-4">
//             <Spreadsheet
//               data={data}
//               onChange={setData}
//               style={{
//                 fontFamily: 'Arial, sans-serif',
//                 fontSize: '14px',
//                 border: '1px solid #ddd',
//               }}
//             />
//           </div>

//           <div className="text-center mt-1 mb-3">
//             <button
//               onClick={sendDataToDatabase}
//               className="btn btn-primary fw-bold"
//               style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '5px' }}
//             >
//               Enviar archivo
//             </button>
//           </div>
//         </div>
//       )} */}

//       {data.map((sheet, index) => (
//         <div key={index}>
//           <h3>{sheet.name}</h3>
//           {sheet.data.length > 0 ? (
//             <>
//               <Spreadsheet data={sheet.data} />
//               <button
//                 onClick={sendDataToDatabase}
//                 className="btn btn-primary fw-bold"
//                 style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '5px' }}
//               >
//                 Enviar archivo
//               </button>
//             </>

//           ) : (
//             <p>No hay datos en esta hoja.</p>
//           )}
//         </div>
//       ))}

//     </div>
//   );
// }

// export default GridImportedComp;


import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Spreadsheet } from "react-spreadsheet";
import axios from "axios";
const URI_ITEMS = process.env.REACT_APP_API_URL_ITEMS

const REQUIRED_COLUMNS = [
  "CODIGO_PATRIMONIAL",
  "DESCRIPCION",
  "TRABAJADOR",
  "DEPENDENCIA",
  "UBICACION",
  "FECHA_COMPRA",
  "FECHA_ALTA"
];

const isValidDate = (dateString) => {
  const dateFormats = [
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/
  ];
  return dateFormats.some((regex) => regex.test(dateString));
};

const isValidCode = (code) => /^\d{12}$/.test(code);

const UploadExcel = () => {
  const [data, setData] = useState([]);
  const [sheets, setSheets] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetNames = workbook.SheetNames;
      setSheets(sheetNames);

      if (sheetNames.length > 0) {
        const firstSheet = sheetNames[0]; // Selecciona la primera hoja por defecto
        setSelectedSheet(firstSheet);
        updateSheetData(workbook, firstSheet);
      }
    };
    reader.readAsBinaryString(file);
  };

  const updateSheetData = (workbook, sheetName) => {
    if (!workbook.Sheets[sheetName]) return; // 🔹 Si la hoja no existe, salimos

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) || [];

    // Convertimos a formato que acepta react-spreadsheet
    const formattedData = jsonData.map((row) =>
      row.map((cell) => ({ value: cell || "" })) // 🔹 Evitamos valores null
    );

    setData(formattedData);
  };




  const processSheet = (workbook, sheetName) => {
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    if (worksheet.length === 0) return;

    const headers = worksheet[0];
    if (JSON.stringify(headers) !== JSON.stringify(REQUIRED_COLUMNS)) {
      alert("Error: El archivo no contiene las columnas requeridas");
      return;
    }

    const formattedData = worksheet.slice(1).map((row) => {
      return row.map((cell, index) => {
        if (REQUIRED_COLUMNS[index] === "CODIGO_PATRIMONIAL" && !isValidCode(cell)) {
          return { value: cell, error: "Código inválido" };
        }
        if (["FECHA_ALTA", "FECHA_COMPRA"].includes(REQUIRED_COLUMNS[index]) && !isValidDate(cell)) {
          return { value: cell, error: "Formato de fecha inválido" };
        }
        return { value: cell };
      });
    });

    setData(formattedData);
  };

  const handleSheetChange = (e) => {
    const newSheet = e.target.value;
    if (!newSheet) return; // 🔹 Si no hay hoja seleccionada, salimos

    setSelectedSheet(newSheet);

    const file = document.querySelector('input[type="file"]').files[0];
    if (!file) return; // 🔹 Verifica que el archivo aún esté disponible

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      if (!workbook.Sheets[newSheet]) return; // 🔹 Verifica que la hoja existe
      updateSheetData(workbook, newSheet);
    };

    reader.readAsBinaryString(file);
  };


  const handleSendToAPI = async () => {
    if (data.some(row => row.some(cell => !cell.value))) {
      alert("Error: Existen celdas vacías");
      return;
    }

    const formattedData = data.map(row => row.map(cell => cell.value));
    try {
      // await axios.post("http://localhost:3000/api/upload", { data: formattedData });
      const response = await axios.post(`${URI_ITEMS}/imported`, { data: formattedData });

      console.log(response)

      alert("Datos enviados con éxito");
    } catch (error) {
      alert("Error al enviar los datos");
      console.log("ALGO")
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {sheets && sheets.length > 0 && (
        <select onChange={handleSheetChange} value={selectedSheet}>
          {sheets.map((sheet, index) => (
            <option key={index} value={sheet}>{sheet}</option>
          ))}
        </select>
      )}

      {data.length > 0 && <Spreadsheet data={data} onChange={setData} />}
      {/* <Button onClick={handleSendToAPI}>Enviar a la API</Button> */}

      <button
        onClick={handleSendToAPI}
        className="btn btn-primary fw-bold"
        style={{ maxWidth: '200px' }}
      >
        Guardar Datos
      </button>


    </div >
  );
};

export default UploadExcel;
