import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { parseDate } from '../utils/datesUtils';
import PopNotify from '../AnimationComp/PopNotify';

const URI = process.env.REACT_APP_API_URL_ITEMS;

const GeneralSearchComp = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Guarda el valor ingresado en el input
    const [results, setResults] = useState([]); // Guarda los datos de los items encontrados
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    // Estado para el ordenamiento
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' o 'desc'

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
    };

    // useEffect para hacer la búsqueda cuando cambia el valor del input
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
            let valA = a[column];
            let valB = b[column];

            // Ensure valA and valB are not null or undefined
            if (valA == null) valA = '';
            if (valB == null) valB = '';

            // Handle numeric values
            if (!isNaN(valA) && !isNaN(valB)) {
                return newOrder === 'asc' ? valA - valB : valB - valA;
            }

            // Convert non-string values to strings before using localeCompare
            return newOrder === 'asc'
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });

        setResults(sortedData);
    };


    return (
        <div className="container my-4">
            <h2 className="text-center mb-4 fw-bold">BÚSQUEDA GENERAL</h2>
            <h5 className="text-lg-start fw-bold">
                ¿Qué desea buscar?
            </h5>
            <h6 className="text-lg-start mb-3">
                Por ejemplo: <strong>descripción del bien</strong>, <strong>trabajador</strong> o <strong>dependencia</strong>
            </h6>
            <input
                type="text"
                placeholder="Ingrese término de búsqueda"
                value={searchTerm}
                onChange={handleInputChange}
                className="form-control mb-4 fw-bold"
                style={{ border: "1px solid black" }}
            />
            {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
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
                                <th onClick={() => handleSort('CODIGO_PATRIMONIAL')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                    Código Patrimonial {sortColumn === 'CODIGO_PATRIMONIAL' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('DESCRIPCION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                    Descripción del bien {sortColumn === 'DESCRIPCION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('TRABAJADOR')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                    Trabajador {sortColumn === 'TRABAJADOR' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('DEPENDENCIA')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                    Dependencia {sortColumn === 'DEPENDENCIA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('FECHA_REGISTRO')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                    Fecha Último Registro {sortColumn === 'FECHA_REGISTRO' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('ESTADO')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                    Estado {sortColumn === 'ESTADO' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSort('DISPOSICION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                    Disposición {sortColumn === 'DISPOSICION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
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
                searchTerm && <p className="text-center text-danger fw-bold">No se encontraron coincidencias con el término ingresado.</p>
            )}
        </div>
    );
};

export default GeneralSearchComp;
