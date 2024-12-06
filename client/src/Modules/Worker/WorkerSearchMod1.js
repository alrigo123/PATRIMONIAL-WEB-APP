// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { parseDate } from '../../utils/datesUtils';
// import { exportarItems } from '../../utils/exportReportBySearch';
// import { Modal, Button } from 'react-bootstrap'; // Usaremos react-bootstrap para el modal.

// const URL = process.env.REACT_APP_API_URL_ITEMS;

// const WorkerSearchMod1 = () => {
//     const [searchTerm1, setSearchTerm1] = useState(''); // Valor del primer buscador
//     const [results1, setResults1] = useState([]); // Resultados de la primera búsqueda
//     const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
//     const [selectedItem, setSelectedItem] = useState(null); // Para guardar el item seleccionado
//     const [modalVisible, setModalVisible] = useState(false); // Para controlar el modal
//     const [newObservation, setNewObservation] = useState(''); // Para el contenido del textarea
//     const debounceTimeout = useRef(null); // Referencia para el setTimeout

//     const fechaFormateada = new Date().toISOString().split("T")[0];

//     // Maneja el cambio en el primer input
//     const handleInputChange1 = (e) => {
//         setSearchTerm1(e.target.value);
//     };

//     // useEffect para la primera búsqueda
//     useEffect(() => {
//         if (debounceTimeout.current) {
//             clearTimeout(debounceTimeout.current);
//         }
//         debounceTimeout.current = setTimeout(() => {
//             if (searchTerm1 !== '') {
//                 const fetchItems1 = async () => {
//                     setIsLoading(true);
//                     try {
//                         const response = await axios.get(`${URL}/worker?q=${searchTerm1}`);
//                         setResults1(response.data);
//                     } catch (error) {
//                         console.log('Error al obtener los items:', error);
//                         setResults1([]);
//                     } finally {
//                         setIsLoading(false);
//                     }
//                 }
//                 fetchItems1();
//             } else {
//                 setResults1([]);
//             }
//         }, 700)
//         return () => {
//             if (debounceTimeout.current) {
//                 clearTimeout(debounceTimeout.current);
//             }
//         }
//     }, [searchTerm1]);

//     const handleEdit = (item) => {
//         if (!item.CODIGO_PATRIMONIAL) {
//             console.error('El CODIGO_PATRIMONIAL está indefinido:', item);
//             return; // Evita seguir si no hay un código válido
//         }
//         console.log("Editando CODIGO_PATRIMONIAL:", item.CODIGO_PATRIMONIAL, "CON DATOS:", item);
//     };

//     const exportPatrimonizado = () => {
//         exportarItems(results1, 1, "Bienes Trabajador", "Bienes_Patrimonizados", searchTerm1, fechaFormateada);
//     };

//     const exportNoPatrimonizado = () => {
//         exportarItems(results1, 0, "Bienes Trabajador", "Bienes_No_Patrimonizados", searchTerm1, fechaFormateada);
//     };

//     const exportConsolidado = () => {
//         exportarItems(results1, undefined, "Bienes Trabajador", "Bienes_Consolidado", searchTerm1, fechaFormateada);
//     };

//     const handleEditObservation = (item) => {
//         setSelectedItem(item);
//         setNewObservation(item.OBSERVACION || ''); // Prellenar con la observación actual
//         setModalVisible(true);
//     };

//     const saveObservation = async () => {
//         try {
//             // Llamada al endpoint con el código patrimonial
//             await axios.put(`${URL}/observation/${selectedItem.CODIGO_PATRIMONIAL}`, {
//                 observacion: newObservation,
//             });
//             // Actualizar la tabla con la nueva observación
//             setResults1((prev) =>
//                 prev.map((item) =>
//                     item.CODIGO_PATRIMONIAL === selectedItem.CODIGO_PATRIMONIAL
//                         ? { ...item, OBSERVACION: newObservation }
//                         : item
//                 )
//             );
//             setModalVisible(false); // Cerrar el modal
//         } catch (error) {
//             console.error('Error al guardar la observación:', error);
//         }
//     };

//     return (
//         <div>
//             {/* Primer buscador */}
//             <h5 className='text-lg-start fw-bold'>BIENES CON CODIGO PATRIMONIAL DEL TRABAJADOR</h5>
//             <input
//                 type="text"
//                 placeholder="Ingrese datos de trabajador (Apellidos y/o Nombres)"
//                 value={searchTerm1}
//                 onChange={handleInputChange1}
//                 className="form-control mb-3 fw-bold"
//                 style={{ marginBottom: '20px', padding: '10px' }}
//             />

//             {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
//             {isLoading ? (
//                 <div className="text-center">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Buscando...</span>
//                     </div>
//                 </div>
//             ) : results1.length > 0 ? (
//                 <div>
//                     <h3 className='fw-semibold'>BIENES EN PODER DE <strong>{searchTerm1}</strong> </h3>
//                     <div>
//                         {/* Botón para exportar Patrimonizado */}
//                         <button className="btn btn-success mb-3 me-2" onClick={exportPatrimonizado}>Exportar Patrimonizados</button>

//                         {/* Botón para exportar No Patrimonizado */}
//                         <button className="btn btn-success mb-3 me-2" onClick={exportNoPatrimonizado}>Exportar No Patrimonizados</button>

//                         {/* Botón para exportar todos los items (Consolidado) */}
//                         <button className="btn btn-success mb-3" onClick={exportConsolidado}>Exportar Consolidado</button>
//                     </div>
//                     <table className="w-auto table table-striped table-bordered align-middle" style={{ width: '100%', tableLayout: 'fixed' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Código Patrimonial</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Descripción</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Trabajador</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Dependencia</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Compra</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Ultimo Registro</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado Conservación</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Situación</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACCION</th>
//                                 <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Observación</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {results1.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.CODIGO_PATRIMONIAL}</td>
//                                     <td>{item.DESCRIPCION}</td>
//                                     <td>{item.TRABAJADOR}</td>
//                                     <td>{item.DEPENDENCIA}</td>
//                                     <td>{item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra'}</td>
//                                     <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
//                                     <td>{parseDate(item.FECHA_REGISTRO)}</td>
//                                     <td>
//                                         {item.ESTADO === 0 ? (
//                                             <span style={{ color: 'red', fontWeight: 'bold' }}> No Patrimonizado</span>
//                                         ) : (
//                                             <span style={{ color: 'green', fontWeight: 'bold' }}>Patrimonizado</span>
//                                         )}
//                                     </td>
//                                     <td>
//                                         {item.SITUACION === 0 ? (
//                                             <span style={{ color: 'red', fontWeight: 'bold' }}>Faltante</span>
//                                         ) : (
//                                             <span style={{ color: 'green', fontWeight: 'bold' }}>Verificado</span>
//                                         )}
//                                     </td>
//                                     <td>
//                                         {item.DISPOSICION === 0 ? (
//                                             <span style={{ color: 'red', fontWeight: 'bold' }}>No Funcional</span>
//                                         ) : (
//                                             <span style={{ color: 'green', fontWeight: 'bold' }}>Funcional</span>
//                                         )}
//                                     </td>
//                                     <td
//                                         style={{
//                                             fontWeight: 'bold',
//                                             color:
//                                                 item.EST_CONSERVACION === "Bueno"
//                                                     ? "blue"
//                                                     : item.EST_CONSERVACION === "Malo"
//                                                         ? "#790303"
//                                                         : item.EST_CONSERVACION === "Regular"
//                                                             ? "purple"
//                                                             : "black", // Color por defecto
//                                         }}
//                                     >
//                                         {item.EST_CONSERVACION}
//                                     </td>
//                                     <td>
//                                         <Link
//                                             to={`/edit/${item.CODIGO_PATRIMONIAL}`}
//                                             onClick={() => handleEdit(item)}
//                                             className="btn btn-primary bt-sm d-flex align-items-center gap-2"
//                                         >
//                                             ✏️ Editar
//                                         </Link>
//                                     </td>
//                                     <td>
//                                         <span
//                                             style={{
//                                                 fontWeight: item.OBSERVACION ? 'bold' : 'normal',
//                                                 fontStyle: item.OBSERVACION ? 'normal' : 'italic',
//                                                 color: item.OBSERVACION ? '#000' : '#666', // Opcional: color diferenciado
//                                             }}
//                                         >
//                                             {item.OBSERVACION ? item.OBSERVACION : 'Sin observación'}
//                                         </span>
//                                         <Button
//                                             variant="link"
//                                             size="sm"
//                                             className='fw-bold'
//                                             onClick={() => handleEditObservation(item)}
//                                         >
//                                             📝 Añadir Observación
//                                         </Button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 searchTerm1 && <p className="text-center text-danger">No se encontraron bienes con los datos del trabajador.</p>
//             )}

//             {/* Modal */}
//             <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Editar Observación</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <textarea
//                         className="form-control"
//                         rows={5}
//                         value={newObservation}
//                         onChange={(e) => setNewObservation(e.target.value)}
//                     />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setModalVisible(false)}>
//                         Cancelar
//                     </Button>
//                     <Button variant="primary" onClick={saveObservation}>
//                         Guardar
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default WorkerSearchMod1;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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

    const fechaFormateada = new Date().toISOString().split("T")[0];

    // States para los filtros
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterDisposicion, setFilterDisposicion] = useState('all');
    const [filterSituacion, setFilterSituacion] = useState('all');
    const [filterConservation, setfilterConservation] = useState('all');

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
                setResults1([]);
            }
        }, 700)
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        }
    }, [searchTerm1]);

    const handleEdit = (item) => {
        if (!item.CODIGO_PATRIMONIAL) {
            console.error('El CODIGO_PATRIMONIAL está indefinido:', item);
            return; // Evita seguir si no hay un código válido
        }
        console.log("Editando CODIGO_PATRIMONIAL:", item.CODIGO_PATRIMONIAL, "CON DATOS:", item);
    };

    const exportPatrimonizado = () => {
        exportarItems(results1, 1, "Bienes Trabajador", "Bienes_Patrimonizados", searchTerm1, fechaFormateada);
    };

    const exportNoPatrimonizado = () => {
        exportarItems(results1, 0, "Bienes Trabajador", "Bienes_No_Patrimonizados", searchTerm1, fechaFormateada);
    };

    const exportConsolidado = () => {
        exportarItems(results1, undefined, "Bienes Trabajador", "Bienes_Consolidado", searchTerm1, fechaFormateada);
    };

    const handleEditObservation = (item) => {
        setSelectedItem(item);
        setNewObservation(item.OBSERVACION || ''); // Prellenar con la observación actual
        setModalVisible(true);
    };

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
        const situacionFilter =
            filterSituacion === 'all' ||
            (filterSituacion === 'verified' && item.SITUACION === 1) ||
            (filterSituacion === 'missing' && item.SITUACION === 0);
        const conservationFilter =
            filterConservation === 'all' ||
            (filterConservation === 'good' && item.CONSERV === 1) ||
            (filterConservation === 'bad' && item.CONSERV === 2) ||
            (filterConservation === 'regular' && item.CONSERV === 3);
        return estadoFilter && disposicionFilter && situacionFilter && conservationFilter;
    });

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
                    <div>
                        {/* Botón para exportar Patrimonizado */}
                        <button className="btn btn-success mb-3 me-2" onClick={exportPatrimonizado}>Exportar Patrimonizados</button>

                        {/* Botón para exportar No Patrimonizado */}
                        <button className="btn btn-success mb-3 me-2" onClick={exportNoPatrimonizado}>Exportar No Patrimonizados</button>

                        {/* Botón para exportar todos los items (Consolidado) */}
                        <button className="btn btn-success mb-3" onClick={exportConsolidado}>Exportar Consolidado</button>
                    </div>
                    {/* Controles para seleccionar los filtros */}
                    <div className="row mt-2">
                        <div className="mb-3 col-3 text-start">
                            <h5 className='fw-semibold mt-2 '>Filtrar por Estado</h5>
                            <select
                                id="filter1"
                                className="form-select fw-bolder"
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="registered">Patrimonizado</option>
                                <option value="not_registered">No Patrimonizado</option>
                            </select>
                        </div>
                        <div className="mb-3 col-3 text-start">
                            <h5 className='fw-semibold mt-2 '>Filtrar por Disposición</h5>
                            <select
                                id="filter2"
                                className="form-select fw-bolder"
                                value={filterDisposicion}
                                onChange={(e) => setFilterDisposicion(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="available">Funcional</option>
                                <option value="not_available">No Funcional</option>
                            </select>
                        </div>
                        <div className="mb-3 col-3 text-start">
                            <h5 className='fw-semibold mt-2 '>Filtrar por Situación</h5>
                            <select
                                id="filter3"
                                className="form-select fw-bolder"
                                value={filterSituacion}
                                onChange={(e) => setFilterSituacion(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="verified">Verificado</option>
                                <option value="missing">Extraviado</option>
                            </select>
                        </div>
                        <div className="mb-3 col-3 text-start">
                            <h5 className='fw-semibold mt-2 '>Filtrar por Conservación</h5>
                            <select
                                id="filter4"
                                className="form-select fw-bolder"
                                value={filterConservation}
                                onChange={(e) => setfilterConservation(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="good">Buena</option>
                                <option value="bad">Mala</option>
                                <option value="regular">Regular</option>
                            </select>
                        </div>
                    </div>

                    {/* Renderiza la tabla de resultados filtrados */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-light">
                                <tr>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Observación</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.CODIGO_PATRIMONIAL}>
                                        <td>{item.CODIGO_PATRIMONIAL}</td>
                                        <td>{item.DESCRIPCION}</td>
                                        <td>{item.OBSERVACION || 'Sin observación'}</td>
                                        <td>
                                            <button className="btn btn-info" onClick={() => handleEditObservation(item)}>
                                                Editar Observación
                                            </button>
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
                                rows="4"
                                value={newObservation}
                                onChange={(e) => setNewObservation(e.target.value)}
                            ></textarea>
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
                <p>No se encontraron resultados</p>
            )}
        </div>
    );
};

export default WorkerSearchMod1;
