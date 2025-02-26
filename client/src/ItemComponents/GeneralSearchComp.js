import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PopNotify from '../AnimationComp/PopNotify';

const URI = process.env.REACT_APP_API_URL_ITEMS;

const GeneralSearchComp = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Guarda el valor ingresado en el input
    const [results, setResults] = useState([]); // Guarda los datos de los items encontrados
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    // Función que maneja el cambio en el input
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
    };

    // useEffect para hacer la búsqueda cuando cambia el valor del input
    useEffect(() => {
        // Cancelar la búsqueda anterior si el usuario sigue escribiendo
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        // Setear el debounce
        debounceTimeout.current = setTimeout(() => {
            if (searchTerm !== '') {  // Si hay algún valor en el input
                const fetchItems = async () => {
                    setIsLoading(true); // Iniciar la carga
                    try {
                        const response = await axios.get(`${URI}/search?q=${searchTerm}`);
                        setResults(response.data); // Actualiza el estado con los datos de los items
                    } catch (error) {
                        console.log('Error al obtener los items:', error);
                        setResults([]); // Reinicia el estado si hay un error
                    } finally {
                        setIsLoading(false); // Termina la carga
                    }
                };
                fetchItems();
            } else {
                setResults([]); // Si el input está vacío, limpia la vista
            }
        }, 700); // El retraso de 500ms antes de hacer la búsqueda
        // Limpiar el timeout cuando el componente se desmonte
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchTerm]); // Solo se vuelve a ejecutar si el searchTerm cambia

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4 fw-bold">BÚSQUEDA GENERAL</h2>
            <h5 className='text-lg-start fw-bold'>Ingrese término <strong>"bien"</strong> , <strong>"trabajador"</strong> o <strong>"dependencia"</strong></h5>
            <input
                type="text"
                placeholder="Ingrese término de búsqueda"
                value={searchTerm}
                onChange={handleInputChange}
                className="form-control mb-4 fw-bold"
                style={{ border: "1px solid black" }} // Agregando borde negro
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
                    {/* Mostrar icono solo en dispositivos móviles */}
                    <PopNotify />
                    <table className="table table-striped table-bordered align-middle small">
                        <thead className="table-dark">
                            <tr class="text-center align-middle align-content-center">
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Codigo Patrimonial</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Descripción</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Trabajador</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Dependencia</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Compra</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Situación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => (
                                <tr class="text-center align-middle align-content-center" key={index}>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
                                    <td >{item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra'}</td>
                                    <td>
                                        {item.ESTADO === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>No Patrimonizado</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Patrimonizado</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.DISPOSICION === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>No Funcional</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Funcional</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.SITUACION === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>Faltante</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Verificado</span>
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
