import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PopNotify from '../../AnimationComp/PopNotify';
import { parseDate } from '../../utils/datesUtils';
import { exportarItems } from '../../utils/exportReportBySearch';
import { Modal, Button } from 'react-bootstrap'; // Usamos react-bootstrap para el modal.

const URL = process.env.REACT_APP_API_URL_ITEMS;

const WorkerSearchMod1 = () => {
    const [searchTerm1, setSearchTerm1] = useState(''); // Valor del primer buscador
    const [results1, setResults1] = useState([]); // Resultados de la primera búsqueda
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const [selectedItem, setSelectedItem] = useState(null); // Para guardar el item seleccionado
    const [modalVisible, setModalVisible] = useState(false); // Para controlar el modal
    const [newObservation, setNewObservation] = useState(''); // Para el contenido del textarea
    const debounceTimeout = useRef(null); // Referencia para el setTimeout

    // Estado para el ordenamiento
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' o 'desc'

    // States para los filtros
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterDisposicion, setFilterDisposicion] = useState('all');
    const [filterConservation, setfilterConservation] = useState('all');

    const fechaFormateada = new Date().toISOString().split("T")[0];

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
                        const token = localStorage.getItem('token'); // Get token from localStorage (or sessionStorage)
                        const response = await axios.get(`${URL}/worker?q=${searchTerm1}`, {
                            headers: {
                                'Authorization': `Bearer ${token}` // Ensure token is included
                            }
                        });
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
                setResults1([]);
            }
        }, 700)
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        }
    }, [searchTerm1]);

    const exportPatrimonizado = () => {
        exportarItems(results1, 1, "Bienes Trabajador", "Bienes_Registrados", searchTerm1, fechaFormateada);
    };

    const exportNoPatrimonizado = () => {
        exportarItems(results1, 0, "Bienes Trabajador", "Bienes_No_Registrados", searchTerm1, fechaFormateada);
    };

    const exportConsolidado = () => {
        exportarItems(results1, undefined, "Bienes Trabajador", "Bienes_Consolidado", searchTerm1, fechaFormateada);
    };

    /* Function to Edit Observation state */
    const handleEditObservation = (item) => {
        setSelectedItem(item);
        setNewObservation(item.OBSERVACION || ''); // Prellenar con la observación actual
        setModalVisible(true);
    };

    // Función para guardar la nueva observación en la API y actualizar el  estado
    const saveObservation = async () => {
        try {
            // Llamada al endpoint con el código patrimonial
            await axios.put(`${URL}/observation/${selectedItem.CODIGO_PATRIMONIAL}`, {
                observacion: newObservation,
            });
            // Actualizar la tabla con la nueva observación
            setResults1((prev) =>
                prev.map((item) =>
                    item.CODIGO_PATRIMONIAL === selectedItem.CODIGO_PATRIMONIAL
                        ? { ...item, OBSERVACION: newObservation }
                        : item
                )
            );
            setModalVisible(false); // Cerrar el modal
        } catch (error) {
            console.error('Error al guardar la observación:', error);
        }
    };

    // Filtrar items considerando ambos filtros
    const filteredItems = results1.filter((item) => {
        const estadoFilter =
            filterEstado === 'all' ||
            (filterEstado === 'registered' && item.ESTADO === 1) ||
            (filterEstado === 'not_registered' && item.ESTADO === 0);
        const disposicionFilter =
            filterDisposicion === 'all' ||
            (filterDisposicion === 'available' && item.DISPOSICION === 1) ||
            (filterDisposicion === 'not_available' && item.DISPOSICION === 0);
        const conservationFilter =
            filterConservation === 'all' ||
            (filterConservation === 'good' && item.CONSERV === 1) ||
            (filterConservation === 'bad' && item.CONSERV === 2) ||
            (filterConservation === 'regular' && item.CONSERV === 3) ||
            (filterConservation === 'inha' && item.CONSERV === 4);
        return estadoFilter && disposicionFilter && conservationFilter;
    });

    // Función para ordenar la tabla al hacer clic en un encabezado
    const handleSort = (column) => {
        let newOrder = 'asc';
        if (sortColumn === column && sortOrder === 'asc') {
            newOrder = 'desc';
        }
        setSortColumn(column);
        setSortOrder(newOrder);

        const sortedData = [...results1].sort((a, b) => {
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

        setResults1(sortedData);
    };

    return (
        <div>
            {/* Primer buscador */}
            <h5 className='text-lg-start fw-bold'>BIENES DEL TRABAJADOR</h5>
            <input
                type="text"
                placeholder="Ingrese datos de trabajador (Apellidos y/o Nombres)"
                value={searchTerm1}
                onChange={handleInputChange1}
                className="form-control mb-3 fw-bold"
                style={{ marginBottom: '20px', padding: '10px', border: "1px solid black" }}
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
                    <h3 className='fw-semibold'>BIENES EN PODER DE <strong>{searchTerm1.toUpperCase()}</strong></h3>
                    <div className="row mt-2 g-2">
                        {/* Botón para exportar Patrimonizado */}
                        <div className="col-12 col-md-4">
                            <button
                                className="fw-bold p-2 btn btn-success w-100"
                                onClick={exportPatrimonizado}
                            >
                                Exportar Bienes Registrados
                            </button>
                        </div>
                        {/* Botón para exportar No Patrimonizado */}
                        <div className="col-12 col-md-4">
                            <button
                                className="fw-bold p-2 btn btn-success w-100"
                                onClick={exportNoPatrimonizado}
                            >
                                Exportar Bienes No Registrados
                            </button>
                        </div>
                        {/* Botón para exportar todos los items (Consolidado) */}
                        <div className="col-12 col-md-4">
                            <button
                                className="fw-bold p-2 btn btn-success w-100"
                                onClick={exportConsolidado}
                            >
                                Exportar Consolidado
                            </button>
                        </div>
                    </div>
                    {/* Controles para seleccionar los filtros */}
                    <div className="row mt-2">
                        <h4 className='fw-bold mt-4'>FILTRADO</h4>
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h6 className='fw-semibold mt-2'>por Estado</h6>
                            <select
                                id="filter1"
                                className="form-select fw-bolder"
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="registered">Registrado</option>
                                <option value="not_registered">No Registrado</option>
                            </select>
                        </div>
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h6 className='fw-semibold mt-2 '>por Disposición</h6>
                            <select
                                id="filter2"
                                className="form-select fw-bolder"
                                value={filterDisposicion}
                                onChange={(e) => setFilterDisposicion(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="available">Activo</option>
                                <option value="not_available">de Baja</option>
                            </select>
                        </div>
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h6 className='fw-semibold mt-2 '>por Conservación</h6>
                            <select
                                id="filter4"
                                className="form-select fw-bolder"
                                value={filterConservation}
                                onChange={(e) => setfilterConservation(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="good">Bueno</option>
                                <option value="regular">Regular</option>
                                <option value="bad">Malo</option>
                                <option value="inha">INHABILITADO</option>
                            </select>
                        </div>
                    </div>
                    {/* Renderiza la tabla de resultados filtrados */}
                    <div className="table-responsive mt-3">
                        {/* <table className="w-auto table table-striped table-bordered align-middle mt-3"> */}
                        <PopNotify />
                        <table className="table table-striped table-bordered align-middle small">
                            <thead className="table-dark">
                                <tr>
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
                                    <th onClick={() => handleSort('FECHA_COMPRA')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Fecha de Compra {sortColumn === 'FECHA_COMPRA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('FECHA_ALTA')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Fecha de Alta {sortColumn === 'FECHA_ALTA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
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
                                    <th onClick={() => handleSort('EST_CONSERVACION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Est. Conservación {sortColumn === 'EST_CONSERVACION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Acción</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Observación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.CODIGO_PATRIMONIAL}>
                                        <td>{item.CODIGO_PATRIMONIAL}</td>
                                        <td>{item.DESCRIPCION}</td>
                                        <td>{item.TRABAJADOR}</td>
                                        <td>{item.DEPENDENCIA}</td>
                                        <td>{item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra'}</td>
                                        <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
                                        <td className='fw-bold'>{parseDate(item.FECHA_REGISTRO) || "Sin Registro"}</td>
                                        <td>
                                            {item.ESTADO === 0 ? (
                                                <span style={{ color: 'red', fontWeight: 'bold' }}> No Registrado</span>
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
                                            <Link
                                                to={`/edit/${item.CODIGO_PATRIMONIAL}`}
                                                className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                                            >
                                                ✏️ Editar
                                            </Link>
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    fontWeight: item.OBSERVACION ? 'bold' : 'normal',
                                                    fontStyle: item.OBSERVACION ? 'normal' : 'italic',
                                                    color: item.OBSERVACION ? '#000' : '#666', // Opcional: color diferenciado
                                                }}
                                            >
                                                {item.OBSERVACION ? item.OBSERVACION : 'Sin observación'}
                                            </span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className='fw-bold'
                                                onClick={() => handleEditObservation(item)}
                                            >
                                                📝 Añadir Observación
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal de edición de observaciones */}
                    <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Observación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <textarea
                                className="form-control"
                                rows={5}
                                value={newObservation}
                                onChange={(e) => setNewObservation(e.target.value)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setModalVisible(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={saveObservation}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            ) : (
                searchTerm1 && <p className="text-center text-danger fw-bold">No se encontraron bienes con los datos del trabajador.</p>
            )}
        </div>
    );
};

export default WorkerSearchMod1;
