// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { parseDate } from '../utils/datesUtils'
// import PopNotify from '../AnimationComp/PopNotify';

// const URI = process.env.REACT_APP_API_URL_ITEMS;

// const GeneralSearchComp = () => {
//     const [searchTerm, setSearchTerm] = useState(''); // Guarda el valor ingresado en el input
//     const [results, setResults] = useState([]); // Guarda los datos de los items encontrados
//     const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
//     const debounceTimeout = useRef(null); // Referencia para el setTimeout

//     // Función que maneja el cambio en el input
//     const handleInputChange = (e) => {
//         setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
//     };

//     // useEffect para hacer la búsqueda cuando cambia el valor del input
//     useEffect(() => {
//         // Cancelar la búsqueda anterior si el usuario sigue escribiendo
//         if (debounceTimeout.current) {
//             clearTimeout(debounceTimeout.current);
//         }
//         // Setear el debounce
//         debounceTimeout.current = setTimeout(() => {
//             if (searchTerm !== '') {  // Si hay algún valor en el input
//                 const fetchItems = async () => {
//                     setIsLoading(true); // Iniciar la carga
//                     try {
//                         const response = await axios.get(`${URI}/search?q=${searchTerm}`);
//                         setResults(response.data); // Actualiza el estado con los datos de los items
//                     } catch (error) {
//                         console.log('Error al obtener los items:', error);
//                         setResults([]); // Reinicia el estado si hay un error
//                     } finally {
//                         setIsLoading(false); // Termina la carga
//                     }
//                 };
//                 fetchItems();
//             } else {
//                 setResults([]); // Si el input está vacío, limpia la vista
//             }
//         }, 700); // El retraso de 500ms antes de hacer la búsqueda
//         // Limpiar el timeout cuando el componente se desmonte
//         return () => {
//             if (debounceTimeout.current) {
//                 clearTimeout(debounceTimeout.current);
//             }
//         };
//     }, [searchTerm]); // Solo se vuelve a ejecutar si el searchTerm cambia

//     return (
//         <div className="container my-4">
//             <h2 className="text-center mb-4 fw-bold">BÚSQUEDA GENERAL</h2>
//             <h5 className="text-lg-start fw-bold">
//                 ¿Qué desea buscar?
//             </h5>
//             <h6 className="text-lg-start mb-3">
//                 Por ejemplo: <strong>descripción del bien</strong>, <strong>trabajador</strong> o <strong>dependencia</strong>
//             </h6>

//             <input
//                 type="text"
//                 placeholder="Ingrese término de búsqueda"
//                 value={searchTerm}
//                 onChange={handleInputChange}
//                 className="form-control mb-4 fw-bold"
//                 style={{ border: "1px solid black" }} // Agregando borde negro
//             />
//             {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
//             {isLoading ? (
//                 <div className="text-center">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Buscando...</span>
//                     </div>
//                 </div>
//             ) : results.length > 0 ? (
//                 <div className="table-responsive mt-3">
//                     {/* Mostrar icono solo en dispositivos móviles */}
//                     <PopNotify />
//                     <table className="table table-striped table-bordered align-middle small">
//                         <thead className="table-dark">
//                             <tr class="text-center align-middle align-content-center">
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>#</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Codigo Patrimonial</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Descripción del bien</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Trabajador</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Dependencia</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Ultimo Registro</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {results.map((item, index) => (
//                                 <tr class="text-center align-middle align-content-center" key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{item.CODIGO_PATRIMONIAL}</td>
//                                     <td>{item.DESCRIPCION}</td>
//                                     <td>{item.TRABAJADOR}</td>
//                                     <td>{item.DEPENDENCIA}</td>
//                                     <td className='fw-bold'>{parseDate(item.FECHA_REGISTRO) || 'Sin registro'}</td>
//                                     <td>
//                                         {item.ESTADO === 0 ? (
//                                             <span style={{ color: 'red', fontWeight: 'bold' }}>No Registrado</span>
//                                         ) : (
//                                             <span style={{ color: 'green', fontWeight: 'bold' }}>Registrado</span>
//                                         )}
//                                     </td>
//                                     <td>
//                                         {item.DISPOSICION === 0 ? (
//                                             <span style={{ color: 'red', fontWeight: 'bold' }}>de Baja</span>
//                                         ) : (
//                                             <span style={{ color: 'green', fontWeight: 'bold' }}>Activo</span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 searchTerm && <p className="text-center text-danger fw-bold">No se encontraron coincidencias con el término ingresado.</p>
//             )}
//         </div>
//     );
// };

// export default GeneralSearchComp;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { parseDate } from '../utils/datesUtils';
import PopNotify from '../AnimationComp/PopNotify';

const URI = process.env.REACT_APP_API_URL_ITEMS;

const GeneralSearchComp = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimeout = useRef(null);

    // Estado para el ordenamiento
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' o 'desc'

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (searchTerm !== '') {
                const fetchItems = async () => {
                    setIsLoading(true);
                    try {
                        const response = await axios.get(`${URI}/search?q=${searchTerm}`);
                        setResults(response.data);
                    } catch (error) {
                        console.log('Error al obtener los items:', error);
                        setResults([]);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchItems();
            } else {
                setResults([]);
            }
        }, 700);
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchTerm]);

    // Función para ordenar la tabla al hacer clic en un encabezado
    const handleSort = (column) => {
        let newOrder = 'asc';
        if (sortColumn === column && sortOrder === 'asc') {
            newOrder = 'desc';
        }
        setSortColumn(column);
        setSortOrder(newOrder);

        const sortedData = [...results].sort((a, b) => {
            const valA = a[column] || ''; // Evitar valores null
            const valB = b[column] || '';

            if (typeof valA === 'number' && typeof valB === 'number') {
                return newOrder === 'asc' ? valA - valB : valB - valA;
            } else {
                return newOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
        });

        setResults(sortedData);
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4 fw-bold">BÚSQUEDA GENERAL</h2>
            <input
                type="text"
                placeholder="Ingrese término de búsqueda"
                value={searchTerm}
                onChange={handleInputChange}
                className="form-control mb-4 fw-bold"
                style={{ border: "1px solid black" }}
            />

            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Buscando...</span>
                    </div>
                </div>
            ) : results.length > 0 ? (
                <div className="table-responsive mt-3">
                    <PopNotify />
                    <table className="table table-striped table-bordered align-middle small">
                        <thead className="table-dark">
                            <tr className="text-center align-middle">
                                <th onClick={() => handleSort('CODIGO_PATRIMONIAL')} style={{ cursor: 'pointer' }}>
                                    Código Patrimonial {sortColumn === 'CODIGO_PATRIMONIAL' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('DESCRIPCION')} style={{ cursor: 'pointer' }}>
                                    Descripción {sortColumn === 'DESCRIPCION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('TRABAJADOR')} style={{ cursor: 'pointer' }}>
                                    Trabajador {sortColumn === 'TRABAJADOR' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('DEPENDENCIA')} style={{ cursor: 'pointer' }}>
                                    Dependencia {sortColumn === 'DEPENDENCIA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('FECHA_REGISTRO')} style={{ cursor: 'pointer' }}>
                                    Fecha Último Registro {sortColumn === 'FECHA_REGISTRO' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th>Estado</th>
                                <th>Disposición</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => (
                                <tr className="text-center align-middle" key={index}>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td className='fw-bold'>{parseDate(item.FECHA_REGISTRO) || 'Sin registro'}</td>
                                    <td>
                                        {item.ESTADO === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>No Registrado</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Registrado</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.DISPOSICION === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>de Baja</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Activo</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                searchTerm && <p className="text-center text-danger fw-bold">No se encontraron coincidencias.</p>
            )}
        </div>
    );
};

export default GeneralSearchComp;
