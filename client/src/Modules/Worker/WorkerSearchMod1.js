import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL_ITEMS

const WorkerSearchMod1 = () => {
    const [searchTerm1, setSearchTerm1] = useState(''); // Valor del primer buscador
    const [results1, setResults1] = useState([]); // Resultados de la primera búsqueda
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    // Maneja el cambio en el primer input
    const handleInputChange1 = (e) => {
        setSearchTerm1(e.target.value);
    };

    // useEffect para la primera búsqueda
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (searchTerm1 !== '') {
                const fetchItems1 = async () => {
                    setIsLoading(true);
                    try {
                        const response = await axios.get(`${URL}/worker?q=${searchTerm1}`);
                        setResults1(response.data);
                    } catch (error) {
                        console.log('Error al obtener los items:', error);
                        setResults1([]);
                    } finally {
                        setIsLoading(false);
                    }
                }
                fetchItems1();
            } else {
                setResults1([])
            }
        }, 700)
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current)
            }
        }
    }, [searchTerm1]);

    const handleEdit = (item) => {
        if (!item.CODIGO_PATRIMONIAL) {
            console.error('El CODIGO_PATRIMONIAL está indefinido:', item);
            return; // Evita seguir si no hay un código válido
        }
        console.log("Editando CODIGO_PATRIMONIAL:", item.CODIGO_PATRIMONIAL, "CON DATOS:", item);
        // Lógica de edición
    };

    return (
        <div>
            {/* Primer buscador */}
            <h5 className='text-lg-start fw-bold'>BIENES CON CODIGO PATRIMONIAL DEL TRABAJADOR</h5>
            <input
                type="text"
                placeholder="Ingrese datos de trabajador (Apellidos y/o Nombres)"
                value={searchTerm1}
                onChange={handleInputChange1}
                className="form-control mb-3 fw-bold"
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
                    <h3 className='fw-semibold'>BIENES EN PODER DE <strong>{searchTerm1}</strong> </h3>
                    <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Código Patrimonial</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Descripción</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Trabajador</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Dependencia</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Compra</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado Conservación</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Situación</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACCION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results1.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.CODIGO_PATRIMONIAL}</td>
                                    <td>{item.DESCRIPCION}</td>
                                    <td>{item.TRABAJADOR}</td>
                                    <td>{item.DEPENDENCIA}</td>
                                    <td >{item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra'}</td>
                                    <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
                                    <td>
                                        {item.ESTADO === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}> No Patrimonizado</span>
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
                                    <td
                                        style={{
                                            fontWeight: 'bold',
                                            color:
                                                item.EST_CONSERVACION === "Bueno"
                                                    ? "blue"
                                                    : item.EST_CONSERVACION === "Malo"
                                                        ? "#790303"
                                                        : item.EST_CONSERVACION === "Regular"
                                                            ? "purple"
                                                            : "black", // Color por defecto
                                        }}
                                    >
                                        {item.EST_CONSERVACION}
                                    </td>
                                    <td>
                                        {item.SITUACION === 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>Faltante</span>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Verificado</span>
                                        )}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/edit/${item.CODIGO_PATRIMONIAL}`}
                                            onClick={() => handleEdit(item)}
                                            className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                                        >
                                            ✏️ Editar
                                        </Link>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                searchTerm1 && <p className="text-center text-danger ">No se encontraron bienes con los datos del trabajador.</p>
            )}
        </div>
    )
}

export default WorkerSearchMod1
