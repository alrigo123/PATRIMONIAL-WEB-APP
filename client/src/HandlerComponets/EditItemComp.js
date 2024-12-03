import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2'; // Importa SweetAlert2
import axios from 'axios';
import { APIgetItemById } from "../services/item.service";
import { formatToDateInput, formatToDatabase, parseDate } from "../utils/datesUtils";
const API_URL = process.env.REACT_APP_API_URL_ITEMS;

const EditItemComp = () => {

    const [conservacion, setConservacion] = useState([]);
    const [loadingConservacion, setLoadingConservacion] = useState(true);

    // Estados para los inputs editables
    const [formData, setFormData] = useState({
        CODIGO_PATRIMONIAL: '',
        TRABAJADOR: '',
        DEPENDENCIA: '',
        UBICACION: '',
        FECHA_REGISTRO: '',
        FECHA_ALTA: '',
        FECHA_COMPRA: '',
        ESTADO: '',
        DISPOSICION: '',
        SITUACION: '',
        CONSERV: ''
    });

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Para navegar a otra página después del submit
    const navigate = useNavigate();

    // Cargar conservacion al montar el componente
    useEffect(() => {
        const fetchConservacion = async () => {
            try {
                const response = await axios.get(`${API_URL}/conservation`);
                setConservacion(response.data); // Suponiendo que la respuesta es un array con las opciones
                setLoadingConservacion(false);
            } catch (err) {
                setLoadingConservacion(false);
                console.error("Error al cargar las calificaciones:", err);
            }
        };

        fetchConservacion();
    }, []);

    // Cargar datos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await APIgetItemById(id);
                setFormData({
                    CODIGO_PATRIMONIAL: data.CODIGO_PATRIMONIAL,
                    DESCRIPCION: data.DESCRIPCION || '',
                    TRABAJADOR: data.TRABAJADOR || '',
                    DEPENDENCIA: data.DEPENDENCIA || '',
                    UBICACION: data.UBICACION || '',
                    FECHA_REGISTRO: data.FECHA_REGISTRO,
                    FECHA_ALTA: data.FECHA_ALTA || '',
                    FECHA_COMPRA: data.FECHA_COMPRA || '',
                    ESTADO: data.ESTADO,
                    DISPOSICION: data.DISPOSICION,
                    SITUACION: data.SITUACION,
                    CONSERV: data.CONSERV || ''
                });
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'FECHA_COMPRA' || name === 'FECHA_ALTA') {
            // Convertir el valor a formato de base de datos antes de guardar
            const formattedValue = formatToDatabase(value);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue -- Prevenir el comportamiento por defecto del formulario
        try {
            // Convertir fechas al formato STRING antes de enviar (simulación de envío)
            const payload = {
                ...formData,
                FECHA_COMPRA: formData.FECHA_COMPRA ? formData.FECHA_COMPRA.toString() : 'Sin Registro',
                FECHA_ALTA: formData.FECHA_ALTA ? formData.FECHA_ALTA.toString() : 'Sin Registro',
            };
            console.log("Datos enviados a la base de datos:", payload);
            // throw Error
            const response = await axios.put(`${API_URL}/edit/${payload.CODIGO_PATRIMONIAL}`, payload);

            if (response.status === 200) {
                Swal.fire({
                    title: '¡Datos Actualizados!',
                    text: 'Los datos se han actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Después de que el usuario haga clic en "Aceptar", redirigir a otra página
                    navigate('/codigo-patrimonial');
                });
            } else {
                // alert('Error de API');
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al actualizar los datos.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al intentar actualizar los datos.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            if (err.response) {
                // El servidor respondió con un código de error
                alert(err.response.data.message || 'Error al actualizar el item');
            } else if (err.request) {
                // No hubo respuesta del servidor
                alert('No se recibió respuesta del servidor');
            } else {
                // Error al configurar la solicitud
                alert('Error al enviar la solicitud');
            }
            console.error('Error:', err);
            alert('Error:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white text-center">
                    <h3 className="mb-0">Editar Información de <strong>"{formData.DESCRIPCION}"</strong></h3>
                </div>
                <div className="card-body">
                    <form method="post" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Código Patrimonial</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.CODIGO_PATRIMONIAL}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Descripción</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="DESCRIPCION"
                                    value={formData.DESCRIPCION}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Trabajador</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="TRABAJADOR"
                                    value={formData.TRABAJADOR}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Dependencia</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="DEPENDENCIA"
                                    value={formData.DEPENDENCIA}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Ubicación</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="UBICACION"
                                    value={formData.UBICACION}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Fecha de Registro (Escaneo código de barras)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="FECHA_REGISTRO"
                                    value={formData.FECHA_REGISTRO ? parseDate(formData.FECHA_REGISTRO) : 'NO REGISTRADO'}
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Fecha Alta</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="FECHA_ALTA"
                                    value={formatToDateInput(formData.FECHA_ALTA) || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Fecha Compra</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="FECHA_COMPRA"
                                    value={formatToDateInput(formData.FECHA_COMPRA) || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Estado de Conservación</label>
                                <select
                                    className="form-select"
                                    name="CONSERV"
                                    value={formData.CONSERV || ''} // Asume que CALIFICACION puede ser null, por eso asignamos una cadena vacía si es null
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    {loadingConservacion ? (
                                        <option value="">Cargando...</option>
                                    ) : (
                                        conservacion.map(cal => (
                                            <option key={cal.id} value={cal.id}>
                                                {cal.CONSERV} {/* Suponiendo que cada objeto tiene `id` y `nombre` */}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="col-md-6 mt-3 text-center">
                                <div className="mb-3 text-center">
                                    <label htmlFor="estadoSwitch" className="form-label me-2 fw-bold">Estado:</label>
                                    <div className="form-check form-switch d-inline-flex align-items-center">
                                        <input
                                            className={`form-check-input ${formData.ESTADO === 1 ? 'bg-success' : 'bg-light'}`}
                                            type="checkbox"
                                            id="estadoSwitch"
                                            name="ESTADO"
                                            checked={formData.ESTADO === 1}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    ESTADO: e.target.checked ? 1 : 0,
                                                })
                                            }
                                            disabled
                                        />
                                        <label className="form-check-label fw-bolder ms-2" htmlFor="estadoSwitch">
                                            {formData.ESTADO === 1 ? 'Patrimonizado' : 'No Patrimonizado'}
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-3 text-center">
                                    <label htmlFor="disposicionSwitch" className="form-label me-2 fw-bold">Disposición:</label>
                                    <div className="form-check form-switch d-inline-flex align-items-center">
                                        <input
                                            className={`form-check-input ${formData.DISPOSICION === 1 ? 'bg-success' : 'bg-light'}`}
                                            type="checkbox"
                                            id="disposicionSwitch"
                                            name="DISPOSICION"
                                            checked={formData.DISPOSICION === 1}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    DISPOSICION: e.target.checked ? 1 : 0,
                                                })
                                            }
                                        />
                                        <label className="form-check-label fw-bolder ms-2" htmlFor="disposicionSwitch">
                                            {formData.DISPOSICION === 1 ? 'Funcional' : 'No Funcional'}
                                        </label>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <label htmlFor="situacionSwitch" className="form-label me-2 fw-bold">Situación:</label>
                                    <div className="form-check form-switch d-inline-flex align-items-center">
                                        <input
                                            className={`form-check-input ${formData.SITUACION === 1 ? 'bg-success' : 'bg-light'}`}
                                            type="checkbox"
                                            id="situacionSwitch"
                                            name="SITUACION"
                                            checked={formData.SITUACION === 1}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    SITUACION: e.target.checked ? 1 : 0,
                                                })
                                            }
                                        />
                                        <label className="form-check-label fw-bolder ms-2" htmlFor="situacionSwitch">
                                            {formData.SITUACION === 1 ? 'Verificado' : 'Faltante'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">

                        </div>
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-success me-3 fw-bold p-2">
                                Guardar Cambios
                            </button>
                            <Link to="/codigo-patrimonial" className="btn btn-secondary fw-bold p-2">
                                Regresar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditItemComp;
