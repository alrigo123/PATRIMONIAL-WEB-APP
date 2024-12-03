import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Modal, Button, Form, FormControl, Alert } from "react-bootstrap";
import * as Rb from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from "sweetalert2"; // Importa SweetAlert2

const API_URL = process.env.REACT_APP_API_URL_USER;

// Esquema de validación con Yup
const validationSchema = Yup.object({
    user: Yup.string().required('Usuario es requerido'),
    name: Yup.string().required('Nombre es requerido'),
    last_name: Yup.string().required('Apellidos son requeridos'),
    email: Yup.string().email('Dirección de correo electronico invalido').required('Email es requerido'),
    password: Yup.string()
        .min(6, 'La contraseña debe contener al menos 6 caracteres')
        .required('Contraseña es requerida'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'La contraseñas deben coincidir')
        .required('Confirmar la contraseña es requerida'),
});

const RegisterWithPin = () => {
    const [pin, setPin] = useState(""); // Estado para el PIN
    const [pinAttempts, setPinAttempts] = useState(0); // Contador de intentos de PIN
    const [isPinValid, setIsPinValid] = useState(false); // Estado para controlar si el PIN es correcto
    const [isFormVisible, setIsFormVisible] = useState(false); // Estado para mostrar el formulario de registro

    const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error general
    const [passwordVisible, setPasswordVisible] = useState(false); // Estado para la visibilidad de la contraseña
    // Para navegar a otra página después del submit
    const navigate = useNavigate();

    // Función para manejar la validación del PIN
    const validatePin = () => {
        if (!pin.trim()) { // Verificar si el campo del PIN está vacío
            setErrorMessage("El PIN es obligatorio.");
            return;
        }
        if (pin === process.env.REACT_APP_SECURITY_PIN) {
            setIsPinValid(true);
            setIsFormVisible(true); // Mostrar el formulario de registro si el PIN es correcto
        } else {
            setPinAttempts(pinAttempts + 1);
            if (pinAttempts >= 2) {
                navigate("/"); // Si se fallaron 3 veces, redirigir al menú principal
            } else {
                setErrorMessage("PIN incorrecto. Intentos restantes: " + (3 - pinAttempts - 1));
                setPin('');
            }
        }
    };

    // Función para manejar el envío del formulario de validación del PIN
    const handlePinSubmit = (e) => {
        e.preventDefault(); // Prevenir la recarga de la página
        validatePin();
    };

    // Función que maneja el envío de los datos
    const handleSubmit = async (values) => {
        try {
            console.log("USUAARIO: ", {
                ...values,
                name: values.name.toUpperCase(),
                last_name: values.last_name.toUpperCase() // Extraemos el primer apellido
            })
            // throw Error
            const response = await axios.post(`${API_URL}/register`, {
                ...values,
                name: values.name.toUpperCase(),
                last_name: values.last_name.toUpperCase() // Extraemos el primer apellido
            });
            if (response.status === 201) {
                Swal.fire({
                    title: '¡Usuario Registrado!',
                    text: 'Se registro al usuario correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Después de que el usuario haga clic en "Aceptar", redirigir a otra página
                    navigate('/');
                });
            } else {
                throw new Error("Ocurrio un error inesperado: " + response.status)
            }

            console.log('User registered successfully:', response.data);
            // Aquí puedes hacer algo con la respuesta (como redirigir al usuario a login, etc.)
        } catch (error) {
            Swal.fire({
                title: 'El usuario y/o email ya existe!',
                text: error.message,
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            })
            console.error('Error registering user:', error.response.data);
        }
    };

    return (
        <>
            <Rb.Modal show={!isPinValid} onHide={() => navigate("/")}>
                <Rb.Modal.Header closeButton>
                    <Rb.Modal.Title className="fw-bold">Verificación de PIN</Rb.Modal.Title>
                </Rb.Modal.Header>
                <Rb.Modal.Body>
                    <Rb.Form onSubmit={handlePinSubmit}>
                        <Rb.Form.Group controlId="formPin">
                            <Rb.Form.Label>Ingresa el PIN de seguridad para registrar nuevo usuario</Rb.Form.Label>
                            <Rb.Form.Control
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="PIN de seguridad"
                                className="mb-2"
                                required
                            />
                        </Rb.Form.Group>

                        {errorMessage && <Rb.Alert className="fw-bold" variant="danger">{errorMessage}</Rb.Alert>}
                        <Rb.Button variant="primary" type="submit">
                            Validar PIN
                        </Rb.Button>
                    </Rb.Form>
                </Rb.Modal.Body>
            </Rb.Modal>
            {/* Si el PIN es válido, mostramos el formulario de registro */}
            {isFormVisible && (
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card p-4">
                                <h2 className="text-center fw-bold mb-4">Registrar Usuario</h2>
                                <Formik
                                    initialValues={{
                                        user: '',
                                        name: '',
                                        last_name: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: '',
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, errors, touched }) => (
                                        <Form>
                                            <div className="row mb-3">
                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="user" className="fw-bold mb-1">Nombre de Usuario</label>
                                                    <Field
                                                        type="text"
                                                        id="user"
                                                        name="user"
                                                        className="form-control"
                                                        placeholder="Ingrese nombre de usuario"
                                                    />
                                                    <ErrorMessage name="user" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="name" className="fw-bold mb-1">Nombre(s)</label>
                                                    <Field
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-control"
                                                        placeholder="Ingrese Nombre(s)"
                                                    />
                                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="last_name" className="fw-bold mb-1">Apellidos</label>
                                                    <Field
                                                        type="text"
                                                        id="last_name"
                                                        name="last_name"
                                                        className="form-control"
                                                        placeholder="Ingrese sus apellidos"
                                                    />
                                                    <ErrorMessage name="last_name" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="email" className="fw-bold mb-1">Correo Electrónico</label>
                                                    <Field
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Ingrese correo electronico"
                                                    />
                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6 form-group position-relative">
                                                    <label htmlFor="password" className="fw-bold mb-1">Contraseña</label>
                                                    <div className="mb-3">
                                                        <div className="input-group">
                                                            <Field
                                                                name="password"
                                                                type={passwordVisible ? "text" : "password"}
                                                                className="form-control"
                                                                placeholder="Contraseña"
                                                                required
                                                            />
                                                            <span
                                                                className="input-group-text"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                                            >
                                                                {passwordVisible ? "🔓" : "🔒"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                                </div>

                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="confirmPassword" className="fw-bold mb-1">Confirmar Contraseña</label>
                                                    <Field
                                                        type="password"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        placeholder="Confirme su contraseña"
                                                    />
                                                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                                </div>
                                            </div>

                                            <div className="form-group text-center">
                                                <button type="submit" className="btn btn-primary w-100">
                                                    Registrar
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterWithPin;
