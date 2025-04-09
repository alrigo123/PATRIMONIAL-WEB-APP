import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModalComp from "../UserComponents/LoginModalComp"; // Asegúrate de importar el modal
import { jwtDecode } from "jwt-decode"; // Importa jwt-decode para verificar el token
import '../styles/Home.css'

const HomePageComp = () => {

    const [menuOpen, setMenuOpen] = useState(false); // Estado del menú
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado del modal de login
    const [redirectPath, setRedirectPath] = useState(""); // Ruta de redirección después del login

    const navigate = useNavigate();

    const closeMenu = () => {
        console.log(menuOpen)
        setMenuOpen(false); // Cierra el menú al seleccionar una opción
    };

    const checkTokenValidity = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decodifica el token
                // Verificar si el token ha expirado
                if (decoded.exp > Date.now() / 1000) {
                    return true; // El token es válido
                }
            } catch (error) {
                console.log('Token inválido', error);
            }
        }
        return false; // No hay token o el token ha expirado
    };

    const handleLoginClick = (e, path) => {
        e.preventDefault(); // Evita la navegación predeterminada
        if (checkTokenValidity()) {
            navigate(path); // Si el token es válido, redirige directamente
        } else {
            setRedirectPath(path); // Establece la ruta de redirección
            setIsLoginModalOpen(true); // Muestra el modal de login
        }
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false); // Cierra el modal de login
    };

    const handleLoginSuccess = () => {
        closeLoginModal(); // Cierra el modal
        if (redirectPath) {
            navigate(redirectPath); // Navega a la URL objetivo
        }
    };

    return (
        <div className="App">
            <header className="App-header text-center p-4">
                <h1 className="title fw-bolder fs-4 fs-md-3">
                    Control Patrimonial - Gerencia Regional de Agricultura Cusco
                </h1>
                <p className="description ">
                    Bienvenido al sistema de control patrimonial de la Gerencia Regional de Agricultura Cusco.
                    Este sistema ha sido diseñado para ofrecerte una herramienta accesible para
                    la gestión integral de los bienes y recursos de nuestra institución. A través de esta
                    plataforma, tendrás la posibilidad de visualizar de manera detallada todos los bienes
                    registrados, desde equipos hasta inmuebles, y realizar el registro patrimonial de nuevos
                    bienes de manera sencilla y organizada. Además, podrás llevar un control
                    sobre la ubicación, estado y utilización de los activos. Este sistema
                    es clave para asegurar el cumplimiento de las normativas de control patrimonial y
                    optimizar el uso de los bienes institucionales, promoviendo la transparencia y la
                    eficiencia en todos los procesos.
                </p>
                <div className="cta-container d-flex flex-column flex-md-row justify-content-center align-items-center mt-4">
                    <a className="btn btn-success fw-bold mb-2 mb-md-0 mx-md-2" href="/inventory/pdf">Guia del Aplicativo Web</a>
                    <a className="btn btn-success fw-bold mb-2 mb-md-0 mx-md-2" href="/inventory/items">Ver Bienes Registrados</a>
                    <Link
                        className="btn btn-success fw-bold mx-md-2"
                        onClick={(e) => {
                            handleLoginClick(e, "/codigo-patrimonial")
                            closeMenu();
                        }}
                        to="/codigo-patrimonial" // Esto es solo para mantener el formato de link
                    >
                        Registrar bien patrimonial
                    </Link>
                    {/* Modal de inicio de sesión */}
                    <LoginModalComp
                        show={isLoginModalOpen}
                        handleClose={closeLoginModal}
                        onLoginSuccess={handleLoginSuccess}
                    />
                </div>
            </header>
        </div>
    )
}

export default HomePageComp
