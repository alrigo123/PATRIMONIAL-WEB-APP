import axios from 'axios';
import { useState, useEffect } from 'react';
import { parseDate } from '../utils/datesUtils'
import PopNotify from '../AnimationComp/PopNotify';
import "../styles/ShowItem.css";

/* EXPORT TO EXCEL MODULES*/
// import ExportReportsDispoMod from '../Modules/Export/ExportReportsDispoMod';
// import ExportReportsStateMod from '../Modules/Export/ExportReportsStateMod';
// import ExportReportsSituaMod from '../Modules/Export/ExportReportsSituaMod';
import ExportReportsMod from '../Modules/Export/ExportReportsMod';

const URI = process.env.REACT_APP_API_URL_ITEMS;

const ShowItemsComp = () => {
    // State para almacenar los items
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0); // Total de registros
    const [page, setPage] = useState(1); // Página actual
    const [limit, setLimit] = useState(50); // Límite de registros por página

    // Estado para el ordenamiento
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' o 'desc'

    // States para los filtros
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterDisposicion, setFilterDisposicion] = useState('all');
    const [filterConservation, setfilterConservation] = useState('all');

    // Obtener todos los items de la API con paginación
    const getItems = async () => {
        try {
            const response = await axios.get(URI, { params: { page, limit } });
            setItems(response.data.items);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching items:', error.message);
        }
    };

    /* Executes getItems() whenever page or limit changes */
    useEffect(() => {
        getItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    // Filtrar items considerando ambos filtros
    const filteredItems = items.filter((item) => {
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
            (filterConservation === 'regular' && item.CONSERV === 3);
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

        const sortedData = [...items].sort((a, b) => {
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

        setItems(sortedData);
    };

    return (
        <div className="container">
            <div className='mt-3'>
                {/* Botones para exportar reportes */}
                {/* <ExportReportsStateMod />
                <ExportReportsDispoMod />
                <ExportReportsSituaMod /> */}
                <ExportReportsMod />
            </div>
            <hr className="border border-success border-1 opacity-100 mb-4" />
            <div className="row mt-2">
                <div className="col mt-3">
                    {/* Controles para seleccionar los filtros */}
                    <div className="row mt-1">
                        <h4 className='fw-bold'>FILTRADO</h4>
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
                            <h6 className='fw-semibold mt-2'>por Disposición</h6>
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
                            <h6 className='fw-semibold mt-2'>por Estado de conservación</h6>
                            <select
                                id="filter3"
                                className="form-select fw-bolder"
                                value={filterConservation}
                                onChange={(e) => setfilterConservation(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="good">Bueno</option>
                                <option value="regular">Regular</option>
                                <option value="bad">Malo</option>
                            </select>
                        </div>
                    </div>
                    <hr className="border border-success border-2 opacity-100 mb-4" />
                    {/* Selector de límite */}
                    <div className="d-flex align-items-center mb-3 flex-wrap">
                        <label className="me-2 fw-bold">Mostrar:</label>
                        <select
                            className="form-select w-auto me-3"
                            value={limit}
                            onChange={(e) => {
                                setLimit(parseInt(e.target.value));
                                setPage(1); // Resetear a la página 1
                            }}
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                            <option value={500}>500</option>
                        </select>
                        <span className="me-3">registros por página</span>
                    </div>
                    <div className="table-responsive mt-3">
                        <PopNotify />
                        <table className="table table-striped table-bordered align-middle small">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>#</th>
                                    <th onClick={() => handleSort('CODIGO_PATRIMONIAL')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Código Patrimonial {sortColumn === 'CODIGO_PATRIMONIAL' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('DESCRIPCION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Descripción del bien {sortColumn === 'DESCRIPCION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('DEPENDENCIA')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Dependencia {sortColumn === 'DEPENDENCIA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('TRABAJADOR')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Trabajador {sortColumn === 'TRABAJADOR' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('FECHA_REGISTRO')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Fecha Último Registro {sortColumn === 'FECHA_REGISTRO' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>                                    <th onClick={() => handleSort('ESTADO')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Estado {sortColumn === 'ESTADO' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('DISPOSICION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Disposición {sortColumn === 'DISPOSICION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('EST_CONSERVACION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Est. Conservación {sortColumn === 'EST_CONSERVACION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td> {/* Número iterativo */}
                                        <td>{item.CODIGO_PATRIMONIAL}</td>
                                        <td>{item.DESCRIPCION}</td>
                                        <td>{item.DEPENDENCIA}</td>
                                        <td>{item.TRABAJADOR}</td>
                                        <td className='fw-bold'>{parseDate(item.FECHA_REGISTRO) || 'Sin registro'}</td>
                                        <td>
                                            {item.ESTADO === 1 ? (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Registrado</span>
                                            ) : (
                                                <span style={{ color: 'red', fontWeight: 'bold' }}>No Registrado</span>
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
                                                                : "black", // Color para INHABILITADO
                                            }}
                                        >
                                            {item.EST_CONSERVACION}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Controles de paginación */}
                    <div className="d-flex justify-content-center align-items-center my-3">
                        <button
                            className="btn btn-primary fw-bold me-2"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            <i className="fas fa-arrow-left"></i> Anterior
                        </button>
                        <span className="mx-3">
                            <strong>Página {page}</strong> de <strong>{totalPages}</strong>
                        </span>
                        <button
                            className="btn btn-primary fw-bold ms-2"
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Siguiente <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowItemsComp;

