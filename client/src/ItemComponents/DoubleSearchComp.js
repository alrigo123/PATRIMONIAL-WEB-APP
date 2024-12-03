import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const URI = process.env.REACT_APP_API_URL_ITEMS;

const DoubleSearchComp = () => {
    const [trabajador, setTrabajador] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    // useEffect para realizar la búsqueda cada vez que cambian trabajador o descripcion
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }
        debounceTimeout.current = setTimeout(() => {
            if (trabajador !== '' || descripcion !== '') {
                const fetchItems = async () => {
                    setIsLoading(true);
                    try {
                        // Realizamos la consulta a la API enviando trabajador y descripcion como parámetros
                        const response = await axios.get(`${URI}/filter`, {
                            params: { trabajador, descripcion },
                        });
                        setItems(response.data); // Guardamos los resultados en el estado
                    } catch (error) {
                        console.error('Error al obtener los ítems:', error);
                        setItems([]); // Limpiamos la lista en caso de error
                    } finally {
                        setIsLoading(false);
                    }
                }
                fetchItems();
            } else {
                setItems([]); // Limpiamos la lista si ambos campos están vacíos
            }
        }, 700)
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        }
    }, [trabajador, descripcion]);

    return (
        <div className="container my-4">
            <div className='row g-3'>
                <h2 className="text-center mb-4 fw-bold">FILTRAR POR TRABAJADOR E ITEM</h2>
                <div className='col-5'>
                    <input
                        type="text"
                        placeholder="Buscar por Trabajador"
                        value={trabajador}
                        onChange={(e) => setTrabajador(e.target.value)}
                        className="form-control mb-4 fw-bold"
                        style={{ marginBottom: '20px', padding: '10px' }}
                    />
                </div>
                <div className='col-5'>
                    <input
                        type="text"
                        placeholder="Buscar por Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="form-control mb-4 fw-bold"
                        style={{ marginBottom: '20px', padding: '10px' }}
                    />
                </div>
            </div>
            <div>
                {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Buscando...</span>
                        </div>
                    </div>
                ) : items.length > 0 ? (
                    <div>
                        <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CODIGO PATRIMONIAL</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRABAJADOR</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DESCRIPCION</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DEPENDENCIA</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ESTADO</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DISPOSICION</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>SITUACION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.CODIGO_PATRIMONIAL}</td>
                                        <td>{item.TRABAJADOR}</td>
                                        <td>{item.DESCRIPCION}</td>
                                        <td>{item.DEPENDENCIA}</td>
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
                    items && <p className="text-center text-danger ">No se encontraron items con los datos.</p>
                )}
            </div>
        </div>
    );
};

export default DoubleSearchComp;
