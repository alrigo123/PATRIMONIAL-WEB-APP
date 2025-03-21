import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Importa SweetAlert2
import { formatToDatabase } from "../utils/datesUtils";

const URI_ITEMS = process.env.REACT_APP_API_URL_ITEMS

const AddItemComp = () => {

    const [conservacion, setConservacion] = useState([]); // Estado para almacenar las conservaciones
    const [loadingConservacion, setLoadingConservacion] = useState(true); // Estado para manejar la carga

    // Para navegar a otra página después del submit
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        codigoPatrimonial: "",
        descripcion: "",
        trabajador: "",
        dependencia: "",
        ubicacion: "",
        fechaAlta: "",
        fechaCompra: "",
        conservacion: 1,
        disposicion: true,
        situacion: false,
    });

    // Cargar conservacion al montar el componente
    useEffect(() => {
        const fetchConservacion = async () => {
            try {
                const response = await axios.get(`${URI_ITEMS}/conservation`);
                setConservacion(response.data); // Suponiendo que la respuesta es un array con las opciones
                setLoadingConservacion(false);
            } catch (err) {
                setLoadingConservacion(false);
                console.error("Error al cargar las conservaciones:", err);
            }
        };
        fetchConservacion();
    }, []);

    // Maneja el cambio del input swithc
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : name === "conservacion" ? parseInt(value, 10) : value
        });
    };

    /* FUNCTION TO SUBMIT (to DB) NEW ITEM */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir la recarga de la página
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage (or sessionStorage)
            // API consume
            const response = await axios.post(`${URI_ITEMS}/add`,
                {
                    ...formData,
                    DISPOSICION: formData.disposicion ? 1 : 0,
                    SITUACION: formData.situacion ? 1 : 0,
                    FECHA_COMPRA: formData.fechaCompra ? formatToDatabase(formData.fechaCompra).toString() : 'Sin Registro',
                    FECHA_ALTA: formData.fechaAlta ? formatToDatabase(formData.fechaAlta).toString() : 'Sin Registro',
                    CONSERV: formData.conservacion
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Ensure token is included
                    }
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: '¡Datos Agregados!',
                    text: 'Los datos se han agregado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/codigo-patrimonial');
                });
            }
        } catch (err) {
            Swal.fire({
                title: 'Error al intentar actualizar los datos.',
                text: 'El código patrimonial ingresado YA EXISTE en la base de datos',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            if (err.response) {
                // El servidor respondió con un código de error
                // alert(err.response.data.message || 'Error al agregar el item');
            } else if (err.request) {
                // No hubo respuesta del servidor
                alert('No se recibió respuesta del servidor');
            } else {
                // Error al configurar la solicitud
                alert('Error al enviar la solicitud');
            }
            console.error('Error:', err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm"  >
                <div className="card-header bg-primary text-white text-center">
                    <h3 className="mb-0">Agregar Bien Patrimonial</h3>
                </div>
                <div className="card-body">
                    <form method="post" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Código Patrimonial</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="codigoPatrimonial"
                                    placeholder="Ingrese solo 12 dígitos y que sean números"
                                    value={formData.codigoPatrimonial}
                                    onChange={handleChange}
                                    maxLength={12} // Limita el número de caracteres a 12
                                    pattern="\d*" // Asegura que solo se acepten números
                                    onInput={(e) => {
                                        // Evita la entrada de caracteres no numéricos
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                    style={{ border: "1px solid black" }}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Descripción</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="descripcion"
                                    placeholder="Ingrese descripción del bien a agregar"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    style={{ border: "1px solid black" }}
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
                                    name="trabajador"
                                    placeholder="Ingrese apellidos y nombres del trabajador"
                                    value={formData.trabajador}
                                    onChange={handleChange}
                                    style={{ border: "1px solid black" }}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Dependencia</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="dependencia"
                                    placeholder="Ingrese datos de la dependecia (SEDE) en la que se encuentra"
                                    value={formData.dependencia}
                                    onChange={handleChange}
                                    style={{ border: "1px solid black" }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Ubicación</label>
                                <input type="text" className="form-control" name="ubicacion"
                                    placeholder="Ingrese ubicación donde se encuentra el bien"
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    required
                                    style={{ border: "1px solid black" }}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Fecha Alta</label>
                                <input type="date" className="form-control" name="fechaAlta"
                                    value={formData.fechaAlta}
                                    onChange={handleChange}
                                    style={{ border: "1px solid black" }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Fecha Compra</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fechaCompra"
                                    value={formData.fechaCompra}
                                    onChange={handleChange}
                                    style={{ border: "1px solid black" }}
                                    required
                                />
                            </div>
                            {/* Estado de Conservación */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Estado de Conservación</label>
                                <select
                                    className="form-select"
                                    name="conservacion"
                                    value={formData.disposicion ? formData.conservacion : 4} // If "De Baja", set to 4 (INHABILITADO)
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.disposicion} // Disable if "De Baja"
                                    style={{ border: "1px solid black" }}
                                >
                                    <option value="" disabled>Seleccionar</option>
                                    {loadingConservacion ? (
                                        <option value="">Cargando...</option>
                                    ) : (
                                        conservacion.map(cal => (
                                            <option key={cal.id} value={cal.id}>
                                                {cal.CONSERV}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="container mt-3">
                            <div className="row justify-content-center">
                                <div className="col-md-3">
                                    {/* Disposición */}
                                    <div className="d-flex align-items-center p-2 border rounded bg-light mb-3 gap-3">
                                        <label className="fw-bold m-0">Disposición:</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className={`form-check-input custom-switch ${formData.disposicion ? "bg-success" : "bg-danger"}`}
                                                type="checkbox"
                                                id="disposicionSwitch"
                                                name="disposicion"
                                                checked={formData.disposicion}
                                                onChange={(e) => {
                                                    const isActive = e.target.checked ? 1 : 0;
                                                    setFormData({
                                                        ...formData,
                                                        disposicion: isActive,
                                                        conservacion: isActive ? 1 : 4, // Set "Bueno" (1) if active, "Inhabilitado" (4) if de baja
                                                    });
                                                }}
                                            />
                                            <label
                                                className={`form-check-label fw-bold ms-1 ${formData.disposicion ? "text-success" : "text-danger"}`}
                                                htmlFor="disposicionSwitch"
                                            >
                                                {formData.disposicion ? "Activo" : "De Baja"}
                                            </label>
                                        </div>
                                    </div>
                                    {/* Estado */}
                                    <div className="d-flex align-items-center p-2 border rounded bg-light gap-3">
                                        <label className="fw-bold m-0">Estado:</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input custom-switch disabled bg-danger"
                                                type="checkbox"
                                                id="estadoSwitch"
                                                name="ESTADO"
                                                disabled
                                            />
                                            <label className="form-check-label fw-bold ms-1 text-danger" htmlFor="estadoSwitch">
                                                No Registrado
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-success me-3">Agregar item</button>
                            <Link to="/codigo-patrimonial" className="btn btn-secondary">Regresar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItemComp;
