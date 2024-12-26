import axios from 'axios';
import { useState, useEffect } from 'react';
import { parseDate } from '../utils/datesUtils'
import PopNotify from '../AnimationComp/PopNotify';
import ExportReportsDispoMod from '../Modules/Export/ExportReportsDispoMod';
import ExportReportsStateMod from '../Modules/Export/ExportReportsStateMod';
import ExportReportsSituaMod from '../Modules/Export/ExportReportsSituaMod';
import ExportReportsMod from '../Modules/Export/ExportReportsMod';
import "../styles/ShowItem.css";

const URI = process.env.REACT_APP_API_URL_ITEMS;

const ShowItemsComp = () => {
    // State para almacenar los items
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0); // Total de registros
    const [page, setPage] = useState(1); // Página actual
    const [limit, setLimit] = useState(50); // Límite de registros por página

    // States para los filtros
    const [filterEstado, setFilterEstado] = useState('all');
    const [filterDisposicion, setFilterDisposicion] = useState('all');
    const [filterSituacion, setFilterSituacion] = useState('all');
    const [filterConservation, setfilterConservation] = useState('all');

    // Obtener todos los items de la API con paginación
    const getItems = async () => {
        try {
            const response = await axios.get(URI, {
                params: { page, limit },
            });
            setItems(response.data.items);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching items:', error.message);
        }
    };

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
        <div className="container">
            <div className='mt-3'>
                {/* Botones para exportar reportes */}
                {/* <ExportReportsStateMod />
                <ExportReportsDispoMod />
                <ExportReportsSituaMod /> */}
                <ExportReportsMod />
            </div>
            <hr />
            <div className="row mt-2">
                <div className="col mt-3">
                    {/* Controles para seleccionar los filtros */}
                    <div className="row mt-1">
                        <h5 className='fw-semibold'>FILTRADO</h5>
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h5 className='fw-semibold mt-2'>por Estado</h5>
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
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h5 className='fw-semibold mt-2 '>por Disposición</h5>
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
                        {/* <div className="mb-3 col-3 text-start">
                            <h5 className='fw-semibold mt-2 '>Filtrar por Situación</h5>
                            <select
                                id="filter3"
                                className="form-select fw-bolder"
                                value={filterSituacion}
                                onChange={(e) => setFilterSituacion(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="verified">Verificados</option>
                                <option value="missing">Faltantes</option>
                            </select>
                        </div> */}
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h5 className='fw-semibold mt-2 '>por Estado conservacion</h5>
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
                            </select>
                        </div>
                    </div>
                    <hr />
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
                        {/* TABLA DE DATOS */}
                        {/* <table className="w-auto table table-striped table-bordered align-middle mt-3"> */}

                        {/* Mostrar icono solo en dispositivos móviles */}
                        <PopNotify />

                        <table className="table table-striped table-bordered align-middle small">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>#</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Codigo Patrimonial</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Descripcion</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Dependencia</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Trabajador</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Ultima Fecha Registro</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Conservación</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Situación</th>
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
                                        <td>{parseDate(item.FECHA_REGISTRO)}</td>
                                        <td>{item.FECHA_ALTA}</td>
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

