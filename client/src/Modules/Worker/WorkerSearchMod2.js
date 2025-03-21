import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import PopNotify from '../../AnimationComp/PopNotify';
const URL = process.env.REACT_APP_API_URL_ITEMS

const WorkerSearchMod2 = () => {
    const [searchTerm2, setSearchTerm2] = useState(''); // Valor del segundo buscador
    const [results2, setResults2] = useState([]); // Resultados de la segunda búsqueda
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    const fechaFormateada = new Date().toISOString().split("T")[0];

    // Maneja el cambio en el segundo input
    const handleInputChange2 = (e) => {
        setSearchTerm2(e.target.value);
    };

    // useEffect para la segunda búsqueda
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }
        debounceTimeout.current = setTimeout(() => {
            if (searchTerm2 !== '') {
                const fetchItems2 = async () => {
                    setIsLoading(true);
                    try {
                        const response = await axios.get(`${URL}/worker/qty?q=${searchTerm2}`);
                        setResults2(response.data);
                    } catch (error) {
                        console.log('Error al obtener los items:', error);
                        setResults2([]);
                    } finally {
                        setIsLoading(false);
                    }
                }
                fetchItems2();
            } else {
                setResults2([]);
            }
        }, 700)
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        }
    }, [searchTerm2]);

    // Función para exportar los datos a Excel
    const exportToExcel = () => {
        if (results2.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        // Preparar los datos para exportar
        const exportData = results2.map(item => ({
            "Descripción": item.DESCRIPCION,
            "Dependencia": item.DEPENDENCIA,
            "Trabajador": item.TRABAJADOR,
            "Cantidad de Bienes": item.CANTIDAD_ITEMS,
            "Bienes Registrados": item.CANTIDAD_PATRIMONIZADOS,
            "Bienes No Registrados": item.CANTIDAD_NO_PATRIMONIZADOS,
        }));

        // Crear un libro de Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bienes');

        // Descargar el archivo Excel
        XLSX.writeFile(workbook, `Bienes_Trabajador_${searchTerm2.toUpperCase()}_${fechaFormateada}.xlsx`);
    };

    return (
        <div>
            {/* Segundo buscador */}
            <h5 className='text-lg-start fw-bold'>CANTIDAD DE BIENES DEL TRABAJADOR</h5>
            <input
                type="text"
                placeholder="Ingrese datos de trabajador (Apellidos y Nombres)"
                value={searchTerm2}
                onChange={handleInputChange2}
                className="form-control mb-4 fw-bold"
                style={{ marginBottom: '20px', padding: '10px', border: "1px solid black" }}
            />
            {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Buscando...</span>
                    </div>
                </div>
            ) : results2.length > 0 ? (
                <div className="">
                    {/* <table className="w-auto table table-striped table-bordered align-middle mt-3"> */}
                    <h3 className='fw-semibold'>CANTIDAD DE BIENES EN PODER DE <strong>{searchTerm2.toUpperCase()}</strong> </h3>
                    <button
                        className="fw-bold p-2 btn btn-success mb-3 mt-2"
                        onClick={exportToExcel}
                    >
                        Exportar a Excel
                    </button>
                    <div className="table-responsive mt-2">
                        <PopNotify />
                        <table className="table table-striped table-bordered align-middle small">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CANTIDAD</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Bienes Registrados</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Bienes No Registrados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results2.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.DESCRIPCION}</td>
                                        <td>{item.DEPENDENCIA}</td>
                                        <td>{item.TRABAJADOR}</td>
                                        <td>{item.CANTIDAD_ITEMS}</td>
                                        <td>{item.CANTIDAD_PATRIMONIZADOS}</td>
                                        <td>{item.CANTIDAD_NO_PATRIMONIZADOS}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                searchTerm2 && <p className="text-center text-danger fw-bold">No se encontraron bienes con los datos del trabajador.</p>
            )}
        </div>
    )
}

export default WorkerSearchMod2;
