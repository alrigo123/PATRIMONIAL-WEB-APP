import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { formatToDatabase } from "../utils/datesUtils";
import Swal from "sweetalert2"; // Importa SweetAlert2

const URI_ITEMS = process.env.REACT_APP_API_URL_ITEMS

const AddItemComp = () => {

    const [conservacion, setConservacion] = useState([]);
    const [loadingConservacion, setLoadingConservacion] = useState(true);

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
        conservacion: "",
        disposicion: false,
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

    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: type === "checkbox" ? checked : value
    //     });
    // };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : name === "conservacion" ? parseInt(value, 10) : value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Verifica los datos que se enviarán al backend
        console.log("Datos enviados al backend:", {
            ...formData,
            DISPOSICION: formData.disposicion ? 1 : 0, // Convertir booleano a 1/0
            SITUACION: formData.situacion ? 1 : 0,
            FECHA_COMPRA: formData.fechaCompra ? formatToDatabase(formData.fechaCompra).toString() : 'Sin Registro',
            FECHA_ALTA: formData.fechaAlta ? formatToDatabase(formData.fechaAlta).toString() : 'Sin Registro',
            CONSERV: formData.conservacion
        });
        // throw Error

        try {
            const response = await axios.post(
                `${URI_ITEMS}/add`,
                {
                    ...formData,
                    DISPOSICION: formData.disposicion ? 1 : 0, // Convertir booleano a 1/0
                    SITUACION: formData.situacion ? 1 : 0,
                    FECHA_COMPRA: formData.fechaCompra ? formatToDatabase(formData.fechaCompra).toString() : 'Sin Registro',
                    FECHA_ALTA: formData.fechaAlta ? formatToDatabase(formData.fechaAlta).toString() : 'Sin Registro',
                    CONSERV: formData.conservacion
                }
            );
            // alert(response.data.message);

            if (response.status === 200) {
                Swal.fire({
                    title: '¡Datos Agregados!',
                    text: 'Los datos se han agregado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Después de que el usuario haga clic en "Aceptar", redirigir a otra página
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
                // alert(err.response.data.message || 'Error al actualizar el item');
            } else if (err.request) {
                // No hubo respuesta del servidor
                alert('No se recibió respuesta del servidor');
            } else {
                // Error al configurar la solicitud
                alert('Error al enviar la solicitud');
            }
            console.error('Error:', err);
            // alert('Error:', err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
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
                                    required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Fecha Alta</label>
                                <input type="date" className="form-control" name="fechaAlta"
                                    value={formData.fechaAlta}
                                    onChange={handleChange}
                                    required />
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
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Estado de Conservación</label>
                                <select
                                    className="form-select"
                                    name="conservacion"
                                    value={formData.conservacion || ''}
                                    onChange={handleChange}
                                    required
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

                        <div className="col-md-6 mt-3">
                            <div className="mb-3 text-center">
                                <label
                                    htmlFor="disposicionSwitch"
                                    className="form-label me-2 fw-bold"
                                >
                                    Estado:
                                </label>
                                <div className="form-check form-switch d-inline-flex align-items-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="disposicionSwitch"
                                        name="DISPOSICION"
                                        value={0}
                                        checked={0}
                                        disabled
                                    />
                                    <label
                                        className="form-check-label fw-bolder ms-2"
                                        htmlFor="disposicionSwitch"
                                    >
                                        No Patrimonizado
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3 text-center">
                                <label
                                    htmlFor="situacionSwitch"
                                    className="form-label me-2 fw-bold"
                                >
                                    Situación:
                                </label>
                                <div className="form-check form-switch d-inline-flex align-items-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="situacionSwitch"
                                        name="situacion"
                                        checked={formData.situacion}
                                        onChange={handleChange}
                                        disabled />
                                    <label
                                        className="form-check-label fw-bolder ms-2"
                                        htmlFor="situacionSwitch"
                                    >
                                        {formData.situacion ? 'Verificado' : 'Faltante'}
                                        {/* {situacion ? "Verificado" : "Faltante"} */}
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3 text-center">
                                <label
                                    htmlFor="disposicionSwitch"
                                    className="form-label me-2 fw-bold"
                                >
                                    Disposición:
                                </label>
                                <div className="form-check form-switch d-inline-flex align-items-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="disposicionSwitch"
                                        name="disposicion"
                                        checked={formData.disposicion}
                                        onChange={handleChange}
                                    />
                                    <label
                                        className="form-check-label fw-bolder ms-2"
                                        htmlFor="disposicionSwitch"
                                    >
                                        {/* {disposicion ? "Funcional" : "No Funcional"} */}
                                        {formData.disposicion ? 'Funcional' : 'No Funcional'}
                                    </label>
                                </div>
                            </div>
                        </div>


                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-success me-3">
                                Agregar item
                            </button>
                            <Link to="/codigo-patrimonial" className="btn btn-secondary">
                                Regresar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItemComp;
