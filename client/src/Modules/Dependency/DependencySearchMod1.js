import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL_ITEMS

const DependencySearchMod1 = () => {
    const [searchTerm1, setSearchTerm1] = useState(''); // Valor del primer buscador
    const [results1, setResults1] = useState([]); // Resultados de la primera búsqueda
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    // Maneja el cambio en el primer input
    const handleInputChange1 = (e) => {
        setSearchTerm1(e.target.value);
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }
        debounceTimeout.current = setTimeout(() => {
            if (searchTerm1 !== '') {
                const fetchItems1 = async () => {
                    setIsLoading(true);
                    try {
                        const response = await axios.get(`${URL}/dependency?q=${searchTerm1}`);
                        setResults1(response.data);
                    } catch (error) {
                        console.log('Error al obtener los items:', error);
                        setResults1([]);
                    } finally {
                        setIsLoading(false);
                    }
                }
                fetchItems1()
            } else {
                setResults1([]);
            }
        }, 700)
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        }
    }, [searchTerm1]);

    return (
        <div>
            {/* Primer buscador */}
            <h5 className='text-lg-start fw-bold'>ITEMS CON CODIGO PATRIMONIAL DE LA DEPENDENCIA</h5>
            <input
                type="text"
                placeholder="Ingrese dependencia"
                value={searchTerm1}
                onChange={handleInputChange1}
                className="form-control mb-4 fw-bold"
                style={{ marginBottom: '20px', padding: '10px' }}
            />

            {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Buscando...</span>
                    </div>
                </div>
            ) : results1.length > 0 ? (
                <div>
                    <h3 className='fw-semibold'>ITEMS EN DEPENDENCIA <strong>{searchTerm1}</strong> </h3>
                    <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACCION</th>

                            </tr>
                        </thead>
                        <tbody>
                            {results1.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td>{item.TRABAJADOR}</td>
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
                searchTerm1 && <p className="text-center text-danger">No se encontraron items con los datos de la dependencia.</p>
            )}
        </div>
    )
}

export default DependencySearchMod1
